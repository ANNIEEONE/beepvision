"""
Main Edge Pipeline Orchestrator for BeepVision
Maintains 30 FPS deterministic closed-loop execution.
"""

import time
from typing import List, Optional
from .ai.hailo_yolo import HailoYOLOv8Inference
from .config import SensorConfig
from .engine.alert_engine import AlertUrgencyEngine
from .engine.audio_feedback import AudioFeedbackEngine
from .engine.haptic_controller import HapticMatrixController
from .processing.pitch_compensator import TorsoPitchCompensator
from .processing.ransac_ground import RANSACGroundPlaneEstimator
from .processing.sensor_fusion import SensorFusionTracker
from .sensors.imu_mpu6050 import MPU6050IMU
from .sensors.tfluna_lidar import TFLunaLiDAR
from .sensors.ultrasonic_array import UltrasonicArray
from .types import BoundingBox, Point3D, SystemTelemetry


class BeepVisionPipeline:
    """
    Core On-Device Perception and Alert Pipeline.
    Targets <15ms end-to-end latency budget on Raspberry Pi 5 + Hailo-8 AI HAT.
    """

    def __init__(self, simulated: bool = True, enable_audio: bool = False):
        self.simulated = simulated
        self.frame_index = 0
        
        # Subsystems
        self.lidar = TFLunaLiDAR(simulated=simulated)
        self.ultrasonic = UltrasonicArray(simulated=simulated)
        self.imu = MPU6050IMU(simulated=simulated)
        self.ai = HailoYOLOv8Inference()
        
        self.pitch_compensator = TorsoPitchCompensator(mount_height_m=SensorConfig.WEARABLE_MOUNT_HEIGHT_M)
        self.ransac_ground = RANSACGroundPlaneEstimator()
        self.tracker = SensorFusionTracker()
        self.alert_engine = AlertUrgencyEngine()
        self.haptics = HapticMatrixController(simulated=simulated)
        self.audio = AudioFeedbackEngine(enable_audio_output=enable_audio)

    def initialize(self) -> bool:
        """Initializes all hardware peripherals and inference models."""
        s_lidar = self.lidar.initialize()
        s_ultra = self.ultrasonic.initialize()
        s_imu = self.imu.initialize()
        s_ai = self.ai.initialize()
        return all([s_lidar, s_ultra, s_imu, s_ai])

    def step(self, vision_detections: Optional[List[BoundingBox]] = None) -> SystemTelemetry:
        """
        Executes a single perception-to-action cycle:
        Sense -> Compensate -> Detect -> Fuse -> Prioritize -> Actuate
        """
        t_start = time.perf_counter()
        now = time.time()
        self.frame_index += 1

        # 1. Sensory Ingestion
        lidar_data = self.lidar.read()
        ultra_data = self.ultrasonic.read()
        imu_data = self.imu.read()

        # 2. Torso Pitch Dynamic Compensation
        # Correct central LiDAR ray based on user tilt
        pt_body = Point3D(x=0.0, y=lidar_data.distance_m if lidar_data.valid else 0.0, z=0.0)
        pt_world = self.pitch_compensator.transform_point(pt_body, imu_data.pitch_deg, imu_data.roll_deg)

        # 3. Ground Plane Classification
        # Check if LiDAR is bouncing off flat walking pavement
        is_pavement = self.pitch_compensator.is_ground_intersection(pt_world, ground_plane_z=0.0)

        # If LiDAR is pointing into the ground due to torso forward lean, invalidate it for obstacle alerts
        effective_lidar = lidar_data
        if is_pavement and imu_data.pitch_deg > 6.0:
            # User is leaning forward; beam is hitting the street ahead
            effective_lidar.valid = False

        # 4. Hailo-8 YOLOv8 Object Detection
        detections = vision_detections if vision_detections is not None else self.ai.infer()

        # 5. Multi-Modal Sensor Fusion & Kalman Tracking
        tracked_obstacles = self.tracker.process_frame(
            lidar=effective_lidar,
            ultrasonic=ultra_data,
            vision_detections=detections,
            timestamp=now
        )

        # 6. Alert Urgency Engine & Hazard Suppression
        all_obstacles, primary_threat, audio_cue, haptic_cmd = self.alert_engine.evaluate(tracked_obstacles)

        # 7. Actuate Physical Feedback
        self.haptics.dispatch(haptic_cmd)
        self.audio.play_cue(audio_cue)

        # 8. Measure Latency
        elapsed_ms = (time.perf_counter() - t_start) * 1000.0

        return SystemTelemetry(
            timestamp=now,
            frame_index=self.frame_index,
            pipeline_latency_ms=round(elapsed_ms, 2),
            tracked_obstacles=all_obstacles,
            primary_threat=primary_threat,
            audio_cue=audio_cue,
            haptic_command=haptic_cmd,
            imu_pitch_deg=imu_data.pitch_deg,
            ground_plane_height_m=0.0,
            npu_active=self.ai.is_hardware_available
        )

    def close(self):
        self.lidar.close()
        self.ultrasonic.close()
        self.imu.close()
        self.ai.close()

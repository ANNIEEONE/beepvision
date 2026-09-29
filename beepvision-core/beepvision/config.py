"""
BeepVision System Configuration Parameters
Calibrated against physical sensor limits and human cognitive reaction times.
"""

from dataclasses import dataclass


@dataclass(frozen=True)
class SensorConfig:
    # Physical Mounting Geometry
    WEARABLE_MOUNT_HEIGHT_M: float = 1.35   # Standard adult sternum height
    CAMERA_TILT_OFFSET_DEG: float = 0.0     # Fixed mechanical camera offset angle
    
    # TF-Luna LiDAR Specs
    LIDAR_MIN_RANGE_M: float = 0.20
    LIDAR_MAX_RANGE_M: float = 12.00
    LIDAR_SAMPLE_RATE_HZ: int = 100
    LIDAR_SIGNAL_STRENGTH_MIN: int = 100    # Below 100 indicates low confidence / scatter
    
    # HC-SR04 Ultrasonic Array Specs
    ULTRASONIC_MIN_RANGE_M: float = 0.02
    ULTRASONIC_MAX_RANGE_M: float = 4.00
    ULTRASONIC_CONE_ANGLE_DEG: float = 15.0
    
    # Camera Specs (Sony IMX708)
    CAMERA_HFOV_DEG: float = 120.0
    CAMERA_VFOV_DEG: float = 90.0
    CAMERA_FPS: int = 30
    
    # IMU MPU6050
    FALL_FREEFALL_G: float = 0.35
    FALL_IMPACT_G: float = 3.20
    MAX_PITCH_COMPENSATION_DEG: float = 45.0


@dataclass(frozen=True)
class AlgorithmConfig:
    # Ground-Plane RANSAC
    RANSAC_MAX_ITERATIONS: int = 40
    RANSAC_DISTANCE_THRESHOLD_M: float = 0.06   # 6 cm ground plane deviation
    MIN_OBSTACLE_HEIGHT_M: float = 0.08         # 8 cm minimum rise to be considered an obstacle
    
    # Alert Urgency Engine Weights
    # U = w_dist * (1/d) + w_speed * max(0, -v_rel) + w_type * C_threat
    WEIGHT_DISTANCE: float = 1.20
    WEIGHT_SPEED: float = 1.80
    WEIGHT_THREAT_TYPE: float = 1.00
    
    # Urgency Classification Thresholds
    URGENCY_CRITICAL_SCORE: float = 4.0
    URGENCY_MEDIUM_SCORE: float = 2.0
    URGENCY_LOW_SCORE: float = 0.8
    
    CRITICAL_TTC_SECONDS: float = 1.2           # Time-to-collision warning limit
    CRITICAL_PROXIMITY_M: float = 0.85
    
    # Temporal Debouncing (Hysteresis)
    DEBOUNCE_CONFIRM_FRAMES: int = 3            # Must be seen for 3 frames to alert
    DEBOUNCE_CLEAR_FRAMES: int = 5              # Must be absent for 5 frames to clear
    
    # Suppression Envelope
    SUPPRESSION_THRESHOLD_DELTA: float = 1.5    # Lower hazard suppressed if high hazard is 1.5x higher


@dataclass(frozen=True)
class FeedbackConfig:
    # Audio Frequencies (Bone Conduction)
    AUDIO_LOW_URGENCY_HZ: int = 440             # Calm A4 tone
    AUDIO_MEDIUM_URGENCY_HZ: int = 880          # Attention A5 tone
    AUDIO_CRITICAL_URGENCY_HZ: int = 1760       # Urgent double-pulse A6 tone
    
    # Latency Performance Budgets (ms)
    MAX_TOTAL_LATENCY_MS: float = 15.0          # Hailo-8 hardware target

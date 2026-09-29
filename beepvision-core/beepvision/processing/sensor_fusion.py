"""
Multi-Modal Sensor Fusion & Extended Kalman Filter (EKF) Tracker
Fuses Camera bounding boxes, TF-Luna LiDAR range, and Ultrasonic peripheral sonar.
"""

import time
from typing import Dict, List, Optional
from ..types import (
    BoundingBox,
    LiDARReading,
    ObstacleType,
    Point3D,
    TrackedObstacle,
    UltrasonicArrayReading,
    UrgencyLevel,
)
from ..config import AlgorithmConfig


class KalmanObstacleTracker:
    """1D Constant-Velocity Kalman Filter tracking distance and relative velocity."""

    def __init__(self, init_distance: float, init_azimuth_deg: float, obs_type: ObstacleType, tracker_id: int):
        self.id = tracker_id
        self.obstacle_type = obs_type
        self.azimuth_deg = init_azimuth_deg
        
        # State vector: [distance (m), relative_velocity (m/s)]
        # Negative velocity = approaching, Positive velocity = receding
        self.x_dist = init_distance
        self.x_vel = 0.0

        # State error covariance
        self.p_dist = 0.5
        self.p_vel = 2.0

        # Process noise variance
        self.q_dist = 0.05
        self.q_vel = 0.50

        self.last_ts = time.time()
        self.consecutive_hits = 1
        self.frames_missed = 0

    def predict(self, dt: float):
        # State extrapolation
        self.x_dist += self.x_vel * dt
        if self.x_dist < 0.1:
            self.x_dist = 0.1

        # Covariance extrapolation
        self.p_dist += dt * (2.0 * self.p_vel + dt * self.q_vel) + self.q_dist
        self.p_vel += self.q_vel * dt

    def update(self, measured_dist: float, measurement_variance: float):
        # Innovation (measurement residual)
        y = measured_dist - self.x_dist

        # Innovation covariance
        s = self.p_dist + measurement_variance

        # Kalman gain
        k_dist = self.p_dist / s
        k_vel = (self.p_dist * 0.5) / s # cross correlation gain

        # State update
        self.x_dist += k_dist * y
        self.x_vel += k_vel * y

        # Covariance update
        self.p_dist = (1.0 - k_dist) * self.p_dist
        self.p_vel = max(0.01, self.p_vel - k_vel * self.p_dist)

        self.consecutive_hits += 1
        self.frames_missed = 0


class SensorFusionTracker:
    """
    Associates optical detections with LiDAR depth and Ultrasonic sectors,
    maintains persistent object IDs, and estimates Time-To-Collision (TTC).
    """

    def __init__(self):
        self._next_id = 1
        self.active_tracks: Dict[int, KalmanObstacleTracker] = {}
        self.last_timestamp = time.time()

    def process_frame(
        self,
        lidar: LiDARReading,
        ultrasonic: UltrasonicArrayReading,
        vision_detections: List[BoundingBox],
        timestamp: Optional[float] = None
    ) -> List[TrackedObstacle]:
        now = timestamp if timestamp is not None else time.time()
        dt = max(0.01, min(now - self.last_timestamp, 0.2))
        self.last_timestamp = now

        # Step 1: Predict existing tracks forward
        for track in self.active_tracks.values():
            track.predict(dt)

        # Step 2: Correlate optical detections with LiDAR / Ultrasonic
        matched_track_ids = set()

        # If vision detections are present, associate center-most box with LiDAR
        for bbox in vision_detections:
            # Map bbox class to ObstacleType
            obs_type = self._map_class_name(bbox.class_name)
            
            # Approximate azimuth from bbox center (-60 to +60 deg)
            center_x = (bbox.xmin + bbox.xmax) / 2.0
            azimuth_deg = (center_x - 0.5) * 120.0

            # If obstacle is near center (|azimuth| < 15 deg) and LiDAR is valid, use high-precision LiDAR depth
            if abs(azimuth_deg) < 15.0 and lidar.valid and lidar.distance_m > 0:
                dist_m = lidar.distance_m
                variance = 0.02 # TF-Luna has ~2cm accuracy
            elif azimuth_deg < -20.0:
                # Correlate with Left ultrasonic transducers
                dist_m = min(ultrasonic.front_left_m, ultrasonic.chest_left_m)
                variance = 0.08
            elif azimuth_deg > 20.0:
                # Correlate with Right ultrasonic transducers
                dist_m = min(ultrasonic.front_right_m, ultrasonic.chest_right_m)
                variance = 0.08
            else:
                dist_m = min(ultrasonic.front_left_m, ultrasonic.front_right_m)
                variance = 0.15

            # Find matching track by azimuth and distance
            best_match_id = None
            best_diff = 1.5 # Maximum association gate (meters)

            for tid, track in self.active_tracks.items():
                if tid in matched_track_ids:
                    continue
                diff = abs(track.x_dist - dist_m)
                if diff < best_diff and abs(track.azimuth_deg - azimuth_deg) < 30.0:
                    best_diff = diff
                    best_match_id = tid

            if best_match_id is not None:
                track = self.active_tracks[best_match_id]
                track.update(dist_m, variance)
                track.azimuth_deg = azimuth_deg
                matched_track_ids.add(best_match_id)
            else:
                # Initialize new track
                new_track = KalmanObstacleTracker(
                    init_distance=dist_m,
                    init_azimuth_deg=azimuth_deg,
                    obs_type=obs_type,
                    tracker_id=self._next_id
                )
                self.active_tracks[self._next_id] = new_track
                matched_track_ids.add(self._next_id)
                self._next_id += 1

        # Fallback: If no vision bounding boxes were detected, but LiDAR sees a close object
        if not vision_detections and lidar.valid and lidar.distance_m < 3.5:
            # Direct central obstacle detection (e.g. glass wall, dark pole)
            matched = False
            for tid, track in self.active_tracks.items():
                if abs(track.azimuth_deg) < 15.0 and abs(track.x_dist - lidar.distance_m) < 1.0:
                    track.update(lidar.distance_m, 0.02)
                    matched_track_ids.add(tid)
                    matched = True
                    break
            if not matched:
                new_track = KalmanObstacleTracker(
                    init_distance=lidar.distance_m,
                    init_azimuth_deg=0.0,
                    obs_type=ObstacleType.UNKNOWN,
                    tracker_id=self._next_id
                )
                self.active_tracks[self._next_id] = new_track
                matched_track_ids.add(self._next_id)
                self._next_id += 1

        # Age unmatched tracks
        dead_tracks = []
        for tid, track in self.active_tracks.items():
            if tid not in matched_track_ids:
                track.frames_missed += 1
                if track.frames_missed > AlgorithmConfig.DEBOUNCE_CLEAR_FRAMES:
                    dead_tracks.append(tid)

        for tid in dead_tracks:
            del self.active_tracks[tid]

        # Convert active tracks into standardized TrackedObstacle objects
        output_obstacles = []
        import math
        for tid, track in self.active_tracks.items():
            dist = max(0.1, track.x_dist)
            v_rel = track.x_vel
            
            # Time to collision: only valid if closing (v_rel < 0)
            if v_rel < -0.15:
                ttc = dist / abs(v_rel)
            else:
                ttc = 999.0

            # Calculate 3D position in device space
            az_rad = math.radians(track.azimuth_deg)
            pos_x = dist * math.sin(az_rad)
            pos_y = dist * math.cos(az_rad)
            pos_z = 0.0 # Nominal level

            output_obstacles.append(
                TrackedObstacle(
                    id=track.id,
                    obstacle_type=track.obstacle_type,
                    position=Point3D(x=round(pos_x, 2), y=round(pos_y, 2), z=round(pos_z, 2)),
                    velocity_mps=round(v_rel, 2),
                    time_to_collision_s=round(ttc, 2),
                    urgency_score=0.0, # Populated by AlertEngine
                    urgency_level=UrgencyLevel.CLEAR,
                    consecutive_hits=track.consecutive_hits,
                    frames_missed=track.frames_missed
                )
            )

        return output_obstacles

    def _map_class_name(self, class_name: str) -> ObstacleType:
        mapping = {
            "car": ObstacleType.VEHICLE,
            "truck": ObstacleType.VEHICLE,
            "bus": ObstacleType.VEHICLE,
            "motorcycle": ObstacleType.VEHICLE,
            "bicycle": ObstacleType.CYCLIST,
            "person": ObstacleType.PEDESTRIAN,
            "traffic light": ObstacleType.POLE,
            "pole": ObstacleType.POLE,
            "bench": ObstacleType.CURB,
            "tree": ObstacleType.LOW_BRANCH,
            "branch": ObstacleType.LOW_BRANCH,
        }
        return mapping.get(class_name.lower(), ObstacleType.UNKNOWN)

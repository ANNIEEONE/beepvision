"""
Realistic Urban Telemetry Generator for BeepVision Edge Pipeline
Simulates critical mobility test cases from the BeepVision specification.
"""

from dataclasses import dataclass
from typing import Dict, List
from beepvision.types import BoundingBox, Point3D


@dataclass
class ScenarioFrame:
    description: str
    lidar_distance_m: float
    lidar_valid: bool
    front_left_sonar_m: float
    front_right_sonar_m: float
    chest_left_sonar_m: float
    chest_right_sonar_m: float
    imu_pitch_deg: float
    vision_detections: List[BoundingBox]


class UrbanScenarioRunner:
    """Provides time-series sensory frames for testing edge autonomy algorithms."""

    @staticmethod
    def get_silent_ev_approach() -> List[ScenarioFrame]:
        """
        Scenario 1: Silent Electric Vehicle (EV) Approaching at 15 km/h (4.2 m/s).
        Tests fast closing speed urgency boost and transition to Critical alert.
        """
        frames = []
        distances = [8.5, 7.1, 5.7, 4.3, 2.9, 1.5, 0.7] # Approaching at ~4.2 m/s (0.33s intervals)
        for i, d in enumerate(distances):
            frames.append(
                ScenarioFrame(
                    description=f"Silent EV Approaching: {d:.1f}m ahead",
                    lidar_distance_m=d,
                    lidar_valid=True,
                    front_left_sonar_m=min(4.0, d + 0.3),
                    front_right_sonar_m=min(4.0, d + 0.3),
                    chest_left_sonar_m=4.0,
                    chest_right_sonar_m=4.0,
                    imu_pitch_deg=0.0,
                    vision_detections=[
                        BoundingBox(xmin=0.35, ymin=0.2, xmax=0.65, ymax=0.8, confidence=0.92, class_name="car")
                    ]
                )
            )
        return frames

    @staticmethod
    def get_low_hanging_tree_branch() -> List[ScenarioFrame]:
        """
        Scenario 2: Low-Hanging Tree Branch at Head Height (1.9m off ground).
        Primary blindspot of conventional white canes.
        Tests upper chest haptic matrix and optical elevation correlation.
        """
        frames = []
        # User walks forward at 1.2 m/s towards tree branch
        distances = [3.8, 3.4, 3.0, 2.6, 2.2, 1.8, 1.4, 1.0]
        for d in distances:
            frames.append(
                ScenarioFrame(
                    description=f"Head-Height Branch: {d:.1f}m ahead",
                    lidar_distance_m=d, # LiDAR beam hits the branch
                    lidar_valid=True,
                    front_left_sonar_m=4.0,  # Ground sonars don't see elevated branch!
                    front_right_sonar_m=4.0,
                    chest_left_sonar_m=4.0,
                    chest_right_sonar_m=4.0,
                    imu_pitch_deg=0.0,
                    vision_detections=[
                        BoundingBox(xmin=0.30, ymin=0.1, xmax=0.70, ymax=0.45, confidence=0.88, class_name="branch")
                    ]
                )
            )
        return frames

    @staticmethod
    def get_torso_pitch_incline_and_trench() -> List[ScenarioFrame]:
        """
        Scenario 3: User leans forward 12° during walking, then encounters open trench.
        Tests:
          1. Torso pitch dynamic tilt compensation suppresses false alarm on pavement.
          2. Open road trench drop-off triggers lower chest haptic warning.
        """
        frames = [
            # Normal walking
            ScenarioFrame(
                description="Normal walking: level posture",
                lidar_distance_m=4.0, lidar_valid=True,
                front_left_sonar_m=3.8, front_right_sonar_m=3.8,
                chest_left_sonar_m=4.0, chest_right_sonar_m=4.0,
                imu_pitch_deg=0.0, vision_detections=[]
            ),
            # Torso leans forward 12 degrees - beam points at ground 4m ahead
            ScenarioFrame(
                description="Torso leans forward 12° (Ground ray compensation active)",
                lidar_distance_m=3.8, lidar_valid=True,
                front_left_sonar_m=3.8, front_right_sonar_m=3.8,
                chest_left_sonar_m=4.0, chest_right_sonar_m=4.0,
                imu_pitch_deg=12.0, vision_detections=[]
            ),
            # Approaching open utility trench 1.5m ahead
            ScenarioFrame(
                description="Approaching open trench drop-off at 1.5m",
                lidar_distance_m=1.5, lidar_valid=True,
                front_left_sonar_m=1.5, front_right_sonar_m=1.5,
                chest_left_sonar_m=3.5, chest_right_sonar_m=3.5,
                imu_pitch_deg=3.0,
                vision_detections=[]
            ),
        ]
        return frames

    @staticmethod
    def get_crowded_station_suppression() -> List[ScenarioFrame]:
        """
        Scenario 4: Multiple Obstacles (Crowded Platform) with Dynamic Suppression.
        Tests: Stationary pedestrian on right, metal bench on left, oncoming speeding cyclist.
        Ensures secondary hazards are suppressed so user is not deafened by conflicting beeps.
        """
        frames = [
            ScenarioFrame(
                description="Crowded platform: Pedestrian right + Bench left",
                lidar_distance_m=3.5, lidar_valid=True,
                front_left_sonar_m=2.8, front_right_sonar_m=2.4,
                chest_left_sonar_m=2.8, chest_right_sonar_m=2.4,
                imu_pitch_deg=0.0,
                vision_detections=[
                    BoundingBox(xmin=0.1, ymin=0.3, xmax=0.3, ymax=0.8, confidence=0.85, class_name="bench"),
                    BoundingBox(xmin=0.7, ymin=0.2, xmax=0.9, ymax=0.9, confidence=0.89, class_name="person"),
                ]
            ),
            ScenarioFrame(
                description="Emergency: Fast cyclist cuts into center path at 2.0m!",
                lidar_distance_m=1.8, lidar_valid=True,
                front_left_sonar_m=2.8, front_right_sonar_m=2.4,
                chest_left_sonar_m=2.8, chest_right_sonar_m=2.4,
                imu_pitch_deg=0.0,
                vision_detections=[
                    BoundingBox(xmin=0.4, ymin=0.2, xmax=0.6, ymax=0.85, confidence=0.94, class_name="bicycle"),
                    BoundingBox(xmin=0.1, ymin=0.3, xmax=0.3, ymax=0.8, confidence=0.85, class_name="bench"),
                    BoundingBox(xmin=0.7, ymin=0.2, xmax=0.9, ymax=0.9, confidence=0.89, class_name="person"),
                ]
            ),
        ]
        return frames

"""
Core Data Types and Structures for BeepVision
"""

from dataclasses import dataclass, field
from enum import Enum, auto
from typing import List, Optional, Tuple


class ObstacleType(Enum):
    CLEAR = "clear"
    VEHICLE = "vehicle"
    CYCLIST = "cyclist"
    PEDESTRIAN = "pedestrian"
    POLE = "pole"
    LOW_BRANCH = "low_branch"
    CURB = "curb"
    TRENCH = "trench"
    WALL = "wall"
    UNKNOWN = "unknown"

    @property
    def base_threat_score(self) -> float:
        """Intrinsic hazard severity weighting."""
        scores = {
            ObstacleType.VEHICLE: 1.0,
            ObstacleType.CYCLIST: 0.85,
            ObstacleType.LOW_BRANCH: 0.80, # Head height hazard (white cane blindspot)
            ObstacleType.TRENCH: 0.90,     # Drop-off danger
            ObstacleType.POLE: 0.60,
            ObstacleType.WALL: 0.50,
            ObstacleType.PEDESTRIAN: 0.40,
            ObstacleType.CURB: 0.30,
            ObstacleType.UNKNOWN: 0.50,
            ObstacleType.CLEAR: 0.0,
        }
        return scores.get(self, 0.5)


class UrgencyLevel(Enum):
    CLEAR = 0
    LOW = 1       # Informational, soft guidance
    MEDIUM = 2    # Prompt caution, 1-2m proximity or stationary obstacle
    CRITICAL = 3  # Imminent impact danger (<1s time-to-collision or <0.8m)


class HapticZone(Enum):
    NONE = auto()
    LEFT = auto()
    RIGHT = auto()
    CHEST_UPPER = auto()   # Warns of head/chest height hazards (branches, overhangs)
    CHEST_LOWER = auto()   # Warns of ground drop-offs, trenches, stairs down
    OMNI_PULSE = auto()    # Emergency 360-degree critical stop warning


@dataclass
class Point3D:
    x: float  # meters (lateral: +right, -left)
    y: float  # meters (longitudinal: +forward)
    z: float  # meters (vertical: +up, -down)

    @property
    def distance(self) -> float:
        return (self.x**2 + self.y**2 + self.z**2) ** 0.5

    @property
    def azimuth_deg(self) -> float:
        """Horizontal angle in degrees from device forward axis (+ = right, - = left)."""
        import math
        return math.degrees(math.atan2(self.x, max(self.y, 0.001)))

    @property
    def elevation_deg(self) -> float:
        """Vertical angle in degrees from horizontal plane."""
        import math
        ground_dist = (self.x**2 + self.y**2) ** 0.5
        return math.degrees(math.atan2(self.z, max(ground_dist, 0.001)))


@dataclass
class BoundingBox:
    xmin: float
    ymin: float
    xmax: float
    ymax: float
    confidence: float
    class_name: str


@dataclass
class LiDARReading:
    distance_m: float
    signal_strength: int
    chip_temperature_c: float
    timestamp: float
    valid: bool


@dataclass
class UltrasonicArrayReading:
    front_left_m: float
    front_right_m: float
    chest_left_m: float
    chest_right_m: float
    timestamp: float


@dataclass
class IMUReading:
    pitch_deg: float      # Torso inclination (+ = leaning forward, - = leaning back)
    roll_deg: float       # Lateral shoulder tilt
    accel_g: Tuple[float, float, float]
    gyro_dps: Tuple[float, float, float]
    is_fall_detected: bool
    timestamp: float


@dataclass
class TrackedObstacle:
    id: int
    obstacle_type: ObstacleType
    position: Point3D
    velocity_mps: float       # Closing velocity (- = approaching, + = receding)
    time_to_collision_s: float
    urgency_score: float
    urgency_level: UrgencyLevel
    consecutive_hits: int = 1
    frames_missed: int = 0
    suppressed: bool = False


@dataclass
class AudioCue:
    frequency_hz: int
    duration_ms: int
    pan: float            # -1.0 (Full Left) to +1.0 (Full Right)
    speech_phrase: Optional[str] = None


@dataclass
class HapticFeedback:
    zone: HapticZone
    intensity_pct: int    # 0 to 100% PWM duty cycle
    pulse_pattern: str    # "single_tap", "double_pulse", "continuous_buzz"


@dataclass
class SystemTelemetry:
    timestamp: float
    frame_index: int
    pipeline_latency_ms: float
    tracked_obstacles: List[TrackedObstacle]
    primary_threat: Optional[TrackedObstacle]
    audio_cue: Optional[AudioCue]
    haptic_command: Optional[HapticFeedback]
    imu_pitch_deg: float
    ground_plane_height_m: float
    npu_active: bool

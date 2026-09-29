"""
Torso Pitch Dynamic Tilt Compensator
Solves the false-positive pavement alarm issue caused by human walking gate and torso leaning.
"""

import math
from ..types import Point3D
from ..config import SensorConfig


class TorsoPitchCompensator:
    """
    Transforms sensor coordinates from the moving Device Body Frame (B)
    into the stabilized World Navigational Frame (W) based on real-time IMU pitch.
    
    Transformation:
      y_world = y_body * cos(theta) - z_body * sin(theta)
      z_world = y_body * sin(theta) + z_body * cos(theta) + H_mount
      x_world = x_body (assuming minimal roll during straight walking)
    """

    def __init__(self, mount_height_m: float = SensorConfig.WEARABLE_MOUNT_HEIGHT_M):
        self.mount_height_m = mount_height_m

    def transform_point(self, pt_body: Point3D, pitch_deg: float, roll_deg: float = 0.0) -> Point3D:
        """
        Transforms a 3D coordinate from body-relative frame to world ground-relative frame.
        Positive pitch represents the user leaning forward.
        """
        # Clamp pitch to avoid extreme edge cases (e.g. tying shoes)
        clamped_pitch = max(-SensorConfig.MAX_PITCH_COMPENSATION_DEG, min(pitch_deg, SensorConfig.MAX_PITCH_COMPENSATION_DEG))
        pitch_rad = math.radians(clamped_pitch)
        
        cos_p = math.cos(pitch_rad)
        sin_p = math.sin(pitch_rad)

        # Body frame: x = right, y = forward, z = upward relative to chest plate
        # When chest leans forward (+pitch), the device tilts downwards.
        # Sensor's forward vector has a downward projection in world space:
        # z_world = -y_body * sin(theta) + z_body * cos(theta) + mount_height
        # y_world =  y_body * cos(theta) + z_body * sin(theta)
        
        y_world = pt_body.y * cos_p + pt_body.z * sin_p
        z_world = -pt_body.y * sin_p + pt_body.z * cos_p + self.mount_height_m
        x_world = pt_body.x

        return Point3D(
            x=round(x_world, 3),
            y=round(y_world, 3),
            z=round(z_world, 3)
        )

    def is_ground_intersection(self, pt_world: Point3D, ground_plane_z: float = 0.0, tolerance_m: float = 0.08) -> bool:
        """
        Returns True if the transformed point is within the expected flat ground surface band.
        If true, this point is pavement/sidewalk, NOT an obstacle.
        """
        return abs(pt_world.z - ground_plane_z) <= tolerance_m

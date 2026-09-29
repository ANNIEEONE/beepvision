"""
Unit tests for Torso Pitch Dynamic Compensation and RANSAC Ground-Plane Segmentation.
"""

import unittest
from beepvision.types import Point3D
from beepvision.processing.pitch_compensator import TorsoPitchCompensator
from beepvision.processing.ransac_ground import RANSACGroundPlaneEstimator


class TestPitchAndRansac(unittest.TestCase):

    def test_torso_pitch_compensation(self):
        """
        When user mounts device at 1.35m and tilts torso forward by 19.3 degrees,
        a horizontal body ray at 4.0m projects downwards in world space:
          z_world = -4.0 * sin(19.3 deg) + 1.35 = -4.0 * 0.33 + 1.35 = 0.03m (~ground)
        Pitch compensator must recognize this as pavement intersection, NOT an obstacle!
        """
        compensator = TorsoPitchCompensator(mount_height_m=1.35)

        # Level posture: 4m forward is at chest height in world frame (z = 1.35m)
        pt_level = compensator.transform_point(Point3D(x=0.0, y=4.0, z=0.0), pitch_deg=0.0)
        self.assertAlmostEqual(pt_level.z, 1.35, places=2)
        self.assertFalse(compensator.is_ground_intersection(pt_level))

        # Forward lean 19.3 degrees: ray intercepts the ground
        pt_tilted = compensator.transform_point(Point3D(x=0.0, y=4.0, z=0.0), pitch_deg=19.3)
        self.assertTrue(compensator.is_ground_intersection(pt_tilted, ground_plane_z=0.0, tolerance_m=0.08))

    def test_ransac_ground_plane_segmentation(self):
        """
        Creates synthetic ground plane with small noise, an elevated curb, and a sunken trench.
        Validates that RANSAC cleanly isolates the safe ground from threats.
        """
        ransac = RANSACGroundPlaneEstimator()

        # 20 flat ground points along pavement (z ~ 0.0)
        points = [
            Point3D(x=(i % 5) * 0.4 - 1.0, y=1.0 + (i // 5) * 0.8, z=0.01 * (i % 3))
            for i in range(20)
        ]

        # 1 elevated curb / obstacle (z = 0.20m, 20 cm height)
        points.append(Point3D(x=0.0, y=2.5, z=0.20))

        # 1 sunken pothole / trench drop-off (z = -0.25m, 25 cm drop)
        points.append(Point3D(x=0.3, y=1.8, z=-0.25))

        ground_inliers, positive_obs, dropoffs = ransac.segment_obstacles(points)

        # Ground inliers should contain all 20 pavement points
        self.assertGreaterEqual(len(ground_inliers), 18)

        # Positive obstacle must identify the 20cm curb
        self.assertEqual(len(positive_obs), 1)
        self.assertEqual(positive_obs[0].z, 0.20)

        # Drop-off must identify the -25cm trench
        self.assertEqual(len(dropoffs), 1)
        self.assertEqual(dropoffs[0].z, -0.25)


if __name__ == "__main__":
    unittest.main()

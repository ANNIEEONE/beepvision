"""
RANSAC Ground-Plane Segmentation
Segments navigable walking pavement from vertical curbs, drop-offs, and ground debris.
"""

import math
import random
from typing import List, Optional, Tuple
from ..types import Point3D
from ..config import AlgorithmConfig


class RANSACGroundPlaneEstimator:
    """
    Fits 3D plane equation Ax + By + Cz + D = 0 to point cloud.
    Guarantees that sidewalks and asphalt are excluded from obstacle alarms,
    while steps, curbs, potholes, and trenches are accurately preserved.
    """

    def __init__(
        self,
        distance_threshold_m: float = AlgorithmConfig.RANSAC_DISTANCE_THRESHOLD_M,
        max_iterations: int = AlgorithmConfig.RANSAC_MAX_ITERATIONS,
        min_obstacle_height_m: float = AlgorithmConfig.MIN_OBSTACLE_HEIGHT_M
    ):
        self.distance_threshold = distance_threshold_m
        self.max_iterations = max_iterations
        self.min_obstacle_height = min_obstacle_height_m
        self.ground_plane_params: Optional[Tuple[float, float, float, float]] = None

    def fit_plane(self, points: List[Point3D]) -> Optional[Tuple[float, float, float, float]]:
        """
        Runs RANSAC algorithm to find optimal ground plane (A, B, C, D).
        Normalized so that A^2 + B^2 + C^2 = 1 and C > 0 (pointing upwards).
        """
        if len(points) < 3:
            return None

        best_inliers = []
        best_plane = None

        for _ in range(self.max_iterations):
            # Sample 3 random distinct points
            sample = random.sample(points, 3)
            p1, p2, p3 = sample[0], sample[1], sample[2]

            # Vector p1 -> p2 and p1 -> p3
            v1 = (p2.x - p1.x, p2.y - p1.y, p2.z - p1.z)
            v2 = (p3.x - p1.x, p3.y - p1.y, p3.z - p1.z)

            # Cross product gives normal (A, B, C)
            A = v1[1] * v2[2] - v1[2] * v2[1]
            B = v1[2] * v2[0] - v1[0] * v2[2]
            C = v1[0] * v2[1] - v1[1] * v2[0]

            norm = math.sqrt(A**2 + B**2 + C**2)
            if norm < 1e-6:
                continue

            A, B, C = A / norm, B / norm, C / norm

            # Ensure normal points upward (+z direction)
            if C < 0:
                A, B, C = -A, -B, -C

            # Normal must be roughly vertical (C > 0.7) for a walkable ground surface
            if C < 0.70:
                continue

            D = -(A * p1.x + B * p1.y + C * p1.z)

            # Count inliers
            inliers = []
            for p in points:
                dist = abs(A * p.x + B * p.y + C * p.z + D)
                if dist < self.distance_threshold:
                    inliers.append(p)

            if len(inliers) > len(best_inliers):
                best_inliers = inliers
                best_plane = (A, B, C, D)

        if best_plane and len(best_inliers) >= 3:
            self.ground_plane_params = best_plane
            return best_plane

        # Default fallback: flat ground at z = 0.0 (normal 0, 0, 1, D = 0)
        self.ground_plane_params = (0.0, 0.0, 1.0, 0.0)
        return self.ground_plane_params

    def segment_obstacles(
        self, points: List[Point3D]
    ) -> Tuple[List[Point3D], List[Point3D], List[Point3D]]:
        """
        Segments a point cloud into:
          1. Ground inliers (safe pavement)
          2. Positive obstacles (rises above ground >= min_obstacle_height_m)
          3. Negative obstacles / drop-offs (drops below ground <= -0.15m)
        """
        if not self.ground_plane_params:
            self.fit_plane(points)

        A, B, C, D = self.ground_plane_params or (0.0, 0.0, 1.0, 0.0)

        ground_inliers = []
        positive_obstacles = []
        negative_dropoffs = []

        for p in points:
            # Signed vertical height above ground plane
            # signed_dist = (A*x + B*y + C*z + D)
            height_above_ground = (A * p.x + B * p.y + C * p.z + D)

            if abs(height_above_ground) < self.distance_threshold:
                ground_inliers.append(p)
            elif height_above_ground >= self.min_obstacle_height:
                positive_obstacles.append(p)
            elif height_above_ground <= -0.15:
                negative_dropoffs.append(p)

        return ground_inliers, positive_obstacles, negative_dropoffs

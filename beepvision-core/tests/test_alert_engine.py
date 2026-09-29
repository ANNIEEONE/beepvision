"""
Unit tests for Threat Urgency, Dynamic Suppression, and Hysteresis Debouncing.
"""

import unittest
from beepvision.types import (
    HapticZone,
    ObstacleType,
    Point3D,
    TrackedObstacle,
    UrgencyLevel,
)
from beepvision.engine.alert_engine import AlertUrgencyEngine


class TestAlertEngine(unittest.TestCase):

    def setUp(self):
        self.engine = AlertUrgencyEngine()

    def test_urgency_score_vehicle_vs_wall(self):
        """A fast approaching car must score substantially higher urgency than a stationary wall."""
        car = TrackedObstacle(
            id=1,
            obstacle_type=ObstacleType.VEHICLE,
            position=Point3D(x=0.0, y=2.0, z=0.0),
            velocity_mps=-4.5, # Closing at 4.5 m/s
            time_to_collision_s=0.44,
            urgency_score=0.0,
            urgency_level=UrgencyLevel.CLEAR,
            consecutive_hits=4
        )

        wall = TrackedObstacle(
            id=2,
            obstacle_type=ObstacleType.WALL,
            position=Point3D(x=1.5, y=3.0, z=0.0),
            velocity_mps=0.0, # Stationary
            time_to_collision_s=999.0,
            urgency_score=0.0,
            urgency_level=UrgencyLevel.CLEAR,
            consecutive_hits=4
        )

        score_car = self.engine.calculate_urgency(car)
        score_wall = self.engine.calculate_urgency(wall)

        # Car: w_dist*(1/2) + w_speed*(4.5) + w_threat*(1.0) = 1.2*0.5 + 1.8*4.5 + 1.0 = 0.6 + 8.1 + 1.0 = 9.7
        # Wall: 1.2*(1/3.35) + 0 + 1.0*0.5 ~ 0.36 + 0.5 = 0.86
        self.assertGreater(score_car, 8.0)
        self.assertLess(score_wall, 2.0)
        self.assertGreater(score_car, score_wall * 4.0)

    def test_dynamic_priority_suppression(self):
        """When an urgent threat is detected, lower-tier background obstacles must be suppressed."""
        fast_car = TrackedObstacle(
            id=1, obstacle_type=ObstacleType.VEHICLE,
            position=Point3D(x=0.0, y=1.2, z=0.0), velocity_mps=-3.5,
            time_to_collision_s=0.34, urgency_score=0.0, urgency_level=UrgencyLevel.CLEAR,
            consecutive_hits=4
        )
        distant_curb = TrackedObstacle(
            id=2, obstacle_type=ObstacleType.CURB,
            position=Point3D(x=1.0, y=3.5, z=-0.1), velocity_mps=0.0,
            time_to_collision_s=999.0, urgency_score=0.0, urgency_level=UrgencyLevel.CLEAR,
            consecutive_hits=4
        )

        scored, primary, audio, haptics = self.engine.evaluate([fast_car, distant_curb])

        self.assertIsNotNone(primary)
        self.assertEqual(primary.id, fast_car.id)
        self.assertEqual(primary.urgency_level, UrgencyLevel.CRITICAL)

        # Distant curb must be suppressed
        curb_result = next(o for o in scored if o.id == distant_curb.id)
        self.assertTrue(curb_result.suppressed)

        # Critical threat should trigger omni-pulse haptics and high-frequency audio
        self.assertEqual(haptics.zone, HapticZone.OMNI_PULSE)
        self.assertEqual(audio.frequency_hz, 1760)

    def test_temporal_hysteresis_debouncing(self):
        """A single-frame sensor glitch (1 hit) must not trigger audible alerts."""
        glitch_obstacle = TrackedObstacle(
            id=99, obstacle_type=ObstacleType.POLE,
            position=Point3D(x=0.0, y=2.2, z=0.0), velocity_mps=0.0,
            time_to_collision_s=999.0, urgency_score=0.0, urgency_level=UrgencyLevel.CLEAR,
            consecutive_hits=1 # Frame 1 only!
        )

        scored, primary, audio, haptics = self.engine.evaluate([glitch_obstacle])
        
        # Debounce prevents alert on frame 1
        self.assertIsNone(primary)
        self.assertIsNone(audio)
        self.assertIsNone(haptics)

        # When obstacle persists for 3 frames, alert triggers
        glitch_obstacle.consecutive_hits = 3
        scored_confirmed, primary_confirmed, audio_confirmed, _ = self.engine.evaluate([glitch_obstacle])
        self.assertIsNotNone(primary_confirmed)
        self.assertIsNotNone(audio_confirmed)


if __name__ == "__main__":
    unittest.main()

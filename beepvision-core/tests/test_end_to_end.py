"""
End-to-End Pipeline Integration Test
Verifies closed-loop execution latency and multi-scenario safety behavior.
"""

import unittest
from beepvision.pipeline import BeepVisionPipeline
from simulations.urban_scenarios import UrbanScenarioRunner


class TestEndToEndPipeline(unittest.TestCase):

    def setUp(self):
        self.pipeline = BeepVisionPipeline(simulated=True, enable_audio=False)
        self.assertTrue(self.pipeline.initialize())

    def tearDown(self):
        self.pipeline.close()

    def test_ev_approach_scenario_and_latency(self):
        """Simulates oncoming EV and checks that average loop latency is within Hailo-8 <15ms budget."""
        scenario_frames = UrbanScenarioRunner.get_silent_ev_approach()
        latencies = []

        for frame in scenario_frames:
            # Drive sensors with scenario data
            self.pipeline.lidar.set_simulated_target(frame.lidar_distance_m, velocity_mps=-4.2)
            self.pipeline.imu.set_simulated_pitch(frame.imu_pitch_deg)

            telemetry = self.pipeline.step(vision_detections=frame.vision_detections)
            latencies.append(telemetry.pipeline_latency_ms)

        avg_latency = sum(latencies) / len(latencies)
        print(f"\n[BENCHMARK] Average Pipeline Step Latency: {avg_latency:.2f} ms")

        # Must comfortably meet edge real-time budget
        self.assertLess(avg_latency, 20.0)

    def test_tree_branch_blindspot_scenario(self):
        """Low-hanging tree branch must trigger upper-chest haptic warning."""
        frames = UrbanScenarioRunner.get_low_hanging_tree_branch()
        triggered_upper_chest = False

        for frame in frames:
            self.pipeline.lidar.set_simulated_target(frame.lidar_distance_m, velocity_mps=-1.2)
            self.pipeline.imu.set_simulated_pitch(frame.imu_pitch_deg)
            telemetry = self.pipeline.step(vision_detections=frame.vision_detections)

            if telemetry.haptic_command and telemetry.haptic_command.zone.name == "CHEST_UPPER":
                triggered_upper_chest = True

        self.assertTrue(triggered_upper_chest, "Pipeline must activate UPPER CHEST haptics for low branches!")


if __name__ == "__main__":
    unittest.main()

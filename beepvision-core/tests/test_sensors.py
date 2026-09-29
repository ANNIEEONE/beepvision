"""
Unit tests for sensor drivers and binary communication protocols.
"""

import unittest
from beepvision.sensors.tfluna_lidar import TFLunaLiDAR
from beepvision.sensors.ultrasonic_array import UltrasonicArray
from beepvision.sensors.imu_mpu6050 import MPU6050IMU


class TestSensorDrivers(unittest.TestCase):

    def test_tfluna_binary_packet_parsing_valid(self):
        """
        Valid TF-Luna Frame:
          Header: 0x59 0x59
          Dist: 250 cm (0x00FA -> Dist_L = 0xFA, Dist_H = 0x00)
          Strength: 1000 (0x03E8 -> Amp_L = 0xE8, Amp_H = 0x03)
          Temp: (30 + 256) * 8 = 2288 (0x08F0 -> Temp_L = 0xF0, Temp_H = 0x08)
          Checksum: sum(bytes 0..7) & 0xFF
        """
        raw = bytearray([0x59, 0x59, 0xFA, 0x00, 0xE8, 0x03, 0xF0, 0x08])
        checksum = sum(raw) & 0xFF
        raw.append(checksum)

        reading = TFLunaLiDAR.parse_packet(bytes(raw))
        self.assertIsNotNone(reading)
        self.assertEqual(reading.distance_m, 2.50)
        self.assertEqual(reading.signal_strength, 1000)
        self.assertEqual(reading.chip_temperature_c, 30.0)
        self.assertTrue(reading.valid)

    def test_tfluna_corrupted_checksum(self):
        """Frames with invalid checksums must be rejected to prevent false telemetry."""
        raw = bytearray([0x59, 0x59, 0xFA, 0x00, 0xE8, 0x03, 0xF0, 0x08, 0x00]) # Wrong checksum
        reading = TFLunaLiDAR.parse_packet(bytes(raw))
        self.assertIsNone(reading)

    def test_tfluna_invalid_header(self):
        """Packets not starting with 0x59 0x59 must be ignored."""
        raw = bytearray([0x00, 0x59, 0xFA, 0x00, 0xE8, 0x03, 0xF0, 0x08, 0x50])
        reading = TFLunaLiDAR.parse_packet(bytes(raw))
        self.assertIsNone(reading)

    def test_ultrasonic_temperature_compensation(self):
        """Speed of sound changes dynamically with ambient climate."""
        array = UltrasonicArray(simulated=True)
        # At 0 deg C: 331.3 m/s
        speed_cold = array.calculate_speed_of_sound(0.0)
        self.assertAlmostEqual(speed_cold, 331.3, places=2)

        # At 40 deg C (Indian summer): 331.3 + 0.606 * 40 = 355.54 m/s
        speed_hot = array.calculate_speed_of_sound(40.0)
        self.assertAlmostEqual(speed_hot, 355.54, places=2)

    def test_imu_simulation_modes(self):
        imu = MPU6050IMU(simulated=True)
        self.assertTrue(imu.initialize())
        imu.set_simulated_pitch(15.5)
        reading = imu.read()
        self.assertEqual(reading.pitch_deg, 15.5)
        self.assertFalse(reading.is_fall_detected)

        imu.trigger_simulated_fall()
        fall_reading = imu.read()
        self.assertTrue(fall_reading.is_fall_detected)


if __name__ == "__main__":
    unittest.main()

"""
MPU6050 6-Axis Inertial Measurement Unit (IMU) Driver
Tracks torso pitch inclination for dynamic coordinate stabilization and fall detection.
"""

import math
import time
from typing import Optional, Tuple
from .base import SensorInterface
from ..types import IMUReading
from ..config import SensorConfig


class MPU6050IMU(SensorInterface):
    """
    MPU-6050 3-axis Accelerometer + 3-axis Gyroscope over I2C (Address 0x68).
    Implements:
      1. Complementary Filter for torso pitch/roll estimation.
      2. Freefall + Impact Signature Detection for automated SOS trigger.
    """

    I2C_ADDR = 0x68
    PWR_MGMT_1 = 0x6B
    ACCEL_XOUT_H = 0x3B
    GYRO_XOUT_H = 0x43

    def __init__(self, i2c_bus: int = 1, simulated: bool = False):
        super().__init__(name="MPU6050 IMU", simulated=simulated)
        self.i2c_bus_num = i2c_bus
        self.bus = None
        
        # State estimation
        self.pitch_deg: float = 0.0
        self.roll_deg: float = 0.0
        self.last_update_ts: float = time.time()
        self.filter_alpha: float = 0.95 # Weight of gyro vs accelerometer
        
        # Fall detection state machine
        self._freefall_detected_ts: Optional[float] = None
        self._fall_confirmed: bool = False
        
        # Simulated states
        self._sim_pitch: float = 0.0
        self._sim_accel = (0.0, 0.0, 1.0)
        self._sim_gyro = (0.0, 0.0, 0.0)

    def initialize(self) -> bool:
        if self.simulated:
            self.record_success()
            return True

        try:
            from smbus2 import SMBus
            self.bus = SMBus(self.i2c_bus_num)
            # Wake up MPU6050 by writing 0 to PWR_MGMT_1 register
            self.bus.write_byte_data(self.I2C_ADDR, self.PWR_MGMT_1, 0)
            self.record_success()
            return True
        except Exception:
            # Fall back to simulation mode if hardware I2C bus is missing
            self.simulated = True
            self.record_success()
            return True

    def _read_word_2c(self, reg: int) -> int:
        if not self.bus:
            return 0
        high = self.bus.read_byte_data(self.I2C_ADDR, reg)
        low = self.bus.read_byte_data(self.I2C_ADDR, reg + 1)
        val = (high << 8) + low
        if val >= 0x8000:
            return -((65535 - val) + 1)
        else:
            return val

    def read(self) -> IMUReading:
        now = time.time()
        dt = max(0.001, min(now - self.last_update_ts, 0.1))
        self.last_update_ts = now

        if self.simulated:
            self.record_success()
            return IMUReading(
                pitch_deg=round(self._sim_pitch, 2),
                roll_deg=0.0,
                accel_g=self._sim_accel,
                gyro_dps=self._sim_gyro,
                is_fall_detected=self._fall_confirmed,
                timestamp=now
            )

        try:
            # Scale factors for standard ranges (+/- 2g, +/- 250 dps)
            ax_raw = self._read_word_2c(self.ACCEL_XOUT_H)
            ay_raw = self._read_word_2c(self.ACCEL_XOUT_H + 2)
            az_raw = self._read_word_2c(self.ACCEL_XOUT_H + 4)

            gx_raw = self._read_word_2c(self.GYRO_XOUT_H)
            gy_raw = self._read_word_2c(self.GYRO_XOUT_H + 2)
            gz_raw = self._read_word_2c(self.GYRO_XOUT_H + 4)

            ax_g = ax_raw / 16384.0
            ay_g = ay_raw / 16384.0
            az_g = az_raw / 16384.0

            gx_dps = gx_raw / 131.0
            gy_dps = gy_raw / 131.0
            gz_dps = gz_raw / 131.0

            # Pitch & Roll from Accelerometer (trigonometric tilt)
            acc_pitch = math.degrees(math.atan2(ay_g, math.sqrt(ax_g**2 + az_g**2) or 0.0001))
            acc_roll = math.degrees(math.atan2(-ax_g, az_g or 0.0001))

            # Complementary filter: combines high-frequency gyroscope integration with low-frequency gravity vector
            self.pitch_deg = self.filter_alpha * (self.pitch_deg + gx_dps * dt) + (1.0 - self.filter_alpha) * acc_pitch
            self.roll_deg = self.filter_alpha * (self.roll_deg + gy_dps * dt) + (1.0 - self.filter_alpha) * acc_roll

            # Fall detection logic: Freefall followed by impact spike
            total_g = math.sqrt(ax_g**2 + ay_g**2 + az_g**2)
            if total_g < SensorConfig.FALL_FREEFALL_G:
                self._freefall_detected_ts = now
            elif self._freefall_detected_ts and (now - self._freefall_detected_ts < 1.5):
                if total_g > SensorConfig.FALL_IMPACT_G:
                    self._fall_confirmed = True
            else:
                self._fall_confirmed = False

            self.record_success()
            return IMUReading(
                pitch_deg=round(self.pitch_deg, 2),
                roll_deg=round(self.roll_deg, 2),
                accel_g=(round(ax_g, 3), round(ay_g, 3), round(az_g, 3)),
                gyro_dps=(round(gx_dps, 2), round(gy_dps, 2), round(gz_dps, 2)),
                is_fall_detected=self._fall_confirmed,
                timestamp=now
            )
        except Exception:
            self.record_error()
            return IMUReading(
                pitch_deg=0.0, roll_deg=0.0,
                accel_g=(0.0, 0.0, 1.0),
                gyro_dps=(0.0, 0.0, 0.0),
                is_fall_detected=False,
                timestamp=now
            )

    def set_simulated_pitch(self, pitch_deg: float):
        """Allows testbench to simulate user bending down or walking up an incline."""
        self._sim_pitch = pitch_deg

    def trigger_simulated_fall(self):
        self._fall_confirmed = True

    def clear_fall(self):
        self._fall_confirmed = False
        self._freefall_detected_ts = None

    def close(self) -> None:
        if self.bus and hasattr(self.bus, "close"):
            try:
                self.bus.close()
            except Exception:
                pass

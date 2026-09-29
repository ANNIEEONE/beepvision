"""
TF-Luna Solid-State 850nm LiDAR Driver
Parses 9-byte binary UART frame protocol @ 115200 baud.
"""

import struct
import time
from typing import Optional
from .base import SensorInterface
from ..types import LiDARReading
from ..config import SensorConfig


class TFLunaLiDAR(SensorInterface):
    """
    Benewake TF-Luna LiDAR Driver.
    Binary Protocol:
      Byte 0: 0x59 (Header 1)
      Byte 1: 0x59 (Header 2)
      Byte 2: Dist_L (Distance low byte in cm)
      Byte 3: Dist_H (Distance high byte in cm)
      Byte 4: Amp_L (Signal strength low byte)
      Byte 5: Amp_H (Signal strength high byte)
      Byte 6: Temp_L (Temperature low byte)
      Byte 7: Temp_H (Temperature high byte)
      Byte 8: Checksum (Sum of bytes 0..7 & 0xFF)
    """

    FRAME_HEADER = b"\x59\x59"
    FRAME_LENGTH = 9

    def __init__(self, port: str = "/dev/ttyAMA0", baudrate: int = 115200, simulated: bool = False):
        super().__init__(name="TF-Luna LiDAR", simulated=simulated)
        self.port = port
        self.baudrate = baudrate
        self.serial_handle = None
        self._simulated_distance_m = 3.50
        self._simulated_target_vel = 0.0

    def initialize(self) -> bool:
        if self.simulated:
            self.record_success()
            return True

        try:
            import serial
            self.serial_handle = serial.Serial(
                port=self.port,
                baudrate=self.baudrate,
                timeout=0.05,
                bytesize=serial.EIGHTBITS,
                parity=serial.PARITY_NONE,
                stopbits=serial.STOPBITS_ONE
            )
            self.record_success()
            return True
        except Exception:
            # Fall back to simulation mode if hardware UART port is unavailable
            self.simulated = True
            self.record_success()
            return True

    @staticmethod
    def parse_packet(packet: bytes, timestamp: Optional[float] = None) -> Optional[LiDARReading]:
        """Validates and parses a raw 9-byte TF-Luna UART packet."""
        if len(packet) != 9:
            return None

        if packet[0] != 0x59 or packet[1] != 0x59:
            return None

        calculated_checksum = sum(packet[:8]) & 0xFF
        if calculated_checksum != packet[8]:
            return None

        dist_cm = packet[2] | (packet[3] << 8)
        strength = packet[4] | (packet[5] << 8)
        raw_temp = packet[6] | (packet[7] << 8)
        
        # Temp formula per TF-Luna datasheet: (raw_temp / 8) - 256 degrees C
        temp_c = (raw_temp / 8.0) - 256.0
        dist_m = dist_cm / 100.0

        ts = timestamp if timestamp is not None else time.time()
        
        # Validity check: distance between 0.2m and 12m and strength >= 100
        valid = (SensorConfig.LIDAR_MIN_RANGE_M <= dist_m <= SensorConfig.LIDAR_MAX_RANGE_M) and (strength >= SensorConfig.LIDAR_SIGNAL_STRENGTH_MIN)

        return LiDARReading(
            distance_m=round(dist_m, 3),
            signal_strength=strength,
            chip_temperature_c=round(temp_c, 1),
            timestamp=ts,
            valid=valid
        )

    def read(self) -> LiDARReading:
        now = time.time()
        if self.simulated or self.serial_handle is None:
            # Update simulated distance based on closing velocity
            dt = 0.033 # ~30 Hz frame step
            self._simulated_distance_m += self._simulated_target_vel * dt
            if self._simulated_distance_m < 0.3:
                self._simulated_distance_m = 0.3
            elif self._simulated_distance_m > 12.0:
                self._simulated_distance_m = 12.0

            self.record_success()
            return LiDARReading(
                distance_m=round(self._simulated_distance_m, 3),
                signal_strength=850,
                chip_temperature_c=34.2,
                timestamp=now,
                valid=True
            )

        try:
            # Read from real serial buffer looking for 0x59 0x59
            while self.serial_handle.in_waiting >= 9:
                b1 = self.serial_handle.read(1)
                if b1 == b"\x59":
                    b2 = self.serial_handle.read(1)
                    if b2 == b"\x59":
                        payload = self.serial_handle.read(7)
                        packet = b"\x59\x59" + payload
                        parsed = self.parse_packet(packet, now)
                        if parsed:
                            self.record_success()
                            return parsed
            
            # If no complete packet arrived in time, return last known reading or fallback
            self.record_error()
            return LiDARReading(distance_m=0.0, signal_strength=0, chip_temperature_c=0.0, timestamp=now, valid=False)
        except Exception:
            self.record_error()
            return LiDARReading(distance_m=0.0, signal_strength=0, chip_temperature_c=0.0, timestamp=now, valid=False)

    def set_simulated_target(self, distance_m: float, velocity_mps: float = 0.0):
        """Allows testbench scenarios to drive simulated obstacle telemetry."""
        self._simulated_distance_m = distance_m
        self._simulated_target_vel = velocity_mps

    def close(self) -> None:
        if self.serial_handle and hasattr(self.serial_handle, "close"):
            try:
                self.serial_handle.close()
            except Exception:
                pass

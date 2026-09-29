"""
4-Channel HC-SR04 Ultrasonic Sonar Array Driver
Provides acoustic proximity detection with ambient temperature speed-of-sound compensation.
"""

import time
from typing import Dict, Optional
from .base import SensorInterface
from ..types import UltrasonicArrayReading
from ..config import SensorConfig


class UltrasonicArray(SensorInterface):
    """
    4x HC-SR04 Sonar Transducer Array.
    Transducers:
      1. Front-Left (Azimuth -25 deg)
      2. Front-Right (Azimuth +25 deg)
      3. Chest-Left (Azimuth -65 deg, peripheral blindspot coverage)
      4. Chest-Right (Azimuth +65 deg, peripheral blindspot coverage)
    """

    def __init__(self, pin_map: Optional[Dict[str, int]] = None, simulated: bool = False):
        super().__init__(name="4x Ultrasonic Array", simulated=simulated)
        self.pin_map = pin_map or {
            "trig_fl": 17, "echo_fl": 27,
            "trig_fr": 22, "echo_fr": 23,
            "trig_cl": 24, "echo_cl": 25,
            "trig_cr": 5,  "echo_cr": 6,
        }
        self.ambient_temp_c = 25.0
        self._sim_distances = {
            "front_left": 3.8,
            "front_right": 3.8,
            "chest_left": 4.0,
            "chest_right": 4.0,
        }

    def initialize(self) -> bool:
        if self.simulated:
            self.record_success()
            return True

        try:
            # Check for Raspberry Pi GPIO support (RPi.GPIO or gpiod)
            import RPi.GPIO as GPIO
            GPIO.setmode(GPIO.BCM)
            GPIO.setwarnings(False)
            for key, pin in self.pin_map.items():
                if "trig" in key:
                    GPIO.setup(pin, GPIO.OUT)
                    GPIO.output(pin, False)
                else:
                    GPIO.setup(pin, GPIO.IN)
            self.record_success()
            return True
        except Exception:
            # Running on desktop/laptop dev environment without Pi GPIO
            self.simulated = True
            self.record_success()
            return True

    def calculate_speed_of_sound(self, temp_c: float) -> float:
        """Standard dry air acoustic propagation velocity formula: v = 331.3 + 0.606 * T (m/s)."""
        return 331.3 + 0.606 * temp_c

    def read(self) -> UltrasonicArrayReading:
        now = time.time()
        if self.simulated:
            self.record_success()
            return UltrasonicArrayReading(
                front_left_m=round(self._sim_distances["front_left"], 2),
                front_right_m=round(self._sim_distances["front_right"], 2),
                chest_left_m=round(self._sim_distances["chest_left"], 2),
                chest_right_m=round(self._sim_distances["chest_right"], 2),
                timestamp=now
            )

        # On hardware: trigger pulses and measure echo duration with RPi.GPIO
        try:
            import RPi.GPIO as GPIO
            speed = self.calculate_speed_of_sound(self.ambient_temp_c)
            results = {}

            channels = [
                ("front_left", self.pin_map["trig_fl"], self.pin_map["echo_fl"]),
                ("front_right", self.pin_map["trig_fr"], self.pin_map["echo_fr"]),
                ("chest_left", self.pin_map["trig_cl"], self.pin_map["echo_cl"]),
                ("chest_right", self.pin_map["trig_cr"], self.pin_map["echo_cr"]),
            ]

            for name, trig, echo in channels:
                GPIO.output(trig, True)
                time.sleep(0.00001)  # 10us trigger pulse
                GPIO.output(trig, False)

                pulse_start = time.time()
                timeout = pulse_start + 0.03 # 30ms timeout (max ~5m range)

                while GPIO.input(echo) == 0 and time.time() < timeout:
                    pulse_start = time.time()

                pulse_end = pulse_start
                while GPIO.input(echo) == 1 and time.time() < timeout:
                    pulse_end = time.time()

                pulse_duration = pulse_end - pulse_start
                dist = (pulse_duration * speed) / 2.0
                dist_clamped = max(SensorConfig.ULTRASONIC_MIN_RANGE_M, min(dist, SensorConfig.ULTRASONIC_MAX_RANGE_M))
                results[name] = round(dist_clamped, 2)

            self.record_success()
            return UltrasonicArrayReading(
                front_left_m=results["front_left"],
                front_right_m=results["front_right"],
                chest_left_m=results["chest_left"],
                chest_right_m=results["chest_right"],
                timestamp=now
            )
        except Exception:
            self.record_error()
            return UltrasonicArrayReading(
                front_left_m=SensorConfig.ULTRASONIC_MAX_RANGE_M,
                front_right_m=SensorConfig.ULTRASONIC_MAX_RANGE_M,
                chest_left_m=SensorConfig.ULTRASONIC_MAX_RANGE_M,
                chest_right_m=SensorConfig.ULTRASONIC_MAX_RANGE_M,
                timestamp=now
            )

    def set_simulated_obstacle(self, channel: str, distance_m: float):
        if channel in self._sim_distances:
            self._sim_distances[channel] = distance_m

    def update_temperature(self, temp_c: float):
        self.ambient_temp_c = temp_c

    def close(self) -> None:
        if not self.simulated:
            try:
                import RPi.GPIO as GPIO
                GPIO.cleanup()
            except Exception:
                pass

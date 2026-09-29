"""
4-Zone Directional Haptic Matrix PWM Controller
Dispatches directional vibrotactile guidance to Left, Right, Chest Upper, and Chest Lower ERM motors.
"""

from typing import Dict, Optional
from ..types import HapticFeedback, HapticZone


class HapticMatrixController:
    """
    Manages 4x Eccentric Rotating Mass (ERM) or Linear Resonant Actuator (LRA) motors.
    Translates spatial obstacle bearings into distinct tactile sensations.
    """

    def __init__(self, pin_map: Optional[Dict[str, int]] = None, simulated: bool = True):
        self.simulated = simulated
        self.pin_map = pin_map or {
            "left": 12,        # GPIO 12 (PWM0)
            "right": 13,       # GPIO 13 (PWM1)
            "chest_upper": 18, # GPIO 18 (PWM0)
            "chest_lower": 19, # GPIO 19 (PWM1)
        }
        self.active_state: Dict[str, int] = {
            "left": 0,
            "right": 0,
            "chest_upper": 0,
            "chest_lower": 0,
        }

    def dispatch(self, feedback: Optional[HapticFeedback]):
        if not feedback or feedback.zone == HapticZone.NONE:
            self._all_off()
            return

        intensity = feedback.intensity_pct

        if feedback.zone == HapticZone.OMNI_PULSE:
            self._set_all(intensity)
        elif feedback.zone == HapticZone.LEFT:
            self._set_zone("left", intensity)
        elif feedback.zone == HapticZone.RIGHT:
            self._set_zone("right", intensity)
        elif feedback.zone == HapticZone.CHEST_UPPER:
            self._set_zone("chest_upper", intensity)
        elif feedback.zone == HapticZone.CHEST_LOWER:
            self._set_zone("chest_lower", intensity)

    def _set_zone(self, target_zone: str, intensity: int):
        for zone in self.active_state:
            self.active_state[zone] = intensity if zone == target_zone else 0

    def _set_all(self, intensity: int):
        for zone in self.active_state:
            self.active_state[zone] = intensity

    def _all_off(self):
        for zone in self.active_state:
            self.active_state[zone] = 0

    def get_status_str(self) -> str:
        """Returns visual representation for terminal HUD."""
        u = f"UP:[{self.active_state['chest_upper']}%]" if self.active_state['chest_upper'] > 0 else "UP:---"
        d = f"DN:[{self.active_state['chest_lower']}%]" if self.active_state['chest_lower'] > 0 else "DN:---"
        l = f"L:[{self.active_state['left']}%]" if self.active_state['left'] > 0 else "L:---"
        r = f"R:[{self.active_state['right']}%]" if self.active_state['right'] > 0 else "R:---"
        return f"{l} | {u} | {d} | {r}"

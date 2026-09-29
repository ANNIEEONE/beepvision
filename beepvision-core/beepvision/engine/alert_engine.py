"""
Threat Urgency Formulation, Dynamic Priority Suppression, and Hysteresis Debouncing Engine
"""

from typing import List, Optional, Tuple
from ..types import (
    AudioCue,
    HapticFeedback,
    HapticZone,
    ObstacleType,
    TrackedObstacle,
    UrgencyLevel,
)
from ..config import AlgorithmConfig, FeedbackConfig


class AlertUrgencyEngine:
    """
    Evaluates multi-obstacle threats, resolves cognitive sensory bottlenecks,
    and dispatches synchronized bone conduction audio and 4-zone haptics.
    """

    def __init__(
        self,
        w_dist: float = AlgorithmConfig.WEIGHT_DISTANCE,
        w_speed: float = AlgorithmConfig.WEIGHT_SPEED,
        w_threat: float = AlgorithmConfig.WEIGHT_THREAT_TYPE
    ):
        self.w_dist = w_dist
        self.w_speed = w_speed
        self.w_threat = w_threat

    def calculate_urgency(self, obstacle: TrackedObstacle) -> float:
        """
        Mathematical Urgency Formula:
          U = w_dist * (1 / d) + w_speed * max(0, -v_rel) + w_threat * C_class
        """
        dist = max(0.1, obstacle.position.distance)
        
        # Proximity term
        term_dist = self.w_dist * (1.0 / dist)
        
        # Closing speed term: only active if object is closing in (negative velocity)
        closing_speed = max(0.0, -obstacle.velocity_mps)
        term_speed = self.w_speed * closing_speed
        
        # Intrinsic hazard type weight
        term_threat = self.w_threat * obstacle.obstacle_type.base_threat_score
        
        raw_score = term_dist + term_speed + term_threat
        return round(raw_score, 2)

    def classify_urgency(self, score: float, obstacle: TrackedObstacle) -> UrgencyLevel:
        """Classifies continuous urgency score into operational alert tier."""
        dist = obstacle.position.distance
        ttc = obstacle.time_to_collision_s

        # Critical override: <0.85m proximity or <1.2s time-to-collision
        if dist <= AlgorithmConfig.CRITICAL_PROXIMITY_M or ttc <= AlgorithmConfig.CRITICAL_TTC_SECONDS or score >= AlgorithmConfig.URGENCY_CRITICAL_SCORE:
            return UrgencyLevel.CRITICAL
        elif score >= AlgorithmConfig.URGENCY_MEDIUM_SCORE or dist <= 2.2:
            return UrgencyLevel.MEDIUM
        elif score >= AlgorithmConfig.URGENCY_LOW_SCORE or dist <= 4.0:
            return UrgencyLevel.LOW
        else:
            return UrgencyLevel.CLEAR

    def evaluate(
        self, obstacles: List[TrackedObstacle]
    ) -> Tuple[List[TrackedObstacle], Optional[TrackedObstacle], Optional[AudioCue], Optional[HapticFeedback]]:
        """
        Executes:
          1. Score & Classify each obstacle
          2. Hysteresis confirmation (debounce)
          3. Dynamic Priority Suppression
          4. Synthesis of primary Audio and Haptic cues
        """
        if not obstacles:
            return [], None, None, None

        # Step 1 & 2: Score, Classify, and Debounce
        scored_obstacles: List[TrackedObstacle] = []
        for obs in obstacles:
            score = self.calculate_urgency(obs)
            level = self.classify_urgency(score, obs)

            # Hysteresis confirmation gate:
            # Must be seen for at least DEBOUNCE_CONFIRM_FRAMES to trigger warning
            if obs.consecutive_hits < AlgorithmConfig.DEBOUNCE_CONFIRM_FRAMES and level != UrgencyLevel.CRITICAL:
                effective_level = UrgencyLevel.CLEAR
            else:
                effective_level = level

            obs.urgency_score = score
            obs.urgency_level = effective_level
            obs.suppressed = False
            scored_obstacles.append(obs)

        # Sort descending by urgency score
        scored_obstacles.sort(key=lambda o: o.urgency_score, reverse=True)
        primary_threat = scored_obstacles[0] if scored_obstacles else None

        # Step 3: Dynamic Priority Suppression
        # If the primary threat is CRITICAL, suppress lower alerts so the user's attention is undivided
        if primary_threat and primary_threat.urgency_level == UrgencyLevel.CRITICAL:
            for obs in scored_obstacles[1:]:
                if (primary_threat.urgency_score - obs.urgency_score) >= AlgorithmConfig.SUPPRESSION_THRESHOLD_DELTA:
                    obs.suppressed = True

        # If primary threat is CLEAR or completely debounced, return no alerts
        if not primary_threat or primary_threat.urgency_level == UrgencyLevel.CLEAR:
            return scored_obstacles, None, None, None

        # Step 4: Synthesize Audio & Haptic commands for primary threat
        audio_cue = self._generate_audio_cue(primary_threat)
        haptic_feedback = self._generate_haptic_feedback(primary_threat)

        return scored_obstacles, primary_threat, audio_cue, haptic_feedback

    def _generate_audio_cue(self, threat: TrackedObstacle) -> AudioCue:
        # Panning based on obstacle azimuth (-60 deg to +60 deg -> -1.0 to +1.0)
        pan = max(-1.0, min(threat.position.azimuth_deg / 60.0, 1.0))

        if threat.urgency_level == UrgencyLevel.CRITICAL:
            phrase = f"Warning! {threat.obstacle_type.value.replace('_', ' ').title()} approaching close!"
            return AudioCue(
                frequency_hz=FeedbackConfig.AUDIO_CRITICAL_URGENCY_HZ,
                duration_ms=120,
                pan=round(pan, 2),
                speech_phrase=phrase
            )
        elif threat.urgency_level == UrgencyLevel.MEDIUM:
            return AudioCue(
                frequency_hz=FeedbackConfig.AUDIO_MEDIUM_URGENCY_HZ,
                duration_ms=80,
                pan=round(pan, 2),
                speech_phrase=None
            )
        else:
            return AudioCue(
                frequency_hz=FeedbackConfig.AUDIO_LOW_URGENCY_HZ,
                duration_ms=50,
                pan=round(pan, 2),
                speech_phrase=None
            )

    def _generate_haptic_feedback(self, threat: TrackedObstacle) -> HapticFeedback:
        # Determine directional quadrant
        azimuth = threat.position.azimuth_deg
        z_elevation = threat.position.z

        if threat.urgency_level == UrgencyLevel.CRITICAL:
            zone = HapticZone.OMNI_PULSE
            intensity = 100
            pattern = "continuous_buzz"
        elif z_elevation > 0.4 or threat.obstacle_type == ObstacleType.LOW_BRANCH:
            zone = HapticZone.CHEST_UPPER
            intensity = 80
            pattern = "double_pulse"
        elif z_elevation < -0.3 or threat.obstacle_type in (ObstacleType.TRENCH, ObstacleType.CURB):
            zone = HapticZone.CHEST_LOWER
            intensity = 80
            pattern = "double_pulse"
        elif azimuth < -15.0:
            zone = HapticZone.LEFT
            intensity = 70
            pattern = "single_tap"
        elif azimuth > 15.0:
            zone = HapticZone.RIGHT
            intensity = 70
            pattern = "single_tap"
        else:
            zone = HapticZone.CHEST_UPPER
            intensity = 60
            pattern = "single_tap"

        return HapticFeedback(zone=zone, intensity_pct=intensity, pulse_pattern=pattern)

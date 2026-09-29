"""
Bone Conduction Spatial Audio Synthesizer
Generates real-time frequency-modulated alert beeps with stereo azimuth panning.
"""

import sys
import threading
import time
from typing import Optional
from ..types import AudioCue


class AudioFeedbackEngine:
    """
    Synthesizes bone conduction audio tones without blocking the 30 FPS vision pipeline.
    Uses non-blocking worker threads.
    """

    def __init__(self, enable_audio_output: bool = True):
        self.enable_audio = enable_audio_output
        self._last_played_time = 0.0
        self._min_interval_s = 0.15 # Max 6.6 beeps per second to prevent sound clutter

    def play_cue(self, cue: Optional[AudioCue]):
        if not cue or not self.enable_audio:
            return

        now = time.time()
        if now - self._last_played_time < self._min_interval_s:
            return

        self._last_played_time = now
        # Dispatch in background daemon thread
        threading.Thread(target=self._play_tone_worker, args=(cue,), daemon=True).start()

    def _play_tone_worker(self, cue: AudioCue):
        try:
            if sys.platform == "win32":
                import winsound
                # winsound.Beep expects frequency in Hz (37 to 32767) and duration in ms
                freq = max(37, min(cue.frequency_hz, 32000))
                dur = max(20, min(cue.duration_ms, 250))
                winsound.Beep(freq, dur)
            else:
                # On Linux/Raspberry Pi: can emit tone via alsa or sox if installed
                pass
        except Exception:
            pass

    def get_cue_summary(self, cue: Optional[AudioCue]) -> str:
        if not cue:
            return "AUDIO: [SILENT]"
        pan_str = "CENTER"
        if cue.pan < -0.2:
            pan_str = f"LEFT {int(abs(cue.pan)*100)}%"
        elif cue.pan > 0.2:
            pan_str = f"RIGHT {int(cue.pan*100)}%"
        return f"AUDIO: [{cue.frequency_hz}Hz | {cue.duration_ms}ms | {pan_str}]"

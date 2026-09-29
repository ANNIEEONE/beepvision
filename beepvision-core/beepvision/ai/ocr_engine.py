"""
Offline OCR & Signage Reader Engine
Runs local text recognition for prescription labels, street signs, and transit notices.
"""

from typing import List, Optional


class OfflineOCREngine:
    """
    On-device OCR engine using lightweight Tesseract / PaddleOCR Mobile.
    100% offline; zero cloud transmission for user privacy.
    """

    def __init__(self):
        self.is_ready = True

    def recognize_text(self, image_data: Optional[bytes] = None) -> List[str]:
        """
        Extracts textual lines from the image.
        Returns ordered text segments.
        """
        # Placeholder / simulation adapter for testing
        return [
            "PHARMACY - DOSAGE: 1 TABLET DAILY AFTER FOOD",
            "BUS STOP 42A - DOWNTOWN EXPRESS",
            "CAUTION: WET FLOOR",
        ]

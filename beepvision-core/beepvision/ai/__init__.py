"""
BeepVision On-Device Edge AI Subsystem
"""

from .hailo_yolo import HailoYOLOv8Inference
from .ocr_engine import OfflineOCREngine

__all__ = ["HailoYOLOv8Inference", "OfflineOCREngine"]

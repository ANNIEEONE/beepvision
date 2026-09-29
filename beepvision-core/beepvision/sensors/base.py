"""
Base Sensor Interface with Health Monitoring
"""

import time
from abc import ABC, abstractmethod
from typing import Any, Dict


class SensorInterface(ABC):
    """Abstract Base Class for all BeepVision physical and simulated sensors."""
    
    def __init__(self, name: str, simulated: bool = False):
        self.name = name
        self.simulated = simulated
        self.is_healthy: bool = True
        self.last_read_time: float = 0.0
        self.consecutive_read_errors: int = 0
        self.total_reads: int = 0
        self.dropped_frames: int = 0
        
    @abstractmethod
    def initialize(self) -> bool:
        """Initialize physical bus (UART, I2C, GPIO) or simulated telemetry."""
        pass
    
    @abstractmethod
    def read(self) -> Any:
        """Poll latest measurement frame."""
        pass
    
    @abstractmethod
    def close(self) -> None:
        """Release bus handles and hardware resources."""
        pass

    def record_success(self) -> None:
        self.last_read_time = time.time()
        self.consecutive_read_errors = 0
        self.total_reads += 1
        self.is_healthy = True

    def record_error(self) -> None:
        self.consecutive_read_errors += 1
        self.dropped_frames += 1
        if self.consecutive_read_errors > 5:
            self.is_healthy = False

    def get_status(self) -> Dict[str, Any]:
        return {
            "name": self.name,
            "simulated": self.simulated,
            "healthy": self.is_healthy,
            "consecutive_errors": self.consecutive_read_errors,
            "dropped_frames": self.dropped_frames,
            "last_read_age_s": round(time.time() - self.last_read_time, 3) if self.last_read_time else None
        }

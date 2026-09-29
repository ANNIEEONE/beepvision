# BeepVision Core (`beepvision-core`)
### Embedded Edge AI, Sensor Fusion, and Urgency Engine Runtime

`beepvision-core` is the on-device software runtime for the **BeepVision Smart Assistive Wearable**, architected for Raspberry Pi 5 + Hailo-8 AI HAT (26 TOPS NPU).

---

## Architecture Overview

```
                      +---------------------------------------+
                      |           SENSORY INGESTION           |
                      |  - TF-Luna LiDAR (UART @ 115200 baud) |
                      |  - 4x HC-SR04 Ultrasonic (GPIO)       |
                      |  - MPU6050 6-Axis IMU (I2C)           |
                      |  - Sony IMX708 Camera (CSI-2 120° FOV)|
                      +-------------------+-------------------+
                                          |
                                          v
                      +---------------------------------------+
                      |         GEOMETRIC CALIBRATION         |
                      |  - IMU Dynamic Torso Pitch Correction |
                      |  - RANSAC Ground-Plane Segmentation   |
                      +-------------------+-------------------+
                                          |
                                          v
                      +---------------------------------------+
                      |         HAILO-8 EDGE INFERENCE        |
                      |  - YOLOv8n Object Detection (<15ms)   |
                      |  - 26 TOPS NPU Acceleration           |
                      +-------------------+-------------------+
                                          |
                                          v
                      +---------------------------------------+
                      |       EXTENDED KALMAN TRACKER         |
                      |  - 3D State: [x, y, z, vx, vy, vz]^T  |
                      |  - Multi-Modal Sensor Correlation     |
                      +-------------------+-------------------+
                                          |
                                          v
                      +---------------------------------------+
                      |          ALERT URGENCY ENGINE         |
                      |  - Urgency = f(dist, v_rel, threat)   |
                      |  - Dynamic Hazard Suppression         |
                      |  - Temporal Hysteresis Debouncing     |
                      +-------------------+-------------------+
                                          |
                        +-----------------+-----------------+
                        |                                   |
                        v                                   v
             +--------------------+              +--------------------+
             | SPATIAL AUDIO HMD  |              | 4-ZONE HAPTICS     |
             | Bone Conduction    |              | Directional Chest  |
             | Frequency Panning  |              | Vibration Matrix   |
             +--------------------+              +--------------------+
```

---

## Safety & Mathematical Formulations

1. **Torso Pitch Dynamic Compensation**:
   $$\begin{pmatrix} y' \\ z' \end{pmatrix} = \begin{pmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{pmatrix} \begin{pmatrix} y \\ z \end{pmatrix}$$
   When the user tilts forward (e.g., walking uphill or leaning), the system dynamically tilts coordinate frames so the flat pavement is never misclassified as an obstacle.

2. **RANSAC Ground-Plane Segmentation**:
   Fits a plane equation $Ax + By + Cz + D = 0$. Inliers within threshold $\delta = 5\text{ cm}$ are marked as navigable ground surface. Points exceeding $z > z_{\text{ground}} + \Delta h$ ($10\text{ cm}$) are flagged as potential obstacles.

3. **Urgency Formulation**:
   $$U(t) = w_{\text{dist}} \cdot \frac{1}{\max(d, 0.1)} + w_{\text{speed}} \cdot \max(0, -v_{\text{rel}}) + w_{\text{threat}} \cdot C_{\text{class}}$$
   - Approaching vehicles trigger higher urgency than stationary walls.
   - Low-priority warnings are automatically suppressed if an imminent high-urgency threat enters the safety envelope.

4. **Temporal Hysteresis Debouncing**:
   - Must be confirmed for $\ge 3$ consecutive frames before issuing an alert.
   - Cleared only after $\ge 5$ consecutive frames without detection.

---

## Running the Simulation

```bash
# Run the interactive live terminal HUD with synthetic urban telemetry
python run_simulation.py

# Run the complete test suite
python -m unittest discover tests
```

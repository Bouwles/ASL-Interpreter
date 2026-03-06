## A Basic ASL Interpreter with Mediapipe
A real-time browser-based augmented reality hand tracking system using only a webcam.
The program detects your hand, tracks 21 key points, reconstructs a 3D skeletal model, and overlays it onto your real hand with matching size and position in real time; Everything runs locally in the browser. 

___
**How it works**
* MediaPipe detects hand key points from the camera feed
* The 2D coordinates are projected into 3D space
* A 3D hand skeleton is rendered using Three.js
* Depth estimation + smoothing keeps the hand stable and aligned
* Then mediapipe checks the distance between points (fingers) and the angle between them (to see if any fingers are curved or not) then interprets the specific movements to American Sign Language.

___
**Tech Stack**
* JavaScript
* CSS
* Three.js
* MediaPipe Hands
* WebGL

___
**Run locally**

**Clone the repo:**
git clone https://github.com/Bouwles/basic-3d-hand-tracking.git
cd basic-3d-hand-tracking

**Open the file**
Since its an HTML file, it should open in your browser just by double clicking on the file.

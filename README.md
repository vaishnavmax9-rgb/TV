# 1D Quantum Tunneling & Wavepacket Simulator (V3)

A high-performance, interactive web-based physics simulator solving the 1-Dimensional Time-Dependent Schrödinger Equation (TDSE) in real time.

## Key Features
- **Explicit FDTD Physics Engine**: Implements Visscher's Staggered Leap-Frog algorithm on a 600-point spatial grid for 60 FPS stability without matrix inversion.
- **16:9 Widescreen Canvas**: Renders at 960x540 resolution with proportionally scaled potential barriers (up to 80% vertical canvas height).
- **Learning Scenarios**: One-click presets for **Easy Tunneling**, **Balanced**, and **Hard Tunneling**.
- **Full Parameter Control**: Real-time sliders for Particle Energy ($k_0$), Barrier Width (5–100 grid units), Barrier Height (0.0–2.0), and Engine Speed (1x–50x).

## Repository Structure
- `index.html` — Main entry point and modular control dashboard.
- `css/style.css` — Glassmorphism styling and responsive CSS Grid layout.
- `js/simulator.js` — Visscher FDTD solver and HTML5 Canvas rendering loop.
- `README.md` — Project documentation.

## Usage
Open `index.html` directly in any modern web browser or deploy via GitHub Pages. No build step or external dependencies required.

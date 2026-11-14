/**
 * 1D Time-Dependent Schrödinger Equation Simulator V3
 * Optimized FDTD Engine with Variable Speed and Proportional Barrier Scaling
 */

const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;   
const height = canvas.height; 

// Physics Constants & High-Res Grid
const N = 600; 
const dx = 1.0;
const dt = 0.1;
let x = new Float64Array(N);
let V = new Float64Array(N); 
let psiR = new Float64Array(N); 
let psiI = new Float64Array(N); 
let prob = new Float64Array(N); 

// DOM Elements
const inputEnergy = document.getElementById('particleEnergy');
const inputWidth = document.getElementById('barrierWidth');
const inputHeight = document.getElementById('barrierHeight');
const inputSpeed = document.getElementById('simSpeed');

const valEnergy = document.getElementById('valEnergy');
const valWidth = document.getElementById('valWidth');
const valHeight = document.getElementById('valHeight');
const valSpeed = document.getElementById('valSpeed');

const btnEasy = document.getElementById('btnEasy');
const btnBalanced = document.getElementById('btnBalanced');
const btnHard = document.getElementById('btnHard');
const scenarioBtns = [btnEasy, btnBalanced, btnHard];

const btnReset = document.getElementById('btnReset');
const btnPlayPause = document.getElementById('btnPlayPause');

let isPaused = false;

// Physics Initialization
function initWavepacket() {
    const x0 = N / 5; 
    const sigma = 25.0;
    const k0 = parseFloat(inputEnergy.value) / 10.0; 

    let norm = 0;
    for (let i = 0; i < N; i++) {
        x[i] = i;
        const envelope = Math.exp(-0.5 * Math.pow((i - x0) / sigma, 2));
        psiR[i] = envelope * Math.cos(k0 * i);
        psiI[i] = envelope * Math.sin(k0 * i);
        prob[i] = psiR[i]*psiR[i] + psiI[i]*psiI[i];
        norm += prob[i];
    }
    
    norm = Math.sqrt(norm);
    for (let i = 0; i < N; i++) {
        psiR[i] /= norm;
        psiI[i] /= norm;
    }
}

function updatePotential() {
    const center = N / 2;
    const bWidth = parseFloat(inputWidth.value);
    const bHeight = parseFloat(inputHeight.value) * 0.05; 

    for (let i = 0; i < N; i++) {
        if (i >= center - bWidth/2 && i <= center + bWidth/2) {
            V[i] = bHeight;
        } else {
            V[i] = 0;
        }
    }
}

// Numerical Engine
function stepFDTD() {
    for (let i = 1; i < N - 1; i++) {
        psiR[i] -= dt * ( -0.5 * (psiI[i+1] - 2*psiI[i] + psiI[i-1])/(dx*dx) + V[i]*psiI[i] );
    }
    for (let i = 1; i < N - 1; i++) {
        psiI[i] += dt * ( -0.5 * (psiR[i+1] - 2*psiR[i] + psiR[i-1])/(dx*dx) + V[i]*psiR[i] );
    }
    psiR[0] = psiR[N-1] = psiI[0] = psiI[N-1] = 0;

    for (let i = 0; i < N; i++) {
        prob[i] = psiR[i]*psiR[i] + psiI[i]*psiI[i];
    }
}

// Rendering Engine
function draw() {
    ctx.clearRect(0, 0, width, height);
    
    // 1. Draw Barrier (Appropriately Sized)
    ctx.fillStyle = 'rgba(255, 87, 34, 0.4)';
    const maxV = 2.0 * 0.05; 
    for (let i = 0; i < N; i++) {
        if (V[i] > 0) {
            const h = (V[i] / maxV) * (height * 0.80); 
            ctx.fillRect(i * (width / N), height - h, Math.ceil(width / N), h);
        }
    }

    // 2. Draw Probability Density (Primary Wave)
    ctx.beginPath();
    ctx.strokeStyle = '#66fcf1';
    ctx.lineWidth = 2.5;
    for (let i = 0; i < N; i++) {
        const px = i * (width / N);
        const py = height - prob[i] * height * 60; 
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.stroke();
    
    // 3. Draw Real Wavefunction (Background Oscillations)
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(197, 198, 199, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i < N; i++) {
        const px = i * (width / N);
        const py = height/2 - psiR[i] * height * 6; 
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.stroke();
}

function loop() {
    if (!isPaused) {
        const speed = parseInt(inputSpeed.value);
        for(let k=0; k<speed; k++) {
            stepFDTD();
        }
    }
    draw();
    requestAnimationFrame(loop);
}

// UI Event Handlers
function updateDisplays() {
    valEnergy.textContent = parseFloat(inputEnergy.value).toFixed(1);
    valWidth.textContent = inputWidth.value;
    valHeight.textContent = parseFloat(inputHeight.value).toFixed(1);
    valSpeed.textContent = inputSpeed.value;
}

function applyScenario(energy, b_width, b_height, activeBtn) {
    inputEnergy.value = energy;
    inputWidth.value = b_width;
    inputHeight.value = b_height;
    
    scenarioBtns.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
    
    updateDisplays();
    updatePotential();
    initWavepacket();
}

inputEnergy.addEventListener('input', updateDisplays);
inputEnergy.addEventListener('change', initWavepacket); 

inputWidth.addEventListener('input', () => { updateDisplays(); updatePotential(); });
inputHeight.addEventListener('input', () => { updateDisplays(); updatePotential(); });
inputSpeed.addEventListener('input', updateDisplays);

btnEasy.addEventListener('click', () => applyScenario(4.0, 15, 0.4, btnEasy));
btnBalanced.addEventListener('click', () => applyScenario(2.0, 30, 1.0, btnBalanced));
btnHard.addEventListener('click', () => applyScenario(1.0, 50, 1.8, btnHard));

btnReset.addEventListener('click', initWavepacket);
btnPlayPause.addEventListener('click', () => {
    isPaused = !isPaused;
    btnPlayPause.textContent = isPaused ? 'Play' : 'Pause';
});

// Boot Sequence
updateDisplays();
updatePotential();
initWavepacket();
loop();

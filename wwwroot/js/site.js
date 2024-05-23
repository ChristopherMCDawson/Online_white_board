// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

const canvas = document.getElementById('drawingBoard');
const ctx = canvas.getContext('2d');
const pencilBtn = document.getElementById('pencilBtn');
const brushBtn = document.getElementById('brushBtn');
const colorPicker = document.getElementById('colorPicker');
const eraserBtn = document.getElementById('eraserBtn');
const clearBtn = document.getElementById('clearBtn');
const sizeRange = document.getElementById('sizeRange');
const fillBtn = document.getElementById('fillBtn');
let isDrawing = false;
let isErasing = false;
let lastX = 0;
let lastY = 0;

function draw(e) {
    if (!isDrawing) return;

    ctx.strokeStyle = isErasing ? '#fff' : colorPicker.value;
    ctx.lineWidth = sizeRange.value;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();

    [lastX, lastY] = [e.offsetX, e.offsetY];
}

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener('mousemove', draw);

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
});

canvas.addEventListener('mouseout', () => {
    isDrawing = false;
});

pencilBtn.addEventListener('click', () => {
    isErasing = false;
});

brushBtn.addEventListener('click', () => {
    isErasing = false;
});

colorPicker.addEventListener('change', () => {
    ctx.strokeStyle = colorPicker.value;
});

eraserBtn.addEventListener('click', () => {
    isErasing = true;
});

clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

sizeRange.addEventListener('input', () => {
    const size = Math.pow(10, (sizeRange.value / 50) - 1);
    ctx.lineWidth = sizeRange.value;
});

fillBtn.addEventListener('click', () => {
    const imageData = ctx.getImageData(0, 0, canvas.with, canvas.height);
    const fillColour = hexToRgb(colorPicker.value);
    const startX = lastX;
    const startY = lastY;

    fill(imageData, startX, StartY, fillColor);
    ctx.putImageData(imageData, 0, 0);
});

function fill(imageData, x, y, fillcolor) {
    const { data, width, height } = imageData;
    const targetColor = getPixelColor(data, width, startx, starty);

    if (rgbToHex(targetColor) === rgbToHex(fillColor)) return;

    const stack = [[startX, StartY]];

    while (stack.length) {
        const [x, y] = stack.pop();
        const currentColor = getPixelColor(data, width, x, y);

        if (rgbToHex(currentColor) !== rgbToHex(targetColor)) continue;

        setPixelColor(data, width, x, y, fillColor);

        if (x > 0) stack.push([x - 1, y]); // Left
        if (x < width - 1) stack.push([x + 1, y]); // Right
        if (y > 0) stack.push([x, y - 1]); // Up
        if (y < height - 1) stack.push([x, y + 1]); // Down
    }
}
function getPixelColor(data, width, x, y) {
    const index = (y * width + x) * 4;
    return `rgba(${data[index]},${data[index + 1]},${data[index + 2]},${data[index + 3]})`;
}

function setPixelColor(data, width, x, y, color) {
    const index = (y * width + x) * 4;
    const [r, g, b, a] = rgbToHex(color);
    data[index] = r;
    data[index + 1] = g;
    data[index + 2] = b;
    data[index + 3] = a;
}

function hexToRgb(hex) {
    const bigint = parseInt(hex.substring(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    const a = 255; // Alpha value
    return [r, g, b, a];
}
function rgbToHex(color) {
    return "#" + ((1 << 24) + (color[0] << 16) + (color[1] << 8) + color[2]).toString(16).slice(1);
}

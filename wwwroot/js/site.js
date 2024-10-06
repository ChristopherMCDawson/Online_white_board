document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById('drawingBoard');
    const ctx = canvas.getContext('2d');

    const pencilBtn = document.getElementById('pencilBtn');
    const brushBtn = document.getElementById('brushBtn');
    const colorPicker = document.getElementById('colorPicker');
    const eraserBtn = document.getElementById('eraserBtn');
    const clearBtn = document.getElementById('clearBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const sizeRange = document.getElementById('sizeRange');

    const drawRectangleBtn = document.getElementById('drawRectangleBtn');
    const drawCircleBtn = document.getElementById('drawCircleBtn');
    const drawLineBtn = document.getElementById('drawLineBtn');

    const emojiBtn = document.getElementById('emojiBtn');
    const emojiPicker = document.getElementById('emojiPicker');

    let isDrawing = false;
    let drawingShape = null; // Keeps track of the selected shape
    let startX = 0;
    let startY = 0;
    let selectedEmoji = null;
    let isStampingEmoji = false;

    // General drawing function for freehand drawing
    function draw(e) {
        if (!isDrawing || drawingShape) return;

        ctx.strokeStyle = colorPicker.value;
        ctx.lineWidth = sizeRange.value;

        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();

        [startX, startY] = [e.offsetX, e.offsetY];
    }

    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        [startX, startY] = [e.offsetX, e.offsetY];
        if (drawingShape) {
            drawShape(e.offsetX, e.offsetY);
        } else if (isStampingEmoji) {
            stampEmoji(e.offsetX, e.offsetY);
        }
    });

    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', () => {
        isDrawing = false;
        ctx.beginPath(); // Reset path to avoid connecting shapes
    });

    canvas.addEventListener('mouseout', () => {
        isDrawing = false;
    });

    pencilBtn.addEventListener('click', () => {
        drawingShape = null;
        isStampingEmoji = false;
    });

    brushBtn.addEventListener('click', () => {
        drawingShape = null;
        isStampingEmoji = false;
    });

    eraserBtn.addEventListener('click', () => {
        drawingShape = null;
        isStampingEmoji = false;
    });

    clearBtn.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    sizeRange.addEventListener('input', () => {
        ctx.lineWidth = sizeRange.value;
    });

    colorPicker.addEventListener('change', () => {
        ctx.strokeStyle = colorPicker.value;
    });

    // Function to draw shapes on the canvas
    function drawShape(endX, endY) {
        ctx.strokeStyle = colorPicker.value;
        ctx.lineWidth = sizeRange.value;

        if (drawingShape === 'rectangle') {
            ctx.strokeRect(startX, startY, endX - startX, endY - startY);
        } else if (drawingShape === 'circle') {
            const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
            ctx.beginPath();
            ctx.arc(startX, startY, radius, 0, Math.PI * 2);
            ctx.stroke();
        } else if (drawingShape === 'line') {
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }

        ctx.beginPath(); // Reset the path after drawing the shape
        drawingShape = null;
    }

    drawRectangleBtn.addEventListener('click', () => {
        drawingShape = 'rectangle';
    });

    drawCircleBtn.addEventListener('click', () => {
        drawingShape = 'circle';
    });

    drawLineBtn.addEventListener('click', () => {
        drawingShape = 'line';
    });

    // Emoji Picker Logic
    emojiBtn.addEventListener('click', () => {
        isStampingEmoji = true;
        drawingShape = null;
        // Show emoji picker to let the user select
        selectedEmoji = prompt("Enter your emoji:"); // A basic input for emoji selection
    });

    // Function to stamp the selected emoji on the canvas
    function stampEmoji(x, y) {
        if (selectedEmoji) {
            ctx.font = "40px Arial";
            ctx.fillText(selectedEmoji, x, y); // Draw the emoji at the clicked location
        }
    }

    // Function to download the canvas image
    function downloadImage() {
        const filename = prompt("Enter filename:") || "canvas_image";
        const link = document.createElement('a');
        link.download = `${filename}.png`;
        link.href = canvas.toDataURL();
        link.click();
    }

    downloadBtn.addEventListener('click', downloadImage);
});

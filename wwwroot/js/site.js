// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById('drawingBoard');
    const ctx = canvas.getContext('2d');
    const pencilBtn = document.getElementById('pencilBtn');
    const brushBtn = document.getElementById('brushBtn');
    const colorPicker = document.getElementById('colorPicker');
    const eraserBtn = document.getElementById('eraserBtn');
    const clearBtn = document.getElementById('clearBtn');
    const sizeRange = document.getElementById('sizeRange');
    const downloadBtn = document.getElementById('downloadBtn');

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
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mouseout', () => isDrawing = false);

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
        ctx.lineWidth = sizeRange.value;
    });


    // Function to download the canvas image
    function downloadImage() {
        const link = document.createElement('a');
        link.download = 'canvas_image.png';
        link.href = canvas.toDataURL();
        link.click();
    }

    // Event listener for the download button
    downloadBtn.addEventListener('click', downloadImage);

});

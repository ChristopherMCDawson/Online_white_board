document.addEventListener("DOMContentLoaded", function () {
    const stage = new Konva.Stage({
        container: 'drawingBoard',
        width: 1080,
        height: 900
    });

    const layer = new Konva.Layer();
    stage.add(layer);

    const pencilBtn = document.getElementById('pencilBtn');
    const brushBtn = document.getElementById('brushBtn');
    const colorPicker = document.getElementById('colorPicker');
    const eraserBtn = document.getElementById('eraserBtn');
    const clearBtn = document.getElementById('clearBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const saveBtn = document.getElementById('saveBtn');
    const loadBtn = document.getElementById('loadBtn');
    const textBoxBtn = document.getElementById('textBoxBtn');
    const saveFileBtn = document.getElementById('saveFileBtn');
    const loadFileBtn = document.getElementById('loadFileBtn');
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const sizeRange = document.getElementById('sizeRange');
    const fileInput = document.getElementById('fileInput');

    let isDrawing = false;
    let isErasing = false;
    let mode = 'pencil';
    let lastLine;
    let brushSize = 5; // Default brush size

    function addLine() {
        lastLine = new Konva.Line({
            stroke: colorPicker.value,
            strokeWidth: brushSize,
            globalCompositeOperation: isErasing ? 'destination-out' : 'source-over',
            points: []
        });
        layer.add(lastLine);
    }

    stage.on('mousedown touchstart', (e) => {
        isDrawing = true;
        addLine();
        const pos = stage.getPointerPosition();
        lastLine.points([pos.x, pos.y]);
    });

    stage.on('mousemove touchmove', (e) => {
        if (!isDrawing) return;
        const pos = stage.getPointerPosition();
        let newPoints = lastLine.points().concat([pos.x, pos.y]);
        lastLine.points(newPoints);
        layer.batchDraw();
    });

    stage.on('mouseup touchend', () => {
        isDrawing = false;
    });

    pencilBtn.addEventListener('click', () => {
        mode = 'pencil';
        isErasing = false;
    });

    brushBtn.addEventListener('click', () => {
        mode = 'brush';
        isErasing = false;
    });

    eraserBtn.addEventListener('click', () => {
        mode = 'eraser';
        isErasing = true;
    });

    colorPicker.addEventListener('change', () => {
        ctx.strokeStyle = colorPicker.value;
    });

    clearBtn.addEventListener('click', () => {
        layer.clear();
    });

    sizeRange.addEventListener('input', () => {
        brushSize = sizeRange.value;
    });

    // Function to save the canvas image to local storage
    function saveImage() {
        localStorage.setItem('canvasImage', stage.toDataURL());
    }

    // Function to load the saved canvas image from local storage
    function loadImage() {
        const savedImageData = localStorage.getItem('canvasImage');
        if (savedImageData) {
            const img = new Image();
            img.onload = function () {
                ctx.drawImage(img, 0, 0);
            };
            img.src = savedImageData;
        } else {
            alert('No saved image found.');
        }
    }

    // Event listeners for the save and load buttons
    saveBtn.addEventListener('click', saveImage);
    loadBtn.addEventListener('click', loadImage);

    // Function to download the canvas image
    function downloadImage() {
        const filename = prompt("Enter filename:") || "canvas_image";
        const link = document.createElement('a');
        link.download = `${filename}.png`;
        link.href = stage.toDataURL();
        link.click();
    }

    // Event listener for the download button
    downloadBtn.addEventListener('click', downloadImage);
});

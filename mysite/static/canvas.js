document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('drawing-board');
    const ctx = canvas.getContext('2d');
    const container = document.querySelector('.canvas-container');

    // Tools
    const colorPicker = document.getElementById('stroke-color');
    const widthSlider = document.getElementById('line-width');
    const clearBtn = document.getElementById('clear-canvas');
    const downloadBtn = document.getElementById('download-canvas');

    let isDrawing = false;

    // 1. Resize Canvas to fit container
    function resizeCanvas() {
        // Set actual canvas size to match the CSS display size
        canvas.width = container.clientWidth;
        canvas.height = 500; // Fixed height for consistency

        // Reset context styles after resize
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = colorPicker.value;
        ctx.lineWidth = widthSlider.value;
        ctx.fillStyle = "#ffffff"; // White background
        ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill background
    }

    // Initialize size
    resizeCanvas();
    window.addEventListener('resize', () => {
        // Optional: debounce this in production
        // resizeCanvas(); // Warning: Resizing clears the canvas!
    });

    // 2. Drawing Functions
    function startDraw(e) {
        isDrawing = true;
        ctx.beginPath();
        draw(e);
    }

    function endDraw() {
        isDrawing = false;
        ctx.beginPath(); // Reset path to prevent connecting lines
    }

    function draw(e) {
        if (!isDrawing) return;

        // Get correct coordinates (Mouse vs Touch)
        let clientX, clientY;
        if (e.type.includes('touch')) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
            e.preventDefault(); // Stop scrolling while drawing on mobile
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        // Calculate position relative to canvas
        const rect = canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.lineWidth = widthSlider.value;
        ctx.strokeStyle = colorPicker.value;

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    // 3. Event Listeners (Mouse)
    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mouseup', endDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseout', endDraw);

    // 4. Event Listeners (Touch - for PWA Mobile)
    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchend', endDraw);
    canvas.addEventListener('touchmove', draw, { passive: false });

    // 5. Tool Actions

    // Update settings instantly
    colorPicker.addEventListener('change', (e) => ctx.strokeStyle = e.target.value);
    widthSlider.addEventListener('change', (e) => ctx.lineWidth = e.target.value);

    // Clear Canvas
    clearBtn.addEventListener('click', () => {
        if(confirm("Clear your drawing?")) {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    });

    // Download Image
    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = `my-creation-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
});


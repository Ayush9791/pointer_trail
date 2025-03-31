document.addEventListener("DOMContentLoaded", () => {
    // Create and configure the canvas element for the trail.
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
  
    // Create the custom cursor element.
    const customCursor = document.createElement("div");
    customCursor.classList.add("custom-cursor");
    document.body.appendChild(customCursor);
  
    // Resize the canvas to always fill the window.
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
  
    let mousePositions = [];
    const trailLength = 20; // How many past positions to use for the trail.
    let lastPos = { x: 0, y: 0 };
    let isMoving = false;
  
    // Listen for mouse movements.
    document.addEventListener("mousemove", (event) => {
      // Update the last known pointer position.
      lastPos = { x: event.clientX, y: event.clientY };
  
      // Add the new position to the trail.
      mousePositions.push(lastPos);
      if (mousePositions.length > trailLength) {
        mousePositions.shift(); // Keep the trail at a fixed length.
      }
  
      // Hide the custom cursor (it appears only when the pointer stops).
      customCursor.style.display = "none";
  
      // Mark that the pointer is moving.
      isMoving = true;
  
      // Add the "moving" class to increase cursor size when moving.
      customCursor.classList.add("moving");
    });
  
    // Draw the trail on the canvas.
    function drawTrail() {
      // Clear the entire canvas.
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      // Only draw if the pointer is moving.
      if (isMoving && mousePositions.length > 1) {
        ctx.beginPath();
        ctx.lineWidth = 4; // Thickness of the trail.
        ctx.strokeStyle = "rgba(255, 255, 255, 0.7)"; // Trail color.
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
  
        // Begin at the oldest position.
        ctx.moveTo(mousePositions[0].x, mousePositions[0].y);
        for (let i = 1; i < mousePositions.length; i++) {
          ctx.lineTo(mousePositions[i].x, mousePositions[i].y);
        }
        ctx.stroke();
      }
  
      // Smoothly move the trail to the current position when stopped.
      if (!isMoving && mousePositions.length > 0) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
  
        // Draw a line from the last position to the current final position.
        ctx.moveTo(mousePositions[mousePositions.length - 1].x, mousePositions[mousePositions.length - 1].y);
        ctx.lineTo(lastPos.x, lastPos.y);
        ctx.stroke();
      }
  
      // Request the next frame.
      requestAnimationFrame(drawTrail);
    }
    drawTrail();
  
    let stopTimer = null;
    // Reset the cursor and trail behavior when the pointer stops moving.
    document.addEventListener("mousemove", () => {
      if (stopTimer) clearTimeout(stopTimer);
      stopTimer = setTimeout(() => {
        isMoving = false; // Set the mouse as "stopped"
        customCursor.style.left = lastPos.x + "px";
        customCursor.style.top = lastPos.y + "px";
        customCursor.style.display = "block"; // Show custom cursor
  
        // Reset trail positions when the mouse stops.
        mousePositions = [];
      }, 100);
    });
  });
  
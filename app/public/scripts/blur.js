function createColorfulBlur() {
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    canvas.style.filter = 'blur(80px)';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let w, h;

    // Resize canvas to fill window
    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Blob configuration
    const blobs = [];
    const blobCount = 6;

    for (let i = 0; i < blobCount; i++) {
        // Bias toward dark yellow (hue around 45-50) but allow other colors
        const isDarkYellow = Math.random() < 0.5;
        const hue = isDarkYellow 
        ? 40 + Math.random() * 20  // Dark yellow range
        : Math.random() * 360;      // Any other color
        
        blobs.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 2.25,
        vy: (Math.random() - 0.5) * 2.25,
        radius: 200 + Math.random() * 300,
        hue: hue,
        hueSpeed: (Math.random() - 0.5) * 3
        });
  }

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, w, h);

    blobs.forEach(blob => {
      // Update position
      blob.x += blob.vx;
      blob.y += blob.vy;

      // Bounce off edges
      if (blob.x < -blob.radius || blob.x > w + blob.radius) blob.vx *= -1;
      if (blob.y < -blob.radius || blob.y > h + blob.radius) blob.vy *= -1;

      // Keep blobs within bounds
      blob.x = Math.max(-blob.radius, Math.min(w + blob.radius, blob.x));
      blob.y = Math.max(-blob.radius, Math.min(h + blob.radius, blob.y));

      // Update color
      blob.hue += blob.hueSpeed;
      if (blob.hue > 360) blob.hue -= 360;
      if (blob.hue < 0) blob.hue += 360;

      // Draw blob with gradient
      const gradient = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.radius);
      gradient.addColorStop(0, `hsla(${blob.hue}, 80%, 60%, 0.45)`);
      gradient.addColorStop(0.5, `hsla(${blob.hue + 30}, 70%, 50%, 0.25)`);
      gradient.addColorStop(1, `hsla(${blob.hue + 60}, 60%, 40%, 0.05)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();

  // Return cleanup function
  return () => {
    window.removeEventListener('resize', resize);
    document.body.removeChild(canvas);
  };
}



let stopBlur = () => {};

function refreshBlur() {
    let blur = document.getElementById("colorful-blur").checked;
    if (blur) {
        stopBlur = createColorfulBlur();
    } else {
        stopBlur();
    }
    localStorage.setItem("colorful-blur", blur);
}

document.getElementById("colorful-blur").addEventListener("change", () => {
    refreshBlur();
});

document.getElementById("colorful-blur").checked = localStorage.getItem("colorful-blur") == "true";
refreshBlur();
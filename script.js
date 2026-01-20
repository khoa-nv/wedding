// Initialize AOS Animation Library
AOS.init({
  once: true,
});

// MARQUEE EFFECT - Seamless loop
const marqueeContainer = document.querySelector(".marquee-container");
const marqueeContent = document.querySelector(".marquee-content");



// FALLING PETALS EFFECT
const canvas = document.getElementById("sparkle-canvas");
const ctx = canvas.getContext("2d");

let particles = [];
let width, height;

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

window.addEventListener("resize", resize);
resize();

class Petal {
  constructor() {
    this.reset(true); // true = start at random y
  }

  reset(randomY = false) {
    this.x = Math.random() * width;
    this.y = randomY ? Math.random() * height : -20;
    this.size = Math.random() * 10 + 5; // Larger than sparkles
    this.speedY = Math.random() * 1 + 0.5;
    this.speedX = Math.random() * 1 - 0.5;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = (Math.random() - 0.5) * 2;
    this.opacity = Math.random() * 0.5 + 0.3;
    // Petal colors: White, Pale Pink, Misty Rose
    const colors = [
      "rgba(255,255,255,",
      "rgba(255,228,225,",
      "rgba(255,240,245,",
    ];
    this.colorBase = colors[Math.floor(Math.random() * colors.length)];
    this.time = Math.random() * 100; // For sine wave sway
  }

  update() {
    this.y += this.speedY;
    this.x += Math.sin(this.time) * 0.5 + this.speedX; // Sway logic
    this.rotation += this.rotationSpeed;
    this.time += 0.01;

    // Wrap around bottom
    if (this.y > height + 20) {
      this.reset();
    }

    // Wrap horizontal
    if (this.x > width) this.x = 0;
    if (this.x < 0) this.x = width;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.fillStyle = this.colorBase + this.opacity + ")";

    // Draw Petal Shape (Ellipse-ish)
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, 2 * Math.PI);
    ctx.fill();

    ctx.restore();
  }
}

function initParticles() {
  particles = [];
  const particleCount = 60; // Fewer but larger
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Petal());
  }
}

// Mouse Ripple Effect (Replacing Dust)
let ripples = [];
window.addEventListener("click", (e) => {
  // Create a ripple on click
  ripples.push({
    x: e.clientX,
    y: e.clientY,
    radius: 0,
    opacity: 1,
  });
});

window.addEventListener("mousemove", (e) => {
  if (Math.random() > 0.9) {
    // Occasional ripple on move
    ripples.push({
      x: e.clientX,
      y: e.clientY,
      radius: 0,
      opacity: 0.5,
    });
  }
});

function gameLoop() {
  ctx.clearRect(0, 0, width, height);

  // Draw Petals
  particles.forEach((p) => {
    p.update();
    p.draw();
  });

  // Draw Ripples
  for (let i = 0; i < ripples.length; i++) {
    let r = ripples[i];
    r.radius += 1;
    r.opacity -= 0.01;

    if (r.opacity <= 0) {
      ripples.splice(i, 1);
      i--;
      continue;
    }

    ctx.strokeStyle = `rgba(212, 165, 165, ${r.opacity})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  requestAnimationFrame(gameLoop);
}

initParticles();
gameLoop();

// Fullscreen Toggle & Marquee Overlay logic
const fullscreenBtn = document.getElementById("fullscreen-btn");
const icon = fullscreenBtn.querySelector("i");
const overlay = document.getElementById("fullscreen-overlay");

if (fullscreenBtn) {
  fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`,
        );
      });
    } else {
      document.exitFullscreen();
    }
  });

  // Update icon on change & Toggle Overlay
  document.addEventListener("fullscreenchange", () => {
    const marqueeInner = document.querySelector('.fs-marquee-content');
    const marqueeContainer = document.querySelector('.fs-marquee-container');
    const endScreen = document.querySelector('.fs-end-screen');

    if (document.fullscreenElement) {
      icon.classList.remove("fa-expand");
      icon.classList.add("fa-compress");
      
      // Show Overlay
      if (overlay) overlay.classList.add("active");
      
      // Bring petals to front
      document.body.classList.add("fullscreen-active");

      // Reset Animation Sequence
      if(marqueeInner) {
         // Reset: Remove class, force reflow, add class
         marqueeInner.classList.remove('play');
         void marqueeInner.offsetWidth; /* trigger reflow */
         marqueeInner.classList.add('play');
         
         // Ensure container is visible
         marqueeContainer.style.opacity = '1';
         marqueeContainer.style.transition = 'opacity 1s';
         
         // Listen for animation end
         marqueeInner.onanimationend = () => {
             marqueeContainer.style.opacity = '0'; // Fade out text
             setTimeout(() => {
                 if(endScreen) endScreen.classList.add('visible'); // Fade in names
             }, 1000);
         };
      }
      
      // Ensure end screen is hidden initially
      if(endScreen) endScreen.classList.remove('visible');

    } else {
      icon.classList.remove("fa-compress");
      icon.classList.add("fa-expand");
      
      // Hide Overlay
      if (overlay) overlay.classList.remove("active");
      
      // Reset petals
      document.body.classList.remove("fullscreen-active");

      // Reset States
      if(endScreen) endScreen.classList.remove('visible');
      if(marqueeContainer) marqueeContainer.style.opacity = '1';
      if(marqueeInner) marqueeInner.classList.remove('play');
    }
  });

  // Close Button Logic
  const closeBtn = document.getElementById("fs-close-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    });
  }
}

// Initialize AOS Animation Library
AOS.init({
    once: true,
});

// Mobile Menu Toggle
const burger = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('.nav-links');

burger.addEventListener('click', () => {
    nav.classList.toggle('active');
    // Simple icon toggle logic
    const icon = burger.querySelector('i');
    if(nav.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// MARQUEE EFFECT - Seamless loop
const marqueeContainer = document.querySelector('.marquee-container');
const marqueeContent = document.querySelector('.marquee-content');

// Clone content to ensure seamless scrolling
const clone = marqueeContent.cloneNode(true);
marqueeContainer.appendChild(clone);

gsap.to('.marquee-content', {
    xPercent: -100,
    repeat: -1,
    duration: 30, // Adjust speed
    ease: "linear"
}).totalProgress(0.5); // Start halfway to avoid initial jump if any


// FALLING PETALS EFFECT
const canvas = document.getElementById('sparkle-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let width, height;

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
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
        const colors = ['rgba(255,255,255,', 'rgba(255,228,225,', 'rgba(255,240,245,'];
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
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.fillStyle = this.colorBase + this.opacity + ')';
        
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
window.addEventListener('click', (e) => {
   // Create a ripple on click
   ripples.push({
       x: e.clientX, 
       y: e.clientY,
       radius: 0,
       opacity: 1
   });
});

window.addEventListener('mousemove', (e) => {
    if(Math.random() > 0.9) { // Occasional ripple on move
        ripples.push({
            x: e.clientX, 
            y: e.clientY,
            radius: 0,
            opacity: 0.5
        });
    }
});

function gameLoop() {
    ctx.clearRect(0, 0, width, height);
    
    // Draw Petals
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    // Draw Ripples
    for(let i=0; i<ripples.length; i++) {
        let r = ripples[i];
        r.radius += 1;
        r.opacity -= 0.01;
        
        if(r.opacity <= 0) {
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

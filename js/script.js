/* =====================================================
   Mahmoud Abdullah | Chemical Engineering Portfolio
   External Scripts — js/script.js
   ===================================================== */

/* ===== PAGE LOADER ===== */
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("pageLoader").classList.add("hidden");
  }, 800);
});

/* ===== APPLY SAVED THEME ON LOAD ===== */
(function () {
  const saved = localStorage.getItem("theme");
  const html = document.documentElement;
  if (saved === "light") {
    html.classList.remove("dark");
    html.classList.add("light");
    const icon = document.getElementById("toggleIcon");
    if (icon) icon.textContent = "\u2600\uFE0F";
  }
})();

/* ===== THEME TOGGLE ===== */
function toggleTheme() {
  const html = document.documentElement;
  const isLight = html.classList.contains("light");
  if (isLight) {
    html.classList.remove("light");
    html.classList.add("dark");
    document.getElementById("toggleIcon").textContent = "\u{1F319}";
    localStorage.setItem("theme", "dark");
  } else {
    html.classList.remove("dark");
    html.classList.add("light");
    document.getElementById("toggleIcon").textContent = "\u2600\uFE0F";
    localStorage.setItem("theme", "light");
  }
}

/* ===== MOBILE MENU ===== */
function toggleMobileMenu() {
  const menu = document.getElementById("mobileMenu");
  menu.classList.toggle("open");
}

/* ===== NAVBAR SCROLL EFFECT & ACTIVE LINK ===== */
window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  if (window.scrollY > 50) navbar.classList.add("scrolled");
  else navbar.classList.remove("scrolled");

  const sections = ["home", "about", "skills", "courses", "contact"];
  let current = "home";
  sections.forEach((id) => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 100) current = id;
  });
  document.querySelectorAll("nav a").forEach((a) => {
    a.classList.remove("text-secondary", "border-b-2", "border-secondary");
    if (a.getAttribute("href") === "#" + current) {
      a.classList.add("text-secondary");
    }
  });
});

/* ===== INTERSECTION OBSERVER — SCROLL FADE-IN ===== */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".fade-in-up:not(.visible)").forEach((el) =>
  observer.observe(el)
);

/* ===== PARTICLE CANVAS ===== */
(function () {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let W, H, particles = [];

  function resize() {
    const section = canvas.parentElement;
    W = canvas.width = section.offsetWidth;
    H = canvas.height = section.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 1.8 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.35 + 0.05;
      this.life = 0;
      this.maxLife = Math.random() * 300 + 150;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      const prog = this.life / this.maxLife;
      this.alpha =
        this.opacity *
        (prog < 0.1 ? prog * 10 : prog > 0.9 ? (1 - prog) * 10 : 1);
      if (
        this.life > this.maxLife ||
        this.x < 0 || this.x > W ||
        this.y < 0 || this.y > H
      ) this.reset();
    }
    draw() {
      const isDark = document.documentElement.classList.contains("dark");
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = isDark
        ? `rgba(0,209,255,${this.alpha})`
        : `rgba(0,150,200,${this.alpha * 0.6})`;
      ctx.fill();
    }
  }

  function drawConnections() {
    const isDark = document.documentElement.classList.contains("dark");
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.08;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = isDark
            ? `rgba(0,209,255,${alpha})`
            : `rgba(0,120,180,${alpha * 0.5})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: 60 }, () => new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p) => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", resize);
  init();
  animate();
})();

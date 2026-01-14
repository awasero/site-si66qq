/**
 * Awasero - Venture Software House
 * JavaScript for animations, interactions, and the abstract background
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================
  // Abstract Canvas Background
  // Represents: Code, AI, Caracas/Venezuela
  // =========================================
  class AbstractBackground {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.particles = [];
      this.connections = [];
      this.codeSymbols = [];
      this.mountainPoints = [];
      this.mouse = { x: null, y: null };
      this.accentColor = '#ffffff';
      this.accentColorLight = 'rgba(255, 255, 255, 0.3)';
      this.accentColorFaint = 'rgba(255, 255, 255, 0.08)';

      this.init();
      this.animate();
      this.handleResize();
      this.handleMouse();
    }

    init() {
      this.resize();
      this.createParticles();
      this.createCodeSymbols();
      this.createMountainSilhouette();
    }

    resize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }

    handleResize() {
      let resizeTimeout;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          this.resize();
          this.particles = [];
          this.codeSymbols = [];
          this.mountainPoints = [];
          this.createParticles();
          this.createCodeSymbols();
          this.createMountainSilhouette();
        }, 250);
      });
    }

    handleMouse() {
      window.addEventListener('mousemove', (e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
      });

      window.addEventListener('mouseout', () => {
        this.mouse.x = null;
        this.mouse.y = null;
      });
    }

    // Create floating particles representing nodes/data points
    createParticles() {
      const particleCount = Math.floor((this.width * this.height) / 25000);

      for (let i = 0; i < particleCount; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.5 + 0.2,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.02 + 0.01
        });
      }
    }

    // Create floating code symbols (brackets, operators)
    createCodeSymbols() {
      const symbols = ['{ }', '< />', '( )', '[ ]', '= >', '&&', '||', '++', '::', '//'];
      const symbolCount = Math.floor(this.width / 200);

      for (let i = 0; i < symbolCount; i++) {
        this.codeSymbols.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          symbol: symbols[Math.floor(Math.random() * symbols.length)],
          size: Math.random() * 12 + 10,
          speedY: (Math.random() - 0.5) * 0.15,
          speedX: (Math.random() - 0.5) * 0.1,
          opacity: Math.random() * 0.15 + 0.05,
          rotation: Math.random() * 0.1 - 0.05
        });
      }
    }

    // Create abstract mountain silhouette inspired by Avila Mountain (Caracas)
    createMountainSilhouette() {
      const segments = 50;
      const baseY = this.height * 0.85;

      for (let i = 0; i <= segments; i++) {
        const x = (i / segments) * this.width;
        // Create mountain-like curve
        const noise1 = Math.sin(i * 0.2) * 30;
        const noise2 = Math.sin(i * 0.5) * 15;
        const noise3 = Math.sin(i * 0.1) * 50;
        const mainPeak = Math.sin((i / segments) * Math.PI) * 80;

        const y = baseY - mainPeak - noise1 - noise2 - noise3;

        this.mountainPoints.push({ x, y, baseY });
      }
    }

    // Draw network connections between nearby particles
    drawConnections() {
      const maxDistance = 150;

      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const dx = this.particles[i].x - this.particles[j].x;
          const dy = this.particles[i].y - this.particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.15;
            this.ctx.beginPath();
            this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            this.ctx.lineWidth = 0.5;
            this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
            this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
            this.ctx.stroke();
          }
        }

        // Connect to mouse if nearby
        if (this.mouse.x && this.mouse.y) {
          const dx = this.particles[i].x - this.mouse.x;
          const dy = this.particles[i].y - this.mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 200) {
            const opacity = (1 - distance / 200) * 0.3;
            this.ctx.beginPath();
            this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            this.ctx.lineWidth = 1;
            this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
            this.ctx.lineTo(this.mouse.x, this.mouse.y);
            this.ctx.stroke();
          }
        }
      }
    }

    // Draw particles
    drawParticles() {
      this.particles.forEach(particle => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.pulse += particle.pulseSpeed;

        // Wrap around edges
        if (particle.x < 0) particle.x = this.width;
        if (particle.x > this.width) particle.x = 0;
        if (particle.y < 0) particle.y = this.height;
        if (particle.y > this.height) particle.y = 0;

        // Pulsing opacity
        const pulseOpacity = particle.opacity * (0.7 + Math.sin(particle.pulse) * 0.3);

        // Draw particle
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${pulseOpacity})`;
        this.ctx.fill();
      });
    }

    // Draw floating code symbols
    drawCodeSymbols() {
      this.ctx.font = '14px "Space Grotesk", monospace';

      this.codeSymbols.forEach(symbol => {
        // Update position
        symbol.x += symbol.speedX;
        symbol.y += symbol.speedY;

        // Wrap around edges
        if (symbol.x < -50) symbol.x = this.width + 50;
        if (symbol.x > this.width + 50) symbol.x = -50;
        if (symbol.y < -50) symbol.y = this.height + 50;
        if (symbol.y > this.height + 50) symbol.y = -50;

        // Draw symbol
        this.ctx.save();
        this.ctx.translate(symbol.x, symbol.y);
        this.ctx.rotate(symbol.rotation);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${symbol.opacity})`;
        this.ctx.font = `${symbol.size}px "Space Grotesk", monospace`;
        this.ctx.fillText(symbol.symbol, 0, 0);
        this.ctx.restore();
      });
    }

    // Draw abstract mountain silhouette
    drawMountain() {
      if (this.mountainPoints.length === 0) return;

      // Draw filled mountain
      this.ctx.beginPath();
      this.ctx.moveTo(0, this.height);

      this.mountainPoints.forEach((point, index) => {
        if (index === 0) {
          this.ctx.lineTo(point.x, point.y);
        } else {
          // Smooth curve
          const prev = this.mountainPoints[index - 1];
          const cpX = (prev.x + point.x) / 2;
          this.ctx.quadraticCurveTo(prev.x, prev.y, cpX, (prev.y + point.y) / 2);
        }
      });

      this.ctx.lineTo(this.width, this.height);
      this.ctx.closePath();

      // Gradient fill
      const gradient = this.ctx.createLinearGradient(0, this.height * 0.6, 0, this.height);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.03)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      this.ctx.fillStyle = gradient;
      this.ctx.fill();

      // Draw mountain outline
      this.ctx.beginPath();
      this.mountainPoints.forEach((point, index) => {
        if (index === 0) {
          this.ctx.moveTo(point.x, point.y);
        } else {
          const prev = this.mountainPoints[index - 1];
          const cpX = (prev.x + point.x) / 2;
          this.ctx.quadraticCurveTo(prev.x, prev.y, cpX, (prev.y + point.y) / 2);
        }
      });
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    }

    // Draw geometric grid pattern
    drawGrid() {
      const gridSize = 80;
      const offset = Date.now() * 0.01 % gridSize;

      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      this.ctx.lineWidth = 0.5;

      // Vertical lines
      for (let x = -offset; x < this.width + gridSize; x += gridSize) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, this.height);
        this.ctx.stroke();
      }

      // Horizontal lines
      for (let y = -offset; y < this.height + gridSize; y += gridSize) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(this.width, y);
        this.ctx.stroke();
      }
    }

    // Draw subtle gradient orbs
    drawOrbs() {
      const orbs = [
        { x: this.width * 0.2, y: this.height * 0.3, radius: 300 },
        { x: this.width * 0.8, y: this.height * 0.7, radius: 250 },
        { x: this.width * 0.5, y: this.height * 0.5, radius: 400 }
      ];

      orbs.forEach(orb => {
        const gradient = this.ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, orb.radius
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.03)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        this.ctx.beginPath();
        this.ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
      });
    }

    animate() {
      // Clear canvas
      this.ctx.clearRect(0, 0, this.width, this.height);

      // Draw layers (back to front)
      this.drawOrbs();
      this.drawGrid();
      this.drawMountain();
      this.drawConnections();
      this.drawParticles();
      this.drawCodeSymbols();

      requestAnimationFrame(() => this.animate());
    }
  }

  // Initialize canvas background
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    new AbstractBackground(canvas);
  }

  // =========================================
  // Mobile Menu
  // =========================================
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileMenu.classList.remove('translate-x-full');
      document.body.style.overflow = 'hidden';
    });
  }

  if (mobileMenuClose && mobileMenu) {
    mobileMenuClose.addEventListener('click', () => {
      mobileMenu.classList.add('translate-x-full');
      document.body.style.overflow = '';
    });
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('translate-x-full');
      document.body.style.overflow = '';
    });
  });

  // =========================================
  // Smooth Scroll for Navigation
  // =========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navHeight = document.querySelector('nav')?.offsetHeight || 80;
        const targetPosition = target.offsetTop - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // =========================================
  // Navigation Scroll Effects
  // =========================================
  const nav = document.getElementById('main-nav');
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (nav) {
      if (currentScrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }

    lastScrollY = currentScrollY;
  }, { passive: true });

  // =========================================
  // Intersection Observer for Reveal Animations
  // =========================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe sections
  document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    revealObserver.observe(section);
  });

  // =========================================
  // Counter Animation for Statistics
  // =========================================
  const animateCounter = (element, target, suffix = '') => {
    const duration = 2000;
    const startTime = performance.now();
    const startValue = 0;

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart);

      element.textContent = currentValue + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target + suffix;
      }
    };

    requestAnimationFrame(updateCounter);
  };

  // Observe counter elements
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const countValue = element.getAttribute('data-count');

        if (countValue) {
          const target = parseInt(countValue, 10);
          animateCounter(element, target, '+');
          counterObserver.unobserve(element);
        }
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => {
    counterObserver.observe(el);
  });

  // =========================================
  // FAQ Accordion Enhancement
  // =========================================
  document.querySelectorAll('details').forEach(detail => {
    detail.addEventListener('toggle', () => {
      if (detail.open) {
        // Close other open details
        document.querySelectorAll('details[open]').forEach(otherDetail => {
          if (otherDetail !== detail) {
            otherDetail.removeAttribute('open');
          }
        });
      }
    });
  });

  // =========================================
  // Form Submission Handler
  // =========================================
  const newsletterForm = document.querySelector('footer form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        // Show success feedback
        emailInput.value = '';
        emailInput.placeholder = 'Subscribed!';
        setTimeout(() => {
          emailInput.placeholder = 'Email';
        }, 3000);
      }
    });
  }

  // =========================================
  // Active Navigation Link
  // =========================================
  const updateActiveNavLink = () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPosition = window.scrollY + 150;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  // =========================================
  // Console Branding
  // =========================================
  console.log(
    '%c ▄▀█ █░█░█ ▄▀█ █▀ █▀▀ █▀█ █▀█ ',
    'color: #ffffff; font-size: 14px; font-weight: bold;'
  );
  console.log(
    '%c █▀█ ▀▄▀▄▀ █▀█ ▄█ ██▄ █▀▄ █▄█ ',
    'color: #ffffff; font-size: 14px; font-weight: bold;'
  );
  console.log(
    '%cVenture Software House',
    'color: #888; font-size: 12px;'
  );
  console.log(
    '%cPartnering with non-technical founders',
    'color: #666; font-size: 11px;'
  );
  console.log(
    '%c→ partners@awasero.com',
    'color: #fff; font-size: 11px;'
  );

  // =========================================
  // Prefers Reduced Motion Check
  // =========================================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Disable canvas animations
    const bgCanvas = document.getElementById('bg-canvas');
    if (bgCanvas) {
      bgCanvas.style.display = 'none';
    }

    // Remove transition styles from sections
    document.querySelectorAll('section').forEach(section => {
      section.style.transition = 'none';
      section.style.opacity = '1';
      section.style.transform = 'none';
    });
  }
});

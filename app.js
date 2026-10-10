/* --- MOOLZEN INTERACTIVE JS --- */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Navigation scroll activation background
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 1b. Theme Toggle System (Default Dark Mode)
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme === 'light') {
    document.body.classList.remove('dark-theme');
  } else {
    document.body.classList.add('dark-theme');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      const isDark = document.body.classList.contains('dark-theme');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }

  // 2. Mobile drawer hamburger navigation menu toggle
  const hamburgerMenu = document.getElementById('hamburger-menu');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburgerMenu && mobileMenu) {
    hamburgerMenu.addEventListener('click', () => {
      const expanded = hamburgerMenu.getAttribute('aria-expanded') === 'true';
      hamburgerMenu.setAttribute('aria-expanded', !expanded);
      mobileMenu.classList.toggle('active');
      hamburgerMenu.classList.toggle('open');
    });

    // Close mobile menu when links are clicked
    mobileMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburgerMenu.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('active');
        hamburgerMenu.classList.remove('open');
      });
    });
  }

  // 3. FAQ Expandable Accordions
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      
      // Close all other FAQs for clean navigation
      faqQuestions.forEach(other => {
        if (other !== question) {
          other.setAttribute('aria-expanded', 'false');
          const answer = document.getElementById(other.getAttribute('aria-controls'));
          if (answer) {
            answer.hidden = true;
          }
        }
      });

      // Toggle current FAQ
      question.setAttribute('aria-expanded', !isExpanded);
      const answer = document.getElementById(question.getAttribute('aria-controls'));
      if (answer) {
        answer.hidden = isExpanded;
      }
    });
  });

  // 4. Sandbox Mock Stock Live Price Fluctuations (Makes site feel incredibly active!)
  const mockStocks = [
    { id: 'ZOMATO', price: 180.50, prev: 174.90, currency: '₹' },
    { id: 'TATA-MOTORS', price: 950.40, prev: 933.60, currency: '₹' },
    { id: 'PAYTM', price: 380.00, prev: 396.25, currency: '₹' },
    { id: 'NYKAA', price: 165.20, prev: 167.70, currency: '₹' },
    { id: 'RELIANCE', price: 2900.00, prev: 2902.50, currency: '₹' },
    { id: 'HDFC-BANK', price: 1450.00, prev: 1442.80, currency: '₹' },
    { id: 'INFY', price: 1420.00, prev: 1403.15, currency: '₹' },
    { id: 'APPLE', price: 180.00, prev: 178.60, currency: '$' },
    { id: 'TSLA', price: 175.50, prev: 181.85, currency: '$' },
    { id: 'ITC', price: 430.00, prev: 425.30, currency: '₹' }
  ];

  const tickerContainer = document.getElementById('stock-ticker');

  // Populate Ticker items
  function buildTicker() {
    if (!tickerContainer) return;
    
    // Double items for seamless loop infinite scroll
    const items = [...mockStocks, ...mockStocks];
    tickerContainer.innerHTML = '';

    items.forEach((stock, idx) => {
      const diff = stock.price - stock.prev;
      const pct = (diff / stock.prev) * 100;
      const isUp = pct >= 0;
      
      const item = document.createElement('div');
      item.className = 'ticker-item';
      item.id = `ticker-${stock.id}-${idx}`;
      item.innerHTML = `
        <strong>${stock.id}</strong>
        <span>${stock.currency}${stock.price.toFixed(2)}</span>
        <span class="pct ${isUp ? 'up' : 'down'}">${isUp ? '+' : ''}${pct.toFixed(2)}%</span>
      `;
      tickerContainer.appendChild(item);
    });
  }

  buildTicker();

  // Run price fluctuation interval simulations
  setInterval(() => {
    mockStocks.forEach(stock => {
      // Small fluctuate index between -0.35% and +0.35%
      const changePercent = (Math.random() * 0.7 - 0.35) / 100;
      const originalPrice = stock.price;
      stock.price = stock.price * (1 + changePercent);
      
      // Update values in the UI DOM seamlessly
      const elements = document.querySelectorAll('.ticker-item');
      elements.forEach(el => {
        if (el.querySelector('strong').textContent === stock.id) {
          const diff = stock.price - stock.prev;
          const pct = (diff / stock.prev) * 100;
          const isUp = pct >= 0;
          
          el.querySelector('span:nth-child(2)').textContent = `${stock.currency}${stock.price.toFixed(2)}`;
          const pctEl = el.querySelector('.pct');
          pctEl.textContent = `${isUp ? '+' : ''}${pct.toFixed(2)}%`;
          pctEl.className = `pct ${isUp ? 'up' : 'down'}`;
        }
      });

      // Update the active mockup elements in hero panel if visible
      const mockupRows = document.querySelectorAll('.mockup-list .list-row');
      mockupRows.forEach(row => {
        const strongEl = row.querySelector('.stock-info strong');
        if (strongEl && strongEl.textContent === stock.id) {
          const diff = stock.price - stock.prev;
          const pct = (diff / stock.prev) * 100;
          const isUp = pct >= 0;
          
          const priceEl = row.querySelector('.stock-price');
          priceEl.innerHTML = `
            ${stock.currency}${stock.price.toFixed(2)}
            <span class="price-change">${isUp ? '+' : ''}${pct.toFixed(2)}%</span>
          `;
          priceEl.className = `stock-price ${isUp ? 'text-green' : 'text-red'}`;
        }
      });
    });
  }, 2500);

  // 5. Hero virtual capital numbers count-up animation
  const countEl = document.getElementById('count-net-worth');
  if (countEl) {
    let startVal = 995000.00;
    const endVal = 1000000.00;
    const duration = 2000;
    const steps = 60;
    const increment = (endVal - startVal) / steps;
    let stepCount = 0;

    const timer = setInterval(() => {
      startVal += increment;
      countEl.textContent = `₹${startVal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      stepCount++;
      
      if (stepCount >= steps) {
        clearInterval(timer);
        countEl.textContent = `₹${endVal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
    }, duration / steps);
  }

  // 6. Dynamic domain detection: Rewrite links to app.moolzen.com if accessed via .in domain
  const currentHost = window.location.hostname;
  if (currentHost.includes('moolzen.in') || currentHost.includes('vercel.app') || currentHost.includes('localhost') || currentHost.includes('127.0.0.1')) {
    const links = document.querySelectorAll('a[href*="app.moolzen.com"]');
    links.forEach(link => {
      link.href = link.href.replace('app.moolzen.com', 'app.moolzen.in');
    });
  }

  // 7. Live Market Sync for Bento Card
  const marketBadge = document.querySelector('#feat-marketsync .visual-market-badge');
  if (marketBadge) {
    const BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:5050/api'
      : window.location.hostname.endsWith('.moolzen.in')
        ? 'https://api.moolzen.in/api'
        : 'https://api.moolzen.com/api';

    fetch(`${BASE_URL}/stocks/market-status`)
      .then(res => res.json())
      .then(data => {
        if (data.open) {
          marketBadge.className = 'visual-market-badge online';
          marketBadge.querySelector('span:nth-child(2)').textContent = 'LIVE MARKET';
        } else {
          marketBadge.className = 'visual-market-badge offline';
          marketBadge.querySelector('span:nth-child(2)').textContent = 'MARKET CLOSED';
        }
      })
      .catch(() => {
        // Fallback to closed
        marketBadge.className = 'visual-market-badge offline';
        marketBadge.querySelector('span:nth-child(2)').textContent = 'MARKET CLOSED';
      });
  }

  // 8. Initialize Dynamic Robinhood-Inspired Fintech Background Engine
  initDynamicBackground();
});

/* ========================================================
   ROBINHOOD-INSPIRED DYNAMIC FINTECH BACKGROUND ENGINE
   - Fluid animated financial curves with glowing inflection nodes
   - Abstract floating candlestick silhouettes and volume tags
   - Interactive cursor spotlight aura & wave repulsion physics
   - Smooth multi-plane scroll parallax depth
   - High-performance, battery-conscious requestAnimationFrame loop
   - Full prefers-reduced-motion and mobile responsive handling
   ======================================================== */
function initDynamicBackground() {
  const canvas = document.getElementById('moolzen-market-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const cursorOrb = document.getElementById('bg-orb-cursor');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let isMobile = false;

  // Cursor tracking with smoothed lerp
  let mouseX = -1000;
  let mouseY = -1000;
  let targetMouseX = -1000;
  let targetMouseY = -1000;
  let cursorX = -1000;
  let cursorY = -1000;
  let hasMovedMouse = false;

  // Scroll tracking with lerp
  let currentScrollY = window.scrollY || 0;
  let targetScrollY = window.scrollY || 0;

  // Time / Animation loop
  let animationFrameId = null;
  let isPaused = false;
  let lastTime = performance.now();
  let time = 0;

  // Floating Candlestick data models
  const candleCount = 10;
  const candlesticks = [];

  function initCandlesticks() {
    candlesticks.length = 0;
    const count = isMobile ? 5 : candleCount;
    for (let i = 0; i < count; i++) {
      candlesticks.push({
        xRel: (i + 0.5) / count + (Math.random() * 0.08 - 0.04),
        yRel: 0.12 + Math.random() * 0.76,
        bodyWidth: isMobile ? 6 : 9,
        bodyHeight: 18 + Math.random() * 32,
        wickTop: 10 + Math.random() * 20,
        wickBottom: 10 + Math.random() * 20,
        isGreen: Math.random() > 0.28,
        phase: Math.random() * Math.PI * 2,
        opacity: isMobile ? 0.08 : 0.14 + Math.random() * 0.08,
        parallaxFactor: 0.14 + Math.random() * 0.24
      });
    }
  }

  // Floating market coordinate labels
  const dataTags = [
    { text: '▲ +24.8% ALPHA', xRel: 0.12, yRel: 0.32, phase: 0 },
    { text: '₹10,00,000 MOCK SIM', xRel: 0.82, yRel: 0.22, phase: 1.5 },
    { text: '● 24/5 SPOT LIQUIDITY', xRel: 0.86, yRel: 0.68, phase: 3.1 },
    { text: 'VOL: 1.48M CTR', xRel: 0.09, yRel: 0.78, phase: 4.2 }
  ];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    isMobile = width < 768;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    initCandlesticks();

    if (prefersReducedMotion) {
      drawStatic();
    }
  }

  // Passive desktop mouse listeners
  window.addEventListener('mousemove', (e) => {
    targetMouseX = e.clientX;
    targetMouseY = e.clientY;
    if (!hasMovedMouse) {
      hasMovedMouse = true;
      cursorX = targetMouseX;
      cursorY = targetMouseY;
      if (cursorOrb) cursorOrb.classList.add('active');
    }
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    if (cursorOrb) cursorOrb.classList.remove('active');
  });

  // Passive scroll listener
  window.addEventListener('scroll', () => {
    targetScrollY = window.scrollY || 0;
  }, { passive: true });

  // Calculate market curve Y position with fluid harmonics & mouse interaction
  function getCurveY(x, t, isDark) {
    const normX = x / width;
    
    // Bullish upward trajectory from left to right
    const baseSlope = height * (0.62 - normX * 0.34);

    // Multi-frequency wave harmonics for natural organic flow
    const wave1 = Math.sin(normX * 4.2 + t * 0.75) * 32;
    const wave2 = Math.cos(normX * 8.4 - t * 0.45) * 16;
    const wave3 = Math.sin(normX * 13.5 + t * 1.1) * 8;

    // Scroll-based parallax wave translation
    const scrollEffect = Math.sin(normX * 3.2 + currentScrollY * 0.0016) * 20 - (currentScrollY * 0.05);

    let y = baseSlope + wave1 + wave2 + wave3 + scrollEffect;

    // Interactive mouse repulsion elastic physics (desktop)
    if (!isMobile && hasMovedMouse) {
      const dx = x - mouseX;
      const dy = y - mouseY;
      const dist = Math.hypot(dx, dy);
      const radius = 200;
      if (dist < radius) {
        const factor = (1 - dist / radius);
        const push = factor * factor * 38;
        y += (mouseY > y ? -push : push);
      }
    }

    return y;
  }

  // Primary animation render loop
  function draw(timestamp) {
    const dt = Math.min((timestamp - lastTime) / 1000, 0.1);
    lastTime = timestamp;
    time += dt;

    // Smooth cursor interpolation
    mouseX += (targetMouseX - mouseX) * 0.08;
    mouseY += (targetMouseY - mouseY) * 0.08;
    cursorX += (targetMouseX - cursorX) * 0.08;
    cursorY += (targetMouseY - cursorY) * 0.08;

    if (cursorOrb && hasMovedMouse) {
      cursorOrb.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
    }

    // Smooth scroll interpolation
    currentScrollY += (targetScrollY - currentScrollY) * 0.08;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const isDark = document.body.classList.contains('dark-theme');

    // 1. Draw floating candlesticks
    drawCandlesticks(time, isDark);

    // 2. Draw floating market data tags
    if (!isMobile) {
      drawDataTags(time, isDark);
    }

    // 3. Draw secondary dashed comparative market curve
    drawSecondaryCurve(time, isDark);

    // 4. Draw primary Robinhood-inspired bullish market curve
    drawPrimaryCurve(time, isDark);

    if (!isPaused && !prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(draw);
    }
  }

  function drawCandlesticks(t, isDark) {
    candlesticks.forEach((c) => {
      const yFloat = Math.sin(t * 0.6 + c.phase) * 14;
      const scrollOffset = (currentScrollY * c.parallaxFactor) % height;
      let curY = ((c.yRel * height + yFloat - scrollOffset) % height);
      if (curY < -60) curY += height + 120;
      if (curY > height + 60) curY -= height + 120;

      const curX = c.xRel * width;
      const alpha = isDark ? c.opacity : c.opacity * 0.7;

      const fillColor = c.isGreen
        ? (isDark ? `rgba(16, 185, 129, ${alpha})` : `rgba(16, 185, 129, ${alpha * 0.8})`)
        : (isDark ? `rgba(244, 63, 94, ${alpha * 0.75})` : `rgba(239, 68, 68, ${alpha * 0.6})`);

      const strokeColor = c.isGreen
        ? (isDark ? `rgba(52, 211, 153, ${alpha * 1.3})` : `rgba(16, 185, 129, ${alpha})`)
        : (isDark ? `rgba(251, 113, 133, ${alpha})` : `rgba(239, 68, 68, ${alpha})`);

      ctx.save();
      // Wick
      ctx.beginPath();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1.2;
      ctx.moveTo(curX, curY - c.wickTop);
      ctx.lineTo(curX, curY + c.bodyHeight + c.wickBottom);
      ctx.stroke();

      // Body
      ctx.fillStyle = fillColor;
      ctx.fillRect(curX - c.bodyWidth / 2, curY, c.bodyWidth, c.bodyHeight);

      if (c.isGreen && isDark) {
        ctx.strokeStyle = `rgba(52, 211, 153, ${alpha * 0.5})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(curX - c.bodyWidth / 2, curY, c.bodyWidth, c.bodyHeight);
      }
      ctx.restore();
    });
  }

  function drawDataTags(t, isDark) {
    ctx.save();
    ctx.font = '600 10px Inter, monospace';
    ctx.fillStyle = isDark ? 'rgba(148, 163, 184, 0.18)' : 'rgba(75, 85, 99, 0.22)';
    dataTags.forEach((tag) => {
      const floatY = Math.sin(t * 0.4 + tag.phase) * 8;
      const x = tag.xRel * width;
      let y = (tag.yRel * height + floatY - (currentScrollY * 0.08) % height);
      if (y < 20) y += height;
      ctx.fillText(tag.text, x, y);
    });
    ctx.restore();
  }

  function drawSecondaryCurve(t, isDark) {
    const step = isMobile ? 24 : 12;
    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([5, 8]);
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = isDark ? 'rgba(52, 211, 153, 0.22)' : 'rgba(16, 185, 129, 0.18)';

    let started = false;
    for (let x = 0; x <= width + step; x += step) {
      const normX = x / width;
      const baseSlope = height * (0.68 - normX * 0.30);
      const wave = Math.sin(normX * 5.0 - t * 0.55) * 26 + Math.cos(normX * 9.5 + t * 0.35) * 14;
      const y = baseSlope + wave - (currentScrollY * 0.04);
      if (!started) {
        ctx.moveTo(x, y);
        started = true;
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    ctx.restore();
  }

  function drawPrimaryCurve(t, isDark) {
    const step = isMobile ? 16 : 8;
    const points = [];

    for (let x = 0; x <= width + step; x += step) {
      points.push({ x, y: getCurveY(x, t, isDark) });
    }

    if (points.length < 2) return;

    // 1. Fluid Area Gradient Fill under the curve
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const xc = (points[i - 1].x + points[i].x) / 2;
      const yc = (points[i - 1].y + points[i].y) / 2;
      ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
    }
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();

    const fillGrad = ctx.createLinearGradient(0, height * 0.25, 0, height);
    if (isDark) {
      fillGrad.addColorStop(0, 'rgba(16, 185, 129, 0.15)');
      fillGrad.addColorStop(0.4, 'rgba(52, 211, 153, 0.05)');
      fillGrad.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
    } else {
      fillGrad.addColorStop(0, 'rgba(16, 185, 129, 0.08)');
      fillGrad.addColorStop(0.5, 'rgba(52, 211, 153, 0.02)');
      fillGrad.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
    }
    ctx.fillStyle = fillGrad;
    ctx.fill();
    ctx.restore();

    // 2. High-Fidelity Stroke with Glowing Bloom
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const xc = (points[i - 1].x + points[i].x) / 2;
      const yc = (points[i - 1].y + points[i].y) / 2;
      ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
    }

    const strokeGrad = ctx.createLinearGradient(0, 0, width, 0);
    if (isDark) {
      strokeGrad.addColorStop(0, 'rgba(16, 185, 129, 0.55)');
      strokeGrad.addColorStop(0.5, 'rgba(52, 211, 153, 0.95)');
      strokeGrad.addColorStop(1, 'rgba(132, 204, 22, 0.90)');
      ctx.shadowColor = 'rgba(52, 211, 153, 0.55)';
      ctx.shadowBlur = isMobile ? 8 : 16;
    } else {
      strokeGrad.addColorStop(0, 'rgba(16, 185, 129, 0.65)');
      strokeGrad.addColorStop(0.5, 'rgba(5, 150, 105, 0.90)');
      strokeGrad.addColorStop(1, 'rgba(13, 148, 136, 0.85)');
      ctx.shadowColor = 'rgba(16, 185, 129, 0.35)';
      ctx.shadowBlur = 8;
    }

    ctx.strokeStyle = strokeGrad;
    ctx.lineWidth = isMobile ? 2.0 : 2.8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    ctx.restore();

    // 3. Glowing Inflection Highlight Nodes
    const nodeFractions = isMobile ? [0.35, 0.82] : [0.18, 0.42, 0.68, 0.90];
    nodeFractions.forEach((frac, idx) => {
      const ptX = frac * width;
      const ptY = getCurveY(ptX, t, isDark);
      const pulse = Math.sin(t * 2.2 + idx * 1.5);
      const radius = 3.5;
      const glowRadius = 8 + pulse * 4;

      ctx.save();
      // Outer breathing halo
      ctx.beginPath();
      ctx.arc(ptX, ptY, Math.max(glowRadius, 2), 0, Math.PI * 2);
      ctx.fillStyle = isDark
        ? `rgba(52, 211, 153, ${0.22 + pulse * 0.1})`
        : `rgba(16, 185, 129, ${0.16 + pulse * 0.08})`;
      ctx.fill();

      // Inner core node
      ctx.beginPath();
      ctx.arc(ptX, ptY, radius, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? '#ffffff' : '#059669';
      ctx.shadowColor = isDark ? 'rgba(52, 211, 153, 0.9)' : 'rgba(16, 185, 129, 0.6)';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.restore();
    });
  }

  function drawStatic() {
    ctx.clearRect(0, 0, width, height);
    const isDark = document.body.classList.contains('dark-theme');
    drawPrimaryCurve(1.5, isDark);
  }

  // Lifecycle & Performance Optimization: Pause when page is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isPaused = true;
    } else {
      isPaused = false;
      lastTime = performance.now();
      if (!prefersReducedMotion) {
        requestAnimationFrame(draw);
      }
    }
  });

  window.addEventListener('resize', () => {
    resize();
  });

  // Re-draw immediately if theme changes
  const observer = new MutationObserver(() => {
    if (prefersReducedMotion) {
      drawStatic();
    }
  });
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  resize();

  if (!prefersReducedMotion) {
    lastTime = performance.now();
    requestAnimationFrame(draw);
  }
}


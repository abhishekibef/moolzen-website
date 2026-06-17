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
});


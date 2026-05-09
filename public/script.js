// ============================================================
// script.js — Dr. Sanjukta Banerjee Website
// Frontend + Appointment Booking
// ============================================================


// ── 1. MOBILE MENU ─────────────────────────────────────────

function toggleMenu() {

  const navLinks = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');

  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
}

document.querySelectorAll('.nav-links a').forEach(link => {

  link.addEventListener('click', () => {

    document.getElementById('navLinks').classList.remove('open');
    document.getElementById('hamburger').classList.remove('active');
  });
});


// ── 2. SCROLL REVEAL ───────────────────────────────────────

const revealObserver = new IntersectionObserver((entries) => {

  entries.forEach(entry => {

    if (entry.isIntersecting) {

      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });

}, { threshold: 0.12 });

document.querySelectorAll('.reveal')
  .forEach(el => revealObserver.observe(el));


// ── 3. STICKY NAVBAR ───────────────────────────────────────

window.addEventListener('scroll', () => {

  const nav = document.querySelector('nav');

  if (window.scrollY > 20) {
    nav.style.boxShadow = '0 4px 24px rgba(0,0,0,0.08)';
  } else {
    nav.style.boxShadow = 'none';
  }
});


// ── 4. ACTIVE NAV LINK ─────────────────────────────────────

const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {

  entries.forEach(entry => {

    if (entry.isIntersecting) {

      navAnchors.forEach(a =>
        a.classList.remove('active-link')
      );

      const active = document.querySelector(
        `.nav-links a[href="#${entry.target.id}"]`
      );

      if (active) {
        active.classList.add('active-link');
      }
    }
  });

}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));


// ── 5. SMOOTH SCROLL ───────────────────────────────────────

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

  anchor.addEventListener('click', function(e) {

    const target = document.querySelector(
      this.getAttribute('href')
    );

    if (target) {

      e.preventDefault();

      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});


// ── 6. STATS COUNTER ───────────────────────────────────────

function animateCounter(el, target, suffix) {

  let current = 0;

  const steps = 60;

  const increment = target / steps;

  const timer = setInterval(() => {

    current += increment;

    if (current >= target) {

      current = target;

      clearInterval(timer);
    }

    el.textContent = Math.floor(current) + suffix;

  }, 30);
}

const statsObserver = new IntersectionObserver((entries) => {

  entries.forEach(entry => {

    if (entry.isIntersecting) {

      const vals = document.querySelectorAll('.stat-val');

      if (vals[0]) animateCounter(vals[0], 25, '+');
      if (vals[1]) animateCounter(vals[1], 10, 'K+');
      if (vals[2]) animateCounter(vals[2], 98, '%');

      statsObserver.disconnect();
    }
  });

}, { threshold: 0.5 });

const statsSection = document.querySelector('.hero-stats');

if (statsSection) {
  statsObserver.observe(statsSection);
}


// ── 7. BACK TO TOP BUTTON ──────────────────────────────────

const backToTopBtn = document.createElement('button');

backToTopBtn.innerHTML = '↑';

backToTopBtn.title = 'Back to top';

backToTopBtn.style.cssText = `
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #2E8B57;
  color: #fff;
  font-size: 20px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(46,139,87,0.35);
  display: none;
  z-index: 999;
  transition: background 0.2s, transform 0.2s;
`;

document.body.appendChild(backToTopBtn);

backToTopBtn.addEventListener('mouseenter', () => {

  backToTopBtn.style.background = '#1f6b40';
  backToTopBtn.style.transform = 'translateY(-3px)';
});

backToTopBtn.addEventListener('mouseleave', () => {

  backToTopBtn.style.background = '#2E8B57';
  backToTopBtn.style.transform = 'translateY(0)';
});

backToTopBtn.addEventListener('click', () => {

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

window.addEventListener('scroll', () => {

  backToTopBtn.style.display =
    window.scrollY > 400 ? 'block' : 'none';
});


// ── 8. TOAST HELPER ────────────────────────────────────────

function showToast(message) {

  const old = document.querySelector('.site-toast');

  if (old) old.remove();

  const toast = document.createElement('div');

  toast.className = 'site-toast';

  toast.textContent = message;

  toast.style.cssText = `
    position: fixed;
    bottom: 90px;
    right: 32px;
    background: #1a2624;
    color: #fff;
    padding: 14px 22px;
    border-radius: 12px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    z-index: 1000;
    max-width: 320px;
    animation: fadeInUp 0.3s ease;
  `;

  document.body.appendChild(toast);

  setTimeout(() => {

    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.4s';

    setTimeout(() => toast.remove(), 400);

  }, 3000);
}


// ── 9. TOAST STYLES ────────────────────────────────────────

const toastStyle = document.createElement('style');

toastStyle.textContent = `

  @keyframes fadeInUp {

    from {
      opacity: 0;
      transform: translateY(16px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .nav-links a.active-link {
    color: #2E8B57 !important;
    font-weight: 600;
  }

  .form-error {
    display: block;
    color: #e53e3e;
    font-size: 12px;
    margin-top: 5px;
    min-height: 16px;
  }

  .form-fail {
    display: none;
    background: #fff5f5;
    color: #c53030;
    border: 1.5px solid #feb2b2;
    border-radius: 12px;
    padding: 14px 18px;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    margin-top: 12px;
  }

  #fname.invalid,
  #fphone.invalid,
  #femail.invalid {

    border-color: #e53e3e !important;

    box-shadow:
      0 0 0 3px rgba(229,62,62,.12) !important;
  }
`;

document.head.appendChild(toastStyle);


// ── 10. BOOKING FORM ───────────────────────────────────────

async function submitForm() {

  const name = document.getElementById('fname').value.trim();

  const phone = document.getElementById('fphone').value.trim();

  const email = document.getElementById('femail').value.trim();

  const message = document.getElementById('fgoals').value.trim();

  const btn = document.getElementById('submitBtn');

  const success = document.getElementById('formSuccess');

  const fail = document.getElementById('formFail');


  // Clear old errors

  ['fname', 'fphone', 'femail'].forEach(id => {

    document.getElementById(id)
      .classList.remove('invalid');

    const err = document.getElementById(
      'err-' + id.replace('f', '')
    );

    if (err) err.textContent = '';
  });

  if (fail) {
    fail.style.display = 'none';
  }


  // Validation

  let valid = true;

  if (!name) {

    document.getElementById('fname')
      .classList.add('invalid');

    const e = document.getElementById('err-name');

    if (e) {
      e.textContent = 'Please enter your full name';
    }

    valid = false;
  }

  if (!phone || phone.replace(/\D/g, '').length < 7) {

    document.getElementById('fphone')
      .classList.add('invalid');

    const e = document.getElementById('err-phone');

    if (e) {
      e.textContent = 'Please enter a valid phone number';
    }

    valid = false;
  }

  if (!email || !email.includes('@')) {

    document.getElementById('femail')
      .classList.add('invalid');

    const e = document.getElementById('err-email');

    if (e) {
      e.textContent = 'Please enter a valid email address';
    }

    valid = false;
  }

  if (!valid) return;


  // Loading state

  btn.textContent = 'Sending...';

  btn.disabled = true;

  success.style.display = 'none';


  // =========================================================
  // SEND TO BACKEND
  // =========================================================

  try {

    const res = await fetch('/appointment', {

      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        name,
        phone,
        email,
        message
      })
    });


    // Safe JSON parsing

    let result = {};

    try {
      result = await res.json();
    } catch {
      result = {};
    }


    // Success

    if (res.ok && result.success) {

      document.getElementById('bookForm').reset();

      btn.style.display = 'none';

      success.style.display = 'block';

      console.log('✅ Appointment booked');
    }

    // Server error

    else {

      if (fail) {

        fail.textContent =
          '❌ ' +
          (result.error || 'Server error occurred.');

        fail.style.display = 'block';
      }

      btn.textContent = 'Send Request ✈️';

      btn.disabled = false;
    }

  }

  // Network error

  catch (err) {

    console.error('Backend error:', err);

    if (fail) {

      fail.textContent =
        '❌ Cannot connect to server right now.';

      fail.style.display = 'block';
    }

    btn.textContent = 'Send Request ✈️';

    btn.disabled = false;
  }
}


// ── 11. LIVE VALIDATION ────────────────────────────────────

['fname', 'fphone', 'femail'].forEach(id => {

  const el = document.getElementById(id);

  if (el) {

    el.addEventListener('input', () => {

      el.classList.remove('invalid');

      const errId =
        'err-' + id.replace('f', '');

      const err =
        document.getElementById(errId);

      if (err) {
        err.textContent = '';
      }
    });
  }
});
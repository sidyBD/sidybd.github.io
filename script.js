
/* ══ LOADER ══ */
window.addEventListener('load', () => {
  document.getElementById('loader').classList.add('hidden');
});

/* ══ SCROLL TO TOP ══ */
const scrollBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
  scrollBtn.classList.toggle('visible', window.scrollY > 400);
});
scrollBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ══ COMPTEURS HERO ══ */
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const duration = 1200;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(document.querySelector('.stat-card:nth-child(1) .stat-num'), 7, '+');
      animateCounter(document.querySelector('.stat-card:nth-child(2) .stat-num'), 3, '');
      animateCounter(document.querySelector('.stat-card:nth-child(3) .stat-num'), 10, '+');
      counterObs.disconnect();
    }
  });
}, { threshold: 0.5 });

const heroVisual = document.querySelector('.hero-visual');
if (heroVisual) counterObs.observe(heroVisual);


/* ══ FORMULAIRE CONTACT ══ */
function submitForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const msg = document.getElementById('formMsg');
  btn.textContent = 'Envoi…'; btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Envoyer →'; btn.disabled = false;
    msg.style.display = 'block';
    msg.style.background = 'var(--green-bg)';
    msg.style.color = 'var(--green)';
    msg.textContent = '✓ Message envoyé ! Je vous répondrai rapidement.';
    e.target.reset();
    setTimeout(() => { msg.style.display = 'none'; }, 4000);
  }, 1000);
}

/* ══════════════════════════════════════
   DARK MODE
══════════════════════════════════════ */
const html   = document.documentElement;
const toggle = document.getElementById('themeToggle');
const emoji  = document.getElementById('themeEmoji');
const saved  = localStorage.getItem('theme');
const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (saved === 'dark' || (!saved && sysDark)) {
  html.setAttribute('data-theme', 'dark');
  emoji.textContent = '🌙';
}

toggle.addEventListener('click', () => {
  const dark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', dark ? 'light' : 'dark');
  emoji.textContent = dark ? '☀️' : '🌙';
  localStorage.setItem('theme', dark ? 'light' : 'dark');
});

/* ══════════════════════════════════════
   FILTRES PROJETS
══════════════════════════════════════ */
let currentCat = 'all';

function filterP(cat, btn) {
  currentCat = cat;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  applyFilters();
}

/* ══════════════════════════════════════
   RECHERCHE
══════════════════════════════════════ */
function searchProjects() { applyFilters(); }

function applyFilters() {
  const q = document.getElementById('searchInput').value.toLowerCase().trim();
  let visible = 0;

  document.querySelectorAll('.pcard').forEach(c => {
    const catOk = currentCat === 'all' || c.dataset.cat === currentCat;
    const searchOk = !q
      || (c.dataset.search || '').includes(q)
      || (c.querySelector('.ctitle')?.textContent.toLowerCase().includes(q))
      || (c.querySelector('.cdesc')?.textContent.toLowerCase().includes(q));
    const show = catOk && searchOk;
    c.style.display = show ? '' : 'none';
    if (show) visible++;
  });

  document.getElementById('noResults').style.display = visible === 0 ? 'block' : 'none';
}

/* ══════════════════════════════════════
   BARRES COMPÉTENCES (scroll-triggered)
══════════════════════════════════════ */
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.sfill').forEach(f => {
        f.style.transform = `scaleX(${f.getAttribute('data-w')})`;
      });
      skillObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.sgroup').forEach(g => skillObs.observe(g));

/* ══════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════ */
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      revObs.unobserve(e.target);
    }
  });
}, { threshold: 0.07 });

document.querySelectorAll('.pcard, .sgroup, .cert-card, .tl-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(16px)';
  el.style.transition = 'opacity .4s ease, transform .4s ease, box-shadow .22s, background .35s, border-color .35s';
  revObs.observe(el);
});

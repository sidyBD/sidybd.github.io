/* Mode clair / sombre */
(function () {
  var racine = document.documentElement;
  var bouton = document.getElementById('themeToggle');
  if (!bouton) return;

  var emoji = document.getElementById('themeEmoji');

  function majTexte() {
    if (emoji) emoji.textContent = racine.getAttribute('data-theme') === 'dark' ? '🌙' : '☀️';
  }

  bouton.addEventListener('click', function () {
    var suivant = racine.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    racine.setAttribute('data-theme', suivant);
    try { localStorage.setItem('theme', suivant); } catch (e) {}
    majTexte();
  });

  majTexte();
})();

/* Bouton pour remonter en haut */
(function () {
  var bouton = document.getElementById('scrollTop');
  if (!bouton) return;
  window.addEventListener('scroll', function () {
    bouton.classList.toggle('visible', window.scrollY > 400);
  });
  bouton.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* Filtres et recherche dans les projets */
(function () {
  var champ = document.getElementById('searchInput');
  var boutons = document.querySelectorAll('.filter-btn');
  var cartes = document.querySelectorAll('.pcard');
  var vide = document.getElementById('noResults');
  if (!champ || !cartes.length) return;
  var categorie = 'all';

  function appliquer() {
    var q = champ.value.toLowerCase().trim();
    var visibles = 0;
    cartes.forEach(function (carte) {
      var texte = (carte.textContent + ' ' + (carte.getAttribute('data-search') || '')).toLowerCase();
      var ok = (categorie === 'all' || carte.getAttribute('data-cat') === categorie) && (!q || texte.indexOf(q) !== -1);
      carte.style.display = ok ? '' : 'none';
      if (ok) visibles++;
    });
    if (vide) vide.style.display = visibles === 0 ? 'block' : 'none';
  }

  boutons.forEach(function (b) {
    b.addEventListener('click', function () {
      categorie = b.getAttribute('data-cat');
      boutons.forEach(function (x) { x.classList.remove('active'); });
      b.classList.add('active');
      appliquer();
    });
  });
  champ.addEventListener('input', appliquer);
})();

/* Carte des villes */
(function () {
  var bloc = document.getElementById('map');
  if (!bloc || typeof L === 'undefined') return;

  var villes = [
    { nom: 'Paris',    lat: 48.8566, lng:  2.3522, desc: 'Capitale · Très nombreuses opportunités data & statistiques' },
    { nom: 'Lyon',     lat: 45.7640, lng:  4.8357, desc: '2ème métropole française · Fort tissu data, BI & statistiques' }
  ];

  var map = L.map('map', { zoomControl: true, scrollWheelZoom: false }).setView([46.8, 2.3], 5);

  // En ligne : le fond OpenStreetMap, comme dans la première version.
  // Fichier ouvert en local (file://) : OpenStreetMap refuse d'envoyer ses
  // images, donc on dessine les contours enregistrés dans carte-fond.js.
  var enLocal = location.protocol === 'file:';
  if (!enLocal) {
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 10
    }).addTo(map);
  } else if (typeof FOND_CARTE !== 'undefined') {
    bloc.style.background = '#dfe9ee';
    map.attributionControl.addAttribution('Contours : Natural Earth');
    L.geoJSON(FOND_CARTE, {
      interactive: false,
      style: function (f) {
        return f.properties.fr
          ? { color: '#8b5e3c', weight: 1.5, fillColor: '#f3e3d0', fillOpacity: 1 }
          : { color: '#d9c9b6', weight: 1, fillColor: '#faf6f0', fillOpacity: 1 };
      }
    }).addTo(map);
    map.setMaxZoom(8);
  }

  var icon = L.divIcon({
    className: '',
    html: '<div style="width:36px;height:36px;border-radius:50%;' +
      'background:linear-gradient(135deg,#c4884f,#8b5e3c);border:3px solid #fff;' +
      'box-shadow:0 4px 12px rgba(100,60,20,.35);display:flex;align-items:center;' +
      'justify-content:center;font-size:14px;font-weight:700;color:#fff;' +
      'font-family:\'DM Sans\',sans-serif;">📍</div>',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20]
  });

  villes.forEach(function (v) {
    var m = L.marker([v.lat, v.lng], { icon: icon })
      .addTo(map)
      .bindPopup(
        '<div style="font-family:\'DM Sans\',sans-serif;min-width:160px">' +
        '<div style="font-weight:700;font-size:.95rem;margin-bottom:.3rem;color:#1a1208">' + v.nom + '</div>' +
        '<div style="font-size:.8rem;color:#7a6650">' + v.desc + '</div></div>',
        { maxWidth: 220 }
      );
    if (enLocal) {
      m.bindTooltip(v.nom, { permanent: true, direction: 'right', offset: [16, 0], className: 'nom-ville' });
    }
  });
})();

/* Nuage de mots */
function dessinerNuage() {
  var container = document.getElementById('wordcloud');
  if (!container) return;
  container.innerHTML = '';

  // rotate: true = le mot peut être placé à la verticale
  var words = [
    { text: 'Python',                size: 2.2,  color: '#8b5e3c', rotate: false },
    { text: 'R',                     size: 2.0,  color: '#8b5e3c', rotate: false },
    { text: 'SQL',                   size: 1.9,  color: '#8b5e3c', rotate: false },
    { text: 'PHP',                   size: 1.1,  color: '#8b5e3c', rotate: true  },
    { text: 'HTML / CSS',            size: 1.0,  color: '#8b5e3c', rotate: true  },
    { text: 'JavaScript',            size: 1.0,  color: '#8b5e3c', rotate: true  },
    { text: 'LaTeX',                 size: 0.8,  color: '#8b5e3c', rotate: true  },
    { text: 'Jupyter',               size: 0.8,  color: '#8b5e3c', rotate: true  },
    { text: 'Git',                   size: 0.8,  color: '#8b5e3c', rotate: true  },
    { text: 'GitHub',                size: 0.8,  color: '#8b5e3c', rotate: true  },
    { text: 'RStudio',               size: 1.0,  color: '#8b5e3c', rotate: true  },
    { text: 'VS Code',               size: 0.9,  color: '#8b5e3c', rotate: true  },

    { text: 'Power BI',              size: 2.0,  color: '#d4a017', rotate: false },
    { text: 'DAX',                   size: 1.8,  color: '#d4a017', rotate: false },
    { text: 'Tableau',               size: 1.5,  color: '#d4a017', rotate: false },
    { text: 'Dashboard',             size: 1.3,  color: '#d4a017', rotate: false },
    { text: 'Excel',                 size: 1.3,  color: '#d4a017', rotate: false },
    { text: 'Google Looker Studio',  size: 1.0,  color: '#d4a017', rotate: true  },
    { text: 'Qlik Sense',            size: 1.2,  color: '#d4a017', rotate: true  },
    { text: 'SUMX',                  size: 1.1,  color: '#d4a017', rotate: true  },
    { text: 'Matplotlib',            size: 1.2,  color: '#d4a017', rotate: false },
    { text: 'Seaborn',               size: 1.1,  color: '#d4a017', rotate: true  },
    { text: 'Plotly',                size: 0.9,  color: '#d4a017', rotate: true  },
    { text: 'Heatmap',               size: 0.85, color: '#d4a017', rotate: true  },
    { text: 'KPI',                   size: 1.0,  color: '#d4a017', rotate: true  },
    { text: 'Box plot',              size: 0.8,  color: '#d4a017', rotate: true  },
    { text: 'Scatter plot',          size: 0.8,  color: '#d4a017', rotate: true  },
    { text: 'Cartographie',          size: 0.85, color: '#d4a017', rotate: true  },
    { text: 'Choroplète',            size: 0.75, color: '#d4a017', rotate: true  },
    { text: 'Datavisualisation',     size: 1.1,  color: '#d4a017', rotate: false },

    { text: 'Machine Learning',      size: 2.1,  color: '#2e86ab', rotate: false },
    { text: 'scikit-learn',          size: 1.5,  color: '#2e86ab', rotate: false },
    { text: 'Régression',            size: 1.3,  color: '#2e86ab', rotate: false },
    { text: 'Classification',        size: 1.3,  color: '#2e86ab', rotate: false },
    { text: 'Clustering',            size: 1.2,  color: '#2e86ab', rotate: true  },
    { text: 'Random Forest',         size: 1.0,  color: '#2e86ab', rotate: true  },
    { text: 'SVM',                   size: 0.9,  color: '#2e86ab', rotate: true  },
    { text: 'SMOTE',                 size: 0.85, color: '#2e86ab', rotate: true  },
    { text: 'Sur-échantillonnage',   size: 0.8,  color: '#2e86ab', rotate: true  },
    { text: 'Overfitting',           size: 0.8,  color: '#2e86ab', rotate: true  },
    { text: 'Cross-validation',      size: 0.8,  color: '#2e86ab', rotate: true  },
    { text: 'Prévision',             size: 1.2,  color: '#2e86ab', rotate: false },
    { text: 'Modélisation',          size: 1.2,  color: '#2e86ab', rotate: false },

    { text: 'Statistiques',          size: 1.8,  color: '#7b4fa6', rotate: false },
    { text: 'ACP',                   size: 1.3,  color: '#7b4fa6', rotate: true  },
    { text: 'Corrélation',           size: 1.2,  color: '#7b4fa6', rotate: false },
    { text: 'Test d\'hypothèse',     size: 1.1,  color: '#7b4fa6', rotate: true  },
    { text: 'Séries temporelles',    size: 1.6,  color: '#7b4fa6', rotate: false },
    { text: 'Saisonnalité',          size: 1.0,  color: '#7b4fa6', rotate: true  },
    { text: 'Tendance',              size: 1.0,  color: '#7b4fa6', rotate: true  },
    { text: 'TSLM',                  size: 0.9,  color: '#7b4fa6', rotate: true  },
    { text: 'Stat. descriptives',    size: 0.8,  color: '#7b4fa6', rotate: true  },
    { text: 'Analyse exploratoire',  size: 0.85, color: '#7b4fa6', rotate: false },
    { text: 'p-value',               size: 0.8,  color: '#7b4fa6', rotate: true  },
    { text: 'ANOVA',                 size: 0.75, color: '#7b4fa6', rotate: true  },
    { text: 'Régression linéaire',   size: 0.8,  color: '#7b4fa6', rotate: true  },

    { text: 'ETL',                   size: 1.8,  color: '#c0392b', rotate: false },
    { text: 'Talend',                size: 1.5,  color: '#c0392b', rotate: false },
    { text: 'MySQL',                 size: 1.2,  color: '#c0392b', rotate: false },
    { text: 'MySQL Workbench',       size: 0.9,  color: '#c0392b', rotate: true  },
    { text: 'SQLite',                size: 1.0,  color: '#c0392b', rotate: true  },
    { text: 'Datawarehouse',         size: 1.1,  color: '#c0392b', rotate: false },
    { text: 'MCD / MLD',             size: 0.95, color: '#c0392b', rotate: true  },
    { text: 'tMap',                  size: 0.85, color: '#c0392b', rotate: true  },
    { text: 'tFilterRow',            size: 0.8,  color: '#c0392b', rotate: true  },
    { text: 'tAggregateRow',         size: 0.8,  color: '#c0392b', rotate: true  },
    { text: 'Jointure',              size: 0.85, color: '#c0392b', rotate: true  },
    { text: 'Agrégation',            size: 0.85, color: '#c0392b', rotate: true  },
    { text: 'Schéma en étoile',      size: 0.75, color: '#c0392b', rotate: true  },
    { text: 'Modélisation BDD',      size: 0.8,  color: '#c0392b', rotate: true  },

    { text: 'Pandas',                size: 1.7,  color: '#1a9e6e', rotate: false },
    { text: 'NumPy',                 size: 1.2,  color: '#1a9e6e', rotate: true  },
    { text: 'Nettoyage',             size: 1.4,  color: '#1a9e6e', rotate: false },
    { text: 'Normalisation',         size: 1.2,  color: '#1a9e6e', rotate: false },
    { text: 'Standardisation',       size: 1.1,  color: '#1a9e6e', rotate: true  },
    { text: 'Feature Engineering',   size: 1.1,  color: '#1a9e6e', rotate: false },
    { text: 'Valeurs manquantes',    size: 1.0,  color: '#1a9e6e', rotate: true  },
    { text: 'Valeurs aberrantes',    size: 0.95, color: '#1a9e6e', rotate: true  },
    { text: 'Doublons',              size: 0.85, color: '#1a9e6e', rotate: true  },
    { text: 'Discrétisation',        size: 0.8,  color: '#1a9e6e', rotate: true  },
    { text: 'Binarisation',          size: 0.8,  color: '#1a9e6e', rotate: true  },
    { text: 'Pipeline',              size: 0.95, color: '#1a9e6e', rotate: true  },
    { text: 'Kaggle',                size: 0.85, color: '#1a9e6e', rotate: true  },
    { text: 'Open Data',             size: 0.8,  color: '#1a9e6e', rotate: true  },
    { text: 'SciPy',                 size: 0.85, color: '#1a9e6e', rotate: true  },
    { text: 'Statsmodels',           size: 0.8,  color: '#1a9e6e', rotate: true  },

    { text: 'ggplot2',               size: 1.7,  color: '#3a7d6e', rotate: false },
    { text: 'dplyr',                 size: 1.3,  color: '#3a7d6e', rotate: false },
    { text: 'tidyverse',             size: 1.2,  color: '#3a7d6e', rotate: false },
    { text: 'tsibble',               size: 1.1,  color: '#3a7d6e', rotate: true  },
    { text: 'fable',                 size: 0.95, color: '#3a7d6e', rotate: true  },
    { text: 'tidyr',                 size: 0.95, color: '#3a7d6e', rotate: true  },
    { text: 'tabulapdf',             size: 0.85, color: '#3a7d6e', rotate: true  },
    { text: 'openxlsx',              size: 0.85, color: '#3a7d6e', rotate: true  },
    { text: 'sf',                    size: 0.85, color: '#3a7d6e', rotate: true  },
    { text: 'lubridate',             size: 0.8,  color: '#3a7d6e', rotate: true  },
  ];

  var W = container.offsetWidth || 900;
  var H = container.offsetHeight || 600;
  var CELL = 3;
  var cols = Math.ceil(W / CELL);
  var rows = Math.ceil(H / CELL);
  var grid = new Uint8Array(cols * rows);
  var echelle = W < 600 ? 0.72 : 1;

  function zone(x, y, w, h, pad) {
    return [
      Math.max(0, Math.floor((x - pad) / CELL)),
      Math.min(cols - 1, Math.ceil((x + w + pad) / CELL)),
      Math.max(0, Math.floor((y - pad) / CELL)),
      Math.min(rows - 1, Math.ceil((y + h + pad) / CELL))
    ];
  }
  function marquer(x, y, w, h) {
    var z = zone(x, y, w, h, 5);
    for (var r = z[2]; r <= z[3]; r++)
      for (var c = z[0]; c <= z[1]; c++) grid[r * cols + c] = 1;
  }
  function libre(x, y, w, h) {
    var z = zone(x, y, w, h, 3);
    for (var r = z[2]; r <= z[3]; r++)
      for (var c = z[0]; c <= z[1]; c++) if (grid[r * cols + c]) return false;
    return true;
  }
  function placer(sw, sh) {
    var cx = W / 2 - sw / 2;
    var cy = H / 2 - sh / 2;
    var maxR = Math.sqrt(W * W + H * H);
    for (var r = 0; r < maxR; r += 2) {
      var pas = Math.max(10, Math.floor(2 * Math.PI * (r + 1) / 5));
      for (var s = 0; s < pas; s++) {
        var angle = (s / pas) * 2 * Math.PI + r * 0.25;
        var tx = cx + r * Math.cos(angle);
        var ty = cy + r * Math.sin(angle);
        if (tx < 2 || tx + sw > W - 2 || ty < 2 || ty + sh > H - 2) continue;
        if (libre(tx, ty, sw, sh)) { marquer(tx, ty, sw, sh); return [tx, ty]; }
      }
    }
    return null;
  }

  words.sort(function (a, b) { return b.size - a.size; });

  words.forEach(function (word) {
    var vertical = word.rotate && Math.random() < 0.5;
    var span = document.createElement('span');
    span.textContent = word.text;
    span.style.fontSize = (word.size * echelle) + 'rem';
    span.style.fontWeight = word.size >= 1.8 ? '700' : word.size >= 1.2 ? '600' : '500';
    span.style.color = word.color;
    container.appendChild(span);

    var sw = span.offsetWidth;
    var sh = span.offsetHeight;
    var pos = placer(vertical ? sh : sw, vertical ? sw : sh);
    if (!pos) { span.remove(); return; }

    if (vertical) {
      span.style.transformOrigin = 'top left';
      span.style.transform = 'rotate(90deg)';
      span.style.left = (pos[0] + sh) + 'px';
    } else {
      span.style.left = pos[0] + 'px';
    }
    span.style.top = pos[1] + 'px';
  });
}

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(dessinerNuage);
} else {
  window.addEventListener('load', dessinerNuage);
}

/* Fond animé de courbes dans l'accueil */
(() => {
  const c = document.getElementById('hero-flux');
  if (!c) return;
  const ctx = c.getContext('2d');
  const reduit = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const N = 14;

  const draw = (t) => {
    const w = c.clientWidth, h = c.clientHeight, s = t / 1000;
    // Mode clair : même couleur, opacité divisée par deux
    const f = document.documentElement.getAttribute('data-theme') === 'dark' ? 1 : 0.5;
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < N; i++) {
      const k = i / (N - 1);
      ctx.beginPath();
      for (let x = 0; x <= w; x += 8) {
        const y = h * (0.25 + k * 0.6)
          + Math.sin(x * 0.004 + s * 0.6 + i * 0.4) * 40
          + Math.sin(x * 0.011 - s * 0.9 + i) * 14;
        x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.strokeStyle = `rgba(212,149,90,${(0.06 + 0.22 * Math.sin(k * Math.PI)) * f})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
    if (!reduit) requestAnimationFrame(draw);
  };

  const fit = () => {
    const r = c.getBoundingClientRect(), d = window.devicePixelRatio || 1;
    c.width = r.width * d; c.height = r.height * d;
    ctx.setTransform(d, 0, 0, d, 0, 0);
    if (reduit) draw(0);
  };
  addEventListener('resize', fit);
  fit();

  if (reduit) {
    // Image fixe : on la redessine seulement quand le thème change
    new MutationObserver(() => draw(0))
      .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  } else {
    requestAnimationFrame(draw);
  }
})();

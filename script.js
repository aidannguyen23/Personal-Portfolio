/* ==============================================
   SCROLL REVEAL (subpages)
   ============================================== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ==============================================
   BABA SCROLLBAR
   ============================================== */
(function () {
  // Don't show on map page (no scroll)
  if (document.body.classList.contains('map-page')) return;

  // Per-page scrollbar character
  const page = location.pathname.split('/').pop().replace('.html', '') || 'index';
  const charMap = { about: 'jiji', contact: 'me', resume: 'quiqui', why: 'baba', projects: 'keke' };
  const char = charMap[page] || 'baba';
  // Baba sprites face the expected direction; other characters are flipped
  const flip = char !== 'baba';
  const charUp = `./assets/baba/${char}_${flip ? 'down' : 'up'}.webp`;
  const charDown = `./assets/baba/${char}_${flip ? 'up' : 'down'}.webp`;

  const track = document.createElement('div');
  track.id = 'baba-scrollbar';
  const baba = document.createElement('img');
  baba.id = 'baba-scroller';
  baba.src = charUp;
  baba.alt = char;
  track.appendChild(baba);
  document.body.appendChild(track);

  let lastY = window.scrollY;
  let dragging = false;
  let dragStartMouseY = 0;
  let dragStartScrollY = 0;

  function update() {
    if (dragging) return;
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const pct = maxScroll > 0 ? scrollY / maxScroll : 0;
    const topPx = pct * (window.innerHeight - 28);
    baba.style.top = topPx + 'px';
    baba.src = scrollY < lastY
      ? charDown
      : charUp;
    lastY = scrollY;
  }

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  baba.style.cursor = isTouchDevice ? 'default' : 'grab';
  baba.style.pointerEvents = isTouchDevice ? 'none' : 'auto';

  baba.addEventListener('pointerdown', e => {
    dragging = true;
    dragStartMouseY = e.clientY;
    dragStartScrollY = window.scrollY;
    baba.style.cursor = 'grabbing';
    baba.setPointerCapture(e.pointerId);
    e.preventDefault();
  });

  baba.addEventListener('pointermove', e => {
    if (!dragging) return;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const trackHeight = window.innerHeight - 28;
    const delta = e.clientY - dragStartMouseY;
    const scrollDelta = (delta / trackHeight) * maxScroll;
    const newScroll = Math.max(0, Math.min(maxScroll, dragStartScrollY + scrollDelta));
    window.scrollTo(0, newScroll);
    const pct = maxScroll > 0 ? newScroll / maxScroll : 0;
    baba.style.top = (pct * trackHeight) + 'px';
    baba.src = scrollDelta < 0
      ? charDown
      : charUp;
  });

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    baba.style.cursor = 'grab';
    lastY = window.scrollY;
  }

  baba.addEventListener('pointerup', endDrag);
  baba.addEventListener('pointercancel', endDrag);
  document.addEventListener('pointerup', endDrag);

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ==============================================
   COPY EMAIL
   ============================================== */
function copyEmail() {
  navigator.clipboard.writeText('aidannguyen27@g.ucla.edu').then(() => {
    const val = document.getElementById('email-val');
    const arrow = document.getElementById('email-arrow');
    if (!val) return;
    val.textContent = 'copied!';
    arrow.textContent = '✓';
    setTimeout(() => {
      val.textContent = 'aidannguyen27@g.ucla.edu';
      arrow.textContent = '→';
    }, 2000);
  });
}

/* ==============================================
   PROJECT FILTERS
   ============================================== */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-tile').forEach(tile => {
      if (filter === 'all' || tile.dataset.category.split(' ').includes(filter)) {
        tile.classList.remove('hidden');
      } else {
        tile.classList.add('hidden');
      }
    });
  });
});

/* ==============================================
   INFO TOOLTIPS — tap to toggle on mobile
   ============================================== */
document.querySelectorAll('.tile-info').forEach(info => {
  info.addEventListener('click', e => {
    e.stopPropagation();
    const wasActive = info.classList.contains('active');
    document.querySelectorAll('.tile-info.active').forEach(i => i.classList.remove('active'));
    if (!wasActive) info.classList.add('active');
  });
});
document.addEventListener('click', () => {
  document.querySelectorAll('.tile-info.active').forEach(i => i.classList.remove('active'));
});

/* ==============================================
   DRAG MODE — add ?drag to URL to enable
   Drag labels to position them, then check console
   for final coordinates. Remove ?drag when done.
   ============================================== */
if (window.location.search.includes('drag')) {
  function logAll() {
    console.clear();
    console.log('%c=== LABEL POSITIONS + SIZES ===', 'font-weight:bold;font-size:14px');
    document.querySelectorAll('.map-region').forEach(r => {
      const img = r.querySelector('.baba-text');
      const h = img ? Math.round(parseFloat(img.style.height || getComputedStyle(img).height)) : '?';
      console.log(`${r.id}: top: ${r.style.top}; left: ${r.style.left}; height: ${h}px`);
    });
    const name = document.querySelector('.map-name');
    if (name) {
      const img = name.querySelector('.baba-text');
      const h = img ? Math.round(parseFloat(img.style.height || getComputedStyle(img).height)) : '?';
      console.log(`map-name: top: ${name.style.top}; left: ${name.style.left}; height: ${h}px`);
    }
  }

  document.querySelectorAll('.map-region, .map-name').forEach(el => {
    el.style.cursor = 'grab';

    // Drag to reposition
    el.addEventListener('pointerdown', e => {
      e.preventDefault();
      el.style.cursor = 'grabbing';
      const container = el.parentElement;
      const rect = container.getBoundingClientRect();

      const onMove = e2 => {
        const top = ((e2.clientY - rect.top) / rect.height * 100).toFixed(1);
        const left = ((e2.clientX - rect.left) / rect.width * 100).toFixed(1);
        el.style.top = top + '%';
        el.style.left = left + '%';
      };

      const onUp = () => {
        el.style.cursor = 'grab';
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
        logAll();
      };

      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
    });

    // Scroll wheel to resize
    el.addEventListener('wheel', e => {
      e.preventDefault();
      const img = el.querySelector('.baba-text');
      if (!img) return;
      const current = parseFloat(img.style.height || getComputedStyle(img).height);
      const delta = e.deltaY < 0 ? 2 : -2;
      const next = Math.max(10, Math.round(current + delta));
      img.style.height = next + 'px';
      logAll();
    }, { passive: false });

    // Prevent navigation while dragging
    el.addEventListener('click', e => e.preventDefault());
  });

  // Visual indicator that drag mode is active
  const badge = document.createElement('div');
  badge.textContent = 'DRAG MODE — drag to move · scroll wheel to resize · check console for values';
  badge.style.cssText = 'position:fixed;bottom:16px;left:50%;transform:translateX(-50%);background:#e8547a;color:#fff;font-family:monospace;font-size:12px;padding:8px 16px;z-index:999;pointer-events:none;';
  document.body.appendChild(badge);
}

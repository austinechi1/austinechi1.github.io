/* ==========================================================
   Nwachukwu Austine — Portfolio interactions
   ========================================================== */
(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const body = document.body;
  requestAnimationFrame(() => body.classList.add('ready'));

  /* ---------- Split headings into words ---------- */
  $$('.split-words').forEach((el) => {
    let i = 0;
    const wrap = (node) => {
      const frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
        const outer = document.createElement('span');
        outer.className = 'w';
        const inner = document.createElement('span');
        inner.textContent = part;
        inner.style.setProperty('--i', i++);
        outer.appendChild(inner);
        frag.appendChild(outer);
      });
      return frag;
    };
    [...el.childNodes].forEach((child) => {
      if (child.nodeType === 3) {
        el.replaceChild(wrap(child), child);
      } else if (child.nodeType === 1) {
        const text = child.textContent;
        child.textContent = '';
        child.appendChild(wrap(document.createTextNode(text)));
      }
    });
  });

  /* ---------- Reveal on scroll ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal, .split-words, .contact-title').forEach((el) => revealObserver.observe(el));

  /* ---------- Rotating hero word ---------- */
  const rotWord = $('.rotator-word');
  const words = ['clear direction.', 'smart decisions.', 'visual stories.', 'real insight.'];
  if (rotWord && !reduceMotion) {
    let w = 0;
    setInterval(() => {
      rotWord.classList.add('out');
      setTimeout(() => {
        w = (w + 1) % words.length;
        rotWord.textContent = words[w];
        rotWord.classList.remove('out');
        rotWord.classList.add('pre');
        void rotWord.offsetWidth;
        rotWord.classList.remove('pre');
      }, 450);
    }, 3200);
  }

  /* ---------- Header: scrolled / hide on scroll / progress ---------- */
  const header = $('.site-header');
  const progress = $('.progress span');
  let lastY = window.scrollY;
  let scrollVelocity = 0;
  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    header.classList.toggle('scrolled', y > 40);
    const navOpen = $('.site-nav').classList.contains('open');
    header.classList.toggle('hidden', !navOpen && y > lastY && y > 400);
    scrollVelocity = y - lastY;
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Active nav link ---------- */
  const navLinks = $$('.site-nav a[href^="#"]:not(.nav-cta)');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach((s) => sectionObserver.observe(s));

  /* ---------- Mobile menu ---------- */
  const menuButton = $('.menu-toggle');
  const nav = $('.site-nav');
  const setMenu = (open) => {
    nav.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    body.style.overflow = open ? 'hidden' : '';
  };
  menuButton?.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  $$('a', nav).forEach((a) => a.addEventListener('click', () => setMenu(false)));

  /* ---------- Custom cursor ---------- */
  if (finePointer && !reduceMotion) {
    body.classList.add('has-cursor');
    const ring = $('.cursor');
    const dot = $('.cursor-dot');
    const label = $('.cursor-label');
    let mx = -100, my = -100, rx = -100, ry = -100;
    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
    });
    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(loop);
    };
    loop();
    document.addEventListener('mouseover', (e) => {
      const labelled = e.target.closest('[data-cursor]');
      const interactive = e.target.closest('a, button, .tool');
      if (labelled) {
        label.textContent = labelled.dataset.cursor;
        ring.classList.add('label');
        ring.classList.remove('hover');
      } else {
        ring.classList.remove('label');
        ring.classList.toggle('hover', !!interactive);
      }
    });
    document.addEventListener('mouseleave', () => { ring.style.opacity = 0; dot.style.opacity = 0; });
    document.addEventListener('mouseenter', () => { ring.style.opacity = ''; dot.style.opacity = ''; });
  }

  /* ---------- Magnetic buttons ---------- */
  if (finePointer && !reduceMotion) {
    $$('[data-magnetic]').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.28}px, ${y * 0.38}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transition = 'transform .5s cubic-bezier(.22,1,.36,1)';
        el.style.transform = '';
        setTimeout(() => (el.style.transition = ''), 500);
      });
    });
  }

  /* ---------- 3D tilt + spotlight ---------- */
  if (finePointer && !reduceMotion) {
    $$('[data-tilt]').forEach((el) => {
      const strength = el.classList.contains('web-card') ? 6 : 9;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        el.style.transform = `perspective(900px) rotateY(${(px - 0.5) * strength}deg) rotateX(${(0.5 - py) * strength}deg)`;
        el.style.setProperty('--mx', `${px * 100}%`);
        el.style.setProperty('--my', `${py * 100}%`);
      });
      el.addEventListener('mouseleave', () => {
        el.style.transition = 'transform .6s cubic-bezier(.22,1,.36,1)';
        el.style.transform = '';
        setTimeout(() => (el.style.transition = ''), 600);
      });
    });

    // Hero chips parallax
    const hero = $('.hero');
    const chips = $$('[data-depth]');
    hero?.addEventListener('mousemove', (e) => {
      const cx = e.clientX / window.innerWidth - 0.5;
      const cy = e.clientY / window.innerHeight - 0.5;
      chips.forEach((c) => {
        const d = Number(c.dataset.depth);
        c.style.transform = `translate(${cx * d}px, ${cy * d}px)`;
      });
    });
  }

  /* ---------- Project filters ---------- */
  const projectItems = $$('.work-list [data-cat]');
  $$('[data-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.filter;
      $$('[data-filter]').forEach((b) => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-selected', String(b === btn));
      });
      projectItems.forEach((item) => {
        const show = f === 'all' || item.dataset.cat === f;
        item.classList.toggle('is-hidden', !show);
        if (show && !reduceMotion) {
          item.animate([{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'none' }], { duration: 550, easing: 'cubic-bezier(.22,1,.36,1)' });
        }
      });
    });
  });

  /* ---------- Lightbox ---------- */
  const lightbox = $('.lightbox');
  const lbImg = $('img', lightbox);
  let lastFocus = null;
  const openLightbox = (src, alt) => {
    lastFocus = document.activeElement;
    lbImg.src = src;
    lbImg.alt = alt || '';
    lightbox.hidden = false;
    requestAnimationFrame(() => lightbox.classList.add('open'));
    body.style.overflow = 'hidden';
    $('.lightbox-close').focus();
  };
  const closeLightbox = () => {
    lightbox.classList.remove('open');
    body.style.overflow = '';
    setTimeout(() => { lightbox.hidden = true; }, 350);
    lastFocus?.focus();
  };
  $$('[data-lightbox]').forEach((el) => el.addEventListener('click', () => openLightbox(el.dataset.lightbox, $('img', el)?.alt)));
  lightbox.addEventListener('click', (e) => { if (e.target !== lbImg) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !lightbox.hidden) closeLightbox(); });

  /* ---------- Toast + copy email ---------- */
  const toast = $('.toast');
  let toastTimer;
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  };
  $$('.copy-email').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const email = btn.dataset.email;
      const labelEl = $('.copy-label', btn);
      try {
        await navigator.clipboard.writeText(email);
        showToast('Email copied — talk soon!');
        if (labelEl) {
          const original = labelEl.textContent;
          labelEl.textContent = 'Copied!';
          setTimeout(() => (labelEl.textContent = original), 1600);
        }
      } catch {
        window.location.href = `mailto:${email}`;
      }
    });
  });

  /* ---------- Toolkit ---------- */
  const tools = [
    { key: 'excel', name: 'Microsoft Excel', cat: 'data', img: 'assets/tools/excel.png', color: '#1d6f42' },
    { key: 'powerbi', name: 'Power BI', cat: 'data', img: 'assets/tool-power-bi.webp', color: '#f2c811' },
    { key: 'sql', name: 'SQL / PostgreSQL', cat: 'data', img: 'assets/tools/postgresql.svg', color: '#336791' },
    { key: 'python', name: 'Python', cat: 'data', img: 'assets/tools/python.svg', color: '#3776ab' },
    { key: 'chatgpt', name: 'ChatGPT', cat: 'ai', img: 'assets/tool-chatgpt.jpg', color: '#10a37f' },
    { key: 'claude', name: 'Claude', cat: 'ai', img: 'assets/tool-claude.webp', color: '#d97757' },
    { key: 'html', name: 'HTML5', cat: 'web', img: 'assets/tools/html5.svg', color: '#e34f26' },
    { key: 'css', name: 'CSS3', cat: 'web', img: 'assets/tools/css3.svg', color: '#1572b6' },
    { key: 'js', name: 'JavaScript', cat: 'web', img: 'assets/tools/javascript.svg', color: '#f7df1e' },
    { key: 'php', name: 'PHP', cat: 'web', img: 'assets/tools/php.svg', color: '#777bb4' },
    { key: 'laravel', name: 'Laravel', cat: 'web', img: 'assets/tools/laravel.svg', color: '#ff2d20' },
    { key: 'github', name: 'GitHub', cat: 'web', img: 'assets/tools/github.svg', color: '#181717' },
    { key: 'ps', name: 'Photoshop', cat: 'creative', img: 'assets/tools/photoshop.svg', color: '#001e36' },
    { key: 'ai', name: 'Illustrator', cat: 'creative', img: 'assets/tools/illustrator.svg', color: '#330000' },
    { key: 'pr', name: 'Premiere Pro', cat: 'creative', img: 'assets/tools/premierepro.svg', color: '#00005b' },
    { key: 'ae', name: 'After Effects', cat: 'creative', img: 'assets/tools/aftereffects.svg', color: '#00005b' },
    { key: 'lr', name: 'Lightroom', cat: 'creative', img: 'assets/tools/lightroom.png', color: '#001e36' },
  ];
  const catNames = { data: 'Data & BI', ai: 'AI', web: 'Web', creative: 'Creative' };
  const toolGrid = $('#toolGrid');
  tools.forEach((t) => {
    const b = document.createElement('div');
    b.className = 'tool';
    b.dataset.cat = t.cat;
    b.dataset.key = t.key;
    b.style.setProperty('--tc', t.color);
    if (t.fg) b.style.setProperty('--tf', t.fg);
    b.innerHTML = `
      <span class="tool-cat">${catNames[t.cat]}</span>
      <span class="tool-icon">${t.img ? `<img src="${t.img}" alt="${t.name} logo" loading="lazy">` : t.label}</span>
      <span class="tool-name">${t.name}</span>`;
    toolGrid.appendChild(b);
  });

  $$('[data-tool-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.toolFilter;
      $$('[data-tool-filter]').forEach((b) => b.classList.toggle('active', b === btn));
      $$('.tool', toolGrid).forEach((t, i) => {
        const show = f === 'all' || t.dataset.cat === f;
        t.classList.toggle('out', !show);
        if (show && !reduceMotion) {
          t.animate([{ opacity: 0, transform: 'translateY(20px) scale(.95)' }, { opacity: 1, transform: 'none' }], { duration: 450, delay: i * 25, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
        }
      });
    });
  });

  /* ---------- Draggable gallery ---------- */
  const gallery = $('.gallery');
  const gBar = $('.g-progress span');
  if (gallery) {
    let down = false, startX = 0, startScroll = 0, moved = false;
    gallery.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse') return;
      down = true; moved = false;
      startX = e.clientX;
      startScroll = gallery.scrollLeft;
    });
    window.addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) { moved = true; gallery.classList.add('dragging'); }
      gallery.scrollLeft = startScroll - dx;
    });
    window.addEventListener('pointerup', () => {
      down = false;
      gallery.classList.remove('dragging');
    });
    gallery.addEventListener('click', (e) => { if (moved) e.preventDefault(); }, true);

    const updateBar = () => {
      const max = gallery.scrollWidth - gallery.clientWidth;
      const visible = gallery.clientWidth / gallery.scrollWidth;
      const p = max > 0 ? gallery.scrollLeft / max : 1;
      gBar.style.width = `${Math.max(visible, 0.12) * 100 + p * (1 - Math.max(visible, 0.12)) * 100}%`;
    };
    gallery.addEventListener('scroll', updateBar, { passive: true });
    window.addEventListener('resize', updateBar);
    updateBar();

    $$('.g-btn').forEach((b) => b.addEventListener('click', () => {
      gallery.scrollBy({ left: Number(b.dataset.dir) * gallery.clientWidth * 0.7, behavior: reduceMotion ? 'auto' : 'smooth' });
    }));
    gallery.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') gallery.scrollBy({ left: 300, behavior: 'smooth' });
      if (e.key === 'ArrowLeft') gallery.scrollBy({ left: -300, behavior: 'smooth' });
    });
  }

  /* ---------- Footer: year + local time ---------- */
  $('#year').textContent = new Date().getFullYear();
  const clock = $('#clock');
  const updateClock = () => {
    try {
      clock.textContent = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Moscow' }).format(new Date()) + ' MSK';
    } catch { clock.textContent = ''; }
  };
  updateClock();
  setInterval(updateClock, 30000);
})();

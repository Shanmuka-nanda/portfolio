/* ── portfolio.js ── */
(function () {

  // footer year
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear() + ' ©';

  // typewriter effect
  const typewriterEl = document.querySelector('.hero-copy h1 em');
  if (typewriterEl) {
    const phrases = [
      'Student & ML Builder',
      'Full Stack Enthusiast',
      'Data Science Explorer'
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isErasing = false;
    let typingSpeed = 100;
    let erasingSpeed = 50;
    let pauseTime = 2000;
    
    function type() {
      const currentPhrase = phrases[phraseIndex];
      
      if (!isErasing) {
        // typing
        if (charIndex < currentPhrase.length) {
          typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
          charIndex++;
          setTimeout(type, typingSpeed);
        } else {
          // done typing, pause before erasing
          setTimeout(() => {
            isErasing = true;
            type();
          }, pauseTime);
        }
      } else {
        // erasing
        if (charIndex > 0) {
          charIndex--;
          typewriterEl.textContent = currentPhrase.substring(0, charIndex);
          setTimeout(type, erasingSpeed);
        } else {
          // done erasing, move to next phrase
          phraseIndex = (phraseIndex + 1) % phrases.length;
          isErasing = false;
          setTimeout(type, 500);
        }
      }
    }
    
    type();
  }

  // nav scroll shadow
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // active nav link
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks  = document.querySelectorAll('nav ul li a:not(.nav-cta)');
  const hasHashLinks = Array.from(navLinks).some(a => a.getAttribute('href')?.startsWith('#'));

  // highlight active page when nav links point to separate pages
  const currentPage = window.location.pathname.split('/').pop() || 'example.html';
  navLinks.forEach((a) => {
    const href = a.getAttribute('href') || '';
    if (!href.startsWith('#') && href === currentPage) {
      a.classList.add('active');
    }
  });

  function setActive() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }
  if (hasHashLinks) {
    window.addEventListener('scroll', setActive, { passive: true });
    setActive();
  }

  // reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // stagger siblings
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal:not(.visible)'));
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 80);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  reveals.forEach(el => io.observe(el));

  // projects page filters
  const filterWrap = document.querySelector('[data-project-filters]');
  if (filterWrap) {
    const buttons = Array.from(filterWrap.querySelectorAll('.filter-btn'));
    const cards = Array.from(document.querySelectorAll('#projectsGrid .card'));

    function setFilter(category) {
      cards.forEach((card) => {
        const raw = card.getAttribute('data-category') || '';
        const categories = raw.split(',').map(s => s.trim()).filter(Boolean);
        const visible = category === 'all' || categories.includes(category);
        card.classList.toggle('project-hidden', !visible);
      });

      buttons.forEach((btn) => {
        const active = btn.getAttribute('data-filter') === category;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
    }

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        setFilter(btn.getAttribute('data-filter') || 'all');
      });
    });

    setFilter('all');
  }

  // image lightbox for project screenshots/charts
  const previewImages = Array.from(document.querySelectorAll('.project-shot img'));
  if (previewImages.length) {
    const lightbox = document.createElement('div');
    lightbox.className = 'image-lightbox';
    lightbox.setAttribute('aria-hidden', 'true');

    const closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Close image preview');
    closeBtn.textContent = '×';

    const preview = document.createElement('img');
    preview.alt = 'Expanded project image preview';

    lightbox.appendChild(closeBtn);
    lightbox.appendChild(preview);
    document.body.appendChild(lightbox);

    const closeLightbox = () => {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      preview.removeAttribute('src');
    };

    previewImages.forEach((img) => {
      img.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        preview.src = img.currentSrc || img.src;
        preview.alt = img.alt || 'Project image preview';
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
      });
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && lightbox.classList.contains('open')) {
        closeLightbox();
      }
    });
  }

})();


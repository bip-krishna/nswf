document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const header = document.querySelector('.header');
  const scrollTopBtn = document.getElementById('scrollTop');

  // Mobile menu
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('menu-open', isOpen);
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    }));
  }

  // Active nav link
  const page = document.body.dataset.page;
  if (page && nav) {
    nav.querySelectorAll('a').forEach(a => {
      if (a.getAttribute('href') === page) a.classList.add('active');
    });
  }

  // Scroll-to-top button
  if (scrollTopBtn) {
    const syncScrollTop = () => scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
    syncScrollTop();
    window.addEventListener('scroll', syncScrollTop, { passive: true });
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Header blur on scroll
  const syncHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  // GSAP animations
  if (window.gsap && window.ScrollTrigger && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.registerPlugin(ScrollTrigger);

    // — Reveal stagger with consistent delays —
    gsap.utils.toArray('.reveal').forEach((el, i) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        onEnter: () => {
          el.style.setProperty('--r-delay', `${(i % 8) * 60}ms`);
          el.classList.add('is-visible');
        },
        once: true
      });
    });

    // — Hero image parallax scale & movement —
    const heroImg = document.querySelector('.hero__visual-img');
    const heroAccent = document.querySelector('.hero__visual-accent');
    if (heroImg) {
      gsap.fromTo(heroImg, { scale: 0.95, opacity: 0.6, y: 30 }, {
        scale: 1, opacity: 1, y: 0, duration: 1,
        scrollTrigger: {
          trigger: '.hero', start: 'top bottom', end: 'center center', scrub: 1
        }
      });
    }
    if (heroAccent) {
      gsap.fromTo(heroAccent, { scale: 0.95, opacity: 0.5, y: 40 }, {
        scale: 1, opacity: 1, y: 0, duration: 1,
        scrollTrigger: {
          trigger: '.hero', start: 'top bottom', end: 'center center', scrub: 1
        }
      });
    }

    // — Hero content fade-in on load —
    const heroContent = document.querySelector('.hero__content');
    if (heroContent) {
      gsap.from(heroContent.children, {
        y: 20, opacity: 0, duration: 0.7, stagger: 0.07, ease: 'power3.out', delay: 0.2
      });
    }

    // — Scroll-pinning sections —
    const pinSections = document.querySelectorAll('.pin-section');
    pinSections.forEach(section => {
      const title = section.querySelector('.section__header');
      const grid = section.querySelector('.card-grid, .timeline, .contact-grid, .team-grid');
      if (!title || !grid) return;
      const mm = gsap.matchMedia();
      mm.add('(min-width: 901px)', () => {
        const st = ScrollTrigger.create({
          trigger: section, start: 'top 6rem',
          endTrigger: grid, end: 'bottom bottom',
          pin: title, pinSpacing: false,
          invalidateOnRefresh: true
        });
      });
    });

    // — Scrubbing text reveal —
    gsap.utils.toArray('.scrub-text').forEach(textEl => {
      const words = textEl.textContent.trim().split(/\s+/);
      if (words.length < 3) return;
      const wrapped = words.map((w, i) => `<span class="scrub-word" style="--wi:${i};display:inline-block">${w}&nbsp;</span>`).join('');
      textEl.innerHTML = wrapped;
      const wordSpans = textEl.querySelectorAll('.scrub-word');
      gsap.fromTo(wordSpans, { opacity: 0.15, filter: 'blur(2px)' }, {
        opacity: 1, filter: 'blur(0px)',
        scrollTrigger: {
          trigger: textEl, start: 'top 80%', end: 'top 25%', scrub: 1.2, once: true
        }
      });
    });

    // — Counter animation for stats —
    gsap.utils.toArray('.stat__num').forEach(numEl => {
      const text = numEl.textContent.trim();
      const isNumeric = /^[\d,.]+$/.test(text.replace(/[+kK]/g, ''));
      if (!isNumeric && text !== 'ISO') return;

      const suffix = text.match(/[+kK]/)?.[0] || '';
      const rawNum = parseFloat(text.replace(/[+,kK]/g, '')) || 0;
      const hasK = suffix.toLowerCase() === 'k';
      if (text === 'ISO') return;

      ScrollTrigger.create({
        trigger: numEl.closest('.stat'),
        start: 'top 85%',
        onEnter: () => {
          gsap.fromTo(numEl, { innerText: 0 }, {
            innerText: rawNum,
            duration: 1.2,
            ease: 'power2.out',
            snap: { innerText: 1 },
            onUpdate: function () {
              const val = Math.round(this.targets()[0].innerText);
              const display = hasK ? `${val}${suffix}` : `${val}${suffix}`;
              numEl.innerText = display;
            },
            onComplete: () => {
              if (hasK) numEl.innerText = `${rawNum}${suffix}`;
            }
          });
        },
        once: true
      });
    });

    // — Gallery image scale & fade on scroll —
    gsap.utils.toArray('.gallery img').forEach((img) => {
      gsap.fromTo(img, { scale: 0.92, opacity: 0.5, filter: 'grayscale(0.3)' }, {
        scale: 1, opacity: 1, filter: 'grayscale(0)', duration: 1,
        scrollTrigger: {
          trigger: img, start: 'top 85%', end: 'top 40%', scrub: 0.8, once: true
        }
      });
    });

    // — Parallax page header backgrounds —
    gsap.utils.toArray('.page-header__bg img').forEach(img => {
      gsap.to(img, {
        y: '12%', scale: 1.06, ease: 'none',
        scrollTrigger: {
          trigger: img.closest('.page-header'), start: 'top bottom', end: 'bottom top', scrub: 1
        }
      });
    });

    // — Section divider parallax —
    gsap.utils.toArray('.section-divider img').forEach(img => {
      gsap.to(img, {
        y: '15%', scale: 1.08, ease: 'none',
        scrollTrigger: {
          trigger: img.closest('.section-divider'), start: 'top bottom', end: 'bottom top', scrub: 1
        }
      });
    });

    // — Card stagger animations on scroll —
    gsap.utils.toArray('.card-grid, .bento, .team-grid').forEach(grid => {
      const items = grid.children;
      if (items.length < 2) return;
      gsap.from(items, {
        y: 30, opacity: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out',
        scrollTrigger: {
          trigger: grid, start: 'top 85%', once: true
        }
      });
    });

    // — Marquee infinite scroll —
    const marquees = document.querySelectorAll('.marquee');
    marquees.forEach(mq => {
      const track = mq.querySelector('.marquee__track');
      if (!track) return;
      const clone = track.cloneNode(true);
      mq.appendChild(clone);
      const distance = track.scrollWidth;
      gsap.to([track, clone], { x: -distance, duration: 20, ease: 'none', repeat: -1 });
    });

  } else {
    // Fallback for reduced-motion / no GSAP
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    document.querySelectorAll('.scrub-word, .gallery img').forEach(el => {
      if (el.style) { el.style.opacity = '1'; el.style.filter = 'none'; }
    });
    document.querySelectorAll('.card-grid .card, .bento .bento__cell, .team-grid .team-card').forEach(el => {
      el.style.opacity = '1'; el.style.transform = 'none';
    });
  }

  // — Lightbox —
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox?.querySelector('img');
  const lightboxClose = lightbox?.querySelector('.lightbox__close');
  document.querySelectorAll('.gallery__item').forEach(item => {
    item.addEventListener('click', (e) => {
      const img = item.tagName === 'IMG' ? item : item.querySelector('img');
      if (!img || !lightbox || !lightboxImg) return;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  // — Magnetic buttons: subtle cursor-follow —
  document.querySelectorAll('.btn-primary, .header__donate').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      btn.style.setProperty('--mx', `${x}%`);
      btn.style.setProperty('--my', `${y}%`);
    });
  });

  // — Contact form feedback with animation —
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const feedback = contactForm.querySelector('.contact-form__feedback');
      if (!feedback) return;
      const formData = new FormData(contactForm);
      const name = formData.get('name');
      const email = formData.get('email');
      const message = formData.get('message');

      if (!name || !email || !message) {
        feedback.textContent = 'Please fill in all required fields.';
        feedback.className = 'contact-form__feedback error visible';
        if (window.gsap) gsap.fromTo(feedback, { scale: 0.96, opacity: 0.5 }, { scale: 1, opacity: 1, duration: 0.35, ease: 'power2.out' });
        return;
      }
      if (!email.includes('@')) {
        feedback.textContent = 'Please enter a valid email address.';
        feedback.className = 'contact-form__feedback error visible';
        if (window.gsap) gsap.fromTo(feedback, { scale: 0.96, opacity: 0.5 }, { scale: 1, opacity: 1, duration: 0.35, ease: 'power2.out' });
        return;
      }

      feedback.textContent = 'Thank you! We will get back to you soon.';
      feedback.className = 'contact-form__feedback visible';
      if (window.gsap) {
        gsap.fromTo(feedback, { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' });
        gsap.from(contactForm.querySelector('button'), { y: 10, opacity: 0, duration: 0.4, delay: 0.2 });
      }
      contactForm.reset();
      console.log('Form submission (demo):', { name, email, message });
    });
  }
});

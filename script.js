
  // header shadow on scroll
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.getElementById('siteHeader');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // mobile nav toggle
  const burger = document.getElementById('burgerBtn');
  const nav = document.getElementById('siteNav');
  if (burger && nav) {
    const setMenuState = (open) => {
      nav.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
    };
    burger.addEventListener('click', () => setMenuState(!nav.classList.contains('open')));
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenuState(false)));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') setMenuState(false);
    });
  }

  // smooth scroll for all in-page anchor links, with proper offset for the fixed header,
  // and closing the mobile menu without cancelling the navigation
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const wasOpen = nav && nav.classList.contains('open');
      if (nav) nav.classList.remove('open');
      if (burger) burger.setAttribute('aria-expanded', 'false');
      const doScroll = () => {
        const headerHeight = header ? header.offsetHeight : 0;
        const y = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12;
        window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
      };
      // give the menu-close transition a moment before scrolling, so the tap isn't lost
      if (wasOpen) { setTimeout(doScroll, 80); } else { doScroll(); }
    });
  });

  // reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  (() => {
    const slider = document.getElementById('schoolSlider');
    if (!slider) return;

    const slides = [...slider.querySelectorAll('.school-slide')];
    const dots = [...slider.querySelectorAll('.school-dots span')];
    const previousButton = slider.querySelector('.school-arrow-prev');
    const nextButton = slider.querySelector('.school-arrow-next');
    if (!slides.length) return;
    let current = 0;
    let timer;

    const showSlide = (index) => {
      slides[current].classList.remove('active');
      dots[current]?.classList.remove('active');
      current = index;
      slides[current].classList.add('active');
      dots[current]?.classList.add('active');
    };

    const start = () => {
      clearInterval(timer);
      if (reduceMotion) return;
      timer = setInterval(() => showSlide((current + 1) % slides.length), 3000);
    };

    const changeSlide = (step) => {
      showSlide((current + step + slides.length) % slides.length);
      start();
    };

    previousButton?.addEventListener('click', () => changeSlide(-1));
    nextButton?.addEventListener('click', () => changeSlide(1));

    slider.addEventListener('mouseenter', () => clearInterval(timer));
    slider.addEventListener('mouseleave', start);
    slider.addEventListener('focusin', () => clearInterval(timer));
    slider.addEventListener('focusout', start);
    document.addEventListener('visibilitychange', () => document.hidden ? clearInterval(timer) : start());
    start();
  })();



// La fiche tarifs est désormais chargée depuis un fichier PDF externe.

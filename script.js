'use strict';

window.addEventListener('load', function (e) {
  // Mobile navigation
  function myFunction() {
    var x = document.querySelector('.mobilenav');
    if (x.className === 'mobilenav') {
      x.className += ' responsive';
    } else {
      x.className = 'mobilenav';
    }
  }

  // Modal window ----------------------------------------------------
  const modal = document.querySelector('.modal');
  const overlay = document.querySelector('.overlay');
  const btnCloseModal = document.querySelector('.btn--close-modal');
  const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

  const openModal = function (e) {
    e.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
  };

  const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
  };

  btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

  btnCloseModal.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  // Scroll sections into view  -------------------------------------------
  const btnScrollTo = document.querySelector('.btn--scroll-to');
  const section1 = document.querySelector('#section--1');

  btnScrollTo.addEventListener('click', function (e) {
    section1.scrollIntoView({ behavior: 'smooth' });
  });

  // Event delegation
  // 1. Select the common parent element which will listen for event
  const navlinks = document.querySelector('.nav__links');

  // 2. Add event listener for parent element
  navlinks.addEventListener('click', function (e) {
    e.preventDefault();

    // 3. Matching strategy: match certain child elements for which it will handle event
    if (e.target.classList.contains('nav__link')) {
      const id = e.target.getAttribute('href');
      document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    }
  });

  // const navLink = document.querySelectorAll('.nav__link');
  // navLink.forEach(link =>
  //   link.addEventListener('click', function (e) {
  //     e.preventDefault();
  //     const id = this.getAttribute('href');
  //     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  //   })
  // );

  // Tabbed component -------------------------------------------------------
  const tabsContainer = document.querySelector('.operations__tab-container');
  const tab = document.querySelectorAll('.operations__tab');
  const tabsContent = document.querySelectorAll('.operations__content');

  tabsContainer.addEventListener('click', function (e) {
    // matching strategy
    const clicked = e.target.closest('.operations__tab');
    if (!clicked) return;

    // remove active classes
    tab.forEach(t => t.classList.remove('operations__tab--active'));
    tabsContent.forEach(c => c.classList.remove('operations__content--active'));

    // add active classes
    clicked.classList.add('operations__tab--active');

    // show content area
    document
      .querySelector(`.operations__content--${clicked.dataset.tab}`)
      .classList.add('operations__content--active');
  });

  // Navigation: mouseover/mouseout effect --------------------------------------
  const nav = document.querySelector('.nav');
  const eventHandler = function (e) {
    // matching
    if (e.target.classList.contains('nav__link')) {
      const linkSibling = e.target
        .closest('.nav')
        .querySelectorAll('.nav__link');
      const logo = e.target.closest('.nav').querySelector('.nav__logo');

      linkSibling.forEach(el => {
        if (el !== e.target) el.style.opacity = this;
      });
      logo.style.opacity = this;
    }
  };

  nav.addEventListener('mouseover', eventHandler.bind(0.5));
  nav.addEventListener('mouseout', eventHandler.bind(1));

  // Sticky navigation -----------------------------------------------------------
  const sec1 = section1.getBoundingClientRect();
  window.addEventListener('scroll', function () {
    if (window.scrollY > sec1.top) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
  });

  const obsCallback = function (entries, observer) {
    // entries.forEach(entry => console.log(entry));
  };
  const obsOptions = {
    root: null,
    threshold: 0.1,
  };
  const observer = new IntersectionObserver(obsCallback, obsOptions);
  observer.observe(section1);

  //#region Sticky navigation when scrolling past header
  // const header = document.querySelector('.header');
  // const navTop = nav.getBoundingClientRect().height; // get the height of nav
  // const stickyNav = function (entries) {
  //   const [entry] = entries;
  //   if (!entry.isIntersecting) nav.classList.add('sticky');
  //   else nav.classList.remove('sticky');
  // };
  // const headerObserver = new IntersectionObserver(stickyNav, {
  //   root: null,
  //   threshold: 0,
  //   rootMargin: `-${navTop}px`,
  // });
  // headerObserver.observe(header);
  //#endregion

  // Reveal element on scroll --------------------------------------
  const allSections = document.querySelectorAll('.section');
  const revealSection = function (entries, observer) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  };

  const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15,
  });

  allSections.forEach(sec => {
    sectionObserver.observe(sec);
    sec.classList.add('section--hidden');
  });

  // Lazy loading --------------------------------------------------
  const imgTargets = document.querySelectorAll('img[data-src]');
  const loadImg = function (entries, observer) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', function () {
      entry.target.classList.remove('lazy-img');
    });
    imgObserver.unobserve(entry.target);
  };
  const imgObserver = new IntersectionObserver(loadImg, {
    root: null,
    threshold: 0,
    rootMargin: '200px',
  });
  imgTargets.forEach(img => imgObserver.observe(img));

  // Slider component -----------------------------------------------
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let maxSlide = slides.length;
  let curSlide = 0;

  // Functions ---------------------------------------------------------
  // Go to slide
  const createDots = function () {
    slides.forEach((_, i) => {
      document
        .querySelector('.dots')
        .insertAdjacentHTML(
          'beforeend',
          `<div class="dots__dot" data-slide="${i}"></div>`
        );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide = "${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) curSlide = 0;
    else curSlide++;
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // Prev slide
  const prevSlide = function () {
    if (curSlide === 0) curSlide = maxSlide - 1;
    else curSlide--;
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') {
      nextSlide();
    }
    if (e.key === 'ArrowLeft') {
      prevSlide();
    }
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const slide = e.target.dataset.slide;
      goToSlide(slide);
      activateDot(slide);
    }
  });
});

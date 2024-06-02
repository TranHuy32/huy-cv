'use strict';

window.addEventListener('load', function (e) {
  // Hide navbar-collapse on click
  const toggleIcon = document.querySelector('.navbar-icon');
  toggleIcon.addEventListener('click', function () {
    const navLinks = document.querySelectorAll('.nav-item');
    const menuToggle = document.getElementById('navbarSupportedContent');
    const bsCollapse = bootstrap.Collapse.getOrCreateInstance(menuToggle, {
      toggle: false,
    });
    navLinks.forEach(l => {
      l.addEventListener('click', e => {
        bsCollapse.toggle();
      });
    });
  });

  // Sticky navigation -----------------------------------------------------------
  const nav = document.querySelector('.navbar');
  // Sticky navigation when scrolling past header
  const header = document.querySelector('.header');
  const navTop = nav.getBoundingClientRect().height; // get the height of nav
  const stickyNav = function (entries) {
    const [entry] = entries;
    if (!entry.isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
  };
  const headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navTop}px`,
  });
  headerObserver.observe(header);

  // Scroll sections into view  --------------------------------------------------
  const btnScrollTo = document.querySelector('.btn--scroll-to');
  const section1 = document.querySelector('#section--1');

  btnScrollTo.addEventListener('click', function (e) {
    section1.scrollIntoView({ behavior: 'smooth' });
  });

  // Event delegation
  const navlinks = document.querySelector('.nav__links');
  navlinks.addEventListener('click', function (e) {
    e.preventDefault();
    if (e.target.classList.contains('nav-link')) {
      const id = e.target.getAttribute('href');
      document
        .querySelector(id)
        .scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // Tabbed component -------------------------------------------------------------
  const tabsContainer = document.querySelector('.experience__tab-container');
  const experienceContentContainer = document.querySelector(
    '.experience__content-container'
  );
  const tab = document.querySelectorAll('.experience-title__tab');
  const tabsContent = document.querySelectorAll('.experience__content');
  const experienceContentItems = document.querySelectorAll('.job-content');

  // Display one of experience, education, certificate sections
  tabsContainer.addEventListener('click', function (e) {
    // matching strategy
    const clickedTitle = e.target.closest('.experience-title__tab');
    if (!clickedTitle) return;

    // remove active classes
    tab.forEach(t => t.classList.remove('experience-title__tab--active'));
    tabsContent.forEach(c => c.classList.remove('experience__content--active'));
    // Hide experience content when switching among tabs
    experienceContentItems.forEach(c => c.classList.remove('show'));

    // add active classes
    clickedTitle.classList.add('experience-title__tab--active');

    // show content area
    document
      .querySelector(`.experience__content--${clickedTitle.dataset.tab}`)
      .classList.add('experience__content--active');
  });

  // Expand job content: listen on the whole experience => locate content & display
  experienceContentContainer.addEventListener('click', function (e) {
    const clickedContent = e.target
      .closest('.exp-item')
      .querySelector('.job-content');
    if (!clickedContent) return;

    const experienceShowIcon = e.target
      .closest('.exp-item')
      .querySelector('.job__show-icon');

    clickedContent.classList.toggle('show');
    experienceShowIcon.classList.toggle('hide');
    clickedContent.style.transition = 'height 0.1s ease-in-out';
    if (clickedContent.classList.contains('show')) {
      clickedContent.style.height = clickedContent.scrollHeight + 'px';
    } else {
      clickedContent.style.height = '0';
    }
  });

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
});

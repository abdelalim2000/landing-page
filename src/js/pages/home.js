import { gsap, ScrollTrigger } from '../core/gsap-register.js';
import { HeroWebGL } from '../webgl/hero-core.js';
import { startVisualExperienceOnce } from '../motion/hero-intro.js';
import { initTextReveals } from '../motion/text-reveals.js';
import { initCounters } from '../motion/counters.js';
import { initApproachSequence } from '../motion/section-story.js';
import { initTechMap } from '../motion/path-animation.js';

function initCapabilities() {
  const container = document.getElementById('expertise-desktop-container');
  if (!container) return () => {};

  const triggers = Array.from(container.querySelectorAll('.expertise-trigger'));
  const states = Array.from(container.querySelectorAll('.expertise-state'));
  if (!triggers.length || triggers.length !== states.length) return () => {};

  let activeIndex = 0;
  const setActive = (index, immediate = false) => {
    if (index < 0 || index >= states.length) return;
    activeIndex = index;

    triggers.forEach((trigger, triggerIndex) => {
      trigger.classList.toggle('active', triggerIndex === index);
      gsap.to(trigger, {
        opacity: triggerIndex === index ? 1 : 0.24,
        duration: immediate ? 0 : 0.35,
        overwrite: true,
      });
    });

    states.forEach((state, stateIndex) => {
      state.classList.toggle('is-active', stateIndex === index);
      gsap.to(state, {
        autoAlpha: stateIndex === index ? 1 : 0,
        duration: immediate ? 0 : 0.45,
        overwrite: true,
      });
    });
  };

  setActive(0, true);

  triggers.forEach((trigger, index) => {
    ScrollTrigger.create({
      trigger,
      start: 'top 62%',
      end: 'bottom 38%',
      onEnter: () => setActive(index),
      onEnterBack: () => setActive(index),
    });
  });

  return () => {
    triggers.forEach((trigger) => gsap.killTweensOf(trigger));
    states.forEach((state) => gsap.killTweensOf(state));
    activeIndex = 0;
  };
}

function initMobileAccordions() {
  const items = Array.from(document.querySelectorAll('.accordion-item'));
  const cleanups = [];

  items.forEach((item) => {
    const button = item.querySelector('button');
    if (!button) return;

    const handleClick = () => {
      const willOpen = !item.classList.contains('active');
      items.forEach((other) => {
        other.classList.remove('active');
        other.querySelector('button')?.setAttribute('aria-expanded', 'false');
      });
      if (willOpen) {
        item.classList.add('active');
        button.setAttribute('aria-expanded', 'true');
      }
    };

    button.addEventListener('click', handleClick);
    cleanups.push(() => button.removeEventListener('click', handleClick));
  });

  return () => cleanups.forEach((cleanup) => cleanup());
}

function initWorkStories() {
  const articles = Array.from(document.querySelectorAll('.work-article'));

  articles.forEach((article, index) => {
    const content = article.querySelector('.work-content');
    const visual = article.querySelector('.work-visual');
    const panels = article.querySelectorAll('.panel-1, .panel-2');
    const chartPath = article.querySelector('.chart-path');
    const routeLine = article.querySelector('.route-line');

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: article,
        start: 'top 72%',
        once: true,
      },
    });

    if (content) {
      timeline.from(content, {
        x: index % 2 === 0 ? -48 : 48,
        autoAlpha: 0,
        duration: 0.9,
        ease: 'cinematic',
      });
    }
    if (visual) {
      timeline.from(visual, {
        scale: 0.92,
        autoAlpha: 0,
        duration: 1,
        ease: 'cinematic',
      }, '-=0.7');
    }
    if (panels.length) {
      timeline.from(panels, {
        y: 32,
        rotation: (panelIndex) => (panelIndex % 2 ? 3 : -3),
        autoAlpha: 0,
        stagger: 0.12,
        duration: 0.75,
        ease: 'power3.out',
      }, '-=0.65');
    }
    if (chartPath) {
      timeline.to(chartPath, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.out' }, '-=0.7');
    }
    if (routeLine) {
      timeline.fromTo(routeLine, { strokeDashoffset: 120 }, {
        strokeDashoffset: 0,
        duration: 1.3,
        ease: 'none',
      }, '-=0.8');
    }

    if (visual && window.matchMedia('(pointer: fine)').matches) {
      gsap.to(visual, {
        yPercent: -5,
        ease: 'none',
        scrollTrigger: {
          trigger: article,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8,
        },
      });
    }
  });

  return () => {};
}

function initDiagnostic() {
  const section = document.getElementById('diagnostic');
  if (!section) return () => {};

  const timeline = gsap.timeline({
    scrollTrigger: { trigger: section, start: 'top 68%', once: true },
  });

  timeline
    .fromTo('.diag-scanner', { autoAlpha: 0, top: 0 }, {
      autoAlpha: 1,
      top: '100%',
      duration: 1.3,
      ease: 'power1.inOut',
    })
    .to('.diag-scanner', { autoAlpha: 0, duration: 0.2 })
    .to('.diag-bar', { width: '100%', duration: 0.9, stagger: 0.16 }, '-=0.9')
    .to('.diag-status', {
      text: '[VERIFIED]',
      color: 'var(--lime-primary)',
      duration: 0.4,
      stagger: 0.15,
    }, '-=0.7')
    .fromTo('.diag-text', { y: 24, autoAlpha: 0 }, {
      y: 0,
      autoAlpha: 1,
      duration: 0.75,
      stagger: 0.1,
      ease: 'power3.out',
    }, '-=0.55')
    .to('.diag-header', { opacity: 1, duration: 0.45, stagger: 0.1 }, '-=0.45');

  return () => timeline.kill();
}

function initTestimonials() {
  const slides = Array.from(document.querySelectorAll('.test-slide'));
  const counter = document.getElementById('test-counter');
  const previous = document.getElementById('test-prev');
  const next = document.getElementById('test-next');
  if (slides.length < 2 || !previous || !next) return () => {};

  let current = 0;
  let transitioning = false;

  const showSlide = (nextIndex) => {
    if (transitioning || nextIndex === current) return;
    transitioning = true;
    const outgoing = slides[current];
    const incoming = slides[nextIndex];

    gsap.timeline({ onComplete: () => { transitioning = false; } })
      .to(outgoing, { y: -18, autoAlpha: 0, duration: 0.35, ease: 'power2.in' })
      .set(outgoing, { pointerEvents: 'none' })
      .set(incoming, { y: 22, pointerEvents: 'auto' })
      .to(incoming, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'power3.out' });

    current = nextIndex;
    if (counter) counter.textContent = `${current + 1} / ${slides.length}`;
  };

  const onNext = () => showSlide((current + 1) % slides.length);
  const onPrevious = () => showSlide((current - 1 + slides.length) % slides.length);
  const onKeyDown = (event) => {
    if (event.key === 'ArrowRight') onNext();
    if (event.key === 'ArrowLeft') onPrevious();
  };

  next.addEventListener('click', onNext);
  previous.addEventListener('click', onPrevious);
  document.getElementById('testimonial-container')?.addEventListener('keydown', onKeyDown);

  return () => {
    next.removeEventListener('click', onNext);
    previous.removeEventListener('click', onPrevious);
    document.getElementById('testimonial-container')?.removeEventListener('keydown', onKeyDown);
  };
}

function initFinalCta() {
  const section = document.getElementById('cta-bg')?.parentElement;
  if (!section) return () => {};

  const rings = section.querySelectorAll('.cta-ring');
  const content = section.querySelector('.cta-content');

  gsap.to(rings, {
    rotation: (index) => (index % 2 ? -360 : 360),
    duration: (index) => 18 + index * 8,
    repeat: -1,
    ease: 'none',
  });

  if (content) {
    gsap.from(content, {
      y: 36,
      autoAlpha: 0,
      duration: 0.9,
      ease: 'cinematic',
      scrollTrigger: { trigger: section, start: 'top 70%', once: true },
    });
  }

  return () => gsap.killTweensOf(rings);
}

function initInquiryForm() {
  const form = document.getElementById('inquiry-form');
  if (!form) return () => {};

  const steps = Array.from(form.querySelectorAll('.form-step'));
  const nextButtons = Array.from(form.querySelectorAll('.btn-next'));
  const previousButtons = Array.from(form.querySelectorAll('.btn-prev'));
  const progress = form.querySelector('#form-progress');
  const feedback = form.querySelector('#form-feedback');
  let currentStep = 0;

  const renderStep = (index, direction = 1) => {
    const oldStep = steps[currentStep];
    const newStep = steps[index];
    if (!newStep || oldStep === newStep) return;

    const timeline = gsap.timeline();
    timeline
      .to(oldStep, { x: -20 * direction, autoAlpha: 0, duration: 0.25 })
      .set(oldStep, { display: 'none', position: 'absolute' })
      .set(newStep, { display: 'block', position: 'relative', x: 20 * direction })
      .to(newStep, { x: 0, autoAlpha: 1, duration: 0.35, ease: 'power3.out' });

    currentStep = index;
    if (progress) progress.style.width = `${((index + 1) / steps.length) * 100}%`;
    newStep.querySelector('h3')?.setAttribute('tabindex', '-1');
    newStep.querySelector('h3')?.focus({ preventScroll: true });
  };

  const onNext = () => renderStep(Math.min(currentStep + 1, steps.length - 1), 1);
  const onPrevious = () => renderStep(Math.max(currentStep - 1, 0), -1);

  const onSubmit = (event) => {
    event.preventDefault();
    const requiredFields = Array.from(form.querySelectorAll('[required]'));
    let firstInvalid = null;

    requiredFields.forEach((field) => {
      const valid = field.checkValidity();
      field.classList.toggle('input-error', !valid);
      field.setAttribute('aria-invalid', String(!valid));
      const message = field.parentElement?.querySelector('.err-msg');
      message?.classList.toggle('hidden', valid);
      if (!valid && !firstInvalid) firstInvalid = field;
    });

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    steps[currentStep].style.display = 'none';
    if (feedback) {
      feedback.classList.remove('hidden');
      feedback.innerHTML = `
        <div class="font-mono text-nd-cyan text-sm mb-4">REQUEST VALIDATED</div>
        <h3 class="font-display text-3xl text-primary mb-4">Your project parameters are ready.</h3>
        <p class="text-secondary">This demonstration form does not transmit data. Connect a secure form endpoint before production launch.</p>
      `;
      gsap.fromTo(feedback, { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55 });
    }
  };

  nextButtons.forEach((button) => button.addEventListener('click', onNext));
  previousButtons.forEach((button) => button.addEventListener('click', onPrevious));
  form.addEventListener('submit', onSubmit);

  return () => {
    nextButtons.forEach((button) => button.removeEventListener('click', onNext));
    previousButtons.forEach((button) => button.removeEventListener('click', onPrevious));
    form.removeEventListener('submit', onSubmit);
  };
}

export function initHome() {
  console.log('[NEXUS] Initializing Home Page…');

  const cleanupFunctions = [];
  let heroWebGL = null;

  try {
    const hero = document.getElementById('hero');
    if (hero && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      heroWebGL = new HeroWebGL(hero);
    }
  } catch (error) {
    console.error('[NEXUS] Hero WebGL failed; using the static fallback.', error);
    document.querySelector('.no-motion-fallback')?.classList.remove('hidden');
  }

  const context = gsap.context(() => {
    startVisualExperienceOnce(heroWebGL);

    cleanupFunctions.push(
      initTextReveals(),
      initCounters(),
      initApproachSequence(),
      initTechMap(),
      initCapabilities(),
      initMobileAccordions(),
      initWorkStories(),
      initDiagnostic(),
      initTestimonials(),
      initFinalCta(),
      initInquiryForm(),
    );
  }, document.body);

  document.fonts?.ready?.then(() => ScrollTrigger.refresh());

  requestAnimationFrame(() => {
    if (import.meta.env.DEV) {
      window.__NEXUS_DIAGNOSTICS__ = {
        appStarted: true,
        page: 'home',
        heroTimelineDuration: window.__NEXUS_HERO_TIMELINE__?.duration?.() ?? 0,
        scrollTriggerCount: ScrollTrigger.getAll().length,
        canvasCount: document.querySelectorAll('canvas').length,
        webglRunning: Boolean(heroWebGL?.isRunning),
      };
      console.log('[NEXUS] Diagnostics Active:', window.__NEXUS_DIAGNOSTICS__);
    }
  });

  return () => {
    console.log('[NEXUS] Cleaning up Home Page…');
    cleanupFunctions.reverse().forEach((cleanup) => {
      if (typeof cleanup === 'function') cleanup();
    });
    context.revert();
    heroWebGL?.dispose();
    delete window.__NEXUS_DIAGNOSTICS__;
  };
}

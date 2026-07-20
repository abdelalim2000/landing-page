import { gsap, Flip, ScrollTrigger } from '../core/gsap-register.js';
import { createPageHeroTimeline } from '../motion/page-hero.js';
import { initProjectSignals } from '../motion/project-signals.js';
import { initProjectPreviews } from '../motion/project-preview.js';
import { initCapabilityMatrix } from '../motion/capability-matrix.js';

export function initWork() {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // 1. Initialize Hero Timeline
  const heroEyebrow = document.querySelector('.hero-eyebrow');
  const heroHeadingLines = document.querySelectorAll('.heading-line');
  const heroCopy = document.querySelector('.hero-copy');
  const heroMetadata = document.querySelector('.hero-transparency');
  const heroVisual = document.querySelector('.project-signal-index');
  const scrollIndicator = document.querySelector('.hero-scroll-indicator');

  const heroTl = createPageHeroTimeline({
    root: document.getElementById('work-hero'),
    eyebrow: heroEyebrow,
    headingLines: heroHeadingLines,
    copy: heroCopy,
    metadata: heroMetadata,
    visual: heroVisual,
    scrollIndicator: scrollIndicator,
    reducedMotion: isReducedMotion
  });

  // Play hero animation
  heroTl.play();

  // 2. Initialize Project Signals
  const cleanupSignals = initProjectSignals();

  // 3. Initialize Project Previews
  const cleanupPreviews = initProjectPreviews();

  // 4. Initialize Capability Matrix
  const cleanupMatrix = initCapabilityMatrix();

  // 5. Initialize Filters
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projects = document.querySelectorAll('.project-chapter');

  const handleFilter = (e) => {
    const btn = e.currentTarget;
    const filter = btn.dataset.filter;

    // Update active state
    filterBtns.forEach(b => {
      b.classList.remove('active', 'border-primary', 'text-primary');
      b.classList.add('border-border-medium', 'text-secondary');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('active', 'border-primary', 'text-primary');
    btn.classList.remove('border-border-medium', 'text-secondary');
    btn.setAttribute('aria-pressed', 'true');

    // Update project visual states instead of removing from DOM
    projects.forEach(project => {
      if (filter === 'all') {
        gsap.to(project, { opacity: 1, duration: 0.4, ease: 'power2.out' });
      } else {
        const categories = project.dataset.categories || '';
        if (categories.includes(filter)) {
          gsap.to(project, { opacity: 1, duration: 0.4, ease: 'power2.out' });
        } else {
          gsap.to(project, { opacity: 0.3, duration: 0.4, ease: 'power2.out' });
        }
      }
    });

    // Also update hero signals if possible
    const signals = document.querySelectorAll('[data-project]');
    signals.forEach(signal => {
      if (filter === 'all') {
        gsap.to(signal, { opacity: 1, duration: 0.4 });
      } else {
        const pId = signal.dataset.project;
        const matchingProject = document.getElementById(pId);
        if (matchingProject) {
           const cats = matchingProject.dataset.categories || '';
           if (cats.includes(filter)) {
              gsap.to(signal, { opacity: 1, duration: 0.4 });
           } else {
              gsap.to(signal, { opacity: 0.2, duration: 0.4 });
           }
        }
      }
    });
  };

  filterBtns.forEach(btn => btn.addEventListener('click', handleFilter));

  // 6. Initialize Discovery Pulse
  const discoveryVisual = document.querySelector('.discovery-visual');
  if (discoveryVisual && !isReducedMotion) {
    gsap.to('.discovery-pulse', {
      scale: 2,
      opacity: 0,
      duration: 1.5,
      repeat: -1,
      ease: 'power2.out'
    });
  }

  // Cleanup function
  return () => {
    if (heroTl) heroTl.kill();
    if (typeof cleanupSignals === 'function') cleanupSignals();
    if (typeof cleanupPreviews === 'function') cleanupPreviews();
    if (typeof cleanupMatrix === 'function') cleanupMatrix();
    filterBtns.forEach(btn => btn.removeEventListener('click', handleFilter));
    gsap.killTweensOf('.discovery-pulse');
  };
}

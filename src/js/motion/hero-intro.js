import { gsap } from '../core/gsap-register.js';

let visualExperienceStarted = false;
let fallbackTimer = null;

function revealEverything(elements, titleLines, heroWebGL) {
  gsap.set(elements.filter(Boolean), { autoAlpha: 1, y: 0, clearProps: 'transform' });
  gsap.set(titleLines, { yPercent: 0, rotateX: 0 });
  heroWebGL?.setAssemblyProgress?.(1);
}

export function startVisualExperienceOnce(heroWebGL) {
  const loader = document.getElementById('loader');
  const loaderProgress = document.getElementById('loader-progress');
  const loaderBar = document.getElementById('loader-bar');
  const loaderStatus = document.getElementById('loader-status');
  const navContainer = document.getElementById('nav-container');
  const eyebrow = document.querySelector('.hero-eyebrow');
  const titleLines = Array.from(document.querySelectorAll('.hero-title > div > span'));
  const titleGradient = document.querySelector('.hero-title .bg-gradient-to-r');
  const copy = document.querySelector('.hero-copy');
  const ctas = document.querySelector('.hero-ctas');
  const telemetry = document.querySelector('.hero-telemetry');
  const revealElements = [navContainer, eyebrow, copy, ctas, telemetry];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (visualExperienceStarted) {
    if (loader) {
      loader.style.display = 'none';
      loader.style.pointerEvents = 'none';
    }
    revealEverything(revealElements, titleLines, heroWebGL);
    document.body.style.overflow = '';
    return window.__NEXUS_HERO_TIMELINE__ ?? null;
  }
  visualExperienceStarted = true;

  if (reducedMotion) {
    if (loader) loader.style.display = 'none';
    revealEverything(revealElements, titleLines, heroWebGL);
    document.body.style.overflow = '';
    return null;
  }

  document.body.style.overflow = 'hidden';
  gsap.set(revealElements.filter(Boolean), { autoAlpha: 0, y: 20 });
  gsap.set(titleLines, { yPercent: 110, rotateX: -8, transformOrigin: '50% 100%' });
  if (titleGradient) gsap.set(titleGradient, { backgroundPosition: '200% center' });

  const timeline = gsap.timeline({
    paused: true,
    defaults: { ease: 'cinematic' },
    onComplete: () => {
      document.body.style.overflow = '';
      if (loader) {
        loader.style.display = 'none';
        loader.style.pointerEvents = 'none';
      }
      if (fallbackTimer) clearTimeout(fallbackTimer);
      console.log('[NEXUS] Hero timeline completed.');
    },
  });

  if (loader && loaderBar) {
    const loaderState = { progress: 0 };
    timeline
      .to(loaderState, {
        progress: 100,
        duration: 1.35,
        ease: 'power2.inOut',
        onUpdate: () => {
          const progress = Math.round(loaderState.progress);
          loaderBar.style.width = `${progress}%`;
          if (loaderProgress) loaderProgress.textContent = `${progress}%`;
          if (loaderStatus) {
            loaderStatus.textContent = progress < 34
              ? 'INITIALIZING CORE'
              : progress < 72
                ? 'MAPPING SYSTEMS'
                : 'ASSEMBLING SIGNAL';
          }
        },
      })
      .to(loader, {
        clipPath: 'inset(0 0 100% 0)',
        autoAlpha: 0,
        duration: 0.75,
        ease: 'power3.inOut',
      });
  } else if (loader) {
    timeline.to(loader, { autoAlpha: 0, duration: 0.25 });
  }

  if (navContainer) timeline.to(navContainer, { autoAlpha: 1, y: 0, duration: 0.65 }, '-=0.35');
  if (eyebrow) timeline.to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.65 }, '-=0.4');
  if (titleLines.length) {
    timeline.to(titleLines, {
      yPercent: 0,
      rotateX: 0,
      duration: 1.05,
      stagger: 0.12,
      ease: 'power4.out',
    }, '-=0.45');
  }
  if (titleGradient) {
    timeline.to(titleGradient, {
      backgroundPosition: '0% center',
      duration: 1.25,
      ease: 'power2.out',
    }, '-=0.75');
  }
  if (copy) timeline.to(copy, { autoAlpha: 1, y: 0, duration: 0.7 }, '-=0.9');
  if (ctas) timeline.to(ctas, { autoAlpha: 1, y: 0, duration: 0.7 }, '-=0.55');
  timeline.add(() => heroWebGL?.playAssembly?.(), '-=0.65');
  if (telemetry) timeline.to(telemetry, { autoAlpha: 1, y: 0, duration: 0.7 }, '-=0.25');

  window.__NEXUS_HERO_TIMELINE__ = timeline;
  timeline.play(0);

  fallbackTimer = window.setTimeout(() => {
    if (timeline.progress() < 0.05) {
      console.warn('[NEXUS] Hero start timeout reached; revealing the experience.');
      timeline.play(0);
    }
    if (loader && getComputedStyle(loader).display !== 'none' && timeline.progress() > 0.35) {
      loader.style.display = 'none';
      loader.style.pointerEvents = 'none';
      document.body.style.overflow = '';
    }
  }, 3000);

  return timeline;
}

export function resetVisualExperience() {
  visualExperienceStarted = false;
  if (fallbackTimer) clearTimeout(fallbackTimer);
  fallbackTimer = null;
  window.__NEXUS_HERO_TIMELINE__?.kill?.();
  delete window.__NEXUS_HERO_TIMELINE__;
}

if (import.meta.hot) {
  import.meta.hot.dispose(resetVisualExperience);
}

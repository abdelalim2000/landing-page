import { gsap } from '../core/gsap-register.js';

/**
 * Reusable utility for internal page heroes.
 * Does not force a specific HTML structure but operates on passed elements.
 */
export function createPageHeroTimeline({
  root,
  eyebrow,
  headingLines,
  copy,
  metadata,
  visual,
  scrollIndicator,
  accent,
  reducedMotion = false
} = {}) {
  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' }
  });

  if (reducedMotion) {
    gsap.set([eyebrow, headingLines, copy, metadata, visual, scrollIndicator], { opacity: 1, y: 0, scale: 1 });
    return tl;
  }

  if (eyebrow) {
    tl.fromTo(eyebrow, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6 }, 0.1);
  }

  if (headingLines && headingLines.length) {
    tl.fromTo(headingLines, 
      { yPercent: 100, opacity: 0 }, 
      { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power4.out' }, 
      0.2
    );
  }

  if (copy) {
    tl.fromTo(copy, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, 0.4);
  }

  if (metadata) {
    tl.fromTo(metadata, { opacity: 0 }, { opacity: 1, duration: 0.8 }, 0.6);
  }

  if (visual) {
    tl.fromTo(visual, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 1.2 }, 0.5);
  }

  if (scrollIndicator) {
    tl.fromTo(scrollIndicator, { opacity: 0 }, { opacity: 1, duration: 0.8 }, 1.0);
  }

  return tl;
}

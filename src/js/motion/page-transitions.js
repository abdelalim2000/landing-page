import { gsap } from '../core/gsap-register.js';

let transitionOverlay = null;

function createOverlay() {
  if (transitionOverlay) return transitionOverlay;
  transitionOverlay = document.createElement('div');
  transitionOverlay.id = 'nexus-transition-overlay';
  transitionOverlay.className = 'fixed inset-0 z-[9999] pointer-events-none flex flex-col justify-center items-center';
  transitionOverlay.setAttribute('aria-hidden', 'true');
  
  const line = document.createElement('div');
  line.className = 'w-0 h-[1px] bg-nd-cyan transition-line';
  
  const bg = document.createElement('div');
  bg.className = 'absolute inset-0 bg-page opacity-0 transition-bg';
  
  transitionOverlay.appendChild(bg);
  transitionOverlay.appendChild(line);
  document.body.appendChild(transitionOverlay);
  return transitionOverlay;
}

export function initPageTransitions() {
  const overlay = createOverlay();
  const line = overlay.querySelector('.transition-line');
  const bg = overlay.querySelector('.transition-bg');
  
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleClick = (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    if (link.target === '_blank') return;
    if (link.hasAttribute('data-no-transition')) return;
    
    // Check if it's the same domain
    try {
      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return; // Same page hash navigation
    } catch (err) {
      return;
    }

    if (e.ctrlKey || e.shiftKey || e.metaKey || e.button !== 0) return;

    if (isReducedMotion) return; // Allow default navigation

    e.preventDefault();
    
    // Start transition
    const tl = gsap.timeline({
      onComplete: () => {
        window.location.href = href;
      }
    });

    // Fallback timeout
    const fallbackTimer = setTimeout(() => {
      window.location.href = href;
    }, 1500);

    tl.to(bg, { opacity: 1, duration: 0.3, ease: 'power2.inOut' })
      .to(line, { width: '100%', duration: 0.4, ease: 'power3.inOut' }, 0)
      .to(document.getElementById('main-content'), { scale: 0.98, opacity: 0.5, duration: 0.4, ease: 'power2.out' }, 0);
      
    // Store timer so it could be cleared if needed, but not strictly necessary here
  };

  document.addEventListener('click', handleClick);

  // Entrance animation
  if (!isReducedMotion) {
    gsap.to(line, { width: '0%', opacity: 0, duration: 0.5, ease: 'power3.out', delay: 0.1 });
    gsap.to(bg, { opacity: 0, duration: 0.4, ease: 'power2.out', delay: 0.2 });
    gsap.from(document.getElementById('main-content'), { scale: 0.98, opacity: 0, duration: 0.6, ease: 'power2.out', clearProps: 'all' });
  }

  return () => {
    document.removeEventListener('click', handleClick);
    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
    transitionOverlay = null;
  };
}

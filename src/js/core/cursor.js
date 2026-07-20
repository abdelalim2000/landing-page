import { gsap } from '../core/gsap-register.js';

export function initCursor() {
  const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  if (isTouch) return null;

  const cursor = document.getElementById('custom-cursor');
  if (!cursor) return null;

  gsap.set(cursor, { xPercent: -50, yPercent: -50 });
  
  const xTo = gsap.quickTo(cursor, "x", {duration: 0.4, ease: "power3"});
  const yTo = gsap.quickTo(cursor, "y", {duration: 0.4, ease: "power3"});
  
  const handleMouseMove = (e) => {
    xTo(e.clientX);
    yTo(e.clientY);
    if (!cursor.classList.contains('active')) {
      cursor.classList.add('active');
    }
  };

  window.addEventListener("mousemove", handleMouseMove, {passive: true});

  const setupDataCursor = () => {
    document.querySelectorAll('[data-cursor]').forEach(el => {
      // Remove old listeners if we re-init
      el.removeEventListener('mouseenter', el._cursorEnter);
      el.removeEventListener('mouseleave', el._cursorLeave);

      el._cursorEnter = () => {
        const state = el.getAttribute('data-cursor');
        cursor.setAttribute('data-state', state);
        if (state === 'view') {
          cursor.innerText = 'VIEW';
        } else if (state === 'start') {
          cursor.innerText = 'START';
        } else {
          cursor.innerText = '';
        }
      };

      el._cursorLeave = () => {
        cursor.removeAttribute('data-state');
        cursor.innerText = '';
      };

      el.addEventListener('mouseenter', el._cursorEnter);
      el.addEventListener('mouseleave', el._cursorLeave);
    });
  };

  setupDataCursor();

  // Re-run setup if the DOM changes dynamically
  const observer = new MutationObserver(() => setupDataCursor());
  observer.observe(document.body, { childList: true, subtree: true });

  return () => {
    window.removeEventListener("mousemove", handleMouseMove);
    observer.disconnect();
    document.querySelectorAll('[data-cursor]').forEach(el => {
      if (el._cursorEnter) el.removeEventListener('mouseenter', el._cursorEnter);
      if (el._cursorLeave) el.removeEventListener('mouseleave', el._cursorLeave);
    });
  };
}

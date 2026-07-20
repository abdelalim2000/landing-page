import { gsap } from '../core/gsap-register.js';

export function initNavigation() {
  const header = document.getElementById('site-header');
  const menuBtn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  let lastScroll = 0;
  let menuOpen = false;
  let focusableElements = [];

  if (menu) {
    focusableElements = Array.from(menu.querySelectorAll('a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'));
  }

  const handleScroll = () => {
    if (menuOpen) return;
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
      header.classList.add('bg-elevated', 'bg-opacity-90', 'backdrop-blur-md', 'shadow-sm', 'border-b', 'border-nd-border');
      header.classList.remove('py-6');
      header.classList.add('py-4');
    } else {
      header.classList.remove('bg-elevated', 'bg-opacity-90', 'backdrop-blur-md', 'shadow-sm', 'border-b', 'border-nd-border');
      header.classList.add('py-6');
      header.classList.remove('py-4');
    }

    if (currentScroll > lastScroll && currentScroll > 200) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }
    lastScroll = currentScroll;
  };

  const trapFocus = (e) => {
    if (!menuOpen) return;
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    } else if (e.key === 'Escape') {
      toggleMenu();
    }
  };

  const toggleMenu = () => {
    menuOpen = !menuOpen;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (menuBtn) {
      menuBtn.setAttribute('aria-expanded', menuOpen);
      if (menuOpen) {
        menuBtn.classList.add('menu-open');
        menuBtn.querySelector('.line-1').style.transform = 'translateY(8px) rotate(45deg)';
        menuBtn.querySelector('.line-2').style.opacity = '0';
        menuBtn.querySelector('.line-3').style.transform = 'translateY(-8px) rotate(-45deg)';
      } else {
        menuBtn.classList.remove('menu-open');
        menuBtn.querySelector('.line-1').style.transform = 'none';
        menuBtn.querySelector('.line-2').style.opacity = '1';
        menuBtn.querySelector('.line-3').style.transform = 'none';
      }
    }

    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      menu.setAttribute('aria-hidden', 'false');
      
      if (reducedMotion) {
        menu.style.opacity = 1;
        menu.style.pointerEvents = 'auto';
        menu.querySelectorAll('a').forEach(a => {
          a.style.opacity = 1;
          a.style.transform = 'none';
        });
      } else {
        gsap.to(menu, { opacity: 1, pointerEvents: 'auto', duration: 0.4, ease: 'power2.out' });
        gsap.fromTo(menu.querySelectorAll('a'), { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.4, delay: 0.1 });
      }

      if (focusableElements.length) focusableElements[0].focus();
      document.addEventListener('keydown', trapFocus);
    } else {
      document.body.style.overflow = '';
      menu.setAttribute('aria-hidden', 'true');
      
      if (reducedMotion) {
        menu.style.opacity = 0;
        menu.style.pointerEvents = 'none';
      } else {
        gsap.to(menu, { opacity: 0, pointerEvents: 'none', duration: 0.3 });
      }

      document.removeEventListener('keydown', trapFocus);
      if (menuBtn) menuBtn.focus();
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  if (menuBtn) menuBtn.addEventListener('click', toggleMenu);

  const mobileLinks = document.querySelectorAll('.mobile-link');
  const closeHandlers = [];
  mobileLinks.forEach(l => {
    const handler = () => { if(menuOpen) toggleMenu(); };
    l.addEventListener('click', handler);
    closeHandlers.push({ el: l, fn: handler });
  });

  return () => {
    window.removeEventListener('scroll', handleScroll);
    if (menuBtn) menuBtn.removeEventListener('click', toggleMenu);
    closeHandlers.forEach(ch => ch.el.removeEventListener('click', ch.fn));
    document.removeEventListener('keydown', trapFocus);
  };
}

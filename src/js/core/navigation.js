import { gsap } from '../core/gsap-register.js';

export function initNavigation() {
  const header = document.getElementById('site-header');
  const menuBtn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  let lastScroll = 0;
  let menuOpen = false;

  const handleScroll = () => {
    if (menuOpen) return;
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
      header.classList.add('bg-surface/90', 'backdrop-blur-md', 'shadow-sm', 'border-b', 'border-border-soft');
      header.classList.remove('py-6');
      header.classList.add('py-4');
    } else {
      header.classList.remove('bg-surface/90', 'backdrop-blur-md', 'shadow-sm', 'border-b', 'border-border-soft');
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

  const toggleMenu = () => {
    menuOpen = !menuOpen;
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      gsap.to(menu, { opacity: 1, pointerEvents: 'auto', duration: 0.4, ease: 'power2.out' });
      gsap.fromTo(menu.querySelectorAll('a'), { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.4, delay: 0.1 });
    } else {
      document.body.style.overflow = '';
      gsap.to(menu, { opacity: 0, pointerEvents: 'none', duration: 0.3 });
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  if (menuBtn) menuBtn.addEventListener('click', toggleMenu);

  const mobileLinks = document.querySelectorAll('.mobile-link');
  mobileLinks.forEach(l => l.addEventListener('click', () => {
    if(menuOpen) toggleMenu();
  }));

  return () => {
    window.removeEventListener('scroll', handleScroll);
    if (menuBtn) menuBtn.removeEventListener('click', toggleMenu);
    mobileLinks.forEach(l => l.removeEventListener('click', () => {}));
  };
}

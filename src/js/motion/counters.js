import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initCounters() {
  const ctx = gsap.context(() => {
    document.querySelectorAll('.counter').forEach(c => {
      const t = parseFloat(c.getAttribute('data-target'));
      const f = c.getAttribute('data-float') === 'true';
      gsap.to(c, { 
        innerHTML: t, 
        duration: 2, 
        ease: "power2.out", 
        snap: { innerHTML: f ? 0.1 : 1 }, 
        scrollTrigger: { trigger: ".intro-metrics", start: "top 80%", once: true } 
      });
    });
  });
  return () => ctx.revert();
}

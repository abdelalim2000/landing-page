import { gsap } from '../core/gsap-register.js';
import { ScrollTrigger } from '../core/gsap-register.js';

export function initProjectPreviews() {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isReducedMotion) return () => {};

  const triggers = [];

  // AETHER HEALTH
  const aetherSvg = document.querySelector('.aether-svg');
  if (aetherSvg) {
    const tlAether = gsap.timeline({
      scrollTrigger: {
        trigger: '#aether',
        start: 'top 60%',
        end: 'bottom 40%',
        toggleActions: 'play reverse play reverse'
      }
    });

    tlAether.fromTo('.panel-patient', { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 0)
            .fromTo('.panel-practitioner', { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 0.2)
            .fromTo(['.sync-path-1', '.sync-path-2'], { strokeDashoffset: 200 }, { strokeDashoffset: 0, duration: 1.5, ease: 'none' }, 0.5)
            .fromTo('.node-identity', { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.5)' }, 1.0)
            .fromTo('.pulse-ring', { scale: 0.8, opacity: 1 }, { scale: 1.5, opacity: 0, duration: 1.5, repeat: -1, ease: 'power2.out' }, 1.2)
            .fromTo('.sync-dot', { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.2, ease: 'back.out(2)' }, 1.4);
            
    triggers.push(tlAether.scrollTrigger);
  }

  // QUANTUM FINANCE
  const quantumSvg = document.querySelector('.quantum-svg');
  if (quantumSvg) {
    const tlQuantum = gsap.timeline({
      scrollTrigger: {
        trigger: '#quantum',
        start: 'top 60%',
        end: 'bottom 40%',
        toggleActions: 'play reverse play reverse'
      }
    });

    tlQuantum.fromTo('.q-stream', { strokeDasharray: '0 1000' }, { strokeDasharray: '500 1000', duration: 2, ease: 'power2.inOut', stagger: 0.2 }, 0)
             .fromTo('.q-model-core', { rotation: -45, opacity: 0, scale: 0.5 }, { rotation: 0, opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.2)' }, 0.8)
             .fromTo('.q-pulse', { scale: 1, opacity: 1 }, { scale: 2.5, opacity: 0, duration: 1.2, repeat: -1, ease: 'power1.out' }, 1.2)
             .fromTo('.q-node', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, stagger: 0.2, ease: 'back.out(1.5)' }, 1.0)
             .fromTo('.q-chart path', { strokeDasharray: '0 500' }, { strokeDasharray: '500 500', duration: 1.5, ease: 'power3.out' }, 1.5)
             .fromTo('.q-chart circle', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2)' }, 2.8);
             
    triggers.push(tlQuantum.scrollTrigger);
  }

  // NOVA LOGISTICS
  const novaSvg = document.querySelector('.nova-svg');
  if (novaSvg) {
    const tlNova = gsap.timeline({
      scrollTrigger: {
        trigger: '#nova',
        start: 'top 60%',
        end: 'bottom 40%',
        toggleActions: 'play reverse play reverse'
      }
    });

    tlNova.fromTo('.n-grid', { opacity: 0 }, { opacity: 0.1, duration: 1 }, 0)
          .fromTo('.n-node', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.5)' }, 0.2)
          .fromTo('.n-route-old', { strokeDasharray: '0 1000' }, { strokeDasharray: '8 8', duration: 1.5, ease: 'power2.out' }, 0.8)
          .to('.n-route-old', { opacity: 0.1, duration: 0.5 }, 2.5)
          .fromTo('.n-route-new', { strokeDasharray: '0 1000' }, { strokeDasharray: '1000 1000', duration: 2, ease: 'power3.inOut' }, 2.0)
          .fromTo('.n-pulse', { scale: 1, opacity: 1 }, { scale: 2.5, opacity: 0, duration: 1.5, repeat: -1, ease: 'power2.out' }, 1.0);
          
    triggers.push(tlNova.scrollTrigger);
  }

  return () => {
    triggers.forEach(t => t && t.kill());
  };
}

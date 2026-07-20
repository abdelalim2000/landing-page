import { gsap, ScrollTrigger, MotionPathPlugin } from '../core/gsap-register.js';

export function initTechMap() {
  const container = document.getElementById('tech-map-container');
  if (!container) return () => {};

  const paths = Array.from(container.querySelectorAll('#tech-network-svg path'));
  const nodes = Array.from(container.querySelectorAll('.tech-node'));
  const signals = [
    ['#sig-product', '#path-product', 0],
    ['#sig-cloud', '#path-cloud', 0.5],
    ['#sig-intel', '#path-intel', 1],
    ['#sig-growth', '#path-growth', 1.5],
  ];

  const ctx = gsap.context(() => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top 70%',
        once: true,
      },
    });

    timeline
      .fromTo(
        '#tech-core',
        { scale: 0.6, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 0.8, ease: 'back.out(1.5)' },
      )
      .fromTo(
        paths,
        { strokeDasharray: 1000, strokeDashoffset: 1000 },
        { strokeDashoffset: 0, duration: 1.2, stagger: 0.1, ease: 'power2.out' },
        '-=0.25',
      )
      .to(
        nodes,
        { scale: 1, autoAlpha: 1, duration: 0.65, stagger: 0.12, ease: 'back.out(1.2)' },
        '-=0.55',
      );

    signals.forEach(([signalSelector, pathSelector, delay]) => {
      const signal = container.querySelector(signalSelector);
      const path = container.querySelector(pathSelector);
      if (!signal || !path) return;

      gsap.set(signal, { autoAlpha: 1 });
      gsap.to(signal, {
        motionPath: {
          path,
          align: path,
          alignOrigin: [0.5, 0.5],
          autoRotate: false,
        },
        duration: 2.4,
        repeat: -1,
        delay,
        ease: 'none',
      });
    });

    const diagnosticSignal = document.querySelector('.diagnostic-signal');
    if (diagnosticSignal) {
      gsap.fromTo(
        diagnosticSignal,
        { autoAlpha: 0, y: 0 },
        {
          autoAlpha: 1,
          y: 128,
          duration: 1,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: diagnosticSignal.parentElement,
            start: 'top 70%',
            once: true,
          },
        },
      );
    }
  }, container.parentElement ?? container);

  if (import.meta.env.DEV && !ScrollTrigger.getAll().length) {
    console.warn('[NEXUS] Technology map initialized without ScrollTriggers.');
  }

  return () => ctx.revert();
}

export { MotionPathPlugin };

import { gsap } from '../core/gsap-register.js';

export function initApproachSequence() {
  const container = document.getElementById('approach-scroll-container');
  if (!container || !window.matchMedia('(min-width: 768px)').matches) return () => {};

  const texts = Array.from(container.querySelectorAll('.approach-text'));
  const stages = Array.from(container.querySelectorAll('.approach-stage'));
  if (texts.length < 4 || stages.length < 4) return () => {};

  const discoverPaths = container.querySelectorAll('#stage-1-vis svg path');
  const engineerPath = container.querySelector('#stage-3-vis svg path');
  const optimizePath = container.querySelector('#stage-4-vis svg path');

  const ctx = gsap.context(() => {
    gsap.set(texts, { autoAlpha: 0 });
    gsap.set(stages, { autoAlpha: 0, pointerEvents: 'none' });
    gsap.set(texts[0], { autoAlpha: 1 });
    gsap.set(stages[0], { autoAlpha: 1 });

    stages.forEach((stage, index) => stage.classList.toggle('is-active', index === 0));

    const showStage = (index) => {
      stages.forEach((stage, stageIndex) => {
        stage.classList.toggle('is-active', stageIndex === index);
      });
    };

    const timeline = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.7,
        invalidateOnRefresh: true,
      },
    });

    timeline
      .addLabel('discover')
      .fromTo('.s1-item', { scale: 0.65, autoAlpha: 0, rotate: -10 }, {
        scale: 1,
        autoAlpha: 1,
        rotate: 0,
        stagger: 0.08,
        duration: 0.55,
      })
      .fromTo(discoverPaths, { strokeDasharray: 500, strokeDashoffset: 500 }, {
        strokeDashoffset: 0,
        duration: 0.55,
      }, '<0.1')
      .to({}, { duration: 0.65 })
      .addLabel('architect')
      .to([texts[0], stages[0]], { autoAlpha: 0, duration: 0.3 })
      .call(() => showStage(1))
      .to([texts[1], stages[1]], { autoAlpha: 1, duration: 0.35 }, '<')
      .fromTo('.s2-box', { scale: 0.8, autoAlpha: 0 }, {
        scale: 1,
        autoAlpha: 1,
        stagger: 0.08,
        duration: 0.45,
      }, '<0.05')
      .to({}, { duration: 0.65 })
      .addLabel('engineer')
      .to([texts[1], stages[1]], { autoAlpha: 0, duration: 0.3 })
      .call(() => showStage(2))
      .to([texts[2], stages[2]], { autoAlpha: 1, duration: 0.35 }, '<')
      .fromTo('.s3-layer', { x: 90, y: 90, autoAlpha: 0 }, {
        x: 0,
        y: 0,
        autoAlpha: 1,
        stagger: 0.1,
        duration: 0.55,
      }, '<0.05')
      .fromTo(engineerPath, { strokeDasharray: 200, strokeDashoffset: 200 }, {
        strokeDashoffset: 0,
        duration: 0.45,
      }, '<0.15')
      .fromTo('.s3-pulse', { scale: 0, transformOrigin: 'center' }, {
        scale: 1,
        duration: 0.3,
        ease: 'back.out(2)',
      }, '<0.2')
      .to({}, { duration: 0.65 })
      .addLabel('optimize')
      .to([texts[2], stages[2]], { autoAlpha: 0, duration: 0.3 })
      .call(() => showStage(3))
      .to([texts[3], stages[3]], { autoAlpha: 1, duration: 0.35 }, '<')
      .fromTo('.s4-panel', { y: 24, autoAlpha: 0 }, {
        y: 0,
        autoAlpha: 1,
        stagger: 0.1,
        duration: 0.45,
      }, '<0.05')
      .fromTo(optimizePath, { strokeDasharray: 700, strokeDashoffset: 700 }, {
        strokeDashoffset: 0,
        duration: 0.55,
      }, '<0.1')
      .to('.s4-bar', { scaleX: 1, duration: 0.5 }, '<0.1')
      .to({}, { duration: 0.8 });
  }, container);

  return () => ctx.revert();
}

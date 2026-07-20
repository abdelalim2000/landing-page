import { gsap, ScrollTrigger } from '../core/gsap-register.js';
import { HeroWebGL } from '../webgl/hero-core.js';
import { startVisualExperienceOnce } from '../motion/hero-intro.js';
import { initTextReveals } from '../motion/text-reveals.js';
import { initCounters } from '../motion/counters.js';
import { initApproachSequence } from '../motion/section-story.js';
import { initTechMap } from '../motion/path-animation.js';

export function initHome() {
  console.log("[NEXUS] Initializing Home Page...");
  
  let heroWebGL = null;
  const canvasContainer = document.getElementById('webgl-container') || document.getElementById('hero');
  if (canvasContainer) {
    heroWebGL = new HeroWebGL(canvasContainer);
  }

  const context = gsap.context(() => {
    // 1. Start the visual experience (Loader -> Hero Timeline)
    startVisualExperienceOnce(heroWebGL);

    // 2. Motion Modules
    initTextReveals();
    initCounters();
    initApproachSequence();
    initTechMap();

    // 3. Section Triggers (Core Capabilities)
    const capabilityTriggers = document.querySelectorAll('.expertise-trigger');
    const capabilityStages = document.querySelectorAll('.expertise-stage');
    
    capabilityTriggers.forEach((trigger, i) => {
      ScrollTrigger.create({
        trigger: trigger,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          gsap.to(trigger, { opacity: 1, duration: 0.3 });
          trigger.classList.add('active');
          capabilityStages.forEach((stage, idx) => {
            gsap.to(stage, { autoAlpha: idx === i ? 1 : 0, duration: 0.4 });
          });
        },
        onLeaveBack: () => {
          gsap.to(trigger, { opacity: 0.4, duration: 0.3 });
          trigger.classList.remove('active');
          if (i > 0) {
            capabilityTriggers[i-1].classList.add('active');
            gsap.to(capabilityTriggers[i-1], { opacity: 1, duration: 0.3 });
            capabilityStages.forEach((stage, idx) => {
              gsap.to(stage, { autoAlpha: idx === (i-1) ? 1 : 0, duration: 0.4 });
            });
          }
        }
      });
    });

    // 4. Diagnostics & Testimonials
    const tl = gsap.timeline({ scrollTrigger: { trigger: "#diagnostic", start: "top 60%", once: true } });
    tl.to(".diag-scanner", { opacity: 1, top: "100%", duration: 1.5, ease: "power1.inOut" })
      .to(".diag-scanner", { opacity: 0, duration: 0.2 })
      .to(".diag-bar", { width: "100%", duration: 1, stagger: 0.2 }, "-=1")
      .to(".diag-status", { text: "[VERIFIED]", color: "var(--color-nd-lime)", duration: 0.5, stagger: 0.2 }, "-=0.8")
      .to(".diag-text", { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, "-=0.5");

    const slides = document.querySelectorAll('.test-slide');
    const counter = document.getElementById('test-counter');
    const btnPrev = document.getElementById('test-prev');
    const btnNext = document.getElementById('test-next');
    if(slides.length && btnNext) {
      let current = 0;
      function showSlide(idx) {
        gsap.to(slides[current], { opacity: 0, pointerEvents: 'none', duration: 0.4 });
        current = idx;
        gsap.to(slides[current], { opacity: 1, pointerEvents: 'auto', duration: 0.4, delay: 0.2 });
        if(counter) counter.innerText = `${current + 1} / ${slides.length}`;
      }
      btnNext.addEventListener('click', () => showSlide((current + 1) % slides.length));
      btnPrev.addEventListener('click', () => showSlide((current - 1 + slides.length) % slides.length));
    }
  }, document.body);

  // Expose diagnostics in dev mode
  if (import.meta.env.DEV) {
    window.__NEXUS_DIAGNOSTICS__ = {
      appStarted: true,
      page: "home",
      scrollTriggerCount: ScrollTrigger.getAll().length,
      canvasCount: document.querySelectorAll("canvas").length,
      webglRunning: !!heroWebGL
    };
    console.log("[NEXUS] Diagnostics Active:", window.__NEXUS_DIAGNOSTICS__);
  }

  return () => {
    console.log("[NEXUS] Cleaning up Home Page...");
    context.revert();
    if (heroWebGL) heroWebGL.dispose();
  };
}

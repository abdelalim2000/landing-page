import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initApproachSequence() {
  const container = document.getElementById('approach-scroll-container');
  if(!container) return () => {};

  const texts = document.querySelectorAll('.approach-text');
  const stages = document.querySelectorAll('.approach-stage');
  if(stages.length < 4) return () => {};

  const ctx = gsap.context(() => {
    const tl = gsap.timeline({ 
      scrollTrigger: { trigger: container, start: "top top", end: "bottom bottom", scrub: true } 
    });

    // Init all to 0 except first
    gsap.set(stages[0], { autoAlpha: 1 });
    gsap.set([stages[1], stages[2], stages[3]], { autoAlpha: 0 });

    // 0 -> 25% (Discover -> Architect)
    tl.to({}, {duration: 1}) // Hold 1
      .to(texts[0], {opacity: 0, duration: 0.5}, "trans1")
      .to(stages[0], {autoAlpha: 0, duration: 0.5}, "trans1")
      .to(stages[1], {autoAlpha: 1, duration: 0.5}, "trans1")
      .to(texts[1], {opacity: 1, duration: 0.5}, "trans1")
      
    // 25 -> 50% (Architect -> Engineer)
      .to({}, {duration: 1}) // Hold 2
      .to(texts[1], {opacity: 0, duration: 0.5}, "trans2")
      .to(stages[1], {autoAlpha: 0, duration: 0.5}, "trans2")
      .to(stages[2], {autoAlpha: 1, duration: 0.5}, "trans2")
      .to(texts[2], {opacity: 1, duration: 0.5}, "trans2")

    // 50 -> 75% (Engineer -> Optimize)
      .to({}, {duration: 1}) // Hold 3
      .to(texts[2], {opacity: 0, duration: 0.5}, "trans3")
      .to(stages[2], {autoAlpha: 0, duration: 0.5}, "trans3")
      .to(stages[3], {autoAlpha: 1, duration: 0.5}, "trans3")
      .to(texts[3], {opacity: 1, duration: 0.5}, "trans3")
      
    // 75 -> 100%
      .to({}, {duration: 1}); // Hold 4
  });

  return () => ctx.revert();
}

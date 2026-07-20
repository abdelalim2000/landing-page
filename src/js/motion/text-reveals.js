import { gsap } from '../core/gsap-register.js';




export function initTextReveals() {
  const ctx = gsap.context(() => {
    gsap.to("#intro-line-1", { 
      strokeDashoffset: 0, 
      scrollTrigger: { trigger: "#introduction", start: "top 80%", end: "center center", scrub: 1 } 
    });
    
    gsap.to("#intro-line-2", { 
      strokeDashoffset: 0, 
      scrollTrigger: { trigger: "#introduction", start: "top 70%", end: "center center", scrub: 1 } 
    });
    
    gsap.to(".word-illum", { 
      opacity: 1, stagger: 0.1, 
      scrollTrigger: { trigger: ".intro-text", start: "top 70%", end: "center center", scrub: true } 
    });
    
    gsap.to(".diagnostic-scanner", { 
      width: "100%", 
      scrollTrigger: { trigger: ".intro-metrics", start: "top 80%", once: true, duration: 1 } 
    });
  });

  return () => ctx.revert();
}

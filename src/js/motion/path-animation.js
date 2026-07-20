import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

export function initTechMap() {
  const container = document.getElementById('tech-map-container');
  if(!container) return () => {};

  const ctx = gsap.context(() => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: container, start: "top 60%", once: true } });
    
    tl.fromTo("#tech-core", {scale: 0, opacity: 0}, {scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.5)"})
      .fromTo("#tech-network-svg path", {strokeDasharray: 1000, strokeDashoffset: 1000}, {strokeDashoffset: 0, duration: 1, stagger: 0.1}, "-=0.2")
      .to(".tech-node", {scale: 1, opacity: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.2)"}, "-=0.5");
      
    gsap.to("#sig-product", { display: "block", motionPath: {path: "#path-product", align: "#path-product", alignOrigin: [0.5, 0.5]}, duration: 2, repeat: -1, ease: "none"});
    gsap.to("#sig-cloud", { display: "block", motionPath: {path: "#path-cloud", align: "#path-cloud", alignOrigin: [0.5, 0.5]}, duration: 2, repeat: -1, delay: 0.5, ease: "none"});
    gsap.to("#sig-intel", { display: "block", motionPath: {path: "#path-intel", align: "#path-intel", alignOrigin: [0.5, 0.5]}, duration: 2, repeat: -1, delay: 1, ease: "none"});
    gsap.to("#sig-growth", { display: "block", motionPath: {path: "#path-growth", align: "#path-growth", alignOrigin: [0.5, 0.5]}, duration: 2, repeat: -1, delay: 1.5, ease: "none"});

    gsap.to(".diagnostic-signal", { display: "block", y: "100%", duration: 1, scrollTrigger: { trigger: ".diagnostic-signal", start: "top 60%", once: true } });
  });

  return () => ctx.revert();
}

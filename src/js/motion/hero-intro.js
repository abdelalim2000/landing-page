import { gsap } from '../core/gsap-register.js';

let visualExperienceStarted = false;

export function startVisualExperienceOnce(heroWebGL) {
  if (visualExperienceStarted) return;
  visualExperienceStarted = true;

  const loader = document.getElementById('loader');
  const loaderProgress = document.getElementById('loader-progress');
  const loaderBar = document.getElementById('loader-bar');
  const loaderStatus = document.getElementById('loader-status');
  
  // Elements to reveal
  const navContainer = document.getElementById('nav-container');
  const eyebrow = document.querySelector('.hero-eyebrow');
  const titleLines = document.querySelectorAll('.hero-title > div > span');
  const titleGradient = document.querySelector('.hero-title .bg-gradient-to-r');
  const copy = document.querySelector('.hero-copy');
  const ctas = document.querySelector('.hero-ctas');
  const telemetry = document.querySelector('.hero-telemetry');

  const tl = gsap.timeline({
    onComplete: () => {
      console.log("[NEXUS] Hero Timeline Completed.");
      document.body.style.overflow = '';
      if (loader) loader.style.pointerEvents = 'none';
    }
  });

  // Prepare initial states (so content doesn't pop in if it was visible by default)
  gsap.set([navContainer, eyebrow, copy, ctas, telemetry], { autoAlpha: 0, y: 20 });
  gsap.set(titleLines, { yPercent: 100 });
  if (titleGradient) gsap.set(titleGradient, { backgroundPosition: '200% center' });

  // 1. Simulate Loader
  if (loader) {
    tl.to(loaderBar, { width: '100%', duration: 1.5, ease: 'power2.inOut', onUpdate: function() {
      if (loaderProgress) loaderProgress.innerText = Math.floor(this.progress() * 100) + '%';
      if (loaderStatus && this.progress() > 0.5) loaderStatus.innerText = 'ASSEMBLING CORE...';
    }})
    .to(loader, { opacity: 0, duration: 0.8, ease: 'power2.inOut', onComplete: () => loader.style.display = 'none' });
  }

  // 2. Navigation enters
  tl.to(navContainer, { autoAlpha: 1, y: 0, duration: 0.8, ease: "cinematic" }, "-=0.4");

  // 3. Eyebrow label reveals
  if (eyebrow) {
    tl.to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.8, ease: "cinematic" }, "-=0.6");
  }

  // 4. Headline lines reveal through masks
  if (titleLines.length) {
    tl.to(titleLines, { 
      yPercent: 0, 
      duration: 1.2, 
      stagger: 0.15, 
      ease: "cinematic" 
    }, "-=0.6");
  }

  // 5. Highlighted line light sweep
  if (titleGradient) {
    tl.to(titleGradient, { backgroundPosition: '0% center', duration: 1.5, ease: "power2.out" }, "-=0.8");
  }

  // 6. Supporting copy enters
  if (copy) {
    tl.to(copy, { autoAlpha: 1, y: 0, duration: 0.8, ease: "cinematic" }, "-=1.0");
  }

  // 7. CTA controls enter
  if (ctas) {
    tl.to(ctas, { autoAlpha: 1, y: 0, duration: 0.8, ease: "cinematic" }, "-=0.8");
  }

  // 8. WebGL assembly uniform advances & signal particles move
  if (heroWebGL && heroWebGL.playAssembly) {
    tl.add(() => heroWebGL.playAssembly(), "-=0.6");
  }

  // 9. Telemetry enters
  if (telemetry) {
    tl.to(telemetry, { autoAlpha: 1, y: 0, duration: 0.8, ease: "cinematic" }, "-=0.4");
  }

  // Fallback timeout to ensure the experience starts even if loader fails
  setTimeout(() => {
    if (tl.progress() === 0) {
      console.warn("[NEXUS] Loader timeout reached. Forcing timeline.");
      tl.play();
    }
  }, 3000);

  return tl;
}

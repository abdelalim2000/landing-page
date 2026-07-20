import { gsap } from '../core/gsap-register.js';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin.js';

export function initProjectSignals() {
  const container = document.querySelector('.project-signal-index');
  if (!container) return;

  const tooltip = container.querySelector('.signal-tooltip');
  const tooltipId = tooltip.querySelector('.tooltip-id');
  const tooltipTitle = tooltip.querySelector('.tooltip-title');
  const tooltipDesc = tooltip.querySelector('.tooltip-desc');
  
  const signals = container.querySelectorAll('.signal-node');

  const projectData = {
    aether: { id: 'AH-01', title: 'Aether Health', desc: 'Healthcare Technology', color: '#18e0ff' },
    quantum: { id: 'QF-02', title: 'Quantum Finance', desc: 'Financial Intelligence', color: '#8b5cf6' },
    nova: { id: 'NL-03', title: 'Nova Logistics', desc: 'Logistics Infrastructure', color: '#a3ff5f' },
    discovery: { id: 'NX-04', title: 'Entering Discovery', desc: 'New system initialization', color: 'var(--text-muted)' }
  };

  // Hover interactions
  signals.forEach(signal => {
    signal.addEventListener('mouseenter', (e) => {
      const proj = projectData[signal.dataset.project];
      if (!proj) return;

      tooltipId.textContent = proj.id;
      tooltipTitle.textContent = proj.title;
      tooltipDesc.textContent = proj.desc;
      tooltipTitle.style.color = proj.color;
      
      const rect = signal.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      const x = rect.left - containerRect.left + rect.width / 2;
      const y = rect.top - containerRect.top - 20;

      gsap.to(tooltip, {
        x: x - 50,
        y: y - 80,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
      });

      gsap.to(signal, { scale: 1.2, duration: 0.3, ease: 'back.out(1.5)' });
    });

    signal.addEventListener('mouseleave', () => {
      gsap.to(tooltip, { opacity: 0, duration: 0.2 });
      gsap.to(signal, { scale: 1, duration: 0.3, ease: 'power2.out' });
    });

    signal.addEventListener('click', () => {
      const targetId = signal.dataset.project;
      if (targetId === 'discovery') {
        const targetSection = document.getElementById('discovery');
        if (targetSection) targetSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        const targetSection = document.getElementById(targetId);
        if (targetSection) targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
    
    // Accessibility
    signal.setAttribute('tabindex', '0');
    signal.setAttribute('role', 'button');
    signal.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        signal.click();
      }
    });
  });

  // Orbital motion (only if not reduced motion)
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  const orbitPaths = container.querySelectorAll('.orbit-paths path');
  if (!orbitPaths || orbitPaths.length < 2) {
    console.warn('[NEXUS] Missing orbit paths for signals');
    return;
  }

  let orbits = [];

  if (!isReducedMotion) {
    const orbit1 = gsap.to(container.querySelector('[data-project="aether"]'), {
      motionPath: {
        path: orbitPaths[0],
        align: orbitPaths[0],
        alignOrigin: [0.5, 0.5],
        start: 0.25,
        end: 1.25
      },
      duration: 20,
      repeat: -1,
      ease: 'none'
    });

    const orbit2 = gsap.to(container.querySelector('[data-project="quantum"]'), {
      motionPath: {
        path: orbitPaths[1],
        align: orbitPaths[1],
        alignOrigin: [0.5, 0.5],
        start: 0.5,
        end: -0.5
      },
      duration: 35,
      repeat: -1,
      ease: 'none'
    });

    const orbit3 = gsap.to(container.querySelector('[data-project="nova"]'), {
      motionPath: {
        path: orbitPaths[1],
        align: orbitPaths[1],
        alignOrigin: [0.5, 0.5],
        start: 0,
        end: 1
      },
      duration: 40,
      repeat: -1,
      ease: 'none'
    });
    
    orbits.push(orbit1, orbit2, orbit3);
  }

  return () => {
    orbits.forEach(o => o.kill());
  };
}

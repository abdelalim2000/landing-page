import { initTheme } from './theme.js';
import { initNavigation } from './navigation.js';
import { initCursor } from './cursor.js';
import { initFooter } from './footer.js';
import { initPageTransitions } from '../motion/page-transitions.js';
import { registerGsap, ScrollTrigger } from './gsap-register.js';

let appInitialized = false;
let currentCleanup = null;

export function revealFallbackContent() {
  document.body.style.overflow = '';
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.display = 'none';
    loader.style.pointerEvents = 'none';
  }

  document.querySelectorAll('.gsap-reveal, .diag-text, .tech-node').forEach((element) => {
    element.style.visibility = 'visible';
    element.style.opacity = '1';
    element.style.transform = 'none';
  });

  document.querySelectorAll('.approach-stage, .expertise-state').forEach((element, index) => {
    if (index === 0 || element.classList.contains('is-active')) {
      element.style.visibility = 'visible';
      element.style.opacity = '1';
    }
  });
}

async function initializePageModule(page) {
  switch (page) {
    case 'home': {
      const { initHome } = await import('../pages/home.js');
      console.log('[NEXUS] Page module imported: home.js');
      return initHome();
    }
    case 'services': {
      const { initServices } = await import('../pages/services.js');
      return initServices();
    }
    case 'work': {
      const { initWork } = await import('../pages/work.js');
      return initWork();
    }
    case 'case-study':
    case 'aether-health':
    case 'quantum-finance':
    case 'nova-logistics': {
      const { initCaseStudy } = await import('../pages/case-study.js');
      return initCaseStudy();
    }
    case 'about': {
      const { initAbout } = await import('../pages/about.js');
      return initAbout();
    }
    case 'contact': {
      const { initContact } = await import('../pages/contact.js');
      return initContact();
    }
    default:
      console.warn(`[NEXUS] No page module registered for: ${page}`);
      return null;
  }
}

function updateDiagnostics(page) {
  const heroCanvas = document.getElementById('hero-canvas');
  window.__NEXUS_DIAGNOSTICS__ = {
    appStarted: appInitialized,
    page,
    heroTimelineDuration: window.__NEXUS_HERO_TIMELINE__?.duration?.() ?? 0,
    scrollTriggerCount: ScrollTrigger.getAll().length,
    canvasCount: document.querySelectorAll('canvas').length,
    webglRunning: Boolean(heroCanvas && heroCanvas.width > 0 && heroCanvas.height > 0),
  };
}

export async function initializeApplication() {
  if (appInitialized) return currentCleanup;
  appInitialized = true;

  console.log('[NEXUS] Application bootstrap called.');

  try {
    registerGsap();
    console.log('[NEXUS] GSAP plugins registered.');

    const cleanupTheme = initTheme();
    const cleanupNavigation = initNavigation();
    const cleanupCursor = initCursor();
    const cleanupFooter = initFooter();
    const cleanupTransitions = initPageTransitions();
    const page = document.body.dataset.page;

    if (!page) throw new Error('The data-page attribute is missing from <body>.');
    console.log(`[NEXUS] Detected data-page: ${page}`);

    const cleanupPage = await initializePageModule(page);

    requestAnimationFrame(() => updateDiagnostics(page));
    window.setTimeout(() => updateDiagnostics(page), 3500);

    currentCleanup = () => {
      if (typeof cleanupPage === 'function') cleanupPage();
      if (typeof cleanupTransitions === 'function') cleanupTransitions();
      if (typeof cleanupFooter === 'function') cleanupFooter();
      if (typeof cleanupCursor === 'function') cleanupCursor();
      if (typeof cleanupNavigation === 'function') cleanupNavigation();
      if (typeof cleanupTheme === 'function') cleanupTheme();
      delete window.__NEXUS_DIAGNOSTICS__;
      currentCleanup = null;
      appInitialized = false;
    };

    return currentCleanup;
  } catch (error) {
    appInitialized = false;
    currentCleanup = null;
    revealFallbackContent();
    console.error('[NEXUS] Application initialization failed:', error);
    throw error;
  }
}

export function cleanupApplication() {
  currentCleanup?.();
}

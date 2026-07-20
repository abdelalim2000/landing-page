import { initTheme } from './theme.js';
import { initNavigation } from './navigation.js';
import { initCursor } from './cursor.js';
import { registerGsap } from './gsap-register.js';

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
    case 'case-study': {
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
    const page = document.body.dataset.page;

    if (!page) throw new Error('The data-page attribute is missing from <body>.');
    console.log(`[NEXUS] Detected data-page: ${page}`);

    const cleanupPage = await initializePageModule(page);

    currentCleanup = () => {
      if (typeof cleanupPage === 'function') cleanupPage();
      if (typeof cleanupCursor === 'function') cleanupCursor();
      if (typeof cleanupNavigation === 'function') cleanupNavigation();
      if (typeof cleanupTheme === 'function') cleanupTheme();
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

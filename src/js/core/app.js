import { initTheme } from './theme.js';
import { initNavigation } from './navigation.js';
import { initCursor } from './cursor.js';
import { registerGsap } from './gsap-register.js';

let appInitialized = false;

export async function initializeApplication() {
  if (appInitialized) return;
  appInitialized = true;

  console.log("Application Bootstrap Called.");
  
  // Register GSAP plugins centrally
  registerGsap();
  console.log("GSAP Plugins Registered.");

  // Initialize Core Systems
  const cleanupTheme = initTheme();
  const cleanupNav = initNavigation();
  const cleanupCursor = initCursor();

  // Determine current page
  const page = document.body.dataset.page;
  console.log(`Detected data-page: ${page}`);
  
  if (!page) {
    console.error("[NEXUS] Critical: data-page attribute is missing on <body>.");
  }

  let pageCleanup = null;

  try {
    switch (page) {
      case "home":
        const { initHome } = await import('../pages/home.js');
        console.log("Page module imported: home.js");
        pageCleanup = initHome();
        break;
      case "services":
        const { initServices } = await import('../pages/services.js');
        pageCleanup = initServices();
        break;
      case "work":
        const { initWork } = await import('../pages/work.js');
        pageCleanup = initWork();
        break;
      case "case-study":
        const { initCaseStudy } = await import('../pages/case-study.js');
        pageCleanup = initCaseStudy();
        break;
      case "about":
        const { initAbout } = await import('../pages/about.js');
        pageCleanup = initAbout();
        break;
      case "contact":
        const { initContact } = await import('../pages/contact.js');
        pageCleanup = initContact();
        break;
      default:
        console.warn(`[NEXUS] No page module registered for: ${page}`);
    }
  } catch (error) {
    console.error(`[NEXUS] Failed to load module for page: ${page}`, error);
    throw error;
  }

  return () => {
    if (cleanupTheme) cleanupTheme();
    if (cleanupNav) cleanupNav();
    if (cleanupCursor) cleanupCursor();
    if (pageCleanup) pageCleanup();
    appInitialized = false;
  };
}

import { initTheme } from './theme.js';
import { initNavigation } from './navigation.js';
import { initCursor } from './cursor.js';
// We will import page logic dynamically here

let applicationStarted = false;

export async function initializeApplication() {
  if (applicationStarted) return;
  applicationStarted = true;

  console.log("Nexus Dynamics: Initializing System...");

  // Initialize Core Systems
  const cleanupTheme = initTheme();
  const cleanupNav = initNavigation();
  const cleanupCursor = initCursor();

  // Load Page Modules
  const page = document.body.dataset.page;
  let pageCleanup = null;

  try {
    switch (page) {
      case "home":
        const { initHome } = await import('../pages/home.js');
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
    }
  } catch (error) {
    console.error(`Failed to load module for page: ${page}`, error);
  }

  // Cleanup handler (Useful for Vite HMR)
  return () => {
    if (cleanupTheme) cleanupTheme();
    if (cleanupNav) cleanupNav();
    if (cleanupCursor) cleanupCursor();
    if (pageCleanup) pageCleanup();
    applicationStarted = false;
  };
}

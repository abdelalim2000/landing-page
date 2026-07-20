import './styles/main.css';
import { initializeApplication } from './js/core/app.js';

// Setup theme early
(function() {
  try {
    const storedTheme = localStorage.getItem('nexus_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = storedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    const metaThemeColor = document.getElementById('meta-theme-color');
    if (metaThemeColor) {
      metaThemeColor.content = theme === 'dark' ? '#02040A' : '#E9EFF6';
    }
  } catch (e) {}
})();

let applicationStarted = false;

export async function startApplicationOnce() {
  if (applicationStarted) return;
  applicationStarted = true;
  
  console.groupCollapsed("[NEXUS] Application Boot");
  console.log("Main module loaded.");
  console.log("CSS loaded.");
  
  try {
    await initializeApplication();
  } catch (e) {
    console.error("[NEXUS] Application initialization failed:", e);
    // Hard fallback: remove js-hidden if boot fails
    document.querySelectorAll('.js-hidden').forEach(el => el.classList.remove('js-hidden'));
  } finally {
    console.groupEnd();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startApplicationOnce, { once: true });
} else {
  startApplicationOnce();
}

if (import.meta.hot) {
  import.meta.hot.dispose(async () => {
    console.log("[NEXUS] HMR dispose: cleaning up application.");
    // The initializeApplication could return the cleanup function.
    // However, since initializeApplication is async and appStarted is a singleton,
    // we would ideally clear the DOM or call the currentCleanup.
    // For now, reload the page on hot update to guarantee no duplicate triggers
    import.meta.hot.invalidate();
  });
}

import './styles/main.css';
import faviconUrl from './assets/favicon.svg?url';
import {
  initializeApplication,
  cleanupApplication,
  revealFallbackContent,
} from './js/core/app.js';

(function installFavicon() {
  let favicon = document.querySelector('link[rel="icon"]');
  if (!favicon) {
    favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/svg+xml';
    document.head.appendChild(favicon);
  }
  favicon.href = faviconUrl;
})();

(function initializeThemeBeforeBoot() {
  try {
    const storedTheme = localStorage.getItem('nexus_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = storedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    const metaThemeColor = document.getElementById('meta-theme-color');
    if (metaThemeColor) metaThemeColor.content = theme === 'dark' ? '#02040A' : '#E9EFF6';
  } catch (error) {
    console.warn('[NEXUS] Theme preference could not be read.', error);
  }
})();

let applicationStarted = false;

export async function startApplicationOnce() {
  if (applicationStarted) return;
  applicationStarted = true;

  console.groupCollapsed('[NEXUS] Application Boot');
  console.log('[NEXUS] Main module loaded.');
  console.log('[NEXUS] Main stylesheet imported.');

  try {
    await initializeApplication();
  } catch (error) {
    applicationStarted = false;
    revealFallbackContent();
    console.error('[NEXUS] Boot failed.', error);
  } finally {
    console.groupEnd();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApplicationOnce, { once: true });
} else {
  startApplicationOnce();
}

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    cleanupApplication();
    applicationStarted = false;
  });
}

import './styles/main.css';
import {
  initializeApplication,
  cleanupApplication,
  revealFallbackContent,
} from './js/core/app.js';
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

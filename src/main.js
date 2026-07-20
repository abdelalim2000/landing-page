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

// Wait for DOM to start initialization
document.addEventListener('DOMContentLoaded', () => {
  initializeApplication();
});

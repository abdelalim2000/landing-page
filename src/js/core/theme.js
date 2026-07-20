export function initTheme() {
  const btnDesktop = document.getElementById('theme-toggle-desktop');
  const btnMobile = document.getElementById('theme-toggle-mobile');
  
  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = current === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    document.documentElement.style.colorScheme = newTheme;
    localStorage.setItem('nexus_theme', newTheme);
    
    const metaThemeColor = document.getElementById('meta-theme-color');
    if (metaThemeColor) {
      metaThemeColor.content = newTheme === 'dark' ? '#02040A' : '#E9EFF6';
    }

    // Dispatch custom event for WebGL and other systems to react
    window.dispatchEvent(new CustomEvent('themechanged', { detail: { theme: newTheme } }));
  }

  if (btnDesktop) btnDesktop.addEventListener('click', toggleTheme);
  if (btnMobile) btnMobile.addEventListener('click', toggleTheme);

  // System preference listener
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleSystemChange = (e) => {
    if (!localStorage.getItem('nexus_theme')) {
      const newTheme = e.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      document.documentElement.style.colorScheme = newTheme;
      window.dispatchEvent(new CustomEvent('themechanged', { detail: { theme: newTheme } }));
    }
  };
  
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleSystemChange);
  }

  return () => {
    if (btnDesktop) btnDesktop.removeEventListener('click', toggleTheme);
    if (btnMobile) btnMobile.removeEventListener('click', toggleTheme);
    if (mediaQuery.removeEventListener) {
      mediaQuery.removeEventListener('change', handleSystemChange);
    }
  };
}

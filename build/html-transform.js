export default function nexusHtmlTransform() {
  return {
    name: 'nexus-html-transform',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const headInjection = `
  <script>
    (function() {
      try {
        var storedTheme = localStorage.getItem('nexus_theme');
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        var theme = storedTheme || (prefersDark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.style.colorScheme = theme;
        var metaThemeColor = document.getElementById('meta-theme-color');
        if (metaThemeColor) metaThemeColor.content = theme === 'dark' ? '#02040A' : '#E9EFF6';
      } catch (e) {
        console.warn('[NEXUS] Theme preference could not be read.', e);
      }
    })();
  </script>
  <style>
    :root, html[data-theme='dark'] { --page-bg: #02040a; --text-primary: #f8fafc; }
    html[data-theme='light'] { --page-bg: #e9eff6; --text-primary: #07111f; }
    html { background: var(--page-bg); color: var(--text-primary); }
    body { margin: 0; min-height: 100%; background: inherit; color: inherit; font-family: Inter, Arial, sans-serif; }
  </style>
  <link rel="icon" type="image/svg+xml" href="/src/assets/favicon.svg">
  <link rel="stylesheet" href="/src/styles/main.css">
`;
        return html.replace('</head>', headInjection + '</head>');
      }
    }
  };
}

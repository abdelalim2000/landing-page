import fs from 'fs';
import path from 'path';

export default function nexusHtmlTransform() {
  return {
    name: 'nexus-html-transform',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        const isNested = ctx.path && ctx.path.includes('/work/');
        const navPath = isNested 
          ? path.resolve(__dirname, '../src/partials/navigation-nested.html') 
          : path.resolve(__dirname, '../src/partials/navigation-root.html');
        const footerPath = isNested 
          ? path.resolve(__dirname, '../src/partials/footer-nested.html') 
          : path.resolve(__dirname, '../src/partials/footer-root.html');
          
        let navHtml = '';
        let footerHtml = '';
        try {
          navHtml = fs.readFileSync(navPath, 'utf-8');
          footerHtml = fs.readFileSync(footerPath, 'utf-8');
        } catch (e) {
          console.warn('[NEXUS] Could not read partials:', e);
        }

        // Apply aria-current="page" to active link
        let filename = ctx.path ? path.basename(ctx.path) : 'index.html';
        if (!filename || filename === '/') filename = 'index.html';
        // escape dot
        const escapedFilename = filename.replace(/\./g, '\\.');
        const activePattern = new RegExp('href="([^"]*' + escapedFilename + ')"', 'g');
        navHtml = navHtml.replace(activePattern, 'href="$1" aria-current="page"');

        html = html.replace('<!-- NEXUS:NAVIGATION -->', navHtml);
        html = html.replace('<!-- NEXUS:FOOTER -->', footerHtml);

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

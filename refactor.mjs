import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filesToProcess = [
  path.join(__dirname, 'index.html'),
  path.join(__dirname, 'work', 'aether-health.html'),
  path.join(__dirname, 'work', 'quantum-finance.html'),
  path.join(__dirname, 'work', 'nova-logistics.html')
];

const classReplacements = {
  'bg-page': 'bg-page', 
  'text-primary': 'text-primary',
  'text-white': 'text-primary',
  'bg-\\[\\#02040A\\]': 'bg-page',
  'bg-black': 'bg-page-alt',
  'border-white\\/10': 'border-border-soft',
  'border-white\\/20': 'border-border-medium',
  'bg-white\\/5': 'bg-surface-elevated',
  'bg-white\\/10': 'bg-surface-strong',
  'text-gray-400': 'text-secondary',
  'text-gray-500': 'text-muted',
  'text-nd-base': 'text-primary'
};

for (const filePath of filesToProcess) {
  if (!fs.existsSync(filePath)) continue;
  let html = fs.readFileSync(filePath, 'utf-8');

  // 1. Remove CDNs
  html = html.replace(/<script src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/three\.js.*?<\/script>\n?/g, '');
  html = html.replace(/<script src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/gsap.*?<\/script>\n?/g, '');
  html = html.replace(/<script src="https:\/\/cdn\.tailwindcss\.com.*?<\/script>\n?/g, '');

  // 2. Remove inline tailwind config and style blocks
  html = html.replace(/<script>\s*tailwind\.config[\s\S]*?<\/script>\n?/g, '');
  html = html.replace(/<style>[\s\S]*?<\/style>\n?/g, '');

  // 3. Remove inline bootstrapper script for the theme (we extracted it to main.js)
  html = html.replace(/<script>\s*\(function\(\)\s*\{\s*try\s*\{\s*const storedTheme[\s\S]*?<\/script>\n?/g, '');

  // 4. Inject module based on file depth
  const isWorkPage = filePath.includes('work');
  const modulePath = isWorkPage ? '../src/main.js' : '/src/main.js';
  if (!html.includes(`src="${modulePath}"`)) {
    html = html.replace('</head>', `  <script type="module" src="${modulePath}"></script>\n</head>`);
  }

  // 5. Remove the massive trailing script
  html = html.replace(/<script>\s*document\.addEventListener\('DOMContentLoaded'[\s\S]*?<\/script>\n?<\/body>/g, '</body>');
  
  // 5b. Remove cursor script in case studies
  html = html.replace(/<script>\s*document\.addEventListener\('DOMContentLoaded'[\s\S]*?<\/script>\n?<\/body>/g, '</body>');

  // 6. Tailwind refactoring: Replace hardcoded colors with semantic colors
  for (const [oldClass, newClass] of Object.entries(classReplacements)) {
    const regex = new RegExp(`\\b${oldClass}\\b`, 'g');
    html = html.replace(regex, newClass);
  }

  fs.writeFileSync(filePath, html, 'utf-8');
  console.log(`Refactored ${filePath}`);
}

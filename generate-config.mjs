import { readdirSync, writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

const outputDir = '.vercel/output';
const staticDir = join(outputDir, 'static');

let config = { version: 3 };
const configPath = join(outputDir, 'config.json');
if (existsSync(configPath)) {
  config = JSON.parse(readFileSync(configPath, 'utf8'));
}

const overrides = {};

function findHtmlFiles(dir, prefix = '') {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      findHtmlFiles(fullPath, relativePath);
    } else if (entry.name.endsWith('.html') && entry.name !== 'index.html') {
      const cleanPath = relativePath.replace(/\.html$/, '');
      overrides[relativePath] = { path: cleanPath };
    }
  }
}

findHtmlFiles(staticDir);
config.overrides = { ...config.overrides, ...overrides };

config.routes = config.routes || [];
config.routes.unshift({
  src: '^(?:/((?:[^/]+?)(?:\\.html)))$',
  headers: { Location: '/$1' },
  status: 308
});

writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log('Generated overrides for', Object.keys(overrides).length, 'HTML files');

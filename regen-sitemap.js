const data = require('./public/words.json');
const today = new Date().toISOString().split('T')[0];
const urls = data.words.map(w => `  <url><loc>https://www.howdoyouspell.app/${w.slug}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`).join('\n');
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://www.howdoyouspell.app</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>\n${urls}\n</urlset>`;
require('fs').writeFileSync('./public/sitemap.xml', xml);
console.log('Done:', data.totalWords, 'words, with lastmod', today);

const fs = require('fs');
const content = fs.readFileSync('app/api/spell/route.ts', 'utf8');
const lines = content.split('\n');
const seen = new Set();
const result = lines.filter(line => {
  const match = line.match(/"([^"]+)":/);
  if (!match) return true;
  const key = match[1];
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
}).join('\n');
fs.writeFileSync('app/api/spell/route.ts', result);
console.log('Done removing duplicates!');

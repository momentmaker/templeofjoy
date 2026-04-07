import { readFileSync, writeFileSync, mkdirSync, readdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import { execFileSync } from 'child_process';

const devoteesDir = 'src/content/devotees';
const outputDir = 'dist/og';

mkdirSync(outputDir, { recursive: true });

const PALETTE = [
  { bg: '#073763', text: '#FFFBEE' },
  { bg: '#C4762B', text: '#FFFBEE' },
  { bg: '#7D8B6E', text: '#FFFBEE' },
  { bg: '#8B6E7D', text: '#FFFBEE' },
  { bg: '#6E7D8B', text: '#FFFBEE' },
  { bg: '#A67B5B', text: '#FFFBEE' },
  { bg: '#5B7BA6', text: '#FFFBEE' },
  { bg: '#7B5BA6', text: '#FFFBEE' },
  { bg: '#5BA67B', text: '#FFFBEE' },
  { bg: '#8B7D6E', text: '#FFFBEE' },
];

function hashName(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function getInitials(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function getColor(name) {
  return PALETTE[hashName(name) % PALETTE.length];
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const data = {};
  for (const line of match[1].split('\n')) {
    const m = line.match(/^(\w+):\s*"?(.+?)"?\s*$/);
    if (m) data[m[1]] = m[2];
  }
  return data;
}

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatTag(tag) {
  return tag.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

const files = readdirSync(devoteesDir).filter(f => f.endsWith('.md'));

for (const file of files) {
  const content = readFileSync(join(devoteesDir, file), 'utf-8');
  const data = parseFrontmatter(content);
  const slug = file.replace('.md', '');
  const name = data.displayName || slug;
  const location = [data.city, data.stateRegion, data.country].filter(Boolean).join(', ');
  const color = getColor(name);
  const initials = getInitials(name);
  const description = data.description || '';
  const truncDesc = description.length > 100 ? description.slice(0, 97) + '...' : description;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" fill="none">
  <rect width="1200" height="630" fill="#FFFBEE"/>
  <rect x="0" y="0" width="1200" height="6" fill="#C4762B"/>
  <rect x="0" y="624" width="1200" height="6" fill="#073763"/>

  <circle cx="200" cy="280" r="100" fill="${color.bg}"/>
  <text x="200" y="300" text-anchor="middle" font-family="Georgia, serif" font-size="56" font-weight="bold" fill="${color.text}">${escapeXml(initials)}</text>

  <text x="380" y="240" font-family="Georgia, serif" font-size="48" font-weight="bold" fill="#073763">${escapeXml(name)}</text>
  <text x="380" y="285" font-family="Inter, system-ui, sans-serif" font-size="22" fill="#7D8B6E">${escapeXml(location)}</text>
  <text x="380" y="370" font-family="Inter, system-ui, sans-serif" font-size="20" fill="#073763" opacity="0.8">${escapeXml(truncDesc)}</text>

  <text x="380" y="540" font-family="Georgia, serif" font-size="24" fill="#073763">Temple of Joy</text>
  <text x="600" y="540" font-family="Georgia, serif" font-size="18" font-style="italic" fill="#C4762B">Joy expressed through service</text>
</svg>`;

  const svgPath = join(outputDir, `${slug}.svg`);
  const pngPath = join(outputDir, `${slug}.png`);
  writeFileSync(svgPath, svg);

  try {
    execFileSync('rsvg-convert', [svgPath, '-w', '1200', '-h', '630', '-o', pngPath]);
    unlinkSync(svgPath);
    console.log(`Generated ${pngPath}`);
  } catch {
    console.log(`SVG only: ${svgPath} (rsvg-convert not available)`);
  }
}

console.log(`Done. Generated OG images for ${files.length} devotees.`);

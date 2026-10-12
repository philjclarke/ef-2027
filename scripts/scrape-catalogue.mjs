// Rebuilds data/catalogue.json from the live Energising Futures site.
// Usage: npm i cheerio && node scripts/scrape-catalogue.mjs
// Node 18+ (uses global fetch). Polite: one request at a time.
import * as cheerio from 'cheerio';
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'https://energisingfutures.co.uk';
const cfg = JSON.parse(readFileSync(join(ROOT, 'data/search-config.json'), 'utf8'));
const BAND = cfg.ageBands;
const ORDER = ['4-7', '7-11', '11-14', '14-16'];

// Local thumbnails (assets/thumbnails or public/thumbnails), matched by slugified title.
const thumbDir = ['public/thumbnails', 'assets/thumbnails'].map((p) => join(ROOT, p)).find(existsSync);
const localThumbs = new Set(thumbDir ? readdirSync(thumbDir) : []);
const slugify = (s) => s.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

const items = new Map();

function parse(html, src) {
  const $ = cheerio.load(html);
  $('h3').each((_, h) => {
    let c = $(h);
    for (let k = 0; k < 6; k++) {
      c = c.parent();
      if (!c.length) return;
      if (c.find('img').length && c.find('a[href]').length) break;
    }
    const title = $(h).text().trim();
    const text = c.text().replace(/\s+/g, ' ').trim();
    const m = text.match(/^(RESOURCE|LESSON|COLLECTION|CONTENT SERIES)/i);
    if (!title || !m) return;
    const legacy = m[1].toLowerCase();
    const kind = legacy === 'resource' ? 'resource' : 'collection';
    const img = c.find('img').first();
    const image = (img.attr('data-src') || img.attr('src') || '').split('?')[0];
    const url = c.find('a[href]').map((_, a) => $(a).attr('href')).get()
      .map((u) => new URL(u, BASE).href).find((u) => !/levels\/|#/.test(u)) || '';
    const level = ((text.slice(m[0].length).match(/^\s*((?:Primary|Secondary)(?:,\s*(?:Primary|Secondary))?)/) || [])[1] || '')
      .split(',').map((s) => s.trim()).filter(Boolean);
    const agesOriginal = [...new Set(text.match(/\b(4-7|7-9|9-11|7-11|11-14|14-16)\b/g) || [])];
    const ages = [...new Set(agesOriginal.map((a) => BAND[a]))].sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));
    const count = (text.match(/(\d+) (resources|items)/) || [])[1];
    const format = kind === 'resource' ? ((text.match(/\b(PDF|PowerPoint|Interactive|Video|Excel|Word)\b/g) || []).pop() || null) : null;
    let description = c.find('p').map((_, p) => $(p).text().trim()).get().filter(Boolean).sort((a, b) => b.length - a.length)[0] || '';
    if (description.includes('{') || description.includes('uuid-')) description = ''; // inline SVG CSS leaking into text
    const id = url ? url.replace(/\/$/, '').split('/').pop() : slugify(title);
    if (items.has(id)) return;
    const localName = `${slugify(title)}.jpg`;
    items.set(id, {
      id, kind, legacyType: legacy, title, level, ages, agesOriginal, format,
      resourceCount: kind === 'collection' && count ? Number(count) : null,
      description, liveUrl: url,
      image: {
        remote: image,
        remoteLarge: image.replace(/-\d+x\d+(\.\w+)$/, '$1'),
        local: localThumbs.has(localName) ? `/thumbnails/${localName}` : null,
      },
      foundOn: src,
    });
  });
  return $('.pagination__btn--next, a.next, a[rel=next]').length > 0;
}

async function get(path) {
  const r = await fetch(BASE + path, { headers: { 'user-agent': 'Loop Design prototype scraper' } });
  if (!r.ok) return null;
  return r.text();
}

for (const p of ['/', '/collections/', '/?s=electricity', '/?s=magnet']) {
  const html = await get(p);
  if (html) parse(html, p);
}
for (const lv of ['primary-resources', 'secondary-resources']) {
  for (let i = 1; i < 60; i++) {
    const p = `/levels/${lv}/${i > 1 ? `page/${i}/` : ''}`;
    const html = await get(p);
    if (!html) break;
    process.stdout.write(`\r${p}  items: ${items.size}   `);
    if (!parse(html, p)) break;
  }
}

const out = { source: BASE, scrapedAt: new Date().toISOString(), count: items.size, items: [...items.values()] };
writeFileSync(join(ROOT, 'data/catalogue.json'), JSON.stringify(out, null, 1));
console.log(`\nWrote ${items.size} items to data/catalogue.json`);

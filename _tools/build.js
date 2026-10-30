// Builds the landing page for every language.
//   node _tools/build.js
//
// Sources (folders starting with "_" are not published by GitHub Pages):
//   _src/index.html        template; text only as {{key}}
//   _src/i18n/<code>.json  one strings file per language (values are HTML, no double quotes)
//   _src/languages.json    language list; the first entry is the default and lives at /
// Output: index.html (default language) and <code>/index.html for the others.
//
// The build stops if a language misses a key, has an extra one, the template uses an
// unknown {{key}}, or a key is never used, so no language can fall behind silently.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const src = path.join(root, '_src');
const template = fs.readFileSync(path.join(src, 'index.html'), 'utf8');
const languages = JSON.parse(fs.readFileSync(path.join(src, 'languages.json'), 'utf8'));
const strings = Object.fromEntries(languages.map((l) => [l.code, JSON.parse(fs.readFileSync(path.join(src, 'i18n', `${l.code}.json`), 'utf8'))]));

const BASE_URL = 'https://deun.app/';
const SWITCH_STYLE = 'width:38px;height:38px;border-radius:11px;border:1px solid var(--line-strong);display:flex;align-items:center;justify-content:center;text-decoration:none;color:var(--muted);font-size:13px;font-weight:700;letter-spacing:.02em;';
const [defaultLang] = languages;
const pagePath = (l) => (l === defaultLang ? '' : `${l.code}/`);

function builtins(lang) {
  const isDefault = lang === defaultLang;
  const rootRel = isDefault ? '' : '../';
  return {
    lang: lang.code,
    path: pagePath(lang),
    root: rootRel,
    ogLocale: lang.ogLocale,
    hreflangLinks: languages
      .map((l) => `<link rel="alternate" hreflang="${l.code}" href="${BASE_URL}${pagePath(l)}">`)
      .concat(`<link rel="alternate" hreflang="x-default" href="${BASE_URL}">`)
      .join('\n  '),
    langSwitch: languages
      .filter((l) => l !== lang)
      .map((l) => `<a href="${rootRel}${pagePath(l)}" data-lang-switch="${l.code}" hreflang="${l.code}" lang="${l.code}" title="${l.name}" class="icon-btn" style="${SWITCH_STYLE}">${l.code.toUpperCase()}</a>`)
      .join('\n        '),
    langPagesJson: JSON.stringify(Object.fromEntries(languages.filter((l) => l !== defaultLang).map((l) => [l.code, pagePath(l)]))),
    // Store links: German page -> German Play listing, campaigns tagged per language
    utmSuffix: isDefault ? '' : `-${lang.code}`,
    playHl: isDefault ? '' : `&amp;hl=${lang.code}`,
    playHlJs: isDefault ? '' : `&hl=${lang.code}`,
  };
}

// ── Checks ──
const errors = [];
const defaultKeys = Object.keys(strings[defaultLang.code]);
const used = new Set([...template.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]));
const builtinNames = new Set(Object.keys(builtins(defaultLang)));
for (const key of used) if (!builtinNames.has(key) && !defaultKeys.includes(key)) errors.push(`template uses unknown {{${key}}}`);
for (const key of defaultKeys) if (!used.has(key)) errors.push(`"${key}" is not used in the template`);
for (const { code } of languages) {
  const keys = Object.keys(strings[code]);
  for (const key of defaultKeys) if (!keys.includes(key)) errors.push(`${code}.json is missing "${key}"`);
  for (const key of keys) if (!defaultKeys.includes(key)) errors.push(`${code}.json has extra key "${key}"`);
  for (const [key, value] of Object.entries(strings[code])) {
    if (/["{}]/.test(value)) errors.push(`${code}.json "${key}" contains " or { } (use typographic quotes)`);
  }
}
if (errors.length) {
  console.error('Build stopped:\n  ' + errors.join('\n  '));
  process.exit(1);
}

// ── Render ──
for (const lang of languages) {
  const isDefault = lang === defaultLang;
  const values = { ...strings[lang.code], ...builtins(lang) };
  const html = template
    .replace(/\{\{#default\}\}\n([\s\S]*?)\{\{\/default\}\}\n/g, (m, block) => (isDefault ? block : ''))
    .replace(/\{\{(\w+)\}\}/g, (m, key) => values[key]);
  const out = path.join(root, pagePath(lang), 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  console.log(`${path.relative(root, out)} (${lang.code})`);
}

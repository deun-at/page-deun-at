// Builds de/index.html from index.html.
//   node _tools/build-de.js
// Run it after every change to index.html. It fails if the English page has text
// with no German entry below (add one), or if an entry no longer matches (remove it).
// Folders starting with "_" are not published by GitHub Pages (Jekyll).
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
let s = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

// Visible text nodes (matched trimmed, whole node).
const TEXT = {
  'Features': 'Funktionen',
  'How it works': "So funktioniert's",
  'Get the app': 'App holen',
  'Free on iOS · Android': 'Gratis für iOS · Android',
  '100% free — iOS &amp; Android': '100 % gratis – iOS &amp; Android',
  'Simply split': 'Einfach',
  'fairly.': 'fair teilen.',
  'With friends, flatmates and trips. Add an expense or scan a receipt — deun works out who owes whom, down to the cent. No paywalls, no premium tiers.':
    'Mit Freunden, in der WG oder auf Reisen. Ausgabe eintragen oder Kassenbon scannen – deun rechnet aus, wer wem was schuldet, auf den Cent genau. Keine Paywall, kein Premium-Abo.',
  'Download on the': 'Laden im',
  'Get it on': 'Jetzt bei',
  'No paywalls': 'Keine Paywall',
  'Your data stays yours': 'Deine Daten bleiben deine',
  // Phone mockup: wording matches the app's app_de.arb
  'Good evening': 'Guten Abend',
  "Overall, you're owed": 'Insgesamt bekommst du',
  "You're owed": 'Dir wird geschuldet',
  'You owe': 'Du schuldest',
  'Your groups': 'Deine Gruppen',
  'New': 'Neu',
  'Weekend in Lisbon': 'Lissabon-Trip',
  "you're owed": 'du bekommst',
  'Flat 3B': 'WG 3B',
  'you owe': 'du schuldest',
  'Groups': 'Gruppen',
  'Friends': 'Freunde',
  'Settings': 'Einstellungen',
  '€182.30': '182,30 €',
  '€224.30': '224,30 €',
  '€42.00': '42,00 €',
  '€64.00': '64,00 €',
  '€18.50': '18,50 €',
  // Features
  'All the features.': 'Alle Funktionen.',
  'None of the paywalls.': 'Keine Paywall.',
  'Receipt scanning, group expenses, fair splitting — everything you need, completely free.':
    'Kassenbon scannen, Gruppenausgaben, fair aufteilen – alles, was du brauchst, komplett gratis.',
  'Fair splitting': 'Fair aufteilen',
  'Split equally, by shares, by percentage or exact amounts. deun works out who owes what — down to the cent.':
    'Gleichmäßig, nach Anteilen, nach Prozent oder mit exakten Beträgen. deun rechnet aus, wer wem was schuldet – auf den Cent genau.',
  'Group friendly': 'Für Gruppen gemacht',
  'Create groups for trips, flat shares or any occasion. Invite friends with a link and track expenses together.':
    'Gruppen für Reisen, die WG oder jeden Anlass. Freunde per Link einladen und Ausgaben gemeinsam im Blick behalten.',
  'Receipt scanning': 'Kassenbon scannen',
  "Snap a photo of any receipt and deun pulls out the items — tap to claim what's yours. No manual entry needed.":
    'Foto vom Kassenbon machen, und deun liest die Positionen aus – alle tippen an, was sie hatten. Kein Abtippen nötig.',
  'Completely free': 'Komplett gratis',
  'Every feature, no paywalls. No premium tier, no feature gates — just small native ads. Your data stays yours.':
    'Alle Funktionen, keine Paywall. Kein Premium-Abo, nichts gesperrt – nur kleine, unaufdringliche Werbung. Deine Daten bleiben deine.',
  // Comparison
  'Why deun?': 'Warum deun?',
  'See the difference.': 'Der Unterschied.',
  "Other apps lock features behind paywalls. deun doesn't.": 'Andere Apps sperren Funktionen hinter einer Paywall. deun nicht.',
  'Feature': 'Funktion',
  'Others': 'Andere',
  'Free': 'Gratis',
  'Paid': 'Bezahlt',
  'Unlimited groups': 'Unbegrenzt viele Gruppen',
  'Multiple split types': 'Verschiedene Aufteilungsarten',
  'No blocking ads': 'Keine störende Werbung',
  'Yes': 'Ja',
  'No': 'Nein',
  'Settle-up tracking': 'Abrechnen und Rückzahlungen',
  // How it works
  "Three steps. That's it.": 'Drei Schritte. Fertig.',
  'No tutorials needed. Get started in under a minute.': 'Ohne Anleitung. In unter einer Minute startklar.',
  'Create a group': 'Gruppe anlegen',
  'Name your group and invite friends with a share link. Everyone joins in seconds.':
    'Gib der Gruppe einen Namen und lade Freunde per Link ein. Alle sind in Sekunden dabei.',
  'Add expenses': 'Ausgaben eintragen',
  'Log who paid and how to split it — equal, shares, percentage or exact. Or just scan the receipt.':
    'Eintragen, wer bezahlt hat und wie geteilt wird – gleichmäßig, nach Anteilen, Prozent oder exakt. Oder einfach den Kassenbon scannen.',
  'Settle up': 'Abrechnen',
  'See who owes whom at a glance. Mark debts settled when paid. Done.':
    'Auf einen Blick sehen, wer wem was schuldet. Bezahlte Schulden als erledigt markieren. Fertig.',
  // Download + footer
  'Get deun on your device.': 'Hol dir deun aufs Handy.',
  'Scan a QR code or tap to download — free on iOS and Android.': 'QR-Code scannen oder antippen – gratis für iOS und Android.',
  'Download for iOS': 'Für iOS laden',
  'Download for Android': 'Für Android laden',
  'Privacy policy': 'Datenschutz',
  '© 2026 deun · Simply split fairly.': '© 2026 deun · Einfach fair teilen.',
};

// Text nodes that stay as they are in German.
const KEEP = new Set(['Download', 'App Store', 'Google Play', 'deun', '9:41', 'Maya', 'M', 'S', 'J', 'A', 'R', '1', '2', '3', 'EN']);

// Exact source snippets (head, attributes, scripts); each must match exactly `n` times.
const EXACT = [
  ['<html lang="en">', '<html lang="de">', 1],
  ['<title>deun — Simply Split Fairly | Expense Splitting App</title>', '<title>deun – Kosten fair teilen | App zum Ausgaben teilen</title>', 1],
  [/<meta name="description" content="[^"]*">/, '<meta name="description" content="Mit deun teilst du Ausgaben mit Freunden, in der WG oder auf Reisen – fair und ohne Aufwand. Gruppe anlegen, Ausgabe eintragen oder Kassenbon scannen, abrechnen. Gratis für iOS und Android, ohne Paywall.">', 1],
  [/<meta name="keywords" content="[^"]*">/, '<meta name="keywords" content="Kosten teilen, Ausgaben teilen, Rechnung teilen, WG Kasse, Reisekosten teilen, Gruppenausgaben, Splitwise Alternative, Tricount Alternative, deun">', 1],
  ['<link rel="canonical" href="https://deun.app/">', '<link rel="canonical" href="https://deun.app/de/">', 1],
  ['<meta property="og:title" content="deun — Simply Split Fairly">', '<meta property="og:title" content="deun – Einfach fair teilen">', 1],
  [/<meta property="og:description" content="[^"]*">/, '<meta property="og:description" content="Ausgaben mit Freunden teilen – in der WG, auf Reisen, beim Abendessen. Gruppe anlegen, Kassenbon scannen, abrechnen. Gratis für iOS und Android.">', 1],
  ['<meta property="og:url" content="https://deun.app/">', '<meta property="og:url" content="https://deun.app/de/">', 1],
  ['<meta property="og:locale" content="en_US">', '<meta property="og:locale" content="de_DE">', 1],
  ['<meta name="twitter:title" content="deun — Simply Split Fairly">', '<meta name="twitter:title" content="deun – Einfach fair teilen">', 1],
  [/<meta name="twitter:description" content="[^"]*">/, '<meta name="twitter:description" content="Ausgaben mit Freunden teilen – fair, einfach, privat. Gratis für iOS und Android.">', 1],
  ['"description": "Split expenses with friends effortlessly. Create groups, track costs, and settle up — fairly.",', '"description": "Ausgaben mit Freunden teilen: Gruppen anlegen, Kosten erfassen und fair abrechnen.",\n    "inLanguage": "de",', 1],
  ['"url": "https://deun.app/",', '"url": "https://deun.app/de/",', 1],
  // Only the English page redirects (by browser language) and handles legacy #hash deep links
  [/\s*<!-- German browsers[\s\S]*?<\/script>\n/, '\n', 1],
  [/\s*<!-- Deep link redirect[\s\S]*?<\/script>\n/, '\n', 1],
  // Paths one level up
  [/(["(])assets\//g, '$1../assets/', 11],
  ['href="privacy_policy.html"', 'href="../privacy_policy.html"', 1],
  // Language switch points back to English
  ['<a href="de/" data-lang-switch="de" hreflang="de" lang="de" title="Deutsch"', '<a href="../" data-lang-switch="en" hreflang="en" lang="en" title="English"', 2],
  ['letter-spacing:.02em;">DE</a>', 'letter-spacing:.02em;">EN</a>', 2],
  ['title="Toggle theme"', 'title="Design wechseln"', 1],
  // Store links: German Play listing, campaigns tagged -de
  ['utm_campaign%3Dhero"', 'utm_campaign%3Dhero-de&amp;hl=de"', 1],
  ['utm_campaign%3Ddownload"', 'utm_campaign%3Ddownload-de&amp;hl=de"', 1],
  ["referrer=utm_source%3Dqr'", "referrer=utm_source%3Dqr-de&hl=de'", 1],
  // Count-up in German number format
  ["el.textContent = '€' + (target * ease(p)).toFixed(2);", "el.textContent = (target * ease(p)).toFixed(2).replace('.', ',') + ' €';", 1],
];

for (const [from, to, n] of EXACT) {
  const re = typeof from === 'string' ? new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g') : new RegExp(from.source, 'g');
  const found = (s.match(re) || []).length;
  if (found !== n) throw new Error(`Expected ${n}x, found ${found}x: ${from}`);
  s = s.replace(re, to);
}

// Translate text nodes in <body>, leaving <script>/<style> alone.
const bodyStart = s.indexOf('<body>');
const scriptStart = s.indexOf('<script>', bodyStart);
const used = new Set();
const missing = new Set();
const body = s.slice(bodyStart, scriptStart).replace(/>(\s*)([^<>]*?)(\s*)</g, (m, pre, text, post) => {
  if (!text || /^[a-z_]+$/.test(text)) return m; // empty or icon ligature
  if (Object.prototype.hasOwnProperty.call(TEXT, text)) { used.add(text); return `>${pre}${TEXT[text]}${post}<`; }
  if (!KEEP.has(text)) missing.add(text);
  return m;
});
s = s.slice(0, bodyStart) + body + s.slice(scriptStart);

const unused = Object.keys(TEXT).filter((k) => !used.has(k));
if (missing.size || unused.length) {
  if (missing.size) console.error('No German text for:\n  ' + [...missing].join('\n  '));
  if (unused.length) console.error('Entries no longer on the English page:\n  ' + unused.join('\n  '));
  process.exit(1);
}

fs.mkdirSync(path.join(root, 'de'), { recursive: true });
fs.writeFileSync(path.join(root, 'de', 'index.html'), s);
console.log('de/index.html written');

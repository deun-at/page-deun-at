# deun.app

Landing page for **deun** — an expense-splitting app. Served via GitHub Pages at [deun.app](https://deun.app).

## What's here

- `_src/` — Landing page source: `index.html` template, `i18n/<lang>.json` strings, `languages.json`
- `_tools/build.js` — Generates the pages from `_src/`
- `index.html`, `de/index.html` — **Generated**, don't edit by hand
- `privacy_policy.html` — Privacy policy
- `assets/` — Self-hosted fonts, logo, QR library
- `.well-known/assetlinks.json` — Android App Links verification
- `CNAME` — Custom domain config
- `_config.yaml` — Jekyll config to serve `.well-known`

## Editing the landing page

```bash
node _tools/build.js
```

Run it after every change in `_src/`, then commit the generated pages too (GitHub Pages serves them as they are; folders starting with `_` are not published).

- **Text:** change the value in `_src/i18n/en.json` *and* every other language file. Values are HTML; use typographic quotes (“ ” „ “), never `"`.
- **New text:** put `{{newKey}}` in `_src/index.html` and add `newKey` to every language file.
- **Layout:** edit `_src/index.html`; all languages pick it up.
- **New language:** copy `_src/i18n/en.json` to `<code>.json`, translate it, and add `{ "code", "name", "ogLocale" }` to `_src/languages.json`. The page, `hreflang` tags, language switch, browser-language redirect and `-<code>` store-link campaigns come with it.

The build stops if a language misses a key or has an extra one, or if the template uses an unknown key, so no language falls behind silently.

Browsers whose language has a page are sent from `/` to it (unless the visitor picked a language with the switch, kept in `localStorage`).

## Deep link redirect

Old links like `https://deun.app/#/friend/accept?...` are automatically redirected to `https://app.deun.app/#/friend/accept?...`.

## Links

- Web App: [app.deun.app](https://app.deun.app)
- App Store: [Download for iOS](https://apps.apple.com/app/deun/id6742751703)
- Google Play: [Download for Android](https://play.google.com/store/apps/details?id=app.deun.www)

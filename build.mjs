/**
 * Statischer Generator für die Website von I&M CARGO.
 * Keine Abhängigkeiten, Node >= 20. Ausgabe nach dist/.
 *
 *   npm run build
 */
import { mkdir, rm, cp, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { company as c, routes } from './src/content/company.js';
import { de } from './src/content/de.js';
import { en } from './src/content/en.js';
import { legalDe } from './src/content/legal.de.js';
import { legalEn } from './src/content/legal.en.js';
import { document_ } from './src/layout.js';
import { home } from './src/pages/home.js';
import { legalPage } from './src/pages/legal.js';
import { notFound } from './src/pages/not-found.js';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, 'dist');
const YEAR = new Date().getFullYear();

const LANGS = { de, en };
const LEGAL = { de: legalDe, en: legalEn };

/** Alle Seiten der Website. */
const pages = [];
for (const lang of ['de', 'en']) {
  const t = LANGS[lang];
  const legal = LEGAL[lang];

  pages.push({
    route: routes.home[lang],
    html: document_({
      t,
      routeKey: 'home',
      title: t.home.title,
      description: t.home.description,
      bodyClass: 'page-home',
      main: home(t),
      year: YEAR,
      withOrganization: true,
    }),
  });

  pages.push({
    route: routes.imprint[lang],
    html: document_({
      t,
      routeKey: 'imprint',
      title: legal.imprint.title,
      description: legal.imprint.description,
      bodyClass: 'page-legal',
      main: legalPage(t, legal.imprint),
      year: YEAR,
    }),
  });

  pages.push({
    route: routes.privacy[lang],
    html: document_({
      t,
      routeKey: 'privacy',
      title: legal.privacy.title,
      description: legal.privacy.description,
      bodyClass: 'page-legal',
      main: legalPage(t, legal.privacy),
      year: YEAR,
    }),
  });
}

/* Fehlerseite: eine Datei, vom Server als 404 auszuliefern. Deutsch als Hauptsprache. */
const notFoundPage = () =>
  document_({
    t: de,
    routeKey: 'home',
    title: de.notFound.title,
    description: de.notFound.description,
    bodyClass: 'page-notfound',
    main: notFound(de),
    year: YEAR,
    indexable: false,
    onHome: false,
  });

const sitemap = () => {
  const entries = Object.keys(routes).flatMap((key) =>
    ['de', 'en'].map((lang) => ({ loc: `${c.siteUrl}${routes[key][lang]}`, key, lang }))
  );
  const links = (key) =>
    ['de', 'en']
      .map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${c.siteUrl}${routes[key][l]}"/>`)
      .join('\n') + `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${c.siteUrl}${routes[key].de}"/>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries
  .map(
    (e) => `  <url>
    <loc>${e.loc}</loc>
${links(e.key)}
    <changefreq>${e.key === 'home' ? 'monthly' : 'yearly'}</changefreq>
    <priority>${e.key === 'home' ? '1.0' : '0.3'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;
};

const robots = () => `User-agent: *
Allow: /

Sitemap: ${c.siteUrl}/sitemap.xml
`;

const manifest = () =>
  JSON.stringify(
    {
      name: `${c.brand} – ${c.legalName}`,
      short_name: c.brand,
      lang: 'de',
      start_url: '/',
      display: 'browser',
      background_color: '#F2F1ED',
      theme_color: '#071A2F',
      icons: [
        { src: '/assets/brand/im-cargo-mark-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/assets/brand/im-cargo-mark-512.png', sizes: '512x512', type: 'image/png' },
      ],
    },
    null,
    2
  );

async function build() {
  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });

  for (const page of pages) {
    const dir = path.join(DIST, page.route);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, 'index.html'), page.html, 'utf8');
  }

  // Assets übernehmen; interne Notizen bleiben im Quellordner.
  const withoutNotes = { recursive: true, filter: (src) => !src.endsWith('README.md') };
  await cp(path.join(ROOT, 'src/assets/brand'), path.join(DIST, 'assets/brand'), withoutNotes);
  await cp(path.join(ROOT, 'src/assets/img'), path.join(DIST, 'assets/img'), withoutNotes);
  await cp(path.join(ROOT, 'src/assets/fonts'), path.join(DIST, 'assets/fonts'), withoutNotes);
  await cp(path.join(ROOT, 'src/styles/site.css'), path.join(DIST, 'assets/site.css'));
  await cp(path.join(ROOT, 'src/js/site.js'), path.join(DIST, 'assets/site.js'));
  await cp(path.join(ROOT, 'src/assets/brand/favicon.ico'), path.join(DIST, 'favicon.ico'));

  await writeFile(path.join(DIST, '404.html'), notFoundPage(), 'utf8');
  await writeFile(path.join(DIST, 'sitemap.xml'), sitemap(), 'utf8');
  await writeFile(path.join(DIST, 'robots.txt'), robots(), 'utf8');
  await writeFile(path.join(DIST, 'site.webmanifest'), manifest(), 'utf8');

  const css = await readFile(path.join(ROOT, 'src/styles/site.css'), 'utf8');
  const js = await readFile(path.join(ROOT, 'src/js/site.js'), 'utf8');
  console.log(`${pages.length} Seiten gebaut nach dist/`);
  for (const p of pages) console.log(`  ${p.route}`);
  console.log(`  CSS ${(css.length / 1024).toFixed(1)} kB · JS ${(js.length / 1024).toFixed(1)} kB`);
}

build().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

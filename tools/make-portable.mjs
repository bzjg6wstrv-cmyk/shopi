/**
 * Erzeugt aus dist/ eine portable Fassung in vorschau/.
 *
 * Zweck: die Website ohne Webserver ansehen und weitergeben (Doppelklick auf
 * index.html). Dafür werden die Seiten zu flachen Dateien und alle Pfade
 * relativ gemacht. Für den Livebetrieb wird weiterhin dist/ ausgeliefert.
 *
 *   node tools/make-portable.mjs
 */
import { readFile, writeFile, mkdir, rm, cp, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const OUT = path.join(ROOT, 'vorschau');

/** Quelle in dist  →  Datei in der portablen Fassung */
const PAGES = [
  ['index.html', 'index.html'],
  ['impressum/index.html', 'impressum.html'],
  ['datenschutz/index.html', 'datenschutz.html'],
  ['en/index.html', 'en.html'],
  ['en/imprint/index.html', 'en-imprint.html'],
  ['en/privacy/index.html', 'en-privacy.html'],
  ['404.html', '404.html'],
];

/** Absolute Verweise → relative Dateinamen. Längere Pfade zuerst ersetzen. */
const LINKS = [
  ['"/en/imprint/#', '"en-imprint.html#'],
  ['"/en/privacy/#', '"en-privacy.html#'],
  ['"/en/#', '"en.html#'],
  ['"/impressum/#', '"impressum.html#'],
  ['"/datenschutz/#', '"datenschutz.html#'],
  ['"/#', '"index.html#'],
  ['"/en/imprint/"', '"en-imprint.html"'],
  ['"/en/privacy/"', '"en-privacy.html"'],
  ['"/en/"', '"en.html"'],
  ['"/impressum/"', '"impressum.html"'],
  ['"/datenschutz/"', '"datenschutz.html"'],
  ['"/assets/', '"assets/'],
  ['"/favicon.ico"', '"favicon.ico"'],
  ['"/site.webmanifest"', '"site.webmanifest"'],
  ['"/"', '"index.html"'],
];

const NOTE = `<!--
  PORTABLE VORSCHAU — nicht die Fassung für den Livebetrieb.
  Alle Pfade sind relativ, damit die Seiten lokal per Doppelklick funktionieren.
  Für den Server wird der Ordner dist/ ausgeliefert (saubere URLs, /impressum/ statt impressum.html).
-->
`;

async function main() {
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  for (const [from, to] of PAGES) {
    let html = await readFile(path.join(DIST, from), 'utf8');
    for (const [a, b] of LINKS) html = html.split(a).join(b);
    // Schrift-Preloads brauchen crossorigin; über file:// scheitert die
    // CORS-Anfrage. Die Schriften kommen ohnehin über @font-face.
    html = html.replace(/<link rel="preload"[^>]*as="font"[^>]*>\n?/g, '');
    await writeFile(path.join(OUT, to), NOTE + html, 'utf8');
  }

  await cp(path.join(DIST, 'assets'), path.join(OUT, 'assets'), { recursive: true });
  await cp(path.join(DIST, 'favicon.ico'), path.join(OUT, 'favicon.ico'));

  // Die Schriften liegen relativ zur CSS-Datei in assets/fonts/.
  const cssPath = path.join(OUT, 'assets', 'site.css');
  const css = (await readFile(cssPath, 'utf8')).split("'/assets/fonts/").join("'fonts/");
  await writeFile(cssPath, css, 'utf8');

  await writeFile(
    path.join(OUT, 'LIESMICH.txt'),
    [
      'I&M CARGO — portable Vorschau',
      '',
      'index.html im Browser öffnen (Doppelklick genügt, kein Server nötig).',
      '',
      'Seiten:',
      '  index.html        Startseite (Deutsch)',
      '  impressum.html    Impressum',
      '  datenschutz.html  Datenschutz',
      '  en.html           Startseite (Englisch)',
      '  en-imprint.html   Imprint',
      '  en-privacy.html   Privacy',
      '  404.html          Fehlerseite',
      '',
      'Hinweis: Diese Fassung ist nur zum Ansehen und Weitergeben gedacht.',
      'Für den Livebetrieb wird der Ordner dist/ aus dem Projekt ausgeliefert;',
      'dort haben die Seiten saubere Adressen wie /impressum/ statt impressum.html.',
      '',
      'Der Formularversand ist noch nicht angebunden, die vier Bilder sind',
      'gekennzeichnete Platzhalter. Einzelheiten in der README.md des Projekts.',
      '',
    ].join('\n'),
    'utf8'
  );

  const files = await readdir(OUT);
  console.log('vorschau/ erzeugt:', files.join(', '));
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

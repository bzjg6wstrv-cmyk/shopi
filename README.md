# I&M CARGO — Website

Unternehmenswebsite der **I & M Dienstleistungen GmbH** (Außenauftritt **I&M CARGO**),
Bremen. Zweisprachig Deutsch / Englisch, statisch erzeugt, ohne Laufzeit-Abhängigkeiten.

```
npm run build     # erzeugt dist/
npm run serve     # lokale Vorschau auf http://localhost:4173
npm run dev       # bauen und Vorschau starten
```

Es werden **keine npm-Pakete installiert.** Der Generator besteht aus einer Datei
(`build.mjs`) und benötigt nur Node ≥ 20.

---

## 1. Was hier steht — und was nicht

Alle Unternehmensangaben stammen ausschließlich aus dem Briefing und liegen an einer
einzigen Stelle: `src/content/company.js`.

Es gibt auf der Website **keine** Mitarbeiter- oder Fahrzeugzahlen, Kundenlogos,
Referenzen, Zertifikate, Gründungsjahre, Sendungszahlen, Lieferzeiten, Tracking-Ansichten
oder Kennzahlen. Was nicht bekannt ist, steht nicht da. Wo etwas fehlt, ist es sichtbar
als offener Punkt gekennzeichnet (Impressum, Datenschutz, Bilder, Formularversand).

## 2. Vor dem Livegang

| # | Offener Punkt | Wo |
|---|---|---|
| 1 | **Formularversand anbinden** — `formEndpoint` setzen und Handler bereitstellen | `src/content/company.js`, `server/transport-request.example.mjs` |
| 2 | **Fotos ersetzen** — vier gekennzeichnete Platzhalter, danach Alt-Texte anpassen | `src/assets/img/README.md` |
| 3 | **Impressum vervollständigen** — u. a. Verantwortlicher nach § 18 MStV, Erlaubnis/Aufsichtsbehörde, Versicherung | `src/content/legal.de.js`, `legal.en.js` |
| 4 | **Datenschutz vervollständigen** — Hosting, Versandweg, Speicherdauern, Empfänger | dieselben Dateien |
| 5 | **Rechtstexte anwaltlich prüfen lassen** — die Entwürfe sind ungeprüft | — |
| 6 | **Logo als Vektordatei** einsetzen, sobald verfügbar | `src/assets/brand/README.md` |
| 7 | **Domain prüfen** — `siteUrl` steht auf `https://www.im-cargo.de` | `src/content/company.js` |

Die Punkte 3 und 4 sind auf den Rechtsseiten auch für Besucher:innen sichtbar
gekennzeichnet, damit nichts unbemerkt online geht.

## 3. Aufbau

```
build.mjs                    Generator: Seiten, Sitemap, robots.txt, Manifest, Assets
src/
  content/
    company.js               Unternehmensdaten, Routen, Formular-Endpunkt
    de.js  /  en.js          Alle Texte der Startseite
    legal.de.js / legal.en.js  Impressum und Datenschutz
  layout.js                  HTML-Gerüst: Head, Meta, hreflang, JSON-LD
  pages/                     home.js, legal.js
  partials/                  chrome.js (Kopf, Fuß, Kontaktebene), form.js, icons.js
  styles/site.css            Design-System (handgeschrieben, kein Framework)
  js/site.js                 Kontaktpanel, Menü, Formular, Reveal
  assets/                    brand/, img/, fonts/
server/                      Beispiel-Handler für den Formularversand (nicht aktiv)
tools/                       Vorschau-Server, Platzhalter-Generator
dist/                        Erzeugte Website (wird beim Build neu geschrieben)
```

`dist/` ist im Repository enthalten, damit die Website ohne Build-Schritt ausgeliefert
werden kann. Nach jeder Änderung an `src/` muss `npm run build` laufen.

## 4. Seiten und Sprachen

| Seite | Deutsch | Englisch |
|---|---|---|
| Startseite | `/` | `/en/` |
| Impressum | `/impressum/` | `/en/imprint/` |
| Datenschutz | `/datenschutz/` | `/en/privacy/` |

Deutsch ist die Hauptsprache und `x-default`. `hreflang`, Canonicals, Open Graph und
Sitemap werden aus der Routentabelle in `src/content/company.js` erzeugt — neue Seiten
dort eintragen, dann stimmen alle Verweise automatisch.

## 5. Gestaltung

Das Design ist aus dem Logo abgeleitet: Navy `#071A2F`, Gelb `#F2C400`, Weiß, dazu ein
warmes Off-White `#F2F1ED` als Grundfläche. Gelb bleibt Akzent — für die primäre Aktion,
die Bewegungslinie und wenige Markierungen; niemals als kleiner Text auf Weiß.

- **Typografie:** Archivo (Überschriften, Beschriftungen) und IBM Plex Sans (Fließtext),
  beide selbst gehostet als variable WOFF2, latin, `font-display: swap`.
- **Raster:** 1360 px Bühne, fluide Ränder, bewusst asymmetrischer Hero.
- **Kanten:** durchgehend rechtwinklig, 1-px-Haarlinien, keine abgerundeten Karten.
- **Leistungen** als nummeriertes Register statt sechs gleicher Kacheln.
- **Bewegung:** eine einzige verlängerte Fassung der Logo-Linie im Abschnitt
  „Deutschland & Europa“, sonst nur Hover- und Einblend-Übergänge.

Alle Farbpaare für Text erfüllen mindestens WCAG AA; Rahmen von Bedienelementen liegen
über 3:1 (`--field-line`).

## 6. Kontaktebene

Eine Dialogkomponente, zwei Erscheinungsformen:

- **ab 1100 px** eine schmale fixierte Leiste am rechten Rand → Panel fährt von rechts ein
- **darunter** ein kompakter Kontaktbutton unten rechts → Bottom Sheet mit Safe-Area-Abstand

Schließen über ×, Klick daneben und ESC; Fokus wandert in den Dialog und danach zurück
auf den auslösenden Button; Fokus bleibt im Dialog gefangen; `prefers-reduced-motion`
wird beachtet. Telefon und E-Mail stehen zusätzlich in Kopfzeile, Kontaktbereich und
Fußzeile — ohne JavaScript geht nichts verloren.

## 7. Formular

Client-Validierung mit klaren Fehlermeldungen, Spamschutz ohne externen Dienst
(verstecktes Feld + Zeitprüfung), Einwilligungs-Checkbox mit Verweis auf den
Datenschutz, optionaler Upload (PDF/JPG/PNG, max. 10 MB je Datei, max. 5 Dateien).

**Der Versand ist bewusst nicht angebunden.** Solange `formEndpoint` in
`src/content/company.js` auf `null` steht, wird nichts abgeschickt und nichts
vorgetäuscht: Das Formular weist auf Telefon und E-Mail hin. Die serverseitige Prüfung
gehört in `server/transport-request.example.mjs` — die Prüfung im Browser ist nur
Komfort.

## 8. Technisches

- Keine Cookies, kein Tracking, keine externen Ressourcen — daher kein Cookie-Banner
  nötig (bei späteren Einbindungen Datenschutzhinweise anpassen).
- Zwei Schriftdateien (~80 kB), CSS ~38 kB, JS ~13 kB, alles vom eigenen Server.
- Bilder als WebP mit JPEG-Rückfallebene, feste Maße gegen Layoutsprünge,
  `loading="lazy"` außer beim Hero.
- Semantisches HTML, sichtbare Fokusrahmen, Sprungmarke zum Inhalt, `prefers-reduced-motion`.
- JSON-LD (Organization/LocalBusiness) nur mit tatsächlich bekannten Angaben.

### Empfohlene Server-Einstellungen

- `dist/` als Document-Root ausliefern, saubere URLs mit Schrägstrich am Ende
- lange Cache-Zeiten für `/assets/**`, kurze für HTML
- HTTPS erzwingen, `www` und Nicht-`www` auf eine Variante weiterleiten
- `dist/404.html` als Fehlerseite konfigurieren (liegt bereit, `noindex`)

## 9. Lizenzen

Archivo und IBM Plex Sans stehen unter der SIL Open Font License; die Lizenztexte liegen
in `src/assets/fonts/`. Logo und Markenzeichen gehören der I & M Dienstleistungen GmbH.

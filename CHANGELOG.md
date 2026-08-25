# VENT CELESTE — Änderungsprotokoll

## V4 fixed — Mobile-Design aus V4 auf der V3.7-Basis

**Technische Basis: V3.7. Designreferenz: V4.** Bei Konflikten hatte V3.7 Vorrang.

Vorgehen: Beide Stände vollständig entpackt und verglichen, bevor etwas geändert
wurde. Der Vergleich ergab, dass sich V3.7 und V4 in 27 Dateien unterscheiden —
davon betreffen **24 ausschließlich das Farbschema-System** (V4 hatte es wieder
eingebaut) und nur **drei** tatsächliche Designarbeit. Übernommen wurden deshalb
nur die drei Designdateien, inhaltlich neu abgestimmt.

---

## Bestätigungen

### V3.7-Farbschema-Fix erhalten

Der Ansatz aus V3.7 ist unverändert übernommen: Die Paletten liegen als feste
CSS-Custom-Properties in `snippets/css-variables.liquid` unter den Klassen
`.color-scheme-1` bis `.color-scheme-4`, die Sections wählen sie über ein
normales `select`. Shopifys Farbschema-System wird nicht verwendet.

### Gesucht wurde nach

| Suchbegriff | Treffer im Theme |
|---|---|
| `"type": "color_scheme"` | **0** |
| `color_scheme_group` | **0** |
| `settings.color_schemes` | **0** |

Durchsucht wurden `assets`, `config`, `layout`, `locales`, `sections`,
`snippets` und `templates`.

Weiter geprüft: 21 Sections führen die Farbstil-Einstellung, ausnahmslos vom
Typ `select`. `settings_data.json` enthält keinen `color_schemes`-Schlüssel.

**Zusätzlicher Befund:** V3.7 enthielt noch drei tote Aufrufe von
`settings.color_schemes` in `layout/theme.liquid`, `layout/password.liquid` und
`templates/gift_card.liquid`. Sie lieferten `nil`, wodurch die Klasse `color-`
ohne Wert und ein leeres `theme-color`-Meta ausgegeben wurden. Beides wurde
durch den festen Standardstil `color-scheme-1` ersetzt — optisch identisch, da
`:root` ohnehin dieselben Werte trägt, aber jetzt frei von der verbotenen API.

### Mobile-Layoutfix erhalten

`.steps__text { grid-column: 2 }` in `assets/section-scent-code.css` ist
unverändert vorhanden, ebenso die Rücksetzung auf `auto` ab 990 px. Damit steht
die Beschreibung in „So funktioniert's" weiterhin unter dem Titel und nicht in
der schmalen Nummernspalte. Es wurde keine neue Grid-, Flex- oder
Breitenregel auf `.steps*` gesetzt — geprüft: null Treffer in `base.css`.

---

## Geänderte Dateien — fünf

| Datei | Änderung |
|---|---|
| `sections/hero-v2.liquid` | CTA erhält die Klasse `hero2__cta`; Zeile „Antwort meist innerhalb von 24 Stunden" entfernt |
| `assets/section-hero-v2.css` | vollständig neu geschrieben, mobile first; Werte ab 750 px unverändert |
| `assets/base.css` | drei gezielte Eingriffe an den betroffenen Regeln |
| `layout/theme.liquid` | toter `settings.color_schemes`-Aufruf entfernt |
| `layout/password.liquid`, `templates/gift_card.liquid` | dito |

Nicht angefasst: alle Sections außer dem Hero, sämtliche Snippets außer keinem,
`config/`, `locales/`, `templates/` (außer `gift_card.liquid`), alle Skripte.

---

## Im Einzelnen

### 3 · Hero-Informationshierarchie

Reihenfolge auf Mobile jetzt: Eyebrow → Schlagzeile → Unterzeile → Beratungs-CTA
→ Scent-Code-Eingabe → Bild. Die Zeile zur Antwortzeit entfällt und stand
vorher zwischen CTA und Code-Feld.

### 4 · FIND YOUR SCENT

| | Größe (390 px) | Zeilenhöhe | 3 Zeilen |
|---|---|---|---|
| V3.9 | 50,7 px | 0.92 | 140 px |
| V4 | 42,1 px | 0.86 | 109 px |
| **jetzt** | **39,0 px** | **0.84** | **98 px** |

`clamp(2.25rem, 10vw, 3rem)` — rund 10 % kompakter als V4. Versalien, Serife
und negatives Tracking bleiben, die Schlagzeile bleibt das Markenelement.
Ab 750 px gilt unverändert der bisherige Wert.

### 5 · WhatsApp-CTA

Zuerst die Klassen im Liquid geprüft: `snippets/whatsapp-link.liquid` gibt
`class="{{ class | default: 'button' }}"` aus, der Hero übergibt
`button button--whatsapp`. Diese Klassen existieren also tatsächlich im HTML.

Ergänzt wurde die eigene Klasse `hero2__cta` direkt im Render-Aufruf, damit der
CTA nicht mehr von der Variablenkette `--color-button` abhängt:

```css
.hero2__cta {
  background-color: rgb(var(--color-text));
  color: rgb(var(--color-background));
  min-height: 3.5rem;  width: 100%;
  border-radius: var(--button-radius);   /* Standard 0 – keine Pille */
}
```

`--color-text` und `--color-background` sind bereits auf `:root` definiert und
damit unabhängig davon gesetzt, welcher Farbstil an der Section hängt. Schwarze
Fläche, helle Schrift, volle Breite, 56 px Höhe, WhatsApp-Symbol, kein Grün.
Die Regel steht außerhalb von Media Queries, gilt also auch auf Desktop; dort
wird sie auf `width: auto` zurückgesetzt.

Link, Zielnummer und vorbereitete Nachricht sind unverändert.

### 6 · Antwortzeit

Der Absatz `hero2__response` wurde aus `sections/hero-v2.liquid` entfernt,
die zugehörige CSS-Regel ebenfalls. Das Theme Setting
`whatsapp_response_time` bleibt bestehen — es wird weiterhin im Mega-Menü und
im Beratungsabschnitt genutzt, dort war es nicht störend.

### 7 · Scent-Code-Eingabe

Aus der umrandeten Box wird eine Editorial-Zeile: kein Rahmen, keine Fläche,
stattdessen eine feine Linie unter der gesamten Zeile, die bei Fokus auf die
volle Textfarbe wechselt und bei gültigem Code auf den Akzent. `VC-` steht als
Prefix auf derselben Grundlinie wie die Eingabe, „Weiter →" ist eine Textmarke
statt eines gefüllten Blocks. Eingabe und Button behalten 48 px Höhe.

### 8 · Abstände

| Übergang | vorher | jetzt |
|---|---|---|
| Hero-Innenabstand oben | 32 px | 18 px |
| Eyebrow → Schlagzeile | 16 px | 8 px |
| Schlagzeile → Unterzeile | 16 px | 10 px |
| Unterzeile → CTA | 32 px | 20 px |
| CTA → Scent Code | 32 px + Antwortzeile | 18 px |
| Scent Code → Bild | 32 px | 28 px |

### 9 · Ankündigungsleiste

Innenabstand 0,6 → 0,35 rem, Schrift 11 → 10 px, Zeilenhöhe 1.3,
Laufweite 0.1em. Ab 750 px unverändert.

### 10 · Kopfbereich

Mindesthöhe unter 990 px von 64 auf 56 px. Logo, Wortmarke und Symbole
unverändert; die Symbolflächen bleiben bei 44 px.

### 13 · Keine gestapelten Patches

`assets/section-hero-v2.css` wurde als eine zusammenhängende Datei neu
geschrieben statt ergänzt. Die Eingriffe in `base.css` stehen jeweils direkt bei
der Regel, die sie verändern, nicht am Dateiende. Eine doppelte
Ankündigungsregel im 359-px-Block wurde entfernt.

---

## Rechnerisch geprüfte Sichtbarkeit

| Gerät | bis CTA | bis Scent-Code-Feld |
|---|---|---|
| 320 × 568 | 361 px — sichtbar | 441 px — kurzes Scrollen |
| 375 × 667 | 355 px — sichtbar | 438 px — sichtbar |
| 390 × 844 | 359 px — sichtbar | 441 px — sichtbar |
| 430 × 932 | 356 px — sichtbar | 438 px — sichtbar |

Geschätzt aus den gesetzten Werten, nicht im Browser gemessen.

## Abschlusskontrolle

- Theme Check: **0 Fehler, 0 Warnungen** (verbleibend 31 Hinweise der Stufen
  *style* und *suggestion*, davon 21 Formatierungshinweise zu Section-Schemas
  aus V3.7, die bewusst nicht angefasst wurden)
- Alle JSON-Dateien gültig, 35 Section-Schemas fehlerfrei geparst
- Alle 11 Skripte syntaktisch geprüft
- Klammerbilanz aller CSS-Dateien ausgeglichen
- Menü, Suche, Warenkorb, WhatsApp-Link und Scent-Code-Formular im Markup
  nachgewiesen

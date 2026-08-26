# VENT CELESTE — Änderungsprotokoll

## V4.2.7 — Konsolidierter Mobile-Finish

- Mobile-Menü-Fix aus V4.2.6 beibehalten.
- Warenkorb mobil deutlich kompakter: kleinere Abstände, klare Trennlinien zwischen Artikeln, kompaktere Mengensteuerung und Footer.
- Produktseite mobil gestrafft: Kaufbereich und Duftprofil mit reduziertem vertikalem Leerraum.
- Farbige Duftcharakter-, Jahreszeit- und Anlass-Balken beibehalten.
- Ungültige literal `\n`-Sequenzen im Mobile-Polish-CSS bereinigt.
- Empfehlungstitel von „Ähnliche Duftprofile“ auf „Das könnte dir auch gefallen“ geändert.
- Keine Änderung an Preisen, Varianten, Warenkorb-Logik oder Checkout-Logik.


## V4.1 Step 3.1 — Mobile-Feinschliff am Launch-Angebot

Kein Redesign. Vier Dateien, 18 geänderte Zeilen.

### Geänderte Abstände

| Regel | vorher | jetzt | Wirkung |
| --- | --- | --- | --- |
| `--section-space` (nur ≤ 749 px) | `clamp(3.5rem, 7vw, 8rem)` → 56 px | `2.5rem` = 40 px | Abstand zwischen zwei Abschnitten **112 px → 80 px** |
| `--section-space-tight` (nur ≤ 749 px) | `clamp(2.5rem, 4vw, 4.5rem)` → 40 px | `1.75rem` = 28 px | betrifft „Das Prinzip“ und den Newsletter |
| `.offer__cta` | `margin-top: var(--space-lg)` = 24 px | `var(--space-md)` = 16 px | Abstand vor dem WhatsApp-Button |

Die beiden Abschnittswerte stehen in einer eigenen Medienabfrage
`@media (max-width: 749px)` in `assets/base.css`. Oberhalb von 749 px greift
sie nicht — Tablet und Desktop behalten jeden bisherigen Wert. Im gerenderten
Vergleich beträgt der Abstand zwischen zwei Abschnitten bei 768 px und
1280 px unverändert 179 px.

Damit sind auch die beiden ausdrücklich genannten Lücken kleiner: „So
funktioniert's“ → „Most Wanted“ und „Most Wanted“ → Launch-Offer jeweils
112 px → 80 px. Der Launch-Offer-Bereich verliert dadurch oben und unten je
16 px; innen bleiben Haarlinien, Innenabstände und Gestaltung unverändert.

**Seitenhöhe mobil:** 5517 px → 5326 px bei 390 px.

### Geänderte Texte

Beide ausschließlich in `templates/index.json`, also im Theme-Editor
weiterhin frei änderbar.

**Kennenlernvorteil**

| Feld | vorher | jetzt |
| --- | --- | --- |
| Eyebrow | Willkommen bei VENT CELESTE | *unverändert* |
| Überschrift | 20 % KENNENLERNVORTEIL | **20 % AUF DEINEN ERSTEN DUFTKAUF** |
| Text | Auf deine erste Bestellung. | *unverändert* |
| Hinweis | Gültig für bis zu 3 Düfte. | **Für deine erste Bestellung mit bis zu 3 Düften.** |

**Garantie**

| Feld | vorher | jetzt |
| --- | --- | --- |
| Eyebrow | Ohne Risiko | *unverändert* |
| Überschrift | 100 % ZUFRIEDENHEITSGARANTIE | **100 % ZUFRIEDEN / ODER GELD ZURÜCK** (fester Umbruch) |
| Text | Du sollst deinen Duft lieben. Wenn du mit einem Duft aus deiner ersten Bestellung nicht zufrieden bist, kümmern wir uns darum. | **Du sollst deinen Duft lieben. / Wenn er nicht zu dir passt, erstatten wir dir den Kaufpreis.** |
| Hinweis | Gültig für deine erste Bestellung und maximal 3 Flakons. | **Für deine erste Bestellung mit bis zu 3 Flakons.** |

Damit die Garantie-Überschrift den gewünschten Umbruch trägt, läuft sie in
`sections/launch-offer.liquid` jetzt zusätzlich durch `newline_to_br`. Ein
Zeilenumbruch im Editor wird dadurch übernommen; ohne Umbruch verhält sich
das Feld wie zuvor.

Beide Überschriften stehen bei 390 px und 430 px in zwei ausgeglichenen
Zeilen, ohne verkleinerte Schrift und ohne Überbreite:

```
20 % AUF DEINEN            100 % ZUFRIEDEN
ERSTEN DUFTKAUF            ODER GELD ZURÜCK
```

Keine Badge-Optik, kein Siegel, kein Symbol, kein Gold, kein Schatten, kein
Verlauf — Schriftgrad, Farben und Haarlinien sind unverändert.

### Geänderte Dateien

| Datei | Änderung |
| --- | --- |
| `assets/base.css` | 10 Zeilen: eine Medienabfrage für den mobilen Abschnittsrhythmus |
| `assets/section-launch-offer.css` | 1 Zeile: Abstand vor dem Button |
| `sections/launch-offer.liquid` | 1 Zeile: `newline_to_br` an der Überschrift |
| `templates/index.json` | Texte der beiden Zusagen |

### Unverändert — per Prüfsumme belegt

`assets/theme.js`, `assets/scent-code.js`, `assets/cart-drawer.js`,
`layout/theme.liquid`, `snippets/whatsapp-sticky.liquid`,
`snippets/whatsapp-link.liquid`, `snippets/css-variables.liquid`,
`config/settings_schema.json`, `config/settings_data.json`,
`sections/hero-v2.liquid`, `assets/section-hero-v2.css`,
`sections/how-it-works.liquid`, `assets/section-scent-code.css`,
`sections/header.liquid`, `sections/announcement-bar.liquid`,
`sections/product-row.liquid`, `sections/whatsapp-feature.liquid`,
`sections/editorial-feature.liquid`, `sections/newsletter.liquid`,
`sections/footer.liquid` — alle byte-identisch mit Step 3.

Damit sind Hero, „So funktioniert's“, die Floating-Bar samt JavaScript und
sämtliches JavaScript des Themes nachweislich unverändert. An `base.css`
wurde ausschließlich der oben gezeigte Block **hinzugefügt**; die Regeln der
Floating-Bar, die globale Typografie und die Farbklassen sind nicht berührt.

Hero, Ankündigungsleiste, Header, der dunkle Beratungsbereich und der Footer
verwenden die Klasse `.section` nicht und sind von der Rhythmus-Regel schon
technisch nicht erfassbar. Der gerenderte Vergleich bestätigt das: Ihre
Höhen sind bei 390 px, 768 px und 1280 px identisch.

### Angebotslogik

Unverändert: 30 ml, 30 % Extrait, 29,90 € regulär, 20 % auf die erste
Bestellung, Garantie nur für die erste Bestellung, maximal 3 Flakons. Kein
10 ml, kein Travel Size, kein Discovery Set, keine Samples, keine Essentials.
Keine Produkt- oder Variantenmigration. Der Abschnitt rechnet weiterhin keine
Preise und keine Rabatte aus.

---

## V4.1 Step 3 — Launch-Angebot gestrafft

Der Launch startet ausschließlich mit **30 ml Extrait, 30 % Konzentration,
29,90 €**, dazu Kennenlernvorteil, Zufriedenheitsgarantie, WhatsApp-Beratung
und Scent-Code-System. Die Startseite bildet ab jetzt nur noch dieses Angebot
ab.

### Von der Startseite genommen

Alle vier Abschnitte bleiben vollständig im Theme und in `templates/index.json`
erhalten und sind lediglich mit `"disabled": true` ausgeblendet. Im
Theme-Editor genügt „Abschnitt einblenden“, um sie zurückzuholen — Texte,
Bilder und Einstellungen sind unverändert gespeichert.

| Abschnitt | Kennung | Grund |
| --- | --- | --- |
| Discovery Set (5 × 2 ml) | `discovery` | nicht im Launch-Angebot |
| Travel 10 ml | `travel` | nicht im Launch-Angebot |
| Essentials | `essentials` | nicht im Launch-Angebot |
| „Code bereits bekannt?“ | `code` | zweites Scent-Code-Eingabefeld auf derselben Seite; der Hero enthält bereits eines. Punkt 9 des Auftrags schließt mehrfache Code-Eingaben aus. |

Die Ausblendung von `code` ist die einzige Entscheidung, die über die
ausdrücklich genannten vier Angebotsbereiche hinausgeht. Sie lässt sich mit
einem Klick zurücknehmen.

### Neu: „Vorteil & Garantie“

Ein neuer Abschnitt fasst Kennenlernvorteil und Zufriedenheitsgarantie
zusammen, statt die Startseite um zwei Abschnitte zu verlängern. Auf
Mobilgeräten stehen beide untereinander, ab 990 px nebeneinander, getrennt
durch dieselben Haarlinien wie im übrigen Theme. Keine Karte, kein Rahmen,
kein Schatten, kein Siegel, kein Symbol, keine neue Farbe.

```
WILLKOMMEN BEI VENT CELESTE        OHNE RISIKO
20 % KENNENLERNVORTEIL             100 % ZUFRIEDENHEITSGARANTIE
Auf deine erste Bestellung.        Du sollst deinen Duft lieben.
                                   Wenn du mit einem Duft aus deiner ersten
Gültig für bis zu 3 Düfte.         Bestellung nicht zufrieden bist, kümmern
                                   wir uns darum.
                                   Gültig für deine erste Bestellung und
                                   maximal 3 Flakons.

               [ MEINEN DUFT FINDEN ]
```

Der Button öffnet die bestehende WhatsApp-Beratung über `whatsapp-link` —
dieselbe Rufnummer und dieselbe vorbereitete Nachricht wie überall sonst.
Beide Texte sind vollständig über Blöcke im Theme-Editor pflegbar.

**Der Abschnitt rechnet nichts aus.** Er enthält keine Preislogik und keinen
Rabattbetrag, sondern nur die hier gepflegten Texte. Der reguläre Preis steht
weiterhin ausschließlich in „Das Prinzip“ (29,90 € als Musterpreis, verbindlich
ist der Shop-Preis) und an den echten Produkten.

### Neue Reihenfolge

1. `hero` — FIND YOUR SCENT (mit Scent-Code-Eingabe)
2. `profiles` — WhatsApp-Duftberatung, „Dein Duft ist nicht dabei?“
3. `how` — So funktioniert's
4. `most_wanted` — Most Wanted
5. `offer` — 20 % Kennenlernvorteil · 100 % Zufriedenheitsgarantie *(neu)*
6. `extrait` — Die Hauptlinie, 30 % Extrait
7. `promise` — Das Prinzip: 30 ml · 30 % · 29,90 €
8. `brand` — Über VENT CELESTE
9. `newsletter` — Newsletter, danach Footer

`promise` stand bisher direkt hinter dem Hero und wiederholte dort die
Aussage des Heros. An Position 7 trägt es die Preisangabe der Journey und
seine Fußnote „Angaben beziehen sich auf die Extrait-Linie“ steht direkt unter
dem Extrait-Abschnitt.

### Geänderte Dateien

| Datei | Art |
| --- | --- |
| `templates/index.json` | Reihenfolge, vier Abschnitte deaktiviert, neuer Abschnitt `offer` |
| `sections/launch-offer.liquid` | neu |
| `assets/section-launch-offer.css` | neu |

Sonst wurde **keine** Datei angefasst.

### Unverändert — per Prüfsumme belegt

`assets/theme.js`, `assets/base.css`, `layout/theme.liquid`,
`snippets/whatsapp-sticky.liquid`, `snippets/whatsapp-link.liquid`,
`snippets/css-variables.liquid`, `config/settings_schema.json`,
`config/settings_data.json`, `sections/hero-v2.liquid`,
`assets/section-hero-v2.css`, `sections/how-it-works.liquid`,
`assets/section-scent-code.css`, `sections/header.liquid`,
`sections/announcement-bar.liquid`, `sections/product-row.liquid`,
`sections/whatsapp-feature.liquid`, `sections/editorial-feature.liquid`,
`sections/newsletter.liquid`, `sections/footer.liquid` — alle byte-identisch
mit Step 2.

Damit sind Hero, Farbschema-Fix und die Floating-Bar samt JavaScript
nachweislich unverändert. Im gerenderten Vergleich beider Stände hat jeder
weiterhin sichtbare Abschnitt bei 390 px und 1280 px exakt dieselbe Höhe wie
zuvor; der einzige Unterschied sind die vier entfallenen und der eine neue
Abschnitt.

**Seitenhöhe mobil:** 7166 px → 5517 px bei 390 px (−23 %), 7220 px → 5512 px
bei 430 px. Kein horizontaler Überlauf, keine Textüberlappung, ein einziges
Scent-Code-Feld im Seitenfluss.

### Produktlogik

An Produkten, Varianten und CSV-Strukturen wurde **nichts** geändert. Der
Kaufweg wird allein über die Startseite auf 30 ml Extrait fokussiert.

### Noch im Shopify-Adminbereich zu erledigen

Der 20-%-Vorteil ist im Theme bewusst nur eine Aussage. Damit er wirkt:

1. **Rabatt anlegen** — Rabatte → Rabatt erstellen → *Betrag auf Produkte*,
   20 % auf die Extrait-Kollektion. Automatischer Rabatt oder Rabattcode.
2. **Auf Erstbestellung begrenzen** — bei *Berechtigung* „Kundensegment“
   wählen und ein Segment mit `number_of_orders = 0` verwenden. Shopify
   erzwingt das nicht rückwirkend; bei Rabattcodes zusätzlich
   „Eine Verwendung pro Kunde“ aktivieren.
3. **Auf 3 Flakons begrenzen** — Shopify kann die Menge nicht nativ
   deckeln. Ohne App gilt die Grenze nur als kommunizierte Bedingung; für
   eine harte Grenze ist eine Rabatt-App oder eine Shopify Function nötig.
4. **Garantiebedingungen** — die vollständigen Bedingungen als eigene Seite
   anlegen und im Footer verlinken. Der Abschnitt zeigt bewusst nur die
   kurze Zusammenfassung.
5. **Varianten** — falls Produkte Varianten für EDP, Travel oder Sample
   tragen, diese im Adminbereich auf „nicht verfügbar“ setzen oder aus den
   Verkaufskanälen nehmen. Nicht löschen, solange sie später wieder
   gebraucht werden.
6. **Kollektionen** — `travel-size`, `essentials` und das Discovery-Set-Produkt
   aus der Navigation nehmen, sonst bleiben sie über die Menüs erreichbar.

---

## V4.1 fixed — zwei Mobile-Korrekturen

Der technische Stand wurde nicht verändert: Farbschema-Fix, `css-variables.liquid`,
`config/`, Header, Ankündigungsleiste, `FIND YOUR SCENT` und das
Scent-Code-Design sind unangetastet. Geändert wurden **drei Dateien mit
zusammen 25 Zeilen**.

---

### 1 · WhatsApp-CTA erschien als Textlink — Ursache gefunden

**Untersuchung.** Zuerst wurde das Snippet mit der Liquid-Engine tatsächlich
gerendert, statt die Klassen zu vermuten. Ergebnis:

```html
<a class="button button--whatsapp hero2__cta" href="https://wa.me/491728439661?text=…"
   target="_blank" rel="noopener" data-whatsapp>
```

Die Klassen stehen also im HTML. Anschließend wurde die CSS-Kaskade für genau
dieses Element durchgerechnet: `.hero2__cta` aus `section-hero-v2.css` gewinnt
gegen `.button` aus `base.css` — die Regel greift.

**Die eigentliche Ursache liegt eine Ebene tiefer.** Alle Farbangaben im Theme
hatten die Form `rgb(var(--color-…))` ohne Fallback — 197 Stellen. Ist eine
dieser Variablen nicht definiert, ist die gesamte Deklaration **ungültig**, und
`background-color` fällt auf `transparent` zurück. Genau das ergibt das
beobachtete Bild: keine Fläche, kein Rahmen, dunkle Schrift auf hellem Grund —
ein Textlink. Typografie und Layout bleiben dabei intakt, weil sie keine
Farbvariablen verwenden.

**Korrektur** an den beiden betroffenen Regeln selbst, nicht per neuem Selektor:

| Datei | Regel | vorher | jetzt |
|---|---|---|---|
| `assets/base.css` | `.button` | `rgb(var(--color-button))` | `rgb(var(--color-button, 20 18 16))` |
| `assets/base.css` | `.button` | `rgb(var(--color-button-label))` | `rgb(var(--color-button-label, 245 242 237))` |
| `assets/section-hero-v2.css` | `.hero2__cta` | `rgb(var(--color-text))` | `rgb(var(--color-text, 20 18 16))` |
| `assets/section-hero-v2.css` | `.hero2__cta` | `rgb(var(--color-background))` | `rgb(var(--color-background, 245 242 237))` |

Zusätzlich haben `border` und `border-radius` des CTA jetzt ebenfalls Fallbacks,
und `.hero2__cta svg` erbt die Schriftfarbe — das Symbol ist damit hell.

Ergebnis: schwarze Fläche, helle Schrift und helles Symbol, volle Breite
innerhalb des Inhaltsbereichs, 56 px Höhe, eckig (`--button-radius` steht auf 0).
Das gilt jetzt unabhängig davon, ob die Farbvariablen ausgeliefert werden.

Link, Rufnummer und vorbereitete Nachricht sind unverändert.

### 2 · Große weiße Fläche nach der Scent-Code-Zeile — Ursache gefunden

Es lag weder an `min-height` noch an `padding` oder der Hero-Höhe.

Im Hero ist **kein Bild hinterlegt** (`hero.settings.image` ist leer). In diesem
Fall rendert `sections/hero-v2.liquid` den Shopify-Platzhalter:

```liquid
{{ 'product-1' | placeholder_svg_tag: 'full-bleed-media' }}
```

Dieser Platzhalter ist nahezu weiß und wird über
`.hero2__media svg { aspect-ratio: 4 / 3 }` bei voller Breite dargestellt — auf
einem 390 px breiten Display sind das rund **292 px leere Fläche** unmittelbar
nach der Scent-Code-Zeile.

**Korrektur.** Die Section erhält einen Modifier, wenn kein Bild gesetzt ist:

```liquid
<section class="hero2{% if section.settings.image == blank %} hero2--no-image{% endif %} …">
```

```css
@media (max-width: 749px) {
  .hero2--no-image .hero2__media { display: none; }
  .hero2--no-image .hero2__inner { padding-block: 1.125rem 2rem; }
}
```

Der Platzhalter entfällt auf Mobile, solange kein echtes Bild hinterlegt ist;
32 px Innenabstand unten plus der Abstand des Folgeabschnitts ergeben einen
ruhigen, hochwertigen Übergang. **Sobald ein Hero-Bild gesetzt wird, greift der
Modifier nicht mehr und das Bild erscheint wie zuvor.** Desktop bleibt in beiden
Fällen unverändert.

### Geprüft

- Liquid-Render des Snippets und des Hero-Modifiers mit der Liquid-Engine
  ausgeführt: Klassen und Bedingung erzeugen das erwartete Markup
- CSS-Kaskade für das CTA-Element programmatisch nachgerechnet
- Farbschema: null Treffer für `"type": "color_scheme"`, `color_scheme_group`
  und `settings.color_schemes`; `css-variables.liquid` und `config/` unverändert
- `.display`, Header und Ankündigungsleiste unverändert
- Layoutfix „So funktioniert's" (`.steps__text { grid-column: 2 }`) unverändert
- Theme Check: 0 Fehler, 0 Warnungen; alle JSON-Dateien und Section-Schemas
  gültig; CSS-Klammerbilanz ausgeglichen

---

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


## v4.2.2 — Cart Drawer Mobile Fix
- iOS/Safari: `display: contents` im Cart-Drawer entfernt.
- Drawer erhält eigenen weißen Hintergrund, feste 100dvh-Höhe und klare rechte Seitenfläche.
- Body scrollt innerhalb des Drawers; Footer/Zwischensumme und Checkout bleiben sauber unten.
- Warenkorb-Produktzeile, Menge und Preise für kleine Displays verdichtet.
- Hintergrundseite bleibt nur als abgedunkelte Ebene sichtbar und mischt sich nicht mehr mit Drawer-Inhalten.

## v4.2.3
- Rebuilt cart drawer stacking for Shopify mobile preview.
- Forces the cart section above the overlay and uses a fully opaque Ivory panel.
- Prevents product-page content from visually bleeding through the open cart.
- Simplifies mobile cart item layout and keeps footer/subtotal inside the drawer.

## v4.2.4
- Duftcharakter als elegante Farbbalken statt Text-Pills.
- Jahreszeit und Anlass mit sichtbareren, dezenten Balken.
- Mobile-Abstände und Duftnoten kompakter.
- Stil/Beschreibung als ruhiger Abschluss des Duftprofils.

## v4.2.6 — Mobile menu isolation
- Mobile navigation drawer is portaled to `body` to escape Shopify preview stacking contexts.
- Drawer receives a fully opaque ivory background and top-layer z-index.
- Product content can no longer bleed through the open navigation.
- Mobile drawer scrolling is isolated from the underlying page.

## 4.2.8 — Search & scent aliases
- Mobile menu search is now a real input with an explicit submit button.
- Numeric search is normalized (`49` → `VC-049`).
- Search page resolves the six launch scents by visible scent notes and character terms even when Shopify storefront tags are not yet indexed.
- Examples: `Vanille`, `Tabak`, `Gourmand`, `Holzig`, `Bergamotte`.

## v4.2.9 — Note search catalog fix
- Duftnoten-/Duftcharakter-Suche durchsucht jetzt bewusst den gesamten Produktkatalog statt nur die konfigurierte Bestseller-/Scent-Code-Kollektion.
- Codevergleich im Fallback-Index erfolgt numerisch/exakt, damit VC-049 zuverlässig auf `049` gematcht wird.

# Änderungsprotokoll

## V3.5 — Farbschema-Fehler im Theme-Editor behoben

V3.4 hat den Fehler nicht behoben. Der Grund war eine falsche Annahme: Ich habe
den Rollensatz *erweitert*, statt ihn mit dem abzugleichen, den Shopify
tatsächlich kennt. Diesmal wurden `config/settings_schema.json` und
`config/settings_data.json` von Dawn (Shopify/dawn, main) heruntergeladen und
Feld für Feld verglichen.

### Ursache 1 — ungültige Rollen in der `color_scheme_group`

Shopify kennt genau zehn Rollen. Eine unbekannte Rolle macht die gesamte Gruppe
ungültig — und damit erscheint die Meldung, Farbschemata seien nicht definiert.

| Rolle | Status |
|---|---|
| `shadow` | **ungültig** — steckte seit V1 im Rollensatz. Das war der ursprüngliche Fehler. |
| `button`, `on_button` | **ungültig** — in V3.4 von mir ergänzt, hat es verschlimmert. |

Der Rollensatz entspricht jetzt exakt dem von Dawn: `text`, `background`
(solid + gradient), `links`, `icons`, `primary_button`, `on_primary_button`,
`primary_button_border`, `secondary_button`, `on_secondary_button`,
`secondary_button_border`.

`shadow` bleibt als **Farbe in der Definition** erhalten — Dawn führt sie dort
ebenfalls, ohne sie einer Rolle zuzuweisen. Damit ist auch belegt, dass die
markeneigenen Zusatzfarben `muted`, `line` und `accent` zulässig sind.

### Ursache 2 — `settings_data.json` hatte die falsche Grundform

Dawn liefert `current` als **Preset-Referenz**, nicht als Objekt:

```json
{ "current": "Dawn", "presets": { "Dawn": { … } } }
```

Umgestellt auf dieselbe Form mit dem Preset „VENT CELESTE". Das Preset enthält
alle Einstellungen inklusive `sections`; einen `blocks`-Key führt Dawn nicht,
er wurde entfernt.

### Ursache 3 — Schema-IDs angeglichen

Dawn nummeriert die Schemata. Umbenannt, um die letzte Strukturabweichung zu
beseitigen:

| vorher | jetzt | Hintergrund |
|---|---|---|
| `scheme-ivory` | `scheme-1` | `#F5F2ED` |
| `scheme-ivory-deep` | `scheme-2` | `#EBE6DE` |
| `scheme-ink` | `scheme-3` | `#141210` |
| `scheme-stone` | `scheme-4` | `#8C8375` |

Angepasst in 31 Dateien (Section-Schemas, Section-Groups, JSON-Templates,
`settings_data.json`). **Keine Farbe und keine Zuordnung hat sich geändert** —
geprüft: Hintergrundwerte identisch, alle Referenzen lösen auf, keine Reste der
alten IDs.

### Geprüft

- Rollensatz strukturgleich zu Dawn (Schlüssel und Wertetypen)
- `settings_data`: `current` ist ein String und zeigt auf ein existierendes Preset
- jedes Schema enthält alle Definition-Keys
- alle `color_scheme`-Werte in Section-Schemas, Section-Groups, JSON-Templates
  und `settings_data` verweisen auf existierende IDs
- Theme Check: 0 Fehler, 0 Warnungen

---

## V3.4 — Farbschemata für den Theme-Editor

Behebt die Editor-Meldung „Um eine Vorschau deiner Änderungen anzuzeigen,
müssen Farbschemata in den Dateien settings_data und settings_schema definiert
sein." Keine Designänderung: Alle Farbwerte und Schema-Zuweisungen bleiben
unverändert.

### Farbgruppe rollenvollständig — `config/settings_schema.json`

Die `color_scheme_group` wich in drei Punkten von der Struktur aktueller
Shopify-Themes (Dawn/Horizon) ab. Der Editor prüft die Rollenzuordnung
vollständig; fehlende Rollen lassen die Gruppe als undefiniert gelten.

| | vorher | jetzt |
|---|---|---|
| Rolle `background` | nur `solid` | `solid` **und** `gradient` |
| Verlaufs-Farbeinstellung | fehlte | `background_gradient` vom Typ `color_background` |
| Rollen `button` / `on_button` | fehlten | ergänzt |
| Rolle `shadow` | zeigte auf `line` | eigene Farbe `shadow` |
| Rollen für sekundäre Buttons | zeigten auf `text` | eigene Farbe `secondary_button_label` |

Vollständiger Rollensatz jetzt: `background` (solid + gradient), `text`,
`shadow`, `button`, `on_button`, `icons`, `primary_button`, `on_primary_button`,
`primary_button_border`, `secondary_button`, `on_secondary_button`,
`secondary_button_border`, `links`.

Die markeneigenen Zusatzfarben `muted`, `line` und `accent` bleiben als
zusätzliche Einträge in der Definition erhalten — das Designsystem baut darauf auf.

### `config/settings_data.json`

- Jedes der vier Schemata enthält jetzt **alle** Definition-Keys.
- Übernommene Werte, damit die Optik identisch bleibt:
  `secondary_button_label` = bisherige Textfarbe, `shadow` = bisherige Haarlinienfarbe,
  `background_gradient` = leer.
- `current` bleibt ein Objekt (nicht als Preset-Referenz) — so wie in Dawn.
- **Neu:** `presets`-Block „VENT CELESTE", der die aktuellen Einstellungen
  spiegelt. Er fehlte bisher vollständig.

### Geprüft

- Alle vier Schema-IDs (`scheme-ivory`, `scheme-ivory-deep`, `scheme-ink`,
  `scheme-stone`) sind definiert.
- Sämtliche `color_scheme`-Werte in Section-Schemas, Presets, JSON-Templates
  und Section-Groups verweisen auf existierende IDs — keine toten Referenzen.
- `theme_info` steht als erste Gruppe in `settings_schema.json`.
- Theme Check: 0 Fehler, 0 Warnungen.

### Mobile-Korrektur „So funktioniert's" mitgeführt

Die Korrektur lag nicht im Repository vor (sie wurde offenbar direkt im
Shopify-Code-Editor vorgenommen). Damit dieses ZIP sie nicht überschreibt,
wurde die Ursache im Repository behoben:

`.steps__item` hat auf Mobile zwei Rasterspalten, der Schritt aber drei
Elemente — die Beschreibung landete durch Auto-Placement unter der Nummer in
der schmalen Spalte. Ergänzt: `.steps__text { grid-column: 2 }`, im
990-px-Breakpoint auf `auto` zurückgesetzt. Zwei Zeilen CSS, sonst nichts.

Weicht die eigene Korrektur davon ab, hat sie Vorrang.

---

## V3 — technische Korrekturen vor dem Upload

Korrekturen an V2 auf Grundlage der technischen Prüfung. Architektur,
Designsystem, Mobile-first-Konzept, Scent-Code-System, Cart Drawer,
Produktkarten und die vorhandenen Sections bleiben unverändert.

### 1. WhatsApp-Link korrekt kodiert — `snippets/whatsapp-link.liquid`

Zuvor lief die **fertige URL** durch `url_encode`, wodurch auch Schema,
Doppelpunkt und Schrägstriche kodiert wurden und der Link brechen konnte.

Jetzt wird ausschließlich der Textparameter kodiert:

```liquid
assign wa_encoded_message = wa_message | url_encode | replace: '+', '%20'
assign wa_url = 'https://wa.me/' | append: wa_digits | append: '?text=' | append: wa_encoded_message
```

Zusätzlich werden Leerzeichen als `%20` statt als `+` ausgegeben — manche
WhatsApp-Clients interpretieren `+` wörtlich. Ein echtes Pluszeichen im Text ist
zu dem Zeitpunkt bereits als `%2B` kodiert und bleibt unberührt.

Geprüft: Schema, Host und Rufnummer bleiben unkodiert, der zurückgelesene Text
entspricht zeichengenau der Vorlage — mit und ohne Kontextzusatz.

Alle Einbindungen laufen über dasselbe Snippet: Hero, mobile Beratungsleiste,
Mega-Menü, mobiles Menü, Produktseite (neu), Sofortsuche ohne Treffer,
Suchergebnisseite, Discovery Set, Scent-Code-Bestellseite, Abschnitt „Über 120
Duftprofile", „So funktioniert's".

### 2. Varianten-Metafelder: Ableitung statt CSV-Import

Shopify überträgt Varianten-Metafelder **nicht** über den Produkt-CSV-Import.
Die alte CSV enthielt solche Spalten, und die README behauptete, sie ließen sich
importieren. Beides war falsch.

- **Neu:** `snippets/variant-facts.liquid` ermittelt Konzentration, Prozentwert
  und Füllmenge in dieser Reihenfolge: **Varianten-Metafeld, falls gepflegt →
  sonst Ableitung aus dem standardisierten Variantennamen.**

  | Ausführung | Konzentration | Prozent | Größe |
  |---|---|---|---|
  | Extrait 30 ml | Extrait | 30 % | 30 ml |
  | Eau de Parfum 30 ml | Eau de Parfum | 20 % | 30 ml |
  | Travel 10 ml | Extrait | 30 % | 10 ml |
  | Sample 2 ml | Extrait | 30 % | 2 ml |

- Erkennungswort und Prozentwerte stehen in den Theme Settings unter
  **Ausführungen & Konzentration** und sind ohne Code änderbar.
- Verwendet in `snippets/product-card.liquid`, `sections/main-product.liquid`
  (Anzeige und Variantendatenobjekt) und `sections/main-product-scent-code.liquid`.
- **CSV bereinigt:** alle `Variant Metafield:`-Spalten entfernt. Der Shop stimmt
  jetzt direkt nach dem Import, ohne 240 Einträge im Bulk Editor.
- README entsprechend korrigiert.

### 3. Discovery Set: fünf Scent Codes statt Produktauswahl

Die alte Fassung ließ aus einer Collection wählen und lud weitere Seiten über
`?section_id=discovery-picker&page=…` nach. Das passte nicht zum Modell — in
Shopify existieren nur 20 öffentliche Produkte — und die Nachladelogik war eine
unnötige Abhängigkeit.

- `sections/discovery-set.liquid` neu: fünf Eingabefelder `VC-___`
- Dieselbe Normalisierung wie im übrigen Shop (`47` → `VC-047`)
- Doppelte Codes werden abgewiesen, Enter springt ins nächste Feld
- Warenkorb-Button erst bei genau fünf gültigen, verschiedenen Codes
- Positionsangaben `Scent Code 1 … 5` plus versteckte Fassung `_vc_codes`
- Link darunter: „Noch keine fünf Codes? Duftberatung starten."
- **Entfernt:** `sections/discovery-picker.liquid`, `snippets/discovery-option.liquid`
- `assets/discovery-set.js` und `assets/section-discovery.css` neu geschrieben
- Preis bleibt bei 3,90 € (Shopify-Wert, nicht im Theme)

### 4. Nicht mehr jede Nummer 1–130 ist bestellbar

- **Neu:** Theme Setting `valid_scent_codes` (Textfeld, kommagetrennt).
  `047`, `VC-047` und `47` sind gleichwertig.
- Geprüft wird **im Browser** (`assets/scent-code.js`) **und serverseitig**
  (`snippets/scent-code-hit.liquid`) — die Sofortsuche und die
  Suchergebnisseite akzeptieren unbekannte Codes ebenfalls nicht mehr.
- Die Liste wird in `snippets/scent-code-map.liquid` als Zahlenfeld gerendert.
- **Fallback:** Bleibt das Feld leer, gilt weiterhin 1 … Höchstnummer. In der
  README steht, warum das für den Livegang gefüllt gehört.

### 5. Generisches Scent-Code-Produkt: vollständiger Variantenwechsel

`assets/scent-code-order.js` aktualisierte bisher nur Varianten-ID und Preis.
Jetzt wechseln wie auf der normalen Produktseite:

Preis · Streichpreis · Grundpreis · Konzentration · Prozentwert · Größe ·
Artikelnummer · Verfügbarkeit · Buttontext und -zustand.

Die Werte kommen aus einem vorformatierten Datenobjekt in
`sections/main-product-scent-code.liquid`. Der Warenkorb-Button ist nur aktiv,
wenn ein gültiger Code **und** eine verfügbare Variante vorliegen.
Ein Eau de Parfum zeigt an keiner Stelle 30 %.

### 6. Konzentrationsblock neutral benannt

„Was bedeutet 30 % Extrait?" stand fest unter der Kaufbox — auch wenn der Kunde
gerade die 20-%-Variante ansah.

Jetzt: **„Unsere Konzentrationen"**, mit Extrait (30 %) und Eau de Parfum (20 %)
sachlich nebeneinander, plus dem Hinweis, dass Travel und Probe der
Extrait-Rezeptur entsprechen. Geändert in `sections/main-product.liquid`
(Schema-Vorgabe) und `templates/product.json`.

### 7. Sofortsuche: Beschreibung wird mitdurchsucht

`assets/predictive-search.js` durchsucht zusätzlich `body`
(die Produktbeschreibung). Duftnoten in Metafeldern sind für die Shopify-Suche
grundsätzlich nicht erreichbar — damit sie gefunden werden, müssen sie in der
Beschreibung stehen. Das ist in der README als offener Punkt dokumentiert, damit
die Suche keine Fähigkeit verspricht, die noch nicht trägt.

### 8. Locale-Keys geprüft — kein Fehler gefunden

`general.search.results_count` und `products.facets.product_count` sind in
`de.default.json` **und** `en.json` vorhanden, allerdings als
Pluralisierungsgruppen (`one` / `other`) statt als einfache Zeichenketten.
Ein statischer Prüfer, der nur nach Zeichenketten sucht, übersieht sie leicht.
Beide werden korrekt mit `| t: count: …` aufgerufen. Es war nichts zu ergänzen.

### 9. Generisches Produkt aus dem Suchindex genommen

`snippets/meta-tags.liquid` gibt für `template.suffix == 'scent-code'`
`<meta name="robots" content="noindex,follow">` aus. Ein `Product`-Markup gab es
dort ohnehin nie. Öffentliche Bestsellerseiten bleiben normal indexierbar; der
Artikel trägt nur den Tag `scent-code` und gehört damit in keine sichtbare
Collection.

### Zusätzlich

- **Neu:** WhatsApp-Block auf der Produktseite (im Theme-Editor sortier- und
  abschaltbar). Der Scent Code der Seite fährt automatisch in der Nachricht mit.
- **Neu:** `docs/test-scent-code.js` — prüft die Normalisierung gegen die
  ausgelieferte `assets/scent-code.js`.
- Ungenutzte Zuweisungen in `sections/main-product.liquid` entfernt.
- `TemplateLength`-Schwelle in `.theme-check.yml` auf 500 Zeilen angehoben;
  `header.liquid` und `main-product.liquid` sind legitim lange Hauptsections.

### Unverändert

FIND YOUR SCENT. · Mobile-first-Hero · WhatsApp als primärer Beratungsweg ·
Scent-Code-Feld im Hero · MOST WANTED mit CSS Scroll Snap · 20 öffentliche
Bestseller · 120+-Hinweis · mobile Beratungsleiste · Cart Drawer · Filter ·
Duftfinder · dezente Scroll-Reveals und Hero-Drift · `prefers-reduced-motion` ·
Barrierefreiheit · Locales · Kundenkonten · Grundpreis nach PAngV.

### Weiterhin strikt

Keine Originalduft-Zuordnung in Shopify. Keine Fremdmarken in Titel, Tags, SKU,
Handle, Alt-Text, SEO-Feldern, Metafeldern, JSON, JavaScript oder
HTML-Kommentaren. Shopify kennt ausschließlich VC-Codes.

---

## V2 — Beratungsmodell und Scent Code

Neue Startseite (12 Abschnitte, mobile first), Scent-Code-System,
WhatsApp-Beratung, MOST WANTED als Scroll-Snap-Reihe, generischer Bestellweg,
Navigation SHOP / DUFTBERATUNG / VENT CELESTE, Konzentration auf Variantenebene,
kontextabhängige Kartenpreise.

## V1 — Grundausbau

Vollständige OS-2.0-Struktur, Designsystem aus Theme Settings, Filter mit acht
Achsen, Produktseite, Duftfinder, Discovery Set, Cart Drawer, Suche,
Kundenkonten, Locales de/en, Grundpreis nach PAngV.

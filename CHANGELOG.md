# Änderungsprotokoll

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

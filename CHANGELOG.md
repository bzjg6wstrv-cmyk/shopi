# v6.2 – Eine Art-Direction für Fotos und Seite

Die Produktfotos und die Seite sollen als ein System gelesen werden. Sechs
Eingriffe, keine Änderung an der Kauf-, Such- oder Scent-Code-Logik.

## 1 · Farbsystem in vier Stufen

| Stufe | Farbe | Verwendung |
| --- | --- | --- |
| 1 Hauptfläche | `#F7F3EC` | Grundton der Seite, nah am Hintergrund der Produktfotos |
| 2 Redaktionell | `#EFE8DB` | Bereiche, die sich bewusst absetzen (Kennenlernvorteil, Fußbereich) |
| 3 Kontrast | `#0B0B0A` | der Beratungsmoment, die Markenaussage, die Ankündigungszeile |
| 4 Stein | `#9A9185` | seltene Sonderflächen |

Der Rhythmus der Startseite entsteht aus dem Wechsel dieser Stufen:
Schwarz (Ankündigung) · Ivory (Kopf, Hero, Bestseller) · Schwarz (Beratung) ·
Ivory (So funktioniert's, 30 % Extrait) · **Beige (20 %)** · Schwarz (Marke) ·
Ivory (Newsletter) · Beige (Fußbereich).

Kontrastwerte: Text auf Ivory 17,80:1 · gedämpfter Text auf Ivory 5,21:1 ·
Text auf Beige 16,16:1 · gedämpfter Text auf Beige 5,18:1 · Ivory auf Schwarz
17,80:1 · Champagne auf Schwarz 7,79:1.

## 2 · Bestseller-Karten

Kachel, Radius und Rahmen sind entfernt; das Bild geht ohne Kante in den
Seitenton über. `object-fit: contain` statt `cover` – der Flakon wird nie
angeschnitten und steht in voller Bahnbreite. Die Trennlinie unter dem Bild
entfällt, die Abstände Bild → Code → Ausführung → Preis sind neu abgestimmt.
Schnell-hinzufügen sitzt jetzt als Zeile unter den Angaben statt als Knopf
auf dem Foto; Formular, Varianten-ID und Warenkorb-Rückmeldung sind
unverändert. Vorschau auf die nächste Karte: 12 %, gemessen bei 320, 375,
390, 393 und 430 px.

## 3 · Produktgalerie

**Warum sie vorher wie ein Stapel wirkte:** `object-fit: cover` in einem auf
42 vh gedeckelten Kasten schnitt jedes Foto auf einen fast quadratischen
Block, und vom nächsten Bild blieb ein 12 px breiter Splitter am Rand. Es gab
weder Zähler noch Punkte, nur eine 1 px hohe Fortschrittslinie. Nichts daran
las sich als Galerie.

**Jetzt:** auf dem Telefon ein Bild pro Blick, rund 10 % Vorschau auf das
nächste, Zähler „2 / 4" rechts unter der Bahn. `contain` statt `cover`, damit
das Bild mit den Duftnoten vollständig lesbar bleibt. Ab Tablet wird dieselbe
Bahn zur Bühne: ein großes Bild, darunter eine Reihe kleiner Vorschauen zum
Anspringen, rechts die mitlaufende Kaufspalte. Jedes Bild liegt in einer
eigenen Bahnbreite, damit Einrasten und Schrittweite gleich bleiben. Ohne
JavaScript stehen die Bilder untereinander und bleiben vollständig
erreichbar. Der Variantenwechsel holt weiterhin das passende Bild heran.

## 4 · 20-%-Bereich

Von Schwarz auf die warme Beigefläche. Rahmenlinien oben und unten entfernt –
der Farbwechsel trennt bereits. Mehr vertikale Luft, die tragende Zusage
deutlich größer (60 px auf dem Schreibtisch, 34 px auf dem Telefon gegen
23/24 px der Beratungsspalte) und mittig zur rechten Spalte gesetzt.
Überschriften in gemischter Schreibweise statt Versalien.

## 5 · Typografie

Kein Text mehr unter 11 px. Auszeichnungen eine Stufe größer, die
Grundsperrung von 0,12 auf 0,09 em gesenkt und alle zusätzlichen Aufschläge
entfernt. Ganze Sätze laufen nicht mehr in Versalien – die Ankündigungszeile
und die kleinen Hinweistexte stehen in gemischter Schreibweise. `h2` und `h3`
auf dem Telefon eine Stufe größer.

## 6 · Nebenbei behoben

Der Warenkorb ersetzte beim Hinzufügen den Knopfinhalt über `textContent` und
verlor dabei dauerhaft das Symbol neben der Beschriftung. Jetzt wird
`innerHTML` gesichert und zurückgeschrieben.

## Prüfungen

Theme Check 33 Verstöße gegen 36 der Basis, keine neue Art. 27 JSON-Dateien,
36 Section-Schemas und 13 JS-Dateien fehlerfrei. Sweep über 320, 375, 390,
393, 430, 750, 768, 1024, 1280, 1440 und 1600 px auf sechs Seitentypen ohne
waagerechten Überlauf. Treiber für Code-Normalisierung, Cart-API-Bestellweg
und Kaufweg unverändert grün.

---

# v4.2.26 – Hero-Schlagzeile und Bestseller-Reihe deterministisch

Nur zwei Dateien, nur die beiden gemeldeten Punkte. Scent-Code-Eingabe,
Scent-Code-Suche, Topseller-Erkennung, generischer Bestellweg, Produktseiten
und Warenkorb sind unberührt.

## 1 · Hero „SCENT."

Die mobile Schriftgröße geht von `clamp(2.25rem, 10vw, 3rem)` auf
`clamp(2rem, 9vw, 2.75rem)` – bei 390 px sind das 35 statt 39 px. Zusammen
mit dem bereits vorhandenen `white-space: nowrap` kann das Wort weder brechen
noch überlaufen.

Gemessen mit der echten Playfair Display, „SCENT." misst darin 3,37 em:

| Fenster | Schrift | Spalte | „SCENT." | Anteil |
| --- | --- | --- | --- | --- |
| 375 px | 33,8 px | 335 px | 106 px | 32 % |
| **390 px** | **35,1 px** | **350 px** | **110 px** | **31 %** |
| 393 px | 35,4 px | 353 px | 111 px | 31 % |
| 402 px | 36,2 px | 362 px | 113 px | 31 % |
| 414 px | 37,3 px | 374 px | 117 px | 31 % |
| 428 px | 38,5 px | 388 px | 121 px | 31 % |
| **430 px** | **38,7 px** | **390 px** | **121 px** | **31 %** |

Reserve also mehr als das Dreifache: Selbst eine deutlich breiter laufende
Schrift kann die Zeile nicht mehr sprengen. Alle drei Zeilen stehen als
`FIND / YOUR / SCENT.`, kein Umbruch, kein Überlauf, kein Seitenscroll.
Desktop unverändert – die Regel steht in `@media (max-width: 749px)`.

## 2 · Bestseller-Reihe

Die Kartenbreite wird nicht mehr aus `vw` abgeleitet, sondern aus der Bahn
selbst:

```
grid-auto-columns: min(calc(100% - var(--row-peek) - var(--space-md)), 20rem)
--row-peek: 3.5rem
```

`100 %` ist hier die Breite der Bahn, also Fensterbreite minus beide
Seitenränder. Damit kann keine Rundung gegenüber dem Fenster mehr entstehen:
Karte plus Vorschau plus Spaltenabstand ergeben exakt die verfügbare Breite.
Der Deckel bei 20 rem sorgt dafür, dass auf breiteren Telefonen wie bisher
zwei Karten nebeneinander stehen.

Gemessen bei 320, 360, 375, 390, 393, 402, 414, 428, 430, 480, 560, 599, 600
und 749 px, jede der sechs Karten einzeln angeschnappt: Die aktive Karte
steht immer bei 20 … 20 + Kartenbreite, also vollständig im Fenster – mit
Bild, VC-Code, „EXTRAIT · 30 ML · 30 %" und Preis. Die Vorschau auf die
nächste Karte beträgt auf Telefonen konstant 76 px. Keine waagerechte
Bildlaufleiste.

## Geänderte Dateien

`assets/base.css` (nur die mobile Schriftgröße der Schlagzeile) ·
`assets/section-product-row.css` (Kartenbreite und Vorschauwert)

## Geprüft

Scent-Code-Eingabe unverändert: nur Ziffern, führende Nullen, Enter,
`071 → VC-071`. Warenkorb-Weg, Produktseiten-Bestellweg, Suche und Menü
laufen unverändert durch. Desktop bei 990, 1280 und 1600 px: kein
Unterschied. Auf Mobilgeräten ändern sich nur Hero (434 → 424 px) und
Bestseller-Reihe (551 → 596 px).

# v4.2.23 – Scent-Code Darstellung

- Die sechs öffentlich gelisteten Bestseller bleiben unverändert und führen weiterhin auf ihre vollständigen Produktseiten.
- Nicht gelistete/persönliche Scent Codes zeigen jetzt „DEIN SCENT CODE“ statt „1 PASSENDES DUFTPROFIL“.
- Persönliche Codes erklären direkt, dass der ausgewählte Duft nach Bestellung frisch gemischt und als 30 ml Extrait abgefüllt wird.
- Cart-API, Code-Normalisierung und öffentliche Produkterkennung wurden nicht verändert.

## v4.2.21 – Search result intent cleanup

- Gelistete Duftprofile wie VC-049 führen über Bild, Titel und CTA auf die vollständige Produktseite.
- CTA für gelistete Produkte heißt jetzt „Produkt ansehen“ statt „Jetzt auswählen“.
- Persönliche/generische Scent Codes behalten den direkten Cart-API-Weg mit „Jetzt auswählen“.
- Suchtreffer zeigen konsistent „Extrait · 30 ml · 30 %“ und den Preis; der Preis fällt bei Bedarf auf den Produktpreis zurück.
- Keine Änderungen an der bestehenden Scent-Code-Cart-API-Logik.

# VENT CELESTE — Änderungsprotokoll

## v4.2.17 — „Jetzt auswählen" legt über die Cart API in den Warenkorb

### Ursache

Hinter „Jetzt auswählen" steckte eine **Navigation**. Je nach ausgelieferter
Fassung war das ein `<form action="/cart/add">` oder ein `<a href>` auf die
Produktseite. Beides erklärt den Rücksprung auf „Düfte suchen":

* Ein natives `POST /cart/add` leitet bei einem Fehler – etwa einer
  Variantennummer, die es nach dem Neuanlegen des Produkts nicht mehr gibt –
  zurück auf die **verweisende Seite**. Das ist die Suchseite.
* `fallbackUrl()` in `assets/scent-code.js` liefert
  `/search?q=<Code>`, sobald die Zuordnungstabelle kein Produkt kennt.
  `general.search.title` ist genau „Düfte suchen".

Gemeinsamer Nenner: Sobald das Produkt nicht sauber auflöste, landete der
Kunde wieder in der Suche – ohne Hinweis, was schiefgelaufen ist.

### Was jetzt passiert

Der generische Treffer ist ein `<button type="button">`. Kein `href`, kein
`action`, kein `target`, kein `window.location` – hinter der Schaltfläche
liegt keine Navigation mehr, die den Kunden irgendwohin schicken könnte.

Der Klick läuft ausschließlich über die Cart API:

```
POST /cart/add.js
{ "items": [ { "id": <Variante>, "quantity": 1,
               "properties": { "Scent Code": "VC-071" } } ],
  "sections": "cart-drawer" }
```

* **Variantennummer** – serverseitig aus dem Produkt (`data-variant-id`).
  Fehlt sie, holt `scent-code-add.js` sie zur Laufzeit über
  `/products/<handle>.js` und nimmt die erste verfügbare Variante. Im Theme
  steht keine feste Nummer, weder Produkt- noch Varianten-ID.
* **Danach** – der Abschnitt `cart-drawer` aus der Antwort wird übernommen,
  der Zähler aktualisiert und die vorhandene Warenkorb-Lade geöffnet. Gibt es
  sie nicht, geht es auf `routes.cart_url`.
* **Bei einem Fehler** – `console.error` mit dem echten Grund, eine
  verständliche Meldung unter dem Treffer, keine geöffnete Lade, kein
  vorgetäuschter Erfolg, kein Rücksprung.
* **Doppelklickschutz** – während der Anfrage ist die Schaltfläche
  deaktiviert und trägt `aria-busy`; danach wird sie wieder freigegeben.

Codes mit eigener Produktseite (VC-049, VC-040) verlinken unverändert dorthin.

### Geänderte Dateien

| Datei | Änderung |
| --- | --- |
| `snippets/scent-code-hit.liquid` | Button statt Link für generische Codes, mit Code, Variantennummer, Handle und Meldungstexten als Datenattribute |
| `assets/scent-code-add.js` | **neu** – Cart API, Laufzeitermittlung der Variante, Warenkorb-Lade, Fehlerbehandlung, Doppelklickschutz |
| `sections/header.liquid` | lädt das Skript (die Sofortsuche ist auf jeder Seite erreichbar) |
| `assets/base.css` | Zustand des Buttons und Platz für die Meldung |
| `locales/de.default.json`, `locales/en.json` | `sections.scent_code.add_failed` |

Nicht angefasst: Typografie, Abstände, Header-Layout, Footer, Suchseite,
Ergebnisdarstellung, Farben, mobile Darstellung, Warenkorb, Produktseiten.

### Nummernkreis

Unverändert offen. Geprüft: `1`, `01`, `001`, `VC-1`, `VC-01`, `VC-001` → alle
`VC-001`; `71`, `071`, `VC-71`, `VC-071` → alle `VC-071`; `9` → `VC-009`,
`130` → `VC-130`, `131` → `VC-131`, `999` → `VC-999`, `1000` → `VC-1000`,
`2847` → `VC-2847`. Alle Nummern von 1 bis 3000 durchlaufen, keine
Abweichung. `0`, negative Zahlen, Buchstaben und `1 2` werden abgelehnt.
Die Suche nach Duftnoten und Duftfamilien ist unberührt.

---

## v4.2.16 — Bestellweg über die Produktseite statt direktem Warenkorb

Der direkte Warenkorb-Absender aus den Suchergebnissen ist entfernt. Der
Suchtreffer ist wieder ein normaler Link:

```
71 → VC-071 → JETZT AUSWÄHLEN
   → /products/vent-celeste-scent-code?code=VC-071
```

Codes mit eigener Produktseite verlinken unverändert dorthin.

### Der Bestellweg funktioniert jetzt mit beiden Produktvorlagen

Bisher verarbeitete nur `main-product-scent-code` den Parameter `?code=` —
also nur bei zugewiesener Vorlage `product.scent-code`. `scent-code-order.js`
kennt jetzt zwei Betriebsarten:

| | Vorlage | Formular | Varianten und Preis |
| --- | --- | --- | --- |
| A | `product.scent-code` | eigenes Bestellformular des Abschnitts | dieses Skript |
| B | Standard-Produkt | das reguläre Produktformular | weiterhin `product-form.js` |

In beiden Fällen liest das Skript beim Laden `?code=`, füllt Eingabefeld,
`data-code-property`, `data-code-property-hidden` und die Kennzeichnung und
gibt den Warenkorb-Button frei, sofern die Variante verfügbar ist. Ohne
gültigen Code bleibt der Button gesperrt und das Formular wird nicht
abgesendet.

Für Betriebsart B rendert `sections/main-product.liquid` zwei Dinge —
**ausschließlich**, wenn das aufgerufene Produkt das eingestellte
Scent-Code-Produkt ist:

* vor dem Produktformular die Code-Eingabe (`snippets/scent-code-inline.liquid`)
* im Produktformular die beiden verborgenen Positionsangaben

Die Eingabe steht bewusst **vor** dem Formular: Das Feld ist selbst ein
`<form>`, verschachtelte Formulare sind ungültiges HTML und der Browser würde
das innere verwerfen.

Für jedes andere Produkt ist die Ausgabe von `main-product.liquid`
**byte-identisch** mit v4.2.15 — nachgemessen an einer gerenderten normalen
Produktseite.

### Geänderte Dateien

| Datei | Änderung |
| --- | --- |
| `snippets/scent-code-hit.liquid` | wieder ein Link auf `?code=`, kein `<form action="/cart/add">` mehr |
| `assets/scent-code-order.js` | zweite Betriebsart, eigener Ersatz-Normalisierer, Absendesperre in beiden Vorlagen |
| `sections/main-product.liquid` | Erkennung des Scent-Code-Produkts, Code-Eingabe und Positionsangaben, nur für dieses eine Produkt |
| `snippets/scent-code-inline.liquid` | **neu** – die Code-Eingabe für die Standardvorlage |
| `assets/section-scent-code.css` | Abstände der Inline-Eingabe |
| `locales/de.default.json`, `locales/en.json` | Beschriftung `sections.scent_code.check` |

### Geprüft

`?code=VC-001`, `?code=VC-071`, `?code=VC-250` auf **beiden** Vorlagen:
Eingabefeld, Positionsangabe, interne Angabe, Kennzeichnung und Button jeweils
korrekt; Absenden liefert
`id=<echte Variante> · properties[Scent Code]=VC-0xx · properties[_vc_code]=VC-0xx`.
Ohne Code bleibt der Button gesperrt und es wird nichts abgesendet — auch
dann nicht, wenn der Button künstlich entsperrt wird. Sechs Absendevorgänge
über beide Vorlagen ergeben drei unterschiedliche Codes, also drei getrennte
Positionen.

Suchtreffer für `1`, `71`, `VC-71`, `250`: normaler Link auf
`/products/vent-celeste-scent-code?code=…`, CTA „Jetzt auswählen", kein
Warenkorb-Formular, kein „Keine Treffer" daneben. `101` (eigenes Produkt)
verlinkt weiterhin auf `/products/vc-101`.

Startseite bei 390, 750, 990, 1280 und 1600 px unverändert, keine JS-Fehler,
Theme Check ohne Fehler.

---

## v4.2.15 — Richtiger Produkt-Handle `vent-celeste-scent-code`

Die Theme-Einstellung „Produkt für nicht gelistete Codes" zeigte auf den
Handle `scent-code`. Den gibt es im Shop nicht — das Produkt heißt
`vent-celeste-scent-code`. Shopify löst einen unbekannten Handle zu `nil` auf:
Die Einstellung war damit leer, der Suchtreffer fand kein Produkt und konnte
keine Variantennummer liefern.

### Geändert

| Datei | Änderung |
| --- | --- |
| `config/settings_data.json` | `scent_code_product` auf `vent-celeste-scent-code`, in den aktuellen Werten **und** im Preset |
| `snippets/scent-code-hit.liquid` | Rückfall über `all_products['vent-celeste-scent-code']`, falls die Einstellung leer ist |
| `snippets/scent-code-map.liquid` | derselbe Rückfall, damit beide Wege dasselbe Produkt ansteuern |
| `README.md`, `docs/test-scent-code.js` | Handle in Beschreibung und Testdaten |

### Bewusst nicht geändert

`scent-code` kommt an vielen weiteren Stellen vor, meint dort aber nie den
Produkt-Handle:

* Dateinamen `assets/scent-code.js`, `assets/scent-code-order.js`,
  `assets/section-scent-code.css`
* Snippets `scent-code-field`, `scent-code-map`, `scent-code-hit`
* Abschnitte `main-product-scent-code`, `scent-code-entry`
* Datenattribute `data-scent-code-*`
* **Theme-Vorlage** `templates/product.scent-code.json` und die Abfrage
  `template.suffix == 'scent-code'` in `snippets/meta-tags.liquid` — der
  Vorlagenname ist frei wählbar und unabhängig vom Handle. Umbenennen würde
  die Zuweisung im Adminbereich zerstören.

### Keine feste Variantennummer

Die Nummer kommt weiterhin aus dem Produkt selbst — bevorzugt aus dem
Metafeld `custom.hauptvariante`, sonst `selected_or_first_available_variant`.
Im Theme steht keine Variantennummer.

### Geprüft

Mit einem Produktindex nach Handle, der Shopifys Auflösung nachbildet: Steht
ein unbekannter Handle in der Einstellung, ist sie leer — genau wie im Shop.

| Einstellung | 1 | 71 | VC-71 | 250 |
| --- | --- | --- | --- | --- |
| `vent-celeste-scent-code` | VC-001 | VC-071 | VC-071 | VC-250 |
| `scent-code` (falsch) | VC-001 | VC-071 | VC-071 | VC-250 |
| leer | — | VC-071 | — | — |

In allen Fällen echte Variantennummer aus dem Produkt und
`properties[Scent Code]` korrekt gesetzt. Die Zuordnungstabelle nennt in
beiden Fällen `"fallback": "vent-celeste-scent-code"`.

Im Browser: Klick auf „Jetzt auswählen" ruft `/cart/add.js` mit der echten
Variantennummer auf, die Warenkorb-Lade öffnet, kein Seitenwechsel, kein
„Keine Treffer" daneben. Vier Codes ergeben vier eigene Positionen.

Startseite bei 390, 750, 990, 1280 und 1600 px unverändert.

---

## v4.2.14 — Scent Code direkt aus dem Suchtreffer in den Warenkorb

### Die Ursache

Der Treffer war ein Link auf `/products/scent-code?code=VC-001`. Den Code
verarbeitet dort aber nur der Abschnitt `main-product-scent-code`, und der
läuft ausschließlich über die Theme-Vorlage `product.scent-code`. Trägt das
Produkt im Adminbereich die normale Produktvorlage, wird `?code=` schlicht
ignoriert: Die Seite zeigt das Produkt ohne Code-Feld, die Positionsangabe
entsteht nie — der Code lässt sich nicht bestellen.

### Der Treffer legt jetzt selbst in den Warenkorb

Statt zu verlinken, ist der generische Treffer ein Formular auf
`routes.cart_add_url` mit der **echten** Variantennummer des Produkts —
bevorzugt aus dem Metafeld `custom.hauptvariante`, sonst
`selected_or_first_available_variant`. Es wird keine Nummer geraten und keine
fest eingetragen.

```
id       = <echte Variante des Produkts „VENT CELESTE Scent Code">
quantity = 1
properties[Scent Code] = VC-071
properties[_vc_code]   = VC-071
```

`cart-drawer.js` fängt jedes Formular auf `/cart/add` ohnehin ab: mit
JavaScript wird per AJAX hinzugefügt und die Warenkorb-Lade öffnet, ohne
JavaScript übernimmt Shopify und zeigt den Warenkorb. Damit hängt der
Bestellweg an keiner Theme-Vorlage mehr.

Ist die Variante nicht verfügbar oder kein Produkt hinterlegt, bleibt es beim
bisherigen Link — es entsteht keine Sackgasse.

Der Treffer nennt jetzt zusätzlich Ausführung und Preis, weil ein Klick
direkt in den Warenkorb führt:

```
VC-071
Extrait · 30 ml · 30 % · 30,00 €        JETZT AUSWÄHLEN
```

### „Keine Treffer" erscheint nicht mehr daneben

`main-search.liquid` und `predictive-search.liquid` erzeugten den Code-Treffer
und prüften unabhängig davon auf leere Ergebnisse. Beide erfassen den Treffer
jetzt zuerst in einer Variablen und blenden den Hinweis aus, wenn es ihn gibt.

### Gelistete Codes bleiben unberührt

Hat ein Code ein eigenes Produkt — VC-049, VC-040 —, führt der Treffer
weiterhin als Link auf dessen Produktseite. Nur Codes ohne eigenes Produkt
laufen über das zentrale Produkt.

### Geänderte Dateien

| Datei | Änderung |
| --- | --- |
| `snippets/scent-code-hit.liquid` | Formular mit echter Variantennummer und Positionsangabe statt Link |
| `sections/main-search.liquid` | Treffer erfassen, „Keine Treffer" nur ohne Treffer |
| `sections/predictive-search.liquid` | dieselbe Prüfung |
| `assets/base.css` | Darstellung des Treffer-Buttons, Titel und Zeile untereinander |

Nicht angefasst: Header, Menü, Produktdesign, Profilbalken, Warenkorbdesign,
Bestseller, Footer, `theme.js`, `cart-drawer.js`, `scent-code.js`. Die
Startseite misst bei 390, 750, 990, 1280 und 1600 px unverändert.

### Noch im Adminbereich nötig

Für den Weg über das **Eingabefeld im Hero** (nicht über die Suche) muss dem
Produkt „VENT CELESTE Scent Code" weiterhin die Theme-Vorlage
**`scent-code`** zugewiesen sein — Produkt öffnen, rechts unter
„Theme-Vorlage" auswählen. Ohne diese Zuweisung führt das Hero-Feld auf die
normale Produktseite ohne Code-Feld. Der Weg über die Suche funktioniert
unabhängig davon.

---

## v4.2.13 — Scent Codes ohne Obergrenze

Jede positive Nummer ist jetzt ein gültiger Scent Code. Unter 100 wird
dreistellig aufgefüllt, ab 100 bleibt die Nummer stehen:

```
1    → VC-001        130  → VC-130
71   → VC-071        1250 → VC-1250
99   → VC-099        9999 → VC-9999
```

Abgelehnt werden weiterhin `0`, `000`, negative Zahlen, Buchstaben und
alles Gemischte.

### Strengere Eingabeprüfung

Bisher wurden schlicht alle Nicht-Ziffern entfernt. Dadurch galt `a7b1` als
`VC-071` und `-5` als `VC-005`. Erlaubt ist jetzt ausschließlich: optionales
Präfix, danach nur Ziffern. Trennzeichen zählen nur nach dem Präfix —
`VC 071` ist ein Code, `1 2` nicht.

| Eingabe | vorher | jetzt |
| --- | --- | --- |
| `71`, `071`, `VC71`, `VC-71`, `vc071`, `VC 071` | VC-071 | VC-071 |
| `1250` | abgelehnt (über 130) | **VC-1250** |
| `131`, `999` | abgelehnt | **VC-131**, **VC-999** |
| `-5` | VC-005 | **abgelehnt** |
| `a7b1`, `71a` | VC-071 | **abgelehnt** |
| `1 2` | VC-012 | **abgelehnt** |
| `0`, `000`, `abc` | abgelehnt | abgelehnt |

### Die Einstellung „Höchste vergebene Nummer" ist entfernt

`scent_code_max` hätte die Grenze sonst weiter erzwungen und im Theme-Editor
etwas versprochen, das nicht mehr stimmt. Entfernt aus
`config/settings_schema.json`, `config/settings_data.json` (auch aus dem
Preset), `snippets/scent-code-map.liquid` und beiden Prüfpfaden.

Die Liste `valid_scent_codes` bleibt: Wird sie gefüllt, gilt weiterhin nur,
was darin steht. Leer bedeutet jetzt „jede positive Nummer".

### Beide Prüfpfade stimmen überein

Die Erkennung läuft an zwei Stellen — im Browser (`assets/scent-code.js`,
`assets/vc-search.js`) und serverseitig in Liquid für die Suchergebnisseite
ohne JavaScript (`snippets/scent-code-hit.liquid`). Beide wurden mit
denselben 31 Fällen geprüft und liefern identische Ergebnisse.

Zwei Fallstricke dabei:
* Liquid behandelt einen String aus reinen Leerzeichen als `blank` — `1 2`
  wäre durch die Ziffernprüfung gerutscht. Geprüft wird jetzt über die Länge.
* `'-5' | plus: 0` ergibt in Liquid `-5`, das Minuszeichen wurde vorher aber
  vorab entfernt. Trennzeichen werden jetzt nur noch nach einem erkannten
  Präfix entfernt.

### Geänderte Dateien

| Datei | Änderung |
| --- | --- |
| `assets/scent-code.js` | neues Muster, keine Obergrenze, `max` aus der Konfiguration |
| `assets/vc-search.js` | dieselbe Regel für die Suche |
| `snippets/scent-code-hit.liquid` | serverseitige Erkennung angeglichen |
| `snippets/scent-code-map.liquid` | `max` nicht mehr ausgegeben |
| `config/settings_schema.json` | `scent_code_max` entfernt, Hinweis bei `valid_scent_codes` |
| `config/settings_data.json` | gespeicherter Wert entfernt, auch im Preset |
| `locales/de.default.json`, `locales/en.json` | Fehlermeldung ohne Zahlenbereich |

Nicht angefasst: Layout, Design, Hero, Warenkorb, Bestellformular. Bei
990 px, 1280 px und 1600 px keine gemessene Layoutänderung.

---

## v4.2.12 — Suche und Duftberatung getrennt, Scent-Code-Bestellweg geprüft

Basis: `vent-celeste-v4-2-11-claude-mobile-final.zip`. Entwurf, nicht veröffentlicht.

### 1 · Suche und Duftberatung strikt getrennt

**Gefundene Ursache der überlagerten Suchansicht.** In V4.2.3 und V4.2.6 wurden
Warenkorb- und Menü-Drawer über den Abdunkler gehoben — `z-index: 2147483646`,
der Abdunkler selbst auf `2147483600`. Das Suchpanel blieb bei
`z-index: 70` und lag damit **unter** dem Abdunkler: Die Suche war sichtbar,
aber von der Verdunklungsschicht überzogen. Es bekommt jetzt dieselbe
Behandlung wie die beiden anderen Drawer — eigene Ebene, deckender Grund,
eigener Stapelkontext.

Gemessen: Panel `2147483646`, Abdunkler `2147483600`, Hintergrund
`rgb(245, 242, 237)` (voll deckend), jeder Prüfpunkt im Panel gehört zum Panel.

**Zweite Ursache: der Fokus.** `.drawer` blendet `visibility` über 420 ms ein.
Im ersten Frame steht der Wert daher noch auf `hidden` — genau dann ruft die
Fokusfalle `input.focus()` auf, und der Aufruf läuft ins Leere. Das Suchfeld
bekam deshalb nie den Fokus. Für `#SearchDrawer` steht `visibility` jetzt
nicht mehr in der Übergangsliste; der Fokus sitzt bei 390 px und 1280 px im
Suchfeld.

**Scent Code raus aus der Suche.** Das Suchpanel enthielt ein zweites
Scent-Code-Eingabefeld. Markup und die beiden Einstellungen
(`show_code_in_search`, `code_label`) sind entfernt. Die Lupe ist jetzt
ausschließlich Suche.

Auf dem Telefon bricht die Zeile jetzt um: Eingabefeld über die volle Breite,
darunter „Suchen" links und das Schließen-Kreuz rechts. Vorher lagen beide
außerhalb des Bildschirms.

### 2 · Scent-Code-Eingabe

* Platzhalter `047` → `071`
* Fehlertext: „Kein gültiger Scent Code. Bitte eine Nummer von 001 bis 130 eingeben, zum Beispiel 071."
* **Fehler im Bestellformular behoben:** `assets/scent-code-order.js` deklarierte
  `strings` zweimal. Die zweite Deklaration überschrieb
  `window.VCCodeOrderStrings`, wodurch die Meldung „Bitte gib deinen Scent Code
  ein." leer blieb. Die drei Variablen heißen jetzt `orderStrings`,
  `codeStrings` und `buttonStrings`.
* Auf der Bestellseite erscheint bei ungültiger Eingabe jetzt die Meldung im
  Feld selbst, nicht nur ein ausgegrauter Button.

### 3 · Bestellweg für nicht gelistete Düfte

Der Weg war bereits vorhanden und ist jetzt vollständig durchgeprüft. Das
generische Produkt hängt den Code als Positionsangabe an das native
Shopify-Formular:

```
id=9001  quantity=1
properties[Scent Code]=VC-071
properties[_vc_code]=VC-071
```

Drei verschiedene Codes ergeben drei verschiedene Eigenschaftssätze — Shopify
führt Positionen mit unterschiedlichen Properties nicht zusammen.

### 4 · Sprache vereinheitlicht

„Beratung starten", „Meinen Duft finden" und „Auf WhatsApp finden lassen"
heißen überall **„Duftberatung starten"**. Einzige Abweichung: die Floating-Bar
bleibt beim kürzeren „Duftberatung" — dort ist die Fläche zu schmal.

### 5 · Zwei Wege im Hero

Ohne neues Design, nur zwei Beschriftungen und eine kleine Zeile in der
vorhandenen Meta-Typografie:

```
NOCH KEINEN CODE?
[ DUFTBERATUNG STARTEN ]

CODE SCHON ERHALTEN? SCENT CODE EINGEBEN
VC- 071                        WEITER →
```

### Geänderte Dateien

| Datei | Änderung |
| --- | --- |
| `assets/base.css` | Block `#SearchDrawer`: eigene Ebene, deckender Grund, Fokus-Ursache, mobiler Zeilenumbruch |
| `assets/scent-code-order.js` | Variablenkonflikt behoben, Fehlermeldung im Feld |
| `assets/section-hero-v2.css` | Stil der Zeile „Noch keinen Code?" |
| `sections/header.liquid` | Scent-Code-Feld und zwei Einstellungen aus dem Suchpanel entfernt |
| `sections/header-group.json` | verwaiste Einstellungen entfernt |
| `sections/hero-v2.liquid` | optionale Zeile `whatsapp_hint` |
| `sections/launch-offer.liquid`, `main-product.liquid`, `main-product-scent-code.liquid`, `scent-code-entry.liquid`, `whatsapp-feature.liquid` | nur Standardbeschriftung des CTA |
| `locales/de.default.json`, `locales/en.json` | Platzhalter, Fehlertext |
| `templates/index.json`, `product.json`, `product.scent-code.json` | Beschriftungen, Hero-Texte |

Nicht angefasst: `theme.js`, `scent-code.js`, `vc-search.js`, Warenkorb-Drawer,
Warenkorb-Seite, Produktprofil-Balken, Duftnoten, Bestseller, Footer,
`settings_data.json`, `settings_schema.json`.

### Desktop

Bei 990 px, 1280 px und 1600 px zeigt der gerenderte Vergleich **keinen
einzigen** Unterschied. Bei 390 px und 750 px wächst allein der Hero um 22 px —
die neue Zeile „Noch keinen Code?".

---

## v4.2.11 — Mobile-Finalisierung

Basis: `vent-celeste-v4-2-10-final-cleanup.zip`. Nur CSS-Abstände und eine
Template-Änderung. **Kein Liquid, kein JavaScript, keine Locale- und keine
Config-Datei wurde angefasst.** Alle CSS-Blöcke stehen in
`@media (max-width: 749px)` — ab 750 px greift keine einzige neue Regel.

| Datei | Änderung |
| --- | --- |
| `assets/section-product-row.css` | Bestseller-Reihe: Karten `min(72vw, 320px)` → `min(62vw, 280px)`, Bildformat 3/4 → 4/5, `height: 100%` → `auto` innerhalb der Reihe, Kopfabstand 24 → 16 px, Bahn-Innenabstand 8 → 0, Punkte 16 → 12 px |
| `assets/section-scent-code.css` | Schritte: Überschriftabstand 24 → 16 px, Zeilen 16 → 12 px, CTA 24 → 16 px. Beratungsbereich: Bild-Mindesthöhe 26 → 21 rem, Innenabstand 48 → 32 px, Buttonabstand 32 → 24 px |
| `assets/section-editorial.css` | Bild/Text-Abstand 32 → 24 px, Merkmalsliste 24 → 16 px, Zeilen 12 → 8 px, Labelspalte 6 → 5,5 rem, Buttons 32 → 24 px, Newsletter-Formular 24 → 16 px |
| `assets/section-launch-offer.css` | Innenabstände 16 → 12 px, Abstand vor dem Button 16 → 12 px |
| `assets/base.css` | nur `.footer__top` und `.footer__bottom`: Abstand 48 → 32 px, Innenabstand 64 → 32 px bzw. 24 → 16 px |
| `templates/index.json` | Abschnitt `promise` („Das Prinzip") entfernt |

### Wirkung auf dem Telefon (390 px)

| Abschnitt | vorher | jetzt |
| --- | --- | --- |
| Bestseller | 647 px | 551 px |
| Fußbereich | 855 px | 743 px |
| 30 % Extrait | 864 px | 816 px |
| Über uns | 710 px | 694 px |
| So funktioniert's | 472 px | 432 px |
| Dein Duft ist nicht dabei? | 420 px | 380 px |
| Vorteil & Garantie | 523 px | 503 px |
| Das Prinzip | 514 px | entfällt |
| **Gesamte Seite** | **5832 px** | **4945 px** (−15 %) |

### Desktop

Bei 750 px, 990 px, 1280 px und 1600 px ist der einzige gemessene Unterschied
der entfernte Abschnitt „Das Prinzip". Jede andere Abschnittshöhe, die
Produktkarte und der Fußbereich sind identisch.

### Hinweis zum entfernten Abschnitt

„Das Prinzip" zeigte 30 ml, 30 % und **30,00 €**. Größe und Konzentration
stehen bereits im Extrait-Abschnitt, der Preis stand nur dort. Auf der
Startseite bleiben die echten Shop-Preise an den Bestseller-Karten sichtbar.
Der Abschnittstyp `brand-promise` bleibt im Theme und lässt sich im
Theme-Editor jederzeit wieder hinzufügen.

---

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

## v4.2.19 – Einheitliche Scent-Code-Suchergebnisse
- Direkte Code-Suchen (z. B. VC-001 und VC-049) verwenden jetzt dieselbe Ergebnisdarstellung.
- Doppelte Treffer bei gelisteten Codes entfernt.
- Suchformular wird bei einem eindeutigen direkten Code-Treffer ausgeblendet.
- Produktbild, Code, Ausführung, Preis und CTA kompakt in einem Ergebnisblock zusammengeführt.
- Bestehende Cart-API-Logik für nicht gelistete Scent Codes unverändert weiterverwendet.
- Neue Styles nur für den Suchergebnisbereich in `assets/section-search-results.css`.

## v4.2.20 – Search compact + product links
- Mobile direct-code results vertically compacted so media, code, facts, price and CTA fit much earlier in the viewport.
- Listed scent-code results now link to their real product page from both image and code title.
- Generic/private codes keep the working Cart API flow unchanged.

## v4.2.22 – Public product detection fix
- Direct Scent-Code search now checks the actual Shopify search products first.
- Listed codes such as VC-049 open their real product page and show “Produkt ansehen”.
- Private/advised codes such as VC-001 keep the direct Scent-Code add-to-cart flow.
- Generic Scent-Code product is resolved by its live handle first, preventing stale product references.
- Price rendering uses the live product/variant price more robustly.


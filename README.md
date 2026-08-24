# VENT CELESTE – Shopify Online Store 2.0 Theme

Ein eigenständiges Shopify-Theme für ein Sortiment von 120–130 Duftprofilen.
Warenkorb, Checkout, Bestellungen, Zahlungen, Bestand, Rabatte, Kundenkonten und
Versand bleiben vollständig bei Shopify – im Theme wird davon nichts nachgebaut.

> **Ausbaustand:** Ausbaustufe 1 (Fundament + Startseite) ist umgesetzt.
> Was fertig ist und was noch fehlt, steht in [Ausbaustand](#ausbaustand).
> Die Konzeptentscheidungen dahinter stehen in [`docs/00-KONZEPT.md`](docs/00-KONZEPT.md).

---

## Inhalt

1. [Setup in 10 Schritten](#setup-in-10-schritten)
2. [Empfohlene Produktstruktur](#empfohlene-produktstruktur)
3. [Metafeld-Liste](#metafeld-liste)
4. [Collections](#collections)
5. [Navigation](#navigation)
6. [Theme Settings](#theme-settings)
7. [Beispielprodukte](#beispielprodukte)
8. [Ausbaustand](#ausbaustand)
9. [Was ohne echten Shop nicht testbar ist](#was-ohne-echten-shop-nicht-testbar-ist)
10. [Rechtliches](#rechtliches)
11. [Entwicklung](#entwicklung)

---

## Setup in 10 Schritten

### 1. Shopify-Shop erstellen

Auf [shopify.com](https://www.shopify.com/de) einen Testzeitraum starten.
Ein regulärer Plan (Basic aufwärts) genügt – **Shopify Plus wird nicht benötigt**.
Unter *Einstellungen → Allgemein* Adresse, Zeitzone und Währung (EUR) setzen.

### 2. Theme hochladen

Den Ordner dieses Repositories als ZIP packen (siehe [Entwicklung](#entwicklung)) und unter
*Onlineshop → Themes → Theme hinzufügen → ZIP-Datei hochladen* einspielen.
Danach **Vorschau** wählen – noch nicht veröffentlichen.

Alternativ mit der Shopify CLI:

```bash
shopify theme dev --store deinshop.myshopify.com
```

### 3. Produkte anlegen oder importieren

Struktur siehe [Empfohlene Produktstruktur](#empfohlene-produktstruktur).
Für den Start reichen 8–12 Düfte. Der Import läuft über
*Produkte → Importieren* mit einer CSV nach dem Muster in
`docs/beispiel-produkte.csv`.

Wichtig für den deutschen Handel: In jeder Variante unter *Preise* die Felder für den
**Grundpreis** füllen (z. B. Inhalt 30, Einheit ml, Referenzmenge 100 ml).
Das Theme gibt den Grundpreis dann automatisch aus – ohne diese Angaben bleibt er leer.

### 4. Metafelder anlegen

*Einstellungen → Benutzerdefinierte Daten → Produkte → Definition hinzufügen.*
Alle Felder aus der [Metafeld-Liste](#metafeld-liste) anlegen.

Zwei Regeln:

- Bei allen `custom.*`-Feldern muss **Zugriff auf Storefronts aktiviert** sein,
  sonst kann das Theme sie nicht lesen.
- Bei `internal.referenz` und `internal.sortiments_id` muss der Storefront-Zugriff
  **deaktiviert bleiben**. Dann sind sie technisch weder im Theme noch über die
  Storefront-API lesbar und können nicht versehentlich veröffentlicht werden.

### 5. Collections anlegen

Siehe [Collections](#collections). Die Duftfamilien werden als **automatische**
Collections über Tag-Bedingungen gepflegt – neue Produkte landen dadurch von selbst
in der richtigen Duftwelt.

### 6. Filter einrichten (Search & Discovery)

Die kostenlose Erstanbieter-App **Shopify Search & Discovery** installieren
(*Apps → Shopify App Store*). Dort unter *Filters* je eine Filtergruppe aus diesen
Metafeldern anlegen:

`duftfamilie` · `charakter` · `intensitaet` · `jahreszeit` · `anlass` ·
`geschlecht` · `konzentration` · `linie` – dazu Preis und Verfügbarkeit.

Ohne diese App funktioniert der Shop weiterhin: Das Theme fällt dann auf die
Tag-URLs (`/collections/holzig/abend+intensiv`) zurück, die Shopify ohne jede App
unterstützt. Der Komfort ist allerdings deutlich geringer.

### 7. Navigation konfigurieren

*Onlineshop → Menüs.* Aufbau siehe [Navigation](#navigation).
Zusätzlich zum Hauptmenü ein Menü **Duftfamilien** anlegen und im Theme-Editor
unter *Kopfbereich → Duftfamilien im Menü* zuweisen.

### 8. Theme Settings setzen

Im Theme-Editor unter *Theme-Einstellungen*: Logo, Farben, Typografie, Buttons,
Kontaktdaten, Social Links. Details unter [Theme Settings](#theme-settings).

Die Startseite ist bereits vollständig vorkonfiguriert; im Editor müssen nur noch
Bilder, Collections und Links zugewiesen werden.

### 9. Versand und Zahlungen konfigurieren

*Einstellungen → Versand und Zustellung:* Versandzone Deutschland anlegen, Tarife
festlegen. Falls eine Freigrenze für kostenfreien Versand eingerichtet wird, danach
im Theme unter *Warenkorb* denselben Betrag eintragen und den Versandfortschritt
aktivieren – **er ist standardmäßig aus**, damit kein falscher Wert live geht.

*Einstellungen → Zahlungen:* Shopify Payments, PayPal, Klarna usw. aktivieren.
Das Theme zeigt im Fußbereich ausschließlich die tatsächlich aktivierten Zahlungsarten
und rendert Express-Buttons über die native Shopify-Ausgabe. Es ist nichts hart codiert.

### 10. Domain verbinden und Testbestellung

*Einstellungen → Domains.* Danach das Theme veröffentlichen und über
*Einstellungen → Zahlungen → Testmodus* (Shopify Payments) eine vollständige
Testbestellung durchführen. Dabei prüfen:

- Warenkorb, Cart Drawer und Checkout
- Bestellbestätigung per E-Mail
- Bestelldetails im Admin – insbesondere die Discovery-Set-Auswahl als
  Positionseigenschaften
- Grundpreis auf Produktseite und im Warenkorb

---

## Empfohlene Produktstruktur

**Empfehlung: Hybrid.** Die ausführliche Abwägung steht in `docs/00-KONZEPT.md`,
Abschnitt 3. Kurzfassung:

### Hauptlinie – ein Duft ist ein Produkt

| | |
|---|---|
| Titel | `No. 001` |
| Handle | `no-001` |
| Option 1 | `Ausführung` |
| Werte | `Extrait 30 ml` · `Eau de Parfum 30 ml` · `Travel 10 ml` · `Sample 2 ml` |

Bewusst **eine** Option statt zweier (Größe × Konzentration): Eine Matrix aus zwei
Optionen erzeugt unmögliche Kombinationen wie „Eau de Parfum 2 ml", die bei 130
Produkten einzeln gelöscht werden müssten. Eine kombinierte Option ergibt genau so
viele Varianten, wie es tatsächlich gibt.

Vorteile: eine starke URL pro Duft, Duftbeschreibung und Noten nur einmal gepflegt,
der Kunde vergleicht Ausführungen auf einer Seite.

**Kartenpreis:** Damit die Produktkarte nicht „ab 3,90 €" (Sample) zeigt, rendert das
Theme den Preis der Hauptvariante aus `custom.hauptvariante`. Ist keine gesetzt, wird
die erste verfügbare 30-ml-Variante genommen. „Ab"-Preise gibt das Theme nirgends aus.

### Essentials – eigene Produkte

Andere Rezeptur, anderes Preisniveau, eigene Markenerzählung, laut Briefing später
umbenennbar. Deshalb eigene Produkte, eigene Collection, eigenes Template,
Handle-Präfix `essentials-`, Metafeld `custom.linie = Essentials`.

### Discovery Set – eigenes Produkt

Ein Produkt, eine Variante, eigenes Template. Die fünf gewählten Düfte werden als
Positionseigenschaften übergeben (siehe `docs/00-KONZEPT.md`, Abschnitt 6).

### 2-ml-Samples

Existieren ausschließlich als Variante des jeweiligen Dufts, nicht als eigene Produkte.

---

## Metafeld-Liste

Alle Definitionen unter *Einstellungen → Benutzerdefinierte Daten → Produkte*.

### Öffentlich – Namespace `custom` (Storefront-Zugriff **aktiviert**)

| Key | Typ | Filter | Beispielwert |
|---|---|---|---|
| `duftfamilie` | Einzeiliger Text, Liste | ✅ | Holzig, Amber |
| `charakter` | Einzeiliger Text, Liste | ✅ | warm, trocken |
| `intensitaet` | Einzeiliger Text | ✅ | mittel |
| `jahreszeit` | Einzeiliger Text, Liste | ✅ | Herbst, Winter |
| `anlass` | Einzeiliger Text, Liste | ✅ | Abend, Date |
| `geschlecht` | Einzeiliger Text | ✅ | Unisex |
| `konzentration` | Einzeiliger Text, Liste | ✅ | Extrait |
| `konzentration_prozent` | Einzeiliger Text | – | 30 |
| `linie` | Einzeiliger Text | ✅ | Hauptlinie |
| `kopfnoten` | Einzeiliger Text, Liste | – | Bergamotte, Kardamom |
| `herznoten` | Einzeiliger Text, Liste | – | Iris, Zeder |
| `basisnoten` | Einzeiliger Text, Liste | – | Amber, Vanille |
| `duftbeschreibung` | Rich Text | – | redaktioneller Text |
| `sample_verfuegbar` | Wahr/Falsch | – | true |
| `travel_verfuegbar` | Wahr/Falsch | – | true |
| `bestseller` | Wahr/Falsch | – | false |
| `hauptvariante` | Produktvariante (Referenz) | – | Extrait 30 ml |
| `inci` | Mehrzeiliger Text | – | INCI-Liste |
| `allergene` | Mehrzeiliger Text | – | Deklarationspflichtige Stoffe |

### Intern – Namespace `internal` (Storefront-Zugriff **deaktiviert**)

| Key | Typ | Zweck |
|---|---|---|
| `referenz` | Einzeiliger Text | spätere Zuordnungsdaten |
| `sortiments_id` | Einzeiliger Text | interne Sortimentsnummer |

Diese beiden Felder sind für das Theme technisch unerreichbar und erscheinen unter
keinen Umständen im Frontend. Die markenrechtlich saubere Vergleichslösung wird
separat festgelegt – im Theme ist dafür nichts vorbereitet, was Fremdmarken ausgibt.

### Zusätzliche Tags (für automatische Collections)

Metafelder erzeugen benannte Filtergruppen, Tags nicht – Shopify fasst alle Tags in
**einer** Filtergruppe zusammen, was bei acht Filterachsen unbrauchbar ist. Umgekehrt
sind Tags in automatischen Collections und in Tag-URLs zuverlässiger. Deshalb werden
beide gepflegt; die Beispiel-CSV liefert die Tags bereits mit:

```
familie:holzig, familie:amber, charakter:warm, intensitaet:mittel,
jahreszeit:herbst, anlass:abend, geschlecht:unisex,
konzentration:extrait, linie:hauptlinie, bestseller
```

---

## Collections

| Handle | Typ | Bedingung |
|---|---|---|
| `alle-duefte` | automatisch | Tag enthält `linie:hauptlinie` |
| `extrait` | automatisch | Tag enthält `konzentration:extrait` |
| `eau-de-parfum` | automatisch | Tag enthält `konzentration:edp` |
| `travel-size` | automatisch | Tag enthält `travel` |
| `essentials` | automatisch | Tag enthält `linie:essentials` |
| `bestseller` | automatisch | Tag enthält `bestseller` |
| `neuheiten` | automatisch | Tag enthält `neu` |
| `discovery-set` | manuell | nur das Set |
| `samples` | automatisch | Tag enthält `sample` |
| Duftfamilien (12×) | automatisch | Tag enthält `familie:<name>` |

Duftfamilien: `frisch`, `zitrisch`, `fruchtig`, `floral`, `suess`, `gourmand`,
`holzig`, `wuerzig`, `amber`, `moschus`, `leder`, `oud`.

Jede Duftfamilie bekommt ein Bild und einen kurzen Beschreibungstext – daraus
speisen sich die „Duftwelten" auf der Startseite und im Mega-Menü.

---

## Navigation

**Hauptmenü** (`main-menu`):

```
Düfte
  Alle Düfte            /collections/alle-duefte
  Extrait               /collections/extrait
  Eau de Parfum         /collections/eau-de-parfum
  Travel Size           /collections/travel-size
  Essentials            /collections/essentials
Entdecken
  Discovery Set         /products/discovery-set
  Bestseller            /collections/bestseller
  Neuheiten             /collections/neuheiten
  Duftfinder            /pages/duftfinder
Vent Celeste
  Über uns              /pages/ueber-uns
  FAQ                   /pages/faq
  Kontakt               /pages/kontakt
```

Der Menüpunkt, unter dem die Duftfamilien im Mega-Menü erscheinen, ist im
Theme-Editor einstellbar (Standard: `Düfte`) und muss exakt dem Titel entsprechen.

**Menü `Duftfamilien`:** zwölf Einträge, jeweils auf die zugehörige Collection.

**Footer-Menüs:** `Service` (Kontakt, Versand, FAQ) und
`Rechtliches` (Impressum, Datenschutz, Widerruf, AGB).

---

## Theme Settings

Alles Folgende ist ohne Code änderbar:

| Gruppe | Enthält |
|---|---|
| Logo & Marke | Logo, Logobreiten, Wortmarke als Textlogo, Laufweite, Favicon |
| Farben | vier Farbschemata, je Section wählbar |
| Typografie | Schrift für Überschriften und Fließtext, Größen, Laufweiten |
| Layout & Form | Seitenbreite, Eckenradius (Standard 0), Linienstärke, Animationen |
| Buttons | Form, Versalien, Innenabstand |
| Produktkarten | Bildformat, Duftfamilie, Konzentration, Badges, Zweitbild |
| Warenkorb | Drawer oder Seite, Notizfeld, Versandfortschritt, Cross-Sell-Produkt |
| Suche | Sofortsuche an/aus, Platzhaltertext |
| Social Media | fünf Netzwerke |
| Kontakt & Firmendaten | Firmenname, Anschrift, USt-IdNr., E-Mail, Telefon (Platzhalter) |
| Rechtliche Hinweise | Steuerhinweis, Link zur Versandseite, Grundpreis an/aus |
| Bewertungen | Anzeige, sobald echte Daten vorliegen |

Ohne hochgeladenes Logo zeigt der Kopfbereich die Wortmarke als Text – das ist der
vorgesehene Platzhalter, kein Provisorium im Code.

---

## Beispielprodukte

`docs/beispiel-produkte.csv` enthält zehn Demo-Düfte (`No. 001` bis `No. 010`) mit
je vier Varianten, unterschiedlichen Duftfamilien, Noten und Metafeldern.

Alle Beispieldaten sind im Titel und in der Beschreibung als **DEMO** gekennzeichnet
und vor dem Livegang zu ersetzen. Es wurden bewusst keine 130 Produkte und keine
Fantasienamen erfunden; Fremdmarken kommen in keiner Form vor.

---

## Ausbaustand

### Ausbaustufe 1 – umgesetzt

| Bereich | Status |
|---|---|
| Theme-Struktur, Layout, alle Templates | ✅ vollständig, uploadfähig |
| Designsystem, vier Farbschemata, Typografie | ✅ vollständig aus Theme Settings |
| Kopfbereich, Mega-Menü, mobile Navigation | ✅ vollständig |
| Sofortsuche (Predictive Search) | ✅ nativ, mit Tastaturbedienung |
| Cart Drawer inkl. Positionseigenschaften | ✅ vollständig |
| Startseite mit elf Abschnitten | ✅ vollständig, im Editor sortierbar |
| Fußbereich, Kontaktformular, Newsletter | ✅ vollständig |
| Kundenkonto-Templates | ✅ vollständig |
| Produktseite | ⚙️ Basis: Galerie, Varianten, Menge, Warenkorb, Grundpreis, Sticky-Button |
| Collection | ⚙️ Basis: Raster, Sortierung, Paginierung |
| Barrierefreiheit, Performance, SEO-Grundlagen | ✅ umgesetzt |
| Locales de/en | ✅ 266 Schlüssel, vollständig deckungsgleich |

### Ausbaustufe 2 – noch offen

- Filterleiste mit acht Achsen plus mobiles Bottom-Sheet
- Produktseite vollständig: Duftpyramide, Charakter, Jahreszeit/Anlass,
  „Was bedeutet 30 % Extrait", Sample- und Travel-Block, Empfehlungen
- Duftfinder-Seite (Konzept steht, siehe `docs/00-KONZEPT.md` Abschnitt 5)
- Discovery-Set-Auswahl (Konzept steht, siehe Abschnitt 6)
- Bewertungsbereich, sobald eine Review-App Daten liefert
- Rechtsseiten mit Platzhalterinhalten, FAQ-Inhalte

### Bewusst nicht gebaut

- Keine Fake-Funktionalität: Kein Bereich zeigt einen Erfolgszustand, den es
  technisch nicht gibt.
- Keine erfundenen Bewertungen, Verkaufszahlen, Countdowns oder Verknappungen.
- Keine Fremdmarken, keine „Dupe von …"-Formulierungen, keine fremden Flakons.
- Keine eigene Checkout- oder Bestelllogik.

---

## Was ohne echten Shop nicht testbar ist

Diese Punkte konnten ohne Shopify-Store nicht abschließend geprüft werden und
gehören in die Testbestellung aus Schritt 10:

1. **Checkout und Zahlungen** – Express-Buttons, Klarna, Apple Pay hängen an der
   Shopify-Konfiguration.
2. **Filter** – die Filterausgabe entsteht erst, wenn Search & Discovery
   konfiguriert ist und Produkte mit Metafeldern existieren.
3. **Sofortsuche** – die Route `/search/suggest` liefert erst mit echten Produkten
   Ergebnisse.
4. **Grundpreis** – erscheint nur, wenn die Unit-Price-Felder je Variante gefüllt sind.
5. **Versandfortschritt** – muss manuell mit den echten Versandregeln abgeglichen werden.
6. **Zahlungsart-Icons** – zeigen nur die im Admin aktivierten Anbieter.
7. **Schriftarten** – `font_picker` lädt Shopify-gehostete Schriften; die Vorauswahl
   (Playfair Display / Assistant) ist ein Startpunkt und sollte zusammen mit dem
   finalen Logo entschieden werden.
8. **Kundenkonten** – Verhalten hängt davon ab, ob klassische oder neue
   Kundenkonten aktiviert sind.

---

## Rechtliches

Alle Firmenangaben sind Platzhalter: `[FIRMENNAME]`, `[ANSCHRIFT]`, `[UST-ID]`,
`[E-MAIL]`, `[TELEFON]`, `[ERREICHBARKEIT]`. Es wurden keine Daten erfunden.

Vor dem Livegang zu erstellen bzw. zu ersetzen:

- Impressum, Datenschutzerklärung, AGB, Widerrufsbelehrung, Versand, Kontakt
  (Template `page.rechtliches` markiert Seiten sichtbar als Platzhalter)
- Grundpreisangabe nach PAngV – im Theme umgesetzt, Daten müssen gepflegt werden
- Kosmetikangaben nach EU 1223/2009: INCI, Allergene, verantwortliche Person,
  Chargenkennzeichnung, CLP-Hinweise für alkoholbasierte Produkte
- Steuer- und Versandhinweis am Preis (im Theme vorhanden, Text und Link einstellbar)

Der Hinweis „Alle Firmenangaben sind Platzhalter" im Fußbereich lässt sich im
Theme-Editor abschalten, sobald echte Daten hinterlegt sind.

---

## Entwicklung

### Struktur

```
assets/      CSS und JavaScript (Vanilla, keine Bibliotheken)
config/      settings_schema.json, settings_data.json
layout/      theme.liquid, password.liquid
locales/     de.default.json, en.json
sections/    Sections und Section Groups
snippets/    wiederverwendbare Bausteine
templates/   JSON-Templates (OS 2.0) und Kundenkonto-Templates
docs/        Konzept und Beispieldaten
```

### Theme Check

```bash
gem install theme-check
theme-check .
```

Aktueller Stand: **0 Fehler, 0 Warnungen.** Es verbleiben sieben Hinweise der
Stufe *suggestion* (stilistische `{% liquid %}`-Empfehlungen sowie zwei
Falschmeldungen zu `loading`-Attributen, die bewusst dynamisch gesetzt sind).

### ZIP für den Upload erzeugen

```bash
zip -r vent-celeste-theme.zip . \
  -x ".git/*" ".github/*" "docs/*" "*.zip" ".theme-check.yml" "README.md"
```

Shopify erwartet die Theme-Ordner auf oberster Ebene des Archivs.

### Performance-Grundsätze

- Kein Framework, kein jQuery, keine externen Skripte
- JavaScript ausschließlich mit `defer`, Komponenten-Skripte nur dort, wo gebraucht
- Bilder über `image_url` mit `srcset`/`sizes`, feste Breite und Höhe,
  `loading="lazy"` unterhalb des Folds, `fetchpriority="high"` für das Hero-Bild
- Schriften über `font_picker` von der Shopify-CDN, keine Drittanbieter-Requests
- CSS-Tokens im `<head>`, Komponenten-CSS je Section

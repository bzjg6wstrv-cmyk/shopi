# VENT CELESTE — Shopify Online Store 2.0 Theme

Theme für ein Sortiment von 120–130 Duftprofilen.
Warenkorb, Checkout, Bestellungen, Zahlungen, Bestand, Rabatte, Kundenkonten und
Versand bleiben vollständig bei Shopify — davon wird im Theme nichts nachgebaut.
Kein Shopify Plus erforderlich.

Theme Check: **0 Fehler, 0 Warnungen** (9 stilistische Hinweise, siehe [Einschränkungen](#5-bekannte-einschränkungen-und-offene-punkte)).

---

## 1. Umgesetzte Funktionen

### Struktur und Design
- Vollständige OS-2.0-Struktur: `layout`, `templates` (JSON), `sections`, `snippets`, `assets`, `config`, `locales`
- Section Groups für Kopf- und Fußbereich, alle Startseiten-Abschnitte im Editor sortier- und abschaltbar
- Vier Farbschemata, je Section wählbar; Farben, Schriften, Buttons, Eckenradius und Seitenbreite vollständig über Theme Settings
- Logo austauschbar; ohne Logo erscheint die Wortmarke als Text (vorgesehener Platzhalter)
- Editorial-Ausrichtung: Eckenradius 0 als Standard, Haarlinien statt Karten, keine Schatten, keine Verläufe, asymmetrische Raster

### Navigation und Suche
- Mega-Menü mit eigener Spalte für die zwölf Duftfamilien und redaktioneller Fläche
- Eigenständige mobile Navigation: Suchfeld permanent sichtbar, Duftfamilien zweispaltig, 44-px-Touch-Targets
- Native Sofortsuche (`/search/suggest`) mit Gruppierung nach Düften, Duftwelten, Seiten und Suchbegriffen, Pfeiltastenbedienung
- Volle Suchergebnisseite mit Paginierung

### Sortiment und Filter
- Collection mit acht Filterachsen über Shopify Storefront Filtering, Sortierung, Paginierung
- Desktop-Filterleiste als Sidebar, mobil als Bottom-Sheet
- Aktive Filter als entfernbare Chips, Live-Aktualisierung über die Section Rendering API, Browser-Zurück funktioniert
- Ohne JavaScript bleibt die Filterung ein normales GET-Formular

### Produktseite
- Zweispaltig, Galerie links, Kaufbereich rechts, mobil Sticky Add-to-Cart
- Blockbasierter Inhaltsbereich, im Editor sortierbar: Duftprofil (Kopf/Herz/Basis), Charakter, Jahreszeit und Anlass, „Konzentration erklärt", Probe und Travel Size, Duftbeschreibung, Inhaltsstoffe, freie Textblöcke
- Fehlt ein Metafeld, entfällt der zugehörige Block ersatzlos — keine leeren Überschriften
- Probe (2 ml) und Travel (10 ml) als direkte Zusatzkäufe aus der Produktseite
- Empfehlungen über die native Product-Recommendations-API, nachgeladen
- Product-Schema (JSON-LD) je Variante mit Preis und Verfügbarkeit
- App-Blöcke (`@app`) zugelassen, damit eine Review-App sich einhängen kann

### Duftfinder
- Drei Fragen, im Editor frei änderbar (Frage, Antworten, Filterparameter)
- Antworten werden in echte Shopify-Filterparameter übersetzt; Ergebnis ist eine reguläre gefilterte Collection-Seite — teilbar, verlinkbar, weiter filterbar
- Vorabprüfung der Trefferzahl: Gibt es keine Treffer, wird die zuletzt gesetzte Filterachse gelöst und das dem Kunden gesagt. Es wird nie eine leere Seite als Erfolg gezeigt.
- Zwei Modi: Metafeld-Filter (empfohlen) oder Tag-URLs (funktioniert ohne App)
- Ohne JavaScript ein vollständig funktionierendes GET-Formular

### Discovery Set
- Auswahl von fünf Düften aus der gesamten Collection, mit Volltextsuche (Name, Duftfamilie, Noten) und Schnellfiltern nach Duftfamilie
- Angeboten werden nur Düfte, deren 2-ml-Probe verfügbar ist
- Auswahl-Anzeige mit fünf Slots, Absenden erst bei genau fünf Düften möglich
- Übergabe als **Positionseigenschaften** an das native Produktformular: sichtbar im Warenkorb, im Checkout, in der Bestellbestätigung, im Admin, auf dem Lieferschein und im Export
- Zusätzlich eine versteckte, maschinenlesbare Fassung (`_vc_handles`) für die Kommissionierung
- Lädt auch 130 Düfte vollständig (Liquid gibt je Schleife nur 50 Produkte aus; weitere Seiten kommen über die Section Rendering API)
- Vorbereitete, abschaltbare Hinweisbox für den späteren 10-€-Gutschein

### Warenkorb
- Cart Drawer über die Section Rendering API, Mengenänderung, Entfernen, Zwischensumme, Rabattzeilen
- Positionseigenschaften (Discovery-Set-Auswahl) werden angezeigt
- Ein dezenter Cross-Sell, ausblendbar; erscheint nicht, wenn das Produkt bereits im Warenkorb liegt
- Optionale Versandfortschrittsanzeige — **standardmäßig deaktiviert**
- Vollständige Warenkorbseite als Alternative zum Drawer

### Handelsrechtliches (Deutschland)
- Grundpreis nach PAngV über die nativen Unit-Price-Felder (Produktseite, Karte, Warenkorb)
- Steuer- und Versandhinweis am Preis, Text und Link einstellbar
- Firmendaten durchgängig als markierte Platzhalter
- Metafeld-Struktur für INCI, Allergene und Kosmetik-Pflichtangaben

### Weitere Seiten
- Startseite mit elf Abschnitten, Duftwelten als asymmetrische Editorial-Flächen
- FAQ mit Akkordeon, Kontaktformular (nativ), Rechtsseiten-Template mit Platzhalter-Kennzeichnung
- Kundenkonto: Anmelden, Registrieren, Konto, Bestellung, Adressen, Passwort zurücksetzen, Konto aktivieren
- Blog/Artikel, Alle-Collections, 404, Passwortseite, Geschenkgutschein

### Qualität
- **Performance:** kein Framework, kein jQuery, keine externen Skripte; alles `defer`; Komponenten-CSS und -JS nur dort, wo gebraucht; `image_url` mit `srcset`/`sizes`, feste Bildmaße, Lazy Loading unterhalb des Folds, `fetchpriority="high"` fürs Hero-Bild; Schriften über `font_picker` von der Shopify-CDN (keine Drittanbieter-Requests)
- **Barrierefreiheit:** Skip-Link, Fokusfalle in allen Drawern, Fokusrückgabe, sichtbare Fokusringe, semantische Überschriften, Formularlabels, ARIA nur wo nötig, `prefers-reduced-motion` respektiert
- **SEO:** saubere H-Struktur, Canonicals, Open Graph und Twitter Cards, Organization- und WebSite-Schema, Product- und Breadcrumb-Daten, Alt-Texte
- **Sprache:** `locales/de.default.json` und `locales/en.json`, vollständig deckungsgleich; keine sichtbaren Texte hart im Liquid

---

## 2. Verwendete Metafelder

Anzulegen unter *Einstellungen → Benutzerdefinierte Daten → Produkte*.

### Öffentlich — Namespace `custom`, Storefront-Zugriff **aktiviert**

| Key | Typ | Filter | Beispiel |
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

### Intern — Namespace `internal`, Storefront-Zugriff **deaktiviert**

| Key | Typ | Zweck |
|---|---|---|
| `referenz` | Einzeiliger Text | spätere Zuordnungsdaten |
| `sortiments_id` | Einzeiliger Text | interne Sortimentsnummer |

Ohne Storefront-Zugriff sind diese Felder für Liquid und die Storefront-API
technisch nicht lesbar und können nicht versehentlich veröffentlicht werden.

### Zusätzlich gelesen

- `reviews.rating` und `reviews.rating_count` — Standard-Metafelder gängiger Review-Apps.
  Liegen keine Daten vor, bleibt der Bewertungsbereich vollständig ausgeblendet.

### Tags (parallel zu den Metafeldern)

Metafelder erzeugen je Feld eine benannte Filtergruppe; Tags landen bei Shopify
alle in **einer** Gruppe und taugen bei acht Filterachsen nicht als Filter.
Umgekehrt sind Tags in automatischen Collections und Tag-URLs zuverlässiger.
Deshalb beides pflegen — die Beispiel-CSV liefert die Tags bereits mit:

```
familie:holzig · charakter:warm · intensitaet:mittel · jahreszeit:herbst
anlass:abend · geschlecht:unisex · konzentration:extrait · linie:hauptlinie
travel · sample · bestseller · neu
```

---

## 3. Benötigte Shopify-Apps

| App | Nötig? | Wofür |
|---|---|---|
| **Shopify Search & Discovery** (kostenlos, von Shopify, alle Pläne) | empfohlen | Die acht Filtergruppen und die bessere Sofortsuche. **Ohne die App funktioniert der Shop weiterhin**: Das Theme fällt auf Tag-URLs (`/collections/holzig/abend+intensiv`) zurück, und der Duftfinder kann auf den Tag-Modus umgestellt werden. |
| Review-App (Judge.me o. ä.) | optional | Bewertungen. Das Theme liest `reviews.rating`; ohne Daten bleibt der Bereich unsichtbar. Es werden keine Beispielbewertungen erzeugt. |
| Shopify Flow (kostenlos) | optional, später | Versand des 10-€-Gutscheins nach dem Kauf eines Discovery Sets. Der Rabatt selbst ist ein regulärer Shopify-Rabattcode — im Theme ist dafür nichts zu tun. |

**Keine weitere App wird vorausgesetzt.** Suche, Filter, Duftfinder, Discovery Set
und Warenkorb laufen über Shopify-Bordmittel. Kein Bestandteil benötigt Shopify Plus.

---

## 4. Einstellungen nach dem Upload

### 4.1 Theme hochladen
*Onlineshop → Themes → Theme hinzufügen → ZIP-Datei hochladen*, dann **Vorschau** —
noch nicht veröffentlichen.

### 4.2 Metafeld-Definitionen anlegen
Alle Felder aus [Abschnitt 2](#2-verwendete-metafelder). Storefront-Zugriff bei
`custom.*` **an**, bei `internal.*` **aus**.

### 4.3 Produkte anlegen
Empfohlene Struktur (ausführliche Begründung im separat mitgelieferten Konzeptdokument `00-KONZEPT.md`):

| Linie | Aufbau |
|---|---|
| Hauptlinie | Ein Duft = ein Produkt, **eine** Option `Ausführung` mit den Werten `Extrait 30 ml`, `Eau de Parfum 30 ml`, `Travel 10 ml`, `Sample 2 ml` |
| Essentials | Eigene Produkte (andere Rezeptur, eigenes Preisniveau, später umbenennbar), Handle-Präfix `essentials-` |
| Discovery Set | Eigenes Produkt, eine Variante |
| 2-ml-Proben | Nur als Variante des jeweiligen Dufts, keine eigenen Produkte |

Bewusst **eine** Option statt zweier (Größe × Konzentration): Eine Matrix erzeugt
unmögliche Kombinationen wie „Eau de Parfum 2 ml", die bei 130 Produkten einzeln
gelöscht werden müssten.

Import über *Produkte → Importieren* mit der separat mitgelieferten Vorlage
`beispiel-produkte.csv` (zwölf als DEMO gekennzeichnete Datensätze).

**Wichtig:** In jeder Variante unter *Preise* die Felder für den **Grundpreis**
füllen (z. B. Inhalt 30, Einheit ml, Referenzmenge 100 ml). Ohne diese Angaben
bleibt der PAngV-Grundpreis leer. Die CSV kann diese Felder nicht transportieren.

**Empfohlen:** Bei jedem Duft im Metafeld `custom.hauptvariante` die 30-ml-Extrait-Variante
setzen — sonst zeigt die Produktkarte unter Umständen den Probenpreis.

Die Variantennamen müssen die Erkennungswörter enthalten, nach denen das Theme sucht:
`sample` für die 2-ml-Probe (Theme-Setting *Discovery Set → Erkennungswort*) und
`travel` für die 10-ml-Variante (Blockeinstellung auf der Produktseite). Die
vorgeschlagenen Variantennamen erfüllen das bereits.

### 4.4 Collections anlegen

| Handle | Typ | Bedingung |
|---|---|---|
| `alle-duefte` | automatisch | Tag enthält `linie:hauptlinie` |
| `extrait` | automatisch | Tag enthält `konzentration:extrait` |
| `eau-de-parfum` | automatisch | Tag enthält `konzentration:edp` |
| `travel-size` | automatisch | Tag enthält `travel` |
| `essentials` | automatisch | Tag enthält `linie:essentials` |
| `bestseller` | automatisch | Tag enthält `bestseller` |
| `neuheiten` | automatisch | Tag enthält `neu` |
| `samples` | automatisch | Tag enthält `sample` |
| `discovery-set` | manuell | nur das Set |
| Duftfamilien (12×) | automatisch | Tag enthält `familie:<name>` |

Duftfamilien-Handles: `frisch`, `zitrisch`, `fruchtig`, `floral`, `suess`,
`gourmand`, `holzig`, `wuerzig`, `amber`, `moschus`, `leder`, `oud`.
Jeder Duftfamilie ein Bild und einen kurzen Text geben — daraus speisen sich
die Duftwelten auf der Startseite und im Mega-Menü.

### 4.5 Filter einrichten
In **Search & Discovery → Filters** je eine Filtergruppe aus den Metafeldern
`duftfamilie`, `charakter`, `intensitaet`, `jahreszeit`, `anlass`, `geschlecht`,
`konzentration`, `linie` — dazu Preis und Verfügbarkeit.

Danach im Duftfinder prüfen, dass die Parameternamen der Fragen zu den
eingerichteten Filtern passen (Standard: `filter.p.m.custom.duftfamilie`,
`filter.p.m.custom.anlass`, `filter.p.m.custom.intensitaet`).

### 4.6 Seiten anlegen

| Seite | Handle | Template |
|---|---|---|
| Duftfinder | `duftfinder` | `page.duftfinder` |
| FAQ | `faq` | `page.faq` |
| Kontakt | `kontakt` | `page.contact` |
| Über uns | `ueber-uns` | `page` |
| Impressum, Datenschutz, AGB, Widerruf, Versand | frei | `page.rechtliches` |

Template-Zuweisung rechts in der Seitenbearbeitung unter *Theme-Vorlage*.

### 4.7 Templates zuweisen
- Discovery-Set-Produkt → Vorlage `product.discovery-set`
- Essentials-Produkte → Vorlage `product.essentials`
- Duftfamilien-Collections → Vorlage `collection.duftfamilie`
- Essentials-Collection → Vorlage `collection.essentials`

### 4.8 Navigation
*Onlineshop → Menüs.*

```
main-menu                          duftfamilien
  Düfte                              Frisch … Oud (12 Einträge)
    Alle Düfte /collections/alle-duefte
    Extrait /collections/extrait     footer-service
    Eau de Parfum /collections/eau-de-parfum   Kontakt, Versand, FAQ
    Travel Size /collections/travel-size
    Essentials /collections/essentials         footer-rechtliches
  Entdecken                                    Impressum, Datenschutz,
    Discovery Set /products/discovery-set      Widerruf, AGB
    Bestseller /collections/bestseller
    Neuheiten /collections/neuheiten
    Duftfinder /pages/duftfinder
  Vent Celeste
    Über uns /pages/ueber-uns
    FAQ /pages/faq
    Kontakt /pages/kontakt
```

Das Menü `duftfamilien` im Theme-Editor unter *Kopfbereich → Duftfamilien im Menü* zuweisen.
Der Menüpunkt, unter dem die Familien erscheinen, ist einstellbar (Standard `Düfte`)
und muss **exakt** dem Titel des Menüpunkts entsprechen.

### 4.9 Theme Settings
Logo, Farben, Typografie, Buttons, Produktkarten, Kontaktdaten, Social Links.
Auf der Startseite anschließend Bilder für Hero, Duftwelten und Editorial-Abschnitte
zuweisen — die Links sind bereits voreingestellt.

Unter *Warenkorb* das Cross-Sell-Produkt prüfen (voreingestellt: `discovery-set`).

### 4.10 Versand und Zahlungen
*Einstellungen → Versand und Zustellung:* Zone Deutschland, Tarife.
Falls eine Freigrenze eingerichtet wird, denselben Betrag im Theme unter
*Warenkorb → Versandfortschritt* eintragen und die Anzeige **erst dann** aktivieren.

*Einstellungen → Zahlungen:* Anbieter aktivieren. Das Theme zeigt ausschließlich
die tatsächlich aktivierten Zahlungsarten und rendert Express-Buttons nativ.

### 4.11 Rechtstexte einsetzen
Alle Platzhalter ersetzen: `[FIRMENNAME]`, `[ANSCHRIFT]`, `[UST-ID]`, `[E-MAIL]`,
`[TELEFON]`, `[ERREICHBARKEIT]`. Danach im Fußbereich den Hinweis
„Alle Firmenangaben sind Platzhalter" abschalten und bei den Rechtsseiten
die Platzhalter-Kennzeichnung deaktivieren.

### 4.12 Domain, Veröffentlichen, Testbestellung
Domain verbinden, Theme veröffentlichen, dann im Testmodus eine vollständige
Bestellung durchführen und prüfen: Cart Drawer, Checkout, Bestellbestätigung,
**Discovery-Set-Auswahl in den Bestelldetails**, Grundpreis, Filter, Sofortsuche.

---

## 5. Bekannte Einschränkungen und offene Punkte

### Technische Grenzen

1. **Probenbestand im Discovery Set wird nicht gebucht.** Gebucht wird der Bestand
   des Set-Produkts. Angeboten werden nur Düfte, deren Probe beim Seitenaufbau
   verfügbar ist — reserviert wird sie nicht. Eine exakte Bestandsführung je Probe
   erfordert eine Cart-Transform-Function und damit eine eigene App (kein Plus nötig,
   aber ein Entwicklungsprojekt).
2. **Keine serverseitige Prüfung „genau fünf Düfte".** Die Prüfung erfolgt im Browser.
   Ein manipuliertes Formular könnte weniger senden. Serverseitig ginge das nur mit
   einer Cart-Validation-Function, also ebenfalls einer eigenen App.
3. **Das Discovery Set benötigt JavaScript.** Ohne JavaScript wird das offen
   ausgewiesen und das Formular gar nicht erst angezeigt — statt eines Auswahl-UIs,
   das nichts überträgt.
4. **Filter benötigen Search & Discovery.** Ohne die App zeigt die Filterleiste einen
   Hinweis statt einer leeren Fläche; gefiltert wird dann über Tag-URLs.
5. **Der Versandfortschritt kennt die echten Versandregeln nicht.** Der Wert ist ein
   Theme-Setting und muss manuell mit den Versandeinstellungen übereinstimmen.
   Deshalb standardmäßig deaktiviert.
6. **Grundpreis nur mit gepflegten Daten.** Er erscheint erst, wenn die
   Unit-Price-Felder je Variante im Admin gefüllt sind; per CSV ist das nicht möglich.
7. **Checkout-Gestaltung ist begrenzt.** Logo, Farben und Schrift über
   Checkout-Branding; eigene Checkout-Schritte oder `checkout.liquid` wären Plus
   und werden nicht verwendet. Die Danke-Seite ist ohne Plus nicht frei gestaltbar —
   der geplante 10-€-Gutschein muss deshalb per E-Mail zugestellt werden.
8. **Liquid gibt je Schleife höchstens 50 Produkte aus.** Im Discovery Set werden
   weitere Seiten über die Section Rendering API nachgeladen; bei sehr großen
   Collections dauert der vollständige Aufbau der Auswahlliste einen Moment.

### Ohne echten Shop nicht abschließend testbar

Checkout und Zahlungen · Filterausgabe (entsteht erst mit konfigurierter App und
echten Metafeldern) · Sofortsuche · Produktempfehlungen (Shopify braucht Verkaufsdaten) ·
Grundpreis · Zahlungsart-Icons · Kundenkonten (klassisch vs. neu) ·
Nachladen der Discovery-Auswahl über 50 Produkte hinaus.

### Inhaltlich offen

- **Logo und finale Markenfarben** — Theme ist darauf ausgelegt, beides ohne Code zu ändern.
  Die Schriftpaarung (Playfair Display / Assistant) ist ein Startpunkt und sollte
  zusammen mit dem Logo entschieden werden.
- **Rechtstexte** — Impressum, Datenschutz, AGB, Widerruf, Versand: nur Struktur und
  markierte Platzhalter, es wurden keine Daten erfunden.
- **Kosmetikangaben** nach EU 1223/2009: INCI, Allergene, verantwortliche Person,
  Chargenkennzeichnung, CLP-Hinweise für alkoholbasierte Produkte. Metafelder und
  Anzeigeblock sind vorhanden, die Inhalte muss die Marke stellen.
- **Über uns** — bewusst als Mustertext gekennzeichnet, keine erfundene Gründungsgeschichte.
- **Produktbilder** — Demo-Platzhalter; das Theme übernimmt echte Fotos ohne Anpassung.
- **Englische Storefront** — Locale ist vollständig vorbereitet, die Aktivierung
  erfolgt über Shopify Markets, sobald die Endtexte feststehen.

### Bewusst nicht gebaut

Keine erfundenen Bewertungen, Verkaufszahlen, Countdowns oder Verknappungen ·
keine Fremdmarken, keine „Dupe von …"-Formulierungen, keine fremden Flakons ·
keine eigene Checkout- oder Bestelllogik · kein Bereich, der einen Erfolgszustand
zeigt, den es technisch nicht gibt.

### Theme Check

`theme-check .` meldet 0 Fehler und 0 Warnungen. Es verbleiben neun Hinweise der
Stufe *suggestion*: stilistische `{% liquid %}`-Empfehlungen sowie zwei
Falschmeldungen zu `loading`-Attributen, die bewusst dynamisch gesetzt sind.

---

## Struktur

```
assets/      CSS und JavaScript (Vanilla, keine Bibliotheken)
config/      settings_schema.json, settings_data.json
layout/      theme.liquid, password.liquid
locales/     de.default.json, en.json
sections/    Sections und Section Groups
snippets/    wiederverwendbare Bausteine
templates/   JSON-Templates und Kundenkonto-Templates
```

ZIP für den Upload neu erzeugen:

```bash
zip -r vent-celeste-theme.zip assets config layout locales sections snippets templates README.md
```

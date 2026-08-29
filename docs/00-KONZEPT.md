# VENT CELESTE — Konzept vor der Umsetzung

Status: **Entwurf zur Freigabe.** Es wurde noch kein Theme-Code geschrieben.
Alle Preise, Firmendaten und Produktnamen in diesem Dokument sind Musterdaten.

---

## 1. Geplante Seitenstruktur (Informationsarchitektur)

### 1.1 Leitgedanke

Die zentrale UX-Frage lautet: *Findet ein Kunde bei 120–130 Düften schnell einen passenden Duft?*
Daraus folgt: Es gibt **drei parallele Einstiege**, nicht einen. Jeder Kundentyp bekommt seinen Weg.

| Kundentyp | Einstieg | Weg |
|---|---|---|
| „Ich weiß, was ich suche" | Suche (Predictive Search) | Nummer, Duftfamilie, Note eintippen |
| „Ich weiß ungefähr, was ich mag" | Filter auf Collection | Duftfamilie → Charakter → Anlass |
| „Ich habe keine Ahnung" | Duftfinder + Discovery Set | 3 Fragen → gefilterte Auswahl → 5 Proben testen |

Das Discovery Set ist bei 120+ Profilen kein Zusatzprodukt, sondern die **Risikobrücke** und damit
das wichtigste Conversion-Element der Seite.

### 1.2 Navigation

**Hauptnavigation (Desktop, 3 Menüpunkte + Utility rechts)**

```
DÜFTE ▾            ENTDECKEN ▾          VENT CELESTE ▾        [Suche] [Konto] [Warenkorb]
 Alle Düfte         Discovery Set        Über uns
 Extrait            Bestseller           FAQ
 Eau de Parfum      Neuheiten            Kontakt
 Travel Size        Duftfinder
 Essentials
```

Das Mega-Menü unter „DÜFTE" zeigt zusätzlich in einer zweiten Spalte die **12 Duftfamilien**
als Textliste (kein Icon-Raster) und rechts eine großformatige redaktionelle Fläche
(z. B. „Discovery Set — Fünf Düfte kennenlernen"). So sind die Duftfamilien schon in der
Navigation ein Sortiments-Einstieg, nicht erst auf der Startseite.

**Mobile** ist kein verkleinertes Desktop-Menü:
- Suche liegt als eigenes, permanent sichtbares Feld **oben im Drawer**, nicht hinter einem Icon
- Duftfamilien als erste Ebene, Zwei-Spalten-Textliste, 48 px Touch-Targets
- „Duftfinder" und „Discovery Set" als abgesetzte Blöcke am Ende des Drawers
- Sticky Bottom-Bar auf Produktseiten (Preis + Variante + In den Warenkorb)

### 1.3 Templates (Online Store 2.0, JSON)

```
templates/
  index.json                        Startseite
  collection.json                   Standard-Collection mit Filtern
  collection.duftfamilie.json       Alternate: Duftfamilien-Landingpage (Editorial-Header)
  collection.essentials.json        Alternate: eigene Anmutung Einstiegslinie
  product.json                      Standard-Duft (Hauptlinie)
  product.discovery-set.json        Alternate: 5-aus-N-Auswahl
  product.essentials.json           Alternate: reduzierte Einstiegslinie
  page.json                         Standardseite
  page.duftfinder.json              Duftfinder
  page.faq.json                     FAQ mit Akkordeon
  page.contact.json                 Kontaktformular (Shopify-nativ)
  page.rechtliches.json             Layout für Impressum/AGB/Widerruf/Datenschutz
  search.json                       Suchergebnisse mit Filtern
  cart.json                         Vollseiten-Warenkorb (Fallback zum Drawer)
  list-collections.json             Übersicht aller Duftwelten
  blog.json / article.json          Journal (V2, Template liegt bereit)
  404.json
  password.json
  gift_card.liquid
  customers/  login, register, account, order, addresses,
              reset_password, activate_account
```

### 1.4 Startseiten-Reihenfolge

1. **Hero** — Wortmarke, ein Satz Markenbotschaft, CTA „Düfte entdecken", sekundär „Discovery Set"
2. **Markenversprechen** — drei knappe Aussagen (30 % Extrait · 30 ml · 29,90 €), als ruhige
   Typo-Zeile mit Haarlinien, ausdrücklich nicht als Preis-Banner
3. **Bestseller** — 4–6 echte Produkte aus einer Shopify-Collection
4. **Duftwelten** — 6 großflächige Editorial-Kacheln (Frisch, Gourmand, Holzig, Amber, Floral, Oud),
   asymmetrisches Raster, keine gleichförmige 3er-Kartenwand
5. **Discovery Set** — prominenter, zweispaltiger Abschnitt
6. **Extrait erklärt** — was 30 % Konzentration bedeutet, sachlich
7. **Travel Size 10 ml** — kompakter, schmaler Abschnitt
8. **Duftfinder** — visueller Einstieg mit den drei Fragen als Vorschau
9. **Essentials** — erst hier, eigene visuelle Sprache, klar als Alltagslinie
10. **Über VENT CELESTE** — als Platzhaltertext gekennzeichnet
11. **Newsletter** — zurückhaltend, kein Pop-up
12. **Footer**

Alle Abschnitte sind Sections und im Theme-Editor sortier- und abschaltbar.

---

## 2. Designrichtung

### 2.1 Farbe (alles als Theme Setting, nichts hart im Code)

| Rolle | Muster | Einsatz |
|---|---|---|
| Ivory / Papier | `#F5F2ED` | Grundfläche |
| Ivory tief | `#EBE6DE` | abgesetzte Abschnitte |
| Tinte | `#141210` | Text, Buttons, warmes Tiefschwarz statt `#000` |
| Stein / Taupe | `#8C8375` | Sekundärtext, Haarlinien, Meta |
| Champagne | `#C3AC82` | ausschließlich Akzent: Fokusring, aktiver Filter, feine Trennlinie |

Champagne wird nie als Fläche und nie als Verlauf verwendet. Kein Schwarz-Gold, kein Marmor.
Farbschemata werden über Shopify `color_scheme_group` gelöst, damit jede Section ihr Schema
im Editor wählen kann.

### 2.2 Typografie

- `font_picker` (Shopify-gehostet, keine externen Requests, kein Google-Fonts-Aufruf)
- Überschriften: Serif mit redaktionellem Charakter, große Zeilenhöhe, leicht negatives Tracking
- Fließtext: neutrale Grotesk, 16–17 px, Zeilenlänge max. 68 Zeichen
- Detailtypografie: Versalien, `letter-spacing: .12em`, 11–12 px für Meta-Angaben
  („EXTRAIT · 30 % · 30 ML") — das ist der eigentliche Luxus-Träger, nicht Gold
- Zwei Schriftschnitte werden per `preload` geladen, sonst nichts

### 2.3 Regeln, die die Seite von einer typischen AI-Website unterscheiden

- **Radius 0** als Default (Setting vorhanden, aber auf 0 gesetzt) — keine Karten-Optik
- Keine Schatten, keine Verläufe, kein Glasmorphismus
- Trennung durch **1 px Haarlinien** und Weißraum, nicht durch Boxen
- Kein Icon-Set in Marketing-Sections; Icons nur funktional (Suche, Warenkorb, Schließen)
- Asymmetrie: Abschnitte wechseln bewusst zwischen 5/7-, 6/6- und vollflächigem Raster
- Bewegung: 160–240 ms, nur `opacity`/`transform`, ein einziges Easing,
  vollständig deaktiviert unter `prefers-reduced-motion`
- Ein 8-px-Spacing-System, vertikaler Rhythmus mit sehr großen Abständen (96–160 px Desktop)

### 2.4 Produktkarte

```
[Bild 3:4, ruhig, Ivory-Hintergrund]

NO. 001
Holzig · Amber · Warm
Extrait · 30 %
29,90 €
```

Nur diese vier Zeilen. Badge „Bestseller"/„Neu" nur, wenn Tag bzw. Metafield real gesetzt ist.
Keine Sterne ohne Review-App, keine Verkaufszahlen, keine Countdown-Elemente.

---

## 3. Empfohlenes Shopify-Produkt-/Variantenmodell

### 3.1 Die Modelle

**Modell A** — Ein Duft = ein Produkt, Verkaufsformen als Varianten
**Modell B** — Jede Linie/Größe ein eigenes Produkt

### 3.2 Bewertung

| Kriterium | Modell A (Varianten) | Modell B (Einzelprodukte) |
|---|---|---|
| Anzahl Produkte bei 130 Düften | ~130 | ~400–520 |
| Shopify-Variantenlimit | 4 Varianten/Produkt — unkritisch | unkritisch |
| Lagerverwaltung | 4 SKUs pro Produkt, eine Zeile im Bestand | 4 Produkte, verstreut |
| SEO | **eine starke URL pro Duft**, alle Signale gebündelt | 4 dünne, konkurrierende Seiten pro Duft (Keyword-Kannibalisierung) |
| Filter (Search & Discovery) | Konzentration/Größe als Options-Filter (`filter.v.option.*`) möglich | Filter über Produkt-Metafeld, ebenfalls möglich |
| Produktseite | eine Seite, Kunde vergleicht Extrait/EDP/Travel/Sample direkt | Kunde muss zwischen Seiten springen, Absprungrisiko |
| URLs | `/products/no-001` — sauber, dauerhaft | `/products/no-001-extrait-30ml` usw. |
| CSV-Import | 4 Zeilen pro Duft, `Handle` wiederholt — Standardfall | 4 Zeilen mit je vollständigen Produktdaten, 4× Pflegeaufwand |
| Pflege bei 130 Profilen | Duftbeschreibung/Noten **einmal** gepflegt | Beschreibung 4× redundant, driftet auseinander |
| Discovery Set | Sample-Variante direkt referenzierbar | zusätzliche 130 Sample-Produkte |
| Essentials (andere Rezeptur) | ⚠️ würde Rezeptur-Grenze verwischen | ✅ saubere Trennung |

**Bekannte Schwäche von Modell A:** Die Produktkarte zeigt bei Varianten von Haus aus
„ab 3,90 €" (Sample) — das entwertet die Marke sofort. **Lösung im Theme:** Die Karte rendert
nicht `price_min`, sondern den Preis der als Hauptvariante gekennzeichneten Ausführung
(Metafeld `custom.hauptvariante`, Fallback: erste verfügbare 30-ml-Variante). „Ab"-Preise
werden im gesamten Theme unterdrückt.

### 3.3 Empfehlung: Hybrid

- **Hauptlinie → Modell A.** Ein Duft = ein Produkt mit **einer** Option
  `Ausführung` und den Werten:
  `Extrait 30 ml` · `Eau de Parfum 30 ml` · `Travel 10 ml` · `Sample 2 ml`

  Bewusst **eine** Option statt zwei (Größe × Konzentration): Eine 2-Options-Matrix erzeugt
  unmögliche Kombinationen (z. B. „EDP 2 ml"), die manuell gelöscht werden müssten —
  bei 130 Produkten eine Fehlerquelle. Eine kombinierte Option ergibt genau 4 saubere Varianten,
  und ein Duft, den es nur als Extrait gibt, hat schlicht eine Variante.

- **Essentials → Modell B.** Eigene Produkte, eigene Collection, eigenes Template,
  eigener Handle-Präfix. Begründung: andere Rezeptur, anderes Preisniveau, andere
  Markenerzählung — und die Linie muss laut Briefing später leicht umbenennbar sein.
  Als Variante der Hauptlinie wäre beides unmöglich.

- **Discovery Set → eigenes Produkt** mit eigenem Template (siehe Abschnitt 6).

- **2-ml-Samples** existieren nur als Variante des jeweiligen Dufts, nicht als eigene Produkte.

### 3.4 Deutsche Pflichtangaben (nicht optional)

Das Theme rendert zusätzlich, weil Shopify das nicht von allein tut:
- **Grundpreis nach PAngV** (z. B. „99,67 € / 100 ml") über Shopifys native Unit-Price-Felder
  (`variant.unit_price`, `unit_price_measurement`) — je Variante korrekt, nicht gerechnet im Theme
- „inkl. MwSt., zzgl. [Versandkosten]" mit Link zur Versandseite
- Platzhalter-Struktur für Kosmetikangaben: INCI, Allergene, Chargenhinweis, CLP-Hinweise
  (alkoholbasiert = entzündbar), verantwortliche Person nach EU 1223/2009 —
  als Metafelder und Akkordeon-Block, befüllt mit klar markierten Platzhaltern

---

## 4. Metafield-Modell

Namespace `custom` (im Admin bequem pflegbar, Storefront-Zugriff aktiv, filterbar)
für alles Öffentliche — Namespace `internal` **ohne Storefront-Zugriff** für Interna.
Das ist der entscheidende Punkt: Ohne Storefront-Access ist die interne Referenz
für Liquid und die Storefront-API technisch **nicht lesbar**, kann also auch nicht
versehentlich ausgegeben werden. Reines „im Theme nicht ausgeben" wäre schwächer.

### 4.1 Produkt-Metafelder

| Key | Typ | Filter | Zweck |
|---|---|---|---|
| `custom.duftfamilie` | `list.single_line_text_field` | ✅ | Frisch, Zitrisch, Fruchtig, Floral, Süß, Gourmand, Holzig, Würzig, Amber, Moschus, Leder, Oud |
| `custom.charakter` | `list.single_line_text_field` | ✅ | frisch, süß, dunkel, warm, cremig, trocken, elegant, intensiv |
| `custom.intensitaet` | `single_line_text_field` | ✅ | leicht / mittel / intensiv |
| `custom.jahreszeit` | `list.single_line_text_field` | ✅ | Frühling / Sommer / Herbst / Winter |
| `custom.anlass` | `list.single_line_text_field` | ✅ | Alltag / Büro / Abend / Date / Anlass |
| `custom.geschlecht` | `single_line_text_field` | ✅ | Unisex / Damen / Herren |
| `custom.konzentration` | `list.single_line_text_field` | ✅ | Extrait / Eau de Parfum (Produktebene, da ein Duft beides führen kann) |
| `custom.linie` | `single_line_text_field` | ✅ | Hauptlinie / Essentials |
| `custom.kopfnoten` | `list.single_line_text_field` | – | Duftpyramide |
| `custom.herznoten` | `list.single_line_text_field` | – | |
| `custom.basisnoten` | `list.single_line_text_field` | – | |
| `custom.duftbeschreibung` | `rich_text_field` | – | redaktionelle Beschreibung |
| `custom.sample_verfuegbar` | `boolean` | – | steuert Sample-Block + Discovery-Auswahl |
| `custom.travel_verfuegbar` | `boolean` | – | steuert Travel-Block |
| `custom.bestseller` | `boolean` | – | Badge; zusätzlich Collection-basiert möglich |
| `custom.hauptvariante` | `variant_reference` | – | welche Ausführung Preis/Bild auf der Karte bestimmt |
| `custom.inci` | `multi_line_text_field` | – | Kosmetikangaben |
| `custom.allergene` | `multi_line_text_field` | – | |
| **`internal.referenz`** | `single_line_text_field` | – | **Storefront-Zugriff AUS** — spätere Zuordnungsdaten |
| **`internal.sortiments_id`** | `single_line_text_field` | – | **Storefront-Zugriff AUS** |

### 4.2 Tags zusätzlich zu Metafeldern

Metafelder erzeugen in Search & Discovery **je Feld eine eigene, benannte Filtergruppe**
(„Duftfamilie", „Anlass" …). Tags landen dagegen alle in **einer** Gruppe „Tags" — bei acht
Filterachsen unbrauchbar. Deshalb: Metafelder für Filter.

Tags werden trotzdem gespiegelt (`familie:holzig`, `anlass:abend`, …), weil:
1. automatische Collections zuverlässig über Tag-Bedingungen funktionieren
2. die URL-Syntax `/collections/holzig/abend+intensiv` **ohne jede App** filtert —
   das ist unser Fallback, falls Search & Discovery nicht installiert wird

Der doppelte Pflegeaufwand entsteht nur beim CSV-Import und wird dort automatisch mitgeliefert.

### 4.3 Duftfamilien als Collections

Die 12 Duftfamilien werden **automatische Collections** (Bedingung: Tag = `familie:holzig`).
Vorteil gegenüber reinen Filterwerten: eigenes Bild, eigener Beschreibungstext, eigene URL,
eigene Meta-Description, SEO-fähig — genau das, was die „Duftwelten"-Flächen auf der Startseite
und das Mega-Menü brauchen.

---

## 5. Technische Lösung Duftfinder

### 5.1 Prinzip

Der Duftfinder ist **keine Simulation**. Er sammelt drei Antworten und übersetzt sie in eine
echte, gefilterte Shopify-Collection-URL. Ergebnis ist eine reguläre Collection-Seite —
teilbar, bookmarkbar, indexierbar, mit allen normalen Filtern weiter verfeinerbar.

```
Schritt 1  Richtung?      → custom.duftfamilie
Schritt 2  Wann tragen?   → custom.anlass  +  custom.jahreszeit
Schritt 3  Wie intensiv?  → custom.intensitaet

Ergebnis-URL:
/collections/alle-duefte
  ?filter.p.m.custom.duftfamilie=Holzig
  &filter.p.m.custom.anlass=Abend
  &filter.p.m.custom.intensitaet=mittel
```

- Reines Vanilla JS, ca. 3–4 KB, kein Framework, keine externe App
- Zwischenstand in `sessionStorage` + im URL-Hash → Zurück-Button funktioniert, Link teilbar
- Fragen, Antwortoptionen und deren Filter-Mapping stehen komplett im **Section-Schema**,
  sind also im Theme-Editor ohne Code änderbar
- Funktioniert vollständig ohne JavaScript: Jede Antwort ist ein echter `<a href>` auf die
  jeweils weiter gefilterte URL (Progressive Enhancement)

### 5.2 Umgang mit „0 Treffer" — kein falscher Erfolgszustand

Vor der Weiterleitung wird das Ergebnis per **Section Rendering API**
(`?section_id=…` + Filterparameter) geholt und die Trefferzahl gelesen.
Bei 0 Treffern wird die zuletzt gesetzte, unwichtigste Filterachse gelöst und dem Kunden
ehrlich gesagt: „Keine exakte Übereinstimmung — wir zeigen dir die nächstliegenden Düfte."
Es wird nie eine leere Ergebnisseite als Erfolg präsentiert.

### 5.3 Abhängigkeit

Metafeld-Filter erfordern die **Shopify Search & Discovery App** — kostenlos, von Shopify selbst,
auf allen Plänen, kein Plus. Ohne sie greift automatisch der Tag-Fallback
(`/collections/holzig/abend+intensiv`), der ohne jede App funktioniert. Das Theme erkennt die
Situation an `collection.filters.size` und wählt den Pfad selbst.

---

## 6. Technische Lösung Discovery Set

### 6.1 Anforderung

5 aus 120–130 Düften frei wählen, 14,90 €, die Auswahl muss den Checkout überleben und beim
Händler in der Bestellung ankommen.

### 6.2 Geprüfte Wege

| Weg | Auswahl überlebt Checkout | Fixpreis 14,90 € | Sample-Bestand wird gebucht | Aufwand |
|---|---|---|---|---|
| **A — Line Item Properties** | ✅ nativ | ✅ | ❌ nur Set-Bestand | gering |
| B — 5 Einzelpositionen + Automatikrabatt | ✅ | ⚠️ rabattabhängig, Rundungs- und Mengenprobleme | ✅ | mittel |
| C — Shopify Bundles (App, kostenlos) | ✅ | ✅ | ✅ | ❌ **kann keine freie Auswahl aus 130** — nur feste Bundles |
| D — Cart Transform Function | ✅ | ✅ | ✅ | benötigt eigene App (kein Plus, aber Entwicklung + Deployment) |

### 6.3 Empfehlung für Version 1: Weg A

**So funktioniert es konkret:**

1. Ein Produkt „Discovery Set — 5 × 2 ml", eine Variante, 14,90 €, eigenes Template.
2. Der Auswahl-Dialog lädt die Düfte aus einer definierten Collection (durchsuchbar + nach
   Duftfamilie filterbar — bei 130 Optionen zwingend). Angeboten werden **nur** Düfte, deren
   2-ml-Variante gerade `available` ist.
3. Beim Absenden übergibt das normale Shopify-Produktformular an `/cart/add`:
   ```
   properties[Duft 1] = No. 001 · Holzig
   ...
   properties[Duft 5] = No. 047 · Gourmand
   properties[_vc_handles] = no-001,no-012,no-031,no-047,no-088   (maschinenlesbar, versteckt)
   ```
   Properties mit `_`-Präfix sind für den Kunden unsichtbar, für den Händler aber im Export da.
4. Diese Properties sind **native Shopify-Daten**: sichtbar im Warenkorb, im Cart Drawer,
   in der Checkout-Zusammenfassung, in der Bestellbestätigung, im Admin-Auftrag,
   auf dem Lieferschein und im Bestell-Export. Nichts davon ist ein Frontend-Trick,
   nichts geht im Checkout verloren.
5. Absenden ist gesperrt, bis genau 5 Düfte gewählt sind (clientseitig).

**Ehrliche Grenzen, die dokumentiert werden:**
- Der Bestand der einzelnen 2-ml-Proben wird **nicht** automatisch reduziert. Gebucht wird der
  Bestand des Set-Produkts. Verfügbarkeit wird beim Rendern geprüft, aber nicht reserviert.
  Exakte Bestandsführung je Probe erfordert Weg D (eigene App) — Empfehlung: erst wenn das
  Volumen es rechtfertigt.
- Eine **serverseitige** Prüfung „genau 5 Düfte" ist ohne Cart-Validation-Function nicht möglich.
  Ein manipuliertes Formular könnte 4 Düfte senden. Praktisches Risiko gering, wird im README
  benannt, nicht verschwiegen.

### 6.4 Vorbereitung des 10-€-Gutscheins

Nicht technisch erzwungen, nur strukturell vorbereitet:
- Der Rabatt selbst entsteht als **normaler Shopify-Rabattcode** (10 € fest, Mindestbestellwert,
  Einmalnutzung) — kein Code im Theme nötig
- Der Versand erfolgt nach Kauf per Shopify Flow / Shopify Email. **Wichtig:** Die Danke-Seite
  lässt sich ohne Plus nicht frei gestalten, deshalb Auslieferung per E-Mail, nicht im Checkout
- Im Theme liegt bereit: ein abschaltbarer Hinweisblock auf der Discovery-Set-Seite und im
  Warenkorb, dessen Text vollständig aus den Section Settings kommt — Aktivierung später
  ohne Code

### 6.5 Sample auf der normalen Produktseite

Unabhängig vom Set: Ist `custom.sample_verfuegbar = true` und existiert die 2-ml-Variante,
zeigt die Produktseite einen ruhigen Block „Erst kennenlernen — 2 ml Probe, 3,90 €",
der die Sample-Variante direkt in den Warenkorb legt. Das ist ein regulärer Variantenkauf,
technisch trivial und vollständig funktionsfähig.

---

## 7. Risiken, Shopify-Grenzen, mögliche App-Abhängigkeiten

| Thema | Status | Konsequenz |
|---|---|---|
| **Search & Discovery** (kostenlos, Shopify, alle Pläne) | empfohlen | Nötig für Metafeld-Filter und bessere Predictive Search. Fallback über Tag-URLs ist eingebaut. |
| **Bewertungen** | App nötig | Shopifys eigene Review-App gibt es nicht mehr. Theme liest `product.metafields.reviews.rating` (De-facto-Standard, u. a. Judge.me). **Ohne Daten wird der Bereich vollständig ausgeblendet** — keine Fake-Sterne. |
| **Sample-Bestand im Discovery Set** | nicht in V1 | Braucht Cart Transform Function = eigene App. Kein Plus nötig, aber Entwicklungsprojekt. |
| **Serverseitige Validierung der 5 Picks** | nicht in V1 | Braucht Cart Validation Function = eigene App. |
| **Checkout-Gestaltung** | begrenzt | Logo/Farben/Schrift über Checkout-Branding möglich. Eigene Checkout-Schritte oder `checkout.liquid` = **Plus**. Wird nicht verwendet. |
| **Danke-Seite anpassen** | begrenzt | Ohne Plus nicht frei gestaltbar → Gutschein per E-Mail. |
| **Versandkosten-Freigrenze** | Theme-Setting | Der Fortschrittsbalken kennt die echten Versandregeln nicht. Wert muss manuell mit den Versandeinstellungen übereinstimmen. Standardmäßig **deaktiviert**, damit kein falscher Wert live geht. |
| **Zahlungsarten** | Shopify-Konfiguration | Theme rendert nur `additional_checkout_buttons` und die im Shop aktivierten Icons. Nichts hart codiert. |
| **PAngV-Grundpreis** | Pflege nötig | Funktioniert nur, wenn die Unit-Price-Felder je Variante im Admin gefüllt sind. Steht im README und in der CSV-Vorlage. |
| **Kosmetik-/Gefahrstoffangaben** | rechtlich offen | Struktur + Platzhalter werden geliefert, Inhalte muss die Marke stellen. |
| **Firmendaten, Impressum, AGB** | Platzhalter | `[FIRMENNAME]`, `[ANSCHRIFT]`, `[UST-ID]` — nichts erfunden. |
| **Testbarkeit** | eingeschränkt | Ohne echten Shop lassen sich Checkout, Zahlungen, echte Filter-Ergebnisse und Bestand nicht final testen. Wird pro Bereich im README benannt. |
| **Markenrecht** | eingehalten | Keine Fremdmarken, keine „Dupe von …"-Formulierungen, keine fremden Flakons. Zuordnungsdaten liegen in `internal.*` ohne Storefront-Zugriff. |

Kein Bestandteil des Konzepts setzt Shopify Plus voraus.

---

## 8. Empfehlung: Umfang Version 1

### In Version 1 bauen

**Fundament**
- Vollständige OS-2.0-Theme-Struktur, `theme.liquid`, alle Templates, `settings_schema.json`
- Designsystem als CSS-Custom-Properties, vollständig aus Theme Settings gespeist
- Logo austauschbar, Farben/Typografie/Buttons/Radius über Settings
- `locales/de.default.json` **und** `locales/en.json` — keine sichtbaren Texte hart im Liquid

**Funktion**
- Startseite mit allen 11 Sections, sortier- und abschaltbar
- Collection mit Filtern, Sortierung, Paginierung, mobilem Filter-Drawer (Bottom-Sheet)
- Produktseite: Galerie, Varianten, Duftpyramide, Charakter, Jahreszeit/Anlass,
  „Was bedeutet 30 % Extrait", Sample-Block, Travel-Block, Empfehlungen, Grundpreis
- Predictive Search mit Gruppierung (Produkte / Duftfamilien / Seiten)
- Duftfinder (echt, filterbasiert, mit 0-Treffer-Behandlung)
- Discovery Set mit funktionierender 5-aus-N-Auswahl über Line Item Properties
- Cart Drawer mit Mengenänderung, Zwischensumme, einem dezenten Cross-Sell,
  optionalem Versandfortschritt (default aus)
- Kontaktformular, FAQ-Akkordeon, Rechtsseiten-Struktur
- Kundenkonto-Templates

**Qualität**
- Mobile eigenständig gelöst (Nav, Filter-Sheet, Sticky Add-to-Cart, Touch-Targets)
- Performance: Vanilla JS, keine Bibliotheken, `image_url`/`image_tag`, Lazy Loading,
  feste Bildmaße, `defer`, kritisches CSS inline
- Accessibility: Skip-Link, Fokusfalle in Drawern, sichtbare Fokusringe, Labels, Kontraste,
  Reduced Motion
- SEO: saubere H-Struktur, Product/Breadcrumb/Organization JSON-LD, Canonicals, Alt-Texte
- Theme Check ohne relevante Fehler

**Dokumentation**
- README mit 10-Schritte-Setup, Metafeld-Liste (kopierfertig), Collection-Liste,
  Navigations-Setup, Beispiel-CSV für 10 Demo-Düfte (No. 001–No. 010, klar als DEMO markiert),
  Liste der nicht ohne echten Shop testbaren Bereiche
- Uploadfähiges ZIP

### Bewusst auf Version 2 verschieben

| Später | Warum |
|---|---|
| Bestandssynchronisation der 2-ml-Proben | eigene App / Function nötig |
| Automatisierter 10-€-Gutschein | Flow-Konfiguration, kein Theme-Thema — Struktur liegt bereit |
| Review-App-Anbindung | erst wenn echte Bewertungen existieren |
| Englische Storefront live (Markets) | Locale ist vorbereitet, Übersetzung braucht Endtexte |
| Journal/Blog-Inhalte | Templates liegen bereit, Redaktion fehlt |
| Wunschliste, Abo, Geschenkverpackung | erhöht Komplexität ohne Nutzen zum Start |
| Semantische/KI-Suche | erst sinnvoll ab echtem Suchdatenvolumen |
| Aufwendige Duft-DNA-Visualisierung | Effekt vor Funktion — bewusst nachgelagert |

---

## Offene Punkte zur Freigabe

1. Hybrid-Produktmodell (Hauptlinie Varianten, Essentials separat) — einverstanden?
2. Discovery Set über Line Item Properties in V1, ohne Proben-Bestandsführung — akzeptabel?
3. Darf die kostenlose Shopify-App „Search & Discovery" installiert werden?
4. Eau de Parfum als Variante des jeweiligen Dufts (nicht als eigene Produktlinie) — passt das?
5. Platzhalterwert für die Versandkosten-Freigrenze (Anzeige bleibt zunächst deaktiviert).

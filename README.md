# VENT CELESTE — Shopify Online Store 2.0 Theme (V3)

Beratungsgetriebener Duftshop: 20 Bestseller sind öffentlich gelistet, das
übrige Sortiment läuft über persönliche WhatsApp-Beratung und einen Scent Code.

Warenkorb, Checkout, Bestellungen, Zahlungen, Bestand, Rabatte, Kundenkonten und
Versand bleiben vollständig bei Shopify. Kein Shopify Plus erforderlich.

Theme Check: **0 Fehler, 0 Warnungen.**

---

## Der Weg durch den Shop

```
bekannter Lieblingsduft  →  WhatsApp-Beratung  →  Scent Code  →  Bestellung
```

Duftfamilien, Filter und Duftfinder existieren weiterhin vollständig — sie sind
in V2 der zweite Weg für Stöberer, nicht mehr der Einstieg.

---

## 1. Umgesetzte Funktionen

### Scent-Code-System
- Eingaben `47`, `047`, `vc47`, `VC 047` und `VC-047` werden alle zu **VC-047** normalisiert
- Nur Codes aus der hinterlegten Liste tatsächlich vergebener Nummern sind bestellbar
  (Theme Setting *Scent Code → Liste gültiger Codes*); die Prüfung läuft im Browser **und** serverseitig
- Dreistufige Auflösung: Tabelle der öffentlichen Codes (serverseitig gerendert, ohne Netzanfrage) → native Shopify-Sofortsuche → generischer Bestellweg
- **Keine Sackgasse:** Jeder gültige Code führt auf eine Produktseite oder in den Bestellweg; ungültige Eingaben bekommen eine ruhige Fehlermeldung plus Beratungslink
- Code-Felder im Hero, in einem eigenen Startseiten-Abschnitt, über der Suche und auf der Bestellseite
- Code-Erkennung auch **serverseitig** in Sofortsuche und Suchergebnisseite — funktioniert ohne JavaScript

### Generischer Bestellweg (`/products/scent-code`)
- Ein Produkt trägt das gesamte nicht gelistete Sortiment, vier Ausführungen
- Der Code wird als **Positionsangabe** übergeben: `Scent Code: VC-081` plus versteckte, maschinenlesbare Fassung `_vc_code`
- Damit sichtbar in Warenkorb, Checkout, Bestellbestätigung, Admin, Lieferschein und jedem Export — kein zweiter Datenspeicher
- Ohne gültigen Code lässt sich nichts in den Warenkorb legen
- Code kann per URL vorbelegt werden (`?code=VC-081`)

### WhatsApp-Beratung
- Rufnummer, Nachricht, Antwortzeit und Beschriftungen ausschließlich in den Theme Settings
- Ein Snippet baut überall den korrekten internationalen `wa.me`-Link und normalisiert die Nummer selbst
- Kontextabhängige Nachricht: auf der Produktseite und bei erfolgloser Suche fährt der jeweilige Code automatisch mit
- Mobile Beratungsleiste ab einstellbarer Scrolltiefe, vom Kunden ausblendbar
- **Kein WhatsApp-Widget, kein Meta-Skript** — erst der Klick des Kunden stellt eine Verbindung her
- Auf Produktseiten weicht die Beratungsleiste dem Warenkorb-Button; es liegen nie zwei Leisten übereinander

### Startseite (12 Abschnitte, mobile first)
Hero mit Code-Feld · Markenversprechen · Most Wanted (Swipe) · „Über 120 Duftprofile" (vollflächig, dunkel) · So funktioniert's · Discovery Set · Scent Code eingeben · Extrait · Travel · Essentials (eine ruhige Zeile) · Marke · Newsletter

Kein Abschnitt wiederholt die Komposition des vorherigen; genau zwei laufen im dunklen Schema.

### Most Wanted
- Horizontale Reihe mit **CSS Scroll Snap**, keine Slider-Library (spart rund 45 KB)
- Auf Mobile lugt die nächste Kachel hervor — Wisch-Affordance ohne Pfeile
- Fortschrittspunkte, Pfeile auf Desktop, Tastaturfokus scrollt mit
- Quick Add legt direkt die Extrait-Variante in den Warenkorb

### Produktseite
- Beim Variantenwechsel wechseln **Preis, Grundpreis, Konzentration, Größe, Artikelnummer, Verfügbarkeit und Bild**
- Konzentration und Füllmenge liegen auf **Variantenebene** — ein Eau de Parfum zeigt nie die Prozentzahl des Extrait
- Werte kommen fertig formatiert aus Liquid: keine nachgebaute Währungslogik, keine Netzanfrage, kein Flackern
- Blockbasierter Inhaltsbereich: Duftprofil, Charakter, Jahreszeit/Anlass, **Unsere Konzentrationen**, Probe und Travel, Duftberatung, Beschreibung, Inhaltsstoffe
- Der Konzentrationsblock erklärt Extrait (30 %) und Eau de Parfum (20 %) nebeneinander — er behauptet nicht mehr pauschal „30 %", während der Kunde die EDP-Variante ansieht
- Sticky Add-to-Cart auf Mobile, native Empfehlungen, App-Blöcke für Review-Apps

### Produktkarten — nie „ab 1,00 €"
Der Preis gehört immer zu einer konkreten Ausführung. Auflösungsreihenfolge:

```
1. Vorgabe der Section        (z. B. „Extrait" in Most Wanted)
2. Collection-Metafeld        custom.karten_variante
3. Produkt-Metafeld           custom.hauptvariante
4. erste verfügbare 30-ml-Variante
5. erste verfügbare Variante
```

| Kontext | Karte zeigt |
|---|---|
| Startseite, Bestseller, Shop | 29,90 € (Extrait) |
| Sample-Collection | 1,00 € |
| Travel-Collection | 12,90 € |
| Essentials | 9,90 € |

### Navigation
- Desktop: **SHOP · DUFTBERATUNG · VENT CELESTE**, WhatsApp-Block im Mega-Menü, Duftfamilien als zweite Spalte unter DUFTBERATUNG
- Mobile bewusst flacher: Suchfeld, WhatsApp-Button und die vier wichtigsten Ziele stehen ohne Aufklappen da
- Suchpanel mit vorgeschaltetem Scent-Code-Feld

### Discovery Set
- **Fünf Scent Codes eingeben** — dieselbe Normalisierung und Prüfung wie überall sonst im Shop
- Doppelte Codes werden abgewiesen; Enter springt ins nächste Feld
- Großer Auswahlzähler `0 / 5`; erst bei fünf gültigen, verschiedenen Codes ist der Warenkorb-Button aktiv
- Übergabe als Positionsangaben `Scent Code 1 … 5` plus versteckte Fassung `_vc_codes`
- Darunter ein Link zur Beratung, falls noch nicht fünf Codes vorliegen

Bewusst keine visuelle Auswahl aus einer Produktliste: Öffentlich gelistet sind
20 Produkte, das übrige Sortiment existiert in Shopify gar nicht als Produkt.
Eine Auswahlliste könnte deshalb nie das ganze Sortiment abbilden — die
Code-Eingabe passt zum Beratungsmodell und kommt ohne Nachladelogik aus.

### Warenkorb, Filter, Suche
- Cart Drawer über die Section Rendering API, Scent Code hervorgehoben dargestellt
- Filter mit acht Achsen, Desktop-Sidebar und mobiles Bottom-Sheet
- Sofortsuche mit Gruppierung und Tastaturbedienung; durchsucht Titel, Produkttyp, Variantennamen, Vendor, Tags **und die Produktbeschreibung**

### Interaktionen
Scroll Reveal (gestaffelt) · Hero-Drift (max. 24 px) · Code-Feld mit Fokus- und Fehlerrückmeldung · Mobile Swipe · Quick Add · Cart Drawer · Sticky-Beratung · Sticky Add-to-Cart · Menü-Übergänge

Alles 160–350 ms, nur `transform` und `opacity`, **keine externe Library**.
`prefers-reduced-motion` schaltet sämtliche Bewegung ab, auch Drift und Reveal.

### Qualität
- Vanilla JavaScript, kein Framework, kein jQuery, keine externen Requests
- Schriften über `font_picker` von der Shopify-CDN
- `image_url` mit `srcset`/`sizes`, feste Bildmaße, Lazy Loading, `fetchpriority` fürs Hero-Bild
- Skip-Link, Fokusfalle in allen Drawern, sichtbare Fokusringe, Formularlabels, 48-px-Touch-Targets
- Grundpreis nach PAngV, Steuer- und Versandhinweis
- `locales/de.default.json` und `locales/en.json`, vollständig deckungsgleich

---

## 2. Verwendete Metafelder

### Produktebene — Namespace `custom`

| Key | Typ | Filter | Beispiel |
|---|---|---|---|
| `scent_code` | Einzeiliger Text | – | `VC-047` (zugleich interne Sortimentsnummer) |
| `hauptvariante` | Produktvariante (Referenz) | – | Extrait 30 ml |
| `duftfamilie` | Einzeiliger Text, Liste | ✅ | Holzig, Amber |
| `charakter` | Einzeiliger Text, Liste | ✅ | warm, trocken |
| `intensitaet` | Einzeiliger Text | ✅ | mittel |
| `jahreszeit` | Einzeiliger Text, Liste | ✅ | Herbst, Winter |
| `anlass` | Einzeiliger Text, Liste | ✅ | Abend, Date |
| `geschlecht` | Einzeiliger Text | ✅ | Unisex |
| `konzentration` | Einzeiliger Text, Liste | ✅ | Extrait, Eau de Parfum |
| `linie` | Einzeiliger Text | ✅ | Hauptlinie |
| `kopfnoten` / `herznoten` / `basisnoten` | Einzeiliger Text, Liste | – | Bergamotte, Kardamom |
| `duftbeschreibung` | Rich Text | – | redaktioneller Text |
| `sample_verfuegbar` / `travel_verfuegbar` / `bestseller` | Wahr/Falsch | – | true |
| `inci` / `allergene` | Mehrzeiliger Text | – | Kosmetikangaben |

### Variantenebene — optional, Namespace `custom`

| Key | Typ | Extrait | Eau de Parfum |
|---|---|---|---|
| `konzentration` | Einzeiliger Text | Extrait | Eau de Parfum |
| `konzentration_prozent` | Einzeiliger Text | 30 | 20 |
| `fuellmenge` | Einzeiliger Text | 30 ml | 30 ml |

**Diese Felder sind optional und müssen nicht gepflegt werden.**

Shopify überträgt Varianten-Metafelder **nicht** über den normalen
Produkt-CSV-Import. Sie ließen sich nur einzeln im Bulk Editor oder über die API
setzen — bei 20 Produkten mit je vier Varianten wären das 240 Einträge von Hand.

Deshalb leitet das Theme die drei Werte aus dem **Variantennamen** ab:

| Ausführung | Konzentration | Prozent | Größe |
|---|---|---|---|
| Extrait 30 ml | Extrait | 30 % | 30 ml |
| Eau de Parfum 30 ml | Eau de Parfum | 20 % | 30 ml |
| Travel 10 ml | Extrait | 30 % | 10 ml |
| Sample 2 ml | Extrait | 30 % | 2 ml |

Reihenfolge: **Varianten-Metafeld, falls gepflegt → sonst Ableitung aus dem
Variantennamen.** Der Shop stimmt damit direkt nach dem CSV-Import; wer einzelne
Varianten abweichend beschriften will, überschreibt sie per Metafeld.

Erkennungswort und Prozentwerte stehen in den Theme Settings unter
*Ausführungen & Konzentration* und sind ohne Code änderbar. Voraussetzung ist,
dass die Variantennamen dem Muster oben folgen — die Ausführung enthält also
„Eau de Parfum" bzw. sonst nichts davon, und die Größe steht als Zahl vor `ml`.

### Collection-Ebene

| Key | Typ | Wirkung |
|---|---|---|
| `karten_variante` | Einzeiliger Text | `sample`, `travel`, `edp` oder `extrait` — bestimmt, welcher Variantenpreis auf den Karten dieser Collection erscheint |

### Zusätzlich gelesen
`reviews.rating` und `reviews.rating_count` — Standard-Metafelder gängiger
Review-Apps. Ohne Daten bleibt der Bewertungsbereich vollständig ausgeblendet.

### Interne Zuordnungsdaten — **nicht in Shopify**

Die Zuordnung Scent Code ↔ Originalduft wird **nicht** in Shopify gespeichert.
Ein Metafeld mit `access.storefront = none` ist gegen die Storefront-API
abgeschirmt, **nicht gegen Liquid** — ein Theme kann den Wert weiterhin lesen
und ausgeben. Eine Zugriffseinstellung ist deshalb kein Schutz für
markenrechtlich heikle Daten.

Konsequenz: Der Namespace `internal` existiert nicht. Shopify kennt
ausschließlich VC-Codes. Die Zuordnungstabelle lebt außerhalb von Shopify in
einer privaten Liste.

**Diese Felder sind öffentlich abrufbar** (unter anderem über `/products.json`
und `/collections/<handle>/products.json`): Titel, Beschreibung, Vendor,
Produkttyp, **Tags**, Variantentitel, SKU, Bilddateiname, Alt-Text, SEO-Felder,
Handle. Daraus folgen fünf Regeln für die Produktpflege:

1. Keine Fremdmarke im Titel, in der Beschreibung, im Handle oder in den SEO-Feldern
2. **Keine Fremdmarke als Tag** — Tags wirken intern, sind es aber nicht
3. Keine Fremdmarke im SKU, im Bilddateinamen oder im Alt-Text
4. Keine Fremdmarke in irgendeinem Metafeld, unabhängig von der Zugriffseinstellung
5. Keine automatisch übernommenen Duftnoten aus den Originalprodukten

---

## 3. Benötigte Shopify-Apps

| App | Nötig? | Wofür |
|---|---|---|
| **Shopify Search & Discovery** (kostenlos, von Shopify, alle Pläne) | empfohlen | Filtergruppen aus Metafeldern und bessere Sofortsuche. Ohne die App fällt das Theme auf Tag-URLs (`/collections/holzig/abend+intensiv`) zurück; die Scent-Code-Suche funktioniert unabhängig davon. |
| Review-App (Judge.me o. ä.) | optional | Bewertungen. Ohne Daten bleibt der Bereich unsichtbar. |
| Shopify Flow (kostenlos) | optional, später | Automatisierte Nachfass-Mails oder Gutscheine nach dem Kauf. |

**Keine weitere App wird vorausgesetzt.** Scent Code, WhatsApp-Beratung,
Discovery Set, Suche, Filter und Warenkorb laufen über Shopify-Bordmittel.
Kein Bestandteil benötigt Shopify Plus.

---

## 4. Einstellungen nach dem Upload

### 4.1 Theme hochladen
*Onlineshop → Themes → Theme hinzufügen → ZIP-Datei hochladen*, dann **Vorschau**.

### 4.2 Metafeld-Definitionen anlegen
Die Felder auf **Produkt- und Collection-Ebene** aus [Abschnitt 2](#2-verwendete-metafelder)
anlegen und den Storefront-Zugriff aktivieren.

Die drei **Varianten-Metafelder sind optional** — das Theme leitet Konzentration,
Prozentwert und Größe aus dem Variantennamen ab. Nur anlegen, wenn einzelne
Varianten davon abweichen sollen.

### 4.3 Produkte anlegen

| Produkt | Aufbau |
|---|---|
| **20 Bestseller** | Titel `VC-047`, Handle `vc-047`, eine Option `Ausführung` mit `Extrait 30 ml` (29,90 €), `Eau de Parfum 30 ml` (22,90 €), `Travel 10 ml` (12,90 €), `Sample 2 ml` (1,00 €) |
| **Scent Code** | Titel `VENT CELESTE Scent Code`, Handle `scent-code`, dieselben vier Ausführungen, Bestandsverfolgung aus |
| **Discovery Set** | Handle `discovery-set`, eine Variante, 3,90 € |
| **Essentials** | Eigene Produkte, Handle-Präfix `essentials-`, 9,90 € |

Der Produkttitel **ist** der Code — damit tragen Suche, URL, Bestellbestätigung
und Lieferschein den Code automatisch, ohne Synchronisation.

Import über *Produkte → Importieren* mit der mitgelieferten Vorlage
`beispiel-produkte.csv` (20 Codes plus Scent-Code-Produkt, Discovery Set und
ein Essentials-Beispiel; Duftnoten bewusst leer).

**Was die CSV nicht transportieren kann.** Shopify unterstützt im
Produkt-CSV-Import keine **Varianten-Metafelder**. Die mitgelieferte Datei
enthält deshalb bewusst keine solchen Spalten — Konzentration, Prozentwert und
Größe leitet das Theme aus dem Variantennamen ab. Nach dem Import stimmt der
Shop ohne weitere Pflege.

Zwei Dinge sind nach dem Import dennoch manuell zu setzen:

- **Grundpreis** je Variante (*Preise → Grundpreis*, z. B. Inhalt 30, Einheit ml,
  Referenzmenge 100 ml). Ohne diese Angaben bleibt der PAngV-Grundpreis leer.
- **`custom.hauptvariante`** je Produkt auf die Extrait-Variante setzen —
  sonst kann die Karte den Probenpreis zeigen.

Die Variantennamen müssen die Erkennungswörter enthalten, nach denen das Theme
sucht: `eau de parfum`, `sample`, `travel` sowie die Größe als Zahl vor `ml`.
Die vorgeschlagenen Namen erfüllen das bereits.

### 4.4 Collections anlegen

| Handle | Typ | Bedingung | `karten_variante` |
|---|---|---|---|
| `bestseller` | automatisch | Tag `bestseller` | `extrait` |
| `alle-duefte` | automatisch | Tag `oeffentlich` | `extrait` |
| `extrait` | automatisch | Tag `konzentration:extrait` | `extrait` |
| `eau-de-parfum` | automatisch | Tag `konzentration:edp` | `edp` |
| `travel-size` | automatisch | Tag `travel` | `travel` |
| `samples` | automatisch | Tag `sample` | `sample` |
| `essentials` | automatisch | Tag `linie:essentials` | — |
| `discovery-set` | manuell | nur das Set | — |
| Duftfamilien (12×) | automatisch | Tag `familie:<name>` | `extrait` |

`bestseller` ist zugleich die Collection, aus der die Scent-Code-Tabelle
entsteht (Theme Setting *Scent Code → Collection der öffentlichen Düfte*).

Für `bestseller` die Vorlage `collection.bestseller` zuweisen.

### 4.5 Theme Settings setzen

| Gruppe | Zu prüfen |
|---|---|
| **WhatsApp-Beratung** | Rufnummer (`+49 172 8439661`), vorbereitete Nachricht, Antwortzeit, Beratungsleiste |
| **Scent Code** | Präfix `VC`, höchste Nummer, Collection der öffentlichen Düfte, Produkt für nicht gelistete Codes, **Liste gültiger Codes** |
| **Ausführungen & Konzentration** | Erkennungswort und Prozentwerte für Extrait und Eau de Parfum |
| **Logo & Marke** | Logo als Inline-SVG einfügen — schärfer als eine Bilddatei, skaliert beliebig und übernimmt automatisch die Farbe des Schemas. Alternativ eine Bilddatei. Ohne beides erscheint die Wortmarke als Text. |
| Farben, Typografie, Layout | Editorial-Werte nachschärfen |
| Warenkorb | Cross-Sell-Produkt, Versandfortschritt (**standardmäßig aus**) |
| Rechtliche Hinweise | Steuerhinweis, Link zur Versandseite, Grundpreis |

### 4.5a Liste gültiger Scent Codes pflegen

*Theme Settings → Scent Code → Liste gültiger Codes.* Kommagetrennt, zum Beispiel:

```
022, 024, 026, 027, 029, 035, 040, 047, 049, 051,
071, 078, 080, 081, 085, 091, 096, 102, 108, 121
```

`047`, `VC-047` und `47` sind gleichwertig — die Schreibweise wird vereinheitlicht.
Sobald weitere Codes vergeben werden, hier ergänzen.

**Bleibt das Feld leer**, akzeptiert das Theme aus Kompatibilitätsgründen jede
Nummer von 1 bis zur eingestellten Höchstnummer. Ein Kunde könnte dann einen
Code bestellen, den es gar nicht gibt. Für den Livegang die Liste füllen.

### 4.6 Navigation
*Onlineshop → Menüs.* Fünf Menüs anlegen:

```
main-menu                                mobile-hauptziele
  SHOP                                     Scent Code bestellen
    Bestseller                             Bestseller
    Alle öffentlichen Düfte                Alle Düfte
    Extrait / Travel / Samples             Discovery Set
    Discovery Set / Essentials
  DUFTBERATUNG                           mobile-nebenziele
    WhatsApp-Beratung                      Extrait · Travel
    Scent Code bestellen                   Samples · Essentials
    Duftfinder
  VENT CELESTE                           mobile-service
    Über uns / FAQ / Kontakt               Über uns · FAQ · Kontakt

duftfamilien
  Frisch … Oud (12 Einträge)
```

Im Theme-Editor zuweisen: `duftfamilien` und die drei `mobile-*`-Menüs.
Der Menüpunkt für die Beratungsfläche muss **exakt** `Duftberatung` heißen
(oder die Einstellung entsprechend anpassen).

### 4.7 Seiten anlegen

| Seite | Handle | Vorlage |
|---|---|---|
| Duftfinder | `duftfinder` | `page.duftfinder` |
| FAQ | `faq` | `page.faq` |
| Kontakt | `kontakt` | `page.contact` |
| Über uns | `ueber-uns` | `page` |
| Impressum, Datenschutz, AGB, Widerruf, Versand | frei | `page.rechtliches` |

**Datenschutzerklärung:** Ein Absatz zu WhatsApp und Meta gehört hinein.
Das Theme bindet nur einen Link ein, kein Widget und kein Drittanbieter-Skript —
Daten fließen erst, wenn der Kunde klickt.

### 4.8 Templates zuweisen
Scent-Code-Produkt → `product.scent-code` · Discovery Set → `product.discovery-set` ·
Essentials → `product.essentials` · Duftfamilien-Collections → `collection.duftfamilie`

### 4.9 Filter einrichten
In **Search & Discovery → Filters** Filtergruppen aus `duftfamilie`, `charakter`,
`intensitaet`, `jahreszeit`, `anlass`, `geschlecht`, `konzentration`, `linie`
plus Preis und Verfügbarkeit.

### 4.10 Versand und Zahlungen
Zone Deutschland, Tarife. Freigrenze gegebenenfalls im Theme eintragen und
**erst dann** den Versandfortschritt aktivieren.

Zu bedenken: Eine Probe kostet 1,00 €. Ohne Gegenmaßnahme kostet eine
1-€-Bestellung mehr, als sie einbringt. Shopify-native Möglichkeiten ohne App:
preisabhängige Versandtarife, ein Warenpost-Tarif für Probensendungen, oder
Proben nicht in der Hauptnavigation führen (so ist das Theme voreingestellt).

### 4.11 Rechtstexte einsetzen
Platzhalter ersetzen: `[FIRMENNAME]`, `[ANSCHRIFT]`, `[UST-ID]`, `[E-MAIL]`,
`[TELEFON]`, `[ERREICHBARKEIT]`. Danach im Fußbereich den Platzhalter-Hinweis
abschalten.

### 4.12 Testbestellung
Veröffentlichen und im Testmodus bestellen. Prüfen:
Scent-Code-Eingabe (`47`, `VC-047`, ein nicht gelisteter Code) · Variantenwechsel ·
Cart Drawer · Checkout · **Scent Code in den Bestelldetails** ·
Discovery-Set-Auswahl in der Bestellung · Grundpreis · WhatsApp-Link auf dem Handy.

---

## 5. Bekannte Einschränkungen und offene Punkte

### Technische Grenzen

1. **Keine serverseitige Prüfung des Scent Codes.** Format und Zahlenbereich
   werden im Browser geprüft. Ein manipuliertes Formular könnte einen unsinnigen
   Code senden. Echte serverseitige Prüfung bräuchte eine Cart-Validation-Function
   und damit eine eigene App. Praktisch gering, da ihr den Code vor dem Versand seht.
2. **Kein Bestand je Code.** Der generische Artikel führt einen Sammelbestand.
   Solange auf Bestellung abgefüllt wird, ist das korrekt abgebildet.
3. **Kein Probenbestand im Discovery Set.** Gebucht wird der Set-Bestand.
   Ob eine einzelne Probe abfüllbar ist, weiß Shopify nicht — die fünf Codes sind
   Positionsangaben, keine eigenen Bestandsartikel.
4. **Discovery Set und Scent-Code-Bestellung benötigen JavaScript.** Das wird
   offen ausgewiesen, statt ein UI zu zeigen, das nichts überträgt. Alle anderen
   Bausteine — Code-Felder, Filter, Duftfinder, Suche, Produktseite — funktionieren
   ohne JavaScript; die Code-Erkennung in Sofortsuche und Suchergebnisseite läuft
   ohnehin serverseitig.
5. **Der generische Artikel ist von der Indexierung ausgenommen.** Er bekommt
   `noindex,follow` und kein `Product`-Markup: Ein Artikel mit Preisspanne
   1,00–29,90 € ohne konkreten Duft wäre für Suchmaschinen irreführend. Für Kunden
   bleibt er normal erreichbar, öffentliche Bestsellerseiten bleiben indexierbar.
6. **Der generische Artikel darf nicht in normalen Rastern erscheinen** — dort
   stünde „ab 1,00 €". Er ist deshalb aus Shop- und Bestseller-Collections
   herauszuhalten und hat eine eigene Landingpage.
7. **Grundpreis nur mit gepflegten Daten**, per CSV nicht setzbar.
8. **Versandfortschritt kennt die echten Versandregeln nicht** — deshalb
   standardmäßig deaktiviert.
9. **Checkout-Gestaltung ist begrenzt.** Branding ja, eigene Schritte oder
   `checkout.liquid` wären Plus und werden nicht verwendet.
10. **Duftnoten sind für die Shopify-Suche nicht erreichbar.** Die Sofortsuche
    durchsucht Titel, Produkttyp, Variantennamen, Vendor, Tags und die
    Produktbeschreibung. Metafelder gehören nicht dazu. Damit Duftnoten gefunden
    werden, müssen sie **zusätzlich in der Produktbeschreibung** stehen — dort
    natürlich ebenfalls ohne Fremdmarken. Solange das nicht gepflegt ist, findet
    die Suche keine Noten; der Hinweistext im Suchfeld ist im Theme-Editor
    entsprechend anpassbar.
11. **Hohe Variantenzahlen.** Shopify erlaubt inzwischen bis zu 2.048 Varianten
    je Produkt, Liquid gibt über `product.variants` aber weiterhin höchstens 250
    aus, und Produkte mit vielen Varianten brauchen eine eigene Theme-Technik.
    Für den Scent-Code-Fall ist das generische Produkt mit vier Varianten
    deshalb einfacher und schlanker — der Code fährt ohnehin als Positionsangabe mit.

### Ohne echten Shop nicht abschließend testbar

Checkout und Zahlungen · Filterausgabe (entsteht erst mit konfigurierter App und
echten Metafeldern) · Sofortsuche · Produktempfehlungen (Shopify braucht
Verkaufsdaten) · Grundpreis · Zahlungsart-Icons · Kundenkonten ·
Nachladen der Discovery-Auswahl über 50 Produkte hinaus · WhatsApp-Öffnung auf
echten Endgeräten.

### Inhaltlich offen

- **Logo** — als Inline-SVG einzusetzen; das Theme ist darauf vorbereitet
- **Duftnoten und Beschreibungen** der 20 Bestseller — bewusst leer gelassen,
  es wurden keine Noten aus Originalprodukten übernommen
- **Rechtstexte** inklusive WhatsApp-Absatz in der Datenschutzerklärung
- **Kosmetikangaben** nach EU 1223/2009: INCI, Allergene, verantwortliche
  Person, Chargenkennzeichnung, CLP-Hinweise
- **Über uns** — als Mustertext gekennzeichnet
- **Produktbilder** — Demo-Platzhalter; echte Fotos werden ohne Anpassung übernommen
- **Preisgestaltung Proben** — siehe Hinweis unter 4.10

### Bewusst nicht gebaut

Keine erfundenen Bewertungen, Verkaufszahlen, Countdowns oder Verknappungen ·
keine Fremdmarken im gesamten Frontend · keine öffentlichen Vergleichstabellen ·
keine eigene Checkout- oder Bestelllogik · kein Bereich, der einen
Erfolgszustand zeigt, den es technisch nicht gibt.

### Theme Check

`theme-check .` meldet **0 Fehler und 0 Warnungen**. Es verbleiben zehn Hinweise
der Stufe *suggestion*: stilistische `{% liquid %}`-Empfehlungen sowie zwei
Falschmeldungen zu `loading`-Attributen, die bewusst dynamisch gesetzt sind.

Separat mitgeliefert wird `test-scent-code.js`. Das Skript lädt die
ausgelieferte `assets/scent-code.js` in einen minimalen DOM-Stub und prüft die
Normalisierung (`47`, `047`, `VC47`, `VC 047`, `VC-047`), die Positivliste und
die Auflösung öffentlicher Codes. Aus dem Theme-Verzeichnis ausführen:

```bash
node test-scent-code.js
```

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

ZIP neu erzeugen:

```bash
zip -r vent-celeste-theme.zip assets config layout locales sections snippets templates README.md
```

### JavaScript-Budget

| Datei | Zweck | Größe |
|---|---|---|
| `theme.js` | Drawer, Fokus, Warenkorb-API, Reveal, Sticky-Leisten, Hero-Drift | ~17 KB |
| `scent-code.js` | Normalisierung und Auflösung | ~5 KB |
| `product-form.js` | vollständiger Variantenwechsel | ~5 KB |
| `facets.js`, `cart-drawer.js`, `predictive-search.js` | Filter, Warenkorb, Suche | ~10 KB |
| `discovery-set.js`, `scent-code-order.js`, `product-card-swipe.js`, `scent-finder.js`, `recommendations.js` | nur auf den jeweiligen Seiten | ~12 KB |

Alles unkomprimiert und mit `defer`; auf der Startseite laufen davon rund 24 KB.

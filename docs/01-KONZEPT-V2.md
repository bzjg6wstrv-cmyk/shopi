# VENT CELESTE V2 — Redesign-Konzept

Status: **Entwurf zur Freigabe.** Es wurde noch kein V2-Code geschrieben.
Grundlage: bestehendes Theme (Stand `47f39f7`), Konzept V1 in `00-KONZEPT.md`.

Alle Preise, Codes und Firmendaten sind Musterdaten.
Die 20 Zuordnungen zu Originalparfums sind **interne Daten** und erscheinen in
diesem Konzept nur zur Identifikation — nirgends im auszuliefernden Code.

---

## Der eine Satz, um den V2 gebaut wird

> Du kennst deinen Lieblingsduft. Wir finden deinen VENT CELESTE Scent Code.

V1 war ein Stöber-Shop: Duftfamilie → Filter → Produkt.
V2 ist ein Beratungs-Shop: bekannter Duft → WhatsApp → Scent Code → Bestellung.

Das ändert nicht die Technik, sondern die **Reihenfolge der Aufmerksamkeit**.
Duftfamilien, Filter und Duftfinder bleiben vollständig erhalten — sie rutschen
aus dem Einstieg in die zweite Ebene.

---

## 1. Desktop-Startseiten-Wireframe

```
┌──────────────────────────────────────────────────────────────────────────┐
│ ÜBER 120 DUFTPROFILE · PERSÖNLICHE DUFTBERATUNG PER WHATSAPP             │ Announcement
├──────────────────────────────────────────────────────────────────────────┤
│ SHOP ▾   DUFTBERATUNG ▾   VENT CELESTE ▾    [LOGO]      ⌕   ♢   ⊞ (2)   │ Header
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────┬───────────────────────────────────────┐
│                                  │                                       │
│   ÜBER 120 DUFTPROFILE           │                                       │
│                                  │        [ Flakon, freigestellt,        │
│   FIND                           │          leichte Parallax-Drift       │
│   YOUR                           │          beim Scrollen ]              │
│   SCENT.                         │                                       │  01 HERO
│                                  │                                       │  ~78 vh
│   Dein Lieblingsduft.            │                                       │
│   Dein VENT CELESTE Scent Code.  │                                       │
│                                  │                                       │
│   ▸ DUFTBERATUNG STARTEN         │                                       │
│                                  │                                       │
│   ─────────────────────────────  │                                       │
│   Schon beraten?  [ VC-___ ] →   │  ← Inline-Code-Feld, kein Sprung       │
└──────────────────────────────────┴───────────────────────────────────────┘
   7fr                                5fr   — asymmetrisch, Text links

┌────────────────────┬────────────────────┬────────────────────────────────┐
│ 30 ml              │ 30 % EXTRAIT       │ 29,90 €                        │  02 VERSPRECHEN
│ Flakongröße        │ Parfumkonzentration│ Hauptlinie                     │  Haarlinien-Raster
└────────────────────┴────────────────────┴────────────────────────────────┘

  MOST WANTED                                          Alle Bestseller →
  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌ ─ ─ ─                       03 MOST WANTED
  │VC-047│ │VC-049│ │VC-026│ │VC-035│ │VC-040│ │VC-02…   ← Scroll-Snap-Reihe
  │29,90 │ │29,90 │ │29,90 │ │29,90 │ │29,90 │ │          auch auf Desktop
  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └ ─ ─ ─    (◂ ▸ Pfeile)

┌──────────────────────────────────────────────────────────────────────────┐
│  [ vollflächiges Bild, dunkles Schema ]                                  │
│                                                                          │  04 ÜBER 120
│      DEIN DUFT IST NICHT DABEI?                                          │  Full-bleed,
│      Über 120 Duftprofile sind verfügbar. Schreib uns deinen             │  scheme-ink
│      Lieblingsduft — wir finden deinen Scent Code.                       │
│                                                                          │
│      ▸ AUF WHATSAPP FINDEN LASSEN                                        │
└──────────────────────────────────────────────────────────────────────────┘

  SO FUNKTIONIERT'S
  01 ──────────────────────── Lieblingsduft nennen                           05 ABLAUF
     Schreib uns per WhatsApp, welches Parfum du magst.                      3 Zeilen,
  02 ──────────────────────── Scent Code erhalten                            keine Karten,
     Wir nennen dir deinen passenden VENT CELESTE Code.                      Zahlen als
  03 ──────────────────────── Bestellen                                      Display-Typo
     Code eingeben, Ausführung wählen, fertig.

┌───────────────────────────────┬──────────────────────────────────────────┐
│                               │  DISCOVERY SET                           │  06 DISCOVERY
│   [ Bild 5 Proben ]           │  5 × 2 ml · 4,90 €                       │
│                               │  Fünf Scent Codes selbst zusammenstellen.│
│                               │  ▸ SET ZUSAMMENSTELLEN                   │
└───────────────────────────────┴──────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│              CODE BEREITS BEKANNT?                                       │
│              ┌────────────────────────┐                                  │  07 CODE
│              │  V C -  _ _ _          │  ▸ WEITER                        │  Zentriert,
│              └────────────────────────┘                                  │  ruhig
└──────────────────────────────────────────────────────────────────────────┘

┌────────────────┬─────────────────────────────────────────────────────────┐
│ [Makro Flakon] │  30 % EXTRAIT                                           │  08 EXTRAIT
│                │  Was hohe Konzentration bedeutet …                      │
└────────────────┴─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┬────────────────────────┐
│  TRAVEL 10 ML — für unterwegs                   │  [Bild]                │  09 TRAVEL
└─────────────────────────────────────────────────┴────────────────────────┘

  ── ESSENTIALS · 30 ml · ab 9,90 € ─────────────────── Ansehen →             10 ESSENTIALS
     Eine eigene Einstiegslinie für den Alltag.                               eine Zeile,
                                                                              deutlich klein

┌──────────────────────────────────────────────────────────────────────────┐
│   VENT CELESTE — Markenabschnitt (Mustertext, als Platzhalter markiert)   │  11 MARKE
└──────────────────────────────────────────────────────────────────────────┘

  NEWSLETTER  [ deine@adresse.de ]  ▸                                         12 NEWSLETTER
────────────────────────────────────────────────────────────────────────────
  FOOTER                                                                      FOOTER
```

Gestaltungsregeln, die durchgehalten werden:

- **Kein Abschnitt sieht aus wie der vorherige.** Es wechseln sich ab: Split 7/5,
  Haarlinien-Raster, Scroll-Reihe, Full-Bleed dunkel, Zeilenliste, Split 5/7,
  zentriert, Split 4/8, Split 8/4, Einzeiler.
- Genau **zwei** Abschnitte laufen im dunklen Schema (04 und 11) — sie setzen
  den Rhythmus. Der Rest bleibt Ivory.
- Essentials bekommt eine einzige Zeile, keinen eigenen Bildabschnitt.
  Es steht nie neben dem Extrait-Preis.

---

## 2. Mobile-Startseiten-Wireframe

Mobile wird zuerst entworfen. Alles unten ist die Ausgangskomposition, nicht
eine verkleinerte Desktop-Fassung.

```
┌─────────────────────────┐
│ ÜBER 120 DUFTPROFILE ›  │  Announcement, eine Zeile, keine Rotation
├─────────────────────────┤
│ ☰      [LOGO]      ⌕ ⊞ │  Header 56 px, Konto wandert ins Menü
└─────────────────────────┘
┌─────────────────────────┐
│                         │
│  ÜBER 120 DUFTPROFILE   │
│                         │
│  FIND                   │   ← Display, ~13 vw, 3 Zeilen
│  YOUR                   │
│  SCENT.                 │
│                         │
│  Dein Lieblingsduft.    │   ← max. 2 Zeilen
│  Dein Scent Code.       │
│                         │
│ ┌─────────────────────┐ │
│ │ DUFTBERATUNG STARTEN│ │   ← 52 px, volle Breite, primär
│ └─────────────────────┘ │
│                         │
│  Schon beraten?         │
│ ┌──────────────┬──────┐ │
│ │ VC-___       │  →   │ │   ← Code-Feld, Daumenzone
│ └──────────────┴──────┘ │
│                         │
│   [ Flakon, halb        │   ← Bild schneidet unten an:
│     angeschnitten ]     │      signalisiert „hier geht es weiter"
└─────────────────────────┘
   Alles darüber liegt oberhalb des Folds (iPhone SE, 568 px:
   Headline + Subline + Button + Codefeld passen; das Bild
   ist bewusst das Erste, was abgeschnitten wird)

┌─────────────────────────┐
│ 30 ml                   │  02 Versprechen: gestapelt,
├─────────────────────────┤     durch Haarlinien getrennt,
│ 30 % Extrait            │     keine Karten
├─────────────────────────┤
│ 29,90 €                 │
└─────────────────────────┘

 MOST WANTED
 ┌────────┐┌────────┐┌───     03 Scroll-Snap, 72 vw Kachelbreite,
 │ VC-047 ││ VC-049 ││ VC     die nächste Kachel lugt hervor
 │ 29,90 €││ 29,90 €││        (Affordance ohne Pfeile)
 │  [+]   ││  [+]   ││        [+] = Quick Add Extrait
 └────────┘└────────┘└───
 ● ○ ○ ○ ○ ○              ← Fortschrittspunkte, nicht klickbar
 [ Alle Bestseller ]

┌─────────────────────────┐
│  [ Bild, dunkel ]       │
│  DEIN DUFT IST          │  04 Über 120
│  NICHT DABEI?           │     Full-bleed, Text im Bild
│  Über 120 Duftprofile.  │
│ ┌─────────────────────┐ │
│ │ AUF WHATSAPP FRAGEN │ │
│ └─────────────────────┘ │
└─────────────────────────┘

 SO FUNKTIONIERT'S
 01 ───────────────────       05 Ablauf, gestapelt
    Lieblingsduft nennen
 02 ───────────────────
    Scent Code erhalten
 03 ───────────────────
    Bestellen

 … 06–12 gestapelt, jeweils Bild über Text,
   Abstände 56–72 px statt 96–160 px

╭───────────────────────────╮
│  ✆  Duftberatung          │  Sticky WhatsApp-Leiste,
╰───────────────────────────╯  erscheint ab ~40 % Scrolltiefe,
                               ausblendbar, respektiert safe-area-inset
```

**Mobile Härtefälle, die im Wireframe schon entschieden sind**

| Fall | Entscheidung |
|---|---|
| Sticky WhatsApp + Sticky Add-to-Cart auf Produktseiten | Add-to-Cart gewinnt. WhatsApp verschwindet dort vollständig — nie zwei gestapelte Leisten. |
| Tastatur öffnet sich beim Code-Feld | `inputmode="numeric"`, Feld scrollt in die obere Bildschirmhälfte, Sticky-Leisten werden bei Fokus ausgeblendet. |
| Layout Shift durch Hero-Bild | Feste `aspect-ratio`, `width`/`height` gesetzt, `fetchpriority="high"`. Der Platz steht, bevor das Bild da ist. |
| Touch Targets | Minimum 48 px, primäre Buttons 52 px, Abstand zwischen Zielen ≥ 8 px. |
| Scroll-Reihe vs. vertikales Scrollen | `scroll-snap-type: x mandatory` nur auf der X-Achse; `touch-action: pan-x pan-y` bleibt, damit vertikales Wischen nie blockiert. |

---

## 3. Hero-Konzept

### Aufbau

| Element | Inhalt | Regel |
|---|---|---|
| Eyebrow | ÜBER 120 DUFTPROFILE | Versalien, 11 px, Champagne-Akzent nur hier |
| Headline | `FIND YOUR SCENT.` | Display-Serif, `clamp(3rem, 13vw, 8.5rem)`, Zeilenhöhe 0.92, Tracking −0.03em |
| Subline | Dein Lieblingsduft. Dein VENT CELESTE Scent Code. | max. 2 Zeilen, nie mehr |
| Primär-CTA | DUFTBERATUNG STARTEN | öffnet WhatsApp mit vorbereiteter Nachricht |
| Sekundär | Schon beraten? `VC-___` → | **Inline-Eingabefeld**, kein Link auf eine andere Seite |
| Bild | freigestellter Flakon, ruhiger Ivory-Grund | Desktop rechts, Mobile angeschnitten unten |

Bewusst **nicht** im Hero: Duftfamilien, Filter, Duftfinder, Preisbanner, Countdown.

### Warum das Code-Feld direkt in den Hero gehört

Es gibt zwei völlig verschiedene Besuchertypen, und der Hero muss beide in
einem Blick bedienen:

- **Neu, kennt uns nicht** → Headline + WhatsApp-Button
- **Wurde beraten, hat VC-081 im Chat stehen** → will genau ein Feld, sofort

Ein Link „Scent Code eingeben" auf eine Unterseite kostet den zweiten Typ einen
kompletten Seitenaufruf — und das ist der Kunde mit der höchsten Kaufabsicht.
Deshalb ist das Feld im Hero, nicht dahinter.

### Bewegung im Hero

- Headline: drei Zeilen versetzt einblenden (0 / 60 / 120 ms), `opacity` + `translateY(14px)`, 320 ms
- Flakon: sehr langsame Parallax-Drift, maximal 24 px über die gesamte Hero-Höhe, per `transform` an `scroll` gekoppelt (`requestAnimationFrame`, kein Scroll-Listener-Sturm)
- Code-Feld: bei Fokus wächst die Unterlinie von links nach rechts, 200 ms
- Bei `prefers-reduced-motion`: alles sofort sichtbar, keine Drift, keine Verzögerung

Die Hero-Animation läuft **nach** dem ersten Paint, blockiert nichts und wird
übersprungen, wenn das Bild noch nicht geladen ist.

---

## 4. WhatsApp-Customer-Journey

### Der Weg

```
Startseite / beliebige Seite
        │
        │  Klick auf „Duftberatung starten"
        ▼
https://wa.me/491728439661?text=Hallo%20VENT%20CELESTE%2C%20ich%20suche%20…
        │
        │  WhatsApp öffnet (App auf Mobile, Web auf Desktop)
        │  Text steht bereits im Eingabefeld, Cursor am Ende
        ▼
Kunde ergänzt seinen Lieblingsduft und sendet
        │
        │  ── manuelle Beratung durch VENT CELESTE ──
        ▼
Antwort: „Dein Scent Code ist VC-081."
        │
        │  Kunde kehrt in den Shop zurück
        ▼
Code-Feld (Hero, Section 07, Header-Suche oder /pages/scent-code)
        │
        ├── Code ist ein öffentlicher Bestseller ──► /products/vc-081
        │                                            volle Produktseite
        │
        └── Code ist nicht öffentlich gelistet ────► /products/scent-code
                                                     Ausführung wählen,
                                                     Code fährt als
                                                     Positionsangabe mit
```

### Technik

**Rufnummer und Nachricht als Theme Settings**, nirgends hart codiert:

| Setting | Standard |
|---|---|
| `whatsapp_number` | `+49 172 8439661` |
| `whatsapp_message` | `Hallo VENT CELESTE, ich suche einen passenden Duft zu meinem Lieblingsparfum: ` |
| `whatsapp_enabled` | an |
| `whatsapp_sticky_mobile` | an |

Ein einziges Snippet `snippets/whatsapp-link.liquid` erzeugt die URL und wird
überall eingebunden. Es normalisiert die Nummer selbst, damit im Admin eine
lesbare Schreibweise stehen darf:

```
+49 172 8439661  →  entfernt + Leerzeichen - ( ) /  →  491728439661
URL:  https://wa.me/491728439661?text={{ nachricht | url_encode }}
```

`wa.me` ist der offizielle Kurzlink und funktioniert auf iOS, Android und Desktop.
Alle Links bekommen `target="_blank"` und `rel="noopener"`.

**Kontextabhängige Nachricht.** Das Snippet nimmt einen optionalen Zusatz:

| Ort | Nachricht |
|---|---|
| Hero, Section 04, Sticky | Grundtext (Kunde ergänzt selbst) |
| Produktseite VC-047 | Grundtext + `\n\n(Ich sehe mir gerade VC-047 an.)` |
| Leerer Warenkorb | Grundtext |
| Kein Suchtreffer für „VC-118" | Grundtext + `\n\n(Ich suche VC-118.)` |

Das kostet nichts und macht die Beratung für euch messbar schneller, weil der
Kontext schon im ersten Nachrichtentext steht.

### Wo WhatsApp auftaucht — und wo nicht

| Ort | Form |
|---|---|
| Hero | Primärer Button |
| Section 04 „Über 120 Duftprofile" | Primärer Button |
| Navigation → DUFTBERATUNG | Menüpunkt |
| Mobile Sticky-Leiste | ab 40 % Scrolltiefe, ausblendbar |
| Suche ohne Treffer | Textlink mit Kontext |
| Scent-Code-Seite bei ungültigem Code | Textlink mit Kontext |
| Footer | Textlink |
| **Produktseite mit Sticky Add-to-Cart** | **nicht** — Kaufabsicht schlägt Beratung |
| Checkout | **nicht** — Shopify-Hoheit, keine Ablenkung |

### Zwei Hinweise, die vor dem Livegang zu klären sind

1. **Datenschutz.** Wir binden nur einen Link ein, kein WhatsApp-Widget und kein
   Meta-Skript. Damit fließen erst Daten, wenn der Kunde selbst klickt — das ist
   die datenschutzfreundlichste Variante. Trotzdem gehört ein Absatz zu WhatsApp
   und Meta in die Datenschutzerklärung. Ein eingebettetes Chat-Widget würde ich
   ausdrücklich **nicht** empfehlen: Einwilligungsbanner, Drittanbieter-Skript,
   messbar langsamere Seite.
2. **Erreichbarkeit.** Der Button erzeugt die Erwartung einer Antwort. Wenn keine
   feste Antwortzeit zugesagt werden kann, sollte unter dem Button eine ehrliche
   Zeile stehen („Antwort meist innerhalb von 24 Stunden") — als Theme Setting,
   damit ihr sie jederzeit ändern oder leeren könnt.

---

## 5. Scent-Code-Bestelllogik

### 5.1 Normalisierung

Eine einzige Funktion, überall verwendet (Hero, Section 07, Suche, Code-Seite,
Discovery Set):

```
Eingabe          →  normalisiert
────────────────────────────────
47               →  VC-047
047              →  VC-047
 47              →  VC-047
vc47             →  VC-047
VC 047           →  VC-047
vc-047           →  VC-047
VC–047 (Bindestr.)→ VC-047
0047             →  ungültig (mehr als 3 Ziffern)
abc              →  ungültig
```

Regel: alles außer Ziffern verwerfen, führende Nullen entfernen, Zahl prüfen
(1 … `scent_code_max`, Theme Setting, Standard 130), auf drei Stellen mit
Nullen auffüllen, Präfix `VC-` (Präfix ebenfalls als Theme Setting, falls sich
das Schema später ändert).

### 5.2 Auflösung: öffentlich oder nicht?

```
             normalisierter Code VC-081
                        │
      ┌─────────────────┴─────────────────┐
      │ 1. Nachschlagen in der Code-Tabelle│  serverseitig gerendert,
      │    (öffentliche Produkte, ≤ 50)    │  0 ms, keine Netzanfrage
      └─────────────────┬─────────────────┘
              gefunden  │  nicht gefunden
      ┌─────────────────┘         │
      ▼                           ▼
/products/vc-081        ┌────────────────────────────────┐
volle Produktseite      │ 2. /search/suggest.json?q=VC-081│  native Shopify-Route,
                        │    fängt Produkte, die nach dem │  fängt später ergänzte
                        │    Seitenaufbau ergänzt wurden  │  Produkte ab
                        └───────────────┬────────────────┘
                                gefunden│ nicht gefunden
                        ┌───────────────┘        │
                        ▼                        ▼
                /products/vc-081     /products/scent-code?code=VC-081
                                     generischer Bestellweg
```

Die Code-Tabelle entsteht aus einer im Theme Setting gewählten Collection
(„Öffentliche Düfte") und wird als kleines JSON-Objekt in die Seite gerendert:

```json
{"VC-047":"vc-047","VC-049":"vc-049", … }
```

Bei 20 Produkten sind das ~500 Byte. Sie enthält **nur** Code und Handle —
keine internen Referenzen, keine Preise, keine Fremdmarken.

**Es gibt keine Sackgasse.** Jeder gültig formatierte Code führt entweder auf
eine Produktseite oder in den generischen Bestellweg. Ein ungültiger Code
(Buchstaben, außerhalb des Bereichs) führt zu einer ruhigen Fehlermeldung plus
WhatsApp-Link mit Kontext — nicht zu einer 404.

### 5.3 Der generische Bestellweg

**Ein einziges Shopify-Produkt** trägt das gesamte nicht öffentlich gelistete
Sortiment:

| | |
|---|---|
| Titel | `VENT CELESTE Scent Code` |
| Handle | `scent-code` |
| Template | `product.scent-code` |
| Option 1 | `Ausführung` |
| Varianten | Extrait 30 ml 29,90 € · Eau de Parfum 30 ml 22,90 € · Travel 10 ml 12,90 € · Sample 2 ml 1,00 € |

Der Kunde gibt den Code ein, wählt die Ausführung, legt in den Warenkorb.
Beim Absenden hängen zwei Positionsangaben am nativen Produktformular:

```
properties[Scent Code] = VC-081      ← sichtbar für Kunde und Händler
properties[_vc_code]   = VC-081      ← versteckt, maschinenlesbar für Export
```

Damit steht im Shopify-Admin an der Bestellposition:

```
VENT CELESTE Scent Code
Extrait 30 ml
Scent Code: VC-081
```

Das ist **keine Frontend-Lösung**: Positionsangaben sind natives Shopify. Sie
überleben den Checkout, stehen in der Bestellbestätigung, im Admin, auf dem
Lieferschein, in jedem Bestell-Export und in der API. Es gibt keinen zweiten
Datenspeicher, der auseinanderlaufen könnte.

### 5.4 Warum nicht anders gelöst

| Alternative | Warum nicht |
|---|---|
| 130 Produkte anlegen, 110 davon unveröffentlicht | Unveröffentlichte Produkte lassen sich über die Storefront nicht in den Warenkorb legen. Technisch unmöglich. |
| 130 Varianten am generischen Produkt | 130 × 4 = 520 Varianten. Überschreitet das klassische Limit von 100, macht Bestandsführung und Variantenauswahl unbedienbar. |
| Bestellattribut auf Auftragsebene (`attributes[…]`) | Gilt für die ganze Bestellung. Zwei verschiedene Codes im selben Warenkorb wären nicht unterscheidbar. |
| Codes nur im Bestellhinweis-Freitextfeld | Ein Feld für den ganzen Warenkorb, unstrukturiert, nicht exportierbar, fehleranfällig. |
| Eigene App / Cart Transform Function | Würde saubere Bestandsführung je Code erlauben — kostet aber ein Entwicklungsprojekt. Für V2 nicht nötig. |

**Positionsangaben sind hier nicht der Kompromiss, sondern das richtige Modell.**

### 5.5 Ehrliche Grenzen

1. **Keine serverseitige Prüfung des Codes.** Format und Bereich werden im Browser
   geprüft. Ein manipuliertes Formular könnte einen unsinnigen Code senden. Eine
   echte serverseitige Prüfung bräuchte eine Cart-Validation-Function, also eine
   eigene App. Praktisch geringes Risiko — ihr seht den Code vor dem Versand.
2. **Kein Bestand je Code.** Der generische Artikel führt einen Sammelbestand.
   Ob VC-081 gerade abfüllbar ist, weiß Shopify nicht. Solange ihr auf Bestellung
   abfüllt, ist das korrekt abgebildet; sonst braucht es eine App.
3. **Der generische Artikel darf nicht in normalen Rastern auftauchen** — sonst
   erscheint dort „ab 1,00 €". Er bekommt eine eigene Landingpage und wird aus
   Bestseller- und Shop-Collections herausgehalten.
4. **Kein Produkt-Schema (JSON-LD) für den generischen Artikel.** Ein Produkt mit
   Preisspanne 1,00–29,90 € ohne konkreten Duft wäre für Google irreführend.
   Der Artikel bleibt indexierbar, bekommt aber kein `Product`-Markup.

### 5.6 Der Code im Warenkorb

Der Cart Drawer zeigt Positionsangaben bereits an (aus V1). Für den Scent Code
bekommt die Zeile eine hervorgehobene Darstellung:

```
┌────┬────────────────────────────────────┐
│    │ VENT CELESTE Scent Code            │
│[  ]│ Extrait 30 ml                      │
│    │ ▸ SCENT CODE: VC-081               │  ← Versalien, Akzentlinie links
│    │ [− 1 +]                    29,90 € │
└────┴────────────────────────────────────┘
```

So sieht der Kunde vor dem Checkout, dass sein Code mitgeht — das ist die
wichtigste Vertrauensfrage dieses Bestellwegs.

---

## 6. Bestseller-Darstellung

### 6.1 Datenmodell der 20

Jeder Bestseller ist ein normales Shopify-Produkt:

| Feld | Wert |
|---|---|
| Titel | `VC-047` |
| Handle | `vc-047` |
| Vendor | `VENT CELESTE` |
| Option 1 `Ausführung` | Extrait 30 ml · Eau de Parfum 30 ml · Travel 10 ml · Sample 2 ml |
| `custom.scent_code` | `VC-047` |
| `custom.hauptvariante` | Extrait 30 ml |
| Tags | `bestseller`, `oeffentlich`, `familie:…` |
| `internal.referenz` | interne Zuordnung — **Storefront-Zugriff aus** |

Der Titel **ist** der Code. Das ist die wichtigste Entscheidung hier: Shopify-Suche,
URL, Breadcrumb, Bestellbestätigung und Lieferschein tragen dann automatisch den
Code, ohne dass irgendwo etwas synchronisiert werden muss.

Öffentliche Darstellung:

```
VC-047
VENT CELESTE
Extrait de Parfum
30 ml · 30 %
29,90 €
```

Duftnoten und Beschreibung bleiben leer, bis echte Daten vorliegen — das Theme
lässt leere Metafelder ersatzlos entfallen (bereits so gebaut).

### 6.2 MOST WANTED auf der Startseite

6–8 Produkte in einer horizontalen Scroll-Snap-Reihe.

**Keine Slider-Library.** Begründung, wie gefordert:

| Technik | Gewicht | Ergebnis |
|---|---|---|
| CSS `scroll-snap` + `overflow-x: auto` | **0 KB** | natives Momentum-Scrolling, korrektes Wischen, funktioniert ohne JS |
| Swiper.js | ~45 KB gzip | dieselbe Wirkung, plus Layout-Shift-Risiko und Touch-Konflikte |

Für Pfeile auf Desktop und die Fortschrittspunkte auf Mobile reichen ~40 Zeilen
Vanilla JS (`scrollBy`, `IntersectionObserver`). Ohne JavaScript bleibt die Reihe
voll benutzbar — sie ist ein scrollbarer Container, kein Widget.

Details:
- Kachelbreite Mobile `72vw`, Desktop `minmax(240px, 1fr)`, 5 sichtbar
- `scroll-padding-inline` = Seitenrand, damit die erste Kachel bündig steht
- Die angeschnittene nächste Kachel ist die Wisch-Affordance — keine Pfeile auf Mobile
- Fokus per Tastatur scrollt die Kachel automatisch in den Blick
- `[+] Quick Add` legt direkt die Extrait-Variante in den Warenkorb und öffnet den Drawer

### 6.3 Bestseller-Collection

`/collections/bestseller` — alle 20, normales Raster mit Filtern.
Eigenes Template `collection.bestseller` mit editorialem Kopf statt nüchterner
Collection-Überschrift.

### 6.4 Preisdarstellung — das „ab 1 €"-Problem

Mit Sample = 1,00 € ist das der kritischste Punkt der ganzen V2.

Das Theme gibt bereits **nirgends** `price_min` oder „ab" aus. V2 erweitert die
Auflösung um den Kontext:

```
1. Explizite Vorgabe der Section              (z. B. „Sample-Reihe")
2. Collection-Metafeld  custom.karten_variante   sample | travel | edp | extrait
3. Produkt-Metafeld     custom.hauptvariante
4. erste verfügbare 30-ml-Variante
5. erste verfügbare Variante
```

Ergebnis:

| Kontext | Karte zeigt |
|---|---|
| Startseite, Bestseller, Shop | `29,90 €` — Extrait |
| Sample-Collection | `1,00 €` |
| Travel-Collection | `12,90 €` |
| Essentials-Collection | `9,90 €` |

Zusätzlich prüfe ich beim Bau jede Karte gegen die Regel:
**Wenn die angezeigte Variante nicht der Kontextvariante entspricht, wird der
Preis mit der Ausführung beschriftet** (`29,90 € · Extrait 30 ml`) — damit der
Kunde nie einen Preis ohne Bezugsgröße sieht.

---

## 7. Navigation

### Desktop

```
SHOP ▾                    DUFTBERATUNG ▾              VENT CELESTE ▾
  Bestseller                WhatsApp-Beratung  ✆        Über uns
  Alle öffentlichen Düfte   Scent Code bestellen        FAQ
  Extrait                   ─────────────────           Kontakt
  Travel                    Duftfinder
  Samples                   Duftwelten ▸
  Discovery Set
  Essentials                                     rechts:  ⌕   ♢   ⊞
```

Änderungen gegenüber V1:

- „DÜFTE" wird zu **SHOP** und ist nach Verkaufsform sortiert, nicht nach Duftfamilie.
- „ENTDECKEN" wird zu **DUFTBERATUNG** — der neue Hauptweg bekommt einen eigenen
  Menüpunkt in der obersten Ebene.
- Die **Duftfamilien verlassen die erste Menüspalte.** Sie liegen unter
  DUFTBERATUNG → Duftwelten als aufklappbare zweite Ebene. Vorhanden für
  Stöberer, aber nicht mehr der Einstieg.
- Die redaktionelle Fläche im Mega-Menü zeigt nicht mehr das Discovery Set,
  sondern die **WhatsApp-Beratung**.
- Der Menüpunkt „WhatsApp-Beratung" öffnet direkt WhatsApp (erkennbar am ✆),
  keine Zwischenseite.

### Mobile

Bewusst flacher als Desktop:

```
┌──────────────────────────┐
│ ⌕ Suchen oder VC-Code    │  ← immer sichtbar, oberstes Element
├──────────────────────────┤
│ ✆  DUFTBERATUNG STARTEN  │  ← primärer Button, nicht im Fließtext
├──────────────────────────┤
│ Scent Code bestellen   → │
│ Bestseller             → │
│ Alle Düfte             → │
│ Discovery Set          → │
├──────────────────────────┤
│ Extrait · Travel ·       │  ← zweispaltig, kleinere Typo
│ Samples · Essentials     │
├──────────────────────────┤
│ Duftwelten             ▾ │  ← eingeklappt
├──────────────────────────┤
│ Über uns · FAQ · Kontakt │
│ Konto                  → │
└──────────────────────────┘
```

Die vier wichtigsten Ziele stehen ohne Aufklappen da. Kein verschachteltes
Akkordeon für den Hauptweg.

### Suchfeld im Header

Das Feld erkennt Codes und beantwortet sie **vor** der normalen Suche:

```
Eingabe: 47
┌────────────────────────────────────┐
│ SCENT CODE                         │
│ ▸ VC-047 · Extrait 30 ml · 29,90 € │  ← direkter Treffer, oben
├────────────────────────────────────┤
│ DÜFTE                              │
│   … normale Suchergebnisse …       │
└────────────────────────────────────┘
```

Ist VC-047 nicht öffentlich gelistet:

```
│ SCENT CODE                         │
│ ▸ VC-047 bestellen                 │  → generischer Bestellweg
```

---

## 8. Animations- und JavaScript-Konzept

### Grundsätze

- **Keine externe Library.** Geprüft und für nicht nötig befunden:
  Slider (CSS Scroll Snap reicht), Scroll-Animation (IntersectionObserver reicht,
  bereits vorhanden), Parallax (`requestAnimationFrame` + `transform`),
  Zahlen-Zähler (nicht vorgesehen). Sollte sich beim Bauen doch eine Library
  aufdrängen, melde ich das vorher mit Gewicht und Begründung.
- Nur `transform` und `opacity`. Kein `width`, `height`, `top`, `filter` in Animationen.
- 160–350 ms, ein einziges Easing-Token.
- `prefers-reduced-motion: reduce` schaltet **alles** ab, auch Parallax und Scroll-Reveal.
- Jede Animation ist Zierde: Die Seite ist ohne sie vollständig bedienbar.

### Die zehn Interaktionen

| # | Interaktion | Technik | Dauer |
|---|---|---|---|
| 1 | Scroll Reveal | IntersectionObserver, `opacity`+`translateY(14px)`, gestaffelt 60 ms | 320 ms |
| 2 | Hero Product Motion | `rAF`-gekoppelte Drift, max. 24 px | fortlaufend |
| 3 | Scent-Code-Eingabe | Unterlinie wächst bei Fokus; bei Erfolg kurzer Haken, dann Weiterleitung; bei Fehler seitliches Wackeln 2× 6 px | 200 / 240 ms |
| 4 | Mobile Product Swipe | CSS `scroll-snap`, Punkte per IntersectionObserver | nativ |
| 5 | Quick Add | Button wird zu Haken, Warenkorbzähler zählt hoch, Drawer öffnet | 240 ms |
| 6 | Cart Drawer | vorhanden, Slide-in von rechts | 420 ms |
| 7 | Sticky WhatsApp | erscheint ab 40 % Scrolltiefe, `translateY` | 240 ms |
| 8 | Sticky Add-to-Cart | vorhanden, erscheint wenn Hauptbutton außer Sicht | 240 ms |
| 9 | Navigation Transitions | Mega-Menü `opacity`+`translateY(-6px)`; mobiler Drawer Slide | 200 / 320 ms |
| 10 | Bildeinblendung | `opacity` beim `load`-Event, feste Maße, kein Shift | 300 ms |

### JavaScript-Budget

| Datei | Status | ~Größe |
|---|---|---|
| `theme.js` | bleibt, ergänzt um Reveal-Staffelung und Sticky-Logik | 13 → ~15 KB |
| `scent-code.js` | **neu** — Normalisierung, Auflösung, alle Code-Felder | ~4 KB |
| `product-card-swipe.js` | **neu** — Pfeile, Punkte, Quick Add | ~2 KB |
| `product-form.js` | erweitert um vollständigen Variantenwechsel | 2 → ~5 KB |
| `cart-drawer.js`, `facets.js`, `predictive-search.js`, `discovery-set.js`, `recommendations.js` | unverändert bzw. minimal ergänzt | — |
| `scent-finder.js` | bleibt (Duftfinder existiert weiter, nur nicht mehr prominent) | — |

**Gesamtbudget: unter 30 KB unkomprimiertes JavaScript für die Startseite**,
davon nichts blockierend. Alles `defer`, Komponenten-Skripte nur auf den Seiten,
die sie brauchen.

### Variantenwechsel — technische Lösung

Anforderung: Preis, Konzentration, Größe, Grundpreis, SKU, Verfügbarkeit und Bild
müssen korrekt wechseln, und ein Eau de Parfum darf niemals „30 %" zeigen.

Ursache des Problems in V1: `konzentration_prozent` liegt auf **Produktebene**.
Bei einem Produkt mit Extrait und EDP ist das zwangsläufig falsch.

Lösung: Die Angaben wandern auf **Variantenebene**.

| Neues Varianten-Metafeld | Beispiel Extrait | Beispiel EDP |
|---|---|---|
| `custom.konzentration` | Extrait | Eau de Parfum |
| `custom.konzentration_prozent` | 30 | 20 |
| `custom.fuellmenge` | 30 ml | 30 ml |

Beim Rendern schreibt Liquid ein kleines Datenobjekt in die Seite, mit
**bereits fertig formatierten** Werten:

```json
{"41234": {"price":"29,90 €","unit":"99,67 €/100 ml","sku":"VC-047-EXT",
           "available":true,"conc":"Extrait","pct":"30","size":"30 ml","img":3}}
```

Warum vorformatiert und nicht im Browser berechnet: Währungsformat, Grundpreis
und Übersetzungen kommen so aus Shopify statt aus nachgebauter JS-Logik — kein
Rundungsfehler, keine falsche Trennzeichen, keine Netzanfrage, kein Flackern.
Vier Varianten ergeben ~600 Byte.

Das Produkt-Metafeld `konzentration` bleibt zusätzlich bestehen — aber nur noch
als Filterwert für die Collection-Filter, nicht mehr als Anzeigequelle.

---

## 9. Was unverändert bleibt

Das ist der größere Teil. Die V1-Technik trägt V2 ohne Umbau:

| Bereich | Status |
|---|---|
| OS-2.0-Struktur, JSON-Templates, Section Groups | unverändert |
| `layout/theme.liquid`, `layout/password.liquid` | unverändert |
| Farbsystem, `color_scheme_group`, `css-variables.liquid` | unverändert (Werte werden nachgeschärft) |
| Cart Drawer inkl. Section Rendering API | unverändert, nur Scent-Code-Darstellung ergänzt |
| Filter (`facets.liquid`, `facets.js`, `component-facets.css`) | unverändert |
| Predictive Search Grundgerüst | unverändert, Code-Erkennung vorgeschaltet |
| Discovery-Set-Grundlogik (Positionsangaben, Nachladen über 50 Produkte) | unverändert, nur Preis, Zähler und Beschriftung |
| Duftfinder (`scent-finder.liquid/.js`) | unverändert, wandert in die zweite Ebene |
| Kundenkonto-Templates (7 Dateien) | unverändert |
| Blog, Artikel, 404, Passwort, Geschenkgutschein, Kontaktformular, FAQ | unverändert |
| `pagination.liquid`, `product-price.liquid`, `product-reviews.liquid`, `icon.liquid` | unverändert bzw. minimal ergänzt |
| Barrierefreiheit: Skip-Link, Fokusfalle, Fokusringe, Reduced Motion | unverändert, neue Bausteine folgen denselben Regeln |
| Grundpreis nach PAngV, Steuerhinweis | unverändert |
| Locales-Struktur de/en | unverändert, Schlüssel kommen hinzu |
| Metafelder aus V1 | bleiben; drei wandern zusätzlich auf Variantenebene |

**Nicht angefasst wird der Checkout.** Wie in V1 bleibt alles, was Geld,
Bestand, Rabatte und Bestellungen betrifft, vollständig bei Shopify.

---

## 10. Konkret zu ändernde Dateien

### Neu (12)

| Datei | Zweck |
|---|---|
| `snippets/whatsapp-link.liquid` | Nummer normalisieren, URL bauen, überall wiederverwendet |
| `snippets/scent-code-field.liquid` | Das Code-Eingabefeld in drei Größen (Hero, Section, Menü) |
| `snippets/scent-code-map.liquid` | Rendert die JSON-Tabelle der öffentlichen Codes |
| `assets/scent-code.js` | Normalisierung, Auflösung, Fehlerbehandlung |
| `assets/product-card-swipe.js` | Scroll-Reihe: Pfeile, Punkte, Quick Add |
| `sections/hero-v2.liquid` | Neuer Hero mit Code-Feld und WhatsApp-CTA |
| `sections/product-row.liquid` | MOST WANTED als Scroll-Snap-Reihe |
| `sections/whatsapp-feature.liquid` | Section 04 „Über 120 Duftprofile", full-bleed |
| `sections/how-it-works.liquid` | Section 05, drei Zeilen statt drei Karten |
| `sections/scent-code-entry.liquid` | Section 07 auf der Startseite |
| `sections/main-product-scent-code.liquid` | Generischer Bestellweg |
| `templates/product.scent-code.json` | Template dafür |
| `templates/collection.bestseller.json` | Bestseller mit editorialem Kopf |
| `assets/section-scent-code.css`, `assets/section-product-row.css` | zugehöriges CSS |

### Geändert (14)

| Datei | Änderung |
|---|---|
| `config/settings_schema.json` | Gruppe „WhatsApp-Beratung" (Nummer, Nachricht, Sticky, Antwortzeit); Gruppe „Scent Code" (Präfix, Höchstnummer, Collection öffentlicher Düfte); Typografie-Werte für den Editorial-Look; Logo als Inline-SVG |
| `config/settings_data.json` | Neue Standardwerte, nachgeschärfte Farb- und Typo-Werte |
| `templates/index.json` | Komplett neue Reihenfolge (12 Abschnitte) |
| `sections/header.liquid` | Menüstruktur SHOP/DUFTBERATUNG/VENT CELESTE, WhatsApp im Mega-Menü, Code-Erkennung im Suchfeld, flacheres mobiles Menü |
| `sections/header-group.json` | Neue Voreinstellungen, Announcement-Text |
| `snippets/product-card.liquid` | Kontextabhängige Preisvariante, Quick Add, Code als Titel |
| `snippets/predictive-search`-Section | Scent-Code-Trefferblock ganz oben |
| `sections/main-search.liquid` | Code-Erkennung, kein Sackgassen-Zustand ohne Treffer |
| `sections/main-product.liquid` | Vollständiger Variantenwechsel über Datenobjekt, Konzentration je Variante |
| `assets/product-form.js` | Preis, Grundpreis, SKU, Konzentration, Größe, Verfügbarkeit, Bild |
| `sections/discovery-set.liquid` | Preis 4,90 €, Zähler `0 / 5`, Auswahl über Scent Codes |
| `sections/cart-drawer.liquid` | Scent Code hervorgehoben darstellen |
| `assets/base.css` | Editorial-Typo-Skala, dunkles Schema, Sticky-Leisten, Scroll-Snap-Grundlagen |
| `assets/theme.js` | Gestaffeltes Reveal, Sticky-Steuerung, Kollisionsregel Sticky-Leisten |
| `locales/de.default.json`, `locales/en.json` | ~40 neue Schlüssel (Scent Code, WhatsApp, Ablauf, Scroll-Reihe) |
| `README.md` | V2-Stand, neue Metafelder, neue Einrichtungsschritte |

### Entfällt aus der Startseite (bleibt im Theme verfügbar)

`sections/scent-worlds.liquid` und `sections/scent-finder-teaser.liquid` bleiben
als Sections erhalten und können jederzeit wieder eingeblendet werden — sie
stehen nur nicht mehr in `index.json`.

### Neue Metafelder

| Ebene | Key | Typ | Zweck |
|---|---|---|---|
| Produkt | `custom.scent_code` | Text | `VC-047`, Grundlage der Code-Tabelle |
| **Variante** | `custom.konzentration` | Text | Extrait / Eau de Parfum |
| **Variante** | `custom.konzentration_prozent` | Text | 30 / 20 |
| **Variante** | `custom.fuellmenge` | Text | 30 ml / 10 ml / 2 ml |
| Collection | `custom.karten_variante` | Text | steuert die Preisvariante auf Karten |

---

## 11. Schutz der internen Referenzdaten

Die 20 Zuordnungen zu Originalparfums sind interne Betriebsdaten. Sie stehen
ausschließlich im Metafeld `internal.referenz` mit **deaktiviertem
Storefront-Zugriff** — dadurch sind sie für Liquid und die Storefront-API
technisch nicht lesbar und können nicht versehentlich gerendert werden.

**Die eigentliche Gefahr liegt nicht im Theme, sondern in den Produktdaten.**
Diese Felder sind öffentlich abrufbar, unter anderem über
`/products.json` und `/collections/<handle>/products.json`:

| Feld | öffentlich? |
|---|---|
| Produkttitel, Beschreibung, Vendor, Produkttyp | **ja** |
| **Tags** | **ja** |
| Variantentitel, SKU | **ja** |
| Bild-Dateiname und Alt-Text | **ja** |
| SEO-Titel und -Beschreibung, Handle | **ja** |
| Metafeld mit Storefront-Zugriff | ja |
| Metafeld ohne Storefront-Zugriff | nein |

Daraus folgen fünf harte Regeln für die Produktpflege:

1. Keine Fremdmarke im Titel, in der Beschreibung, im Handle oder in den SEO-Feldern.
2. **Keine Fremdmarke als Tag.** Tags wirken intern, sind es aber nicht.
3. Keine Fremdmarke im SKU und keine im Bilddateinamen oder Alt-Text.
4. Keine Fremdmarke in einem Metafeld mit Storefront-Zugriff.
5. Keine automatisch übernommenen Duftnoten aus den Originalprodukten.

Auf Theme-Seite prüfe ich vor Auslieferung, dass in Produktkarten, Produktseiten,
Meta-Tags, JSON-LD, HTML-Kommentaren und allen JS-Datenobjekten ausschließlich
`custom.*`-Felder verwendet werden und `internal.*` nirgends referenziert wird.

Zusatzhinweis ohne Beschönigung: Auch ein Metafeld ohne Storefront-Zugriff ist
für jedes Mitarbeiterkonto und jede App mit Produkt-Leserecht sichtbar. Wenn die
Zuordnung wirklich unter Verschluss bleiben soll, gehört sie nicht in Shopify,
sondern in eine getrennte Liste — im Shop stünde dann nur `internal.sortiments_id`.

---

## 12. Drei Punkte, die aus dem neuen Modell kippen

Diese Beobachtungen ändern nichts am Auftrag, sollten aber vor dem Launch
entschieden werden.

### 12.1 Das Discovery Set hat seinen Preisvorteil verloren

| | alt | neu |
|---|---|---|
| Sample einzeln | 3,90 € | 1,00 € |
| 5 Samples einzeln | 19,50 € | 5,00 € |
| Discovery Set | 14,90 € | 4,90 € |
| **Ersparnis** | **23 %** | **2 %** |

Bei 2 % Ersparnis ist das Set kein Preisargument mehr, sondern nur noch
Bequemlichkeit. Drei Wege:

- **belassen** und als „fünf Proben, ein Paket" kommunizieren (ehrlich, aber schwach)
- **auf 3,90 € senken** → wieder ein sichtbarer Vorteil von 22 %
- **Set entfallen lassen** und stattdessen fünf Samples einzeln mit Mengenrabatt

Meine Empfehlung: Set behalten, Preis auf 3,90 € — eine feste Zahl im Kopf
(„fünf Düfte für 3,90 €") verkauft besser als ein Rabatt, den man ausrechnen muss.
Technisch ist der Preis ohnehin ein Shopify-Wert, im Theme steht nichts fest.

### 12.2 Eine 1-€-Bestellung kostet euch Geld

Bei Sample = 1,00 € kann jemand für 1,00 € bestellen. Porto, Verpackung und
Zahlungsgebühr liegen darüber. Shopify-native Gegenmittel, ohne App:

- Mindestbestellwert über die Versandeinstellungen (Preisstaffel, unterhalb
  greift ein hoher Versandsatz) — grob, aber wirksam
- Samples als reines Zusatzprodukt: nur auf Produktseiten und im Warenkorb
  erreichbar, keine eigene Collection in der Navigation
- gestaffelter Versand: Proben-Sendungen als Warenpost mit eigenem Tarif

Ich würde für V2 die Sample-Collection **nicht** in die Hauptnavigation nehmen
und Samples als Ergänzung führen. Das ist auch die bessere Geschichte.

### 12.3 20 öffentliche Produkte sind wenig für Filter

Die Filterleiste mit acht Achsen wurde für 130 Produkte gebaut. Bei 20 öffentlichen
Produkten ist sie überdimensioniert: Fast jeder Filter führt auf ein bis drei Treffer.

Vorschlag: Auf `/collections/bestseller` und den öffentlichen Collections nur
**Duftfamilie, Charakter und Konzentration** anzeigen und die übrigen Achsen erst
einblenden, wenn eine Collection mehr als 30 Produkte enthält. Das ist eine
Zeile Logik im Theme und lässt die Seite nicht leer wirken. Sobald ihr mehr Düfte
öffentlich stellt, erscheinen die Filter von selbst.

---

## Freigabe

Nach eurem OK baue ich in dieser Reihenfolge:

1. Fundament: Theme Settings, WhatsApp-Snippet, Scent-Code-Logik, Typo- und Farbnachschärfung
2. Hero, MOST WANTED, Section 04, Ablauf, Code-Section — die neue Startseite
3. Navigation, Suche mit Code-Erkennung, mobiles Menü
4. Generischer Bestellweg, Produktseite mit vollständigem Variantenwechsel, Produktkarten
5. Discovery Set, Cart Drawer, Sticky-Leisten
6. Durchgang Mobile, Performance, Barrierefreiheit, Theme Check, README, ZIP

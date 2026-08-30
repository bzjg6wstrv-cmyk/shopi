# Shopify Inbox – Chatbutton im VENT-CELESTE-Design

Stand: 30.08.2026 · Theme v6.1.5

## Kurzfassung

Der Chatbutton lässt sich **nicht vollständig über Theme-CSS** gestalten. Er liegt in
einem iframe, das Shopify von einer eigenen Domain ausliefert. Alles, was *innerhalb*
des Buttons liegt – Hintergrundfarbe, Symbol, Beschriftung, Eckenradius – ist für
Theme-Code unerreichbar (Same-Origin-Policy). Diese Punkte werden in den
Inbox-Einstellungen gesetzt, wo Shopify sie ausdrücklich anbietet.

Von *außen* erreichbar ist das iframe-Element selbst. Darüber steuert das Theme jetzt
die Platzierung: Abstand nach unten, Freihalten der Beratungs- und Warenkorb-Leiste,
Sicherheitsabstand für Geräte mit Notch und die Stapelreihenfolge gegenüber
Warenkorb-Schublade und Suche.

Die Arbeit teilt sich also auf: **Aussehen → Inbox-Einstellungen. Platzierung → Theme.**
Beides ist unten beschrieben. Ohne Schritt 1 bleibt der Button weiß.

---

## 1. In Shopify Inbox einstellen (das Aussehen)

*Vertriebskanäle → Inbox → Chat-Einstellungen → Darstellung* (bei Shopify unter
„Aktivator“ / „Activator“ geführt).

| Einstellung | Wert | Warum |
|---|---|---|
| Hintergrundfarbe | `#0A0A0A` | Deckt sich mit der Schrift- und Leistenfarbe des Themes |
| Schriftfarbe | `#F7F2E8` | Das Creme des Themes, identisch zur Beratungsleiste |
| Symbol | Sprechblase, schlichteste Variante | Kein Support-Headset, keine Signalfarbe |
| Beschriftung | kürzeste verfügbare Option | Je kürzer, desto kompakter der Button |
| Position | unten rechts | Die Beratungsleiste läuft über die volle Breite; rechts entsteht der ruhigste Stapel |

Die beiden Farbwerte stammen aus dem Theme: `#0A0A0A` entspricht `--color-text`
(11 11 10), `#F7F2E8` entspricht `--color-background` (247 242 232). Damit trägt der
Button exakt dieselbe Farbkombination wie die WhatsApp-Beratungsleiste darüber.

### „Duftberatung“ als Beschriftung

**Das geht in Shopify Inbox nicht.** Die Beschriftung ist kein Freitextfeld, sondern
eine Auswahlliste mit festen Optionen („Chat“, „Hilfe“, „Support“ und Entsprechungen).
Eigener Text ist nur über Dritt-Apps möglich, die den Aktivator ersetzen – das würde
eine weitere App bedeuten und die native Inbox-Funktion anfassen. Beides wurde hier
bewusst nicht gemacht.

Der Begriff steht bereits an zwei anderen Stellen: in der mobilen Beratungsleiste
(Theme-Einstellung `whatsapp_sticky_label`) und im Menüpunkt „Duftberatung“. Die
Marke ist damit besetzt, ohne die Inbox-Funktion zu verbiegen.

---

## 2. Was das Theme übernimmt (die Platzierung)

Neu unter *Theme-Einstellungen → Chatbutton (Shopify Inbox)*:

| Einstellung | Standard | Wirkung |
|---|---|---|
| Platzierung durch das Theme steuern | an | Hauptschalter. Aus = Theme fasst den Button nicht an |
| Abstand nach unten (Mobil) | 16 px | Zusätzlich zur automatisch berücksichtigten Leiste |
| Abstand nach unten (Desktop) | 24 px | Am Schreibtisch gibt es keine Leisten unten |
| Seitlicher Abstand | „Nicht verändern“ | Nur setzen, wenn die Ecke bekannt ist |
| Abstand zum Seitenrand | 16 px | Wirkt nur bei gewählter Ecke |

**Automatisch berücksichtigt, ohne Zutun:**

- **Beratungsleiste:** Ist `body.has-whatsapp-bar` gesetzt, rückt der Button um deren
  Höhe (3,5 rem) nach oben. Die Leiste verdeckt ihn nicht mehr.
- **Warenkorb-Leiste auf Produktseiten:** `body.has-sticky-atc` hebt den Button um
  4,25 rem. Beide Fälle schließen sich gegenseitig aus, wie im Theme vorgesehen.
- **Geräte mit Notch:** `env(safe-area-inset-bottom)` kommt oben drauf.
- **Stapelreihenfolge:** Der Button liegt auf `--z-sticky-bar` (50) – über dem
  Kopfbereich (40), aber unter Abdunkler (60) und Schubladen (70). Geöffnete
  Warenkorb-Schublade, Suche und Menü verdecken ihn jetzt, statt dass er darüber liegt.

Warum „Seitlicher Abstand“ standardmäßig nichts tut: Das Theme kann nicht auslesen, in
welcher Ecke Inbox den Button ausgibt. Ein blind gesetztes `right` würde einen links
platzierten Button auf die andere Seite schieben. Erst wenn du die Ecke ausdrücklich
angibst, greift die Regel.

---

## 3. Bewusst nicht gemacht

**Kein `transform: scale()` zum Verkleinern.** iOS Safari legt ein `position: fixed`-
Element mit eigenem `transform` in eine separate Compositing-Ebene und zeichnet es beim
Scrollen nicht zuverlässig neu. Genau daran ist in diesem Theme schon die
Beratungsleiste gescheitert – der Kommentar dazu steht in `base.css` bei `.sticky-bar`.
Ein kompakterer Button entsteht stattdessen über Symbol und kurze Beschriftung in den
Inbox-Einstellungen.

**Kein Schatten und kein Eckenradius von außen.** Das iframe ist transparent, der
sichtbare Button darin gerundet. Ein `box-shadow` auf dem iframe zeichnet ein
Rechteck um den runden Button – sichtbar als Kasten in der Luft. Ein `border-radius`
mit `overflow: hidden` würde die Rundung des inneren Buttons anschneiden. Beides wäre
schlechter als der Ist-Zustand.

**Keine Farbänderung per `filter` oder `mix-blend-mode`.** Damit ließe sich ein weißer
Button optisch einfärben, aber unkontrolliert: Symbol, Text und Zustände beim Tippen
würden mitgefärbt, der Kontrast wäre nicht mehr vorhersagbar. Die Farbe gehört in die
Inbox-Einstellungen, wo sie sauber unterstützt ist.

---

## 4. Prüfen nach dem Deployment

1. Startseite mobil öffnen, scrollen bis die Beratungsleiste erscheint → Chatbutton
   sitzt sichtbar **über** der Leiste, nichts überlappt
2. Produktseite mobil, scrollen bis die Warenkorb-Leiste erscheint → Button rückt nach oben
3. Warenkorb-Schublade öffnen → Button liegt **hinter** der Schublade
4. Suche öffnen → dasselbe
5. Chat antippen → Fenster öffnet, Verlauf und Senden funktionieren wie vorher
6. Chat schließen → Button steht wieder an derselben Stelle
7. Desktop → Button unten rechts mit 24 px Abstand, ohne Kollision mit dem Fußbereich
8. Auf einem Gerät mit Notch (iPhone) im Querformat gegenprüfen

Rutscht der Button irgendwann in eine falsche Position, weil Shopify den Aufbau von
Inbox ändert: *Theme-Einstellungen → Chatbutton → „Platzierung durch das Theme
steuern"* ausschalten. Dann gilt wieder ausschließlich, was Inbox selbst setzt.

---

## 5. Technische Notiz

Angefasst wird ausschließlich `iframe#dummy-chat-button-iframe` – das iframe des
Buttons. Das Chatfenster liegt in einem **eigenen** iframe und bleibt vollständig
unberührt; deshalb kann die Positionierung den Chat nicht beschädigen. `!important` ist
nötig, weil Inbox die Position am Element selbst setzt.

Die Selektoren stammen aus der Shopify-Community, nicht aus einer offiziell
zugesicherten Schnittstelle. Shopify kann sie ohne Ankündigung ändern – dafür gibt es
den Hauptschalter unter Punkt 2.

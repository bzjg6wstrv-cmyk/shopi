# TWISTLOCK — so startest du es

## Was das hier ist

Ein kleines Programm, das auf deinem Rechner läuft.
Es macht drei Dinge:

1. Du legst Aufträge an — auch für morgen und übermorgen.
2. Der Fahrer sieht auf dem Handy **nur den heutigen Tag** und macht zwei Fotos: beim Abholen und beim Abgeben.
3. Wenn ein Termin um mehr als 20 Minuten zu kippen droht, bekommst **du** eine Meldung.

Es braucht **keine Datenbank** und **keine Zusatzprogramme**. Nur Node.js.

---

## Einmalig: Node.js installieren

Node.js ist der Motor, der das Programm laufen lässt. Wie ein Dieselmotor: ohne ihn steht der Lkw.

1. Gehe auf **https://nodejs.org**
2. Klicke die große Schaltfläche links (die empfohlene Version)
3. Installieren, immer auf „Weiter“ klicken
4. Fertig

---

## Starten

**Windows:** Doppelklick auf `START-WINDOWS.bat`
**Mac:** Doppelklick auf `START-MAC.command`

> Beim ersten Mal warnt der Mac. Dann: Rechtsklick auf die Datei → „Öffnen“ → „Öffnen“.

Der Browser geht auf. Das schwarze Fenster musst du **offen lassen** — das ist das laufende Programm. Schließen = ausgeschaltet.

---

## Erste Anmeldung

| Wer | Name | PIN |
|---|---|---|
| Du (Dispo) | `Ahmed` | `1234` |
| Fahrer | `Fahrer 1` | `1111` |

Du tippst **nicht**: Du siehst die Namen als große Knöpfe und gibst nur die vier Ziffern ein.

**Ändere die PINs sofort** — unten auf der Dispo-Seite unter „Fahrer“.

---

## Dein erster Auftrag

1. Oben auf **+ Auftrag**
2. Datum, Zielort, Termin beim Kunden, Container, Chassis, Fahrer eintragen
3. **Speichern** → der Auftrag ist ein *Entwurf*. Der Fahrer sieht ihn noch nicht
4. Wenn er stimmen soll: **An Fahrer senden**

Ab jetzt steht er beim Fahrer auf dem Handy — aber nur, wenn das Datum heute ist.

---

## Was der Fahrer macht

Jede Ansicht beantwortet drei Fragen: **Wo muss ich hin? Wann muss ich dort sein?
Was muss ich jetzt machen?** Unten steht immer genau eine hervorgehobene Hauptaktion.

| Ansicht | Überschrift | Hauptaktion | Zweite Aktion |
|---|---|---|---|
| A | „Jetzt: Container abholen“ — Abholfirma, Adresse, Tor, Abholzeit, Containernummer | „Abgeholt? Foto machen“ | Navigation |
| B | „Jetzt: Zum Kunden fahren“ — Ziel, Tor, Termin, Ankunft etwa | „Am Ziel angekommen“ | Navigation |
| C1 | „Beim Kunden angekommen“ — Ankunft, Termin, Aufenthalt | „Entladung beginnt“ | „Ich muss warten“ |
| C2 | „Du wartest auf die Entladung“ — Wartezeit | „Entladung beginnt“ | „Büro anrufen“ |
| C3 | „Du bist beim Entladen“ — fertig etwa, nächster Termin, Ankunft etwa, Reserve | „Entladung fertig“ | „Dauert länger“ |
| C4 | „Entladung ist fertig“ — Ablieferung noch nicht dokumentiert | „Abgegeben? Foto machen“ | — |
| D | „Auftrag abgeschlossen“ — nächster Auftrag mit Termin und Ankunft | „Nächsten Auftrag ansehen“ | — |

Jede Ansicht hat oben dieselben zwei Schaltflächen: **Problem melden** und
**Vorlesen**. Darunter führt **Heute · 3** in die Tagesliste.

Weiteres in der Fahreransicht:

- **Vorlesen** auf jeder wichtigen Ansicht: erklärt Ziel, Termin, Zeitstatus und nächste
  Handlung in kurzen Sätzen. Nie von allein, immer nur auf Knopfdruck.
- **Sprache** wird einmal gewählt (mit Namen, nicht nur mit Flagge) und bleibt gemerkt.
- **Foto**: erst eine kurze Anweisung, dann Aufnahme, dann Vorschau mit „Foto verwenden“
  und „Neu machen“. Abbrechen schließt den Auftrag **nicht** ab. Danach steht klar da,
  ob das Foto **gespeichert** oder **noch nicht gesendet** ist.
- **Problem melden** beginnt sofort mit „Was ist passiert?“: Stau, Ich muss warten,
  Container fehlt, Panne, Büro anrufen. Dann eine kurze Rückfrage, dann das Ergebnis.
  „Vom Büro gelesen“ erscheint erst, wenn die Dispo die Meldung wirklich gelesen hat.
- **Heute: 3 Aufträge** öffnet die Tagesliste mit Uhrzeit, Ort und Status.
  Aufträge von morgen erscheinen erst, wenn heute alles fertig ist — mit Datum und
  ausdrücklich als Vorschau.
- **Geänderte Aufträge** zeigt die App im Klartext: „Neu: Tor 3 statt Tor 1“.
  Der Fahrer bestätigt sie im sicheren Stand mit „Gesehen und bestätigt“.
- Vor Foto und Bestätigung fragt die App einmal: **„Steht der Lkw sicher?“**
  Die App kann nicht messen, ob jemand fährt — das sagt sie auch so.

Die Uhrzeiten kommen vom Server, nicht vom Handy. Der Fahrer kann sie nicht verstellen.

### Entladen beim Kunden

Ankunft heißt nicht, dass der Lkw wieder frei ist. Darum gibt es eigene Schritte:
**angekommen → warten → Entladung läuft → Entladung fertig → Ablieferung dokumentiert.**

- „Entladung beginnt“ startet den Planwert (Standard **2 Stunden**,
  in `daten/einstellungen.json` unter `entladezeitStandard`).
- „Dauert länger“ bietet genau drei Antworten: **Noch 30 Minuten**, **Noch 1 Stunde**,
  **Weiß ich nicht** — gerechnet ab dem Tippen, nicht ab Entladebeginn.
- Bei „Weiß ich nicht“ wird **keine** Ankunft beim nächsten Kunden erfunden.
- Läuft die geplante Zeit ab, fragt die App im Stand nach: „Bist du fertig oder dauert
  es länger?“ Ohne Antwort wird nichts abgeschlossen und keine Abfahrt angenommen.
- Nach „Entladung fertig“ führt die App direkt zum Ablieferfoto. Entladeende, Foto und
  Abfahrt sind getrennte Ereignisse.

Die Ankunft beim nächsten Kunden rechnet der Server aus der **verbleibenden Kette**:
Restzeit beim jetzigen Kunden + Restarbeiten + Fahrt zur nächsten Abholung +
Warte- und Ladezeit dort + Fahrt zum nächsten Kunden. Es wird nur gezählt, was
wirklich anfällt — keine pauschale Rückfahrt über den Hof. Planwerte:
`nacharbeitMin` (15), `fahrzeitZurAbholung` (60), `ladezeitStandard` (30).

### Containernummer prüfen

Beim Abholen vergleicht die App die Nummer aus dem Auftrag mit der Nummer am Container.
Erwartete und bestätigte Nummer werden **getrennt** gespeichert; die Auftragsnummer
wird nie stillschweigend überschrieben.

- Passt sie: „Container passt zum Auftrag“ → „Abholung bestätigen“.
  Das steht im Auftragsverlauf, nicht in der Meldungsliste der Dispo.
- Passt sie nicht: „Containernummer stimmt nicht überein“ mit beiden Nummern.
  „Trotzdem abholen“ fragt ausdrücklich nach, danach bleibt der Auftrag als
  **Abweichung – vom Büro zu prüfen** markiert. Die Dispo bekommt eine hervorgehobene
  Meldung mit erwarteter Nummer, bestätigter Nummer, Fahrer, Uhrzeit und Foto.
- Unsicher: „Nummer nicht sicher erkannt“ — die App behauptet nicht, es sei der falsche
  Container, und bietet neue Aufnahme oder Eingabe von Hand an.
- Die Prüfziffer nach ISO 6346 rechnet die App selbst (`web/container.js`). Eine richtige
  Prüfziffer beweist aber nicht, dass es der richtige Container ist.

**Noch nicht angebunden:** Das automatische Auslesen der Nummer aus dem Foto.
Solange fragt die App einmal nach: „Steht diese Nummer auf dem Container?“

### Was die App sagt und was sie nicht sagt

- Reserve = Kundentermin minus erwartete Ankunft.
  Mehr als **10 Minuten** Reserve: grün („15 Minuten Reserve“).
  **0 bis 10 Minuten**: orange („Es wird knapp – 7 Minuten Reserve“).
  Weniger: rot („Voraussichtlich 12 Minuten zu spät“). Ohne Daten: grau.
- **Verspätungsalarm an die Dispo erst ab 20 Minuten** berechneter Verspätung,
  und dann genau einmal je Auftrag. Orange meldet nichts, kleine Schwankungen auch
  nicht. In der Übersicht bleibt der aktuelle Zustand sichtbar.
  Schwelle: `verspaetungAb` (20), Farbgrenze: `gruenAb` (10).
- Alle Ankunftszeiten sind mit „Geschätzt aus der geplanten Fahrzeit, ohne Verkehrslage“
  gekennzeichnet. Ohne Verbindung steht dort **„Ankunft gerade nicht verfügbar“** —
  keine falsche grüne Sicherheit.
- Der Aufenthalt beim Kunden wird **nicht** als abrechenbare Wartezeit ausgegeben.
  Was berechenbar ist, entscheidet das Wartezeitprotokoll in der Dispo.
- Die App schätzt **keine** gesetzliche Restlenkzeit und behauptet keine Fahrsperre.

### Vorschau ohne echte Daten

`http://localhost:3000/vorschau.html` zeigt alle Fahreransichten mit festen
Beispieldaten: Normalfall, Verspätung, kein Internet, fehlgeschlagener Fotoversand,
geänderter Auftrag. Alles dort ist als **Demo** gekennzeichnet, es wird nichts
gesendet. Gut zum Zeigen und zum Üben, ohne einen echten Auftrag anzufassen.

Zum Verschicken gibt es dieselbe Vorschau auch als **eine einzige Datei**:
`vorschau-einzeldatei.html`. Die läuft ohne Server, per E-Mail verschickt oder
vom USB-Stick — einfach im Browser öffnen. Neu bauen nach Änderungen:

    node vorschau-bauen.js

Warum eine Einzeldatei: eingebettete Anzeigeflächen ohne eigene Adresse laden
keine Nebendateien. Alles steckt darum in der Datei selbst.

### Bürotelefon eintragen

Voreingestellt ist die Nummer von I&M CARGO: **0421 98994620**
(technisch `tel:+4942198994620`). Ändern in `daten/einstellungen.json` unter
`bueroTelefon`. Ohne Nummer sagt die App offen, dass keine hinterlegt ist.

### Zusätzliche Felder für den Auftrag

Der Fahrer sieht den **Abholort getrennt vom Lieferziel**. Dafür kennt ein Auftrag
neben `abholOrt` und `zielOrt` auch: `abholFirma`, `abholAdresse`, `abholTor`,
`zielAdresse`, `zielTor`. Sie sind freiwillig; fehlen sie, zeigt die App den Ortsnamen.

---

## Was du bekommst

Oben auf der Dispo-Seite erscheinen die Meldungen, mit Ton:

- „Auftrag 4703 · Walsrode 13:30. Ankunft voraussichtlich 14:25 — 55 Min. zu spät.“
- Jeder Auftrag meldet sich **nur einmal**. Du wirst nicht zugespamt.

Damit auch ein Fenster aufploppt, erlaube dem Browser einmal Benachrichtigungen.

---

## Wichtig zu wissen

**Fotos funktionieren auch ohne https.** Der Standort des Fahrers wird nur gespeichert, wenn du das Programm später mit https auf einem richtigen Server betreibst. Ohne https bleibt der Standort einfach leer — die Fotos und Zeiten funktionieren trotzdem.

**Deine Daten liegen im Ordner `daten`** als normale Dateien. Du kannst sie öffnen und lesen. Backup = **Ordner `daten` und `fotos` kopieren.** Mach das einmal die Woche auf einen USB-Stick.

**Der Rechner muss laufen**, damit die Fahrer die App erreichen. Solange du nur testest, reicht dein eigener Rechner. Für den echten Betrieb kommt das Programm auf einen Server, damit es Tag und Nacht läuft.

**Die Fahrzeit ist noch geraten.** Standard sind 75 Minuten. Sobald du echte Werte hast, unten bei „Einstellungen“ eintragen — alle Ampeln rechnen dann richtig.

---

## Wenn etwas nicht geht

| Problem | Lösung |
|---|---|
| „node wird nicht erkannt“ | Node.js ist nicht installiert. Siehe oben |
| Browser zeigt nichts | Läuft das schwarze Fenster noch? Sonst neu starten |
| Fahrer kommt nicht rein | Name muss **genau** stimmen, auch Groß- und Kleinschreibung ist egal, aber Leerzeichen zählen |
| Alles zurücksetzen | Ordner `daten` und `fotos` löschen und neu starten |
| Prüfen, ob alles funktioniert | Im Ordner `node test.js` ausführen — über 100 automatische Tests, inklusive Prüfziffern, Alarmschwelle und Farbkontrasten |
| App-Symbol fehlt auf dem Handy | Geht nur mit https. Siehe `APP-MACHEN.md` |

---

## Was als Nächstes kommt

1. **Echte Fahrzeiten messen** und eintragen — wichtigster Schritt
2. Programm auf einen Server legen, damit es immer läuft und https hat — Anleitung in **`APP-MACHEN.md`**
3. GPS-Tracker anbinden, damit die Position nicht mehr vom Handy kommt
4. Wartezeit-Protokoll als PDF für die Standgeldrechnung
5. Container-Prüfziffer, Fristenmonitor, Tourkalkulation

Punkt 1 kannst du heute anfangen. Alles andere baue ich dir, wenn der Alltag mit Punkt 1 funktioniert.

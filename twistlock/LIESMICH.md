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

- Er meldet sich einmal an, danach bleibt er angemeldet
- Er sieht oben eine **große Farbfläche**: Grün, Gelb oder Rot
- Er drückt **Abgeholt** → Kamera geht auf → Foto → gespeichert
- Er fährt, drückt am Ziel **Abgegeben** → Foto → gespeichert
- Danach kommt sofort ein Vollbild: *Schaffe ich den nächsten Termin, und wann bin ich da?*
- Sind alle Aufträge erledigt, sieht er die Aufträge von **morgen** und wann er losfahren muss

Die Uhrzeiten kommen vom Server, nicht vom Handy. Der Fahrer kann sie nicht verstellen.

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
| Prüfen, ob alles funktioniert | Im Ordner `node test.js` ausführen — macht 33 automatische Tests |
| App-Symbol fehlt auf dem Handy | Geht nur mit https. Siehe `APP-MACHEN.md` |

---

## Was als Nächstes kommt

1. **Echte Fahrzeiten messen** und eintragen — wichtigster Schritt
2. Programm auf einen Server legen, damit es immer läuft und https hat — Anleitung in **`APP-MACHEN.md`**
3. GPS-Tracker anbinden, damit die Position nicht mehr vom Handy kommt
4. Wartezeit-Protokoll als PDF für die Standgeldrechnung
5. Container-Prüfziffer, Fristenmonitor, Tourkalkulation

Punkt 1 kannst du heute anfangen. Alles andere baue ich dir, wenn der Alltag mit Punkt 1 funktioniert.

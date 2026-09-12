# Wie das eine App wird

## Zuerst das Wichtigste

Du brauchst **keinen App Store**. Keine Anmeldung bei Apple, keine 99 Dollar im Jahr, keine Wartezeit auf Freigabe.

Stell dir vor, deine Seite ist ein Laden. Der Fahrer legt sich eine **Abkürzung auf den Handy-Bildschirm** — genau wie bei WhatsApp. Wenn er drauftippt, geht sie im Vollbild auf, ohne Browserleiste. Sie sieht aus wie eine App, fühlt sich an wie eine App, ist eine App.

Das nennt man PWA. Alles dafür ist schon eingebaut.

---

## Was noch fehlt: eine richtige Adresse

Solange das Programm nur auf deinem Rechner läuft, kommt der Fahrer nicht dran. Es braucht:

| Was | Warum | Kosten |
|---|---|---|
| Einen kleinen Server | Er läuft Tag und Nacht, auch wenn dein Rechner aus ist | ca. 6 € im Monat |
| Eine Adresse (Domain) | Damit man ihn findet, z. B. `dispo.tukan-logistik.de` | hast du schon |
| **https** | Das Schloss im Browser. **Ohne https lässt sich die App nicht installieren.** | 0 € |

Das https richtet sich von allein ein. Darum musst du dich nicht kümmern.

---

## Schritt 1: Server bestellen (10 Minuten)

1. Auf **hetzner.com** → Cloud → Konto anlegen
2. Neuen Server: **Standort Nürnberg oder Falkenstein**, Abbild **Ubuntu 24.04**, kleinster Typ (**CX23**, rund 6 € im Monat)
3. Bestellen. Du bekommst eine **IP-Adresse** wie `123.45.67.89` und ein Passwort per Mail

---

## Schritt 2: Adresse auf den Server zeigen lassen (5 Minuten)

Bei IONOS, wo deine Domain liegt:

1. Domain → DNS → neuer Eintrag
2. Typ: **A**
3. Name: **dispo**
4. Wert: die **IP-Adresse** von Hetzner
5. Speichern

Danach heißt deine Adresse `dispo.tukan-logistik.de`. Es kann bis zu einer Stunde dauern, bis das überall ankommt.

---

## Schritt 3: Programm auf den Server (15 Minuten)

Auf dem Hetzner-Server öffnest du die Konsole (im Hetzner-Fenster: „Console"). Dann tippst du diese vier Zeilen ab — eine nach der anderen, jeweils Enter:

```
apt update && apt install -y unzip
mkdir -p /opt/twistlock
```

Dann lädst du den Ordner hoch. Am einfachsten geht das mit dem kostenlosen Programm **WinSCP** (Windows) oder **Cyberduck** (Mac): IP-Adresse, Benutzer `root`, Passwort aus der Mail — und den Ordner `twistlock` nach `/opt/` ziehen.

Danach in der Konsole:

```
cd /opt/twistlock
bash einrichten.sh dispo.tukan-logistik.de
```

Das Skript macht alles: Node installieren, https einrichten, Autostart, nächtliche Sicherung. Am Ende steht deine Adresse auf dem Bildschirm.

**Wenn du dabei nicht weiterkommst:** Das sind die 15 Minuten, für die sich ein Freelancer lohnt. 100 bis 200 € einmalig, und danach läuft es. Alles andere kannst du selbst.

---

## Schritt 4: Der Fahrer installiert sie (1 Minute)

**Android (die meisten Fahrer):**
1. Adresse im Chrome öffnen
2. Anmelden
3. Es erscheint von allein ein blauer Knopf **„Als App speichern"** — draufdrücken
4. Fertig. Symbol liegt auf dem Startbildschirm

Wenn der Knopf nicht kommt: oben rechts die drei Punkte → „App installieren".

**iPhone:**
1. Adresse in **Safari** öffnen (nicht Chrome, das geht dort nicht)
2. Unten das Teilen-Symbol (Quadrat mit Pfeil nach oben)
3. Nach unten wischen → **„Zum Home-Bildschirm"**
4. Fertig

**Mach das für deinen Fahrer selbst**, einmal, mit seinem Handy in der Hand. Erwarte nicht, dass er es allein macht.

---

## Was er danach hat

- Ein Symbol auf dem Startbildschirm, dunkelblau mit einem Container
- Vollbild, keine Browserleiste
- Er bleibt angemeldet, muss die PIN nicht jeden Tag eingeben
- Im Funkloch startet die App trotzdem und zeigt die letzten Daten
- Fünf Sprachen und Vorlesen

---

## Häufige Stolpersteine

| Problem | Ursache | Lösung |
|---|---|---|
| Kein Installationsknopf | Kein https | Adresse muss mit `https://` anfangen, nicht `http://` |
| Kamera geht nicht auf | Meist alte Browserversion | Chrome oder Safari aktualisieren |
| Standort fehlt | Kein https, oder Erlaubnis verweigert | Auf dem Server mit https läuft es |
| iPhone zeigt keinen Knopf | Apple macht das nicht automatisch | Von Hand über Teilen → Zum Home-Bildschirm |
| Nach Änderung sieht der Fahrer die alte Version | Der Speicher der App | In `web/sw.js` oben die Nummer `twistlock-v1` auf `v2` erhöhen |

---

## Und der echte App Store?

Braucht ihr nicht. Der Store lohnt sich, wenn Fremde eure App finden sollen. Bei euch bekommen genau drei bis zehn Leute die Adresse — die brauchen keinen Store.

Falls es später doch sein muss: Die gleiche App lässt sich in eine Store-Hülle packen. Das ist eine Entscheidung für in zwei Jahren, nicht für jetzt.

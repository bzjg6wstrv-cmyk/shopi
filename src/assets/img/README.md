# Bilder — Platzhalter ersetzen

Die vier Dateien in diesem Ordner sind **gekennzeichnete Platzhalter**, keine echten Fotos.
Sie tragen im Bild die Bezeichnung „BILDPLATZHALTER“, damit sie nie versehentlich live gehen.

## Austausch

Für jeden Platzhalter werden zwei Dateien benötigt: `.webp` (wird bevorzugt ausgeliefert)
und `.jpg` (Rückfallebene). Dateinamen und Seitenverhältnisse beibehalten – dann ist im
Code nichts anzupassen.

| Datei | Format | Seitenverhältnis | Motiv | Einsatz |
|---|---|---|---|---|
| `hero-fernverkehr` | 1200 × 1600 | 3:4 (hoch) | Sattelzug im Fernverkehr, Autobahn, Fahrzeugdetail | Startbild, rechte Spalte |
| `containerverkehr` | 1800 × 1200 | 3:2 (quer) | Containerverkehr, Terminal, Containerauflieger | Leistungen |
| `autobahn-band` | 2400 × 1030 | 21:9 (Band) | Autobahn, Europaverkehr, Fahrt | Deutschland & Europa |
| `verladung` | 1600 × 1200 | 4:3 (quer) | Verladung, Logistikhof, Planenauflieger | Karriere |

Der Bildausschnitt wird per `object-fit: cover` gesetzt. Das Hauptmotiv sollte deshalb
mittig liegen und an den Rändern Luft haben.

## Anforderungen an die Fotos

- eigene Aufnahmen von I&M CARGO bevorzugt; ersatzweise lizenzierte Logistikfotografie
- europäische Sattelzüge, keine US-Trucks
- keine nachträglich auf fremde Fahrzeuge montierten I&M-Logos
- keine erkennbaren Kennzeichen oder Personen ohne Einwilligung
- ruhige, sachliche Bildsprache; kein übertriebener Kontrast, keine Effekte

## Nach dem Austausch

1. **Alt-Texte anpassen.** Sie stehen in `src/content/de.js` und `src/content/en.js`
   (`hero.imageAlt`, `services.imageAlt`, `europe.imageAlt`, `career.imageAlt`) und
   beschreiben derzeit die Platzhalter.
2. **Bildnachweise ergänzen**, falls lizenzierte Fotos verwendet werden – im Impressum
   ist dafür ein Abschnitt vorgesehen (`src/content/legal.de.js` / `legal.en.js`).
3. `npm run build` ausführen.

## Neue Platzhalter erzeugen

Die Platzhalter wurden mit `tools/make-placeholders.py` erstellt (benötigt Pillow).
Für den Betrieb der Website wird das Skript nicht gebraucht.

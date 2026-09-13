/* ===========================================================
   TWISTLOCK — Zeiten, Reserve und Auftragskette

   Ein Ort für alle Zeitregeln, damit App, Vorschau und Tests
   dasselbe rechnen.

   Reserve = Kundentermin minus berechnete Ankunft.
     mehr als 10 Minuten   → grün
     0 bis 10 Minuten      → orange
     weniger als 0         → rot
     unbekannt oder veraltet → grau

   Der Verspätungsalarm an die Dispo hat eine eigene Schwelle:
   erst ab 20 Minuten berechneter Verspätung, und dann einmal.

   Läuft im Browser und in Node.
   =========================================================== */
"use strict";

var TL_ZEIT = (function () {
  const MIN = 60000;

  const GRENZE_ORANGE = 10;   // bis hierhin orange
  const GRENZE_ALARM  = 20;   // ab hier Alarm an die Dispo
  const MAX_ALTER     = 10;   // Minuten, bis Daten als veraltet gelten

  const zahl = x => (x == null || isNaN(x)) ? null : Math.round(x);

  /* Minuten zwischen zwei Zeitpunkten (b - a) */
  function abstandMin(a, b) {
    if (!a || !b) return null;
    const x = new Date(a).getTime(), y = new Date(b).getTime();
    if (isNaN(x) || isNaN(y)) return null;
    return zahl((y - x) / MIN);
  }

  /* Reserve: Termin minus Ankunft, in Minuten.
     Rechnet mit echten Zeitpunkten — auch über Mitternacht. */
  function reserve(terminISO, ankunftISO) {
    return abstandMin(ankunftISO, terminISO);
  }

  /* Farbe und Art des Zeitstatus */
  function status(reserveMin, grenze) {
    if (reserveMin == null) return "grau";
    const g = grenze == null ? GRENZE_ORANGE : grenze;
    if (reserveMin < 0) return "rot";
    if (reserveMin <= g) return "gelb";
    return "gruen";
  }

  /* Alarm an die Dispo? Nur ab der Schwelle, Orange nie. */
  function alarmNoetig(reserveMin, schwelle) {
    if (reserveMin == null) return false;
    const s = schwelle == null ? GRENZE_ALARM : schwelle;
    return -reserveMin >= s;
  }

  /* Kette aufaddieren: [{was:"fahrtKunde", min:60}, …] */
  function kette(teile) {
    const liste = (teile || []).filter(t => t && t.min > 0);
    return { min: liste.reduce((s, t) => s + t.min, 0), teile: liste };
  }

  /* Ankunft = Startzeitpunkt plus Kette */
  function ankunft(startISO, teile) {
    const start = new Date(startISO).getTime();
    if (isNaN(start)) return null;
    return new Date(start + kette(teile).min * MIN).toISOString();
  }

  /* Wie alt sind die Daten, und sind sie zu alt?
     Gilt unabhängig davon, ob gerade Internet da ist. */
  function alterMin(datenZeitISO, jetzt) {
    if (!datenZeitISO) return null;
    return abstandMin(datenZeitISO, jetzt || new Date().toISOString());
  }
  function veraltet(datenZeitISO, maxAlter, jetzt) {
    const a = alterMin(datenZeitISO, jetzt);
    if (a == null) return true;
    return a > (maxAlter == null ? MAX_ALTER : maxAlter);
  }

  return { reserve, status, alarmNoetig, kette, ankunft, abstandMin,
           alterMin, veraltet, GRENZE_ORANGE, GRENZE_ALARM, MAX_ALTER };
})();

if (typeof module !== "undefined" && module.exports) module.exports = TL_ZEIT;

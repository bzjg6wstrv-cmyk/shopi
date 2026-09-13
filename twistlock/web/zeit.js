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

  /* ---------- Datum und Uhrzeit eines Auftrags ----------
     Ein Termin gehört immer zu einem Datum. „14:30“ allein reicht nicht:
     der Termin kann morgen sein, und die Fahrt kann über Mitternacht gehen.
     Gerechnet wird in der Zeitzone des Betriebs (Europe/Berlin), damit es
     auch auf einem Handy mit anderer Einstellung stimmt. */
  const ZONE = "Europe/Berlin";

  function istDatum(d){ return /^\d{4}-\d{2}-\d{2}$/.test(String(d || "")); }
  function istUhrzeit(z){ return /^\d{1,2}:\d{2}$/.test(String(z || "")); }

  /* Wie viele Minuten liegt die Zone zu diesem Zeitpunkt vor UTC? */
  function versatzMin(zeitpunktMs, zone) {
    const f = new Intl.DateTimeFormat("en-US", {
      timeZone: zone || ZONE, hour12: false,
      year:"numeric", month:"2-digit", day:"2-digit",
      hour:"2-digit", minute:"2-digit", second:"2-digit" });
    const p = {};
    for (const teil of f.formatToParts(new Date(zeitpunktMs))) p[teil.type] = teil.value;
    const alsUtc = Date.UTC(+p.year, +p.month - 1, +p.day,
                            +p.hour % 24, +p.minute, +p.second);
    return Math.round((alsUtc - zeitpunktMs) / MIN);
  }

  /* Datum + Uhrzeit des Auftrags als echter Zeitpunkt.
     Fehlt oder stimmt etwas nicht, kommt null zurück — dann wird keine
     Ankunft bewertet, statt eine falsche Zahl zu zeigen. */
  function zeitpunkt(datum, uhrzeit, zone) {
    if (!istDatum(datum) || !istUhrzeit(uhrzeit)) return null;
    const [j, mo, t] = datum.split("-").map(Number);
    const [h, mi] = uhrzeit.split(":").map(Number);
    if (mo < 1 || mo > 12 || t < 1 || t > 31 || h > 23 || mi > 59) return null;
    const roh = Date.UTC(j, mo - 1, t, h, mi);
    // Zwei Durchgänge, damit auch die Zeitumstellung stimmt
    let ms = roh - versatzMin(roh, zone) * MIN;
    ms = roh - versatzMin(ms, zone) * MIN;
    const d = new Date(ms);
    if (isNaN(d)) return null;
    // Bei der Umstellung im Frühjahr gibt es Uhrzeiten, die es nicht gibt
    return d.toISOString();
  }

  /* Datum und Uhrzeit eines Zeitpunkts in der Betriebszeitzone */
  function teile(iso, zone) {
    const d = new Date(iso);
    if (isNaN(d)) return null;
    const f = new Intl.DateTimeFormat("sv-SE", {
      timeZone: zone || ZONE, hour12:false,
      year:"numeric", month:"2-digit", day:"2-digit", hour:"2-digit", minute:"2-digit" });
    const p = {};
    for (const t of f.formatToParts(d)) p[t.type] = t.value;
    return { datum: `${p.year}-${p.month}-${p.day}`,
             uhrzeit: `${p.hour}:${p.minute}` };
  }
  const datumVon  = (iso, zone) => (teile(iso, zone) || {}).datum || null;
  const uhrzeitVon = (iso, zone) => (teile(iso, zone) || {}).uhrzeit || null;

  /* Sind die Daten verlässlich genug für eine Ankunftsaussage?
     Beide Zeitstempel müssen da, lesbar und frisch sein — der Zeitpunkt
     der Ankunftsberechnung und der Zeitpunkt der Ortung. Fehlt einer,
     wird nichts behauptet und kein Alarm ausgelöst. */
  function lesbar(iso) {
    if (!iso) return false;
    const d = new Date(iso);
    return !isNaN(d.getTime());
  }
  function datenZuverlaessig(datenZeitISO, ortungZeitISO, maxAlter, jetzt) {
    if (!lesbar(datenZeitISO))  return { ok:false, grund:"prognose_fehlt" };
    if (!lesbar(ortungZeitISO)) return { ok:false, grund:"ortung_fehlt" };
    if (veraltet(datenZeitISO, maxAlter, jetzt))  return { ok:false, grund:"prognose_alt" };
    if (veraltet(ortungZeitISO, maxAlter, jetzt)) return { ok:false, grund:"ortung_alt" };
    return { ok:true, grund:null };
  }

  /* Darf aus diesen Daten ein Alarm entstehen? */
  function alarmErlaubt(datenZeitISO, ortungZeitISO, maxAlter, jetzt) {
    return datenZuverlaessig(datenZeitISO, ortungZeitISO, maxAlter, jetzt).ok;
  }

  return { reserve, status, alarmNoetig, kette, ankunft, abstandMin,
           alterMin, veraltet, alarmErlaubt, datenZuverlaessig, lesbar,
           zeitpunkt, datumVon, uhrzeitVon, teile, istDatum, istUhrzeit, versatzMin,
           ZONE, GRENZE_ORANGE, GRENZE_ALARM, MAX_ALTER };
})();

if (typeof module !== "undefined" && module.exports) module.exports = TL_ZEIT;

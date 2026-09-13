/* ===========================================================
   TWISTLOCK — Server
   Braucht nur Node.js. Keine Datenbank, keine npm-Pakete.
   Starten:  node server.js
   Öffnen:   http://localhost:3000
   =========================================================== */

const http = require("http");
const fs   = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT   = process.env.PORT || 3000;
const ORDNER = __dirname;
const DATEN  = path.join(ORDNER, "daten");
const FOTOS  = path.join(ORDNER, "fotos");
const WEB    = path.join(ORDNER, "web");

/* -----------------------------------------------------------
   1. Speicher: einfache JSON-Dateien
   Für bis zu ca. 10 Lkw völlig ausreichend.
   Sicheres Schreiben: erst Hilfsdatei, dann umbenennen.
   ----------------------------------------------------------- */
for (const d of [DATEN, FOTOS]) if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });

function lade(name, standard) {
  const p = path.join(DATEN, name + ".json");
  try { return JSON.parse(fs.readFileSync(p, "utf8")); }
  catch { return standard; }
}
function sichere(name, wert) {
  const p    = path.join(DATEN, name + ".json");
  const temp = p + ".tmp";
  fs.writeFileSync(temp, JSON.stringify(wert, null, 2), "utf8");
  fs.renameSync(temp, p);
}

let benutzer   = lade("benutzer", null);
let auftraege  = lade("auftraege", []);
let meldungen  = lade("meldungen", []);
let positionen = lade("positionen", []);
let protokoll  = lade("protokoll", []);
let orte       = lade("orte", {});   // gelernte Zielorte fuer die Standortpruefung

// Beim allerersten Start: zwei Zugänge anlegen
if (!benutzer) {
  benutzer = [
    { id: "u1", name: "Ahmed",   rolle: "dispo",  pin: "1234" },
    { id: "u2", name: "Fahrer 1", rolle: "fahrer", pin: "1111" }
  ];
  sichere("benutzer", benutzer);
  console.log("\n  Zugänge angelegt:");
  console.log("  Dispo  -> Ahmed    PIN 1234");
  console.log("  Fahrer -> Fahrer 1 PIN 1111");
  console.log("  PINs später im Adminbereich ändern.\n");
}

/* -----------------------------------------------------------
   2. Einstellungen — hier die echten Messwerte eintragen
   ----------------------------------------------------------- */
const EINST_STANDARD = {
  fahrzeitStandard: 75,   // Minuten Bremen -> Ziel
  ruestzeit: 10,          // Minuten Abfahrtkontrolle
  gruenAb: 10,            // bis so viel Reserve ist der Status orange, darüber grün
  verspaetungAb: 20,      // ab so viel Verspätung bekommt die Dispo einen Alarm
  handlingRueck: 30,      // Minuten Handling nach der Rückkehr (Altwert)
  fahrzeitRueck: 75,      // Minuten Rückfahrt (Altwert)
  freiMin: 60,            // Minuten Wartezeit, die vertraglich frei sind
  maxAbstandKm: 3,        // ab so viel Abstand zum Zielort: Warnung
  bueroTelefon: "+4942198994620",   // I&M CARGO, Büro
  entladezeitStandard: 120,  // Planwert Entladung beim Kunden, in Minuten
  nacharbeitMin: 15,         // Papiere, Ladungssicherung, bevor es weitergeht
  fahrzeitZurAbholung: 60,   // Fahrt vom Kunden zur nächsten Abholstelle
  ladezeitStandard: 30       // Warten und Laden an der Abholstelle
};
// Gespeicherte Werte gewinnen, neue Planwerte kommen dazu.
let einst = { ...EINST_STANDARD, ...lade("einstellungen", {}) };
sichere("einstellungen", einst);

/* -----------------------------------------------------------
   3. Anmeldung: Token in einem Cookie
   ----------------------------------------------------------- */
const sitzungen = new Map();          // token -> benutzerId
const SITZUNGSDAUER = 30 * 24 * 3600 * 1000;

function neuerToken(benutzerId) {
  const t = crypto.randomBytes(24).toString("hex");
  sitzungen.set(t, { benutzerId, bis: Date.now() + SITZUNGSDAUER });
  return t;
}
function nutzerAus(req) {
  const c = req.headers.cookie || "";
  const m = c.match(/tl_token=([a-f0-9]+)/);
  if (!m) return null;
  const s = sitzungen.get(m[1]);
  if (!s || s.bis < Date.now()) return null;
  return benutzer.find(b => b.id === s.benutzerId) || null;
}

/* -----------------------------------------------------------
   4. Zeitrechnung
   ----------------------------------------------------------- */
const heute = () => new Date().toLocaleDateString("sv-SE");   // ergibt JJJJ-MM-TT

function zeitpunkt(datum, hhmm) {         // "2026-09-08","06:30" -> Date
  const [j, mo, t] = datum.split("-").map(Number);
  const [h, mi]    = hhmm.split(":").map(Number);
  return new Date(j, mo - 1, t, h, mi, 0, 0);
}
const min = ms => ms / 60000;

// Wie viele Minuten braucht der Lkw noch bis zur Abgabestelle?
function restfahrzeit(a, jetzt) {
  const fz = a.fahrzeitMin || einst.fahrzeitStandard;
  // Steht beim Kunden — egal ob wartend, entladend oder fertig entladen
  if (["angekommen","warten","entladen","entladen_fertig"].includes(a.status)) return 0;
  if (a.status === "geladen" && a.abholZeit) {
    const gefahren = min(jetzt - new Date(a.abholZeit));
    return Math.max(0, fz - gefahren);
  }
  return (a.ruestzeitMin ?? einst.ruestzeit) + fz;
}
function rechne(a, jetzt = new Date()) {
  const termin = zeitpunkt(a.datum, a.termin);
  const r = { termin: termin.toISOString() };
  if (a.ankunftZeit) {
    const bis = a.abgabeZeit ? new Date(a.abgabeZeit) : jetzt;
    r.wartetSeit = Math.max(0, Math.round(min(bis - new Date(a.ankunftZeit))));
    r.frei       = a.freiMin ?? einst.freiMin;
    r.berechenbar = Math.max(0, r.wartetSeit - r.frei);
  }
  if (a.entladeStart) {
    r.entladeStart = a.entladeStart;
    r.entladePlanMin = a.entladePlanMin ?? einst.entladezeitStandard;
    r.entladeUnbekannt = !!a.entladeUnbekannt;
    if (a.entladeEndePlan && !a.entladeUnbekannt) {
      r.entladeEndePlan = a.entladeEndePlan;
      r.entladeRestMin  = Math.round(min(new Date(a.entladeEndePlan) - jetzt));
    }
  }
  if (a.wartenZeit) r.wartetVorEntladung = Math.max(0, Math.round(min(jetzt - new Date(a.wartenZeit))));
  if (a.status === "fertig" && a.abgabeZeit) {
    r.verzug  = Math.round(min(new Date(a.abgabeZeit) - termin));
    r.ampel   = "fertig";
    r.ankunft = a.abgabeZeit;
    return r;
  }
  const rest    = restfahrzeit(a, jetzt);
  const ankunft = new Date(jetzt.getTime() + rest * 60000);
  const puffer  = Math.round(min(termin - ankunft));
  r.ankunft   = ankunft.toISOString();
  r.restMin   = Math.round(rest);
  r.puffer    = puffer;
  r.ampel     = puffer < 0 ? "rot" : (puffer <= einst.gruenAb ? "gelb" : "gruen");
  r.losBis    = new Date(termin.getTime()
                  - ((a.fahrzeitMin || einst.fahrzeitStandard)
                  +  (a.ruestzeitMin ?? einst.ruestzeit)) * 60000).toISOString();
  return r;
}

/* Wie lange dauert es noch, bis der Lkw beim Kunden fertig ist?
   null heißt: offen — dann wird keine Ankunft erfunden. */
function restBeimKunden(a, jetzt) {
  if (a.status === "entladen") {
    if (a.entladeUnbekannt || !a.entladeEndePlan) return null;
    return Math.max(0, min(new Date(a.entladeEndePlan) - jetzt));
  }
  if (a.status === "warten" || a.status === "angekommen")
    return a.entladePlanMin ?? einst.entladezeitStandard;   // Entladung steht noch bevor
  if (a.status === "entladen_fertig") return 0;
  return null;
}

/* Ankunft beim nächsten Kunden aus der verbleibenden Auftragskette:
   Restzeit beim jetzigen Kunden + Restarbeiten + Fahrt zur nächsten
   Abholung + dortige Warte- und Ladezeit + Fahrt zum nächsten Kunden.
   Nur Schritte, die wirklich anfallen — keine pauschale Rückfahrt. */
function naechsterAusKette(aktuell, ziel, jetzt = new Date()) {
  if (!ziel) return null;
  const erg = { nummer: ziel.nummer, zielOrt: ziel.zielOrt, kunde: ziel.kunde || null,
                termin: ziel.termin, datum: ziel.datum, teile: [] };
  let dauer = 0, unsicher = false;
  const dazu = (was, minuten) => {
    if (!minuten) return;
    erg.teile.push({ was, min: Math.round(minuten) });
    dauer += minuten;
  };

  if (aktuell && aktuell.id !== ziel.id && aktuell.status !== "fertig") {
    const rest = restBeimKunden(aktuell, jetzt);
    if (rest === null) unsicher = true;
    else dazu("entladung", rest);
    dazu("nacharbeit", einst.nacharbeitMin);
  }
  // Muss der Lkw den nächsten Container erst holen?
  if (ziel.status !== "geladen" && ziel.abholOrt) {
    dazu("fahrtAbholung", ziel.anfahrtMin ?? einst.fahrzeitZurAbholung);
    dazu("laden", ziel.ladezeitMin ?? einst.ladezeitStandard);
  }
  dazu("fahrtKunde", ziel.fahrzeitMin || einst.fahrzeitStandard);

  erg.restMin = Math.round(dauer);
  if (unsicher) { erg.unsicher = true; erg.ampel = "grau"; return erg; }
  const ank = new Date(jetzt.getTime() + dauer * 60000);
  const puffer = Math.round(min(zeitpunkt(ziel.datum, ziel.termin) - ank));
  erg.ankunft = ank.toISOString();
  erg.puffer  = puffer;
  erg.ampel   = puffer < 0 ? "rot" : (puffer <= einst.gruenAb ? "gelb" : "gruen");
  return erg;
}

/* Die offenen Aufträge eines Fahrertages als Kette bewerten:
   der erste zählt normal, der zweite haengt am ersten. */
function kette(fahrerId, datum, jetzt = new Date()) {
  const offen = auftraege
    .filter(a => a.fahrerId === fahrerId && a.datum === datum &&
                 a.status !== "fertig" && a.status !== "entwurf")
    .sort((x, y) => x.termin.localeCompare(y.termin));
  return { erster: offen[0] || null, zweiter: offen[1] || null, offen };
}

/* -----------------------------------------------------------
   5. Meldungen
   ----------------------------------------------------------- */
// Luftlinie zwischen zwei Punkten in Kilometern
function abstandKm(a, b) {
  const R = 6371, g = x => x * Math.PI / 180;
  const dLat = g(b.lat - a.lat), dLon = g(b.lon - a.lon);
  const h = Math.sin(dLat/2)**2 +
            Math.cos(g(a.lat)) * Math.cos(g(b.lat)) * Math.sin(dLon/2)**2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Merkt sich, wo ein Ort ungefaehr liegt — ganz ohne Eingabe.
// Beim ersten Mal wird gelernt, danach geprueft.
function ortPruefen(ortsname, gps) {
  if (!ortsname || !gps) return null;
  const schl = ortsname.trim().toLowerCase();
  const bekannt = orte[schl];
  if (!bekannt) {
    orte[schl] = { lat: gps.lat, lon: gps.lon, n: 1 };
    sichere("orte", orte);
    return null;
  }
  const km = abstandKm(bekannt, gps);
  if (km <= einst.maxAbstandKm) {
    // Mittelwert nachfuehren, damit der Ort mit der Zeit genauer wird
    bekannt.lat = (bekannt.lat * bekannt.n + gps.lat) / (bekannt.n + 1);
    bekannt.lon = (bekannt.lon * bekannt.n + gps.lon) / (bekannt.n + 1);
    bekannt.n = Math.min(bekannt.n + 1, 50);
    sichere("orte", orte);
    return null;
  }
  return Math.round(km);
}

function melde(art, text, auftragId, zusatz) {
  meldungen.unshift({
    id: crypto.randomUUID(), zeit: new Date().toISOString(),
    art, text, auftragId: auftragId || null, gelesen: false,
    ...(zusatz || {})
  });
  if (meldungen.length > 400) meldungen.length = 400;
  sichere("meldungen", meldungen);
  console.log("MELDUNG:", text);
}
function notiere(wer, was) {
  protokoll.unshift({ zeit: new Date().toISOString(), wer, was });
  if (protokoll.length > 3000) protokoll.length = 3000;
  sichere("protokoll", protokoll);
}

/* Verspätungsalarm an die Dispo.
   Regel: erst ab einer Prognose von mindestens 20 Minuten Verspätung,
   und dann genau einmal je Auftrag. Orange loest nichts aus, kleine
   Schwankungen ebenfalls nicht. Der aktuelle Zustand bleibt in der
   Übersicht sichtbar — der Alarm ist nur die Benachrichtigung. */
function alarmPruefen(a, puffer, ankunftIso) {
  if (!a || a.gemeldet || puffer == null) return false;
  const verzug = -Math.round(puffer);
  if (verzug < einst.verspaetungAb) return false;
  a.gemeldet = true;
  const uhr = ankunftIso
    ? new Date(ankunftIso).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })
    : "unbekannt";
  melde("rot",
    `Auftrag ${a.nummer} · ${a.zielOrt} ${a.termin}. Ankunft voraussichtlich ${uhr} — ${verzug} Min. zu spät.`,
    a.id, { verspaetungMin: verzug });
  return true;
}

// Läuft jede Minute: prüft, ob ein Auftrag zu spät wird
function verspaetungPruefen() {
  const jetzt = new Date();
  let geaendert = false;
  const gesehen = new Set();

  for (const a of auftraege) {
    if (a.status === "fertig" || a.status === "entwurf") continue;
    const schluessel = a.fahrerId + "|" + a.datum;
    if (!a.fahrerId || gesehen.has(schluessel)) continue;
    gesehen.add(schluessel);

    const k = kette(a.fahrerId, a.datum, jetzt);
    if (k.erster) {
      const r = rechne(k.erster, jetzt);
      if (alarmPruefen(k.erster, r.puffer, r.ankunft)) geaendert = true;
    }
    // Der zweite Auftrag haengt am ersten: Entladung, Restarbeiten, Wege.
    if (k.zweiter) {
      const n = naechsterAusKette(k.erster, k.zweiter, jetzt);
      if (n && !n.unsicher && alarmPruefen(k.zweiter, n.puffer, n.ankunft)) geaendert = true;
    }
    // Weitere Aufträge des Tages wie bisher einzeln bewerten
    for (const w of k.offen.slice(2)) {
      const r = rechne(w, jetzt);
      if (alarmPruefen(w, r.puffer, r.ankunft)) geaendert = true;
    }
  }
  // Aufträge ohne Fahrer weiterhin einzeln bewerten
  for (const a of auftraege) {
    if (a.status === "fertig" || a.status === "entwurf" || a.fahrerId) continue;
    const r = rechne(a, jetzt);
    if (alarmPruefen(a, r.puffer, r.ankunft)) geaendert = true;
  }
  if (geaendert) sichere("auftraege", auftraege);
}
setInterval(verspaetungPruefen, 60000);

/* -----------------------------------------------------------
   6. Kleine Helfer für Anfragen
   ----------------------------------------------------------- */
function json(res, code, wert) {
  const s = JSON.stringify(wert);
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8", "Content-Length": Buffer.byteLength(s) });
  res.end(s);
}
function koerper(req) {
  return new Promise((ok, fehler) => {
    let d = "", gross = 0;
    req.on("data", c => {
      gross += c.length;
      if (gross > 12e6) { fehler(new Error("zu groß")); req.destroy(); return; }
      d += c;
    });
    req.on("end", () => { try { ok(d ? JSON.parse(d) : {}); } catch (e) { fehler(e); } });
    req.on("error", fehler);
  });
}
function fotoSpeichern(base64) {
  if (!base64) return null;
  const rein = base64.replace(/^data:image\/\w+;base64,/, "");
  const name = crypto.randomUUID() + ".jpg";
  fs.writeFileSync(path.join(FOTOS, name), Buffer.from(rein, "base64"));
  return name;
}

const TYPEN = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
                ".js": "text/javascript; charset=utf-8", ".jpg": "image/jpeg",
                ".png": "image/png", ".ico": "image/x-icon", ".json": "application/json" };

/* -----------------------------------------------------------
   7. Der Server
   ----------------------------------------------------------- */
const server = http.createServer(async (req, res) => {
  const u    = new URL(req.url, "http://x");
  const weg  = u.pathname;
  const nutzer = nutzerAus(req);

  try {
    /* --- Anmeldung ------------------------------------------------ */
    if (weg === "/api/anmelden" && req.method === "POST") {
      const b = await koerper(req);
      const gefunden = benutzer.find(x => x.name.toLowerCase() === String(b.name || "").trim().toLowerCase()
                                       && x.pin === String(b.pin || ""));
      if (!gefunden) { notiere("?", "Fehlversuch Anmeldung " + b.name); return json(res, 401, { fehler: "Name oder PIN stimmt nicht." }); }
      const t = neuerToken(gefunden.id);
      res.setHeader("Set-Cookie", `tl_token=${t}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SITZUNGSDAUER / 1000}`);
      notiere(gefunden.name, "angemeldet");
      return json(res, 200, { rolle: gefunden.rolle, name: gefunden.name });
    }
    if (weg === "/api/fahrerliste") {
      // Nur Namen, keine PINs — damit der Fahrer nichts tippen muss
      return json(res, 200, benutzer.map(b => ({ name: b.name, rolle: b.rolle })));
    }
    if (weg === "/api/abmelden") {
      res.setHeader("Set-Cookie", "tl_token=; Path=/; Max-Age=0");
      return json(res, 200, { ok: true });
    }
    if (weg === "/api/ich") {
      if (!nutzer) return json(res, 401, { fehler: "nicht angemeldet" });
      return json(res, 200, { name: nutzer.name, rolle: nutzer.rolle, id: nutzer.id });
    }

    /* --- Ab hier nur angemeldet ----------------------------------- */
    if (weg.startsWith("/api/") || weg.startsWith("/foto/") || weg.startsWith("/wartezeit/")) {
      if (!nutzer) return json(res, 401, { fehler: "nicht angemeldet" });
    }

    /* --- Fahrer: mein Tag ----------------------------------------- */
    if (weg === "/api/fahrer/tag") {
      const tag = heute();
      const meine = auftraege
        .filter(a => a.fahrerId === nutzer.id && a.datum === tag && a.status !== "entwurf")
        .sort((x, y) => x.termin.localeCompare(y.termin))
        .map(a => ({ ...a, rechnung: rechne(a) }));

      // Der laufende Auftrag bekommt den nächsten Termin aus der Kette mit,
      // damit die App beim Entladen zeigen kann, ob es danach reicht.
      const laufend = meine.find(a => a.status !== "fertig");
      if (laufend) {
        const k = kette(nutzer.id, tag);
        if (k.zweiter) laufend.rechnung.naechster = naechsterAusKette(k.erster, k.zweiter);
      }

      const offen = meine.filter(a => a.status !== "fertig");
      let morgen = [];
      if (offen.length === 0) {
        const m = new Date(); m.setDate(m.getDate() + 1);
        const md = m.toLocaleDateString("sv-SE");
        morgen = auftraege
          .filter(a => a.fahrerId === nutzer.id && a.datum === md && a.status !== "entwurf")
          .sort((x, y) => x.termin.localeCompare(y.termin));
      }
      return json(res, 200, { heute: meine, morgen, einst });
    }

    /* --- Fahrer: Abholung oder Abgabe mit Foto -------------------- */
    if (weg === "/api/fahrer/ereignis" && req.method === "POST") {
      const b = await koerper(req);
      const a = auftraege.find(x => x.id === b.auftragId && x.fahrerId === nutzer.id);
      if (!a) return json(res, 404, { fehler: "Auftrag nicht gefunden" });
      const ARTEN = ["abholung","ankunft","warten","entladenStart","entladenLaenger",
                     "entladenFertig","abgabe"];
      if (!ARTEN.includes(b.art)) return json(res, 400, { fehler: "unbekannter Schritt" });
      const brauchtFoto = b.art === "abholung" || b.art === "abgabe";
      if (brauchtFoto && !b.foto) return json(res, 400, { fehler: "Ohne Foto geht es nicht." });

      // Schon gebucht? Dann nichts überschreiben (Doppeltipp, zweiter Versuch
      // aus der Warteschlange). Die Antwort bleibt freundlich.
      const schonDa = { abholung: a.abholZeit, ankunft: a.ankunftZeit, abgabe: a.abgabeZeit,
                        warten: a.wartenZeit, entladenStart: a.entladeStart,
                        entladenFertig: a.entladeFertigZeit, entladenLaenger: null }[b.art];
      if (schonDa) {
        notiere(nutzer.name, `${b.art} Auftrag ${a.nummer} doppelt gesendet, ignoriert`);
        return json(res, 200, { ok: true, doppelt: true, naechster: null });
      }

      const datei = brauchtFoto ? fotoSpeichern(b.foto) : null;
      const jetzt = new Date().toISOString();
      const gps   = (b.lat && b.lon) ? { lat: b.lat, lon: b.lon } : null;

      if (b.art === "abholung") {
        a.abholZeit = jetzt; a.fotoAbhol = datei; a.abholGps = gps; a.status = "geladen";

        /* Containernummer: erwartet und bestätigt bleiben getrennt.
           Die Nummer aus dem Auftrag wird niemals stillschweigend ersetzt. */
        a.containerErwartet = a.container || null;
        if (b.containerErkannt)   a.containerErkannt   = String(b.containerErkannt).toUpperCase();
        if (b.containerBestaetigt) a.containerBestaetigt = String(b.containerBestaetigt).toUpperCase();
        const rein = x => String(x || "").replace(/[^A-Za-z0-9]/g, "").toUpperCase();
        const weicht = !!(a.containerBestaetigt && a.containerErwartet &&
                          rein(a.containerBestaetigt) !== rein(a.containerErwartet));
        if (weicht) {
          a.abweichung = { erwartet: a.containerErwartet, bestaetigt: a.containerBestaetigt,
                           fahrer: nutzer.name, zeit: jetzt, foto: datei, geprueft: false };
          melde("rot",
            `Abweichung bei Auftrag ${a.nummer}: im Auftrag ${a.containerErwartet}, ` +
            `abgeholt ${a.containerBestaetigt} (${nutzer.name}). Vom Büro zu prüfen.`,
            a.id, { abweichung: true, erwartet: a.containerErwartet,
                    bestaetigt: a.containerBestaetigt, foto: datei, fahrerId: nutzer.id });
        } else if (a.containerBestaetigt) {
          // Passt zum Auftrag: das gehört in den Auftragsverlauf, nicht in die
          // Meldungsliste — die Dispo soll dort nur Dinge sehen, die sie angehen.
          notiere(nutzer.name, `Abholung bestätigt, Container ${a.containerBestaetigt}, Auftrag ${a.nummer}`);
        }

        const weg = ortPruefen(a.abholOrt, gps);
        if (weg) { a.abholWeit = weg;
          melde("warn", `Auftrag ${a.nummer}: Foto der Abholung ${weg} km vom Abholort entfernt aufgenommen.`, a.id); }
      } else if (b.art === "ankunft") {
        a.ankunftZeit = jetzt; a.ankunftGps = gps; a.status = "angekommen";
        const weg = ortPruefen(a.zielOrt, gps);
        if (weg) { a.ankunftWeit = weg;
          melde("warn", `Auftrag ${a.nummer}: Ankunft ${weg} km vom Zielort entfernt gemeldet.`, a.id); }
      } else if (b.art === "warten") {
        a.wartenZeit = jetzt; a.status = "warten";
        if (!a.ankunftZeit) a.ankunftZeit = jetzt;

      } else if (b.art === "entladenStart") {
        // Die geplante Entladezeit läuft ab jetzt.
        a.entladeStart = jetzt; a.status = "entladen";
        if (!a.ankunftZeit) a.ankunftZeit = jetzt;
        a.entladePlanMin = b.planMin ?? a.entladePlanMin ?? einst.entladezeitStandard;
        a.entladeUnbekannt = false;
        a.entladeEndePlan = new Date(new Date(jetzt).getTime() + a.entladePlanMin * 60000).toISOString();

      } else if (b.art === "entladenLaenger") {
        // „Noch 30 Minuten“ zählt ab dem Tippen, nicht ab Entladebeginn.
        if (a.status !== "entladen") return json(res, 400, { fehler: "Entladung läuft nicht." });
        if (b.minuten == null) {
          a.entladeUnbekannt = true; a.entladeEndePlan = null;
        } else {
          const m = Math.max(0, Math.round(Number(b.minuten) || 0));
          a.entladeUnbekannt = false;
          a.entladeEndePlan = new Date(new Date(jetzt).getTime() + m * 60000).toISOString();
        }
        a.entladeVerlaengert = (a.entladeVerlaengert || 0) + 1;

      } else if (b.art === "entladenFertig") {
        // Entladeende ist nicht die Ablieferung: das Foto kommt noch.
        a.entladeFertigZeit = jetzt; a.status = "entladen_fertig";
        a.entladeUnbekannt = false;
        if (!a.ankunftZeit) a.ankunftZeit = jetzt;

      } else {
        a.abgabeZeit = jetzt; a.fotoAbgabe = datei; a.abgabeGps = gps; a.status = "fertig";
        if (!a.ankunftZeit) a.ankunftZeit = jetzt;      // falls Ankunft vergessen wurde
        const weg = ortPruefen(a.zielOrt, gps);
        if (weg) { a.abgabeWeit = weg;
          melde("warn", `Auftrag ${a.nummer}: Foto der Abgabe ${weg} km vom Zielort entfernt aufgenommen.`, a.id); }
        const warte = Math.round(min(new Date(jetzt) - new Date(a.ankunftZeit)));
        const frei = a.freiMin ?? einst.freiMin;
        if (warte > frei)
          melde("warn", `Auftrag ${a.nummer}: ${warte} Min. gewartet, davon ${warte - frei} Min. berechenbar.`, a.id);
        const verzug = Math.round(min(new Date(jetzt) - zeitpunkt(a.datum, a.termin)));
        if (verzug >= einst.verspaetungAb && !a.gemeldet) {
          a.gemeldet = true;
          melde("rot", `Auftrag ${a.nummer} ${verzug} Min. zu spät abgegeben (${a.zielOrt}).`, a.id);
        }
      }
      sichere("auftraege", auftraege);
      notiere(nutzer.name, `${b.art} Auftrag ${a.nummer}`);

      // Antwort: schaffe ich den nächsten Termin?
      let naechster = null;
      const k = kette(nutzer.id, a.datum);
      const ziel = (k.erster && k.erster.id !== a.id) ? k.erster : k.zweiter;
      if (ziel) {
        naechster = naechsterAusKette(a.status === "fertig" ? null : a, ziel);
        // Gleiche Regel wie überall: Alarm erst ab 20 Minuten Prognose.
        if (naechster && !naechster.unsicher &&
            alarmPruefen(ziel, naechster.puffer, naechster.ankunft)) sichere("auftraege", auftraege);
      }
      return json(res, 200, { ok: true, naechster, auftrag: {
        status: a.status, entladeEndePlan: a.entladeEndePlan || null,
        entladeUnbekannt: !!a.entladeUnbekannt,
        containerBestaetigt: a.containerBestaetigt || null,
        abweichung: a.abweichung ? true : false } });
    }

    /* --- Fahrer: Problem melden ----------------------------------
       Geht in dieselbe Meldungsliste wie die Verspätungsmeldungen.
       Nichts wird erfunden: „gesendet“ heißt, der Server hat es. */
    if (weg === "/api/fahrer/meldung" && req.method === "POST") {
      const b = await koerper(req);
      const ARTEN = {
        stau:           { wort: "Stau",                  stufe: "warn" },
        warten:         { wort: "Fahrer muss warten",    stufe: "warn" },
        containerFehlt: { wort: "Container fehlt",       stufe: "rot"  },
        panne:          { wort: "Panne",                 stufe: "rot"  }
      };
      const k = ARTEN[b.art];
      if (!k) return json(res, 400, { fehler: "unbekannte Meldung" });
      const a = b.auftragId ? auftraege.find(x => x.id === b.auftragId && x.fahrerId === nutzer.id) : null;
      const wo = a ? ` · Auftrag ${a.nummer} (${a.zielOrt || ""} ${a.termin || ""})` : "";
      melde(k.stufe, `${k.wort} — ${nutzer.name}${wo}`, a ? a.id : null,
            { fahrerId: nutzer.id, grund: b.art,
              gps: (b.lat && b.lon) ? { lat: +b.lat, lon: +b.lon } : null });
      notiere(nutzer.name, "Meldung " + b.art);
      return json(res, 200, { ok: true, id: meldungen[0].id });
    }

    /* --- Fahrer: eigene Meldungen und ihr Lesestand --------------- */
    if (weg === "/api/fahrer/meldungen") {
      return json(res, 200, {
        meldungen: meldungen
          .filter(m => m.fahrerId === nutzer.id)
          .slice(0, 20)
          .map(m => ({ id: m.id, zeit: m.zeit, grund: m.grund || null, gelesen: !!m.gelesen }))
      });
    }

    /* --- Fahrer: Änderung gesehen und bestätigt ------------------- */
    if (weg === "/api/fahrer/gesehen" && req.method === "POST") {
      const b = await koerper(req);
      const a = auftraege.find(x => x.id === b.auftragId && x.fahrerId === nutzer.id);
      if (!a) return json(res, 404, { fehler: "Auftrag nicht gefunden" });
      a.aenderungGesehen = { zeit: new Date().toISOString(), von: nutzer.name };
      sichere("auftraege", auftraege);
      notiere(nutzer.name, "Änderung bestätigt bei Auftrag " + a.nummer);
      return json(res, 200, { ok: true });
    }

    /* --- Position (Fahrerhandy oder später Traccar) --------------- */
    if (weg === "/api/position" && req.method === "POST") {
      const b = await koerper(req);
      if (b.lat && b.lon) {
        positionen.push({ fahrerId: nutzer.id, name: nutzer.name,
                          lat: +b.lat, lon: +b.lon, zeit: new Date().toISOString() });
        // Datenschutz: Rohspur nur 30 Tage aufbewahren
        const grenze = Date.now() - 30 * 86400000;
        positionen = positionen.filter(p => new Date(p.zeit).getTime() > grenze);
        sichere("positionen", positionen);
      }
      return json(res, 200, { ok: true });
    }

    /* --- Ab hier nur Dispo ---------------------------------------- */
    if (weg.startsWith("/api/dispo/") && nutzer.rolle !== "dispo")
      return json(res, 403, { fehler: "keine Berechtigung" });

    if (weg === "/api/dispo/uebersicht") {
      verspaetungPruefen();                    // sofort bewerten, nicht erst in einer Minute
      const von = u.searchParams.get("von") || heute();
      const bis = u.searchParams.get("bis") || von;
      const liste = auftraege
        .filter(a => a.datum >= von && a.datum <= bis)
        .sort((x, y) => (x.datum + x.termin).localeCompare(y.datum + y.termin))
        .map(a => ({ ...a, rechnung: rechne(a) }));
      return json(res, 200, {
        auftraege: liste,
        fahrer: benutzer.filter(b => b.rolle === "fahrer").map(b => ({ id: b.id, name: b.name })),
        meldungen: meldungen.slice(0, 30),
        einst
      });
    }

    if (weg === "/api/dispo/auftrag" && req.method === "POST") {
      const b = await koerper(req);
      let a = b.id ? auftraege.find(x => x.id === b.id) : null;
      const neu = !a;
      if (neu) {
        a = { id: crypto.randomUUID(),
              nummer: String(4700 + auftraege.length + 1),
              status: "entwurf", gemeldet: false,
              abholZeit: null, ankunftZeit: null, abgabeZeit: null,
              fotoAbhol: null, fotoAbgabe: null };
        auftraege.push(a);
      }
      const FELDER = ["datum","kunde","abholOrt","abholAb","zielOrt","termin",
                      "container","chassis","siegel","zugmaschine","fahrerId",
                      "fahrzeitMin","ruestzeitMin","notiz","freiMin",
                      "abholFirma","abholAdresse","abholTor","zielAdresse","zielTor"];
      // Was sich für den Fahrer sichtbar ändert, wird gemerkt:
      // er bekommt es als „Neu: Tor 3 statt Tor 1“ angezeigt.
      const WICHTIG = { termin:"termin", zielOrt:"ziel", zielAdresse:"ziel", zielTor:"tor",
                        abholOrt:"abholenBei", abholAdresse:"abholenBei", abholTor:"tor",
                        abholAb:"abholzeitAb", container:"container", chassis:"chassis",
                        notiz:"" };
      const punkte = [];
      for (const f of FELDER) {
        if (b[f] === undefined) continue;
        if (!neu && WICHTIG[f] !== undefined && String(a[f] ?? "") !== String(b[f] ?? "")) {
          punkte.push({ feld: WICHTIG[f], von: a[f] ? String(a[f]) : null, nach: String(b[f] ?? "") });
        }
        a[f] = b[f];
      }
      if (b.status) a.status = b.status;
      if (punkte.length) {
        a.aenderung = { zeit: new Date().toISOString(), punkte };
        a.aenderungGesehen = null;              // muss neu bestätigt werden
      }
      a.gemeldet = false;                       // nach Änderung neu bewerten
      sichere("auftraege", auftraege);
      notiere(nutzer.name, (neu ? "Auftrag angelegt " : "Auftrag geändert ") + a.nummer);
      verspaetungPruefen();                     // schon jetzt unmöglich? dann sofort melden
      return json(res, 200, a);
    }

    if (weg === "/api/dispo/loeschen" && req.method === "POST") {
      const b = await koerper(req);
      const i = auftraege.findIndex(x => x.id === b.id);
      if (i >= 0) { notiere(nutzer.name, "Auftrag gelöscht " + auftraege[i].nummer);
                    auftraege.splice(i, 1); sichere("auftraege", auftraege); }
      return json(res, 200, { ok: true });
    }

    if (weg === "/api/dispo/gelesen" && req.method === "POST") {
      meldungen.forEach(m => m.gelesen = true);
      sichere("meldungen", meldungen);
      return json(res, 200, { ok: true });
    }

    if (weg === "/api/dispo/verlauf") {
      const tag = u.searchParams.get("tag") || heute();
      return json(res, 200, {
        positionen: positionen.filter(p => p.zeit.slice(0, 10) === tag),
        ereignisse: auftraege.filter(a => a.datum === tag)
      });
    }

    if (weg === "/api/dispo/nachtragen" && req.method === "POST") {
      // Wenn das Handy leer war: Zeiten von Hand eintragen
      const b = await koerper(req);
      const a = auftraege.find(x => x.id === b.id);
      if (!a) return json(res, 404, { fehler: "Auftrag nicht gefunden" });
      const setz = (feld, wert) => { if (wert) a[feld] = new Date(a.datum + "T" + wert + ":00").toISOString(); };
      setz("abholZeit",  b.abhol);
      setz("ankunftZeit", b.ankunft);
      setz("abgabeZeit", b.abgabe);
      if (a.abgabeZeit) a.status = "fertig";
      else if (a.ankunftZeit) a.status = "angekommen";
      else if (a.abholZeit) a.status = "geladen";
      a.nachgetragen = { von: nutzer.name, am: new Date().toISOString() };
      sichere("auftraege", auftraege);
      notiere(nutzer.name, "Zeiten nachgetragen bei Auftrag " + a.nummer);
      return json(res, 200, a);
    }

    if (weg.startsWith("/wartezeit/")) {
      if (nutzer.rolle !== "dispo") return json(res, 403, { fehler: "keine Berechtigung" });
      const a = auftraege.find(x => x.id === weg.slice(11));
      if (!a || !a.ankunftZeit) { res.writeHead(404); return res.end("Kein Wartezeitprotokoll vorhanden"); }
      const r = rechne(a);
      const u = t => t ? new Date(t).toLocaleString("de-DE") : "—";
      const html = `<!DOCTYPE html><html lang="de"><head><meta charset="utf-8">
<title>Wartezeitprotokoll ${a.nummer}</title><style>
body{font-family:Arial,Helvetica,sans-serif;max-width:760px;margin:32px auto;padding:0 20px;color:#141B22}
h1{font-size:22px;border-bottom:3px solid #141B22;padding-bottom:8px}
table{border-collapse:collapse;width:100%;margin:18px 0}
td,th{border:1px solid #C9CCC7;padding:9px 10px;text-align:left;font-size:15px}
th{background:#F2F3F0;width:38%}
.gross{font-size:26px;font-weight:bold}
.hinw{font-size:12px;color:#5B6670;margin-top:26px;border-top:1px solid #C9CCC7;padding-top:10px}
img{max-width:250px;border:1px solid #C9CCC7;margin-right:10px}
@media print{.kein{display:none}}
</style></head><body>
<h1>Wartezeitprotokoll · Auftrag ${a.nummer}</h1>
<table>
<tr><th>Kunde</th><td>${a.kunde || "—"}</td></tr>
<tr><th>Datum</th><td>${new Date(a.datum + "T12:00:00").toLocaleDateString("de-DE")}</td></tr>
<tr><th>Ort</th><td>${a.zielOrt || "—"}</td></tr>
<tr><th>Container</th><td>${a.container || "—"}</td></tr>
<tr><th>Vereinbarter Termin</th><td>${a.termin} Uhr</td></tr>
<tr><th>Ankunft</th><td>${u(a.ankunftZeit)}</td></tr>
<tr><th>Abfahrt</th><td>${u(a.abgabeZeit)}</td></tr>
<tr><th>Aufenthalt gesamt</th><td class="gross">${r.wartetSeit} Minuten</td></tr>
<tr><th>Davon vertraglich frei</th><td>${r.frei} Minuten</td></tr>
<tr><th>Berechenbare Wartezeit</th><td class="gross">${r.berechenbar} Minuten</td></tr>
<tr><th>Grund</th><td>${a.notiz || "—"}</td></tr>
${a.nachgetragen ? '<tr><th>Hinweis</th><td>Zeiten nachgetragen von ' + a.nachgetragen.von + '</td></tr>' : ''}
</table>
${a.fotoAbhol || a.fotoAbgabe ? "<p><b>Belegfotos</b></p>" : ""}
${a.fotoAbhol  ? '<img src="/foto/' + a.fotoAbhol  + '">' : ""}
${a.fotoAbgabe ? '<img src="/foto/' + a.fotoAbgabe + '">' : ""}
<p class="hinw">Alle Zeitangaben stammen aus der Serveruhr des Dispositionssystems und wurden
zum jeweiligen Zeitpunkt vom Fahrer bestätigt. Erstellt am ${new Date().toLocaleString("de-DE")}.</p>
<p class="kein"><button onclick="window.print()" style="padding:12px 20px;font-size:16px">
Drucken oder als PDF speichern</button></p>
</body></html>`;
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      return res.end(html);
    }

    if (weg === "/api/dispo/einstellungen" && req.method === "POST") {
      const b = await koerper(req);
      einst = { ...einst, ...b };
      sichere("einstellungen", einst);
      notiere(nutzer.name, "Einstellungen geändert");
      return json(res, 200, einst);
    }

    if (weg === "/api/dispo/fahrer" && req.method === "POST") {
      const b = await koerper(req);
      if (b.neu) {
        benutzer.push({ id: crypto.randomUUID(), name: b.neu, rolle: "fahrer", pin: String(b.pin || "1111") });
      } else if (b.id && b.pin) {
        const f = benutzer.find(x => x.id === b.id); if (f) f.pin = String(b.pin);
      }
      sichere("benutzer", benutzer);
      notiere(nutzer.name, "Fahrerzugang geändert");
      return json(res, 200, { ok: true });
    }

    /* --- Fotos ---------------------------------------------------- */
    if (weg.startsWith("/foto/")) {
      const name = path.basename(weg.slice(6));
      const p = path.join(FOTOS, name);
      if (!fs.existsSync(p)) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { "Content-Type": "image/jpeg", "Cache-Control": "private, max-age=86400" });
      return fs.createReadStream(p).pipe(res);
    }

    /* --- Webseiten ------------------------------------------------ */
    let datei = weg === "/" ? "/anmelden.html" : weg;
    const p = path.join(WEB, path.normalize(datei).replace(/^(\.\.[/\\])+/, ""));
    if (fs.existsSync(p) && fs.statSync(p).isFile()) {
      res.writeHead(200, { "Content-Type": TYPEN[path.extname(p)] || "application/octet-stream" });
      return fs.createReadStream(p).pipe(res);
    }
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Seite nicht gefunden");

  } catch (e) {
    console.error("FEHLER:", e.message);
    json(res, 500, { fehler: "Serverfehler" });
  }
});

server.listen(PORT, () => {
  console.log("\n  TWISTLOCK läuft.");
  console.log("  Im Browser öffnen:  http://localhost:" + PORT);
  console.log("  Beenden mit Strg + C\n");
});

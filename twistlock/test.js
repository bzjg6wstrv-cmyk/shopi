// Der Betrieb rechnet in Europe/Berlin — der Test muss dieselbe Uhr benutzen,
// sonst vergleicht er Berliner Termine mit UTC-Uhrzeiten.
process.env.TZ = process.env.TZ || "Europe/Berlin";

/* Selbsttest: startet den Server, legt das Montagsbeispiel an,
   prüft Ampel, Foto-Ereignisse und Verspätungsmeldung.
   Aufruf:  node test.js                                        */
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

// sauberer Start
for (const d of ["daten", "fotos"]) {
  const p = path.join(__dirname, d);
  if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true });
}

const srv = spawn(process.execPath, ["server.js"], { cwd: __dirname, env: { ...process.env, PORT: 3999 } });
srv.stdout.on("data", () => {});
srv.stderr.on("data", d => console.error("SERVER:", d.toString()));

const BASIS = "http://localhost:3999";
let keks = "";

async function ruf(weg, methode = "GET", koerper) {
  const r = await fetch(BASIS + weg, {
    method: methode,
    headers: { "Content-Type": "application/json", ...(keks ? { Cookie: keks } : {}) },
    body: koerper ? JSON.stringify(koerper) : undefined
  });
  const set = r.headers.get("set-cookie");
  if (set) keks = set.split(";")[0];
  const t = await r.text();
  return { status: r.status, daten: t ? JSON.parse(t) : null };
}

let fehler = 0;
function pruefe(name, bedingung, zusatz = "") {
  console.log((bedingung ? "  OK   " : "  FEHL ") + name + (zusatz ? "  → " + zusatz : ""));
  if (!bedingung) fehler++;
}

const hhmm = m => String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0");
// winziges gültiges JPEG als Testfoto
const TESTFOTO = "data:image/jpeg;base64," + Buffer.from([
  0xFF,0xD8,0xFF,0xDB,0x00,0x43,0x00,0x03,0x02,0x02,0x02,0x02,0x02,0x03,0x02,0x02,
  0x02,0x03,0x03,0x03,0x03,0x04,0x06,0x04,0x04,0x04,0x04,0x04,0x08,0x06,0x06,0x05,
  0x06,0x09,0x08,0x0A,0x0A,0x09,0x08,0x09,0x09,0x0A,0x0C,0x0F,0x0C,0x0A,0x0B,0x0E,
  0x0B,0x09,0x09,0x0D,0x11,0x0D,0x0E,0x0F,0x10,0x10,0x11,0x10,0x0A,0x0C,0x12,0x13,
  0x12,0x10,0x13,0x0F,0x10,0x10,0x10,0xFF,0xC9,0x00,0x0B,0x08,0x00,0x01,0x00,0x01,
  0x01,0x01,0x11,0x00,0xFF,0xCC,0x00,0x06,0x00,0x10,0x10,0x05,0xFF,0xDA,0x00,0x08,
  0x01,0x01,0x00,0x00,0x3F,0x00,0xD2,0xCF,0x20,0xFF,0xD9
]).toString("base64");

(async () => {
  await new Promise(r => setTimeout(r, 900));
  console.log("\nTWISTLOCK Selbsttest\n");

  // 1 Anmeldung
  let r = await ruf("/api/anmelden", "POST", { name: "Ahmed", pin: "1234" });
  pruefe("Dispo kann sich anmelden", r.status === 200 && r.daten.rolle === "dispo");

  r = await ruf("/api/anmelden", "POST", { name: "Ahmed", pin: "0000" });
  pruefe("Falsche PIN wird abgelehnt", r.status === 401);
  await ruf("/api/anmelden", "POST", { name: "Ahmed", pin: "1234" });

  // 2 Fahrer holen
  r = await ruf("/api/dispo/uebersicht");
  const fahrer = r.daten.fahrer[0];
  pruefe("Fahrerzugang vorhanden", !!fahrer, fahrer && fahrer.name);

  // 3 Ampel pruefen — unabhaengig von der Tageszeit.
  //   Termin morgen 12:00, die Fahrzeit wird so gesetzt, dass der Puffer
  //   genau dort landet, wo wir ihn erwarten.
  const morgen = new Date(Date.now() + 86400000);
  const mdat = morgen.toLocaleDateString("sv-SE");
  const bis12 = Math.round((new Date(mdat + "T12:00:00") - Date.now()) / 60000);
  const faelle = [
    { name:"gruen", fahrzeit: bis12 - 45, erwartet:"gruen" },
    { name:"orange", fahrzeit: bis12 - 9,  erwartet:"gelb"  },
    { name:"rot",   fahrzeit: bis12 + 30, erwartet:"rot"   }
  ];
  const ids = [];
  for (const f of faelle) {
    r = await ruf("/api/dispo/auftrag", "POST", {
      datum: mdat, kunde: "Testkunde",
      abholOrt: "Bremen", abholAb: "05:00",
      zielOrt: "Walsrode", termin: "12:00",
      container: "MSCU 123456-7", chassis: "CH-01",
      zugmaschine: "HB-XX 123", siegel: "SL 88213",
      fahrerId: fahrer.id, status: "freigegeben",
      fahrzeitMin: f.fahrzeit, ruestzeitMin: 0
    });
    ids.push(r.daten.id);
  }
  pruefe("Drei Auftraege angelegt", ids.length === 3 && ids.every(Boolean));

  r = await ruf("/api/dispo/uebersicht?von=" + mdat + "&bis=" + mdat);
  faelle.forEach((f, n) => {
    const a = r.daten.auftraege.find(x => x.id === ids[n]);
    pruefe("Zeitstatus " + f.name,
      a && a.rechnung.ampel === f.erwartet,
      a ? a.rechnung.ampel + " / Puffer " + a.rechnung.puffer : "nicht gefunden");
  });

  // 4 Auftraege fuer heute, fuer den Fahrerablauf
  const heute = new Date().toLocaleDateString("sv-SE");
  for (const t of ["06:30","11:00","13:30"]) {
    await ruf("/api/dispo/auftrag", "POST", {
      datum: heute, kunde: "Testkunde", abholOrt: "Bremen", abholAb: "05:00",
      zielOrt: "Walsrode", termin: t, container: "MSCU 123456-7",
      chassis: "CH-01", zugmaschine: "HB-XX 123", siegel: "SL 88213",
      fahrerId: fahrer.id, status: "freigegeben"
    });
  }

  // 5 Verspätungsmeldung wurde erzeugt.
  //   Ein Alarm setzt eine aktuelle Ortung voraus — also erst orten.
  keks = ""; await ruf("/api/anmelden","POST",{ name:fahrer.name, pin:"1111" });
  await ruf("/api/position","POST",{ lat:53.07, lon:8.80 });
  keks = ""; await ruf("/api/anmelden","POST",{ name:"Ahmed", pin:"1234" });
  r = await ruf("/api/dispo/uebersicht");
  pruefe("Meldung bei zu spätem Auftrag", r.daten.meldungen.some(x => x.art === "rot"),
    (r.daten.meldungen[0] || {}).text);

  // 6 Fahrer sieht nur heute und keine Entwürfe
  r = await ruf("/api/dispo/auftrag", "POST", {
    datum: heute, zielOrt: "Geheim", termin: "23:00", fahrerId: fahrer.id, status: "entwurf"
  });
  keks = "";
  r = await ruf("/api/anmelden", "POST", { name: fahrer.name, pin: "1111" });
  pruefe("Fahrer kann sich anmelden", r.status === 200 && r.daten.rolle === "fahrer");

  r = await ruf("/api/fahrer/tag");
  pruefe("Fahrer sieht nur freigegebene Aufträge",
    r.daten.heute.length === 3 && !r.daten.heute.some(a => a.zielOrt === "Geheim"),
    r.daten.heute.length + " Aufträge");
  pruefe("Aufträge sind nach Uhrzeit sortiert",
    r.daten.heute.every((a, i, arr) => i === 0 || arr[i-1].termin <= a.termin));

  // 7 Fahrer darf nicht in die Dispo
  r = await ruf("/api/dispo/uebersicht");
  pruefe("Fahrer kommt nicht in den Dispobereich", r.status === 403);

  // 8 Abholung ohne Foto wird abgelehnt
  const ersterId = (await ruf("/api/fahrer/tag")).daten.heute[0].id;
  r = await ruf("/api/fahrer/ereignis", "POST", { auftragId: ersterId, art: "abholung" });
  pruefe("Ohne Foto keine Buchung", r.status === 400);

  // 9 Abholung mit Foto
  r = await ruf("/api/fahrer/ereignis", "POST",
    { auftragId: ersterId, art: "abholung", foto: TESTFOTO, lat: 53.07, lon: 8.80 });
  pruefe("Abholung mit Foto gespeichert", r.status === 200 && r.daten.ok);

  let tag = (await ruf("/api/fahrer/tag")).daten.heute.find(a => a.id === ersterId);
  pruefe("Status steht auf geladen", tag.status === "geladen");
  pruefe("Foto ist auf der Platte", !!tag.fotoAbhol &&
    fs.existsSync(path.join(__dirname, "fotos", tag.fotoAbhol)));
  pruefe("Ort wurde getrennt gespeichert", tag.abholGps && tag.abholGps.lat === 53.07);

  // 10 Abgabe liefert die Antwort für den nächsten Termin
  r = await ruf("/api/fahrer/ereignis", "POST",
    { auftragId: ersterId, art: "abgabe", foto: TESTFOTO, lat: 52.86, lon: 9.59 });
  pruefe("Abgabe gespeichert", r.status === 200);
  pruefe("Antwort enthält den nächsten Termin", !!r.daten.naechster,
    r.daten.naechster && (r.daten.naechster.termin + " " + r.daten.naechster.ampel +
      " Puffer " + r.daten.naechster.puffer));

  tag = (await ruf("/api/fahrer/tag")).daten.heute.find(a => a.id === ersterId);
  pruefe("Auftrag ist fertig", tag.status === "fertig" && !!tag.abgabeZeit);

  // 11 Position speichern
  r = await ruf("/api/position", "POST", { lat: 53.0, lon: 8.9 });
  pruefe("Position gespeichert", r.status === 200 &&
    JSON.parse(fs.readFileSync(path.join(__dirname, "daten", "positionen.json"))).length >= 1);

  // 12 Ohne Anmeldung geht nichts
  keks = "";
  r = await ruf("/api/fahrer/tag");
  pruefe("Ohne Anmeldung kein Zugriff", r.status === 401);


  // 13 Fahrerliste ohne Anmeldung, aber ohne PINs
  keks = "";
  r = await ruf("/api/fahrerliste");
  pruefe("Fahrerliste ohne Anmeldung abrufbar", r.status === 200 && Array.isArray(r.daten));
  pruefe("Fahrerliste enthaelt keine PINs",
    r.daten.every(x => x.pin === undefined), JSON.stringify(r.daten[0]));

  // 14 App-Dateien vorhanden
  for (const f of ["manifest.json","sw.js","einfach.css","sprache.js","fahrer.html",
                   "anmelden.html","icon-192.png","icon-512.png"]) {
    pruefe("Datei " + f + " liegt bereit", fs.existsSync(path.join(__dirname,"web",f)));
  }
  const man = JSON.parse(fs.readFileSync(path.join(__dirname,"web","manifest.json")));
  pruefe("Manifest startet beim Fahrer", man.start_url === "/fahrer.html" && man.display === "standalone");


  // 15 Ankunft, Wartezeit und Standortpruefung
  keks = "";
  await ruf("/api/anmelden","POST",{name:"Ahmed",pin:"1234"});
  let ue = (await ruf("/api/dispo/uebersicht")).daten;
  const fahrer2 = ue.fahrer[0];
  const heute2 = new Date().toLocaleDateString("sv-SE");
  const jetzt2 = new Date(); const m2 = jetzt2.getHours()*60 + jetzt2.getMinutes();
  r = await ruf("/api/dispo/auftrag","POST",{
    datum:heute2, kunde:"Wartetest", abholOrt:"Bremen", abholAb:"05:00",
    zielOrt:"Wartestadt", termin:hhmm((m2+200)%1440), container:"AAAU 111111 1",
    fahrerId:fahrer2.id, status:"freigegeben", notiz:"Tor 3, nicht Tor 1", freiMin:10});
  const wid = r.daten.id;
  pruefe("Notiz wird gespeichert", r.daten.notiz === "Tor 3, nicht Tor 1");
  pruefe("Freie Wartezeit je Auftrag", r.daten.freiMin === 10);

  keks = "";
  await ruf("/api/anmelden","POST",{name:fahrer2.name,pin:"1111"});
  await ruf("/api/fahrer/ereignis","POST",{auftragId:wid,art:"abholung",foto:TESTFOTO,lat:53.07,lon:8.80});
  r = await ruf("/api/fahrer/ereignis","POST",{auftragId:wid,art:"ankunft",lat:52.86,lon:9.59});
  pruefe("Ankunft ohne Foto moeglich", r.status === 200);
  let tg = (await ruf("/api/fahrer/tag")).daten.heute.find(a => a.id === wid);
  pruefe("Status steht auf angekommen", tg.status === "angekommen" && !!tg.ankunftZeit);
  pruefe("Wartezeit laeuft mit", tg.rechnung.wartetSeit != null, "Minuten: " + tg.rechnung.wartetSeit);

  r = await ruf("/api/fahrer/ereignis","POST",{auftragId:wid,art:"abgabe",foto:TESTFOTO,lat:52.86,lon:9.59});
  pruefe("Abgabe am gelernten Ort ohne Warnung", r.status === 200);

  // Ort ist jetzt gelernt: eine Abgabe 200 km weiter muss auffallen
  r = await ruf("/api/dispo/auftrag","POST",{}); // Platzhalter, wird gleich ersetzt
  keks = ""; await ruf("/api/anmelden","POST",{name:"Ahmed",pin:"1234"});
  r = await ruf("/api/dispo/auftrag","POST",{
    datum:heute2, zielOrt:"Wartestadt", termin:hhmm((m2+200)%1440),
    fahrerId:fahrer2.id, status:"freigegeben"});
  const wid2 = r.daten.id;
  keks = ""; await ruf("/api/anmelden","POST",{name:fahrer2.name,pin:"1111"});
  await ruf("/api/fahrer/ereignis","POST",{auftragId:wid2,art:"abholung",foto:TESTFOTO,lat:53.07,lon:8.80});
  await ruf("/api/fahrer/ereignis","POST",{auftragId:wid2,art:"abgabe",foto:TESTFOTO,lat:48.13,lon:11.58});
  keks = ""; await ruf("/api/anmelden","POST",{name:"Ahmed",pin:"1234"});
  ue = (await ruf("/api/dispo/uebersicht")).daten;
  pruefe("Foto weit weg wird gemeldet",
    ue.meldungen.some(x => /km vom Zielort/.test(x.text)),
    (ue.meldungen.find(x => /km vom/.test(x.text))||{}).text);

  // 16 Zeiten nachtragen
  r = await ruf("/api/dispo/nachtragen","POST",{id:wid2, ankunft:"08:15", abgabe:"09:40"});
  pruefe("Zeiten nachtragen funktioniert", r.status === 200 && !!r.daten.nachgetragen);
  ue = (await ruf("/api/dispo/uebersicht")).daten;
  const na = ue.auftraege.find(a => a.id === wid2);
  pruefe("Wartezeit aus nachgetragenen Zeiten", na.rechnung.wartetSeit === 85,
    "Minuten: " + na.rechnung.wartetSeit);

  // 17 Wartezeitprotokoll
  const pr = await fetch(BASIS + "/wartezeit/" + wid2, { headers:{ Cookie: keks } });
  const prText = await pr.text();
  pruefe("Wartezeitprotokoll wird erzeugt", pr.status === 200 && /Wartezeitprotokoll/.test(prText));
  pruefe("Protokoll nennt die berechenbare Zeit", /Berechenbare Wartezeit/.test(prText));

  // 18 Fahrer darf kein Protokoll sehen
  keks = ""; await ruf("/api/anmelden","POST",{name:fahrer2.name,pin:"1111"});
  const pr2 = await fetch(BASIS + "/wartezeit/" + wid2, { headers:{ Cookie: keks } });
  pruefe("Fahrer kommt nicht an das Protokoll", pr2.status === 403);


  // 19 Fahrerdateien der neuen Oberflaeche
  for (const f of ["fahreransicht.js","vorschau.html"]) {
    pruefe("Datei " + f + " liegt bereit", fs.existsSync(path.join(__dirname,"web",f)));
  }

  // 20 Abholort mit Firma, Adresse und Tor — getrennt vom Lieferziel
  keks = ""; await ruf("/api/anmelden","POST",{name:"Ahmed",pin:"1234"});
  let uo = (await ruf("/api/dispo/uebersicht")).daten;
  const f3 = uo.fahrer[0];
  const heute3 = new Date().toLocaleDateString("sv-SE");
  r = await ruf("/api/dispo/auftrag","POST",{
    datum:heute3, status:"freigegeben", fahrerId:f3.id,
    abholFirma:"Hansa Terminal Bremen", abholOrt:"Bremen",
    abholAdresse:"Am Speicher 12, 28197 Bremen", abholTor:"2", abholAb:"08:30",
    kunde:"Moeller Baustoffe GmbH", zielOrt:"Walsrode",
    zielAdresse:"Lange Strasse 4, 29664 Walsrode", zielTor:"3", termin:"11:00",
    container:"MSCU1234567", chassis:"CH-01"});
  const aid = r.daten.id;
  pruefe("Abholfirma, Abholadresse und Tor werden gespeichert",
    r.daten.abholFirma === "Hansa Terminal Bremen" && r.daten.abholTor === "2" &&
    r.daten.zielTor === "3", r.daten.abholAdresse);

  // 21 Aenderung wird im Klartext gemerkt und kann bestaetigt werden
  r = await ruf("/api/dispo/auftrag","POST",{ id:aid, zielTor:"5", termin:"11:30" });
  pruefe("Aenderung wird gemerkt",
    r.daten.aenderung && r.daten.aenderung.punkte.length === 2,
    JSON.stringify((r.daten.aenderung||{}).punkte));
  pruefe("Aenderung gilt zuerst als unbestaetigt", !r.daten.aenderungGesehen);

  keks = ""; await ruf("/api/anmelden","POST",{name:f3.name,pin:"1111"});
  let mein = (await ruf("/api/fahrer/tag")).daten;
  let ma = mein.heute.find(x => x.id === aid);
  pruefe("Fahrer sieht Abholort getrennt vom Ziel",
    ma.abholFirma === "Hansa Terminal Bremen" && ma.zielOrt === "Walsrode");
  pruefe("Fahrer sieht die Aenderung", ma.aenderung && ma.aenderung.punkte.length === 2);
  pruefe("Bueronummer kommt mit den Einstellungen mit", mein.einst.bueroTelefon !== undefined);

  r = await ruf("/api/fahrer/gesehen","POST",{ auftragId:aid });
  pruefe("Fahrer kann die Aenderung bestaetigen", r.status === 200);
  ma = (await ruf("/api/fahrer/tag")).daten.heute.find(x => x.id === aid);
  pruefe("Bestaetigung ist gespeichert", !!ma.aenderungGesehen);

  // 22 Problem melden
  r = await ruf("/api/fahrer/meldung","POST",{ art:"quatsch" });
  pruefe("Unbekannte Meldeart wird abgelehnt", r.status === 400);
  r = await ruf("/api/fahrer/meldung","POST",{ art:"stau", auftragId:aid });
  pruefe("Stau kann gemeldet werden", r.status === 200 && !!r.daten.id);
  const mid = r.daten.id;
  r = await ruf("/api/fahrer/meldungen");
  pruefe("Fahrer sieht seine Meldung als noch nicht gelesen",
    r.daten.meldungen.some(m => m.id === mid && m.gelesen === false));

  keks = ""; await ruf("/api/anmelden","POST",{name:"Ahmed",pin:"1234"});
  uo = (await ruf("/api/dispo/uebersicht")).daten;
  pruefe("Meldung kommt im Buero an", uo.meldungen.some(m => m.id === mid),
    (uo.meldungen.find(m => m.id === mid)||{}).text);
  await ruf("/api/dispo/gelesen","POST",{});
  keks = ""; await ruf("/api/anmelden","POST",{name:f3.name,pin:"1111"});
  r = await ruf("/api/fahrer/meldungen");
  pruefe("Lesebestaetigung erst nach echtem Lesen",
    r.daten.meldungen.some(m => m.id === mid && m.gelesen === true));

  // 23 Doppeltipp erzeugt kein zweites Ereignis und kein zweites Foto
  const vorher = fs.readdirSync(path.join(__dirname,"fotos")).length;
  r = await ruf("/api/fahrer/ereignis","POST",{ auftragId:aid, art:"abholung", foto:TESTFOTO });
  pruefe("Erste Abholung wird gebucht", r.status === 200 && !r.daten.doppelt);
  const zeit1 = (await ruf("/api/fahrer/tag")).daten.heute.find(x => x.id === aid).abholZeit;
  r = await ruf("/api/fahrer/ereignis","POST",{ auftragId:aid, art:"abholung", foto:TESTFOTO });
  pruefe("Zweiter gleicher Tipp wird ignoriert", r.status === 200 && r.daten.doppelt === true);
  const zeit2 = (await ruf("/api/fahrer/tag")).daten.heute.find(x => x.id === aid).abholZeit;
  pruefe("Abholzeit bleibt unveraendert", zeit1 === zeit2);
  pruefe("Kein zweites Foto auf der Platte",
    fs.readdirSync(path.join(__dirname,"fotos")).length === vorher + 1);



  // 25 Containernummer: Pruefziffer und Vergleich
  {
    const C = require("./web/container.js");
    pruefe("Pruefziffer erkennt eine gueltige Nummer", C.pruefe("CSQU3054383").gueltig);
    pruefe("Pruefziffer erkennt einen Zahlendreher", !C.pruefe("CSQU3054384").gueltig);
    pruefe("Leerzeichen stoeren den Vergleich nicht",
      C.vergleiche("MSCU1234566", "mscu 123456 6") === "passt");
    pruefe("Andere Nummer faellt auf",
      C.vergleiche("MSCU1234566", "MSCU2233440") === "abweichung");
    pruefe("Nummer wird lesbar gruppiert", C.lesbar("MSCU1234566") === "MSCU 123456 6",
      C.lesbar("MSCU1234566"));
  }

  // 26 Schwellen: bis 10 Minuten Reserve orange, darueber gruen, Alarm erst ab 20
  keks = ""; await ruf("/api/anmelden","POST",{name:"Ahmed",pin:"1234"});
  let ue2 = (await ruf("/api/dispo/uebersicht")).daten;
  pruefe("Orange bis 10 Minuten Reserve eingestellt", ue2.einst.gruenAb === 10, "gruenAb " + ue2.einst.gruenAb);
  pruefe("Alarmschwelle bleibt 20 Minuten", ue2.einst.verspaetungAb === 20);
  pruefe("Bueronummer ist hinterlegt", ue2.einst.bueroTelefon === "+4942198994620",
    ue2.einst.bueroTelefon);
  pruefe("Planwert Entladung ist zwei Stunden", ue2.einst.entladezeitStandard === 120);

  const f4 = ue2.fahrer[0];
  const heute4 = new Date().toLocaleDateString("sv-SE");
  const morgen4 = new Date(Date.now() + 86400000).toLocaleDateString("sv-SE");
  const spanne = "?von=" + heute4 + "&bis=" + morgen4;
  const jetzt4 = new Date();
  const ZEIT = require("./web/zeit.js");
  // Datum und Uhrzeit gehoeren zusammen: ein Termin in sieben Stunden kann
  // schon morgen liegen.
  const terminFelder = m => {
    const iso = new Date(Date.now() + m*60000).toISOString();
    return { datum: ZEIT.datumVon(iso), termin: ZEIT.uhrzeitVon(iso) };
  };
  const inMin = m => terminFelder(m).termin;

  // Reserve 5 Minuten -> orange, aber KEIN Alarm
  const meldVorher = (await ruf("/api/dispo/uebersicht" + spanne)).daten.meldungen.length;
  r = await ruf("/api/dispo/auftrag","POST",{
    datum:heute4, status:"freigegeben", fahrerId:f4.id, zielOrt:"Orangestadt",
    ...terminFelder(65), fahrzeitMin:60, ruestzeitMin:0, container:"MSCU1234566" });
  const orangeId = r.daten.id;
  let ueO = (await ruf("/api/dispo/uebersicht" + spanne)).daten;
  let ao = ueO.auftraege.find(x => x.id === orangeId);
  pruefe("Fuenf Minuten Reserve sind orange", ao.rechnung.ampel === "gelb",
    "Reserve " + ao.rechnung.puffer);
  pruefe("Orange loest keinen Alarm aus", ueO.meldungen.length === meldVorher,
    ueO.meldungen.length + " statt " + meldVorher);

  // 15 Minuten Verspaetung -> rot, aber immer noch kein Alarm
  r = await ruf("/api/dispo/auftrag","POST",{
    datum:heute4, status:"freigegeben", fahrerId:f4.id, zielOrt:"Knappstadt",
    ...terminFelder(45), fahrzeitMin:60, ruestzeitMin:0 });
  const knappId = r.daten.id;
  let ueK = (await ruf("/api/dispo/uebersicht" + spanne)).daten;
  let ak = ueK.auftraege.find(x => x.id === knappId);
  pruefe("Fuenfzehn Minuten Verspaetung sind rot", ak.rechnung.ampel === "rot",
    "Reserve " + ak.rechnung.puffer);
  pruefe("Unter 20 Minuten Verspaetung kein Alarm",
    !ueK.meldungen.some(m => m.auftragId === knappId),
    JSON.stringify(ueK.meldungen.slice(0,1)));

  // Ohne aktuelle Ortung gibt es keinen Alarm — auch bei grosser Verspaetung.
  // Dafuer ein Fahrer, der noch nie geortet wurde.
  await ruf("/api/dispo/fahrer","POST",{ neu:"Fahrer Ohneortung", pin:"3333" });
  const fOhne = (await ruf("/api/dispo/uebersicht")).daten.fahrer
    .find(x => x.name === "Fahrer Ohneortung");
  r = await ruf("/api/dispo/auftrag","POST",{
    datum:heute4, status:"freigegeben", fahrerId:fOhne.id, zielOrt:"Ohneortung",
    ...terminFelder(30), fahrzeitMin:60, ruestzeitMin:0 });
  const ohneOrtungId = r.daten.id;
  let ueOO = (await ruf("/api/dispo/uebersicht" + spanne)).daten;
  pruefe("Ohne aktuelle Ortung kein Alarm",
    !ueOO.meldungen.some(m => m.auftragId === ohneOrtungId),
    (ueOO.meldungen[0]||{}).text);

  // Jetzt eine frische Ortung melden, danach ist der Alarm zulaessig
  keks = ""; await ruf("/api/anmelden","POST",{name:f4.name,pin:"1111"});
  await ruf("/api/position","POST",{ lat:53.07, lon:8.80 });
  keks = ""; await ruf("/api/anmelden","POST",{name:"Ahmed",pin:"1234"});

  // 30 Minuten Verspaetung -> Alarm, aber nur einmal
  r = await ruf("/api/dispo/auftrag","POST",{
    datum:heute4, status:"freigegeben", fahrerId:f4.id, zielOrt:"Spaetstadt",
    ...terminFelder(30), fahrzeitMin:60, ruestzeitMin:0 });
  const spaetId = r.daten.id;
  let ueS = (await ruf("/api/dispo/uebersicht" + spanne)).daten;
  const alarme = ueS.meldungen.filter(m => m.auftragId === spaetId);
  pruefe("Ab 20 Minuten Verspaetung kommt ein Alarm", alarme.length === 1,
    (alarme[0]||{}).text);
  ueS = (await ruf("/api/dispo/uebersicht" + spanne)).daten;   // zweite Runde
  pruefe("Der Alarm kommt nur einmal",
    ueS.meldungen.filter(m => m.auftragId === spaetId).length === 1);

  // 27 Entladung: Schritte, Verlaengerung und Kettenrechnung
  //    Eigener Fahrer, damit die Kette eindeutig ist.
  await ruf("/api/dispo/fahrer","POST",{ neu:"Fahrer Kette", pin:"2222" });
  const kf = (await ruf("/api/dispo/uebersicht")).daten.fahrer.find(x => x.name === "Fahrer Kette");
  pruefe("Zweiter Fahrerzugang angelegt", !!kf);
  r = await ruf("/api/dispo/auftrag","POST",{
    datum:heute4, status:"freigegeben", fahrerId:kf.id, zielOrt:"Kettenstadt",
    termin:"23:30", container:"MSCU1234566", abholOrt:"Bremen", fahrzeitMin:60 });
  const kettenId = r.daten.id;
  await ruf("/api/dispo/auftrag","POST",{
    datum:heute4, status:"freigegeben", fahrerId:kf.id, zielOrt:"Danachstadt",
    termin:"23:50", container:"TGHU7654320", abholOrt:"Bremen", fahrzeitMin:60 });

  keks = ""; await ruf("/api/anmelden","POST",{name:"Fahrer Kette",pin:"2222"});
  const orangeId2 = kettenId;
  await ruf("/api/fahrer/ereignis","POST",{auftragId:orangeId2,art:"abholung",foto:TESTFOTO,
    containerBestaetigt:"MSCU1234566"});
  r = await ruf("/api/fahrer/ereignis","POST",{auftragId:orangeId2,art:"ankunft"});
  pruefe("Ankunft beim Kunden wird gebucht", r.status === 200);
  r = await ruf("/api/fahrer/ereignis","POST",{auftragId:orangeId2,art:"warten"});
  pruefe("Warten auf Entladung ist ein eigener Schritt",
    r.status === 200 && (await ruf("/api/fahrer/tag")).daten.heute
      .find(x => x.id === orangeId2).status === "warten");
  r = await ruf("/api/fahrer/ereignis","POST",{auftragId:orangeId2,art:"entladenStart"});
  pruefe("Entladung startet die geplante Zeit", r.status === 200);
  let tagD = (await ruf("/api/fahrer/tag")).daten;
  let ad = tagD.heute.find(x => x.id === orangeId2);
  const planEnde = Math.round((new Date(ad.rechnung.entladeEndePlan) - Date.now())/60000);
  pruefe("Geplantes Ende liegt zwei Stunden spaeter", planEnde >= 118 && planEnde <= 120,
    planEnde + " Minuten");
  pruefe("Der naechste Termin haengt an der Entladung",
    ad.rechnung.naechster && ad.rechnung.naechster.restMin > 120,
    ad.rechnung.naechster && JSON.stringify(ad.rechnung.naechster.teile));

  r = await ruf("/api/fahrer/ereignis","POST",{auftragId:orangeId2,art:"entladenLaenger",minuten:30});
  ad = (await ruf("/api/fahrer/tag")).daten.heute.find(x => x.id === orangeId2);
  const neuEnde = Math.round((new Date(ad.rechnung.entladeEndePlan) - Date.now())/60000);
  pruefe("„Noch 30 Minuten“ zaehlt ab dem Tippen", neuEnde >= 29 && neuEnde <= 30,
    neuEnde + " Minuten");

  r = await ruf("/api/fahrer/ereignis","POST",{auftragId:orangeId2,art:"entladenLaenger",minuten:null});
  ad = (await ruf("/api/fahrer/tag")).daten.heute.find(x => x.id === orangeId2);
  pruefe("„Weiß ich nicht“ erfindet keine Ankunft",
    ad.rechnung.entladeUnbekannt === true && !ad.rechnung.entladeEndePlan &&
    ad.rechnung.naechster && ad.rechnung.naechster.unsicher === true);

  r = await ruf("/api/fahrer/ereignis","POST",{auftragId:orangeId2,art:"entladenFertig"});
  ad = (await ruf("/api/fahrer/tag")).daten.heute.find(x => x.id === orangeId2);
  pruefe("Entladeende ist nicht die Ablieferung",
    ad.status === "entladen_fertig" && !ad.abgabeZeit);
  r = await ruf("/api/fahrer/ereignis","POST",{auftragId:orangeId2,art:"abgabe",foto:TESTFOTO});
  ad = (await ruf("/api/fahrer/tag")).daten.heute.find(x => x.id === orangeId2);
  pruefe("Erst das Ablieferfoto schliesst den Auftrag ab",
    ad.status === "fertig" && !!ad.abgabeZeit && !!ad.fotoAbgabe);

  // 28 Containerabweichung: getrennt gespeichert, hervorgehobene Meldung
  keks = ""; await ruf("/api/anmelden","POST",{name:"Ahmed",pin:"1234"});
  r = await ruf("/api/dispo/auftrag","POST",{
    datum:heute4, status:"freigegeben", fahrerId:f4.id, zielOrt:"Pruefstadt",
    ...terminFelder(300), container:"MSCU1234566" });
  const abwId = r.daten.id;
  keks = ""; await ruf("/api/anmelden","POST",{name:f4.name,pin:"1111"});
  r = await ruf("/api/fahrer/ereignis","POST",{auftragId:abwId, art:"abholung", foto:TESTFOTO,
    containerErkannt:"MSCU2233440", containerBestaetigt:"MSCU2233440"});
  pruefe("Abholung mit anderer Nummer wird angenommen", r.status === 200);
  let aa = (await ruf("/api/fahrer/tag")).daten.heute.find(x => x.id === abwId);
  pruefe("Auftragsnummer bleibt unveraendert", aa.container === "MSCU1234566", aa.container);
  pruefe("Erwartete und bestaetigte Nummer stehen getrennt",
    aa.containerErwartet === "MSCU1234566" && aa.containerBestaetigt === "MSCU2233440");
  pruefe("Auftrag ist als Abweichung markiert", !!aa.abweichung && aa.abweichung.geprueft === false);
  keks = ""; await ruf("/api/anmelden","POST",{name:"Ahmed",pin:"1234"});
  const meldA = (await ruf("/api/dispo/uebersicht")).daten.meldungen
    .find(m => m.auftragId === abwId && m.abweichung);
  pruefe("Buero bekommt eine hervorgehobene Meldung mit beiden Nummern",
    !!meldA && meldA.erwartet === "MSCU1234566" && meldA.bestaetigt === "MSCU2233440" && !!meldA.foto,
    meldA && meldA.text);

  // 29 Passende Nummer erzeugt keine Warnmeldung
  r = await ruf("/api/dispo/auftrag","POST",{
    datum:heute4, status:"freigegeben", fahrerId:f4.id, zielOrt:"Pasststadt",
    ...terminFelder(300), container:"TGHU7654320" });
  const okId = r.daten.id;
  const vorMeld = (await ruf("/api/dispo/uebersicht")).daten.meldungen.length;
  keks = ""; await ruf("/api/anmelden","POST",{name:f4.name,pin:"1111"});
  await ruf("/api/fahrer/ereignis","POST",{auftragId:okId, art:"abholung", foto:TESTFOTO,
    containerErkannt:"TGHU7654320", containerBestaetigt:"TGHU7654320"});
  keks = ""; await ruf("/api/anmelden","POST",{name:"Ahmed",pin:"1234"});
  const nachMeld = (await ruf("/api/dispo/uebersicht")).daten.meldungen.length;
  pruefe("Passende Nummer meldet nichts in die Meldungsliste", nachMeld === vorMeld,
    vorMeld + " → " + nachMeld);
  const ao2 = (await ruf("/api/dispo/uebersicht")).daten.auftraege.find(x => x.id === okId);
  pruefe("Passende Abholung wird trotzdem festgehalten",
    ao2.containerBestaetigt === "TGHU7654320" && !ao2.abweichung);


  // 30 Zeitregeln: Farbgrenzen, Alarmschwelle, Kette, Mitternacht, Datenalter
  {
    const Zt = require("./web/zeit.js");
    pruefe("11 Minuten Reserve sind gruen", Zt.status(11) === "gruen");
    pruefe("10 Minuten Reserve sind orange", Zt.status(10) === "gelb");
    pruefe("0 Minuten Reserve sind orange", Zt.status(0) === "gelb");
    pruefe("Minus 1 Minute ist rot", Zt.status(-1) === "rot");
    pruefe("Ohne Prognose grau", Zt.status(null) === "grau");

    pruefe("19 Minuten Verspaetung loesen keinen Alarm aus", Zt.alarmNoetig(-19) === false);
    pruefe("20 Minuten Verspaetung loesen einen Alarm aus", Zt.alarmNoetig(-20) === true);
    pruefe("Orange loest keinen Alarm aus", Zt.alarmNoetig(5) === false);

    const teile = [{was:"nacharbeit",min:15},{was:"fahrtAbholung",min:60},
                   {was:"laden",min:30},{was:"fahrtKunde",min:60}];
    pruefe("Kette addiert nur die noetigen Schritte", Zt.kette(teile).min === 165);
    pruefe("Ohne Abholung faellt der Umweg weg",
      Zt.kette([{was:"nacharbeit",min:15},{was:"fahrtKunde",min:60}]).min === 75);

    // Verlaengerung ab der aktuellen Uhrzeit
    const jetztT = new Date();
    const ende30 = Zt.ankunft(jetztT.toISOString(), [{was:"rest",min:30}]);
    pruefe("„Noch 30 Minuten“ zaehlt ab jetzt",
      Math.round((new Date(ende30) - jetztT)/60000) === 30);

    // Ueber Mitternacht
    const spaet = new Date(); spaet.setHours(23,50,0,0);
    const nachts = Zt.ankunft(spaet.toISOString(), teile);
    pruefe("Rechnung laeuft ueber Mitternacht",
      new Date(nachts).getDate() !== spaet.getDate() &&
      Math.round((new Date(nachts) - spaet)/60000) === 165,
      new Date(nachts).toLocaleString("de-DE"));

    // Datenalter zaehlt unabhaengig vom Internet
    const alt = new Date(Date.now() - 65*60000).toISOString();
    const frisch = new Date(Date.now() - 2*60000).toISOString();
    pruefe("Alte Daten gelten als veraltet", Zt.veraltet(alt, 10) === true);
    pruefe("Frische Daten gelten nicht als veraltet", Zt.veraltet(frisch, 10) === false);
    pruefe("Fehlende Daten gelten als veraltet", Zt.veraltet(null, 10) === true);
  }

  // 31 Ungeprueft uebernommene Nummer: markiert und gemeldet
  keks = ""; await ruf("/api/anmelden","POST",{name:"Ahmed",pin:"1234"});
  const heute5 = new Date().toLocaleDateString("sv-SE");
  const jetzt5 = new Date();
  const terminFelder5 = m => {
    const iso = new Date(Date.now() + m*60000).toISOString();
    const Z5 = require("./web/zeit.js");
    return { datum: Z5.datumVon(iso), termin: Z5.uhrzeitVon(iso) };
  };
  const f5 = (await ruf("/api/dispo/uebersicht")).daten.fahrer[0];
  r = await ruf("/api/dispo/auftrag","POST",{
    datum:heute5, status:"freigegeben", fahrerId:f5.id, zielOrt:"Ungeprueftstadt",
    ...terminFelder5(300), container:"MSCU1234566" });
  const ugId = r.daten.id;
  keks = ""; await ruf("/api/anmelden","POST",{name:f5.name,pin:"1111"});
  r = await ruf("/api/fahrer/ereignis","POST",{ auftragId:ugId, art:"abholung", foto:TESTFOTO,
    containerErkannt:"MSCU1234567", containerBestaetigt:"MSCU1234567", containerUngeprueft:true });
  pruefe("Ungepruefte Nummer wird angenommen", r.status === 200);
  let ug = (await ruf("/api/fahrer/tag")).daten.heute.find(x => x.id === ugId);
  pruefe("Ungepruefte Nummer bleibt markiert", !!ug.containerUngeprueft &&
    ug.containerUngeprueft.geprueft === false);
  pruefe("Auftragsnummer bleibt auch hier unveraendert", ug.container === "MSCU1234566");
  keks = ""; await ruf("/api/anmelden","POST",{name:"Ahmed",pin:"1234"});
  const ugMeld = (await ruf("/api/dispo/uebersicht")).daten.meldungen
    .find(m => m.auftragId === ugId && m.ungeprueft);
  pruefe("Buero bekommt eine Meldung zur ungeprueften Nummer", !!ugMeld,
    ugMeld && ugMeld.text);

  // 32 Wiederholtes Senden erzeugt keine zweite Abholung
  const fotosVorher = fs.readdirSync(path.join(__dirname,"fotos")).length;
  keks = ""; await ruf("/api/anmelden","POST",{name:f5.name,pin:"1111"});
  const zeitVorher = (await ruf("/api/fahrer/tag")).daten.heute.find(x => x.id === ugId).abholZeit;
  r = await ruf("/api/fahrer/ereignis","POST",{ auftragId:ugId, art:"abholung", foto:TESTFOTO,
    containerBestaetigt:"MSCU1234567", containerUngeprueft:true });
  pruefe("Zweiter Versand wird als Wiederholung erkannt", r.daten.doppelt === true);
  const zeitNachher = (await ruf("/api/fahrer/tag")).daten.heute.find(x => x.id === ugId).abholZeit;
  pruefe("Abholzeit bleibt die erste", zeitVorher === zeitNachher);
  pruefe("Kein zweites Foto beim Wiederholen",
    fs.readdirSync(path.join(__dirname,"fotos")).length === fotosVorher);

  // 33 Datenalter wird mitgeliefert
  pruefe("Grenze fuer veraltete Daten ist eingestellt",
    (await ruf("/api/fahrer/tag")).daten.einst.maxDatenAlterMin === 10);


  // 34 Datum und Uhrzeit gehoeren zusammen (Europe/Berlin)
  {
    const Zt = require("./web/zeit.js");
    pruefe("Termin mit Datum wird zum Zeitpunkt",
      Zt.uhrzeitVon(Zt.zeitpunkt("2026-09-13","14:30")) === "14:30");
    pruefe("Termin morgen bleibt morgen",
      Zt.datumVon(Zt.zeitpunkt("2026-09-14","00:30")) === "2026-09-14");
    pruefe("Sommerzeit: 14:30 Berlin ist 12:30 UTC",
      Zt.zeitpunkt("2026-07-01","14:30") === "2026-07-01T12:30:00.000Z");
    pruefe("Winterzeit: 14:30 Berlin ist 13:30 UTC",
      Zt.zeitpunkt("2026-01-15","14:30") === "2026-01-15T13:30:00.000Z");
    pruefe("Ohne Datum keine Bewertung", Zt.zeitpunkt(null,"14:30") === null);
    pruefe("Unsinniges Datum wird abgelehnt", Zt.zeitpunkt("morgen","14:30") === null);
    pruefe("Unsinnige Uhrzeit wird abgelehnt", Zt.zeitpunkt("2026-09-13","99:99") === null);

    // Tour ueber Mitternacht: Abfahrt 23:50, Termin am naechsten Tag 00:30
    const start = Zt.zeitpunkt("2026-09-13","23:50");
    const ank   = Zt.ankunft(start, [{was:"fahrt",min:55}]);
    pruefe("Ankunft nach Mitternacht faellt auf den naechsten Tag",
      Zt.datumVon(ank) === "2026-09-14" && Zt.uhrzeitVon(ank) === "00:45", Zt.uhrzeitVon(ank));
    pruefe("Reserve ueber Mitternacht wird richtig gerechnet",
      Zt.reserve(Zt.zeitpunkt("2026-09-14","00:30"), ank) === -15);
    pruefe("Termin morgen frueh gegen Ankunft heute Nacht",
      Zt.reserve(Zt.zeitpunkt("2026-09-14","07:30"), ank) === 405);

    // Alarm nur aus frischen Daten
    const frisch = new Date(Date.now() - 60000).toISOString();
    const alt    = new Date(Date.now() - 65*60000).toISOString();
    pruefe("Frische Daten erlauben einen Alarm", Zt.alarmErlaubt(frisch, frisch, 10) === true);
    pruefe("Alte Prognose verbietet einen Alarm", Zt.alarmErlaubt(alt, frisch, 10) === false);
    pruefe("Alte Ortung verbietet einen Alarm", Zt.alarmErlaubt(frisch, alt, 10) === false);
    pruefe("Fehlende Ortung verbietet einen Alarm", Zt.alarmErlaubt(frisch, null, 10) === false);
    pruefe("Unlesbare Ortung verbietet einen Alarm", Zt.alarmErlaubt(frisch, "morgen", 10) === false);
    pruefe("Der Grund wird benannt",
      Zt.datenZuverlaessig(frisch, null, 10).grund === "ortung_fehlt");
  }

  // 35 Nachgereichte Abholung behaelt die Uhrzeit des Fahrers
  keks = ""; await ruf("/api/anmelden","POST",{name:"Ahmed",pin:"1234"});
  const heute6 = new Date().toLocaleDateString("sv-SE");
  const f6 = (await ruf("/api/dispo/uebersicht")).daten.fahrer[0];
  r = await ruf("/api/dispo/auftrag","POST",{
    datum:heute6, status:"freigegeben", fahrerId:f6.id, zielOrt:"Nachtragstadt",
    termin:"23:30", container:"MSCU1234566" });
  const nachId = r.daten.id;
  const erfasst = new Date(Date.now() - 40*60000).toISOString();
  keks = ""; await ruf("/api/anmelden","POST",{name:f6.name,pin:"1111"});
  r = await ruf("/api/fahrer/ereignis","POST",{ auftragId:nachId, art:"abholung",
    foto:TESTFOTO, zeit:erfasst, containerBestaetigt:"MSCU1234566" });
  pruefe("Nachgereichte Abholung wird angenommen", r.status === 200);
  let nga = (await ruf("/api/fahrer/tag")).daten.heute.find(x => x.id === nachId);
  pruefe("Die Abholzeit ist die Zeit des Fahrers", nga.abholZeit === erfasst, nga.abholZeit);
  pruefe("Der Eingang wird getrennt festgehalten",
    !!nga.nachgereicht && nga.nachgereicht.eingang > nga.nachgereicht.erfasst);
  r = await ruf("/api/fahrer/ereignis","POST",{ auftragId:nachId, art:"abholung",
    foto:TESTFOTO, zeit:erfasst, containerBestaetigt:"MSCU1234566" });
  pruefe("Zweiter Versuch mit demselben Vorgang bucht nicht erneut", r.daten.doppelt === true);
  nga = (await ruf("/api/fahrer/tag")).daten.heute.find(x => x.id === nachId);
  pruefe("Die Abholzeit bleibt dieselbe", nga.abholZeit === erfasst);
  r = await ruf("/api/fahrer/ereignis","POST",{ auftragId:nachId, art:"ankunft",
    zeit:new Date(Date.now() + 3*3600000).toISOString() });
  nga = (await ruf("/api/fahrer/tag")).daten.heute.find(x => x.id === nachId);
  pruefe("Zeiten aus der Zukunft werden nicht uebernommen",
    new Date(nga.ankunftZeit).getTime() <= Date.now() + 60000, nga.ankunftZeit);


  // 36 Ablieferung nachgereicht: Zeit bleibt, keine zweite Buchung
  keks = ""; await ruf("/api/anmelden","POST",{name:"Ahmed",pin:"1234"});
  const f7 = (await ruf("/api/dispo/uebersicht")).daten.fahrer[0];
  r = await ruf("/api/dispo/auftrag","POST",{
    datum:new Date().toLocaleDateString("sv-SE"), status:"freigegeben", fahrerId:f7.id,
    zielOrt:"Abgabestadt", termin:"23:40", container:"MSCU1234566" });
  const abId = r.daten.id;
  keks = ""; await ruf("/api/anmelden","POST",{name:f7.name,pin:"1111"});
  const abholZeit7 = new Date(Date.now() - 90*60000).toISOString();
  const abgabeZeit7 = new Date(Date.now() - 20*60000).toISOString();
  await ruf("/api/fahrer/ereignis","POST",{ auftragId:abId, art:"abholung", foto:TESTFOTO,
    zeit:abholZeit7, containerBestaetigt:"MSCU1234566" });
  r = await ruf("/api/fahrer/ereignis","POST",{ auftragId:abId, art:"abgabe", foto:TESTFOTO,
    zeit:abgabeZeit7 });
  pruefe("Nachgereichte Ablieferung wird angenommen", r.status === 200);
  let ab = (await ruf("/api/fahrer/tag")).daten.heute.find(x => x.id === abId);
  pruefe("Die Abgabezeit ist die Zeit des Fahrers", ab.abgabeZeit === abgabeZeit7, ab.abgabeZeit);
  pruefe("Der Auftrag ist damit fertig", ab.status === "fertig");
  const fotosVor7 = fs.readdirSync(path.join(__dirname,"fotos")).length;
  r = await ruf("/api/fahrer/ereignis","POST",{ auftragId:abId, art:"abgabe", foto:TESTFOTO,
    zeit:abgabeZeit7 });
  pruefe("Zweite Ablieferung wird als Wiederholung erkannt", r.daten.doppelt === true);
  ab = (await ruf("/api/fahrer/tag")).daten.heute.find(x => x.id === abId);
  pruefe("Abgabezeit bleibt unveraendert", ab.abgabeZeit === abgabeZeit7);
  pruefe("Kein zweites Ablieferfoto",
    fs.readdirSync(path.join(__dirname,"fotos")).length === fotosVor7);

  // 24 Farbkontraste der Fahreransicht (WCAG AA, mindestens 4,5:1)
  {
    const css = fs.readFileSync(path.join(__dirname,"web","einfach.css"), "utf8");
    const wert = name => (css.match(new RegExp("--" + name + ":\\s*(#[0-9A-Fa-f]{6})")) || [])[1];
    const hell = h => { const c = [1,3,5].map(i => parseInt(h.slice(i,i+2),16)/255)
      .map(v => v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4));
      return 0.2126*c[0] + 0.7152*c[1] + 0.0722*c[2]; };
    const abstand = (a,b) => (Math.max(hell(a),hell(b))+0.05) / (Math.min(hell(a),hell(b))+0.05);
    const paare = [
      ["Text auf Weiss", wert("ink"), "#FFFFFF"],
      ["Nebentext auf Weiss", wert("soft"), "#FFFFFF"],
      ["Gruener Status", wert("gruen"), wert("gruen-flaeche")],
      ["Gelber Status", wert("gelb"), wert("gelb-flaeche")],
      ["Roter Status", wert("rot"), wert("rot-flaeche")],
      ["Blauer Kasten", wert("marine"), wert("marine-flaeche")],
      ["Hauptaktion", "#FFFFFF", wert("ink")]
    ];
    for (const [name, v, b] of paare) {
      const r = v && b ? abstand(v,b) : 0;
      pruefe("Kontrast " + name + " mindestens 4,5:1", r >= 4.5, r.toFixed(2) + ":1");
    }
  }

  console.log("\n" + (fehler === 0 ? "Alle Tests bestanden." : fehler + " Test(s) fehlgeschlagen."));
  srv.kill();
  process.exit(fehler === 0 ? 0 : 1);
})().catch(e => { console.error(e); srv.kill(); process.exit(1); });

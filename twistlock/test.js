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
    { name:"gelb",  fahrzeit: bis12 - 9,  erwartet:"gelb"  },
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
    pruefe("Ampel " + f.name,
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

  // 5 Verspätungsmeldung wurde erzeugt
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
    JSON.parse(fs.readFileSync(path.join(__dirname, "daten", "positionen.json"))).length === 1);

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

  console.log("\n" + (fehler === 0 ? "Alle Tests bestanden." : fehler + " Test(s) fehlgeschlagen."));
  srv.kill();
  process.exit(fehler === 0 ? 0 : 1);
})().catch(e => { console.error(e); srv.kill(); process.exit(1); });

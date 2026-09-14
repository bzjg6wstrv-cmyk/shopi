# -*- coding: utf-8 -*-
"""Tests A-F: Verzoegerungsweitergabe, Belegung, Zeitstempel, Entladeende.
Alle Pruefungen rufen die echten Anwendungsfunktionen auf."""
from playwright.sync_api import sync_playwright
URL = "http://localhost:8089/twistlock-dispo-vorschau.html"
ok_all = True
def pr(n, ok, erwartet="", tatsaechlich=""):
    global ok_all; ok_all = ok_all and ok
    z = ("  OK   " if ok else "  FEHL ") + n
    if erwartet != "": z += "\n           erwartet: " + str(erwartet) + " | tatsächlich: " + str(tatsaechlich)
    print(z)

# Baut drei aufeinanderfolgende Auftraege fuer einen eigenen Fahrer.
AUFBAU = """(abstand) => {
  const h=new Date(); h.setHours(10,30,0,0); const t=h.toISOString().slice(0,10);
  D.fahrer = D.fahrer.filter(f=>f.id!=="fT");
  D.fahrer.push({id:"fT", name:"Kettenfahrer", telefon:"", sprache:"Deutsch", aktiv:true});
  D.auftraege = D.auftraege.filter(a=>!String(a.nummer).startsWith("77"));
  const frisch = new Date(h.getTime()-2*60000).toISOString();
  const mk = (nr, abZeit, liZeit) => ({
    id:"t"+nr, nummer:nr, tag:t, freigegeben:true, storniert:false, kunde:"Kette "+nr,
    kundenRef:"", dispoNotiz:"", entwurf:null,
    abhol:{firma:"T", adresse:"Am Speicher 12, 28197 Bremen", datum:t, zeit:abZeit,
           referenz:"", hinweis:""},
    liefer:{firma:"K", adresse:"Lange Str. 4, 29664 Walsrode", datum:t, zeit:liZeit,
            ansprech:"", telefon:"", hinweis:""},
    container:{erwartet:"", bestaetigt:null, groesse:"40 ft", typ:"Standard", siegel:"",
               beladen:"beladen", rueckgabeOrt:"", rueckgabeTermin:null,
               ungeprueft:false, abweichung:false, trotzdem:false},
    planung:{fahrerId:"fT", zugmaschineId:"z1", chassisId:"c1",
             ladenMin:30, wartenAbholMin:0, wartenMin:0, entladenMin:60, pufferMin:15},
    ablauf:{abholung:null,ankunft:null,warten:null,entladenStart:null,entladenEnde:null,abgabe:null},
    entladeVerlaengerung:null, fotos:{abholung:null,abgabe:null}, dokumente:[],
    bestaetigt:null, ortungZeit:frisch, datenZeit:frisch, prognoseZeit:frisch,
    prognose:null, alarmGesendet:false, verlauf:[]
  });
  // A1 entlaedt gerade (Start vor 10 Min., geplant 60 Min.)
  const A1 = mk("7701","06:00","09:00");
  A1.ablauf.abholung = new Date(h.getTime()-4*60*60000).toISOString();
  A1.ablauf.ankunft  = new Date(h.getTime()-70*60000).toISOString();
  A1.ablauf.entladenStart = new Date(h.getTime()-10*60000).toISOString();
  // Kette: Ende 11:20 (+50) -> Restarb 15 -> 11:35 -> Pause 45 -> 12:20 -> Fahrt 75 -> 13:35
  // A2 Abholung planmaessig 13:35+abstand, damit "ohne Puffer" bzw. "mit Puffer" entsteht
  const basis = new Date(h.getTime() + (50+15+45+75)*60000);
  const abhol2 = new Date(basis.getTime() + abstand*60000);
  const p = n => String(n).padStart(2,"0");
  const zz = d => p(d.getHours())+":"+p(d.getMinutes());
  const A2 = mk("7702", zz(abhol2), zz(new Date(abhol2.getTime()+ (30+75)*60000)));
  // A3 direkt nach A2: Ende A2 = abhol2+30+75+60 ; +15 +45 +75
  const basis3 = new Date(abhol2.getTime() + (30+75+60+15+45+75)*60000);
  const abhol3 = new Date(basis3.getTime() + abstand*60000);
  const A3 = mk("7703", zz(abhol3), zz(new Date(abhol3.getTime()+(30+75)*60000)));
  D.auftraege.push(A1,A2,A3);
  ketteRechnen();
  const lese = nr => { const o=D.auftraege.find(x=>x.nummer===nr);
    const r=DISPO.tourErgebnis(o); return {abhol:r.abholAnkunft, kunde:r.kundenAnkunft,
      belBis:r.belegungBis, unklar:r.unklar}; };
  return {vor:{a1:lese("7701"), a2:lese("7702"), a3:lese("7703")}};
}"""

with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
    pg = b.new_context(viewport={"width":1280,"height":900}).new_page()
    errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(URL, wait_until="load"); pg.evaluate("localStorage.clear()")
    pg.reload(wait_until="load"); pg.wait_for_timeout(700)

    def lauf(abstand):
        pg.evaluate(AUFBAU, abstand)
        vor = pg.evaluate("""() => { const lese = nr => { const o=D.auftraege.find(x=>x.nummer===nr);
            const r=DISPO.tourErgebnis(o); return {abhol:r.abholAnkunft, kunde:r.kundenAnkunft,
              belBis:r.belegungBis}; };
          return {a1:lese("7701"), a2:lese("7702"), a3:lese("7703")}; }""")
        nach = pg.evaluate("""() => {
          const A1=D.auftraege.find(x=>x.nummer==="7701");
          A1.entladeVerlaengerung={min:60, ab:jetztIso(), unbekannt:false};
          A1.prognoseZeit=jetztIso();
          ketteRechnen();
          const lese = nr => { const o=D.auftraege.find(x=>x.nummer===nr);
            const r=DISPO.tourErgebnis(o); return {abhol:r.abholAnkunft, kunde:r.kundenAnkunft,
              belBis:r.belegungBis}; };
          return {a1:lese("7701"), a2:lese("7702"), a3:lese("7703")}; }""")
        d = lambda x,y: None if (not x or not y) else round((__import__("datetime").datetime.fromisoformat(y.replace("Z","+00:00")) - __import__("datetime").datetime.fromisoformat(x.replace("Z","+00:00"))).total_seconds()/60)
        return vor, nach, d

    print("\\nA) Drei Auftraege OHNE freie Zwischenzeit: Verzoegerung geht ungeschmaelert durch")
    # Minutenrechnung: A1 entlaedt seit 10 Min., geplant 60 -> Rest 50, Ende jetzt+50.
    # "Dauert laenger +60" erzeugt laut Vorgabe ein Ende AB DEM EINGABEZEITPUNKT,
    # also jetzt+60. Die Verzoegerung betraegt damit 60-50 = 10 Minuten.
    # Ohne freie Zwischenzeit muessen Auftrag 2 und 3 um genau diese 10 Min. rutschen.
    vor, nach, d = lauf(0)
    verzug = d(vor["a1"]["belBis"], nach["a1"]["belBis"])
    v2 = d(vor["a2"]["kunde"], nach["a2"]["kunde"])
    v3 = d(vor["a3"]["kunde"], nach["a3"]["kunde"])
    pr("Verzoegerung bei Auftrag 1 betraegt 10 Min. (60 ab jetzt minus 50 Rest)",
       verzug == 10, "10", verzug)
    pr("Auftrag 2 rutscht um dieselben 10 Min.", v2 == verzug, verzug, v2)
    pr("Auftrag 3 rutscht um dieselben 10 Min.", v3 == verzug, verzug, v3)
    pr("Verzoegerung wird ungeschmaelert weitergegeben", v2 == v3 == verzug,
       f"{verzug}/{verzug}", f"{v2}/{v3}")

    print("\\nB) Mit freier Zwischenzeit: Verzoegerung wird aufgefangen")
    # Puffer 25 Min. > Verzoegerung 10 Min. -> vollstaendig aufgefangen, Verschiebung 0.
    vor, nach, d = lauf(25)
    v2 = d(vor["a2"]["kunde"], nach["a2"]["kunde"])
    v3 = d(vor["a3"]["kunde"], nach["a3"]["kunde"])
    pr("25 Min. Puffer fangen 10 Min. Verzoegerung ganz auf", v2 == 0, "0", v2)
    pr("Auftrag 3 bleibt ebenfalls unveraendert", v3 == 0, "0", v3)
    # Puffer 4 Min. < Verzoegerung 10 Min. -> 10-4 = 6 Min. bleiben uebrig.
    vor4, nach4, d4 = lauf(4)
    v2b = d4(vor4["a2"]["kunde"], nach4["a2"]["kunde"])
    v3b = d4(vor4["a3"]["kunde"], nach4["a3"]["kunde"])
    pr("4 Min. Puffer fangen nur teilweise auf: 10 minus 4 = 6 Min.", v2b == 6, "6", v2b)
    # Jede Luecke faengt EINZELN auf: A3 hat wieder 4 Min. Puffer,
    # also bleiben von den 6 Min. noch 6-4 = 2 Min. uebrig.
    pr("Auftrag 3: eigene 4 Min. Luecke faengt weiter auf, 6 minus 4 = 2 Min.",
       v3b == 2, "2", v3b)

    print("\\nC) Verlaengerung aendert Belegung und Konfliktanzeige")
    pg.evaluate(AUFBAU, 0)
    c = pg.evaluate("""() => {
      const A1=D.auftraege.find(x=>x.nummer==="7701"), A2=D.auftraege.find(x=>x.nummer==="7702");
      const belVor = DISPO.belegung(A1).bis;
      A1.entladeVerlaengerung={min:60, ab:jetztIso(), unbekannt:false};
      A1.prognoseZeit=jetztIso(); ketteRechnen();
      const r=DISPO.tourErgebnis(A2), f=DISPO.folgePrognose(A1,A2);
      return {belVor, belNach:DISPO.belegung(A1).bis,
              folgeIso:f.iso, bezug:f.bezug,
              ketteAbhol:r.abholAnkunft, ketteKunde:r.kundenAnkunft,
              tagesplan:DISPO.prognose(A2).iso}; }""")
    import datetime as _dt
    mz = lambda x,y: round((_dt.datetime.fromisoformat(y.replace("Z","+00:00"))
                          - _dt.datetime.fromisoformat(x.replace("Z","+00:00"))).total_seconds()/60)
    schub = mz(c["belVor"], c["belNach"])
    pr("Belegungsende verschiebt sich um dieselben 10 Min.", schub == 10, "10", schub)
    # Der massgebliche Termin von A2 ist die ABHOLUNG (noch nicht abgeholt).
    # Tagesplan, Detail und Kette muessen daher dieselbe Abholankunft zeigen —
    # die Kundenankunft wird getrennt gefuehrt und ist bewusst eine andere Zahl.
    pr("Tagesplan, Folgeprognose und Tourkette zeigen dieselbe Abholankunft",
       c["folgeIso"] == c["ketteAbhol"] == c["tagesplan"], c["ketteAbhol"],
       f'{c["folgeIso"]} / {c["tagesplan"]}')
    pr("Kundenankunft wird getrennt gefuehrt", c["ketteKunde"] != c["ketteAbhol"],
       "andere Zahl als die Abholankunft", c["ketteKunde"])

    print("\nD) Unbekanntes bzw. abgelaufenes Entladeende ohne Fertigmeldung")
    d1 = pg.evaluate("""() => {
      const A1=D.auftraege.find(x=>x.nummer==="7701"), A2=D.auftraege.find(x=>x.nummer==="7702");
      A1.entladeVerlaengerung={min:null, ab:jetztIso(), unbekannt:true};
      ketteRechnen();
      return {rest:DISPO.entladeRest(A1), bel:DISPO.belegung(A1),
              lage:DISPO.konfliktLage(A1),
              a2:DISPO.tourErgebnis(A2), status:DISPO.zeitstatus(A2).klasse}; }""")
    pr("„Weiß ich noch nicht“: Restzeit unklar", d1["rest"]["unklar"] is True, "unklar", d1["rest"])
    pr("Belegung offen statt altem Ende", d1["bel"]["offen"] is True and d1["bel"]["bis"] is None,
       "offen, kein Ende", f"offen={d1['bel']['offen']}, bis={d1['bel']['bis']}")
    pr("Meldung 'nicht sicher planbar'", "nicht sicher planbar" in (d1["lage"].get("text") or ""),
       "Belegung offen – nächste Tour derzeit nicht sicher planbar.", d1["lage"].get("text"))
    pr("Folgeauftrag ohne genaue Ankunft", d1["a2"]["kundenAnkunft"] is None and d1["a2"]["unklar"] is True,
       "keine Ankunft", d1["a2"]["kundenAnkunft"])
    pr("Folgeauftrag grau", d1["status"] == "m-grau", "m-grau", d1["status"])

    d2 = pg.evaluate("""() => {
      const A1=D.auftraege.find(x=>x.nummer==="7701"), A2=D.auftraege.find(x=>x.nummer==="7702");
      // Timer abgelaufen: Start vor 200 Min., geplant 60 Min., keine Fertigmeldung
      A1.entladeVerlaengerung=null;
      A1.ablauf.entladenStart=new Date(jetzt().getTime()-200*60000).toISOString();
      ketteRechnen();
      return {rest:DISPO.entladeRest(A1), abgabe:A1.ablauf.abgabe,
              bel:DISPO.belegung(A1), a2:DISPO.tourErgebnis(A2)}; }""")
    pr("abgelaufener Timer: nicht 0 Minuten, sondern unklar",
       d2["rest"]["unklar"] is True and d2["rest"]["min"] is None,
       "unklar, min=None", d2["rest"])
    pr("Grund nennt die abgelaufene Planzeit",
       "abgelaufen" in (d2["rest"]["grund"] or ""), "…abgelaufen…", d2["rest"]["grund"])
    pr("Auftrag wird NICHT automatisch abgeschlossen", d2["abgabe"] is None, "None", d2["abgabe"])
    pr("keine sofortige Abfahrt: Belegung offen", d2["bel"]["offen"] is True, "True", d2["bel"]["offen"])
    pr("abhaengige Folgeankunft unklar", d2["a2"]["unklar"] is True, "True", d2["a2"]["unklar"])

    print("\nE) Zeitstempel: fehlend, ungueltig, veraltet, unplausibel zukuenftig")
    faelle = pg.evaluate("""() => {
      const A=D.auftraege.find(x=>x.nummer==="7702");
      const setz = (o,p) => { A.ortungZeit=o; A.prognoseZeit=p; A.datenZeit=p;
        A.alarmGesendet=false; ketteRechnen();
        const vor=D.meldungen.filter(m=>m.art==="verspaetung"&&m.auftragId===A.id).length;
        alarmePruefen();
        const nach=D.meldungen.filter(m=>m.art==="verspaetung"&&m.auftragId===A.id).length;
        const s=DISPO.zeitstatus(A);
        return {klasse:s.klasse, grund:s.zusatz||s.satz, neuerAlarm:nach>vor}; };
      const frisch = new Date(jetzt().getTime()-2*60000).toISOString();
      return {
        fehlt:   setz(null, frisch),
        unlesbar:setz("morgen frueh", frisch),
        nanText: setz("2026-13-45T99:99:99Z", frisch),
        veraltet:setz(new Date(jetzt().getTime()-45*60000).toISOString(), frisch),
        zukunft: setz(new Date(jetzt().getTime()+30*60000).toISOString(), frisch),
        tolerant:setz(new Date(jetzt().getTime()+60*1000).toISOString(), frisch)
      }; }""")
    for name, erw in [("fehlt","Kein Ortungszeitpunkt vorhanden"),("unlesbar","unlesbar"),
                      ("nanText","unlesbar"),("veraltet","älter"),("zukunft","Zukunft")]:
        f = faelle[name]
        pr(f"{name}: grau, Grund genannt, kein neuer Alarm",
           f["klasse"]=="m-grau" and erw.split()[0].lower() in (f["grund"] or "").lower()
           and f["neuerAlarm"] is False,
           "m-grau / "+erw+" / kein Alarm",
           f'{f["klasse"]} / {f["grund"]} / Alarm={f["neuerAlarm"]}')
    pr("1 Min. Uhrvorlauf wird toleriert (Toleranz 2 Min.)",
       faelle["tolerant"]["klasse"] != "m-grau" or "Zukunft" not in (faelle["tolerant"]["grund"] or ""),
       "nicht wegen Zukunft verworfen", faelle["tolerant"])

    print("\nF) Farbregeln und Alarmschwelle bei verlaesslichen Daten")
    f = pg.evaluate("""() => {
      const A=D.auftraege.find(x=>x.nummer==="7702");
      const frisch=()=>new Date(jetzt().getTime()-2*60000).toISOString();
      const setz = (res) => {
        A.ortungZeit=frisch(); A.prognoseZeit=frisch(); A.datenZeit=frisch();
        A.ablauf.abholung=new Date(jetzt().getTime()-60*60000).toISOString();
        A.ablauf.ankunft=null;
        const termin=new Date(jetzt().getTime()+60*60000); termin.setSeconds(0,0);
        A.liefer.datum=termin.toISOString().slice(0,10);
        A.liefer.zeit=String(termin.getHours()).padStart(2,"0")+":"+String(termin.getMinutes()).padStart(2,"0");
        A.prognose=new Date(termin.getTime()-res*60000).toISOString();
        A.alarmGesendet=false;
        D.meldungen=D.meldungen.filter(m=>m.auftragId!==A.id);
        ketteRechnen(); alarmePruefen();
        const s=DISPO.zeitstatus(A);
        return {klasse:s.klasse, res:s.res,
                alarme:D.meldungen.filter(m=>m.art==="verspaetung"&&m.auftragId===A.id).length}; };
      const raus={gruen:setz(15), orange:setz(5), orange0:setz(0), rot:setz(-5),
                  neunzehn:setz(-19), zwanzig:setz(-20)};
      ketteRechnen(); alarmePruefen(); alarmePruefen();
      raus.nachNeuberechnung=D.meldungen.filter(m=>m.art==="verspaetung"&&m.auftragId===A.id).length;
      const m=D.meldungen.find(x=>x.art==="verspaetung"&&x.auftragId===A.id);
      if(m){m.gesehen=true;} alarmePruefen();
      raus.nachGesehen=D.meldungen.filter(m=>m.art==="verspaetung"&&m.auftragId===A.id).length;
      return raus; }""")
    pr("15 Min. Reserve → grün", f["gruen"]["klasse"]=="m-gruen", "m-gruen", f["gruen"]["klasse"])
    pr("5 Min. Reserve → orange", f["orange"]["klasse"]=="m-gelb", "m-gelb", f["orange"]["klasse"])
    pr("0 Min. Reserve → orange", f["orange0"]["klasse"]=="m-gelb", "m-gelb", f["orange0"]["klasse"])
    pr("negative Reserve → rot", f["rot"]["klasse"]=="m-rot", "m-rot", f["rot"]["klasse"])
    pr("19 Min. verspätet → kein Alarm", f["neunzehn"]["alarme"]==0, "0 Alarme", f["neunzehn"]["alarme"])
    pr("20 Min. verspätet → genau ein Alarm", f["zwanzig"]["alarme"]==1, "1 Alarm", f["zwanzig"]["alarme"])
    pr("erneutes Rechnen erzeugt keinen weiteren", f["nachNeuberechnung"]==1, "1", f["nachNeuberechnung"])
    pr("„Gesehen“ erzeugt keinen weiteren", f["nachGesehen"]==1, "1", f["nachGesehen"])

    print("\nJS-Fehler:", errs if errs else "keine")
    b.close()

print("\n" + ("ALLE PRUEFUNGEN BESTANDEN" if ok_all else "*** ES GIBT FEHLSCHLAEGE ***"))

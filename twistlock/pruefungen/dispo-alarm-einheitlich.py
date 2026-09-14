# -*- coding: utf-8 -*-
"""Punkte 1 und 2 der Korrektur: Anzeige und Alarm auf EINER Auswertung,
Berechnungszeit und Datenalter sauber getrennt.
Getestet wird ausschliesslich ueber die echten Anwendungsfunktionen."""
from playwright.sync_api import sync_playwright

URL = "http://localhost:8088/twistlock-dispo-vorschau.html"
ok_all = True
def pr(n, ok, erw="", ist=""):
    global ok_all; ok_all = ok_all and ok
    print(("  OK   " if ok else "  FEHL ") + n)
    if erw or ist: print("           erwartet: " + str(erw) + " | tatsächlich: " + str(ist))

# Drei aufeinanderfolgende Auftraege eines Fahrers, sauber aufgebaut.
AUFBAU = """() => {
  window.D = DISPO.zustand().D; window.U = DISPO.zustand().U;
  window.jetzt = () => new Date(DISPO.jetztIso());
  const h = jetzt();
  const iso = d => d.toISOString();
  const zz  = d => String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0");
  const tg  = d => iso(d).slice(0,10);
  D.fahrer = D.fahrer.filter(f=>f.id!=="fT");
  D.fahrer.push({id:"fT", name:"Testfahrer", telefon:"", sprache:"Deutsch", aktiv:true});
  D.zugmaschinen = D.zugmaschinen.filter(z=>z.id!=="zT");
  D.zugmaschinen.push({id:"zT", kennzeichen:"HB-TT 001", aktiv:true,
    routing:DISPO.telematikStandard?{}:{}, telematik:DISPO.telematikStandard(),
    kamera:{verbunden:false,letzteMeldung:null,letztesBild:null,ereignisse:[]},
    sicherung:{wegfahrsperre:"aus",vorgemerktAm:null,aktivSeit:null,fehlerGrund:null,
               diebstahlModus:false,diebstahlSeit:null,spur:[]}});
  D.auftraege = D.auftraege.filter(a=>!/^88\\d\\d$/.test(a.nummer));
  const frisch = iso(new Date(h.getTime()-2*60000));
  const mk = (nr, ab, li) => {
    const o = { id:"t"+nr, nummer:nr, tag:tg(h), freigegeben:true, storniert:false,
      kunde:"Testkunde "+nr, kundenRef:"", auftraggeberId:null,
      abhol:{firma:"Hansa Terminal Bremen", adresse:"Am Speicher 12, 28197 Bremen",
             datum:tg(ab), zeit:zz(ab), referenz:"", hinweis:""},
      liefer:{firma:"Ziel "+nr, adresse:"Lange Straße 4, 29664 Walsrode",
              datum:tg(li), zeit:zz(li), ansprech:"", telefon:"", hinweis:""},
      container:{erwartet:"", bestaetigt:null, groesse:"40 ft", typ:"Standard", siegel:"",
                 beladen:"beladen", rueckgabeOrt:"", rueckgabeTermin:null,
                 ungeprueft:false, abweichung:false, trotzdem:false},
      planung:{fahrerId:"fT", zugmaschineId:"zT", chassisId:D.chassis[0].id,
               ladenMin:30, wartenAbholMin:0, wartenMin:0, entladenMin:60, pufferMin:15},
      ablauf:{abholung:null,ankunft:null,warten:null,entladenStart:null,entladenEnde:null,abgabe:null},
      entladeVerlaengerung:null, fotos:{abholung:null,abgabe:null}, dokumente:[],
      bestaetigt:null, dispoNotiz:"", entwurf:null,
      beladung:{art:"selberTag",datum:null,zeit:null,stelle:"",hinweis:""},
      bilder:[], standort:null, automatik:{an:false,korrigiert:null,letzterWechsel:null},
      zonen:[], risiko:null, rechnungZeit:null,
      ortungZeit:frisch, datenZeit:frisch, prognoseZeit:frisch,
      prognose:null, alarmGesendet:false, verlauf:[] };
    D.auftraege.push(o); return o;
  };
  // A: laeuft, B und C folgen
  const abA = new Date(h.getTime()-120*60000);
  const liA = new Date(h.getTime()+60*60000);
  const A = mk("8801", abA, liA);
  A.ablauf.abholung = iso(new Date(h.getTime()-100*60000));
  const abB = new Date(h.getTime()+180*60000);
  const B = mk("8802", abB, new Date(abB.getTime()+105*60000));
  const abC = new Date(h.getTime()+420*60000);
  const C = mk("8803", abC, new Date(abC.getTime()+105*60000));
  ketteRechnen();
  return true;
}"""

def setzeVerspaetung(pg, minuten):
    """Auftrag 8801 auf genau <minuten> Verspaetung stellen, Alarm zuruecksetzen."""
    return pg.evaluate("""(min) => {
      const A = D.auftraege.find(x=>x.nummer==="8801");
      const termin = new Date(DISPO.jetztIso()); termin.setMinutes(termin.getMinutes()+60,0,0);
      A.liefer.datum = termin.toISOString().slice(0,10);
      A.liefer.zeit = String(termin.getHours()).padStart(2,"0")+":"+
                      String(termin.getMinutes()).padStart(2,"0");
      A.prognose = new Date(termin.getTime()+min*60000).toISOString();
      A.alarmGesendet = false;
      D.meldungen = D.meldungen.filter(m=>m.auftragId!==A.id);
      ketteRechnen();
      return true;
    }""", minuten)

def lage(pg, nr="8801"):
    return pg.evaluate("""(nr) => {
      const A = D.auftraege.find(x=>x.nummer===nr);
      const l = DISPO.lage(A), s = DISPO.zeitstatus(A);
      return { klasse:s.klasse, satz:s.satz, zusatz:s.zusatz||null, res:l.res,
               ok:l.ok, nurPlan:l.nurPlan, grund:l.grund,
               quelle:l.quelle, gerechnetAm:l.gerechnetAm,
               ortungZeit:A.ortungZeit, prognoseZeit:A.prognoseZeit,
               rechnungZeit:A.rechnungZeit,
               alarme:D.meldungen.filter(m=>m.art==="verspaetung"&&m.auftragId===A.id).length };
    }""", nr)

with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
    pg = b.new_context(viewport={"width":1280,"height":900}).new_page()
    errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(URL, wait_until="load"); pg.wait_for_timeout(400)
    pg.evaluate("localStorage.clear()"); pg.reload(wait_until="load"); pg.wait_for_timeout(800)
    pg.evaluate(AUFBAU)

    print("\nA) Altes allgemeines datenZeit blockiert keinen Alarm")
    setzeVerspaetung(pg, 20)
    pg.evaluate("""() => {
      const A = D.auftraege.find(x=>x.nummer==="8801");
      const alt = new Date(new Date(DISPO.jetztIso()).getTime()-90*60000).toISOString();
      A.datenZeit = alt;                                  // allgemein: uralt
      A.ortungZeit = new Date(new Date(DISPO.jetztIso()).getTime()-2*60000).toISOString();
      A.prognoseZeit = A.ortungZeit;                      // benutzte Grundlage: frisch
      ketteRechnen(); alarmePruefen(); }""")
    l = lage(pg)
    pr("Anzeige rot mit 20 Min. Verspaetung", l["klasse"]=="m-rot" and l["res"]==-20,
       "m-rot / -20", f'{l["klasse"]} / {l["res"]}')
    pr("genau ein Alarm trotz altem datenZeit", l["alarme"]==1, 1, l["alarme"])

    print("\nB) Schwelle: 19 kein Alarm, 20 genau einer")
    setzeVerspaetung(pg, 19); pg.evaluate("alarmePruefen()")
    l19 = lage(pg)
    pr("19 Min.: rot angezeigt", l19["klasse"]=="m-rot" and l19["res"]==-19, "-19", l19["res"])
    pr("19 Min.: KEIN Alarm", l19["alarme"]==0, 0, l19["alarme"])
    setzeVerspaetung(pg, 20); pg.evaluate("alarmePruefen()")
    l20 = lage(pg)
    pr("20 Min.: genau ein Alarm", l20["alarme"]==1, 1, l20["alarme"])
    # Negativer Wert = Prognose VOR dem Termin = Reserve.
    setzeVerspaetung(pg, -9); pg.evaluate("alarmePruefen()")
    l9 = lage(pg)
    pr("9 Min. Reserve: orange", l9["klasse"]=="m-gelb" and l9["res"]==9, "m-gelb / 9",
       f'{l9["klasse"]} / {l9["res"]}')
    pr("orange erzeugt keine Meldung", l9["alarme"]==0, 0, l9["alarme"])
    setzeVerspaetung(pg, -11); pg.evaluate("alarmePruefen()")
    l11 = lage(pg)
    pr("11 Min. Reserve: gruen", l11["klasse"]=="m-gruen" and l11["res"]==11, "m-gruen / 11",
       f'{l11["klasse"]} / {l11["res"]}')

    print("\nC) Kein doppelter Alarm nach Neuberechnen, Gesehen und Neuladen")
    setzeVerspaetung(pg, 25); pg.evaluate("alarmePruefen()")
    erste = lage(pg)["alarme"]
    pg.evaluate("ketteRechnen(); alarmePruefen(); ketteRechnen(); alarmePruefen();")
    pr("mehrfaches Rechnen erzeugt keinen zweiten Alarm", lage(pg)["alarme"]==erste==1,
       1, lage(pg)["alarme"])
    pg.evaluate("""() => { D.meldungen.forEach(m=>{ if(m.art==="verspaetung") m.gesehen=true; });
      alarmePruefen(); }""")
    pr("nach 'Gesehen' kein neuer Alarm", lage(pg)["alarme"]==1, 1, lage(pg)["alarme"])
    pg.evaluate("speichern()")
    pg.reload(wait_until="load"); pg.wait_for_timeout(800)
    pg.evaluate("window.D=DISPO.zustand().D; window.U=DISPO.zustand().U;")
    pg.evaluate("alarmePruefen()")
    nachLaden = pg.evaluate("""() => { const A=D.auftraege.find(x=>x.nummer==="8801");
      return D.meldungen.filter(m=>m.art==="verspaetung"&&m.auftragId===A.id).length; }""")
    pr("nach Neuladen kein neuer Alarm", nachLaden==1, 1, nachLaden)
    pr("vorhandene Meldung bleibt im Verlauf erhalten",
       pg.evaluate("""D.auftraege.find(x=>x.nummer==="8801").verlauf
         .some(e=>/Verspätungsalarm/.test(e.text))"""))

    print("\nD) Veraltete erforderliche Quelle: grau, kein neuer Alarm")
    pg.evaluate(AUFBAU)
    setzeVerspaetung(pg, 30)
    pg.evaluate("""() => {
      const A = D.auftraege.find(x=>x.nummer==="8801");
      A.ortungZeit = new Date(new Date(DISPO.jetztIso()).getTime()-45*60000).toISOString();
      A.prognoseZeit = new Date(DISPO.jetztIso()).toISOString();   // frisch gerechnet
      A.alarmGesendet = false;
      D.meldungen = D.meldungen.filter(m=>m.auftragId!==A.id);
      ketteRechnen(); alarmePruefen(); }""")
    ld = lage(pg)
    pr("grau statt einer Zahl", ld["klasse"]=="m-grau", "m-grau", ld["klasse"])
    pr("Grund nennt das Alter der Ortung",
       "älter" in (ld["zusatz"] or "") and "Ortung" in (ld["zusatz"] or ""),
       "Ortungszeitpunkt ist älter als …", ld["zusatz"])
    pr("kein neuer Alarm", ld["alarme"]==0, 0, ld["alarme"])
    pr("frisch gerechnet macht die alte Ortung NICHT frisch",
       ld["ortungZeit"] != ld["prognoseZeit"] and ld["rechnungZeit"] is not None,
       "Ortung alt, Rechnung neu",
       f'Ortung {ld["ortungZeit"]} / Rechnung {ld["rechnungZeit"]}')

    print("\nE) Verlaengerte Entladung: Folgeaufträge neu gerechnet, GPS unveraendert")
    pg.evaluate(AUFBAU)
    vorher = pg.evaluate("""() => {
      const A=D.auftraege.find(x=>x.nummer==="8801");
      A.ablauf.ankunft = new Date(new Date(DISPO.jetztIso()).getTime()-30*60000).toISOString();
      A.ablauf.entladenStart = new Date(new Date(DISPO.jetztIso()).getTime()-20*60000).toISOString();
      ketteRechnen();
      const l = o => { const x=D.auftraege.find(y=>y.nummer===o);
        return { ank:(x.rechnung2||{}).kundenAnkunft, ger:x.rechnungZeit,
                 ort:x.ortungZeit, prg:x.prognoseZeit }; };
      return { b:l("8802"), c:l("8803") }; }""")
    pg.wait_for_timeout(1100)
    nachher = pg.evaluate("""() => {
      const A=D.auftraege.find(x=>x.nummer==="8801");
      A.entladeVerlaengerung = { min:60, ab:DISPO.jetztIso(), unbekannt:false };
      A.prognoseZeit = DISPO.jetztIso();          // Fahrermeldung: neue Live-Info
      ketteRechnen();
      const l = o => { const x=D.auftraege.find(y=>y.nummer===o);
        return { ank:(x.rechnung2||{}).kundenAnkunft, ger:x.rechnungZeit,
                 ort:x.ortungZeit, prg:x.prognoseZeit }; };
      return { b:l("8802"), c:l("8803") }; }""")
    pr("Folgeauftrag B bekommt eine neue Ankunft",
       vorher["b"]["ank"] != nachher["b"]["ank"],
       "verschoben", f'{vorher["b"]["ank"]} → {nachher["b"]["ank"]}')
    pr("Folgeauftrag C ebenfalls",
       vorher["c"]["ank"] != nachher["c"]["ank"],
       "verschoben", f'{vorher["c"]["ank"]} → {nachher["c"]["ank"]}')
    # Die Demo-Uhr steht fest auf 10:30 — zwei Berechnungen koennen sich im
    # Zeitstempel gar nicht unterscheiden. Geprueft wird deshalb, was wirklich
    # zaehlt: der Berechnungszeitpunkt ist gesetzt und ist NICHT der
    # Ortungszeitpunkt.
    pr("Berechnungszeitpunkt bei B gesetzt und getrennt vom Ortungszeitpunkt",
       nachher["b"]["ger"] is not None and nachher["b"]["ger"] != nachher["b"]["ort"],
       "eigener Zeitstempel", f'Rechnung {nachher["b"]["ger"]} / Ortung {nachher["b"]["ort"]}')
    pr("Ortungszeitpunkt von B bleibt unveraendert",
       nachher["b"]["ort"] == vorher["b"]["ort"], vorher["b"]["ort"], nachher["b"]["ort"])
    pr("Ortungszeitpunkt von C bleibt unveraendert",
       nachher["c"]["ort"] == vorher["c"]["ort"], vorher["c"]["ort"], nachher["c"]["ort"])
    pr("Prognosezeitpunkt von B bleibt unveraendert",
       nachher["b"]["prg"] == vorher["b"]["prg"], vorher["b"]["prg"], nachher["b"]["prg"])

    print("\nF) Drei Auftraege: Verzoegerung wird weitergegeben, freie Zeit faengt sie auf")
    kette = pg.evaluate("""() => {
      const A=D.auftraege.find(x=>x.nummer==="8801");
      const lese = () => ["8801","8802","8803"].map(n=>{
        const x=D.auftraege.find(y=>y.nummer===n);
        return { nr:n, ank:(x.rechnung2||{}).kundenAnkunft, res:DISPO.lage(x).res }; });
      A.entladeVerlaengerung = null; ketteRechnen();
      const ohne = lese();
      A.entladeVerlaengerung = { min:180, ab:DISPO.jetztIso(), unbekannt:false };
      A.prognoseZeit = DISPO.jetztIso();
      ketteRechnen();
      const mit = lese();
      return { ohne, mit }; }""")
    def versch(o, m, i):
        if not o[i]["ank"] or not m[i]["ank"]: return None
        from datetime import datetime
        f = lambda s: datetime.fromisoformat(s.replace("Z","+00:00"))
        return round((f(m[i]["ank"]) - f(o[i]["ank"])).total_seconds()/60)
    vB = versch(kette["ohne"], kette["mit"], 1)
    vC = versch(kette["ohne"], kette["mit"], 2)
    pr("Verzoegerung erreicht Auftrag B", vB is not None and vB > 0, "> 0 Min.", vB)
    pr("Auftrag C wird hoechstens so stark verschoben wie B",
       vC is not None and vC <= vB, f"<= {vB}", vC)
    # Kleine Verzoegerung: die freie Zeit vor Auftrag B soll sie ganz aufnehmen.
    klein = pg.evaluate("""() => {
      const A=D.auftraege.find(x=>x.nummer==="8801");
      const lese = () => ["8802","8803"].map(n=>{
        const x=D.auftraege.find(y=>y.nummer===n);
        return { nr:n, ank:(x.rechnung2||{}).kundenAnkunft }; });
      A.entladeVerlaengerung = null; ketteRechnen();
      const ohne = lese();
      A.entladeVerlaengerung = { min:20, ab:DISPO.jetztIso(), unbekannt:false };
      A.prognoseZeit = DISPO.jetztIso(); ketteRechnen();
      return { ohne, mit:lese() }; }""")
    gleichB = klein["ohne"][0]["ank"] == klein["mit"][0]["ank"]
    pr("kleine Verzoegerung wird von der freien Zeit vor B vollstaendig aufgefangen",
       gleichB, "Ankunft B unveraendert",
       f'{klein["ohne"][0]["ank"]} → {klein["mit"][0]["ank"]}')

    print("\nG) Unklares Entladeende: keine genaue Folgeankunft")
    g = pg.evaluate("""() => {
      const A=D.auftraege.find(x=>x.nummer==="8801");
      const B=D.auftraege.find(x=>x.nummer==="8802");
      // Ausgangslage: B ohne Alarm, damit "kein NEUER Alarm" messbar ist
      B.alarmGesendet=false;
      D.meldungen=D.meldungen.filter(m=>m.auftragId!==B.id);
      A.entladeVerlaengerung = { min:null, ab:DISPO.jetztIso(), unbekannt:true };
      ketteRechnen();
      const vor=D.meldungen.filter(m=>m.art==="verspaetung"&&m.auftragId===B.id).length;
      alarmePruefen();
      const nach=D.meldungen.filter(m=>m.art==="verspaetung"&&m.auftragId===B.id).length;
      const s=DISPO.zeitstatus(B), l=DISPO.lage(B);
      return { klasse:s.klasse, satz:s.satz, zusatz:s.zusatz, ank:(B.rechnung2||{}).kundenAnkunft,
               res:l.res, alarme:nach-vor }; }""")
    pr("Folgeauftrag ohne genaue Ankunft", g["ank"] is None and g["res"] is None,
       "keine Ankunft", f'{g["ank"]} / {g["res"]}')
    pr("grau mit verstaendlichem Grund",
       g["klasse"]=="m-grau" and len(g["zusatz"] or "") > 15, "m-grau + Satz als Grund",
       f'{g["klasse"]} / {g["zusatz"]}')
    pr("kein Alarm aus einer unklaren Kette", g["alarme"]==0, 0, g["alarme"])

    print("\nH) Reine Planwerte bleiben Planung")
    plan = pg.evaluate("""() => {
      const C=D.auftraege.find(x=>x.nummer==="8803");
      C.prognose=null; C.ablauf.abholung=null; C.ablauf.ankunft=null;
      C.ortungZeit=null; C.prognoseZeit=null; C.datenZeit=null;
      C.planung.fahrerId=null;                 // frei von der Testkette
      C.alarmGesendet=false;
      D.meldungen=D.meldungen.filter(m=>m.auftragId!==C.id);
      ketteRechnen(); alarmePruefen();
      const s=DISPO.zeitstatus(C), l=DISPO.lage(C);
      return { klasse:s.klasse, satz:s.satz, nurPlan:l.nurPlan, res:l.res,
               alarme:D.meldungen.filter(m=>m.art==="verspaetung"&&m.auftragId===C.id).length }; }""")
    pr("als Planung gekennzeichnet", plan["nurPlan"] is True and plan["satz"]=="Nach Plan",
       "Nach Plan", f'{plan["satz"]} / nurPlan={plan["nurPlan"]}')
    pr("keine Reserve behauptet", plan["res"] is None, None, plan["res"])
    pr("kein Live-Alarm aus reiner Planung", plan["alarme"]==0, 0, plan["alarme"])

    print("\nI) Anzeige und Alarm koennen nicht auseinanderlaufen")
    pr("jeder Auftrag mit >= 20 Min. berechneter Verspaetung hat einen Alarm",
       pg.evaluate("""() => { alarmePruefen();
         return D.auftraege.filter(a=>!a.storniert && !a.ablauf.abgabe && !a.ablauf.ankunft)
           .every(a => { const l=DISPO.lage(a);
             if(!l.ok||l.nurPlan||l.istAnkunft||l.res==null||l.res>-20) return true;
             return a.alarmGesendet===true; }); }"""))
    pr("kein Alarm ohne tragfaehige Auswertung",
       pg.evaluate("""() => D.auftraege.filter(a=>a.alarmGesendet).every(a=>{
           const l=DISPO.lage(a);
           return l.istAnkunft || l.erledigt || (l.ok && !l.nurPlan); })"""))

    print("\nJS-Fehler:", errs if errs else "keine")
    ok_all = ok_all and not errs
    b.close()

print("\n" + ("ALLE PRUEFUNGEN BESTANDEN" if ok_all else "*** ES GIBT FEHLSCHLAEGE ***"))

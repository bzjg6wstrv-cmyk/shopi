# -*- coding: utf-8 -*-
"""Die neun gezielt geforderten Pruefungen zu den vier Korrekturen."""
from playwright.sync_api import sync_playwright
URL = "http://localhost:8089/twistlock-dispo-vorschau.html"
ok_all = True
def pr(n, ok, d=""):
    global ok_all; ok_all = ok_all and ok
    print(("  OK   " if ok else "  FEHL ") + n + ("  → " + str(d) if d else ""))

with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
    ctx = b.new_context(viewport={"width":1280,"height":900})
    pg = ctx.new_page()
    errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(URL, wait_until="load"); pg.evaluate("localStorage.clear()")
    pg.reload(wait_until="load"); pg.wait_for_timeout(700)

    print("\n1) Ueberschneidung bei Abholung/Fahrt, NICHT beim Entladen")
    res = pg.evaluate("""() => {
      const t = (()=>{const d=new Date();d.setHours(10,30,0,0);return d.toISOString().slice(0,10);})();
      const mk = (nr, abZeit, liZeit) => ({
        id:"x"+nr, nummer:nr, tag:t, freigegeben:true, storniert:false, kunde:"Test "+nr,
        kundenRef:"", dispoNotiz:"", entwurf:null,
        abhol:{firma:"Terminal", adresse:"Am Speicher 12, 28197 Bremen", datum:t, zeit:abZeit,
               referenz:"", hinweis:""},
        liefer:{firma:"K", adresse:"Lange Str. 4, 29664 Walsrode", datum:t, zeit:liZeit,
                ansprech:"", telefon:"", hinweis:""},
        container:{erwartet:"", bestaetigt:null, groesse:"40 ft", typ:"Standard", siegel:"",
                   beladen:"beladen", rueckgabeOrt:"", rueckgabeTermin:null,
                   ungeprueft:false, abweichung:false, trotzdem:false},
        planung:{fahrerId:"f1", zugmaschineId:"z1", chassisId:"c1",
                 ladenMin:30, wartenAbholMin:0, wartenMin:0, entladenMin:60, pufferMin:15},
        ablauf:{abholung:null,ankunft:null,warten:null,entladenStart:null,entladenEnde:null,abgabe:null},
        entladeVerlaengerung:null, fotos:{abholung:null,abgabe:null}, dokumente:[],
        bestaetigt:null, ortungZeit:null, datenZeit:null, prognoseZeit:null, prognose:null,
        alarmGesendet:false, verlauf:[]
      });
      // A: Abholung 08:00 -> Entladung endet ca 09:45 ; B: Abholung 09:00 (waehrend A faehrt)
      // Lieferzeiten liegen weit auseinander -> Entladefenster ueberschneiden sich NICHT
      const A = mk("9001","08:00","10:00");
      const B = mk("9002","09:00","13:00");
      D.auftraege.push(A, B);
      const bA = DISPO.belegung(A), bB = DISPO.belegung(B);
      return {kA:DISPO.konflikte(A).map(x=>x.was), satz:(DISPO.konflikte(A)[0]||{}).satz,
              belA:[bA.von.slice(11,16), bA.bis.slice(11,16)],
              belB:[bB.von.slice(11,16), bB.bis.slice(11,16)]};
    }""")
    print("        Bindung A", res["belA"], " Bindung B", res["belB"])
    pr("Konflikt trotz getrennter Entladefenster erkannt", len(res["kA"]) >= 1, res["kA"])
    pr("konkrete Meldung mit Uhrzeiten", bool(res["satz"]) and "gebunden" in (res["satz"] or "").lower(),
       res["satz"])

    print("\n2) Ueberschneidung ueber Mitternacht")
    res2 = pg.evaluate("""() => {
      const h=new Date(); h.setHours(10,30,0,0);
      const t1 = h.toISOString().slice(0,10);
      const t2 = new Date(h.getTime()+86400000).toISOString().slice(0,10);
      const A = D.auftraege.find(a=>a.nummer==="9001"), B = D.auftraege.find(a=>a.nummer==="9002");
      // A spaet am Tag, B frueh am Folgetag -> anderer Einsatztag, trotzdem Konflikt
      A.tag=t1; A.abhol.datum=t1; A.abhol.zeit="21:30"; A.liefer.datum=t1; A.liefer.zeit="23:30";
      A.planung.entladenMin=120;
      B.tag=t2; B.abhol.datum=t2; B.abhol.zeit="01:00"; B.liefer.datum=t2; B.liefer.zeit="03:30";
      const bA=DISPO.belegung(A);
      return {verschiedeneTage:A.tag!==B.tag, k:DISPO.konflikte(A).map(x=>x.was),
              belA:[bA.von.slice(5,16), bA.bis.slice(5,16)],
              satz:(DISPO.konflikte(A)[0]||{}).satz};
    }""")
    print("        Bindung A", res2["belA"])
    pr("Auftraege liegen auf verschiedenen Einsatztagen", res2["verschiedeneTage"])
    pr("Konflikt ueber Mitternacht erkannt", len(res2["k"]) >= 1, res2["k"])

    print("\n3) +60 Min. Wartezeit bei der naechsten Abholung → Lieferankunft +60 Min.")
    res3 = pg.evaluate("""() => {
      const A = D.auftraege.find(a=>a.nummer==="9001"), B = D.auftraege.find(a=>a.nummer==="9002");
      const h=new Date(); h.setHours(10,30,0,0); const t=h.toISOString().slice(0,10);
      A.tag=t; A.abhol.datum=t; A.abhol.zeit="06:00"; A.liefer.datum=t; A.liefer.zeit="09:00";
      A.planung.entladenMin=60;
      B.tag=t; B.abhol.datum=t; B.abhol.zeit="13:00"; B.liefer.datum=t; B.liefer.zeit="17:00";
      B.planung.wartenAbholMin = 0;
      ketteRechnen();
      const ohne = DISPO.folgePrognose(A,B);
      B.planung.wartenAbholMin = 60;
      ketteRechnen();
      const mit = DISPO.folgePrognose(A,B);
      return {ohne:ohne.isoKunde, mit:mit.isoKunde,
              diff:(new Date(mit.isoKunde)-new Date(ohne.isoKunde))/60000,
              abholGleich: ohne.isoAbholung === mit.isoAbholung};
    }""")
    pr("Lieferankunft verschiebt sich um genau 60 Minuten", res3["diff"] == 60, res3["diff"])
    pr("Ankunft an der Abholstelle bleibt gleich", res3["abholGleich"])

    print("\n4) Verlaengerte Entladung: Detail und Tagesplan identisch")
    # Kontrolliertes Szenario: ein Fahrer, ein entladender und ein noch nicht
    # begonnener Folgeauftrag. So haengt das Ergebnis nicht an der Datenlage.
    pg.evaluate("localStorage.clear()"); pg.reload(wait_until="load"); pg.wait_for_timeout(700)
    res4 = pg.evaluate("""() => {
      const h=new Date(); h.setHours(10,30,0,0); const t=h.toISOString().slice(0,10);
      // Fahrer f9 bekommt genau zwei Auftraege an diesem Tag
      D.fahrer.push({id:"f9", name:"Testfahrer", telefon:"", sprache:"Deutsch", aktiv:true});
      const mk = (nr, abZeit, liZeit) => ({
        id:"y"+nr, nummer:nr, tag:t, freigegeben:true, storniert:false, kunde:"Kette "+nr,
        kundenRef:"", dispoNotiz:"", entwurf:null,
        abhol:{firma:"T", adresse:"Am Speicher 12, 28197 Bremen", datum:t, zeit:abZeit, referenz:"", hinweis:""},
        liefer:{firma:"K", adresse:"Lange Str. 4, 29664 Walsrode", datum:t, zeit:liZeit,
                ansprech:"", telefon:"", hinweis:""},
        container:{erwartet:"", bestaetigt:null, groesse:"40 ft", typ:"Standard", siegel:"",
                   beladen:"beladen", rueckgabeOrt:"", rueckgabeTermin:null,
                   ungeprueft:false, abweichung:false, trotzdem:false},
        planung:{fahrerId:"f9", zugmaschineId:"z1", chassisId:"c1",
                 ladenMin:30, wartenAbholMin:0, wartenMin:0, entladenMin:60, pufferMin:15},
        ablauf:{abholung:null,ankunft:null,warten:null,entladenStart:null,entladenEnde:null,abgabe:null},
        entladeVerlaengerung:null, fotos:{abholung:null,abgabe:null}, dokumente:[],
        bestaetigt:null, ortungZeit:new Date(h.getTime()-2*60000).toISOString(),
        datenZeit:new Date(h.getTime()-2*60000).toISOString(),
        prognoseZeit:new Date(h.getTime()-2*60000).toISOString(),
        prognose:null, alarmGesendet:false, verlauf:[]
      });
      const A = mk("9101","06:00","09:00");     // entlaedt gerade
      A.ablauf.abholung = new Date(h.getTime()-4*60*60000).toISOString();
      A.ablauf.ankunft  = new Date(h.getTime()-90*60000).toISOString();
      A.ablauf.entladenStart = new Date(h.getTime()-30*60000).toISOString();
      const B = mk("9102","14:00","18:00");     // noch nicht begonnen
      D.auftraege.push(A, B);
      ketteRechnen();
      const vorher = DISPO.tourErgebnis(B).kundenAnkunft;
      // Fahrer meldet +60 Minuten
      A.entladeVerlaengerung = {min:60, ab:jetztIso(), unbekannt:false};
      A.prognoseZeit = jetztIso();
      ketteRechnen();
      const detail = DISPO.folgePrognose(A, B);
      return {folgeIstB: (naechsterAuftrag(A)||{}).id === B.id,
              vorher, nachher:DISPO.tourErgebnis(B).kundenAnkunft, detail:detail.isoKunde,
              tagesplan: DISPO.prognose(B).iso,
              tagesplanBezug: DISPO.massgeblich(B).art,
              ketteAbhol: DISPO.tourErgebnis(B).abholAnkunft,
              verschoben: (new Date(DISPO.tourErgebnis(B).kundenAnkunft)-new Date(vorher))/60000};
    }""")
    pr("Folgeauftrag ist der erwartete", res4["folgeIstB"])
    # In diesem Aufbau betraegt die Verzoegerung 30 Min. (Rest 30 -> Ende jetzt+60),
    # der Puffer vor B aber 45 Min. Sie wird daher vollstaendig aufgefangen: 0 Min.
    # Die Weitergabe ohne Puffer ist in dispo-kette.py (Test A) geprueft.
    pr("vorhandener Puffer faengt die Verzoegerung auf", res4["verschoben"] == 0,
       "erwartet 0 Min. (45 Min. Puffer > 30 Min. Verzoegerung), tatsaechlich " +
       str(res4["verschoben"]) + " Min.")
    pr("Detail und Tourkette liefern dieselbe Kundenankunft", res4["nachher"] == res4["detail"],
       str(res4["nachher"])+" / "+str(res4["detail"]))
    # B ist noch nicht abgeholt, massgeblich ist daher die ABHOLUNG.
    pr("Tagesplan zeigt die Abholankunft aus derselben Rechnung",
       res4["tagesplan"] == res4["ketteAbhol"] and res4["tagesplanBezug"] == "Abholung",
       "erwartet " + str(res4["ketteAbhol"]) + ", tatsaechlich " + str(res4["tagesplan"]))

    print("\n5) 19 Min. Verspaetung: kein Alarm — 20 Min.: genau ein Alarm")
    res5 = pg.evaluate("""() => {
      const raus = {};
      const bau = (verspaetung) => {
        const h=new Date(); h.setHours(10,30,0,0); const t=h.toISOString().slice(0,10);
        D.meldungen = []; 
        D.auftraege.forEach(a=>{a.alarmGesendet=false;});
        const a = D.auftraege.find(x=>x.nummer==="4803");
        a.ablauf.ankunft=null; a.ablauf.entladenStart=null; a.ablauf.entladenEnde=null;
        a.ablauf.abholung = new Date(h.getTime()-60*60000).toISOString();
        a.ortungZeit = new Date(h.getTime()-2*60000).toISOString();
        a.prognoseZeit = a.ortungZeit; a.datenZeit = a.ortungZeit;
        a.entladeVerlaengerung = null;
        const termin = new Date(h.getTime()+60*60000); termin.setSeconds(0,0);
        a.liefer.datum = termin.toISOString().slice(0,10);
        a.liefer.zeit = termin.toTimeString().slice(0,5);
        a.prognose = new Date(termin.getTime()+verspaetung*60000).toISOString();
        ketteRechnen(); alarmePruefen();
        return {res:DISPO.zeitstatus(a).res,
                alarme:D.meldungen.filter(m=>m.art==="verspaetung"&&m.auftragId===a.id).length};
      };
      raus.neunzehn = bau(19);
      raus.zwanzig = bau(20);
      // erneut rechnen darf keinen zweiten Alarm erzeugen
      ketteRechnen(); alarmePruefen(); alarmePruefen();
      const a = D.auftraege.find(x=>x.nummer==="4803");
      raus.nachNeuberechnung = D.meldungen.filter(m=>m.art==="verspaetung"&&m.auftragId===a.id).length;
      return raus;
    }""")
    pr("19 Min. verspaetet → kein Alarm",
       res5["neunzehn"]["res"] == -19 and res5["neunzehn"]["alarme"] == 0, res5["neunzehn"])
    pr("20 Min. verspaetet → genau ein Alarm",
       res5["zwanzig"]["res"] == -20 and res5["zwanzig"]["alarme"] == 1, res5["zwanzig"])
    pr("erneutes Rechnen erzeugt keinen zweiten Alarm", res5["nachNeuberechnung"] == 1,
       res5["nachNeuberechnung"])

    print("\n6) Entladeende unbekannt: keine Folgeankunft, kein neuer Alarm")
    res6 = pg.evaluate("""() => {
      const A = D.auftraege.find(x=>x.nummer==="9101"), B = D.auftraege.find(x=>x.nummer==="9102");
      const alarmeVor = D.meldungen.filter(m=>m.art==="verspaetung").length;
      A.entladeVerlaengerung = {min:null, ab:jetztIso(), unbekannt:true};
      A.prognoseZeit = jetztIso();
      ketteRechnen(); alarmePruefen();
      const f = DISPO.folgePrognose(A,B);
      return {folge:f.iso, grund:f.grund, kette:DISPO.tourErgebnis(B).kundenAnkunft,
              status:DISPO.zeitstatus(B).klasse,
              alarmeVor, alarmeNach:D.meldungen.filter(m=>m.art==="verspaetung").length};
    }""")
    pr("keine genaue Folgeankunft", res6["folge"] is None and res6["kette"] is None)
    pr("Folgeauftrag steht auf grau", res6["status"] == "m-grau", res6["status"])
    pr("verstaendlicher Hinweis", "Weiß ich noch nicht" in (res6["grund"] or ""), res6["grund"])
    pr("kein neuer Verspaetungsalarm", res6["alarmeNach"] == res6["alarmeVor"],
       f"{res6['alarmeVor']} → {res6['alarmeNach']}")

    print("\n7) Entwurf eines freigegebenen Auftrags + Neuladen")
    pg.evaluate("localStorage.clear()"); pg.reload(wait_until="load"); pg.wait_for_timeout(700)
    ziel = pg.evaluate("""() => { const a=D.auftraege.find(x=>x.freigegeben&&x.bestaetigt&&!x.ablauf.abgabe);
      U.auftragId=a.id; U.bereich='detail'; zeichne();
      return {id:a.id, adresse:a.liefer.adresse, bestaetigt:a.bestaetigt}; }""")
    pg.wait_for_timeout(300)
    pg.click('[data-tun="bearbeiten"]'); pg.wait_for_timeout(350)
    pg.fill("#f_lieferAdresse", "Entwurfsstrasse 99, 29664 Walsrode")
    pg.click('[data-tun="entwurf"]'); pg.wait_for_timeout(450)
    nach = pg.evaluate(f"""() => {{ const a=D.auftraege.find(x=>x.id==='{ziel["id"]}');
      return {{adresse:a.liefer.adresse, bestaetigt:a.bestaetigt, entwurf:!!a.entwurf,
              entwurfAdresse:a.entwurf&&a.entwurf.liefer.adresse}}; }}""")
    pr("freigegebener Stand unveraendert", nach["adresse"] == ziel["adresse"], nach["adresse"])
    pr("Fahrerbestaetigung unveraendert", nach["bestaetigt"] == ziel["bestaetigt"])
    pr("Entwurf liegt daneben", nach["entwurf"] and "Entwurfsstrasse" in (nach["entwurfAdresse"] or ""))
    pr("Oberflaeche sagt 'nicht freigegeben'", "noch nicht freigegeben" in pg.inner_text("#inhalt"))
    pg.reload(wait_until="load"); pg.wait_for_timeout(700)
    nachLaden = pg.evaluate(f"""() => {{ const a=D.auftraege.find(x=>x.id==='{ziel["id"]}');
      return {{adresse:a.liefer.adresse, bestaetigt:a.bestaetigt, entwurf:!!a.entwurf}}; }}""")
    pr("nach Neuladen: freigegebener Stand erhalten", nachLaden["adresse"] == ziel["adresse"])
    pr("nach Neuladen: Bestaetigung erhalten", nachLaden["bestaetigt"] == ziel["bestaetigt"])
    pr("nach Neuladen: Entwurf erhalten", nachLaden["entwurf"])

    print("\n8) Wesentliche Aenderung freigeben")
    pg.evaluate(f"U.auftragId='{ziel['id']}';U.bereich='detail';zeichne()"); pg.wait_for_timeout(350)
    pg.click('[data-tun="entwurfFreigeben"]'); pg.wait_for_timeout(500)
    frei = pg.evaluate(f"""() => {{ const a=D.auftraege.find(x=>x.id==='{ziel["id"]}');
      return {{adresse:a.liefer.adresse, bestaetigt:a.bestaetigt, entwurf:!!a.entwurf,
              verlauf:a.verlauf.slice(-3).map(e=>e.text)}}; }}""")
    pr("neuer Stand ist sichtbar", "Entwurfsstrasse" in frei["adresse"], frei["adresse"])
    pr("Fahrerbestaetigung ist wieder offen", frei["bestaetigt"] is None)
    pr("Entwurf ist aufgeloest", frei["entwurf"] is False)
    pr("Verlauf haelt es fest", any("freigegeben" in t for t in frei["verlauf"]), frei["verlauf"])

    print("\n9) Interne Notiz aendert die Bestaetigung nicht")
    bst = pg.evaluate("""() => { const a=D.auftraege.find(x=>x.freigegeben&&x.bestaetigt&&!x.ablauf.abgabe);
      U.auftragId=a.id;U.bereich='detail';zeichne(); return {id:a.id, b:a.bestaetigt}; }""")
    pg.wait_for_timeout(300)
    pg.fill("#notizfeld", "Nur intern: Kunde hat angerufen")
    pg.click('[data-tun="notizSpeichern"]'); pg.wait_for_timeout(400)
    nz = pg.evaluate(f"""() => {{ const a=D.auftraege.find(x=>x.id==='{bst["id"]}');
      return {{b:a.bestaetigt, notiz:a.dispoNotiz, entwurf:!!a.entwurf}}; }}""")
    pr("Bestaetigung bleibt erhalten", nz["b"] == bst["b"])
    pr("Notiz ist gespeichert", "Nur intern" in (nz["notiz"] or ""))
    pr("Notiz erzeugt keinen Entwurf", nz["entwurf"] is False)

    print("\nJS-Fehler:", errs if errs else "keine")
    b.close()

print("\n" + ("ALLE PRUEFUNGEN BESTANDEN" if ok_all else "*** ES GIBT FEHLSCHLAEGE ***"))

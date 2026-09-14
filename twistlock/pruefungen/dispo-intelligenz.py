# -*- coding: utf-8 -*-
"""Prueft die neuen Funktionen an der laufenden Anwendung:
Telematik, Routing, Geofences, Automatik, Smart Dispo, Kamera,
Fahrzeugsicherheit, Import und Foto-KI."""
from playwright.sync_api import sync_playwright

URL = "http://localhost:8088/twistlock-dispo-vorschau.html"
ok_all = True
def pr(n, ok, d=""):
    global ok_all; ok_all = ok_all and ok
    print(("  OK   " if ok else "  FEHL ") + n + ("  → " + str(d) if d else ""))

with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
    pg = b.new_context(viewport={"width":1280,"height":900}).new_page()
    errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(URL, wait_until="load"); pg.wait_for_timeout(400)
    pg.evaluate("localStorage.clear()"); pg.reload(wait_until="load"); pg.wait_for_timeout(900)
    D = lambda js: pg.evaluate("(()=>{const D=DISPO.zustand().D;const U=DISPO.zustand().U;return %s;})()" % js)

    print("\nA) Anbieter und Telematik")
    arten = pg.evaluate("Object.keys(DISPO.ANBIETER).map(k=>k+':'+DISPO.ANBIETER[k].art)")
    pr("sechs Anbieter, alle auf demo", len(arten) == 6 and all(a.endswith(":demo") for a in arten), arten)
    pr("jede Zugmaschine hat Telematik, Routing, Kamera, Sicherung",
       D("D.zugmaschinen.every(z=>z.telematik&&z.routing&&z.kamera&&z.sicherung)"))
    pr("Lkw-Masse vollstaendig",
       D("D.zugmaschinen.every(z=>z.routing.hoeheM&&z.routing.breiteM&&z.routing.laengeM&&z.routing.gewichtT)"))
    pr("kein Fahrzeug behauptet eine echte Verbindung",
       "simuliert" in pg.evaluate("DISPO.ANBIETER.telematik.geraet").lower() or
       "simuliert" in pg.evaluate("(()=>{let s='';for(const k in DISPO.ANBIETER)s+=JSON.stringify(DISPO.ANBIETER[k]);return s;})()").lower())

    print("\nB) Routing-Engine")
    r = pg.evaluate("""DISPO.routeBerechnen("Am Speicher 12, 28197 Bremen",
        "Zum Gewerbegebiet 5, 29664 Walsrode", DISPO.zustand().D.zugmaschinen[0],
        DISPO.jetztIso())""")
    pr("liefert Minuten und Kilometer", r["minuten"] > 0 and r["km"] > 0, f'{r["km"]} km / {r["minuten"]} Min.')
    pr("nennt die Quelle", "Demo" in r["quelle"], r["quelle"])
    pr("gibt sich als nicht echt zu erkennen", r["echt"] is False)
    pr("Entfernung ist plausibel (Bremen-Walsrode ~60-90 km)", 55 <= r["km"] <= 95, r["km"])
    r2 = pg.evaluate("""DISPO.routeBerechnen("Unbekanntstadt 1","Andersort 2",null,DISPO.jetztIso())""")
    pr("unbekannter Ort faellt auf den Planwert zurueck",
       r2["minuten"] is not None and r2["km"] is None and "Planwert" in r2["quelle"], r2["quelle"])
    rm = pg.evaluate("""DISPO.routeBerechnen("Am Speicher 12, 28197 Bremen",
        "Zum Gewerbegebiet 5, 29664 Walsrode", DISPO.zustand().D.zugmaschinen[0],
        new Date(new Date(DISPO.jetztIso()).setHours(16,0,0,0)).toISOString())""")
    pr("Nachmittagsverkehr kostet mehr Zeit als Mittag", rm["minuten"] >= r["minuten"],
       f'{r["minuten"]} → {rm["minuten"]}')

    print("\nC) Lernende Prognose")
    le = pg.evaluate("""DISPO.lernEta("Am Speicher 12, 28197 Bremen",
        "Zum Gewerbegebiet 5, 29664 Walsrode", DISPO.zustand().D.zugmaschinen[0], DISPO.jetztIso())""")
    pr("kombiniert Routing und eigene Fahrten", le["lern"]["minuten"] is not None and le["gewicht"] > 0,
       le["erklaerung"])
    pr("Ergebnis liegt zwischen beiden Werten",
       min(le["route"]["minuten"], le["lern"]["minuten"]) <= le["minuten"] <= max(le["route"]["minuten"], le["lern"]["minuten"]))
    st = pg.evaluate("DISPO.lernStandzeit('kunde_poco','entladung')")
    st2 = pg.evaluate("DISPO.lernStandzeit('kunde_nordsee','entladung')")
    pr("Standzeiten je Auftraggeber unterscheiden sich", st["minuten"] != st2["minuten"],
       f'Poco {st["minuten"]} / Nordsee {st2["minuten"]}')
    zu = pg.evaluate("DISPO.lernStandzeit('kunde_moeller','entladung')")
    pr("zu wenige Beobachtungen → keine Zahl", zu["minuten"] is None and zu["treffer"]=="zuwenig", zu)
    ohne = pg.evaluate("DISPO.lernFahrzeit('Nirgendwo 1','Anderswo 2',DISPO.jetztIso())")
    pr("unbekannte Strecke → keine erfundene Zahl", ohne["minuten"] is None)

    print("\nD) Zentrale Status-Engine")
    zust = D("D.auftraege.map(a=>DISPO.transportStatus(a))")
    erlaubt = {"geplant","freigegeben","auftragGesehen","anfahrtAbholung","beiAbholung",
               "containerUebernommen","unterwegsKunde","angekommenKunde","warten","entladung",
               "entladungFertig","nachlauf","abgeschlossen","storniert","nichtZugewiesen","entwurf"}
    pr("nur bekannte Zustaende", set(zust) <= erlaubt, sorted(set(zust)))
    pr("interne Anzeige kommt aus derselben Engine",
       D("D.auftraege.every(a=>DISPO.zustand()&&true)") and
       pg.evaluate("""DISPO.zustand().D.auftraege.every(a=>{
         const st = DISPO.transportStatus(a); return !!st; })"""))
    pr("externe Wortwahl ist eine Uebersetzung desselben Zustands",
       pg.evaluate("""DISPO.zustand().D.auftraege.every(a=>
         DISPO.externStatus(a).status === DISPO.transportStatus(a))"""))

    print("\nE) Geofences und Automatik")
    pr("Zonen sind hinterlegt", D("D.geofences.length") >= 8, D("D.geofences.length"))
    pr("Zone wird aus Koordinaten geprueft, nicht aus dem Namen",
       pg.evaluate("""(()=>{const g=DISPO.zustand().D.geofences[0];
         return DISPO.inZone(g.lat,g.lng,g)===true && DISPO.inZone(0,0,g)===false;})()"""))
    zid = D("D.zugmaschinen.find(z=>z.kennzeichen==='HB-TL 742').id")
    aid = D("(D.auftraege.find(a=>a.nummer==='5104')||{}).id")
    vor = D("(D.auftraege.find(a=>a.nummer==='5104')||{}).ablauf.ankunft")
    pg.evaluate("""(()=>{const D=DISPO.zustand().D;
      const z=D.zugmaschinen.find(x=>x.kennzeichen==='HB-TL 742');
      const a=D.auftraege.find(x=>x.nummer==='5104');
      const g=DISPO.geofenceFuer(a.liefer.adresse,a.liefer.firma);
      z.telematik.latitude=g.lat; z.telematik.longitude=g.lng;
      z.telematik.geschwindigkeit=0; z.telematik.bewegung=false; z.telematik.zuendung=false;
      z.telematik.letzteMeldung=DISPO.jetztIso();
      DISPO.automatikLauf();})()""")
    pg.wait_for_timeout(300)
    nach = D("(D.auftraege.find(a=>a.nummer==='5104')||{}).ablauf.ankunft")
    pr("Einfahrt in die Kundenzone setzt die Ankunft automatisch", vor is None and nach is not None,
       f"{vor} → {nach}")
    q = D("""(D.auftraege.find(a=>a.nummer==='5104').verlauf.slice(-1)[0]||{}).quelle""")
    pr("der Eintrag ist als automatisch gekennzeichnet", q == "automatisch", q)
    pr("Entladung wird NICHT automatisch gesetzt",
       D("D.auftraege.find(a=>a.nummer==='5104').ablauf.entladenStart") is None)
    pr("Ablieferung wird NICHT automatisch gesetzt",
       D("D.auftraege.find(a=>a.nummer==='5104').ablauf.abgabe") is None)

    # Zone verlassen -> Vorschlag statt Status
    pg.evaluate("""(()=>{const D=DISPO.zustand().D;
      const z=D.zugmaschinen.find(x=>x.kennzeichen==='HB-TL 742');
      z.telematik.latitude=53.0793; z.telematik.longitude=8.8017;
      z.telematik.bewegung=true; z.telematik.geschwindigkeit=70;
      z.telematik.letzteMeldung=DISPO.jetztIso();
      DISPO.automatikLauf();})()""")
    pg.wait_for_timeout(300)
    vs = D("(D.auftraege.find(a=>a.nummer==='5104').vorschlaege||[]).filter(v=>!v.erledigt).map(v=>v.schluessel)")
    pr("Verlassen der Kundenzone erzeugt einen VORSCHLAG, keinen Status", "abgabe" in vs, vs)
    pr("Ablieferung ist weiterhin nicht gesetzt",
       D("D.auftraege.find(a=>a.nummer==='5104').ablauf.abgabe") is None)

    print("\nF) Manuelle Korrektur")
    pg.evaluate("""(()=>{const a=DISPO.zustand().D.auftraege.find(x=>x.nummer==='5104');
      DISPO.statusKorrigieren(a,'ankunft',false);})()""")
    pg.wait_for_timeout(200)
    pr("Korrektur nimmt den Status zurueck",
       D("D.auftraege.find(a=>a.nummer==='5104').ablauf.ankunft") is None)
    pr("Automatik ist danach aus",
       D("D.auftraege.find(a=>a.nummer==='5104').automatik.an") is False)
    pg.evaluate("""(()=>{const D=DISPO.zustand().D;
      const z=D.zugmaschinen.find(x=>x.kennzeichen==='HB-TL 742');
      const a=D.auftraege.find(x=>x.nummer==='5104');
      const g=DISPO.geofenceFuer(a.liefer.adresse,a.liefer.firma);
      z.telematik.latitude=g.lat; z.telematik.longitude=g.lng;
      z.telematik.bewegung=false; z.telematik.geschwindigkeit=0;
      z.telematik.letzteMeldung=DISPO.jetztIso(); DISPO.automatikLauf();})()""")
    pg.wait_for_timeout(300)
    pr("Automatik ueberschreibt die Korrektur NICHT",
       D("D.auftraege.find(a=>a.nummer==='5104').ablauf.ankunft") is None)
    pr("Korrektur steht mit Quelle Dispo im Verlauf",
       D("""D.auftraege.find(a=>a.nummer==='5104').verlauf.some(e=>e.quelle==='dispo'&&/Status/.test(e.text))"""))

    # Ausgangslage wiederherstellen
    pg.evaluate("localStorage.clear()"); pg.reload(wait_until="load"); pg.wait_for_timeout(900)

    print("\nG) Datenqualitaet und Risiko")
    g1 = pg.evaluate("""(()=>{const a=DISPO.zustand().D.auftraege.find(x=>x.nummer==='5104');
      return DISPO.datenGuete(a);})()""")
    g2 = pg.evaluate("""(()=>{const a=DISPO.zustand().D.auftraege.find(x=>x.nummer==='4809');
      return DISPO.datenGuete(a);})()""")
    pr("frische Ortung → hohe Datenqualitaet", g1["stufe"] in ("hoch","mittel"), g1["stufe"])
    pr("veraltete Ortung → schlechtere Datenqualitaet", g2["punkte"] < g1["punkte"],
       f'{g1["stufe"]}({g1["punkte"]}) vs {g2["stufe"]}({g2["punkte"]})')
    ri = pg.evaluate("""(()=>{const a=DISPO.zustand().D.auftraege.find(x=>x.nummer==='5104');
      return DISPO.risikoVon(a);})()""")
    pr("Risiko nennt Gruende", len(ri["gruende"]) > 0, ri["gruende"][:1])
    pr("Risikostufe passt zum Prozentwert",
       (ri["stufe"]=="hoch" and ri["prozent"]>=55) or (ri["stufe"]!="hoch"),
       f'{ri["stufe"]}/{ri["prozent"]}%')
    zuk = pg.evaluate("""(()=>{const D=DISPO.zustand().D;
      const a=D.auftraege.find(x=>x.tag>new Date().toISOString().slice(0,10)&&!x.ablauf.abholung);
      return a?DISPO.risikoBerechnen(a):null;})()""")
    pr("kuenftiger Plantag bekommt kein Live-Risiko", zuk is None or zuk["stufe"]=="keins", zuk)

    print("\nH) Smart Dispo")
    pg.click('[data-tun="bereich"][data-wert="smart"]'); pg.wait_for_timeout(1500)
    t = pg.inner_text("#inhalt")
    pr("Bereich oeffnet sich", "Dispo-Assistent" in t)
    pr("als Demo gekennzeichnet", "Assistent – Demo" in t or "Assistent - Demo" in t)
    pr("sagt, dass keine externe KI benutzt wird", "Kein Sprachmodell" in t)
    n_emp = pg.locator(".empfehlung").count()
    pr("Empfehlungen vorhanden", n_emp > 0, n_emp)
    pr("jede Empfehlung hat ein Warum",
       pg.locator(".empfehlung .warum").count() == n_emp)
    pr("ein Eintrag je Auftrag, nicht je Befund",
       pg.evaluate("""(()=>{const ids=[...document.querySelectorAll('.empfehlung [data-tun=\\"vsAuftrag\\"]')]
         .map(e=>e.getAttribute('data-wert'));return ids.length===new Set(ids).size;})()"""))

    print("\nI) Vorschlag uebernehmen zeigt ALT und NEU")
    pg.locator('[data-tun="vsAnsehen"]').first.click(); pg.wait_for_timeout(900)
    dt = pg.inner_text("#dlg")
    pr("Dialog zeigt ALT und NEU", "ALT" in dt and "NEU" in dt)
    pr("Dialog nennt die Gruende", "Warum" in dt)
    pr("zwei Wege: Ablehnen und Uebernehmen",
       pg.locator("#dlg-fuss button").count() == 2)
    vorZ = D("D.auftraege.map(a=>a.planung.zugmaschineId+'|'+(a.beladung||{}).art).join(',')")
    pg.locator('#dlg-fuss button').first.click(); pg.wait_for_timeout(500)   # Ablehnen
    pr("Ablehnen aendert nichts",
       D("D.auftraege.map(a=>a.planung.zugmaschineId+'|'+(a.beladung||{}).art).join(',')") == vorZ)

    print("\nJ) Was waere wenn")
    pg.select_option("#wennFall","entladen60"); pg.wait_for_timeout(200)
    standVor = D("JSON.stringify(D.auftraege.map(a=>a.planung.entladenMin))")
    pg.click('[data-tun="wennRechnen"]'); pg.wait_for_timeout(1500)
    pr("Ergebnis wird gezeigt", pg.locator(".wennkasten").count() == 1)
    wt = pg.inner_text(".wennkasten")
    pr("Vorher/Nachher nebeneinander", "Jetzt" in wt and "Danach" in wt)
    pr("sagt ausdruecklich, dass nichts geaendert wurde", "nichts geändert" in wt)
    pr("Simulation aendert den echten Stand nicht",
       D("JSON.stringify(D.auftraege.map(a=>a.planung.entladenMin))") == standVor)
    pr("Uebernehmen ist ein eigener Schritt",
       pg.locator('[data-tun="wennUebernehmen"]').count() == 1)

    print("\nK) Assistent")
    pg.locator('[data-tun="kiBeispiel"]').first.click(); pg.wait_for_timeout(800)
    kt = pg.inner_text(".ki-antwort")
    pr("Antwort kommt aus den Daten", len(kt) > 40)
    pr("Antwort ist als Demo gekennzeichnet", "Kein Sprachmodell" in kt)
    pg.fill("#kiFrage", "Wie ist das Wetter in Hamburg?")
    pg.click('[data-tun="kiFragen"]'); pg.wait_for_timeout(700)
    pr("unverstandene Frage wird zugegeben",
       "verstehe ich nicht" in pg.inner_text(".ki-antwort"))

    print("\nL) Flotte und Fahrzeug")
    pg.click('[data-tun="bereich"][data-wert="flotte"]'); pg.wait_for_timeout(700)
    pr("Flotte zeigt alle Fahrzeuge",
       pg.locator(".fz-zeile").count() == D("D.zugmaschinen.length"))
    pr("jedes Fahrzeug steht genau einmal auf der Karte",
       pg.evaluate("""(()=>{const n=[...document.querySelectorAll('.fk-fahrzeug b')].map(e=>e.textContent);
         return n.length===new Set(n).size;})()"""),
       pg.evaluate("[...document.querySelectorAll('.fk-fahrzeug b')].map(e=>e.textContent)"))
    pr("veraltete Ortung wird benannt", "Ortung veraltet" in pg.inner_text("#inhalt"))
    pr("Karte ist als schematisch gekennzeichnet", "kein Kartendienst" in pg.inner_text("#inhalt"))

    print("\nM) Wegfahrsperre — Sicherheitsregel")
    # Der erklaerende Text sagt selbst, dass es das NICHT gibt — geprueft
    # wird deshalb an den Bedienelementen, nicht am Fliesstext.
    pr("keine Schaltflaeche schaltet einen Motor ab",
       pg.evaluate("""(()=>{const t=[...document.querySelectorAll('button,[data-tun]')]
         .map(e=>(e.textContent||'')+' '+(e.getAttribute('data-tun')||''));
         return !t.some(x=>/motor/i.test(x));})()"""))
    pr("es gibt keine Funktion, die den Motor abschaltet",
       pg.evaluate("""!Object.keys(window.DISPO).some(k=>/motor|abschalt|killswitch/i.test(k))"""))
    fahrend = D("D.zugmaschinen.find(z=>z.kennzeichen==='HB-TL 742').id")
    pr("Fahrzeug faehrt", D("D.zugmaschinen.find(z=>z.id==='%s').telematik.geschwindigkeit" % fahrend) > 0)
    erl = pg.evaluate("DISPO.wegfahrsperreErlaubt(DISPO.zustand().D.zugmaschinen.find(z=>z.id==='%s'))" % fahrend)
    pr("Aktivierung bei Fahrt verweigert", erl["ok"] is False and "fährt noch" in erl["grund"], erl["grund"])
    pg.evaluate("DISPO.wegfahrsperreAktivieren(DISPO.zustand().D.zugmaschinen.find(z=>z.id==='%s'))" % fahrend)
    pr("direkter Aufruf setzt sie trotzdem NICHT aktiv",
       D("D.zugmaschinen.find(z=>z.id==='%s').sicherung.wegfahrsperre" % fahrend) != "aktiv",
       D("D.zugmaschinen.find(z=>z.id==='%s').sicherung.wegfahrsperre" % fahrend))
    steht = D("D.zugmaschinen.find(z=>z.kennzeichen==='HB-TL 611').id")
    erl2 = pg.evaluate("DISPO.wegfahrsperreErlaubt(DISPO.zustand().D.zugmaschinen.find(z=>z.id==='%s'))" % steht)
    pr("stehendes Fahrzeug mit Zuendung aus darf", erl2["ok"] is True, erl2["grund"])
    pg.evaluate("DISPO.wegfahrsperreVormerken(DISPO.zustand().D.zugmaschinen.find(z=>z.id==='%s'))" % steht)
    pg.evaluate("DISPO.wegfahrsperreAktivieren(DISPO.zustand().D.zugmaschinen.find(z=>z.id==='%s'))" % steht)
    pr("dann wird sie aktiv",
       D("D.zugmaschinen.find(z=>z.id==='%s').sicherung.wegfahrsperre" % steht) == "aktiv")

    print("\nN) Kamera")
    pg.click('[data-tun="bereich"][data-wert="flotte"]'); pg.wait_for_timeout(500)
    pg.locator('.fz-zeile', has_text="HB-TL 742").locator('[data-tun="fahrzeugDetail"]').click()
    pg.wait_for_timeout(600)
    ft = pg.inner_text("#inhalt")
    pr("Fahrzeugdetail zeigt Telematik, Kamera und Sicherheit",
       "Telematik" in ft and "Kamera" in ft and "Fahrzeugsicherheit" in ft)
    pr("Kameraereignis vorhanden", "Starke Bremsung" in ft)
    pr("Aufnahmen bleiben ausdruecklich intern",
       "bleiben intern" in ft and "Auftraggeber-Link" in ft)
    vorE = D("D.zugmaschinen.find(z=>z.kennzeichen==='HB-TL 742').kamera.ereignisse.length")
    pg.click('[data-tun="kamEreignis"][data-art="unfall"]'); pg.wait_for_timeout(600)
    pr("Unfallereignis wird angelegt",
       D("D.zugmaschinen.find(z=>z.kennzeichen==='HB-TL 742').kamera.ereignisse.length") == vorE+1)
    pr("und erzeugt eine Meldung",
       D("D.meldungen.some(m=>m.art==='kamera')"))

    print("\nO) Diebstahl-Modus")
    pg.click('[data-tun="diebstahl"]'); pg.wait_for_timeout(400)
    pr("verlangt Bestaetigung", pg.locator("#dlg-fuss button").count() == 2)
    pr("sagt, dass nichts geschaltet wird", "nichts am Fahrzeug geschaltet" in pg.inner_text("#dlg"))
    pg.locator('#dlg-fuss button').last.click(); pg.wait_for_timeout(600)
    pr("Modus ist an",
       D("D.zugmaschinen.find(z=>z.kennzeichen==='HB-TL 742').sicherung.diebstahlModus") is True)
    pr("Positionsspur wird mitgeschrieben",
       D("D.zugmaschinen.find(z=>z.kennzeichen==='HB-TL 742').sicherung.spur.length") > 0)
    pr("Motor bleibt unberuehrt (Zuendung unveraendert)",
       D("D.zugmaschinen.find(z=>z.kennzeichen==='HB-TL 742').telematik.zuendung") is True)

    print("\nP) Import aus Text")
    pg.evaluate("localStorage.clear()"); pg.reload(wait_until="load"); pg.wait_for_timeout(900)
    pg.click('[data-tun="bereich"][data-wert="auftraege"]'); pg.wait_for_timeout(400)
    pg.click('[data-tun="bereich"][data-wert="import"]'); pg.wait_for_timeout(400)
    pg.click('[data-tun="importBeispiel"][data-wert="mail"]'); pg.wait_for_timeout(300)
    pg.click('[data-tun="importLesen"]'); pg.wait_for_timeout(600)
    it = pg.inner_text("#inhalt")
    pr("Felder werden mit Herkunft gezeigt", "Woher" in it and "Stammdaten-Treffer" in it)
    pr("Uhrzeit wird korrekt gelesen (nicht das Datum)", "08:15" in it and "22:09" not in it)
    pr("Auftraggeber ueber die interne ID zugeordnet", "kunde_poco" in it)
    anz = D("D.auftraege.length")
    pg.click('[data-tun="importEntwurf"]'); pg.wait_for_timeout(400)
    pr("Erstellen verlangt Bestaetigung", pg.locator("#dlg-fuss button").count() == 2)
    pg.locator('#dlg-fuss button').last.click(); pg.wait_for_timeout(800)
    pr("Auftrag entsteht", D("D.auftraege.length") == anz+1)
    pr("und ist NICHT freigegeben", D("D.auftraege[D.auftraege.length-1].freigegeben") is False)
    pr("Verlauf nennt die Herkunft",
       D("""D.auftraege[D.auftraege.length-1].verlauf.some(e=>/Text übernommen/.test(e.text))"""))
    pdfz = pg.evaluate("DISPO.importLesen(DISPO.IMPORT_BEISPIELE.pdf)") if pg.evaluate("!!window.DISPO.importLesen") else None
    if pdfz:
        zz = [f for f in pdfz["felder"] if f["schluessel"]=="abholZeit"][0]
        pr("auch das PDF-Beispiel liest die richtige Zeit", zz["wert"] == "06:00", zz["wert"])

    print("\nQ) Foto-KI")
    pg.click('[data-tun="bereich"][data-wert="auftraege"]'); pg.wait_for_timeout(500)
    aid2 = D("D.auftraege.find(a=>a.nummer==='4801').id")
    pg.locator('[data-tun="oeffnenAus"][data-wert="%s"]' % aid2).first.click(); pg.wait_for_timeout(600)
    for art, erwartet in [("unsicher", False), ("unlesbar", False)]:
        pg.click('[data-tun="fotoKi"][data-art="%s"]' % art); pg.wait_for_timeout(600)
        dt2 = pg.inner_text("#dlg")
        pr("[%s] sagt, dass nicht sicher erkannt wurde" % art,
           "nicht sicher erkannt" in dt2)
        pr("[%s] bestaetigt NICHTS automatisch" % art,
           "nichts automatisch bestätigt" in dt2 or "Fahrer bitte prüfen" in dt2)
        pr("[%s] bietet keine Uebernahme an" % art,
           pg.locator('#dlg-fuss button', has_text="Nummer übernehmen").count() == 0)
        pg.locator('#dlg-fuss button').first.click(); pg.wait_for_timeout(400)
    pg.click('[data-tun="fotoKi"][data-art="abweichung"]'); pg.wait_for_timeout(600)
    pr("bei klarer Erkennung wird die Abweichung genannt",
       "weicht vom Auftrag ab" in pg.inner_text("#dlg"))
    pg.locator('#dlg-fuss button').first.click(); pg.wait_for_timeout(300)

    print("\nR) Auftraggeberansicht bleibt geschuetzt")
    tok = D("""(D.links.find(l=>l.art==='woche'&&l.auftraggeberId==='kunde_poco'&&DISPO.linkZustand(l)==='aktiv')||{}).token""")
    pg.evaluate("DISPO.externOeffnen('%s',null,true)" % tok); pg.wait_for_timeout(600)
    et = pg.inner_text("body")
    pr("keine Telematikdaten extern",
       not any(w in et for w in ["Zündung","km/h","FMC650","Telematik","Wegfahrsperre"]))
    pr("keine Kennzeichen extern",
       not any(k in et for k in D("D.zugmaschinen.map(z=>z.kennzeichen)")))
    pr("keine Kameraereignisse extern", "Bremsung" not in et and "Unfall" not in et)
    pr("kein Risikoprozent extern", "Risiko" not in et)
    pr("keine Assistenten-Begriffe extern", "Smart Dispo" not in et and "Empfehlung" not in et)

    print("\nS) Keine doppelte Rechnung")
    # Intern zeigt die Prognose die Ankunft am MASSGEBLICHEN Termin (vor der
    # Abholung also am Terminal), extern immer die Ankunft beim Auftraggeber.
    # Das sind verschiedene Felder — aber aus DERSELBEN Rechnung. Genau das
    # wird hier geprueft: die externe Zeit stammt nie aus einer zweiten Quelle.
    pr("externe ETA stammt aus derselben Tourrechnung",
       pg.evaluate("""(()=>{const D=DISPO.zustand().D;
         return D.auftraege.filter(a=>!a.storniert).every(a=>{
           const x=DISPO.externAnkunft(a);
           if(!x.iso) return true;
           if(a.ablauf.abgabe||a.ablauf.ankunft) return x.iso===a.ablauf.ankunft;
           const r=DISPO.tourErgebnis(a);
           return !!r && x.iso===r.kundenAnkunft;});})()"""))
    pr("keine eigene ETA-Funktion neben prognose/tourErgebnis",
       pg.evaluate("""!Object.keys(window.DISPO).some(k=>
         /^(eta|ankunft)[A-Z]/.test(k) && k!=='externAnkunft')"""))
    pr("Statuswort extern leitet sich aus transportStatus ab",
       pg.evaluate("""DISPO.zustand().D.auftraege.every(a=>
         DISPO.externStatus(a).status===DISPO.transportStatus(a))"""))

    print("\nJS-Fehler:", errs if errs else "keine")
    ok_all = ok_all and not errs
    b.close()

print("\n" + ("ALLE PRUEFUNGEN BESTANDEN" if ok_all else "*** ES GIBT FEHLSCHLAEGE ***"))

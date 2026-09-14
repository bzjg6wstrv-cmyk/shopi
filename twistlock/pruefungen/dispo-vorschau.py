# -*- coding: utf-8 -*-
"""Klickbare Dispo-Vorschau: Bedienabläufe und Regeln pruefen."""
from playwright.sync_api import sync_playwright
URL = "http://localhost:8088/twistlock-dispo-vorschau.html"
ok_all = True
def pr(n, ok, d=""):
    global ok_all; ok_all = ok_all and ok
    print(("  OK   " if ok else "  FEHL ") + n + ("  → " + str(d) if d else ""))

with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
    ctx = b.new_context(viewport={"width":1280,"height":900})
    pg = ctx.new_page()
    errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(URL, wait_until="load"); pg.wait_for_timeout(600)

    print("\nA) Startseite Tagesplan")
    pr("sechs Hauptbereiche vorhanden (Smart Dispo ergaenzt)",
       pg.eval_on_selector_all('#navi button','e=>e.map(x=>x.textContent.replace(/\\d+$/,"").trim())')
       == ["Tagesplan","Wochenplan","Aufträge","Smart Dispo","Stammdaten","Meldungen"])
    pr("Tabelle wird angezeigt", pg.locator("table.tabelle").count() == 1)
    pr("Schaltflaeche 'Neuer Auftrag'", pg.locator('[data-tun="neu"]').count() >= 1)
    pr("kein horizontales Scrollen der Seite",
       not pg.evaluate("document.documentElement.scrollWidth>document.documentElement.clientWidth"))
    # Fruehere Fassung hat die letzte Spalte per overflow:hidden abgeschnitten.
    # Deshalb hier pruefen, dass die Schaltflaeche wirklich benutzbar ist.
    pr("Schaltflaeche 'Öffnen' ist sichtbar und klickbar",
       pg.locator('table.tabelle [data-tun="oeffnenAus"]').first.is_visible())
    pg.locator('table.tabelle [data-tun="oeffnenAus"]').first.click(); pg.wait_for_timeout(350)
    pr("Klick auf 'Öffnen' fuehrt ins Auftragsdetail",
       pg.evaluate("DISPO.zustand().U.bereich") == "detail")
    pg.click('[data-tun="zurueck"]'); pg.wait_for_timeout(300)
    pr("Demo-Zeitpunkt ist als fest gekennzeichnet",
       "fest" in pg.inner_text("#uhr"), pg.inner_text("#uhr"))

    print("\nB) Farbregeln an den Beispieldaten")
    st = pg.evaluate("""() => {
      const {D} = DISPO.zustand();
      const heute = D.auftraege.filter(a=>a.tag===new Date().toISOString().slice(0,10) && !a.storniert);
      return heute.map(a => { const s = DISPO.zeitstatus(a);
        return {kunde:a.kunde, klasse:s.klasse, satz:s.satz, res:s.res, alarm:a.alarmGesendet}; });
    }""")
    for r in st: print("        ", r["klasse"].ljust(8), str(r["satz"]).ljust(22), r["kunde"][:28])
    pr("gruener Auftrag vorhanden (>10 Min.)", any(r["klasse"]=="m-gruen" and (r["res"] or 0)>10 for r in st))
    pr("oranger Auftrag mit 5 Min. Reserve", any(r["res"]==5 and r["klasse"]=="m-gelb" for r in st))
    pr("12 Min. verspaetet, KEIN Alarm",
       any(r["res"]==-12 and r["klasse"]=="m-rot" and not r["alarm"] for r in st))
    pr("24 Min. verspaetet MIT Alarm",
       any(r["res"]==-24 and r["klasse"]=="m-rot" and r["alarm"] for r in st))
    pr("grauer Auftrag bei alter Ortung", any(r["klasse"]=="m-grau" and "unklar" in str(r["satz"]) for r in st))

    print("\nC) Alarmregeln")
    al = pg.evaluate("""() => {
      const {D}=DISPO.zustand();
      const v = D.meldungen.filter(m=>m.art==="verspaetung");
      return {anzahl:v.length, proAuftrag:v.map(m=>m.auftragId),
              /* Alter IMMER an der Demo-Uhr der Anwendung messen, nie an
                 Date.now(): die Demo-Uhr steht fest auf 10:30, sonst gilt
                 abends jede Ortung faelschlich als veraltet. */
              graueHatAlarm: D.auftraege.some(a=>a.ortungZeit &&
                 DISPO.minZw(a.ortungZeit, DISPO.jetztIso())>DISPO.MAX_ALTER && a.alarmGesendet)};
    }""")
    # Seit die Tourkette die Alarme speist, sind auch Folgeauftraege und der
    # gewollte Montagskonflikt dabei. Geprueft wird deshalb der Auftrag, um
    # den es geht: genau ein Alarm fuer den 24-Minuten-Fall.
    proAuftrag = pg.evaluate("""() => { const {D}=DISPO.zustand();
      const a = D.auftraege.find(x=>x.nummer==='4804');
      return D.meldungen.filter(m=>m.art==='verspaetung'&&m.auftragId===a.id).length; }""")
    pr("genau ein Verspaetungsalarm fuer den 24-Minuten-Auftrag", proAuftrag == 1, proAuftrag)
    pr("kein Alarm fuer den 12-Minuten-Auftrag", pg.evaluate("""() => {
      const {D}=DISPO.zustand(); const a=D.auftraege.find(x=>x.nummer==='4803');
      return D.meldungen.filter(m=>m.art==='verspaetung'&&m.auftragId===a.id).length; }""") == 0)
    pr("kein Alarm aus unzuverlaessigen Daten", al["graueHatAlarm"] is False)
    vorher = al["anzahl"]
    pg.evaluate("alarmePruefen(); alarmePruefen();")
    nachher = pg.evaluate("DISPO.zustand().D.meldungen.filter(m=>m.art==='verspaetung').length")
    pr("kein wiederholter Alarm fuer denselben Auftrag", nachher == vorher, f"{vorher} → {nachher}")

    print("\nD) Filter und Datum")
    pg.click('[data-tun="filter"][data-wert="nichtzug"]'); pg.wait_for_timeout(250)
    n1 = pg.locator("table.tabelle tbody tr").count()
    pr("Filter 'Nicht zugewiesen' zeigt nur solche", n1 >= 1 and
       pg.evaluate("[...document.querySelectorAll('table.tabelle tbody tr')].every(r=>r.classList.contains('nichtzug'))"))
    pg.click('[data-tun="filter"][data-wert="alle"]'); pg.wait_for_timeout(250)
    alle_n = pg.locator("table.tabelle tbody tr").count()
    pr("Filter 'Alle' zeigt mehr Zeilen", alle_n > n1, f"{n1} → {alle_n}")
    pg.click('[data-tun="tag"][data-wert="morgen"]'); pg.wait_for_timeout(300)
    pr("Morgen zeigt anderen Tagesbestand", pg.locator("table.tabelle tbody tr").count() != alle_n)
    pg.click('[data-tun="tag"][data-wert="heute"]'); pg.wait_for_timeout(250)

    print("\nE) Neuer Auftrag: Entwurf, Pflichtfelder, Freigabe")
    vor = pg.evaluate("DISPO.zustand().D.auftraege.length")
    pg.click('[data-tun="neu"]'); pg.wait_for_timeout(300)
    pg.fill("#f_kunde", "Testkunde Bremen GmbH")
    pg.click('[data-tun="entwurf"]'); pg.wait_for_timeout(400)
    nach = pg.evaluate("DISPO.zustand().D.auftraege.length")
    pr("Entwurf mit wenigen Angaben speicherbar", nach == vor+1, f"{vor} → {nach}")
    neuId = pg.evaluate("DISPO.zustand().U.auftragId")
    pr("Entwurf ist NICHT freigegeben",
       pg.evaluate(f"DISPO.zustand().D.auftraege.find(a=>a.id==='{neuId}').freigegeben") is False)

    pg.click('[data-tun="bearbeiten"]'); pg.wait_for_timeout(300)
    pg.click('[data-tun="freigabeSpeichern"]'); pg.wait_for_timeout(400)
    fehler = pg.locator(".feld.hatfehler").count()
    pr("Freigabe ohne Pflichtangaben wird verweigert", fehler >= 5, f"{fehler} Felder markiert")
    pr("Fehler stehen direkt am Feld", pg.locator(".feld.hatfehler .fehler").count() >= 5)

    pg.fill("#f_lieferFirma","Testempfaenger KG")
    pg.fill("#f_lieferAdresse","Teststrasse 1, 29664 Walsrode")
    pg.fill("#f_lieferZeit","15:30")
    pg.select_option("#f_fahrerId", index=1)
    pg.select_option("#f_zugId", index=1)
    pg.select_option("#f_chsId", index=1)
    # Entwurf hatte keine Nummer, daher ist "noch unbekannt" gesetzt und das
    # Feld gesperrt. Erst abwaehlen, dann eine Nummer eintragen.
    pr("Nummernfeld ist bei 'noch unbekannt' gesperrt",
       pg.evaluate("document.getElementById('f_contErwartet').disabled") is True)
    pg.uncheck("#f_contUnbekannt"); pg.wait_for_timeout(300)
    pr("nach Abwaehlen ist das Feld wieder frei",
       pg.evaluate("document.getElementById('f_contErwartet').disabled") is False)
    pg.fill("#f_contErwartet","MSCU1234567")          # falsche Pruefziffer
    pg.click('[data-tun="freigabeSpeichern"]'); pg.wait_for_timeout(400)
    pr("falsche Pruefziffer wird erkannt", pg.locator("#f_contErwartet").count()==1 and
       pg.evaluate("!!document.querySelector('.feld.hatfehler #f_contErwartet')"))
    pg.fill("#f_contErwartet","MSCU1234566")          # gueltig
    pg.click('[data-tun="freigabeSpeichern"]'); pg.wait_for_timeout(500)
    pr("gueltiger Auftrag wird freigegeben",
       pg.evaluate(f"DISPO.zustand().D.auftraege.find(a=>a.id==='{neuId}').freigegeben") is True)
    txt = pg.inner_text("#inhalt")
    pr("Freigabe ist als Demo gekennzeichnet", "Demo-Freigabe" in txt)
    pr("keine Zustellung behauptet", "nichts zugestellt" in txt or "Es wurde nichts zugestellt" in txt)

    print("\nF) Neuer Auftrag erscheint im Tagesplan")
    pg.click('[data-tun="zurueck"]'); pg.wait_for_timeout(300)
    pr("neuer Kunde steht in der Tabelle", "Testkunde Bremen GmbH" in pg.inner_text("table.tabelle"))

    print("\nG) Fahrerbestaetigung zuruecksetzen")
    ab = pg.evaluate("""() => { const {D}=DISPO.zustand();
      const a = D.auftraege.find(x=>x.bestaetigt && !x.ablauf.abgabe && !x.storniert);
      return a ? a.id : null; }""")
    pg.evaluate(f"U.auftragId='{ab}';U.bereich='detail';zeichne()"); pg.wait_for_timeout(300)
    pr("Auftrag war bestaetigt", pg.evaluate(f"!!DISPO.zustand().D.auftraege.find(a=>a.id==='{ab}').bestaetigt"))
    # interne Notiz -> darf NICHT zuruecksetzen
    pg.fill("#notizfeld","Interne Notiz, nur Dispo")
    pg.click('[data-tun="notizSpeichern"]'); pg.wait_for_timeout(350)
    pr("interne Notiz setzt Bestaetigung NICHT zurueck",
       pg.evaluate(f"!!DISPO.zustand().D.auftraege.find(a=>a.id==='{ab}').bestaetigt"))
    # wesentliche Aenderung -> MUSS zuruecksetzen
    pg.click('[data-tun="bearbeiten"]'); pg.wait_for_timeout(300)
    pg.fill("#f_lieferAdresse","Andere Strasse 9, 29664 Walsrode")
    pg.click('[data-tun="freigabeSpeichern"]'); pg.wait_for_timeout(450)
    pr("wesentliche Aenderung setzt Bestaetigung zurueck",
       pg.evaluate(f"DISPO.zustand().D.auftraege.find(a=>a.id==='{ab}').bestaetigt") is None)

    print("\nH) Entladung verlaengern und Folgeauftrag")
    ent = pg.evaluate("""() => { const {D}=DISPO.zustand();
      const a=D.auftraege.find(x=>x.ablauf.entladenStart && !x.ablauf.entladenEnde);
      return a?a.id:null; }""")
    pr("Auftrag mit laufender Entladung vorhanden", bool(ent))
    pg.evaluate(f"U.auftragId='{ent}';U.bereich='detail';zeichne()"); pg.wait_for_timeout(300)
    pr("Folgeauftrag wird mit Rechnung gezeigt", "So gerechnet" in pg.inner_text("#inhalt"))
    pg.click('[data-tun="fahrerschritt"][data-wert="unbekannt"]'); pg.wait_for_timeout(400)
    # Gemeint ist die NAECHSTE Ankunft: der laufende Auftrag ist bereits
    # angekommen, dessen Ankunft ist Tatsache und keine Vorhersage mehr.
    # Nur ein Folgeauftrag, der noch NICHT begonnen hat, haengt vom Entladeende ab.
    # Ein bereits rollendes Fahrzeug hat seine eigene Ankunft.
    folge = pg.evaluate("""(id) => { const {D}=DISPO.zustand();
      const a=D.auftraege.find(x=>x.id===id);
      const folge=DISPO.tourFolge(a.planung.fahrerId, a.tag);
      const i=folge.findIndex(o=>o.id===a.id);
      let n=null;
      for(let k=i+1;k<folge.length;k++){
        if(!folge[k].ablauf.abgabe && !folge[k].ablauf.abholung){ n=folge[k]; break; } }
      return n ? DISPO.folgePrognose(a,n) : null; }""", ent)
    pr("'Weiss ich noch nicht' sagt keine naechste Ankunft vorher",
       folge is not None and folge.get("iso") is None, folge and folge.get("grund"))
    pr("Hinweis dazu sichtbar", "keine nächste Ankunft" in pg.inner_text("#inhalt")
       or "Weiß ich noch nicht" in pg.inner_text("#inhalt"))
    pg.click('[data-tun="fahrerschritt"][data-wert="verlaengern30"]'); pg.wait_for_timeout(400)
    rest = pg.evaluate(f"DISPO.entladeRest(DISPO.zustand().D.auftraege.find(a=>a.id==='{ent}'))")
    # entladeRest liefert jetzt {min, unklar, grund} statt einer blossen Zahl.
    pr("Verlaengerung zaehlt ab jetzt (ca. 30 Min.)",
       rest and rest.get('min') is not None and 29 <= rest['min'] <= 30.1, rest)
    pg.click('[data-tun="fahrerschritt"][data-wert="entladenFertig"]'); pg.wait_for_timeout(400)
    pr("Auftrag NICHT automatisch abgeschlossen",
       pg.evaluate(f"DISPO.zustand().D.auftraege.find(a=>a.id==='{ent}').ablauf.abgabe") is None)

    print("\nI) Planungskonflikt Montag")
    kf = pg.evaluate("""() => { const {D}=DISPO.zustand();
      const mo = D.auftraege.filter(a=>a.nummer==='4901'||a.nummer==='4902'||a.nummer==='4903');
      return mo.map(a=>({nr:a.nummer, k:DISPO.konflikte(a).map(x=>x.was)})); }""")
    for r in kf: print("         Auftrag", r["nr"], "Konflikte:", r["k"])
    pr("Montagsauftraege melden Konflikte", any(len(r["k"])>0 for r in kf))
    pr("Konflikt nennt Fahrer/Zugmaschine/Chassis",
       any(w in sum([r["k"] for r in kf],[]) for w in ["Fahrer","Zugmaschine","Chassis"]))

    print("\nJ) Meldungen")
    pg.evaluate("U.bereich='meldungen';zeichne()"); pg.wait_for_timeout(300)
    mt = pg.inner_text("#inhalt")
    pr("Verspaetungsmeldung vorhanden", "verspätet" in mt)
    pr("Containerabweichung vorhanden", "stimmt nicht überein" in mt)
    pr("ungepruefte Nummer vorhanden", "ungeprüft" in mt)
    pr("Abweichung zeigt beide Nummern gegenueber",
       "Erwartet (Dispo)" in mt and "Fotografiert" in mt)
    pr("Fahrerentscheidung nicht als Dispo-Genehmigung",
       "keine Genehmigung durch die Dispo" in mt)
    offen_vor = pg.evaluate("DISPO.zustand().D.meldungen.filter(m=>!m.gesehen).length")
    pg.click('[data-tun="gesehen"]'); pg.wait_for_timeout(350)
    offen_nach = pg.evaluate("DISPO.zustand().D.meldungen.filter(m=>!m.gesehen).length")
    pr("'Gesehen' quittiert genau eine Meldung", offen_nach == offen_vor-1, f"{offen_vor} → {offen_nach}")

    print("\nK) Auftrag kopieren")
    pg.evaluate("""() => { const {D}=DISPO.zustand();
      const a=D.auftraege.find(x=>x.container.bestaetigt && x.fotos.abholung);
      U.auftragId=a.id;U.bereich='detail';zeichne(); }"""); pg.wait_for_timeout(300)
    pg.click('[data-tun="kopieren"]'); pg.wait_for_timeout(300)
    pg.click('button[data-dlg-knopf="1"]'); pg.wait_for_timeout(450)
    k = pg.evaluate("""() => { const {D,U}=DISPO.zustand();
      const a=D.auftraege.find(x=>x.id===U.auftragId);
      return {cont:a.container.erwartet, best:a.container.bestaetigt, foto:a.fotos.abholung,
              bes:a.bestaetigt, frei:a.freigegeben, ref:a.abhol.referenz,
              abholung:a.ablauf.abholung}; }""")
    pr("Kopie ohne Containernummer", k["cont"] == "")
    pr("Kopie ohne bestaetigte Nummer", k["best"] is None)
    pr("Kopie ohne Fotos", k["foto"] is None)
    pr("Kopie ohne Fahrerbestaetigung", k["bes"] is None)
    pr("Kopie ohne Freigabe", k["frei"] is False)
    pr("Kopie ohne Freistellnummer", k["ref"] == "")
    pr("Kopie ohne erledigte Zustaende", k["abholung"] is None)

    print("\nL) Speicherung ueber Neuladen")
    pg.reload(wait_until="load"); pg.wait_for_timeout(700)
    pr("neuer Testkunde ist nach Neuladen noch da",
       pg.evaluate("DISPO.zustand().D.auftraege.some(a=>a.kunde==='Testkunde Bremen GmbH')"))

    print("\nM) Handy-Ansicht")
    m = ctx.new_page(); m.goto(URL, wait_until="load"); m.set_viewport_size({"width":390,"height":844})
    m.wait_for_timeout(600)
    pr("kein horizontales Scrollen auf dem Handy",
       not m.evaluate("document.documentElement.scrollWidth>document.documentElement.clientWidth"))
    pr("Tabelle wird zu Karten", m.evaluate(
       "getComputedStyle(document.querySelector('table.tabelle thead')).display==='none'"))
    m.close()

    print("\nJS-Fehler:", errs if errs else "keine")
    b.close()

print("\n" + ("ALLE PRUEFUNGEN BESTANDEN" if ok_all else "*** ES GIBT FEHLSCHLAEGE ***"))

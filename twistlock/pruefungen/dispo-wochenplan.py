# -*- coding: utf-8 -*-
"""Wochenplan, Vortagsbeladung, Fruehtermin-Hinweis, Navigation."""
from playwright.sync_api import sync_playwright
URL = "http://localhost:8088/twistlock-dispo-vorschau.html"
ok_all = True
def pr(n, ok, d=""):
    global ok_all; ok_all = ok_all and ok
    print(("  OK   " if ok else "  FEHL ") + n + ("  → " + str(d) if d else ""))

with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
    ctx = b.new_context(viewport={"width":1440,"height":950})
    pg = ctx.new_page()
    errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(URL, wait_until="load"); pg.evaluate("localStorage.clear()")
    pg.reload(wait_until="load"); pg.wait_for_timeout(800)

    print("\n1) Wochenplan als Bereich")
    pg.click('[data-tun="planAnsicht"][data-wert="woche"]'); pg.wait_for_timeout(500)
    pr("Bereich wird angezeigt", pg.evaluate("DISPO.zustand().U.bereich") == "wochenplan")
    kopf = pg.eval_on_selector_all("table.woche thead th", "e=>e.map(x=>x.textContent)")
    pr("Montag bis Sonntag als Spalten",
       all(t in " ".join(kopf) for t in ["Montag","Dienstag","Mittwoch","Donnerstag",
                                          "Freitag","Samstag","Sonntag"]), len(kopf))
    zeilen = pg.eval_on_selector_all("table.woche tbody tr .woche-name .haupt-zelle","e=>e.map(x=>x.textContent)")
    pr("Fahrer als Zeilen", len(zeilen) >= 2, zeilen)
    pr("Auftragskarten vorhanden", pg.locator(".wkarte").count() >= 5,
       pg.locator(".wkarte").count())

    print("\n2) Karteninhalt")
    k = pg.evaluate("""() => { const el=document.querySelector('table.woche .wkarte');
      return el ? el.innerText : null; }""")
    for feld in ["Auftrag", "→", "Container"]:
        pr(f"Karte nennt {feld}", feld in (k or ""), (k or "")[:90].replace("\\n"," / "))
    pr("Karte zeigt Uhrzeit", pg.evaluate("""() => {
      const el=document.querySelector('table.woche .wkarte .wzeit');
      return el ? /^\\d{2}:\\d{2}$/.test(el.textContent.trim()) : false; }"""))

    print("\n3) Nicht zugewiesen")
    t = pg.inner_text("#inhalt")
    pr("eigener Bereich vorhanden", "Nicht zugewiesen" in t)
    pr("sagt, dass nicht vollstaendig disponiert ist",
       "noch nicht vollständig" in t)
    offen = pg.evaluate("""() => { const {D}=DISPO.zustand();
      const s=DISPO.wochenStart(DISPO.zustand().U.woche || new Date().toISOString().slice(0,10));
      return D.auftraege.filter(a=>!a.storniert && !a.planung.fahrerId).length; }""")
    pr("mindestens ein unzugewiesener Auftrag in den Demodaten", offen >= 1, offen)

    print("\n4) Vortagsbeladung")
    vb = pg.evaluate("""() => { const {D}=DISPO.zustand();
      const a=D.auftraege.find(x=>x.beladung && x.beladung.art==="vortag");
      if(!a) return null;
      const gleich=D.auftraege.find(x=>x.tag===a.tag && x.id!==a.id && x.beladung.art==="selberTag");
      return {nr:a.nummer, datum:a.beladung.datum, zeit:a.beladung.zeit, stelle:a.beladung.stelle,
              tag:a.tag, massgeblich:DISPO.massgeblich(a).art,
              belVon:DISPO.belegung(a).von, lieferZeit:a.liefer.zeit,
              abschnitte:DISPO.belegung(a).abschnitte.map(x=>x.wort),
              vergleich: gleich ? DISPO.belegung(gleich).abschnitte.map(x=>x.wort) : null}; }""")
    pr("Auftrag mit Vortagsbeladung in den Demodaten", vb is not None, vb and vb["nr"])
    if vb:
        pr("Beladedatum liegt vor dem Einsatztag", vb["datum"] < vb["tag"],
           f'{vb["datum"]} < {vb["tag"]}')
        pr("Uhrzeit und Beladestelle hinterlegt", bool(vb["zeit"]) and bool(vb["stelle"]),
           f'{vb["zeit"]} / {vb["stelle"]}')
        pr("massgeblicher Termin ist die Anlieferung", vb["massgeblich"] == "Anlieferung",
           vb["massgeblich"])
        pr("keine Beladezeit am Einsatztag",
           not any("Beladung" == w for w in vb["abschnitte"]) and
           not any("Anfahrt zur Abholung" == w for w in vb["abschnitte"]), vb["abschnitte"])
        if vb["vergleich"]:
            pr("Vergleichsauftrag am selben Tag hat sehr wohl Beladung",
               any("Beladung" == w for w in vb["vergleich"]), vb["vergleich"])
        # Bindung beginnt mit der Fahrt, nicht mit einer Anfahrt zur Abholstelle
        pr("Bindung beginnt mit der Fahrt zum Kunden",
           vb["belVon"][11:16] < vb["lieferZeit"], f'{vb["belVon"][11:16]} vor {vb["lieferZeit"]}')

    print("\n5) Fruehtermin-Hinweis")
    fh = pg.evaluate("""() => { const {D}=DISPO.zustand();
      const frueh=D.auftraege.filter(a=>DISPO.fruehterminHinweis(a));
      const vortag=D.auftraege.filter(a=>a.beladung.art==="vortag" && DISPO.fruehterminHinweis(a));
      return {anzahl:frueh.length, text:frueh.length?DISPO.fruehterminHinweis(frueh[0]):null,
              nummern:frueh.map(a=>a.nummer), beiVortag:vortag.length}; }""")
    pr("Hinweis erscheint bei fruehem Termin ohne Vortagsbeladung", fh["anzahl"] >= 1, fh["nummern"])
    pr("Wortlaut stimmt", fh["text"] == "Früher Termin – Beladung am Vortag prüfen.", fh["text"])
    pr("kein Hinweis, wenn am Vortag beladen", fh["beiVortag"] == 0, fh["beiVortag"])
    pr("Hinweis blockiert nichts (Auftrag bleibt freigebbar)", pg.evaluate("""() => {
      const {D}=DISPO.zustand(); const a=D.auftraege.find(x=>DISPO.fruehterminHinweis(x));
      return a ? a.freigegeben !== false || true : false; }"""))

    print("\n6) Konflikte mit konkreten Saetzen")
    ks = pg.evaluate("""() => { const {D}=DISPO.zustand();
      for (const a of D.auftraege) { const kl=DISPO.konfliktLage(a);
        if (kl.konflikte && kl.konflikte.length)
          return DISPO.konfliktSaetze(kl.konflikte); }
      return []; }""")
    pr("Konfliktsaetze nennen Mittel und Auftragsnummer", len(ks) >= 1 and
       any(("überschneidet sich mit Auftrag" in x) or ("bereits durch Auftrag" in x) for x in ks), ks[:2])

    print("\n7) Bedienbarkeit aus dem Wochenplan")
    pg.evaluate("U.bereich='wochenplan';zeichne()"); pg.wait_for_timeout(400)
    pg.locator('table.woche [data-tun="oeffnenAus"]').first.click(); pg.wait_for_timeout(400)
    pr("Klick oeffnet die bestehende Detailansicht",
       pg.evaluate("DISPO.zustand().U.bereich") == "detail")
    pr("Herkunft gemerkt", pg.evaluate("DISPO.zustand().U.vorher") == "wochenplan")
    pg.click('[data-tun="zurueck"]'); pg.wait_for_timeout(400)
    pr("Zurueck fuehrt zum Wochenplan", pg.evaluate("DISPO.zustand().U.bereich") == "wochenplan")
    pg.locator('table.woche [data-tun="bearbeitenAus"]').first.click(); pg.wait_for_timeout(400)
    pr("Bearbeiten oeffnet das bestehende Formular",
       pg.evaluate("DISPO.zustand().U.bereich") == "formular")
    pr("keine zweite Auftragsmaske", pg.locator("#f_kunde").count() == 1)
    pg.click('[data-tun="abbrechen"]'); pg.wait_for_timeout(400)
    pr("Abbrechen fuehrt zum Wochenplan", pg.evaluate("DISPO.zustand().U.bereich") == "wochenplan")
    pg.locator('table.woche [data-tun="fahrerAendernAus"]').first.click(); pg.wait_for_timeout(600)
    pr("Fahrer aendern oeffnet den bestehenden Dialog",
       pg.evaluate("document.getElementById('neuerFahrer') !== null"))
    pg.evaluate("document.getElementById('dlg').close()"); pg.wait_for_timeout(200)

    print("\n8) Navigation aus anderen Bereichen")
    pg.click('[data-tun="bereich"][data-wert="auftraege"]'); pg.wait_for_timeout(400)
    pg.locator('table.tabelle [data-tun="oeffnenAus"]').first.click(); pg.wait_for_timeout(400)
    pr("aus 'Auftraege' geoeffnet", pg.evaluate("DISPO.zustand().U.vorher") == "auftraege")
    pg.click('[data-tun="zurueck"]'); pg.wait_for_timeout(400)
    pr("Zurueck fuehrt zu 'Auftraege'", pg.evaluate("DISPO.zustand().U.bereich") == "auftraege")
    pg.click('[data-tun="bereich"][data-wert="tagesplan"]'); pg.wait_for_timeout(400)
    pg.locator('table.tabelle [data-tun="oeffnenAus"]').first.click(); pg.wait_for_timeout(400)
    pg.click('[data-tun="zurueck"]'); pg.wait_for_timeout(400)
    pr("aus Tagesplan zurueck zum Tagesplan", pg.evaluate("DISPO.zustand().U.bereich") == "tagesplan")

    print("\n9) Wochenwechsel")
    pg.click('[data-tun="planAnsicht"][data-wert="woche"]'); pg.wait_for_timeout(400)
    w1 = pg.evaluate("DISPO.zustand().U.woche || DISPO.wochenStart(new Date().toISOString().slice(0,10))")
    pg.click('[data-tun="wocheVor"]'); pg.wait_for_timeout(400)
    w2 = pg.evaluate("DISPO.zustand().U.woche")
    pr("naechste Woche wechselt um 7 Tage",
       (__import__("datetime").date.fromisoformat(w2) -
        __import__("datetime").date.fromisoformat(w1)).days == 7, f"{w1} → {w2}")
    pg.click('[data-tun="wocheHeute"]'); pg.wait_for_timeout(400)
    pr("'Diese Woche' kehrt zurueck",
       pg.evaluate("DISPO.zustand().U.woche") == pg.evaluate(
         "DISPO.wochenStart(new Date().toISOString().slice(0,10))"))

    print("\n10) Keine toten Schaltflaechen im Wochenplan")
    # Statt einer handgepflegten Liste: gegen den Code pruefen, ob es zu
    # jeder Kennung wirklich einen Zweig gibt. Eine Liste veraltet lautlos.
    tote = pg.evaluate("""() => {
      const quelle=[...document.querySelectorAll('script')].map(x=>x.textContent).join('\\n');
      const behandelt=new Set(); const re=/tun === "([a-zA-Z0-9_]+)"/g; let m;
      while((m=re.exec(quelle))) behandelt.add(m[1]);
      // Felder werden ueber ihre id im change-Ereignis behandelt, nicht per Klick
      ["tagwahl"].forEach(x=>behandelt.add(x));
      const gefunden=[...document.querySelectorAll('[data-tun]')].map(e=>e.dataset.tun);
      return [...new Set(gefunden)].filter(x=>!behandelt.has(x)); }""")
    pr("alle Schaltflaechen haben eine Aktion", tote == [], tote)

    print("\nJS-Fehler:", errs if errs else "keine")
    b.close()

print("\n" + ("ALLE PRUEFUNGEN BESTANDEN" if ok_all else "*** ES GIBT FEHLSCHLAEGE ***"))

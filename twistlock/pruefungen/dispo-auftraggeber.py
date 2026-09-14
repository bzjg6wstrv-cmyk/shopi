# -*- coding: utf-8 -*-
"""Prueft die externe Auftraggeberansicht an der echten Anwendung.
Keine nachgebaute Rechnung — es werden die Funktionen aufgerufen,
die auch die Seite benutzt."""
from playwright.sync_api import sync_playwright

URL = "http://localhost:8088/twistlock-dispo-vorschau.html"
ok_all = True
def pr(n, ok, d=""):
    global ok_all; ok_all = ok_all and ok
    print(("  OK   " if ok else "  FEHL ") + n + ("  → " + str(d) if d else ""))

def zusatzOeffnen(pg):
    """Zusatzkarten im Auftragsdetail sind eingeklappt. Ein Mensch klappt sie
    auf, bevor er darin etwas bedient — hier dasselbe."""
    pg.evaluate("document.querySelectorAll('details.zusatz').forEach(d=>d.open=true)")
    pg.wait_for_timeout(200)

INTERN_WOERTER = ["Konfliktprüfung", "Belegung offen", "rechnung2", "alarmGesendet",
                  "Planwert", "Entwurf", "Zugmaschine", "Chassis", "Disponent",
                  "Dispo-Notiz", "Marge", "Maut", "Einkaufspreis"]

with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
    ctx = b.new_context(); pg = ctx.new_page()
    errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(URL, wait_until="load"); pg.wait_for_timeout(400)
    pg.evaluate("localStorage.clear()"); pg.reload(wait_until="load"); pg.wait_for_timeout(700)

    links = pg.evaluate("DISPO.zustand().D.links.map(l=>"
                        "({t:l.token,k:l.auftraggeberId,a:l.art,z:DISPO.linkZustand(l)}))")
    tok = lambda k, a="woche", z="aktiv": [l["t"] for l in links
                                           if l["k"]==k and l["a"]==a and l["z"]==z][0]
    poco  = tok("kunde_poco")
    einzel= tok("kunde_poco","einzel")
    elbe  = tok("kunde_elbe")
    auf = lambda t, i=None: pg.evaluate(
        "DISPO.externOeffnen(%r, %s, true)" % (t, ("%r"%i) if i else "null")) or pg.wait_for_timeout(350)

    print("\nA) Datenmodell und Auflösung")
    pr("jeder Auftrag hat eine Auftraggeber-ID oder ausdrücklich keine",
       pg.evaluate("DISPO.zustand().D.auftraege.every(a=>'auftraggeberId' in a)"))
    pr("Token ist lang und ohne Auftragsnummer",
       all(len(l["t"]) >= 20 for l in links) and
       pg.evaluate("DISPO.zustand().D.auftraege.every(a=>"
                   "DISPO.zustand().D.links.every(l=>l.token.indexOf(a.nummer)<0))"))
    pr("Adresse nennt keine Auftragsnummer",
       pg.evaluate("DISPO.linkAdresse(DISPO.zustand().D.links[1]).indexOf('/auftrag/')<0 && "
                   "/^https:\\/\\/tracking\\.im-cargo\\.de\\/t\\/[A-Z0-9]{20,}$/"
                   ".test(DISPO.linkAdresse(DISPO.zustand().D.links[1]))"))
    fremd = pg.evaluate("""(() => {
      const r = DISPO.linkAufloesen(%r);
      return r.auftraege.filter(a=>a.auftraggeberId!=='kunde_poco').length; })()""" % poco)
    pr("Wochenlink liefert ausschliesslich eigene Auftraege", fremd == 0, fremd)
    pr("Einzellink liefert genau einen Auftrag",
       pg.evaluate("DISPO.linkAufloesen(%r).auftraege.length" % einzel) == 1)
    # Fremde ID untergeschoben: darf nichts oeffnen
    fremdId = pg.evaluate("DISPO.zustand().D.auftraege.find(a=>a.auftraggeberId==='kunde_nordsee').id")
    auf(poco, fremdId)
    pr("fremde Auftrags-ID am eigenen Token oeffnet nichts",
       "nicht mehr gültig" in pg.inner_text("body"))

    print("\nB) Wochenansicht")
    auf(poco)
    t = pg.inner_text("body")
    pr("Kopf nennt Firma, Ansicht und Woche",
       "I&M CARGO" in t and "Transportübersicht" in t
       and "Poco Einrichtungsmarkt Walsrode" in t and "Kalenderwoche" in t)
    pr("alle sieben Wochentage", pg.locator("section.x-tag").count() == 7,
       pg.locator("section.x-tag").count())
    pr("kein Fahrername sichtbar",
       not any(f in t for f in pg.evaluate("DISPO.zustand().D.fahrer.map(f=>f.name)")))
    pr("keine Telefonnummer eines Fahrers",
       not any(f in t for f in pg.evaluate("DISPO.zustand().D.fahrer.map(f=>f.telefon)")))
    pr("kein Kennzeichen sichtbar",
       not any(z in t for z in pg.evaluate("DISPO.zustand().D.zugmaschinen.map(z=>z.kennzeichen)")))
    pr("keine Kunden anderer Auftraggeber",
       "Nordsee Handel" not in t and "Möller Baustoffe" not in t and "Weserhof" not in t)
    treffer = [w for w in INTERN_WOERTER if w in t]
    pr("keine internen Begriffe", not treffer, treffer)
    pr("keine Dispo-Navigation sichtbar",
       pg.locator('[data-tun="bereich"]').count() == 0)
    pr("Demo-Leiste mit Rueckweg",
       "DEMO – Auftraggeberansicht" in t and pg.locator('[data-tun="externZurueck"]').count() == 1)

    print("\nC) Statuswörter")
    woerter = pg.evaluate("""DISPO.zustand().D.auftraege
        .filter(a=>a.auftraggeberId==='kunde_poco')
        .map(a=>DISPO.externStatus(a).wort)""")
    erlaubt = {"Geplant","Fahrer hat Auftrag erhalten","Container übernommen","Unterwegs",
               "Beim Empfänger angekommen","Wartet auf Entladung","Entladung läuft",
               "Entladung abgeschlossen","Transport abgeschlossen"}
    pr("nur kundenfreundliche Statuswörter", set(woerter) <= erlaubt, sorted(set(woerter)))
    pr("mehrere Zustände in der Demo-Woche", len(set(woerter)) >= 4, sorted(set(woerter)))
    pr("abgeschlossener Transport kommt vor", "Transport abgeschlossen" in woerter)
    pr("laufende Entladung kommt vor", "Entladung läuft" in woerter)

    print("\nD) Einzelansicht und Verspätung")
    auf(einzel)
    t = pg.inner_text("main.x-einzel")
    pr("Nummer, Referenz, Container, Route, Termin",
       "Transport 5104" in t and "POCO-88123" in t and "HLXU" in t
       and "Hansa Terminal Bremen" in t and "Anlieferung geplant" in t)
    pr("Verspätung in Minuten genannt", "Voraussichtliche Verspätung: ca. 18 Minuten" in t)
    pr("erwartete Ankunft genannt", "Erwartete Ankunft" in t and "ca. 11:18 Uhr" in t)
    pr("Live-Standort als Demo markiert", "Live-Standort" in t and "Demo" in t)
    pr("Zeitleiste aus dem Ablauf", "Verlauf" in t and "Container übernommen" in t)
    pr("nur Bilder dieses Auftrags",
       pg.evaluate("document.querySelectorAll('.x-bilder img').length") ==
       pg.evaluate("DISPO.linkAufloesen(%r).auftraege[0].bilder.length" % einzel))

    print("\nE) Dokumente")
    dk = pg.evaluate("""(() => { const a = DISPO.linkAufloesen(%r).auftraege[0];
        return { alle:a.dokumente.length, extern:a.dokumente.filter(d=>d.extern).length }; })()""" % poco)
    sicht = pg.evaluate("document.querySelectorAll('.x-dok li').length")
    frei  = pg.evaluate("DISPO.linkAufloesen(%r).auftraege[0].dokumente.filter(d=>d.extern).length" % einzel)
    pr("extern nur freigegebene Dokumente", sicht == frei, f"{sicht} sichtbar / {frei} freigegeben")
    pr("es gibt auch nur-interne Dokumente",
       pg.evaluate("DISPO.zustand().D.auftraege.some(a=>(a.dokumente||[]).some(d=>d.extern===false))"))

    print("\nF) Alte Ortung")
    auf(elbe)
    pg.locator(".x-karte").first.click(); pg.wait_for_timeout(300)
    t = pg.inner_text("main.x-einzel")
    pr("sagt, wann zuletzt geortet wurde", "Standort zuletzt vor" in t and "aktualisiert" in t)
    pr("behauptet keine Ankunftszeit",
       "Aktuelle Ankunftszeit momentan nicht zuverlässig bestimmbar." in t)
    pr("nennt trotzdem keine erfundene Uhrzeit", "ca. " not in t.split("Verlauf")[0])

    print("\nG) Abgeschlossener Transport")
    auf(poco)
    pg.locator('.x-karte', has_text="Transport 5101").click(); pg.wait_for_timeout(300)
    t = pg.inner_text("main.x-einzel")
    pr("Status abgeschlossen", "Transport abgeschlossen" in t)
    pr("kein Live-Standort mehr", pg.locator(".x-ortung").count() == 0)
    pr("Verlauf bleibt sichtbar", "Verlauf" in t and "Entladung abgeschlossen" in t)
    pr("Bilder bleiben sichtbar", pg.locator(".x-bilder img").count() > 0)
    pr("freigegebene Dokumente bleiben sichtbar", pg.locator(".x-dok li").count() > 0)

    print("\nH) Linkzustände")
    for z, satz in [("abgelaufen","Dieser Link ist nicht mehr gültig."),
                    ("deaktiviert","Dieser Transportlink wurde deaktiviert.")]:
        tk = [l["t"] for l in links if l["z"] == z][0]
        auf(tk)
        t = pg.inner_text("body")
        pr(z + ": genau der vorgesehene Satz", satz in t)
        pr(z + ": keine Auftragsdaten",
           "Transport 5" not in t and "POCO-" not in t and "Container" not in t)
    auf("ZZZZZZZZZZZZZZZZZZZZZZZZ")
    pr("unbekanntes Token: keine Auskunft ueber Existenz",
       "Dieser Link ist nicht mehr gültig." in pg.inner_text("body"))

    print("\nI) Auftraggeber gesperrt")
    pg.evaluate("""(() => { const D = DISPO.zustand().D;
      D.auftraggeber.find(k=>k.id==='kunde_poco').externErlaubt = false; })()""")
    auf(poco)
    pr("gesperrter Auftraggeber zeigt keine Daten",
       "Transport 5" not in pg.inner_text("body"))
    pg.evaluate("""(() => { const D = DISPO.zustand().D;
      D.auftraggeber.find(k=>k.id==='kunde_poco').externErlaubt = true; })()""")

    print("\nJ) Aktualisieren und Rückweg")
    auf(poco)
    pg.click('[data-tun="externAktualisieren"]'); pg.wait_for_timeout(300)
    pr("Aktualisieren ist als Demo gekennzeichnet",
       "keine echte Serveraktualisierung" in pg.inner_text("#dlg"))
    pg.click('#dlg-fuss button'); pg.wait_for_timeout(250)
    pg.click('[data-tun="externZurueck"]'); pg.wait_for_timeout(350)
    # Die Zahl der Hauptbereiche waechst mit der Anwendung. Geprueft wird,
    # dass die Navigation ueberhaupt wieder da ist und der Tagesplan traegt.
    pr("zurueck in der Dispo",
       pg.locator('#navi [data-tun="bereich"]').count() >= 5 and
       pg.evaluate("DISPO.zustand().U.bereich") != "extern" and
       pg.evaluate("!DISPO.zustand().U.extern"))

    print("\nK) Bedienung in der Dispo")
    pg.click('[data-tun="bereich"][data-wert="stamm"]'); pg.wait_for_timeout(350)
    t = pg.inner_text("#inhalt")
    pr("Auftraggeber mit interner ID, Ansprechpartner und Kontakt",
       "kunde_poco" in t and "Frau Ehlers" in t and "05161 60110" in t
       and "disposition@poco-walsrode.example" in t)
    pr("externe Ansicht je Auftraggeber schaltbar",
       pg.locator('[data-tun="kundeExtern"]').count() >= 3)
    pr("Wochen-Link erzeugen vorhanden", pg.locator('[data-tun="linkWocheNeu"]').count() >= 3)
    pr("Gueltigkeit wird angezeigt", "Gültig bis" in t)
    vorher = pg.evaluate("DISPO.zustand().D.links.length")
    pg.evaluate("document.getElementById('wo_kunde_moeller').value = "
                "DISPO.zustand().D.links[0].wocheStart")
    pg.click('[data-tun="linkWocheNeu"][data-wert="kunde_moeller"]'); pg.wait_for_timeout(350)
    nachher = pg.evaluate("DISPO.zustand().D.links.length")
    pr("neuer Wochen-Link entsteht", nachher == vorher + 1, f"{vorher} → {nachher}")
    neu = pg.evaluate("DISPO.zustand().D.links[DISPO.zustand().D.links.length-1]")
    pr("neuer Link gehoert genau einem Auftraggeber",
       neu["auftraggeberId"] == "kunde_moeller" and neu["auftragId"] is None)
    pr("gesperrter Auftraggeber zeigt ueber den neuen Link nichts",
       pg.evaluate("DISPO.linkAufloesen(%r).ok" % neu["token"]) is False)

    # Deaktivieren
    pg.click('[data-tun="linkAus"][data-wert="%s"]' % neu["token"]); pg.wait_for_timeout(250)
    pg.locator('#dlg-fuss button', has_text="Deaktivieren").click(); pg.wait_for_timeout(350)
    pr("deaktivieren wirkt",
       pg.evaluate("DISPO.zustand().D.links.find(l=>l.token===%r).status" % neu["token"]) == "deaktiviert")
    # Neu erzeugen
    pg.click('[data-tun="linkNeu"][data-wert="%s"]' % neu["token"]); pg.wait_for_timeout(250)
    pg.locator('#dlg-fuss button', has_text="Neu erzeugen").click(); pg.wait_for_timeout(350)
    pr("altes Token ist nach Neuerzeugung unbekannt",
       pg.evaluate("DISPO.zustand().D.links.some(l=>l.token===%r)" % neu["token"]) is False)

    print("\nL) Auftragsansicht")
    pg.set_viewport_size({"width":1280, "height":900})
    pg.click('[data-tun="bereich"][data-wert="auftraege"]'); pg.wait_for_timeout(400)
    aid = pg.evaluate("DISPO.zustand().D.auftraege.find(a=>a.nummer==='5101').id")
    pg.locator('[data-tun="oeffnenAus"][data-wert="%s"]' % aid).first.click(); pg.wait_for_timeout(400)
    zusatzOeffnen(pg)
    t = pg.inner_text("#inhalt")
    pr("Auftraggeber steht im Auftrag", "Auftraggeber" in t and "kunde_poco" in t)
    pr("Freigabelink erzeugbar oder vorhanden",
       pg.locator('[data-tun="linkEinzelNeu"]').count() + pg.locator('[data-tun="linkKopieren"]').count() > 0)
    # Die Karte ist jetzt eingeklappt. Im zugeklappten Zustand traegt schon
    # die Ueberschrift die Kennzeichnung; der ganze Satz steht nach dem Oeffnen.
    # Die Kennzeichnung sitzt auf der Kartenueberschrift, nicht erst im
    # Inhalt — sie ist damit auch im zugeklappten Zustand zu sehen.
    pr("Kennzeichnung sitzt auf der Kartenueberschrift",
       pg.evaluate("""(()=>{const d=[...document.querySelectorAll('details.zusatz')]
         .find(x=>/Auftraggeber-Link/.test(x.querySelector('summary').textContent));
         return !!d && /Vorschau/.test(d.querySelector('summary').textContent);})()"""))
    zusatzOeffnen(pg)
    pr("als simuliert gekennzeichnet",
       "Simulierter Freigabelink – kein echter Online-Zugriff." in pg.inner_text("#inhalt"))
    pr("Dokument einzeln freigebbar", pg.locator('[data-tun="dokExtern"]').count() >= 2)
    vor = pg.evaluate("DISPO.zustand().D.auftraege.find(a=>a.nummer==='5101')"
                      ".dokumente.filter(d=>d.extern).length")
    pg.locator('[data-tun="dokExtern"]').last.click(); pg.wait_for_timeout(350)
    nach = pg.evaluate("DISPO.zustand().D.auftraege.find(a=>a.nummer==='5101')"
                       ".dokumente.filter(d=>d.extern).length")
    pr("Freigabe umschaltbar", nach != vor, f"{vor} → {nach}")

    print("\nM) Entwürfe, Stornos und Vorschau-Knopf")
    pg.click('[data-tun="bereich"][data-wert="auftraege"]'); pg.wait_for_timeout(350)
    aid2 = pg.evaluate("DISPO.zustand().D.auftraege.find(a=>a.nummer==='5106').id")
    pg.locator('[data-tun="oeffnenAus"][data-wert="%s"]' % aid2).first.click(); pg.wait_for_timeout(400)
    pg.click('[data-tun="bearbeiten"]'); pg.wait_for_timeout(400)
    pg.fill("#f_lieferZeit", "17:45")
    pg.click('[data-tun="entwurf"]'); pg.wait_for_timeout(450)
    pr("Entwurf liegt vor",
       pg.evaluate("!!DISPO.zustand().D.auftraege.find(a=>a.nummer==='5106').entwurf"))
    auf(poco)
    pr("nicht freigegebene Änderung ist extern unsichtbar",
       "17:45" not in pg.inner_text("body"), pg.inner_text("body").count("17:45"))
    pg.click('[data-tun="externZurueck"]'); pg.wait_for_timeout(350)
    pg.click('[data-tun="bereich"][data-wert="auftraege"]'); pg.wait_for_timeout(350)
    pg.locator('[data-tun="oeffnenAus"][data-wert="%s"]' % aid2).first.click(); pg.wait_for_timeout(400)
    pg.click('[data-tun="entwurfVerwerfen"]'); pg.wait_for_timeout(250)
    pg.locator('#dlg-fuss button').last.click(); pg.wait_for_timeout(400)

    # Stornierter Auftrag verschwindet extern
    pg.click('[data-tun="bereich"][data-wert="auftraege"]'); pg.wait_for_timeout(350)
    aid3 = pg.evaluate("DISPO.zustand().D.auftraege.find(a=>a.nummer==='5108').id")
    pg.locator('[data-tun="oeffnenAus"][data-wert="%s"]' % aid3).first.click(); pg.wait_for_timeout(400)
    pg.click('[data-tun="stornieren"]'); pg.wait_for_timeout(250)
    pg.locator('#dlg-fuss button').last.click(); pg.wait_for_timeout(450)
    pr("stornierter Auftrag ist storniert",
       pg.evaluate("DISPO.zustand().D.auftraege.find(a=>a.nummer==='5108').storniert") is True)
    auf(poco)
    pr("stornierter Auftrag erscheint extern nicht",
       "Transport 5108" not in pg.inner_text("body"))
    pg.click('[data-tun="externZurueck"]'); pg.wait_for_timeout(350)

    # Vorschau-Knopf aus dem Auftrag heraus
    pg.click('[data-tun="bereich"][data-wert="auftraege"]'); pg.wait_for_timeout(350)
    aid4 = pg.evaluate("DISPO.zustand().D.auftraege.find(a=>a.nummer==='5104').id")
    pg.locator('[data-tun="oeffnenAus"][data-wert="%s"]' % aid4).first.click(); pg.wait_for_timeout(400)
    zusatzOeffnen(pg)
    pg.locator('[data-tun="linkVorschau"]').first.click(); pg.wait_for_timeout(450)
    pr("Vorschau aus dem Auftrag heraus zeigt genau diesen Transport",
       "Transport 5104" in pg.inner_text("body")
       and "Transport 5101" not in pg.inner_text("body"))
    pg.click('[data-tun="externZurueck"]'); pg.wait_for_timeout(400)
    pr("Rückweg landet wieder im Auftrag",
       "Auftrag 5104" in pg.inner_text("#inhalt"))

    print("\nN) Auftragsformular")
    pg.click('[data-tun="bereich"][data-wert="auftraege"]'); pg.wait_for_timeout(300)
    pg.click('[data-tun="neu"]'); pg.wait_for_timeout(400)
    pr("Auftraggeber im Formular waehlbar", pg.locator("#f_auftraggeberId").count() == 1)
    pr("Auswahl kennt alle Auftraggeber",
       pg.locator("#f_auftraggeberId option").count() ==
       pg.evaluate("DISPO.zustand().D.auftraggeber.length") + 1)
    pg.select_option("#f_auftraggeberId", "kunde_nordsee")
    pg.fill("#f_kunde", "Nordsee Handel KG")
    pg.click('[data-tun="entwurf"]'); pg.wait_for_timeout(450)
    pr("Auftraggeber wird gespeichert",
       pg.evaluate("DISPO.zustand().D.auftraege.some(a=>a.kunde==='Nordsee Handel KG' "
                   "&& a.auftraggeberId==='kunde_nordsee')"))

    print("\nO) Speichern und Mobil")
    pr("Links liegen im localStorage",
       pg.evaluate("JSON.parse(localStorage.getItem('twistlock-dispo-demo-v2')).links.length") > 0)
    pg.set_viewport_size({"width":390, "height":844})
    auf(poco)
    breit = pg.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1")
    pr("kein waagerechtes Scrollen auf dem Handy", breit,
       pg.evaluate("document.documentElement.scrollWidth + '/' + window.innerWidth"))
    pr("Tage untereinander", pg.evaluate(
       "getComputedStyle(document.querySelector('main.x-woche')).display") != "grid")

    print("\nJS-Fehler:", errs if errs else "keine")
    ok_all = ok_all and not errs
    b.close()

print("\n" + ("ALLE PRUEFUNGEN BESTANDEN" if ok_all else "*** FEHLSCHLAEGE ***"))

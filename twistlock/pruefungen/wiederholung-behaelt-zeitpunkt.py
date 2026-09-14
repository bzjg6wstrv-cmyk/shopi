# -*- coding: utf-8 -*-
"""Echte Fahrer-App: 'Erneut speichern' darf den Zeitpunkt nicht neu setzen.

Netz und Gerätespeicher werden gezielt zum Scheitern gebracht, danach
wird der Speicher wieder freigegeben und wiederholt. Geprüft wird der
Vorgang, den die App tatsächlich ablegen will.
"""
from playwright.sync_api import sync_playwright

URL = "http://localhost:3000/fahrer.html"
ok_all = True
def pr(n, ok, d=""):
    global ok_all; ok_all = ok_all and ok
    print(("  OK   " if ok else "  FEHL ") + n + ("  → " + d if d else ""))

with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
    pg = b.new_context().new_page()
    errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    # Netz VOR dem Laden stilllegen: sonst antwortet der Server mit 401
    # und fahrer.html leitet zur Anmeldung um, bevor wir testen koennen.
    pg.add_init_script("""
      window.__versuche = [];
      window.__speicherGeht = false;
      window.fetch = () => Promise.reject(new Error('kein Netz (Test)'));
    """)
    pg.goto(URL, wait_until="load"); pg.wait_for_timeout(1200)

    print("\n7) Echte App: Wiederholung behaelt den urspruenglichen Zeitpunkt")

    # Netz aus, Gerätespeicher aus. Jeder Ablegeversuch wird mitgeschrieben.
    pg.evaluate("""() => {
      TL_WARTE.legeAb = async (v) => { window.__versuche.push(v); return window.__speicherGeht; };
      TL_WARTE.alle   = async () => [];
      Z.auftrag = { id:'t1', nummer:'9001', status:'freigegeben',
                    container:'MSCU1234566', kunde:'Testkunde', zielOrt:'Walsrode' };
      Z.laeuft = false; Z.offenerVersuch = null; Z.ansicht = 'auftrag';
    }""")

    # Erster Versuch — muss scheitern
    pg.evaluate("ereignisSenden(Z.auftrag, 'abholung', 'FOTO-DATEN', {})")
    pg.wait_for_timeout(600)
    st = pg.evaluate("({ansicht:Z.ansicht, versuch:Z.offenerVersuch, n:window.__versuche.length})")
    pr("erster Versuch scheitert → Speicherfehler", st["ansicht"] == "speicherfehler", str(st["ansicht"]))
    pr("Foto und Zeit gemerkt", bool(st["versuch"] and st["versuch"].get("zeit")
                                     and st["versuch"].get("foto")))
    t1 = (st["versuch"] or {}).get("zeit")

    pg.wait_for_timeout(1200)   # Zeit vergeht spuerbar

    # Speicher geht wieder, Fahrer tippt "Erneut speichern" — mehrfach schnell
    pg.evaluate("""() => { window.__speicherGeht = true;
                           for (let i=0;i<5;i++) A.erneutSpeichern(); }""")
    pg.wait_for_timeout(800)

    v = pg.evaluate("window.__versuche")
    zeiten = [x.get("zeit") for x in v]
    pr("Wiederholung nutzt denselben Zeitpunkt", zeiten[-1] == t1, f"{t1} → {zeiten[-1]}")
    pr("alle Versuche tragen dieselbe Zeit", len(set(zeiten)) == 1, str(sorted(set(zeiten))))
    pr("5 schnelle Tipps → nur ein weiterer Ablegeversuch", len(v) == 2, f"{len(v)} Versuche")
    ids = {x.get("id") for x in v}
    pr("immer derselbe Vorgang (eine Kennung)", len(ids) == 1, str(ids))
    erg = pg.evaluate("Z.ergebnis")
    pr("jetzt als gespeichert angezeigt", (erg or {}).get("typ") == "gespeichert", str((erg or {}).get("typ")))
    pr("Anzeige zeigt den urspruenglichen Zeitpunkt", (erg or {}).get("zeit") == t1, str((erg or {}).get("zeit")))

    print("\nJS-Fehler:", errs if errs else "keine")
    b.close()

print("\n" + ("BESTANDEN" if ok_all else "*** FEHLSCHLAEGE ***"))

# -*- coding: utf-8 -*-
from playwright.sync_api import sync_playwright
URL = "http://localhost:8092/vorschau-einzeldatei.html"
ok_all = True
def pr(name, ok, detail=""):
    global ok_all
    ok_all = ok_all and ok
    print(("  OK   " if ok else "  FEHL ") + name + ("  → " + detail if detail else ""))

def leeren(pg):
    pg.evaluate("""async () => {
      const l = await VORSCHAU.warteschlange.alle();
      for (const v of l) await VORSCHAU.warteschlange.entferne(v.id);
    }""")

with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
    ctx = b.new_context()
    pg = ctx.new_page()
    errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(URL, wait_until="load"); pg.wait_for_timeout(400)

    # ---------------------------------------------------------------
    print("\n1) Ohne Internet speichern, neu laden, Vorgang + Foto wiederfinden")
    for sz, knopf, art in [("keinNetz","abholungBestaetigen","abholung"),
                           ("abgabeOffline","fotoVerwenden","abgabe")]:
        leeren(pg)
        pg.click(f'[data-sz="{sz}"]'); pg.wait_for_timeout(200)
        pg.click(f'[data-tun="{knopf}"]'); pg.wait_for_timeout(500)
        z = pg.evaluate("VORSCHAU.zustand()")
        erg = z.get("ergebnis") or {}
        pr(f"[{art}] Ergebnis 'gespeichert'", erg.get("typ") == "gespeichert", str(erg.get("typ")))
        zeit_vor = erg.get("zeit")
        # neu laden
        pg.reload(wait_until="load"); pg.wait_for_timeout(600)
        liste = pg.evaluate("VORSCHAU.warteschlange.alle()")
        treffer = [v for v in liste if v.get("art") == art]
        pr(f"[{art}] nach Neuladen genau 1 Vorgang", len(treffer) == 1, f"{len(treffer)} gefunden")
        if treffer:
            v = treffer[0]
            pr(f"[{art}] Foto erhalten", bool(v.get("foto")), (v.get("foto") or "")[:24] + "…")
            pr(f"[{art}] Zeitpunkt unveraendert", v.get("zeit") == zeit_vor, str(v.get("zeit")))
            pr(f"[{art}] Auftrag zugeordnet", bool(v.get("auftragId")), str(v.get("auftragId")))

    # ---------------------------------------------------------------
    print("\n2) Speicherfehler: keine Erfolgsanzeige, kein abgeschlossener Schritt")
    leeren(pg)
    pg.click('[data-sz="speicherfehler"]'); pg.wait_for_timeout(200)
    vorher = pg.evaluate("({s:VORSCHAU.zustand().auftrag.status, z:VORSCHAU.zustand().auftrag.abholZeit||null})")
    pg.click('[data-tun="abholungBestaetigen"]'); pg.wait_for_timeout(500)
    z = pg.evaluate("VORSCHAU.zustand()")
    pr("Ansicht = speicherfehler", z.get("ansicht") == "speicherfehler", str(z.get("ansicht")))
    pr("kein Ergebnis gesetzt", not z.get("ergebnis"), str(z.get("ergebnis")))
    nachher = pg.evaluate("({s:VORSCHAU.zustand().auftrag.status, z:VORSCHAU.zustand().auftrag.abholZeit||null})")
    pr("Auftragsschritt NICHT gebucht", nachher == vorher, f"{vorher} → {nachher}")
    pr("Warteschlange leer", len(pg.evaluate("VORSCHAU.warteschlange.alle()")) == 0)
    txt = pg.inner_text("#app")
    pr("Meldung 'Foto noch nicht gespeichert'", "Foto noch nicht gespeichert" in txt)
    pr("Hinweis 'nicht schliessen' sichtbar", "offen lassen" in txt or "nicht schließen" in txt.lower())
    knoepfe = pg.eval_on_selector_all("[data-tun]", "e=>e.map(x=>x.dataset.tun)")
    pr("Schaltflaechen 'Erneut speichern' + 'Zurueck zum Foto'",
       "erneutSpeichern" in knoepfe and "zurueckZumFoto" in knoepfe, str(knoepfe))
    versuch_zeit = z.get("offenerVersuch", {}).get("zeit")

    # ---------------------------------------------------------------
    print("\n3) 'Zurück zum Foto': Aufnahme bleibt sichtbar")
    pg.click('[data-tun="zurueckZumFoto"]'); pg.wait_for_timeout(300)
    z = pg.evaluate("VORSCHAU.zustand()")
    pr("Ansicht = foto", z.get("ansicht") == "foto", str(z.get("ansicht")))
    pr("Foto noch im Zustand", bool((z.get("foto") or {}).get("bild")))
    pr("Foto im Bildschirm sichtbar", pg.locator("img.vorschaubild").count() > 0)

    # ---------------------------------------------------------------
    print("\n4) Erneut speichern: genau ein Vorgang mit urspruenglichem Zeitpunkt")
    leeren(pg)
    pg.click('[data-sz="speicherfehler"]'); pg.wait_for_timeout(200)
    pg.click('[data-tun="abholungBestaetigen"]'); pg.wait_for_timeout(500)
    z = pg.evaluate("VORSCHAU.zustand()")
    pr("im Speicherfehler", z.get("ansicht") == "speicherfehler", str(z.get("ansicht")))
    versuch_zeit = (z.get("offenerVersuch") or {}).get("zeit")
    pg.evaluate("demoSpeicherFehler = false")       # Speicher funktioniert wieder
    # zugleich Punkt 4: mehrfaches schnelles Tippen auf "Erneut speichern"
    pg.evaluate("""() => { const b = document.querySelector('[data-tun=\"erneutSpeichern\"]');
                           for (let i=0;i<6;i++) b.click(); }""")
    pg.wait_for_timeout(800)
    liste = pg.evaluate("VORSCHAU.warteschlange.alle()")
    pr("6 Tipps auf 'Erneut speichern' → genau 1 Vorgang", len(liste) == 1, f"{len(liste)}")
    if liste:
        pr("Zeitpunkt = urspruenglicher Versuch", liste[0].get("zeit") == versuch_zeit,
           f"{versuch_zeit} vs {liste[0].get('zeit')}")
        pr("Foto im gespeicherten Vorgang", bool(liste[0].get("foto")))
    z = pg.evaluate("VORSCHAU.zustand()")
    pr("jetzt als gespeichert angezeigt", (z.get("ergebnis") or {}).get("typ") == "gespeichert",
       str((z.get("ergebnis") or {}).get("typ")))
    pr("Zeitpunkt der Anzeige unveraendert", (z.get("ergebnis") or {}).get("zeit") == versuch_zeit)
    pr("offenerVersuch aufgeloest", not z.get("offenerVersuch"))

    print("\n5) Mehrfach schnell tippen: keine doppelten Buchungen")
    leeren(pg)
    pg.click('[data-sz="keinNetz"]'); pg.wait_for_timeout(200)
    n = pg.evaluate("""() => {
      const b = document.querySelector('[data-tun="abholungBestaetigen"]');
      let t = 0;
      for (let i = 0; i < 8; i++) { b.click(); t++; }
      return t;
    }""")
    pg.wait_for_timeout(800)
    liste = pg.evaluate("VORSCHAU.warteschlange.alle()")
    pr(f"{n} Tipps → genau 1 Vorgang", len(liste) == 1, f"{len(liste)}")
    hist = pg.evaluate("VORSCHAU.zustand().auftrag.abholZeit")
    pr("genau eine Buchung (eine Abholzeit)", bool(hist), str(hist))

    print("\nJS-Fehler:", errs if errs else "keine")
    b.close()

print("\n" + ("ALLE PRUEFUNGEN BESTANDEN" if ok_all else "*** ES GIBT FEHLSCHLAEGE ***"))

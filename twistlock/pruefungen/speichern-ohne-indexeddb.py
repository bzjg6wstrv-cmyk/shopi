# -*- coding: utf-8 -*-
from playwright.sync_api import sync_playwright
URL = "http://localhost:8092/vorschau-einzeldatei.html"
ok_all = True
def pr(n, ok, d=""):
    global ok_all; ok_all = ok_all and ok
    print(("  OK   " if ok else "  FEHL ") + n + ("  → " + d if d else ""))

with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
    pg = b.new_context().new_page()
    errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
    # IndexedDB komplett verweigern — wie in einer eingebetteten Vorschau ohne Herkunft
    pg.add_init_script("""
      Object.defineProperty(window, 'indexedDB', {
        configurable: true,
        get() { throw new DOMException('IndexedDB gesperrt (Test)', 'SecurityError'); }
      });
    """)
    pg.goto(URL, wait_until="load"); pg.wait_for_timeout(500)

    print("\n6) IndexedDB gesperrt (eingebettete Vorschau)")
    for sz, knopf, art in [("keinNetz","abholungBestaetigen","abholung"),
                           ("abgabeOffline","fotoVerwenden","abgabe")]:
        pg.click(f'[data-sz="{sz}"]'); pg.wait_for_timeout(200)
        vorher = pg.evaluate("JSON.stringify({s:VORSCHAU.zustand().auftrag.status,"
                             "ab:VORSCHAU.zustand().auftrag.abholZeit||null,"
                             "ag:VORSCHAU.zustand().auftrag.abgabeZeit||null})")
        pg.click(f'[data-tun="{knopf}"]'); pg.wait_for_timeout(600)
        z = pg.evaluate("VORSCHAU.zustand()")
        pr(f"[{art}] KEIN Erfolg angezeigt", not z.get("ergebnis"), str(z.get("ergebnis")))
        pr(f"[{art}] Ansicht = speicherfehler", z.get("ansicht") == "speicherfehler", str(z.get("ansicht")))
        nach = pg.evaluate("JSON.stringify({s:VORSCHAU.zustand().auftrag.status,"
                           "ab:VORSCHAU.zustand().auftrag.abholZeit||null,"
                           "ag:VORSCHAU.zustand().auftrag.abgabeZeit||null})")
        pr(f"[{art}] Auftragsschritt NICHT abgeschlossen", nach == vorher, f"{vorher} → {nach}")
        pr(f"[{art}] Foto + Zeit behalten", bool((z.get("offenerVersuch") or {}).get("foto"))
           and bool((z.get("offenerVersuch") or {}).get("zeit")))
        txt = pg.inner_text("#app")
        pr(f"[{art}] ehrliche Fehlermeldung", "Foto noch nicht gespeichert" in txt)

    pr("istDauerhaft() meldet false", pg.evaluate("VORSCHAU.warteschlange.istDauerhaft()") is False,
       str(pg.evaluate("VORSCHAU.warteschlange.istDauerhaft()")))
    hinweis = pg.inner_text("#warteschlange")
    pr("Gerätespeicher-Anzeige nennt den Fehler",
       "kein dauerhafter Speicher möglich" in hinweis and "Speicherfehler" in hinweis,
       hinweis[:130])
    pr("behauptet keine Speicherung", "Arbeitsspeicher" not in hinweis)
    print("\nJS-Fehler:", errs if errs else "keine")
    b.close()
print("\n" + ("BESTANDEN" if ok_all else "*** FEHLSCHLAEGE ***"))

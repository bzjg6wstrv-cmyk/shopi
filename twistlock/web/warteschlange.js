/* ===========================================================
   TWISTLOCK — Warteschlange auf dem Handy

   Alles, was ohne Netz passiert, wird hier vollständig abgelegt:
   Foto, Auftrag, Ereignis-Kennung, Art, ursprüngliche Uhrzeit und,
   wenn vorhanden, die bestätigte Containernummer samt Abweichung.

   Gespeichert wird in IndexedDB, also auf dem Gerät — die Vorgänge
   überleben das Schließen und Neuladen der Seite.

   Die Ereignis-Kennung ist der Schlüssel. Derselbe Vorgang kann
   deshalb nie zweimal in der Warteschlange landen, egal wie oft
   getippt oder wiederholt wird.
   =========================================================== */
"use strict";

var TL_WARTE = (function () {
  let DB_NAME = "twistlock";
  const LADEN = "vorgaenge";
  const ALT   = "warteschlange";     // Speicher der ersten Fassung
  const VERSION = 2;

  function setzeDatenbank(name) { DB_NAME = name; }

  /* Manche Anzeigeflächen (eingebettete Vorschau ohne eigene Herkunft)
     erlauben keinen dauerhaften Speicher. Die echte App darf dann nichts
     behaupten. Nur die Vorschau schaltet den Arbeitsspeicher frei —
     und sagt ausdrücklich dazu, dass er das Neuladen nicht übersteht. */
  let arbeitsspeicherErlaubt = false;
  let dauerhaft = null;                  // null = noch nicht ausprobiert
  const gedaechtnis = new Map();
  function erlaubeArbeitsspeicher(ja) { arbeitsspeicherErlaubt = !!ja; }
  function istDauerhaft() { return dauerhaft; }

  function db() {
    return new Promise((ok, nein) => {
      let a;
      try { a = indexedDB.open(DB_NAME, VERSION); }
      catch (e) { return nein(e); }
      a.onupgradeneeded = e => {
        const d = a.result;
        if (!d.objectStoreNames.contains(LADEN)) d.createObjectStore(LADEN, { keyPath: "id" });
        // Vorgänge aus der ersten Fassung übernehmen, damit nichts verloren geht
        if (d.objectStoreNames.contains(ALT) && a.transaction) {
          try {
            const altLesen = a.transaction.objectStore(ALT).getAll();
            altLesen.onsuccess = () => {
              const neu = a.transaction.objectStore(LADEN);
              (altLesen.result || []).forEach((x, i) => {
                neu.put({ id: x.schluessel || ("alt:" + i), art: (x.nutzlast || {}).art || "unbekannt",
                          auftragId: (x.nutzlast || {}).auftragId || null,
                          zeit: new Date().toISOString(),
                          weg: x.weg || "/api/fahrer/ereignis", nutzlast: x.nutzlast || {} });
              });
            };
          } catch (e) {}
        }
      };
      a.onsuccess = () => ok(a.result);
      a.onerror   = () => nein(a.error);
    });
  }

  /* Legt einen Vorgang ab. Gibt true zurück, wenn er wirklich liegt. */
  async function legeAb(vorgang) {
    if (!vorgang || !vorgang.id) return false;
    try {
      const d = await db();
      await new Promise((ok, nein) => {
        const t = d.transaction(LADEN, "readwrite");
        t.objectStore(LADEN).put(vorgang);
        t.oncomplete = ok;
        t.onerror = () => nein(t.error);
        t.onabort = () => nein(t.error);
      });
      // Nur melden, was auch wirklich gelesen werden kann
      const zurueck = await hole(vorgang.id);
      dauerhaft = !!zurueck;
      return !!zurueck;
    } catch (e) {
      if (!arbeitsspeicherErlaubt) { dauerhaft = false; return false; }
      gedaechtnis.set(vorgang.id, vorgang);
      dauerhaft = false;
      return true;
    }
  }

  async function alle() {
    try {
      const d = await db();
      const liste = await new Promise(ok => {
        const a = d.transaction(LADEN, "readonly").objectStore(LADEN).getAll();
        a.onsuccess = () => ok(a.result || []);
        a.onerror   = () => ok([]);
      });
      dauerhaft = true;
      return liste;
    } catch (e) {
      return arbeitsspeicherErlaubt ? [...gedaechtnis.values()] : [];
    }
  }

  async function hole(id) {
    try {
      const d = await db();
      return await new Promise(ok => {
        const a = d.transaction(LADEN, "readonly").objectStore(LADEN).get(id);
        a.onsuccess = () => ok(a.result || null);
        a.onerror   = () => ok(null);
      });
    } catch (e) {
      return arbeitsspeicherErlaubt ? (gedaechtnis.get(id) || null) : null;
    }
  }

  async function entferne(id) {
    try {
      const d = await db();
      await new Promise(ok => {
        const t = d.transaction(LADEN, "readwrite");
        t.objectStore(LADEN).delete(id);
        t.oncomplete = ok; t.onerror = ok; t.onabort = ok;
      });
      return true;
    } catch (e) {
      if (arbeitsspeicherErlaubt) { gedaechtnis.delete(id); return true; }
      return false;
    }
  }

  async function anzahl() { return (await alle()).length; }

  return { setzeDatenbank, legeAb, alle, hole, entferne, anzahl,
           erlaubeArbeitsspeicher, istDauerhaft };
})();

if (typeof module !== "undefined" && module.exports) module.exports = TL_WARTE;

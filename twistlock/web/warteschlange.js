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

  /* Es gibt keinen Ersatzspeicher. Entweder ein Vorgang liegt dauerhaft
     auf dem Gerät (IndexedDB), oder er gilt als nicht gespeichert.
     Ein Zwischenspeicher im Arbeitsspeicher würde beim Neuladen
     verschwinden — und dürfte deshalb nie als gespeichert gelten. */
  let dauerhaft = null;                  // null = noch nicht ausprobiert
  let letzterFehler = null;
  function istDauerhaft() { return dauerhaft; }
  function fehlerText() { return letzterFehler; }

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
      /* Erst wenn der Vorgang wieder gelesen werden kann, gilt er als
         gespeichert. Alles andere wäre eine Behauptung. */
      const zurueck = await hole(vorgang.id);
      const vollstaendig = !!(zurueck && zurueck.id === vorgang.id &&
                              (!vorgang.foto || zurueck.foto));
      dauerhaft = vollstaendig;
      letzterFehler = vollstaendig ? null : "Vorgang nicht vollständig lesbar";
      return vollstaendig;
    } catch (e) {
      dauerhaft = false;
      letzterFehler = (e && e.message) || "Speicher nicht verfügbar";
      return false;
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
      dauerhaft = false;
      letzterFehler = (e && e.message) || "Speicher nicht verfügbar";
      return [];
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
    } catch (e) { return null; }
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
    } catch (e) { return false; }
  }

  async function anzahl() { return (await alle()).length; }

  /* Ist dauerhafter Speicher überhaupt möglich? */
  async function verfuegbar() {
    try { await db(); dauerhaft = true; return true; }
    catch (e) { dauerhaft = false;
                letzterFehler = (e && e.message) || "Speicher nicht verfügbar";
                return false; }
  }

  return { setzeDatenbank, legeAb, alle, hole, entferne, anzahl,
           istDauerhaft, fehlerText, verfuegbar };
})();

if (typeof module !== "undefined" && module.exports) module.exports = TL_WARTE;

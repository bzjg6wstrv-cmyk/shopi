/* ===========================================================
   Containernummern — prüfen, vergleichen, lesbar machen

   Eine Containernummer nach ISO 6346 sieht so aus:
     MSCU 123456 7
     |    |      └ Prüfziffer
     |    └ sechs Ziffern
     └ drei Buchstaben Eigner + ein Buchstabe für die Bauart

   Die Prüfziffer verrät Tippfehler und schlecht erkannte Zeichen.
   Sie beweist aber nicht, dass es der richtige Container ist:
   eine falsche, aber gültige Nummer besteht die Prüfung genauso.

   Läuft im Browser und in Node (für den Server und die Tests).
   =========================================================== */
"use strict";

var TL_CONTAINER = (function () {

  /* Buchstabenwerte: A=10, danach fortlaufend, Vielfache von 11 werden
     übersprungen (11, 22, 33). */
  const WERT = (() => {
    const w = {};
    let n = 10;
    for (let i = 0; i < 26; i++) {
      while (n % 11 === 0) n++;
      w[String.fromCharCode(65 + i)] = n;
      n++;
    }
    return w;
  })();

  function rein(nummer) {
    return String(nummer || "").replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  }

  /* Lesbar in drei Gruppen: MSCU 123456 7 */
  function lesbar(nummer) {
    const n = rein(nummer);
    if (n.length !== 11) return n;
    return n.slice(0, 4) + " " + n.slice(4, 10) + " " + n.slice(10);
  }

  /* Rechnet die Prüfziffer aus den ersten zehn Zeichen aus.
     Gibt null zurück, wenn die Form nicht stimmt. */
  function pruefziffer(nummer) {
    const n = rein(nummer);
    if (!/^[A-Z]{4}[0-9]{6}/.test(n)) return null;
    let summe = 0;
    for (let i = 0; i < 10; i++) {
      const z = n[i];
      const wert = i < 4 ? WERT[z] : Number(z);
      summe += wert * Math.pow(2, i);
    }
    return (summe % 11) % 10;
  }

  /* Ergebnis: { form, ziffer, erwartet, gueltig } */
  function pruefe(nummer) {
    const n = rein(nummer);
    const form = /^[A-Z]{4}[0-9]{7}$/.test(n);
    const erwartet = pruefziffer(n);
    return {
      nummer: n,
      form,
      erwartet,
      ziffer: form ? Number(n[10]) : null,
      gueltig: !!(form && erwartet !== null && Number(n[10]) === erwartet)
    };
  }

  /* Vergleicht die Nummer aus dem Auftrag mit der erkannten Nummer.
     "leer"       — eine der beiden fehlt
     "passt"      — gleiche Nummer
     "abweichung" — verschiedene Nummern                        */
  function vergleiche(erwartet, erkannt) {
    const a = rein(erwartet), b = rein(erkannt);
    if (!a || !b) return "leer";
    return a === b ? "passt" : "abweichung";
  }

  return { rein, lesbar, pruefziffer, pruefe, vergleiche };
})();

if (typeof module !== "undefined" && module.exports) module.exports = TL_CONTAINER;

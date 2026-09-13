/* ===========================================================
   Baut die Demo-Vorschau als eine einzige Datei.

   Warum: Manche Anzeigeflächen (zum Beispiel eine eingebettete
   Vorschau ohne eigene Adresse) laden keine Nebendateien. Eine
   Datei mit allem darin läuft überall — auch per E-Mail verschickt
   oder vom USB-Stick, ganz ohne Server.

   Aufruf:  node vorschau-bauen.js [ziel.html] [--rumpf]
            --rumpf schreibt nur den Seiteninhalt ohne <html>-Gerüst.
   =========================================================== */
"use strict";
const fs = require("fs");
const path = require("path");

const WEB = path.join(__dirname, "web");
const lies = n => fs.readFileSync(path.join(WEB, n), "utf8");

const ziel  = process.argv[2] || path.join(__dirname, "vorschau-einzeldatei.html");
const rumpf = process.argv.includes("--rumpf");

const css     = lies("einfach.css");
const container = lies("container.js");
const sprache = lies("sprache.js");
const ansicht = lies("fahreransicht.js");
const seite   = lies("vorschau.html");

// Aus der Vorschauseite nur den sichtbaren Teil und das eigene Skript holen
const koerper = seite.split("<body>")[1].split("</body>")[0];
const inhalt  = koerper.split('<script src="/container.js">')[0];
const eigenes = koerper.split('<script src="/fahreransicht.js"></script>')[1]
                       .replace(/^\s*<script>/, "").replace(/<\/script>\s*$/, "");

// </script> im Text würde das umschließende Skript beenden
const sicher = s => s.replace(/<\/script/gi, "<\\/script");

const kern = `<title>TWISTLOCK Fahreransicht</title>
<style>
${css}
/* Diese Vorschau hat bewusst nur ein Farbschema: die App wird im Lkw bei
   Tageslicht benutzt. Alle Flächen sind ausgemalt, damit die Seite auf
   jedem Untergrund gleich aussieht. */
body{background:#E9EBE7; color:#15202B}
.demo-rahmen{padding-inline:0}
/* Auf dem Handy zwei Schalter pro Zeile: sonst schieben sieben Zeilen
   den Fahrerbildschirm aus dem Bild. */
.demo-schalter{gap:8px; padding:10px 12px}
.demo-schalter button{flex:1 1 45%; min-height:60px; font-size:17px}
.demo-kopf h1{font-size:20px}
.demo-kopf p{font-size:16px}
</style>
${inhalt}
<script>
${sicher(container)}
</script>
<script>
${sicher(sprache)}
</script>
<script>
${sicher(ansicht)}
</script>
<script>
${sicher(eigenes)}
</script>`;

const ganz = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#15202B">
${kern}
</body>
</html>`.replace("<style>", "</head>\n<body>\n<style>");

fs.writeFileSync(ziel, rumpf ? kern : ganz, "utf8");
console.log("Geschrieben: " + ziel + "  (" + Math.round(fs.statSync(ziel).size/1024) + " kB, eine Datei, keine Anhänge)");

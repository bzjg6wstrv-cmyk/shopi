/* ===========================================================
   TWISTLOCK — Fahreransichten

   Dieses Modul baut nur Bildschirme aus einem Zustand. Es ruft
   selbst nichts ab und speichert nichts. Dadurch benutzen die
   echte App (fahrer.html) und die Demo-Vorschau (vorschau.html)
   dieselbe Darstellung.

   Jede Schaltfläche trägt data-tun="name". Die Seite, die das
   Modul benutzt, hört auf Klicks und führt die Aktion aus.

   Zustand (alle Felder sind freiwillig):
     ansicht        "auftrag" | "foto" | "ergebnis" | "abschluss" |
                    "problem" | "problemFrage" | "problemErgebnis" |
                    "tagesplan" | "sprache" | "stand" | "kamerahilfe" |
                    "feierabend" | "laden" | "keinNetz"
     auftrag        aktueller Auftrag inklusive .rechnung vom Server
     heute, morgen  Listen für den Tagesplan
     online         Netz vorhanden
     datenZeit      wann die Daten vom Büro kamen (ISO)
     offen          Anzahl Aufnahmen in der Warteschlange
     laeuft         gerade wird gesendet
     einst          Einstellungen vom Server (u. a. bueroTelefon)
   =========================================================== */
"use strict";

const FA = (() => {

/* ---------- kleine Helfer ---------- */
const ORT_SPRACHE = { de:"de-DE", tr:"tr-TR", pl:"pl-PL", ro:"ro-RO", ar:"ar-SA" };

function esc(x){
  return String(x == null ? "" : x)
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;").replace(/'/g,"&#39;");
}
function uhr(iso){
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d)) return null;
  return d.toLocaleTimeString(ORT_SPRACHE[L] || "de-DE",
    { hour:"2-digit", minute:"2-digit", hour12:false });
}
function datumLang(datum){
  if (!datum) return "";
  const d = new Date(datum + "T12:00:00");
  if (isNaN(d)) return datum;
  return d.toLocaleDateString(ORT_SPRACHE[L] || "de-DE",
    { weekday:"long", day:"2-digit", month:"2-digit" });
}
/* Containernummern in Vierergruppen: leichter vorzulesen und zu vergleichen */
function lueckig(s){
  return String(s || "").replace(/[\s-]/g,"").replace(/(.{4})/g,"$1 ").trim();
}
const minuten = x => Math.max(0, Math.round(x));

/* Welcher Arbeitsschritt ist gerade dran? */
function schrittVon(a){
  if (!a) return 0;
  if (a.status === "angekommen") return 3;   // beim Kunden
  if (a.status === "geladen")    return 2;   // unterwegs zum Kunden
  return 1;                                  // Container abholen
}

/* Wie alt sind die Daten vom Büro? */
function datenAlterMin(Z){
  if (!Z.datenZeit) return null;
  return Math.round((Date.now() - new Date(Z.datenZeit).getTime()) / 60000);
}

/* ---------- Zeitstatus: Symbol, Satz, Farbe als Zugabe ----------
   Eine Farbe allein sagt nichts. Darum immer Symbol und Satz.   */
function zeitstatus(a, Z){
  const r = (a && a.rechnung) || {};
  const alt = datenAlterMin(Z);
  const veraltet = (!Z.online && (alt === null || alt > 5));

  if (veraltet || r.puffer == null || r.ankunft == null) {
    return { klasse:"grau", ico:I.frage(30), satz:t("keineDaten"),
             zusatz:t("keineDatenZusatz") };
  }
  const p = Math.round(r.puffer);
  // Der Hinweis „geschätzt“ steht direkt bei den Uhrzeiten, nicht hier —
  // sonst verdrängt er Termin und Ankunft aus dem sichtbaren Bereich.
  if (r.ampel === "rot" || p < 0)
    return { klasse:"rot", ico:I.warnung(30), satz:t("zuSpaet",{min:minuten(-p)}), zusatz:"" };
  if (r.ampel === "gelb")
    return { klasse:"gelb", ico:I.sanduhr(30), satz:t("knapp",{min:minuten(p)}), zusatz:"" };
  return { klasse:"gruen", ico:I.haken(30), satz:t("rechtzeitig"), zusatz:"" };
}
function statusStreifen(s){
  return `<div class="status ${s.klasse}" role="status">
    <span class="ico">${s.ico}</span>
    <span>${esc(s.satz)}${s.zusatz ? `<span class="zusatz">${esc(s.zusatz)}</span>` : ""}</span>
  </div>`;
}

/* ---------- Bausteine ---------- */
function kopf(Z, opt){
  opt = opt || {};
  const n = (Z.heute || []).length;
  const links = opt.zurueck
    ? `<button class="zweit-btn" data-tun="zurueck">${I.zurueck(22)} ${esc(t("zurueck"))}</button>`
    : `<button class="zweit-btn" data-tun="tagesplan">${I.liste(22)} ${
        esc(n === 1 ? t("heuteEinAuftrag") : t("heuteAuftraege",{n}))}</button>`;
  const vor = vorlesenMoeglich()
    ? `<button class="zweit-btn schmal" data-tun="vorlesen">${I.ton(22)} ${esc(t("vorlesen"))}</button>`
    : "";
  return `<div class="kopf">${links}${vor}</div>`;
}

function netzStreifen(Z){
  let s = "";
  if (!Z.online) {
    const z = uhr(Z.datenZeit);
    s += `<div class="netzstreifen">${I.wolkeAus(26)}
      <span>${esc(z ? t("keinNetzStreifen",{zeit:z}) : t("keinInternet"))}</span></div>`;
  }
  if (Z.offen > 0) {
    s += `<div class="netzstreifen">${I.sanduhr(26)}<span>${
      esc(Z.offen === 1 ? t("einerWartetAufNetz") : t("wartetAufNetz",{n:Z.offen}))
    }</span></div>`;
  }
  return s;
}

function ortBlock(etikett, firma, adresse, torNr){
  return `<div class="ort">
    <div class="etikett">${esc(etikett)}</div>
    <div class="reihe">
      <div class="firma">${esc(firma || t("keineAngabe"))}</div>
      ${torNr ? `<div class="tor">${I.pfeil(20)} ${esc(t("tor"))} ${esc(torNr)}</div>` : ""}
    </div>
    ${adresse ? `<div class="adresse">${esc(adresse)}</div>` : ""}
  </div>`;
}
/* Knappe Ortszeile: beim Kunden steht der Fahrer schon da — Firma und
   Tor genügen, die volle Adresse würde nur Platz für die Zeiten wegnehmen. */
function ortZeile(etikett, firma, torNr){
  return `<div class="ort knapp">
    <div class="etikett">${esc(etikett)}</div>
    <div class="reihe">
      <div class="firma">${esc(firma || t("keineAngabe"))}</div>
      ${torNr ? `<div class="tor">${I.pfeil(20)} ${esc(t("tor"))} ${esc(torNr)}</div>` : ""}
    </div>
  </div>`;
}
function zeitFeld(etikett, wert){
  return `<div><div class="etikett">${esc(etikett)}</div>
    <div class="uhrzeit num">${esc(wert || "—")}</div></div>`;
}
function datenZeile(etikett, wert){
  return `<div class="daten-zeile"><div class="etikett">${esc(etikett)}</div>
    <div class="wert num">${esc(wert || t("keineAngabe"))}</div></div>`;
}

/* Abhol- und Zielangaben: getrennt halten, damit nicht versehentlich
   das Lieferziel als Abholort erscheint. */
function abholort(a){
  return { firma: a.abholFirma || a.abholOrt,
           adresse: a.abholAdresse || (a.abholFirma ? a.abholOrt : ""),
           tor: a.abholTor };
}
function zielort(a){
  return { firma: a.kunde || a.zielOrt,
           adresse: a.zielAdresse || (a.kunde ? a.zielOrt : ""),
           tor: a.zielTor };
}
function naviLink(text, ziel){
  const q = encodeURIComponent(ziel || "");
  return `<a class="zweit-btn" data-tun="navi" target="_blank" rel="noopener"
    href="https://www.google.com/maps/dir/?api=1&destination=${q}">${I.navi(26)} ${esc(text)}</a>`;
}
function aenderungKasten(a){
  if (!a.aenderung || !a.aenderung.punkte || !a.aenderung.punkte.length) return "";
  const fertig = !!a.aenderungGesehen;
  const zeilen = a.aenderung.punkte.map(p => {
    const name = t(p.feld) === p.feld ? p.feld : t(p.feld);
    const neu = (name ? name + " " : "") + p.nach;
    return `<div>${esc(p.von ? t("neuStatt",{neu, alt:(name?name+" ":"")+p.von})
                             : t("neuOhneAlt",{neu}))}</div>`;
  }).join("");
  return `<div class="kasten warn"><span class="ico">${I.stift(26)}</span><div>
    <b>${esc(t("geaendert"))}</b>${zeilen}
    ${fertig
      ? `<div style="margin-top:6px;font-weight:700">${I.haken(22)} ${esc(t("bestaetigt"))}</div>`
      : `<button class="zweit-btn" style="margin-top:10px" data-tun="aenderungGesehen">
           ${I.haken(24)} ${esc(t("gesehenBestaetigen"))}</button>`}
  </div></div>`;
}
function fahrzeugKlapp(Z, a){
  const offen = !!Z.fahrzeugOffen;
  return `<div class="klapp">
    <button class="klapp-kopf" data-tun="fahrzeug" aria-expanded="${offen}">
      ${I.lkw(26)} <span>${esc(t("fahrzeugUndContainer"))}</span>
      <span class="pf">${offen ? I.rauf(24) : I.runter(24)}</span></button>
    ${offen ? `<div class="klapp-inhalt">
      ${datenZeile(t("container"), lueckig(a.container))}
      ${datenZeile(t("chassis"), a.chassis)}
      ${datenZeile(t("zugmaschine"), a.zugmaschine)}
      ${datenZeile(t("siegel"), a.siegel)}
      ${datenZeile(t("auftragsnummer"), a.nummer)}
    </div>` : ""}</div>`;
}
function aktionsLeiste(inhalt){ return `<div class="leiste">${inhalt}</div>`; }
function nebenAktionen(naviHtml){
  return `<div class="zweierreihe">${naviHtml}
    <button class="zweit-btn" data-tun="problem">${I.warnung(26)} ${esc(t("problemMelden"))}</button>
  </div>`;
}
function hauptKnopf(text, ico, aktion, Z){
  return `<button class="haupt-btn" data-tun="${aktion}" ${Z && Z.laeuft ? "disabled" : ""}>
    ${ico} ${esc(Z && Z.laeuft ? t("warte") : text)}</button>`;
}

/* ===========================================================
   Ansicht A — Container abholen
   =========================================================== */
function ansichtAbholen(Z){
  const a = Z.auftrag, r = a.rechnung || {}, o = abholort(a);
  const s = zeitstatus(a, Z);
  return kopf(Z) + `<div class="inhalt">
    ${netzStreifen(Z)}
    <h1 class="titel">${esc(t("jetztAbholen"))}</h1>
    ${statusStreifen(s)}
    ${aenderungKasten(a)}
    ${ortBlock(t("abholenBei"), o.firma, o.adresse, o.tor)}
    <div class="zeiten">
      ${zeitFeld(t("abholzeitAb"), a.abholAb || "—")}
      ${zeitFeld(t("spaetestensLos"), uhr(r.losBis) || "—")}
    </div>
    <div class="hinweis">${esc(t("schaetzung"))}</div>
    ${datenZeile(t("container"), lueckig(a.container))}
    ${datenZeile(t("chassis"), a.chassis)}
    <div class="hinweis">${esc(t("terminBeimKunden",
        { zeit:a.termin || "—", ort:a.zielOrt || t("keineAngabe") }))}</div>
    ${a.notiz ? `<div class="kasten"><span class="ico">${I.info(26)}</span>
        <div>${esc(a.notiz)}</div></div>` : ""}
  </div>` + aktionsLeiste(
    nebenAktionen(naviLink(t("navigation"), o.adresse || o.firma)) +
    hauptKnopf(t("fotoAbholung"), I.kamera(32), "fotoAbholung", Z));
}

/* ===========================================================
   Ansicht B — Zum Kunden fahren
   =========================================================== */
function ansichtFahren(Z){
  const a = Z.auftrag, r = a.rechnung || {}, o = zielort(a);
  const s = zeitstatus(a, Z);
  const ank = uhr(r.ankunft);
  const p = r.puffer == null ? null : Math.round(r.puffer);
  return kopf(Z) + `<div class="inhalt">
    ${netzStreifen(Z)}
    <h1 class="titel">${esc(t("jetztFahren"))}</h1>
    ${statusStreifen(s)}
    ${aenderungKasten(a)}
    ${ortBlock(t("ziel"), o.firma, o.adresse, o.tor)}
    <div class="zeiten">
      ${zeitFeld(t("termin"), a.termin || "—")}
      ${zeitFeld(t("ankunftEtwa"), ank || "—")}
    </div>
    <div class="hinweis">${p != null && ank && p >= 0
      ? esc((p > 0 ? t("minutenVorher",{min:p}) : t("punktgenau")) + " · " + t("schaetzung"))
      : esc(t("schaetzung"))}</div>
    ${a.notiz ? `<div class="kasten"><span class="ico">${I.info(26)}</span>
        <div>${esc(a.notiz)}</div></div>` : ""}
    ${fahrzeugKlapp(Z, a)}
    <div class="hinweis">${esc(t("nurAnkunft"))}</div>
  </div>` + aktionsLeiste(
    nebenAktionen(naviLink(t("navigation"), o.adresse || o.firma)) +
    hauptKnopf(t("amZielAngekommen"), I.haken(32), "ankunft", Z));
}

/* ===========================================================
   Ansicht C — Beim Kunden
   Der Aufenthalt ist keine abrechenbare Wartezeit, und das Warten
   allein sagt nichts über den nächsten Termin.
   =========================================================== */
function ansichtBeimKunden(Z){
  const a = Z.auftrag, r = a.rechnung || {}, o = zielort(a);
  const s = zeitstatus(a, Z);
  const seit = r.wartetSeit != null ? minuten(r.wartetSeit) : null;
  const naechste = (Z.heute || []).find(x => x.id !== a.id && x.status !== "fertig");
  let danach = "";
  if (naechste) {
    const ns = zeitstatus(naechste, Z);
    danach = `<div class="kasten"><span class="ico">${I.uhr(26)}</span><div>
      <b>${esc(t("naechsterAuftrag",{ort:naechste.zielOrt || t("keineAngabe")}))}</b>
      <div>${esc(t("termin"))}: ${esc(naechste.termin || "—")} · ${esc(ns.satz)}</div></div></div>`;
  }
  return kopf(Z) + `<div class="inhalt">
    ${netzStreifen(Z)}
    <h1 class="titel">${esc(t("jetztBeimKunden"))}</h1>
    ${statusStreifen(s)}
    ${ortZeile(t("ziel"), o.firma, o.tor)}
    <div class="zeiten">
      ${zeitFeld(t("ankunft"), uhr(a.ankunftZeit) || "—")}
      ${zeitFeld(t("termin"), a.termin || "—")}
    </div>
    ${seit != null ? `<div class="zeile"><span class="ico">${I.sanduhr(28)}</span>
      <div class="txt"><div class="wert">${esc(t("vorOrtSeit",{min:seit}))}</div>
      <div class="etikett">${esc(t("wartehinweis"))}</div></div></div>` : ""}
    ${datenZeile(t("container"), lueckig(a.container))}
    ${danach}
    ${a.notiz ? `<div class="kasten"><span class="ico">${I.info(26)}</span>
        <div>${esc(a.notiz)}</div></div>` : ""}
  </div>` + aktionsLeiste(
    nebenAktionen(`<button class="zweit-btn" data-tun="fahrzeug">${I.lkw(26)} ${
      esc(t("fahrzeug"))}</button>`) +
    hauptKnopf(t("fotoAbgabe"), I.kamera(32), "fotoAbgabe", Z));
}

/* ===========================================================
   Ansicht D — Auftrag abgeschlossen
   =========================================================== */
function ansichtAbschluss(Z){
  const b = Z.abschluss || {}, n = b.naechster;
  let nHtml = "", knopf;
  if (n) {
    const p = n.puffer == null ? null : Math.round(n.puffer);
    const klasse = n.ampel === "rot" ? "rot" : (n.ampel === "gelb" ? "gelb" : "gruen");
    const satz = p == null ? t("keineDaten")
      : (p < 0 ? t("zuSpaet",{min:minuten(-p)})
              : (n.ampel === "gelb" ? t("knapp",{min:minuten(p)}) : t("rechtzeitig")));
    const ico = klasse === "rot" ? I.warnung(30) : (klasse === "gelb" ? I.sanduhr(30) : I.haken(30));
    nHtml = `<h2 class="titel" style="font-size:24px">${
        esc(t("naechsterAuftrag",{ort:n.zielOrt || t("keineAngabe")}))}</h2>
      <div class="zeiten">
        ${zeitFeld(t("termin"), n.termin || "—")}
        ${zeitFeld(t("ankunftEtwa"), uhr(n.ankunft) || "—")}
      </div>
      ${statusStreifen({ klasse, ico, satz, zusatz:"" })}
      <div class="hinweis">${esc(t("schaetzung"))}</div>
      ${klasse === "rot" ? `<div class="hinweis">${esc(t("bueroSiehtVerspaetung"))}</div>` : ""}`;
    knopf = hauptKnopf(t("naechstenAnsehen"), I.pfeil(30), "naechster", Z);
  } else {
    nHtml = `<div class="hinweis">${esc(t("keinWeiterer"))}</div>`;
    knopf = hauptKnopf(t("tagFertigAnsehen"), I.liste(30), "tagesplan", Z);
  }
  return kopf(Z) + `<div class="inhalt">
    ${netzStreifen(Z)}
    <div class="ergebnis"><span class="ico">${I.haken(40)}</span><div>
      <div class="w">${esc(t("auftragAbgeschlossen"))}</div>
      <div class="u">${esc(t("abgeliefertUm",{ ort:b.ort || t("keineAngabe"),
                                               zeit:uhr(b.zeit) || "—" }))}</div>
    </div></div>
    ${nHtml}
  </div>` + aktionsLeiste(knopf);
}

/* ===========================================================
   Fotoablauf — Anweisung, Vorschau, Ergebnis
   =========================================================== */
function ansichtFoto(Z){
  const f = Z.foto || {}, abgabe = f.art === "abgabe";
  const titel = abgabe ? t("fotoTitelAbgabe") : t("fotoTitelAbholung");
  const a = Z.auftrag || {};

  if (f.bild) {                                   /* Vorschau */
    return kopf(Z, {zurueck:true}) + `<div class="inhalt">
      <h1 class="titel">${esc(titel)}</h1>
      <img class="vorschaubild" src="${esc(f.bild)}" alt="${esc(titel)}">
      ${datenZeile(t("container"), lueckig(a.container))}
      <div class="hinweis">${esc(t("schadenHinweis"))}</div>
    </div>` + aktionsLeiste(`
      <div class="zweierreihe">
        <button class="zweit-btn" data-tun="fotoNeu">${I.kamera(26)} ${esc(t("fotoNeu"))}</button>
        <button class="zweit-btn leise" data-tun="fotoAbbrechen">${I.kreuz(26)} ${esc(t("abbrechen"))}</button>
      </div>
      ${hauptKnopf(t("fotoVerwenden"), I.haken(32), "fotoVerwenden", Z)}`);
  }
  /* Anweisung */
  return kopf(Z, {zurueck:true}) + `<div class="inhalt">
    <h1 class="titel">${esc(titel)}</h1>
    <div class="kasten"><span class="ico">${I.kamera(28)}</span>
      <div>${esc(abgabe ? t("anweisungAbgabe") : t("anweisungAbholung"))}</div></div>
    ${datenZeile(t("container"), lueckig(a.container))}
    <div class="hinweis">${esc(t("abbrechenHinweis"))}</div>
    <button class="zweit-btn leise" data-tun="kamerahilfe">${I.frage(26)} ${esc(t("kameraGehtNicht"))}</button>
  </div>` + aktionsLeiste(
    `<button class="zweit-btn leise" data-tun="fotoAbbrechen">${I.kreuz(26)} ${esc(t("abbrechen"))}</button>` +
    hauptKnopf(t("kameraOeffnen"), I.kamera(32), "kamera", Z));
}

function ansichtErgebnis(Z){
  const e = Z.ergebnis || {};
  const klasse = e.typ === "gespeichert" ? "" : (e.typ === "wartet" ? "wartet" : "fehler");
  const ico = e.typ === "gespeichert" ? I.haken(40)
            : (e.typ === "wartet" ? I.sanduhr(40) : I.warnung(40));
  let wort, unten;
  if (e.typ === "gespeichert") {
    wort = e.art === "abgabe" ? t("abgabeGebucht")
         : (e.art === "abholung" ? t("abholungGebucht") : t("fotoGespeichert"));
    unten = "";
  } else if (e.typ === "wartet") {
    wort = t("nochNichtGesendet") + " – " + t("keinInternet");
    unten = t("bleibtAufHandy");
  } else {
    wort = t("sendenFehlgeschlagen");
    unten = t("sendenFehlerText");
  }
  return kopf(Z) + `<div class="inhalt">
    ${netzStreifen(Z)}
    <div class="ergebnis ${klasse}"><span class="ico">${ico}</span><div>
      <div class="w">${esc(wort)}</div>
      <div class="z num">${esc(uhr(e.zeit) || "")}</div>
      ${unten ? `<div class="u">${esc(unten)}</div>` : ""}
    </div></div>
  </div>` + aktionsLeiste(
    (e.typ === "fehler"
      ? `<button class="zweit-btn" data-tun="nochmalSenden">${I.pfeil(26)} ${esc(t("nochmalSenden"))}</button>`
      : "") +
    hauptKnopf(t("zurueckZumAuftrag"), I.zurueck(30), "zurueck", Z));
}

function ansichtKamerahilfe(Z){
  const tel = (Z.einst && Z.einst.bueroTelefon) || "";
  return kopf(Z, {zurueck:true}) + `<div class="inhalt">
    <h1 class="titel">${esc(t("kameraHilfeTitel"))}</h1>
    <div class="kasten"><span class="ico">${I.info(28)}</span><div>${esc(t("kameraHilfeText"))}</div></div>
    <div class="hinweis">${esc(t("kameraHilfeText2"))}</div>
    ${tel ? `<a class="zweit-btn" href="tel:${esc(tel)}">${I.telefon(26)} ${esc(t("bueroAnrufen"))}</a>` : ""}
  </div>` + aktionsLeiste(hauptKnopf(t("zurueck"), I.zurueck(30), "zurueck", Z));
}

/* ===========================================================
   Sicherer Stand — ehrlich: die App kann das nicht messen
   =========================================================== */
function ansichtStand(Z){
  return kopf(Z, {zurueck:true}) + `<div class="inhalt">
    <h1 class="titel">${esc(t("standTitel"))}</h1>
    <div class="kasten warn"><span class="ico">${I.warnung(28)}</span>
      <div>${esc(t("standText"))}</div></div>
  </div>` + aktionsLeiste(
    `<button class="zweit-btn leise" data-tun="zurueck">${I.zurueck(26)} ${esc(t("standNein"))}</button>` +
    hauptKnopf(t("standJa"), I.haken(32), "standJa", Z));
}

/* ===========================================================
   Problem melden
   =========================================================== */
const PROBLEME = [
  { art:"stau",           wort:"stau",           ico:()=>I.kegel(30) },
  { art:"warten",         wort:"mussWarten",     ico:()=>I.sanduhr(30) },
  { art:"containerFehlt", wort:"containerFehlt", ico:()=>I.box(30) },
  { art:"panne",          wort:"panne",          ico:()=>I.schrauben(30) }
];
function problemWort(art){
  const p = PROBLEME.find(x => x.art === art);
  return p ? t(p.wort) : art;
}
function ansichtProblem(Z){
  const tel = (Z.einst && Z.einst.bueroTelefon) || "";
  return kopf(Z, {zurueck:true}) + `<div class="inhalt">
    <h1 class="titel">${esc(t("wasIstPassiert"))}</h1>
    ${PROBLEME.map(p => `<button class="wahl-btn" data-tun="problemWahl" data-art="${p.art}">
       <span class="ico">${p.ico()}</span> ${esc(t(p.wort))}</button>`).join("")}
    ${tel ? `<a class="wahl-btn" href="tel:${esc(tel)}"><span class="ico">${I.telefon(30)}</span>
       ${esc(t("bueroAnrufen"))}</a>`
          : `<div class="kasten"><span class="ico">${I.telefon(26)}</span>
       <div>${esc(t("bueroAnrufen"))}: ${esc(t("keineNummer"))}</div></div>`}
  </div>` + aktionsLeiste(
    `<button class="zweit-btn" data-tun="zurueck">${I.zurueck(26)} ${esc(t("zurueckZumAuftrag"))}</button>`);
}
function ansichtProblemFrage(Z){
  const art = (Z.problem || {}).art;
  return kopf(Z, {zurueck:true}) + `<div class="inhalt">
    <h1 class="titel">${esc(t("meldenFrage",{was:problemWort(art)}))}</h1>
    <div class="hinweis">${esc(t("meldenStandHinweis"))}</div>
  </div>` + aktionsLeiste(
    `<button class="zweit-btn" data-tun="problem">${I.zurueck(26)} ${esc(t("zurueck"))}</button>` +
    hauptKnopf(t("melden"), I.pfeil(30), "problemSenden", Z));
}
function ansichtProblemErgebnis(Z){
  const e = Z.problemErgebnis || {};
  const klasse = e.typ === "gesendet" ? "" : (e.typ === "wartet" ? "wartet" : "fehler");
  const ico = e.typ === "gesendet" ? I.haken(40)
            : (e.typ === "wartet" ? I.sanduhr(40) : I.warnung(40));
  const wort = e.typ === "gesendet" ? t("meldungGesendet")
             : (e.typ === "wartet" ? t("meldungWartet") : t("meldungFehler"));
  const unten = e.typ === "gesendet"
    ? (e.gelesen ? t("meldungGelesen") : t("meldungNichtGelesen"))
    : (e.typ === "wartet" ? t("bleibtAufHandy") : t("sendenFehlerText"));
  return kopf(Z) + `<div class="inhalt">
    ${netzStreifen(Z)}
    <div class="ergebnis ${klasse}"><span class="ico">${ico}</span><div>
      <div class="w">${esc(problemWort(e.art))}: ${esc(wort)}</div>
      <div class="z num">${esc(uhr(e.zeit) || "")}</div>
      <div class="u">${esc(unten)}</div>
    </div></div>
  </div>` + aktionsLeiste(
    (e.typ === "fehler"
      ? `<button class="zweit-btn" data-tun="problemSenden">${I.pfeil(26)} ${esc(t("nochmalSenden"))}</button>`
      : "") +
    hauptKnopf(t("zurueckZumAuftrag"), I.zurueck(30), "zurueck", Z));
}

/* ===========================================================
   Tagesplan und Sprache
   =========================================================== */
function statusWort(a, jetzt){
  if (a.status === "fertig")     return { wort:t("statusFertig"), klasse:"fertig", ico:I.haken(20) };
  if (a === jetzt)               return { wort:t("statusJetzt"),  klasse:"jetzt",  ico:I.pfeil(20) };
  if (a.status === "geladen")    return { wort:t("statusUnterwegs"), klasse:"offen", ico:I.lkw(20) };
  if (a.status === "angekommen") return { wort:t("statusBeimKunden"), klasse:"offen", ico:I.sanduhr(20) };
  return { wort:t("statusOffen"), klasse:"offen", ico:I.uhr(20) };
}
function ansichtTagesplan(Z){
  const liste = Z.heute || [];
  const jetzt = liste.find(a => a.status !== "fertig");
  const m = Z.morgen || [];
  const alleFertig = liste.length > 0 && !jetzt;
  return kopf(Z, {zurueck:true}) + `<div class="inhalt">
    ${netzStreifen(Z)}
    <h1 class="titel">${esc(t("tagesplan"))}</h1>
    ${liste.length ? liste.map(a => {
      const s = statusWort(a, jetzt);
      return `<div class="tagzeile">
        <div class="zt num">${esc(a.termin || "—")}</div>
        <div class="wo">${esc(a.kunde || a.zielOrt || t("keineAngabe"))}
          ${a.zielOrt && a.kunde ? `<div class="etikett">${esc(a.zielOrt)}</div>` : ""}</div>
        <span class="marke ${s.klasse}">${s.ico} ${esc(s.wort)}</span></div>`;
    }).join("") : `<div class="hinweis">${esc(t("nichtsHeute"))}</div>`}
    ${alleFertig ? `<div class="kasten"><span class="ico">${I.haken(26)}</span>
        <div>${esc(t("heuteFertig"))}</div></div>` : ""}
    ${alleFertig && m.length ? morgenBlock(m) : ""}
    <div class="hinweis">${Z.online
      ? esc(t("standVon",{zeit:uhr(Z.datenZeit) || "—"}))
      : esc(t("keinNetzStreifen",{zeit:uhr(Z.datenZeit) || "—"}))}</div>
    ${Z.offen ? "" : `<div class="hinweis">${I.haken(22)} ${esc(t("alleGesendet"))}</div>`}
    <button class="zweit-btn" data-tun="sprache">${I.globus(26)} ${
      esc(t("sprache"))}: ${esc(SPRACHNAME[L])}</button>
    <button class="install" id="install" onclick="installieren()"></button>
  </div>` + aktionsLeiste(
    `<button class="haupt-btn" data-tun="zurueck">${I.zurueck(30)} ${esc(t("zurueckZumAuftrag"))}</button>`);
}
function morgenBlock(m){
  const erster = m[0] || {};
  return `<div class="kasten warn"><span class="ico">${I.wecker(26)}</span><div>
    <b>${esc(t("morgenVorschau",{datum:datumLang(erster.datum)}))}</b>
    ${m.map(x => `<div>${esc(x.termin || "—")} · ${esc(x.kunde || x.zielOrt || "")}</div>`).join("")}
    <div style="margin-top:6px">${esc(t("morgenHinweis"))}</div></div></div>`;
}
function ansichtSprache(Z){
  return kopf(Z, {zurueck:true}) + `<div class="inhalt">
    <h1 class="titel">${esc(t("spracheWaehlen"))}</h1>
    ${Object.keys(SPRACHNAME).map(k => `<button class="sprach-btn" data-tun="spracheSetzen"
      data-k="${k}" aria-pressed="${k === L}" lang="${k}">
      <span class="fl" aria-hidden="true">${FLAGGE[k]}</span> ${esc(SPRACHNAME[k])}
      ${k === L ? `<span class="ha">${I.haken(26)}</span>` : ""}</button>`).join("")}
    ${vorlesenMoeglich() ? "" : `<div class="hinweis">${esc(t("vorlesenGehtNicht"))}</div>`}
  </div>` + aktionsLeiste(
    `<button class="haupt-btn" data-tun="zurueck">${I.zurueck(30)} ${esc(t("zurueck"))}</button>`);
}

/* ===========================================================
   Feierabend, Laden, kein Netz
   =========================================================== */
function ansichtFeierabend(Z){
  const m = Z.morgen || [];
  return kopf(Z) + `<div class="inhalt">
    ${netzStreifen(Z)}
    <div class="ergebnis"><span class="ico">${I.haken(40)}</span><div>
      <div class="w">${esc(t("heuteFertig"))}</div></div></div>
    ${m.length ? morgenBlock(m) : `<div class="hinweis">${esc(t("nichtsHeute"))}</div>`}
    <button class="install" id="install" onclick="installieren()"></button>
  </div>` + aktionsLeiste(
    `<button class="haupt-btn" data-tun="tagesplan">${I.liste(30)} ${esc(t("tagFertigAnsehen"))}</button>`);
}
function ansichtLaden(){
  return `<div class="inhalt"><div class="laedt">…</div></div>`;
}
function ansichtKeinNetz(Z){
  return kopf(Z) + `<div class="inhalt">
    <div class="ergebnis fehler"><span class="ico">${I.wolkeAus(40)}</span><div>
      <div class="w">${esc(t("keinInternet"))}</div>
      <div class="u">${esc(t("keinNetzLaden"))}</div></div></div>
  </div>` + aktionsLeiste(
    hauptKnopf(t("nochmalLaden"), I.pfeil(30), "nochmalLaden", Z));
}

/* ===========================================================
   Hauptfunktion: Zustand hinein, Bildschirm heraus
   =========================================================== */
function zeichne(Z){
  switch (Z.ansicht) {
    case "laden":           return ansichtLaden(Z);
    case "keinNetz":        return ansichtKeinNetz(Z);
    case "foto":            return ansichtFoto(Z);
    case "ergebnis":        return ansichtErgebnis(Z);
    case "kamerahilfe":     return ansichtKamerahilfe(Z);
    case "stand":           return ansichtStand(Z);
    case "abschluss":       return ansichtAbschluss(Z);
    case "problem":         return ansichtProblem(Z);
    case "problemFrage":    return ansichtProblemFrage(Z);
    case "problemErgebnis": return ansichtProblemErgebnis(Z);
    case "tagesplan":       return ansichtTagesplan(Z);
    case "sprache":         return ansichtSprache(Z);
    case "feierabend":      return ansichtFeierabend(Z);
  }
  if (!Z.auftrag) return ansichtFeierabend(Z);
  const s = schrittVon(Z.auftrag);
  return s === 3 ? ansichtBeimKunden(Z) : (s === 2 ? ansichtFahren(Z) : ansichtAbholen(Z));
}

/* ---------- Vorlesetext: Ziel, Termin, Zeitstatus, nächste Handlung ----------
   Kurze Sätze, keine Abkürzungen, keine Fachwörter.             */
function vorlesetext(Z){
  const a = Z.auftrag;
  if (Z.ansicht === "problem" || Z.ansicht === "problemFrage")
    return t("wasIstPassiert");
  if (Z.ansicht === "problemErgebnis") {
    const e = Z.problemErgebnis || {};
    return problemWort(e.art) + ". " +
      (e.typ === "gesendet" ? t("meldungGesendet") : (e.typ === "wartet" ? t("meldungWartet") : t("meldungFehler")));
  }
  if (Z.ansicht === "ergebnis") {
    const e = Z.ergebnis || {};
    return e.typ === "gespeichert" ? t("fotoGespeichert")
         : (e.typ === "wartet" ? t("nochNichtGesendet") + ". " + t("bleibtAufHandy")
                               : t("sendenFehlgeschlagen") + ". " + t("sendenFehlerText"));
  }
  if (Z.ansicht === "foto") {
    const f = Z.foto || {};
    return f.art === "abgabe" ? t("anweisungAbgabe") : t("anweisungAbholung");
  }
  if (Z.ansicht === "abschluss") {
    const b = Z.abschluss || {}, n = b.naechster;
    let s = t("auftragAbgeschlossen") + ". ";
    if (n) {
      const p = n.puffer == null ? null : Math.round(n.puffer);
      s += t("naechsterAuftrag",{ort:n.zielOrt || ""}) + ". " +
           t("termin") + " " + (n.termin || "") + ". " +
           t("ankunftEtwa") + " " + (uhr(n.ankunft) || "") + ". " +
           (p == null ? t("keineDaten")
                      : (p < 0 ? t("zuSpaet",{min:minuten(-p)}) : t("rechtzeitig")));
    } else s += t("keinWeiterer");
    return s;
  }
  if (Z.ansicht === "tagesplan") {
    const liste = Z.heute || [];
    return (liste.length === 1 ? t("heuteEinAuftrag") : t("heuteAuftraege",{n:liste.length})) + ". " +
      liste.map(x => (x.termin || "") + " " + (x.kunde || x.zielOrt || "")).join(". ");
  }
  if (!a) return t("heuteFertig");

  const r = a.rechnung || {}, s = zeitstatus(a, Z), schritt = schrittVon(a);
  let text = "";
  if (schritt === 1) {
    const o = abholort(a);
    text += t("jetztAbholen") + ". " + t("abholenBei") + " " + (o.firma || "") + ". " +
            (o.adresse ? o.adresse + ". " : "") +
            (o.tor ? t("tor") + " " + o.tor + ". " : "") +
            (a.abholAb ? t("abholzeitAb") + " " + a.abholAb + ". " : "") +
            t("terminBeimKunden",{ zeit:a.termin || "", ort:a.zielOrt || "" }) + ". " +
            t("container") + " " + lueckig(a.container) + ". ";
  } else if (schritt === 2) {
    const o = zielort(a);
    text += t("jetztFahren") + ". " + (o.firma || "") + ". " + (o.adresse ? o.adresse + ". " : "") +
            (o.tor ? t("tor") + " " + o.tor + ". " : "") +
            t("termin") + " " + (a.termin || "") + ". " +
            (uhr(r.ankunft) ? t("ankunftEtwa") + " " + uhr(r.ankunft) + ". " : "");
  } else {
    const o = zielort(a);
    text += t("jetztBeimKunden") + ". " + (o.firma || "") + ". " +
            (uhr(a.ankunftZeit) ? t("ankunft") + " " + uhr(a.ankunftZeit) + ". " : "") +
            (r.wartetSeit != null ? t("vorOrtSeit",{min:minuten(r.wartetSeit)}) + ". " : "");
  }
  text += s.satz + ". ";
  if (a.notiz) text += a.notiz + ". ";
  text += schritt === 1 ? t("fotoAbholung") : (schritt === 2 ? t("amZielAngekommen") : t("fotoAbgabe"));
  return text;
}

return { zeichne, vorlesetext, schrittVon, problemWort, PROBLEME, uhr, lueckig, esc, zeitstatus };
})();

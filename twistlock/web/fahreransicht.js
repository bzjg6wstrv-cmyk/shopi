/* ===========================================================
   TWISTLOCK — Fahreransichten für I&M CARGO

   Dieses Modul baut nur Bildschirme aus einem Zustand. Es ruft
   selbst nichts ab und speichert nichts. Dadurch benutzen die
   echte App (fahrer.html) und die Demo-Vorschau (vorschau.html)
   dieselbe Darstellung.

   Jede Schaltfläche trägt data-tun="name". Die Seite, die das
   Modul benutzt, hört auf Klicks und führt die Aktion aus.

   Aufbau jeder Ansicht:
     Kopf     — Heute, Problem melden, Vorlesen (immer gleich)
     Inhalt   — ein kurzer Satz, dann die wichtigen Angaben
     Leiste   — eine Hauptaktion, darunter höchstens eine zweite
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
const nummer = s => (typeof TL_CONTAINER !== "undefined" ? TL_CONTAINER.lesbar(s) : String(s || ""));
const minuten = x => Math.max(0, Math.round(x));

/* Welcher Arbeitsschritt ist gerade dran? */
function schrittVon(a){
  if (!a) return 0;
  return { geladen:2, angekommen:3, warten:4, entladen:5, entladen_fertig:6 }[a.status] || 1;
}
function datenAlterMin(Z){
  if (!Z.datenZeit) return null;
  return Math.round((Date.now() - new Date(Z.datenZeit).getTime()) / 60000);
}

/* ---------- Zeitstatus ----------
   Reserve = Kundentermin minus erwartete Ankunft.
     mehr als 10 Minuten  → grün
     0 bis 10 Minuten     → orange
     weniger als 0        → rot
     keine Daten          → grau
   Farbe ist nie die einzige Information: immer Symbol und Satz.   */
function zeitstatus(r, Z){
  const grenze  = (Z.einst && Z.einst.gruenAb != null) ? Z.einst.gruenAb : TL_ZEIT.GRENZE_ORANGE;
  const maxAlter = (Z.einst && Z.einst.maxDatenAlterMin != null)
                   ? Z.einst.maxDatenAlterMin : TL_ZEIT.MAX_ALTER;
  // Auch mit Internet können die Daten alt sein. Dann wird nichts Grünes gezeigt.
  const veraltet = TL_ZEIT.veraltet(Z.datenZeit, maxAlter);

  if (veraltet || !r || r.unsicher || r.puffer == null || !r.ankunft) {
    const zusatz = veraltet
      ? t("letzteAktualisierung", { zeit: uhr(Z.datenZeit) || "—" })
      : (r && r.unsicher ? t("endeOffen") : "");
    return { klasse:"grau", ico:I.frage(28), satz:t("keineDaten"), zusatz, veraltet:true };
  }

  const p = Math.round(r.puffer);
  const k = TL_ZEIT.status(p, grenze);
  if (k === "rot")
    return { klasse:"rot", ico:I.warnung(28), satz:t("zuSpaet",{min:minuten(-p)}), zusatz:"" };
  if (k === "gelb")
    return { klasse:"gelb", ico:I.sanduhr(28), satz:t("knapp",{min:minuten(p)}), zusatz:"" };
  return { klasse:"gruen", ico:I.haken(28), satz:t("reserve",{min:minuten(p)}), zusatz:"" };
}

/* Ab der Alarmschwelle weiß das Büro Bescheid. Das sagt die App dem Fahrer,
   damit er keinen Druck verspürt, schneller zu fahren. */
function alarmHinweis(r, Z){
  if (!r || r.puffer == null) return "";
  const schwelle = (Z.einst && Z.einst.verspaetungAb != null)
    ? Z.einst.verspaetungAb : TL_ZEIT.GRENZE_ALARM;
  if (!TL_ZEIT.alarmNoetig(Math.round(r.puffer), schwelle)) return "";
  return `<div class="hinweis">${esc(t("bueroSiehtVerspaetung"))}</div>`;
}

/* Wenn die Daten alt sind und das Büro schon gewarnt wurde, bleibt die
   Warnung stehen — sie ist nicht erledigt, nur weil nichts Neues da ist. */
function warnungKasten(a, s){
  if (!s.veraltet || !a || !a.gemeldet) return "";
  return `<div class="kasten warn"><span class="ico">${I.warnung(24)}</span>
    <div>${esc(t("warnungBleibt"))}</div></div>`;
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
  const links = opt.zurueck
    ? `<button class="zweit-btn" data-tun="zurueck">${I.zurueck(22)} ${esc(t("zurueck"))}</button>`
    : `<button class="zweit-btn" data-tun="problem">${I.warnung(22)} ${esc(t("problemMelden"))}</button>`;
  const vor = vorlesenMoeglich()
    ? `<button class="zweit-btn schmal" data-tun="vorlesen">${I.ton(22)} ${esc(t("vorlesen"))}</button>`
    : "";
  return `<div class="kopf">${links}${vor}</div>`;
}

/* „Heute“ steht oben im Inhalt: gut sichtbar, ohne die Kopfzeile zu überladen. */
function heuteZeile(Z){
  const n = (Z.heute || []).length;
  return `<button class="heute-btn" data-tun="tagesplan">${I.liste(22)}
    <span>${esc(t("heuteZahl",{n}))}</span>${I.pfeil(20)}</button>`;
}

function netzStreifen(Z){
  let s = "";
  if (Z.bestaetigung) {
    s += `<div class="bestaetigung">${I.haken(24)}<span>${esc(Z.bestaetigung)}</span></div>`;
  }
  if (!Z.online) {
    const z = uhr(Z.datenZeit);
    s += `<div class="netzstreifen">${I.wolkeAus(24)}
      <span>${esc(z ? t("keinNetzStreifen",{zeit:z}) : t("keinInternet"))}</span></div>`;
  }
  if (Z.offen > 0) {
    s += `<div class="netzstreifen">${I.sanduhr(24)}<span>${
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
function ortZeile(etikett, firma, torNr){
  return `<div class="ort knapp">
    <div class="etikett">${esc(etikett)}</div>
    <div class="reihe">
      <div class="firma">${esc(firma || t("keineAngabe"))}</div>
      ${torNr ? `<div class="tor">${I.pfeil(20)} ${esc(t("tor"))} ${esc(torNr)}</div>` : ""}
    </div>
  </div>`;
}
function zeitFeld(etikett, wert, farbe, unten){
  return `<div><div class="etikett">${esc(etikett)}</div>
    <div class="uhrzeit num ${farbe || ""}">${esc(wert || "—")}</div>
    ${unten ? `<div class="unter-zeit ${farbe || ""}">${unten.ico || ""} ${esc(unten.satz)}</div>` : ""}</div>`;
}
function datenZeile(etikett, wert){
  return `<div class="daten-zeile"><div class="etikett">${esc(etikett)}</div>
    <div class="wert num">${esc(wert || t("keineAngabe"))}</div></div>`;
}
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
    href="https://www.google.com/maps/dir/?api=1&destination=${q}">${I.navi(24)} ${esc(text)}</a>`;
}
function aenderungKasten(a){
  if (!a.aenderung || !a.aenderung.punkte || !a.aenderung.punkte.length) return "";
  const fertig = !!a.aenderungGesehen;
  const zeilen = a.aenderung.punkte.map(p => {
    const name = t(p.feld) === p.feld ? p.feld : t(p.feld);
    return `<div>${esc(t("neuIst",{ was:name, wert:p.nach }))}</div>`;
  }).join("");
  return `<div class="kasten warn"><span class="ico">${I.stift(24)}</span><div>
    <b>${esc(t("geaendert"))}</b>${zeilen}
    ${fertig
      ? `<div style="margin-top:6px;font-weight:700">${I.haken(20)} ${esc(t("bestaetigt"))}</div>`
      : `<button class="zweit-btn" style="margin-top:10px" data-tun="aenderungGesehen">
           ${I.haken(22)} ${esc(t("gesehenBestaetigen"))}</button>`}
  </div></div>`;
}
function fahrzeugKlapp(Z, a){
  const offen = !!Z.fahrzeugOffen;
  return `<div class="klapp">
    <button class="klapp-kopf" data-tun="fahrzeug" aria-expanded="${offen}">
      ${I.lkw(24)} <span>${esc(t("fahrzeugUndContainer"))}</span>
      <span class="pf">${offen ? I.rauf(22) : I.runter(22)}</span></button>
    ${offen ? `<div class="klapp-inhalt">
      ${datenZeile(t("container"), nummer(a.container))}
      ${a.containerBestaetigt && a.containerBestaetigt !== a.container
        ? datenZeile(t("abgeholteNummer"), nummer(a.containerBestaetigt)) : ""}
      ${datenZeile(t("chassis"), a.chassis)}
      ${datenZeile(t("zugmaschine"), a.zugmaschine)}
      ${datenZeile(t("siegel"), a.siegel)}
      ${datenZeile(t("auftragsnummer"), a.nummer)}
    </div>` : ""}</div>`;
}
/* Eine Hauptaktion, darunter höchstens eine zweite. */
function leiste(haupt, zweit){
  return `<div class="leiste">${haupt}${zweit || ""}</div>`;
}
function hauptKnopf(text, ico, aktion, Z){
  return `<button class="haupt-btn" data-tun="${aktion}" ${Z && Z.laeuft ? "disabled" : ""}>
    ${ico} ${esc(Z && Z.laeuft ? t("warte") : text)}</button>`;
}
function zweitKnopf(text, ico, aktion){
  return `<button class="zweit-btn" data-tun="${aktion}">${ico} ${esc(text)}</button>`;
}

/* ===========================================================
   A — Container abholen
   =========================================================== */
function ansichtAbholen(Z){
  const a = Z.auftrag, r = a.rechnung || {}, o = abholort(a);
  return kopf(Z) + `<div class="inhalt">
    ${netzStreifen(Z)}
    ${heuteZeile(Z)}
    <h1 class="titel">${esc(t("jetztAbholen"))}</h1>
    ${aenderungKasten(a)}
    ${ortBlock(t("abholenBei"), o.firma, o.adresse, o.tor)}
    <div class="zeiten">
      ${zeitFeld(t("abholzeitAb"), a.abholAb || "—")}
      ${zeitFeld(t("spaetestensLos"), uhr(r.losBis) || "—")}
    </div>
    ${datenZeile(t("container"), nummer(a.container))}
    ${datenZeile(t("chassis"), a.chassis)}
    <div class="hinweis">${esc(t("terminBeimKunden",
        { zeit:a.termin || "—", ort:a.zielOrt || t("keineAngabe") }))}</div>
    ${a.notiz ? `<div class="kasten"><span class="ico">${I.info(24)}</span>
        <div>${esc(a.notiz)}</div></div>` : ""}
  </div>` + leiste(
    hauptKnopf(t("fotoAbholung"), I.kamera(30), "fotoAbholung", Z),
    naviLink(t("navigation"), o.adresse || o.firma));
}

/* ===========================================================
   B — Zum Kunden fahren
   =========================================================== */
function ansichtFahren(Z){
  const a = Z.auftrag, r = a.rechnung || {}, o = zielort(a);
  const s = zeitstatus(r, Z);
  return kopf(Z) + `<div class="inhalt">
    ${netzStreifen(Z)}
    ${heuteZeile(Z)}
    <h1 class="titel">${esc(t("jetztFahren"))}</h1>
    ${statusStreifen(s)}
    ${warnungKasten(a, s)}
    ${aenderungKasten(a)}
    ${ortBlock(t("ziel"), o.firma, o.adresse, o.tor)}
    <div class="zeiten">
      ${zeitFeld(t("termin"), a.termin || "—")}
      ${zeitFeld(t("ankunftEtwa"), uhr(r.ankunft) || "—", s.klasse)}
    </div>
    <div class="hinweis">${esc(t("schaetzung"))}</div>
    ${alarmHinweis(r, Z)}
    ${a.notiz ? `<div class="kasten"><span class="ico">${I.info(24)}</span>
        <div>${esc(a.notiz)}</div></div>` : ""}
    ${fahrzeugKlapp(Z, a)}
    <div class="hinweis">${esc(t("nurAnkunft"))}</div>
  </div>` + leiste(
    hauptKnopf(t("amZielAngekommen"), I.haken(30), "ankunft", Z),
    naviLink(t("navigation"), o.adresse || o.firma));
}

/* ===========================================================
   C1 — Beim Kunden angekommen
   =========================================================== */
function ansichtBeimKunden(Z){
  const a = Z.auftrag, r = a.rechnung || {}, o = zielort(a);
  const seit = r.wartetSeit != null ? minuten(r.wartetSeit) : null;
  return kopf(Z) + `<div class="inhalt">
    ${netzStreifen(Z)}
    ${heuteZeile(Z)}
    <h1 class="titel">${esc(t("jetztBeimKunden"))}</h1>
    ${ortZeile(t("ziel"), o.firma, o.tor)}
    <div class="zeiten">
      ${zeitFeld(t("ankunft"), uhr(a.ankunftZeit) || "—")}
      ${zeitFeld(t("termin"), a.termin || "—")}
    </div>
    ${seit != null ? `<div class="zeile"><span class="ico">${I.sanduhr(26)}</span>
      <div class="txt"><div class="wert">${esc(t("vorOrtSeit",{min:seit}))}</div>
      <div class="etikett">${esc(t("wartehinweis"))}</div></div></div>` : ""}
    ${datenZeile(t("container"), nummer(a.containerBestaetigt || a.container))}
    ${naechsterKasten(Z)}
  </div>` + leiste(
    hauptKnopf(t("entladungBeginnt"), I.uhr(30), "entladenStart", Z),
    zweitKnopf(t("ichMussWarten"), I.sanduhr(24), "warten"));
}

/* ===========================================================
   C2 — Warten auf Entladung
   =========================================================== */
function ansichtWarten(Z){
  const a = Z.auftrag, r = a.rechnung || {}, o = zielort(a);
  const seit = r.wartetVorEntladung != null ? minuten(r.wartetVorEntladung)
             : (r.wartetSeit != null ? minuten(r.wartetSeit) : null);
  return kopf(Z) + `<div class="inhalt">
    ${netzStreifen(Z)}
    ${heuteZeile(Z)}
    <h1 class="titel">${esc(t("jetztWarten"))}</h1>
    ${ortZeile(t("ziel"), o.firma, o.tor)}
    ${seit != null ? `<div class="zeiten">
      ${zeitFeld(t("wartetSeitMin"), seit + " " + t("minutenKurz"))}
      ${zeitFeld(t("ankunft"), uhr(a.ankunftZeit) || "—")}</div>` : ""}
    <div class="hinweis">${esc(t("wartehinweis"))}</div>
    ${naechsterKasten(Z)}
  </div>` + leiste(
    hauptKnopf(t("entladungBeginnt"), I.uhr(30), "entladenStart", Z),
    zweitKnopf(t("bueroAnrufen"), I.telefon(24), "anrufen"));
}

/* ===========================================================
   C3 — Entladung läuft
   =========================================================== */
function ansichtEntladen(Z){
  const a = Z.auftrag, r = a.rechnung || {};
  const n = r.naechster || null;
  const s = zeitstatus(n, Z);
  const offen = r.entladeUnbekannt || !r.entladeEndePlan;
  return kopf(Z) + `<div class="inhalt">
    ${netzStreifen(Z)}
    ${heuteZeile(Z)}
    <h1 class="titel">${esc(t("jetztEntladen"))}</h1>

    <div class="zeiten">
      ${zeitFeld(t("fertigEtwa"), offen ? t("nochOffen") : (uhr(r.entladeEndePlan) || "—"))}
    </div>
    ${offen ? `<div class="kasten warn"><span class="ico">${I.frage(24)}</span>
        <div>${esc(t("endeOffenText"))}</div></div>` : ""}

    ${n ? `<div class="naechster-kurz">${esc(t("naechsterTermin"))}:
        <b>${esc(n.kunde || n.zielOrt || "")} · ${esc(n.termin || "")}</b></div>
      <div class="zeiten">
        ${zeitFeld(t("ankunftEtwa"), n.unsicher ? "—" : (uhr(n.ankunft) || "—"), s.klasse,
                   { ico:s.ico, satz:s.satz })}
      </div>
      <div class="hinweis">${esc(t("schaetzung"))}</div>
      ${alarmHinweis(n, Z)}`
    : `<div class="hinweis">${esc(t("keinWeiterer"))}</div>`}

    <div class="zeiten">
      ${zeitFeld(t("ankunft"), uhr(a.ankunftZeit) || "—")}
      ${r.wartetSeit != null ? zeitFeld(t("vorOrtSeit",{min:minuten(r.wartetSeit)}), "") : ""}
    </div>
    ${datenZeile(t("container"), nummer(a.containerBestaetigt || a.container))}
  </div>` + leiste(
    hauptKnopf(t("entladungFertig"), I.haken(30), "entladenFertig", Z),
    zweitKnopf(t("dauertLaenger"), I.uhr(24), "laenger"));
}

/* Auswahl nach „Dauert länger“ — genau drei Möglichkeiten */
function ansichtLaenger(Z){
  return kopf(Z, {zurueck:true, ohneProblem:true}) + `<div class="inhalt">
    <h1 class="titel">${esc(t("wieLangeNoch"))}</h1>
    <button class="wahl-btn" data-tun="laengerWahl" data-min="30">
      <span class="ico">${I.uhr(28)}</span> ${esc(t("noch30"))}</button>
    <button class="wahl-btn" data-tun="laengerWahl" data-min="60">
      <span class="ico">${I.uhr(28)}</span> ${esc(t("noch60"))}</button>
    <button class="wahl-btn" data-tun="laengerWahl" data-min="">
      <span class="ico">${I.frage(28)}</span> ${esc(t("weissIchNicht"))}</button>
    <div class="hinweis">${esc(t("abJetztGerechnet"))}</div>
  </div>` + leiste(
    `<button class="haupt-btn" data-tun="zurueck">${I.zurueck(30)} ${esc(t("zurueck"))}</button>`);
}

/* Nachfrage, wenn die geplante Zeit abgelaufen ist */
function ansichtNachfrage(Z){
  return kopf(Z, {ohneProblem:true}) + `<div class="inhalt">
    <h1 class="titel">${esc(t("fertigOderLaenger"))}</h1>
    <div class="hinweis">${esc(t("nichtsAutomatisch"))}</div>
  </div>` + leiste(
    hauptKnopf(t("entladungFertig"), I.haken(30), "entladenFertig", Z),
    zweitKnopf(t("dauertLaenger"), I.uhr(24), "laenger"));
}

/* ===========================================================
   C4 — Entladung fertig, Ablieferung fotografieren
   =========================================================== */
function ansichtEntladenFertig(Z){
  const a = Z.auftrag, o = zielort(a);
  return kopf(Z) + `<div class="inhalt">
    ${netzStreifen(Z)}
    ${heuteZeile(Z)}
    <h1 class="titel">${esc(t("entladungIstFertig"))}</h1>
    ${ortZeile(t("ziel"), o.firma, o.tor)}
    <div class="zeiten">
      ${zeitFeld(t("entladeEnde"), uhr(a.entladeFertigZeit) || "—")}
      ${zeitFeld(t("ankunft"), uhr(a.ankunftZeit) || "—")}
    </div>
    ${datenZeile(t("container"), nummer(a.containerBestaetigt || a.container))}
    <div class="hinweis">${esc(t("nochNichtAbgeliefert"))}</div>
    ${naechsterKasten(Z)}
  </div>` + leiste(
    hauptKnopf(t("fotoAbgabe"), I.kamera(30), "fotoAbgabe", Z));
}

/* Kurzer Kasten mit dem nächsten Termin, wo er hilft */
function naechsterKasten(Z){
  const n = (Z.auftrag && Z.auftrag.rechnung && Z.auftrag.rechnung.naechster) || null;
  if (!n) return "";
  const s = zeitstatus(n, Z);
  return `<div class="kasten"><span class="ico">${I.uhr(24)}</span><div>
    <b>${esc(t("naechsterTermin"))}: ${esc(n.kunde || n.zielOrt || "")} · ${esc(n.termin || "")}</b>
    <div>${esc(t("ankunftEtwa"))}: ${esc(n.unsicher ? t("nochOffen") : (uhr(n.ankunft) || "—"))} · ${esc(s.satz)}</div>
  </div></div>`;
}

/* ===========================================================
   D — Auftrag abgeschlossen
   =========================================================== */
function ansichtAbschluss(Z){
  const b = Z.abschluss || {}, n = b.naechster;
  let nHtml = "", knopf;
  if (n) {
    const s = zeitstatus(n, Z);
    nHtml = `<h2 class="titel" style="font-size:21px">${
        esc(t("naechsterAuftrag",{ort:n.kunde || n.zielOrt || t("keineAngabe")}))}</h2>
      <div class="zeiten">
        ${zeitFeld(t("termin"), n.termin || "—")}
        ${zeitFeld(t("ankunftEtwa"), n.unsicher ? "—" : (uhr(n.ankunft) || "—"), s.klasse)}
      </div>
      ${statusStreifen(s)}
      <div class="hinweis">${esc(t("schaetzung"))}</div>
      ${s.klasse === "rot" && n.puffer != null && -n.puffer >= 20
        ? `<div class="hinweis">${esc(t("bueroSiehtVerspaetung"))}</div>` : ""}`;
    knopf = hauptKnopf(t("naechstenAnsehen"), I.pfeil(28), "naechster", Z);
  } else {
    nHtml = `<div class="hinweis">${esc(t("keinWeiterer"))}</div>`;
    knopf = hauptKnopf(t("tagFertigAnsehen"), I.liste(28), "tagesplan", Z);
  }
  return kopf(Z) + `<div class="inhalt">
    ${netzStreifen(Z)}
    <div class="ergebnis"><span class="ico">${I.haken(36)}</span><div>
      <div class="w">${esc(t("auftragAbgeschlossen"))}</div>
      <div class="u">${esc(t("abgeliefertUm",{ ort:b.ort || t("keineAngabe"),
                                               zeit:uhr(b.zeit) || "—" }))}</div>
    </div></div>
    ${nHtml}
  </div>` + leiste(knopf);
}

/* ===========================================================
   Fotoablauf
   =========================================================== */
function ansichtFoto(Z){
  const f = Z.foto || {}, a = Z.auftrag || {};
  const abgabe = f.art === "abgabe";
  const siegel = f.art === "siegel";
  const titel = siegel ? t("fotoTitelSiegel") : (abgabe ? t("fotoTitelAbgabe") : t("fotoTitelAbholung"));
  const anweisung = siegel ? t("anweisungSiegel")
                  : (abgabe ? t("anweisungAbgabe") : t("anweisungAbholung"));

  if (f.bild) {
    return kopf(Z, {zurueck:true, ohneProblem:true}) + `<div class="inhalt">
      <h1 class="titel">${esc(titel)}</h1>
      <img class="vorschaubild" src="${esc(f.bild)}" alt="${esc(titel)}">
      ${datenZeile(t("container"), nummer(a.container))}
      <div class="hinweis">${esc(t("abbrechenHinweis"))}</div>
    </div>` + leiste(
      hauptKnopf(t("fotoVerwenden"), I.haken(30), "fotoVerwenden", Z),
      zweitKnopf(t("fotoNeu"), I.kamera(24), "fotoNeu"));
  }
  return kopf(Z, {zurueck:true, ohneProblem:true}) + `<div class="inhalt">
    <h1 class="titel">${esc(titel)}</h1>
    <div class="kasten"><span class="ico">${I.kamera(26)}</span><div>${esc(anweisung)}</div></div>
    ${datenZeile(t("container"), nummer(a.container))}
    <div class="hinweis">${esc(t("abbrechenHinweis"))}</div>
    <button class="zweit-btn leise" data-tun="kamerahilfe">${I.frage(24)} ${esc(t("kameraGehtNicht"))}</button>
  </div>` + leiste(
    hauptKnopf(t("kameraOeffnen"), I.kamera(30), "kamera", Z),
    zweitKnopf(t("abbrechen"), I.kreuz(24), "fotoAbbrechen"));
}

/* ===========================================================
   Containernummer prüfen
   =========================================================== */
function ansichtContainer(Z){
  const p = Z.pruefung || {}, a = Z.auftrag || {};
  const erwartet = a.container || "";

  /* Ohne automatische Erkennung fragt die App einmal nach —
     ehrlicher als eine erfundene Erkennung. */
  if (p.zustand === "frage") {
    return kopf(Z, {zurueck:true, ohneProblem:true}) + `<div class="inhalt">
      <h1 class="titel">${esc(t("nummerFrage"))}</h1>
      <div class="etikett">${esc(t("imAuftrag"))}</div>
      <div class="nummer-gross num">${esc(nummer(erwartet))}</div>
      <div class="hinweis">${esc(t("erkennungSpaeter"))}</div>
      ${datenZeile(t("auftragsnummer"), a.nummer)}
    </div>` + leiste(
      hauptKnopf(t("jaNummerStimmt"), I.haken(30), "nummerStimmt", Z),
      zweitKnopf(t("neinAndereNummer"), I.stift(24), "nummerEingeben"));
  }

  /* Nicht sicher erkannt — das heißt nicht „falscher Container“. */
  if (p.zustand === "unsicher") {
    return kopf(Z, {zurueck:true, ohneProblem:true}) + `<div class="inhalt">
      <div class="ergebnis wartet"><span class="ico">${I.frage(36)}</span><div>
        <div class="w">${esc(t("nummerUnsicher"))}</div>
        <div class="u">${esc(t("nummerUnsicherText"))}</div></div></div>
      <div class="etikett">${esc(t("imAuftrag"))}</div>
      <div class="nummer-gross num">${esc(nummer(erwartet))}</div>
      ${p.demo ? `<div class="hinweis">${esc(t("erkennungDemo"))}</div>` : ""}
    </div>` + leiste(
      hauptKnopf(t("nochEinmalFoto"), I.kamera(30), "fotoNeu", Z),
      zweitKnopf(t("nummerEingeben"), I.stift(24), "nummerEingeben"));
  }

  /* Format oder Prüfziffer stimmen nicht — auch dann, wenn die Nummer
     zufällig zum Auftrag passt. Eine Übereinstimmung verdeckt das nicht. */
  if (p.zustand === "ungueltig") {
    return kopf(Z, {zurueck:true, ohneProblem:true}) + `<div class="inhalt">
      <div class="ergebnis wartet"><span class="ico">${I.warnung(36)}</span><div>
        <div class="w">${esc(t("nummerPruefen"))}</div>
        <div class="u">${esc(t("formatFalsch"))}</div></div></div>
      <div class="etikett">${esc(t("erkannt"))}</div>
      <div class="nummer-gross num">${esc(nummer(p.erkannt))}</div>
      <div class="etikett">${esc(t("imAuftrag"))}</div>
      <div class="nummer-gross num">${esc(nummer(erwartet))}</div>
      ${p.gleich ? `<div class="hinweis">${esc(t("gleichAberUngueltig"))}</div>` : ""}
      ${p.demo ? `<div class="hinweis">${esc(t("erkennungDemo"))}</div>` : ""}
      ${p.versucht ? `<button class="zweit-btn leise" data-tun="ungeprueftUebernehmen">
         ${I.pfeil(24)} ${esc(t("ungeprueftUebernehmen"))}</button>
         <div class="hinweis">${esc(t("ungeprueftHinweis"))}</div>` : ""}
    </div>` + leiste(
      hauptKnopf(t("nochEinmalFoto"), I.kamera(30), "fotoNeu", Z),
      zweitKnopf(t("nummerKorrigieren"), I.stift(24), "nummerEingeben"));
  }

  /* Gültig, aber eine andere Nummer als im Auftrag */
  if (p.zustand === "abweichung") {
    return kopf(Z, {zurueck:true, ohneProblem:true}) + `<div class="inhalt">
      <div class="ergebnis fehler"><span class="ico">${I.warnung(36)}</span><div>
        <div class="w">${esc(t("containerWeichtAb"))}</div></div></div>
      <div class="gegen">
        <div><div class="etikett">${esc(t("imAuftrag"))}</div>
             <div class="nummer-gross num">${esc(nummer(erwartet))}</div></div>
        <div><div class="etikett">${esc(t("erkannt"))}</div>
             <div class="nummer-gross num rot">${esc(nummer(p.erkannt))}</div></div>
      </div>
      ${p.demo ? `<div class="hinweis">${esc(t("erkennungDemo"))}</div>` : ""}
    </div>` + leiste(
      hauptKnopf(t("nochEinmalFoto"), I.kamera(30), "fotoNeu", Z),
      zweitKnopf(t("trotzdemAbholen"), I.pfeil(24), "trotzdem"));
  }

  /* Passt zum Auftrag und ist gültig */
  return kopf(Z, {zurueck:true, ohneProblem:true}) + `<div class="inhalt">
    <div class="ergebnis"><span class="ico">${I.haken(36)}</span><div>
      <div class="w">${esc(t("containerPasst"))}</div>
      <div class="u">${I.haken(18)} ${esc(t("pruefzifferStimmt"))}</div></div></div>
    <div class="nummer-gross num">${esc(nummer(p.erkannt || erwartet))}</div>
    ${p.ungeprueft ? `<div class="kasten warn"><span class="ico">${I.warnung(24)}</span>
      <div>${esc(t("ungeprueftMarke"))}</div></div>` : ""}
    ${p.demo ? `<div class="hinweis">${esc(t("erkennungDemo"))}</div>` : ""}
    ${datenZeile(t("auftragsnummer"), a.nummer)}
  </div>` + leiste(
    hauptKnopf(t("abholungBestaetigen"), I.haken(30), "abholungBestaetigen", Z),
    zweitKnopf(t("nochEinmalFoto"), I.kamera(24), "fotoNeu"));
}

/* Ungeprüfte Nummer: der Fahrer kommt weiter, die Nummer bleibt markiert. */
function ansichtUngeprueft(Z){
  const p = Z.pruefung || {};
  return kopf(Z, {zurueck:true, ohneProblem:true}) + `<div class="inhalt">
    <h1 class="titel">${esc(t("ungeprueftFrage"))}</h1>
    <div class="kasten warn"><span class="ico">${I.warnung(24)}</span>
      <div>${esc(t("ungeprueftHinweis"))}</div></div>
    <div class="etikett">${esc(t("erkannt"))}</div>
    <div class="nummer-gross num">${esc(nummer(p.erkannt))}</div>
  </div>` + leiste(
    hauptKnopf(t("jaAbholungBestaetigen"), I.haken(30), "abholungBestaetigen", Z),
    zweitKnopf(t("zurueck"), I.zurueck(24), "zurueck"));
}

/* Rückfrage vor „Trotzdem abholen“ */
function ansichtContainerFrage(Z){
  const p = Z.pruefung || {};
  return kopf(Z, {zurueck:true, ohneProblem:true}) + `<div class="inhalt">
    <h1 class="titel">${esc(t("wirklichAbgeholt"))}</h1>
    <div class="kasten warn"><span class="ico">${I.warnung(24)}</span>
      <div>${esc(t("bueroBekommtWarnung"))}</div></div>
    <div class="gegen">
      <div><div class="etikett">${esc(t("imAuftrag"))}</div>
           <div class="nummer-gross num">${esc(nummer((Z.auftrag||{}).container))}</div></div>
      <div><div class="etikett">${esc(t("erkannt"))}</div>
           <div class="nummer-gross num rot">${esc(nummer(p.erkannt))}</div></div>
    </div>
  </div>` + leiste(
    hauptKnopf(t("jaAbholungBestaetigen"), I.haken(30), "abholungBestaetigen", Z),
    zweitKnopf(t("zurueck"), I.zurueck(24), "zurueck"));
}

/* Nummer von Hand eingeben — nur im sicheren Stand */
function ansichtNummerEingeben(Z){
  const p = Z.pruefung || {};
  return kopf(Z, {zurueck:true, ohneProblem:true}) + `<div class="inhalt">
    <h1 class="titel">${esc(t("nummerEingeben"))}</h1>
    <label class="etikett" for="nummerfeld">${esc(t("nummerBeispiel"))}</label>
    <input class="feld num" id="nummerfeld" type="text" inputmode="latin"
      autocapitalize="characters" autocomplete="off" spellcheck="false"
      value="${esc(p.eingabe || "")}" placeholder="MSCU 123456 7">
    ${p.pruefzifferWarnung ? `<div class="kasten warn"><span class="ico">${I.warnung(24)}</span>
      <div>${esc(t("pruefzifferPasstNicht"))}</div></div>` : ""}
    <div class="hinweis">${esc(t("nummerHinweis"))}</div>
  </div>` + leiste(
    hauptKnopf(t("nummerUebernehmen"), I.haken(30), "nummerUebernehmen", Z),
    zweitKnopf(t("abbrechen"), I.kreuz(24), "zurueck"));
}

/* ===========================================================
   Ergebnis einer Übertragung
   =========================================================== */
function ansichtErgebnis(Z){
  const e = Z.ergebnis || {};
  const abholung = e.art === "abholung";
  const klasse = e.typ === "uebertragen" ? "" : (e.typ === "wartet" ? "wartet" : "fehler");
  const ico = e.typ === "uebertragen" ? I.haken(36)
            : (e.typ === "wartet" ? I.sanduhr(36) : I.warnung(36));
  let wort, unten;
  if (e.typ === "uebertragen") {
    wort = abholung ? t("abholungUebertragen") : t("uebertragen");
    unten = t("uebertragenText");
  } else if (e.typ === "wartet") {
    wort = t("aufHandyGespeichert");
    unten = t("nochNichtGesendetText");
  } else {
    wort = t("nochNichtGesendet");
    unten = e.gemerkt === false ? t("nichtGemerkt") : t("sendenFehlerText");
  }
  return kopf(Z) + `<div class="inhalt">
    ${netzStreifen(Z)}
    <div class="ergebnis ${klasse}"><span class="ico">${ico}</span><div>
      <div class="w">${esc(wort)}</div>
      <div class="z num">${esc(uhr(e.zeit) || "")}</div>
      <div class="u">${esc(unten)}</div>
      ${e.nummer ? `<div class="u num">${esc(t("container"))}: ${esc(nummer(e.nummer))}</div>` : ""}
      ${e.abweichung ? `<div class="u">${esc(t("alsAbweichungGemeldet"))}</div>` : ""}
      ${e.ungeprueft ? `<div class="u">${esc(t("ungeprueftMarke"))}</div>` : ""}
    </div></div>
    ${Z.demo && e.typ !== "uebertragen"
      ? `<div class="hinweis">${esc(t("demoSpeicher"))}</div>` : ""}
  </div>` + leiste(
    hauptKnopf(t("zurueckZumAuftrag"), I.zurueck(28), "zurueck", Z),
    e.typ !== "uebertragen" ? zweitKnopf(t("nochmalSenden"), I.pfeil(24), "nochmalSenden") : "");
}

function ansichtKamerahilfe(Z){
  const tel = (Z.einst && Z.einst.bueroTelefon) || "";
  return kopf(Z, {zurueck:true, ohneProblem:true}) + `<div class="inhalt">
    <h1 class="titel">${esc(t("kameraHilfeTitel"))}</h1>
    <div class="kasten"><span class="ico">${I.info(26)}</span><div>${esc(t("kameraHilfeText"))}</div></div>
    <div class="hinweis">${esc(t("kameraHilfeText2"))}</div>
    ${tel ? `<a class="zweit-btn" href="tel:${esc(tel)}">${I.telefon(24)} ${esc(t("bueroAnrufen"))}</a>` : ""}
  </div>` + leiste(hauptKnopf(t("zurueck"), I.zurueck(28), "zurueck", Z));
}

/* ===========================================================
   Sicherer Stand
   =========================================================== */
function ansichtStand(Z){
  return kopf(Z, {zurueck:true, ohneProblem:true}) + `<div class="inhalt">
    <h1 class="titel">${esc(t("standTitel"))}</h1>
    <div class="kasten warn"><span class="ico">${I.warnung(26)}</span>
      <div>${esc(t("standText"))}</div></div>
  </div>` + leiste(
    hauptKnopf(t("standJa"), I.haken(30), "standJa", Z),
    zweitKnopf(t("standNein"), I.zurueck(24), "zurueck"));
}

/* ===========================================================
   Problem melden
   =========================================================== */
const PROBLEME = [
  { art:"stau",           wort:"stau",           ico:()=>I.kegel(28) },
  { art:"warten",         wort:"mussWarten",     ico:()=>I.sanduhr(28) },
  { art:"containerFehlt", wort:"containerFehlt", ico:()=>I.box(28) },
  { art:"panne",          wort:"panne",          ico:()=>I.schrauben(28) }
];
function problemWort(art){
  const p = PROBLEME.find(x => x.art === art);
  return p ? t(p.wort) : art;
}
function ansichtProblem(Z){
  const tel = (Z.einst && Z.einst.bueroTelefon) || "";
  return kopf(Z, {zurueck:true, ohneProblem:true}) + `<div class="inhalt">
    <h1 class="titel">${esc(t("wasIstPassiert"))}</h1>
    ${tel ? `<a class="wahl-btn" href="tel:${esc(tel)}"><span class="ico">${I.telefon(28)}</span>
       <span>${esc(t("bueroAnrufen"))}<span class="klein num">${esc(t("bueroNummer"))}</span></span></a>`
          : `<div class="kasten"><span class="ico">${I.telefon(24)}</span>
       <div>${esc(t("bueroAnrufen"))}: ${esc(t("keineNummer"))}</div></div>`}
    ${PROBLEME.map(p => `<button class="wahl-btn" data-tun="problemWahl" data-art="${p.art}">
       <span class="ico">${p.ico()}</span> ${esc(t(p.wort))}</button>`).join("")}
  </div>` + leiste(
    `<button class="haupt-btn" data-tun="zurueck">${I.zurueck(28)} ${esc(t("zurueckZumAuftrag"))}</button>`);
}
function ansichtProblemFrage(Z){
  const art = (Z.problem || {}).art;
  return kopf(Z, {zurueck:true, ohneProblem:true}) + `<div class="inhalt">
    <h1 class="titel">${esc(t("meldenFrage",{was:problemWort(art)}))}</h1>
    <div class="hinweis">${esc(t("meldenStandHinweis"))}</div>
  </div>` + leiste(
    hauptKnopf(t("melden"), I.pfeil(28), "problemSenden", Z),
    zweitKnopf(t("zurueck"), I.zurueck(24), "problem"));
}
function ansichtProblemErgebnis(Z){
  const e = Z.problemErgebnis || {};
  const klasse = e.typ === "gesendet" ? "" : (e.typ === "wartet" ? "wartet" : "fehler");
  const ico = e.typ === "gesendet" ? I.haken(36)
            : (e.typ === "wartet" ? I.sanduhr(36) : I.warnung(36));
  const wort = e.typ === "gesendet" ? t("meldungGesendet")
             : (e.typ === "wartet" ? t("meldungWartet") : t("meldungFehler"));
  const unten = e.typ === "gesendet"
    ? (e.gelesen ? t("meldungGelesen") : t("meldungNichtGelesen"))
    : (e.typ === "wartet" ? t("nochNichtGesendetText")
                          : (e.gemerkt === false ? t("nichtGemerkt") : t("sendenFehlerText")));
  return kopf(Z) + `<div class="inhalt">
    ${netzStreifen(Z)}
    <div class="ergebnis ${klasse}"><span class="ico">${ico}</span><div>
      <div class="w">${esc(problemWort(e.art))}: ${esc(wort)}</div>
      <div class="z num">${esc(uhr(e.zeit) || "")}</div>
      <div class="u">${esc(unten)}</div>
    </div></div>
  </div>` + leiste(
    hauptKnopf(t("zurueckZumAuftrag"), I.zurueck(28), "zurueck", Z),
    e.typ === "fehler" ? zweitKnopf(t("nochmalSenden"), I.pfeil(24), "problemSenden") : "");
}

/* ===========================================================
   Tagesplan und Sprache
   =========================================================== */
function statusWort(a, jetzt){
  if (a.status === "fertig")     return { wort:t("statusFertig"), klasse:"fertig", ico:I.haken(18) };
  if (a === jetzt)               return { wort:t("statusJetzt"),  klasse:"jetzt",  ico:I.pfeil(18) };
  if (a.status === "geladen")    return { wort:t("statusUnterwegs"), klasse:"offen", ico:I.lkw(18) };
  if (a.status === "entladen")   return { wort:t("statusEntladen"), klasse:"offen", ico:I.uhr(18) };
  if (a.status === "warten")     return { wort:t("statusWarten"), klasse:"offen", ico:I.sanduhr(18) };
  if (a.status === "angekommen" || a.status === "entladen_fertig")
                                 return { wort:t("statusBeimKunden"), klasse:"offen", ico:I.sanduhr(18) };
  return { wort:t("statusOffen"), klasse:"offen", ico:I.uhr(18) };
}
function ansichtTagesplan(Z){
  const liste = Z.heute || [];
  const jetzt = liste.find(a => a.status !== "fertig");
  const m = Z.morgen || [];
  const alleFertig = liste.length > 0 && !jetzt;
  return kopf(Z, {zurueck:true}) + `<div class="inhalt">
    ${netzStreifen(Z)}
    <h1 class="titel">${esc(t("tagesplan"))} <span class="marke-firma">${esc(MARKE)}</span></h1>
    ${liste.length ? liste.map(a => {
      const s = statusWort(a, jetzt);
      return `<div class="tagzeile">
        <div class="zt num">${esc(a.termin || "—")}</div>
        <div class="wo">${esc(a.kunde || a.zielOrt || t("keineAngabe"))}
          ${a.zielOrt && a.kunde ? `<div class="etikett">${esc(a.zielOrt)}</div>` : ""}</div>
        <span class="marke ${s.klasse}">${s.ico} ${esc(s.wort)}</span></div>`;
    }).join("") : `<div class="hinweis">${esc(t("nichtsHeute"))}</div>`}
    ${alleFertig ? `<div class="kasten"><span class="ico">${I.haken(24)}</span>
        <div>${esc(t("heuteFertig"))}</div></div>` : ""}
    ${alleFertig && m.length ? morgenBlock(m) : ""}
    <div class="hinweis">${Z.online
      ? esc(t("standVon",{zeit:uhr(Z.datenZeit) || "—"}))
      : esc(t("keinNetzStreifen",{zeit:uhr(Z.datenZeit) || "—"}))}</div>
    ${Z.offen ? "" : `<div class="hinweis">${I.haken(20)} ${esc(t("alleGesendet"))}</div>`}
    <button class="zweit-btn" data-tun="sprache">${I.globus(24)} ${
      esc(t("sprache"))}: ${esc(SPRACHNAME[L])}</button>
    <button class="install" id="install" onclick="installieren()"></button>
  </div>` + leiste(
    `<button class="haupt-btn" data-tun="zurueck">${I.zurueck(28)} ${esc(t("zurueckZumAuftrag"))}</button>`);
}
function morgenBlock(m){
  const erster = m[0] || {};
  return `<div class="kasten warn"><span class="ico">${I.wecker(24)}</span><div>
    <b>${esc(t("morgenVorschau",{datum:datumLang(erster.datum)}))}</b>
    ${m.map(x => `<div>${esc(x.termin || "—")} · ${esc(x.kunde || x.zielOrt || "")}</div>`).join("")}
    <div style="margin-top:6px">${esc(t("morgenHinweis"))}</div></div></div>`;
}
function ansichtSprache(Z){
  return kopf(Z, {zurueck:true, ohneProblem:true}) + `<div class="inhalt">
    <h1 class="titel">${esc(t("spracheWaehlen"))}</h1>
    ${Object.keys(SPRACHNAME).map(k => `<button class="sprach-btn" data-tun="spracheSetzen"
      data-k="${k}" aria-pressed="${k === L}" lang="${k}">
      <span class="fl" aria-hidden="true">${FLAGGE[k]}</span> ${esc(SPRACHNAME[k])}
      ${k === L ? `<span class="ha">${I.haken(24)}</span>` : ""}</button>`).join("")}
    ${vorlesenMoeglich() ? "" : `<div class="hinweis">${esc(t("vorlesenGehtNicht"))}</div>`}
  </div>` + leiste(
    `<button class="haupt-btn" data-tun="zurueck">${I.zurueck(28)} ${esc(t("zurueck"))}</button>`);
}

/* ===========================================================
   Feierabend, Laden, kein Netz
   =========================================================== */
function ansichtFeierabend(Z){
  const m = Z.morgen || [];
  return kopf(Z) + `<div class="inhalt">
    ${netzStreifen(Z)}
    <div class="ergebnis"><span class="ico">${I.haken(36)}</span><div>
      <div class="w">${esc(t("heuteFertig"))}</div></div></div>
    ${m.length ? morgenBlock(m) : `<div class="hinweis">${esc(t("nichtsHeute"))}</div>`}
    <button class="install" id="install" onclick="installieren()"></button>
  </div>` + leiste(
    `<button class="haupt-btn" data-tun="tagesplan">${I.liste(28)} ${esc(t("tagFertigAnsehen"))}</button>`);
}
function ansichtLaden(){ return `<div class="inhalt"><div class="laedt">…</div></div>`; }
function ansichtKeinNetz(Z){
  return kopf(Z) + `<div class="inhalt">
    <div class="ergebnis fehler"><span class="ico">${I.wolkeAus(36)}</span><div>
      <div class="w">${esc(t("keinInternet"))}</div>
      <div class="u">${esc(t("keinNetzLaden"))}</div></div></div>
  </div>` + leiste(hauptKnopf(t("nochmalLaden"), I.pfeil(28), "nochmalLaden", Z));
}

/* ===========================================================
   Hauptfunktion: Zustand hinein, Bildschirm heraus
   =========================================================== */
function zeichne(Z){
  switch (Z.ansicht) {
    case "laden":           return ansichtLaden(Z);
    case "keinNetz":        return ansichtKeinNetz(Z);
    case "foto":            return ansichtFoto(Z);
    case "container":       return ansichtContainer(Z);
    case "containerFrage":  return ansichtContainerFrage(Z);
    case "ungeprueft":      return ansichtUngeprueft(Z);
    case "nummerEingeben":  return ansichtNummerEingeben(Z);
    case "ergebnis":        return ansichtErgebnis(Z);
    case "kamerahilfe":     return ansichtKamerahilfe(Z);
    case "stand":           return ansichtStand(Z);
    case "laenger":         return ansichtLaenger(Z);
    case "nachfrage":       return ansichtNachfrage(Z);
    case "abschluss":       return ansichtAbschluss(Z);
    case "problem":         return ansichtProblem(Z);
    case "problemFrage":    return ansichtProblemFrage(Z);
    case "problemErgebnis": return ansichtProblemErgebnis(Z);
    case "tagesplan":       return ansichtTagesplan(Z);
    case "sprache":         return ansichtSprache(Z);
    case "feierabend":      return ansichtFeierabend(Z);
  }
  if (!Z.auftrag) return ansichtFeierabend(Z);
  switch (schrittVon(Z.auftrag)) {
    case 2: return ansichtFahren(Z);
    case 3: return ansichtBeimKunden(Z);
    case 4: return ansichtWarten(Z);
    case 5: return ansichtEntladen(Z);
    case 6: return ansichtEntladenFertig(Z);
    default: return ansichtAbholen(Z);
  }
}

/* ---------- Vorlesetext ----------
   Kurze Sätze: Schritt, Ziel, wichtige Zeiten, nächste Handlung.
   Fehler und Containerabweichungen werden ebenfalls vorgelesen.  */
function vorlesetext(Z){
  const a = Z.auftrag;

  if (Z.ansicht === "ungeprueft")
    return t("ungeprueftFrage") + " " + t("ungeprueftHinweis");
  if (Z.ansicht === "container") {
    const p = Z.pruefung || {};
    if (p.zustand === "ungueltig")
      return t("nummerPruefen") + ". " + t("formatFalsch") + " " +
             t("erkannt") + " " + nummer(p.erkannt) + ". " + t("imAuftrag") + " " + nummer(a && a.container);
    if (p.zustand === "passt")
      return t("containerPasst") + ". " + nummer(p.erkannt || (a && a.container)) + ". " + t("abholungBestaetigen");
    if (p.zustand === "abweichung")
      return t("containerWeichtAb") + ". " + t("imAuftrag") + " " + nummer(a && a.container) +
             ". " + t("erkannt") + " " + nummer(p.erkannt) + ". " + t("nochEinmalFoto");
    return t("nummerUnsicher") + ". " + t("nummerUnsicherText");
  }
  if (Z.ansicht === "containerFrage")
    return t("wirklichAbgeholt") + " " + t("bueroBekommtWarnung");
  if (Z.ansicht === "ergebnis") {
    const e = Z.ergebnis || {};
    return (e.typ === "uebertragen" ? t("uebertragen") + ". " + t("uebertragenText")
          : e.typ === "wartet" ? t("aufHandyGespeichert") + ". " + t("nochNichtGesendetText")
          : t("nochNichtGesendet") + ". " + (e.gemerkt === false ? t("nichtGemerkt") : t("sendenFehlerText")));
  }
  if (Z.ansicht === "problem" || Z.ansicht === "problemFrage") return t("wasIstPassiert");
  if (Z.ansicht === "problemErgebnis") {
    const e = Z.problemErgebnis || {};
    return problemWort(e.art) + ". " +
      (e.typ === "gesendet" ? t("meldungGesendet") : e.typ === "wartet" ? t("meldungWartet") : t("meldungFehler"));
  }
  if (Z.ansicht === "foto") {
    const f = Z.foto || {};
    return f.art === "abgabe" ? t("anweisungAbgabe")
         : f.art === "siegel" ? t("anweisungSiegel") : t("anweisungAbholung");
  }
  if (Z.ansicht === "laenger") return t("wieLangeNoch") + ". " + t("noch30") + ". " + t("noch60") + ". " + t("weissIchNicht");
  if (Z.ansicht === "nachfrage") return t("fertigOderLaenger");
  if (Z.ansicht === "abschluss") {
    const b = Z.abschluss || {}, n = b.naechster;
    let s = t("auftragAbgeschlossen") + ". ";
    if (n) {
      const st = zeitstatus(n, Z);
      s += t("naechsterAuftrag",{ort:n.kunde || n.zielOrt || ""}) + ". " +
           t("termin") + " " + (n.termin || "") + ". " +
           (n.unsicher ? "" : t("ankunftEtwa") + " " + (uhr(n.ankunft) || "") + ". ") + st.satz;
    } else s += t("keinWeiterer");
    return s;
  }
  if (Z.ansicht === "tagesplan") {
    const liste = Z.heute || [];
    return t("heuteZahl",{n:liste.length}) + ". " +
      liste.map(x => (x.termin || "") + " " + (x.kunde || x.zielOrt || "")).join(". ");
  }
  if (!a) return t("heuteFertig");

  const r = a.rechnung || {}, schritt = schrittVon(a);
  let text = "";
  if (schritt === 1) {
    const o = abholort(a);
    text += t("jetztAbholen") + ". " + t("abholenBei") + " " + (o.firma || "") + ". " +
            (o.adresse ? o.adresse + ". " : "") + (o.tor ? t("tor") + " " + o.tor + ". " : "") +
            (a.abholAb ? t("abholzeitAb") + " " + a.abholAb + ". " : "") +
            t("container") + " " + nummer(a.container) + ". " +
            t("terminBeimKunden",{ zeit:a.termin || "", ort:a.zielOrt || "" }) + ". " +
            t("fotoAbholung");
  } else if (schritt === 2) {
    const o = zielort(a), s = zeitstatus(r, Z);
    text += t("jetztFahren") + ". " + (o.firma || "") + ". " + (o.adresse ? o.adresse + ". " : "") +
            (o.tor ? t("tor") + " " + o.tor + ". " : "") +
            t("termin") + " " + (a.termin || "") + ". " +
            (uhr(r.ankunft) ? t("ankunftEtwa") + " " + uhr(r.ankunft) + ". " : "") +
            s.satz + ". " + t("amZielAngekommen");
  } else if (schritt === 5) {
    const n = r.naechster, s = zeitstatus(n, Z);
    text += t("jetztEntladen") + ". " +
      (r.entladeUnbekannt || !r.entladeEndePlan
        ? t("endeOffenText") + " "
        : t("fertigEtwa") + " " + uhr(r.entladeEndePlan) + ". ") +
      (n ? t("naechsterTermin") + " " + (n.kunde || n.zielOrt || "") + " " + (n.termin || "") + ". " +
           (n.unsicher ? "" : t("ankunftEtwa") + " " + (uhr(n.ankunft) || "") + ". ") + s.satz + ". " : "") +
      t("entladungFertig");
  } else {
    const o = zielort(a);
    const kopfSatz = schritt === 3 ? t("jetztBeimKunden")
                   : schritt === 4 ? t("jetztWarten") : t("entladungIstFertig");
    text += kopfSatz + ". " + (o.firma || "") + ". " +
            (uhr(a.ankunftZeit) ? t("ankunft") + " " + uhr(a.ankunftZeit) + ". " : "") +
            (r.wartetSeit != null ? t("vorOrtSeit",{min:minuten(r.wartetSeit)}) + ". " : "") +
            (schritt === 6 ? t("fotoAbgabe") : t("entladungBeginnt"));
  }
  if (a.notiz) text += " " + a.notiz;
  return text;
}

return { zeichne, vorlesetext, schrittVon, problemWort, PROBLEME, uhr, esc, zeitstatus, nummer };
})();

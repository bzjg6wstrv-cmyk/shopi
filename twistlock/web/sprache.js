/* Wörter, Sprachausgabe und Symbole — von Anmeldung und Fahrerseite gemeinsam genutzt.
   Neue Sprache hinzufügen: unten einen Block ergänzen und die Flagge eintragen.
   WICHTIG: Übersetzungen von einem Muttersprachler prüfen lassen. */
"use strict";

const W = {
  de:{gut:"ALLES GUT", knapp:"WENIG ZEIT", spaet:"ZU SPÄT",
      termin:"Termin", los:"Losfahren", ankunft:"Ankunft",
      abholen:"ABHOLEN", abgeben:"ABGEBEN", anrufen:"Chef anrufen",
      gespeichert:"Gespeichert", weiter:"Weiter", warte:"Moment…",
      naechster:"Nächster Termin", chefweiss:"Chef weiß Bescheid",
      allesfertig:"HEUTE FERTIG", morgen:"Morgen", nichts:"Heute nichts",
      wer:"Wer bist du?", pin:"PIN", angekommen:"ANGEKOMMEN", wartet:"WARTEN", wartetSeit:"Warte seit", gemerkt:"Gemerkt", sendetspaeter:"Wird gesendet, sobald Netz da ist", wartenAufNetz:"warten auf Netz",
      falsch:"PIN falsch", zurueck:"Zurück",
      keinnetz:"Kein Netz. Nochmal versuchen.", installieren:"Als App speichern"},
  tr:{gut:"HER ŞEY İYİ", knapp:"AZ ZAMAN", spaet:"GEÇ",
      termin:"Randevu", los:"Yola çık", ankunft:"Varış",
      abholen:"TESLİM AL", abgeben:"TESLİM ET", anrufen:"Patronu ara",
      gespeichert:"Kaydedildi", weiter:"Devam", warte:"Bekle…",
      naechster:"Sonraki randevu", chefweiss:"Patron biliyor",
      allesfertig:"BUGÜN BİTTİ", morgen:"Yarın", nichts:"Bugün iş yok",
      wer:"Sen kimsin?", pin:"PIN", angekommen:"GELDİM", wartet:"BEKLİYOR", wartetSeit:"Bekleme", gemerkt:"Kaydedildi", sendetspaeter:"İnternet gelince gönderilecek", wartenAufNetz:"internet bekliyor",
      falsch:"PIN yanlış", zurueck:"Geri",
      keinnetz:"İnternet yok. Tekrar dene.", installieren:"Uygulama olarak kaydet"},
  pl:{gut:"WSZYSTKO OK", knapp:"MAŁO CZASU", spaet:"ZA PÓŹNO",
      termin:"Termin", los:"Wyjazd", ankunft:"Przyjazd",
      abholen:"ODBIÓR", abgeben:"DOSTAWA", anrufen:"Zadzwoń do szefa",
      gespeichert:"Zapisano", weiter:"Dalej", warte:"Chwila…",
      naechster:"Następny termin", chefweiss:"Szef już wie",
      allesfertig:"DZIŚ GOTOWE", morgen:"Jutro", nichts:"Dziś nic",
      wer:"Kto to?", pin:"PIN", angekommen:"PRZYJECHAŁEM", wartet:"CZEKAM", wartetSeit:"Czekam od", gemerkt:"Zapisano lokalnie", sendetspaeter:"Wyśle się, gdy będzie sieć", wartenAufNetz:"czeka na sieć",
      falsch:"Zły PIN", zurueck:"Wstecz",
      keinnetz:"Brak sieci. Spróbuj jeszcze raz.", installieren:"Zapisz jako aplikację"},
  ro:{gut:"TOTUL BINE", knapp:"PUȚIN TIMP", spaet:"PREA TÂRZIU",
      termin:"Programare", los:"Plecare", ankunft:"Sosire",
      abholen:"PRELUARE", abgeben:"LIVRARE", anrufen:"Sună șeful",
      gespeichert:"Salvat", weiter:"Mai departe", warte:"Un moment…",
      naechster:"Următoarea programare", chefweiss:"Șeful știe",
      allesfertig:"AZI GATA", morgen:"Mâine", nichts:"Azi nimic",
      wer:"Cine ești?", pin:"PIN", angekommen:"AM AJUNS", wartet:"AŞTEPT", wartetSeit:"Aştept de", gemerkt:"Notat", sendetspaeter:"Se trimite când există rețea", wartenAufNetz:"aşteaptă rețea",
      falsch:"PIN greșit", zurueck:"Înapoi",
      keinnetz:"Fără rețea. Încearcă din nou.", installieren:"Salvează ca aplicație"},
  ar:{gut:"كل شيء جيد", knapp:"وقت قليل", spaet:"متأخر",
      termin:"الموعد", los:"الانطلاق", ankunft:"الوصول",
      abholen:"استلام", abgeben:"تسليم", anrufen:"اتصل بالمدير",
      gespeichert:"تم الحفظ", weiter:"متابعة", warte:"لحظة…",
      naechster:"الموعد التالي", chefweiss:"المدير يعلم",
      allesfertig:"انتهى اليوم", morgen:"غدا", nichts:"لا يوجد عمل اليوم",
      wer:"من أنت؟", pin:"PIN", angekommen:"وصلت", wartet:"انتظار", wartetSeit:"منذ", gemerkt:"محفوظ", sendetspaeter:"سيتم الإرسال عند توفر الشبكة", wartenAufNetz:"بانتظار الشبكة",
      falsch:"رمز خاطئ", zurueck:"رجوع",
      keinnetz:"لا يوجد اتصال. حاول مرة أخرى.", installieren:"احفظ كتطبيق"}
};
const FLAGGE = { de:"🇩🇪", tr:"🇹🇷", pl:"🇵🇱", ro:"🇷🇴", ar:"🇸🇦" };
const STIMME = { de:"de-DE", tr:"tr-TR", pl:"pl-PL", ro:"ro-RO", ar:"ar-SA" };

/* Sprache merken — ein Cookie, damit auch der Service Worker damit klarkommt */
let L = (document.cookie.match(/tl_lang=(\w\w)/) || [])[1] || "de";
function setzeSprache(k){
  L = k;
  document.cookie = "tl_lang=" + k + "; Path=/; Max-Age=" + 365*24*3600 + "; SameSite=Lax";
}

/* ---------- Vorlesen ---------- */
function sprich(text){
  if (!("speechSynthesis" in window) || !text) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = STIMME[L]; u.rate = 0.85;
    speechSynthesis.speak(u);
  } catch (e) {}
}

/* ---------- Symbole ---------- */
const I = {
  ampel:(f,g=54)=>`<svg width="${g}" height="${g*1.55}" viewBox="0 0 40 62" aria-hidden="true">
    <rect x="2" y="2" width="36" height="58" rx="7" fill="rgba(0,0,0,.25)"/>
    <circle cx="20" cy="15" r="10" fill="${f==='rot'?'#FF6B6B':'rgba(0,0,0,.3)'}"/>
    <circle cx="20" cy="31" r="10" fill="${f==='gelb'?'#FFE08A':'rgba(0,0,0,.3)'}"/>
    <circle cx="20" cy="47" r="10" fill="${f==='gruen'?'#7BE8A5':'rgba(0,0,0,.3)'}"/></svg>`,
  uhr:(g=42)=>sv(g,'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  wecker:(g=42)=>sv(g,'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 1.5M4 4l3-2M20 4l-3-2M5 20l-1.5 2M19 20l1.5 2"/>'),
  lkw:(g=34)=>sv(g,'<path d="M2 6h11v10H2z"/><path d="M13 9h4l4 3.5V16h-8z"/><circle cx="6.5" cy="18.5" r="2"/><circle cx="17.5" cy="18.5" r="2"/>'),
  chassis:(g=34)=>sv(g,'<path d="M2 12h20"/><path d="M4 12v3M20 12v3"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/><path d="M5 9h14"/>'),
  box:(g=34)=>sv(g,'<rect x="3" y="6" width="18" height="12"/><path d="M7 6v12M11 6v12M15 6v12"/>'),
  kamera:(g=46)=>sv(g,'<path d="M3 8h4l1.5-2h7L17 8h4v12H3z"/><circle cx="12" cy="13.5" r="3.5"/>'),
  telefon:(g=28)=>sv(g,'<path d="M6 3h4l2 5-2.5 1.5a12 12 0 0 0 5 5L16 12l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z"/>'),
  haken:(g=90)=>sv(g,'<circle cx="12" cy="12" r="10"/><path d="M7 12.5l3.5 3.5L17 9"/>',3),
  ton:(g=32)=>sv(g,'<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9.5a4 4 0 0 1 0 5"/><path d="M19.5 7a7.5 7.5 0 0 1 0 10"/>'),
  info:(g=28)=>sv(g,'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>'),
  pfeil:(g=42)=>sv(g,'<path d="M4 12h15M13 6l6 6-6 6"/>')
};
function sv(g, inhalt, dicke){
  return `<svg width="${g}" height="${g}" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="${dicke||2}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inhalt}</svg>`;
}

/* ---------- Kopfleiste mit Flaggen und Lautsprecher ---------- */
function kopfleiste(){
  return `<div class="kopf">
    <div class="lang">${Object.keys(FLAGGE).map(k =>
      `<button data-lang="${k}" aria-pressed="${k===L}" aria-label="${k}">${FLAGGE[k]}</button>`).join("")}</div>
    <button class="hoerer" data-ton aria-label="Vorlesen">${I.ton()}</button>
  </div>`;
}

/* Nach jedem Neuzeichnen aufrufen: verbindet Flaggen und Lautsprecher */
function binde(satzFn){
  document.querySelectorAll("[data-lang]").forEach(b => b.onclick = () => {
    setzeSprache(b.dataset.lang);
    if (typeof neuZeichnen === "function") neuZeichnen();
    if (satzFn) sprich(satzFn());
  });
  document.querySelectorAll("[data-ton]").forEach(b => b.onclick = () => {
    if (satzFn) sprich(satzFn());
  });
}

/* ---------- App-Installation ---------- */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(()=>{}));
}
let installEvent = null;
window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault(); installEvent = e;
  const b = document.getElementById("install");
  if (b) { b.style.display = "flex"; b.textContent = W[L].installieren; }
});
function installieren(){
  if (!installEvent) return;
  installEvent.prompt(); installEvent = null;
  const b = document.getElementById("install"); if (b) b.style.display = "none";
}

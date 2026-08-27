/* Lädt die ausgelieferte scent-code.js in einem minimalen DOM-Stub und prüft
   die Normalisierung mit den vom Auftraggeber genannten Testeingaben. */
const fs = require('fs');
const vm = require('vm');

function makeStub(config) {
  const listeners = {};
  const fakeInput = { value: '', addEventListener() {}, focus() {}, closest: () => null };
  const fakeForm = {
    getAttribute: (n) => (n === 'data-scent-code-form' ? 'navigate' : null),
    querySelector: (sel) => (sel.includes('input') ? fakeInput : { textContent: '', setAttribute() {} }),
    addEventListener() {}
  };
  const configNode = { textContent: JSON.stringify(config) };

  const doc = {
    querySelectorAll: (sel) => (sel === '[data-scent-code-form]' ? [fakeForm] : []),
    querySelector: (sel) => (sel === '[data-scent-code-map]' ? configNode : null),
    addEventListener() {}
  };
  const win = {
    document: doc,
    VCRoutes: { root_url: '/', search_url: '/search' },
    VCCodeStrings: {},
    matchMedia: () => ({ matches: false }),
    location: { href: '' },
    fetch: () => Promise.resolve({ ok: false }),
    CSS: { escape: (v) => v },
    setTimeout,
    URLSearchParams
  };
  win.window = win;
  return win;
}

function load(config) {
  const ctx = vm.createContext(makeStub(config));
  ctx.document = ctx.document || ctx.window.document;
  vm.runInContext(fs.readFileSync('assets/scent-code.js', 'utf8'), ctx);
  return ctx.window.VCScentCode;
}

let failures = 0;
function check(label, actual, expected) {
  const ok = actual === expected;
  if (!ok) failures += 1;
  console.log(`${ok ? 'OK  ' : 'FEHL'}  ${label.padEnd(34)} → ${JSON.stringify(actual)}${ok ? '' : `  (erwartet ${JSON.stringify(expected)})`}`);
}

console.log('--- ohne Positivliste (Fallback 1..130) ---');
let api = load({ prefix: 'VC', max: 130, allowed: [], codes: {}, fallback: 'vent-celeste-scent-code' });
check('47', api.normalise('47'), 'VC-047');
check('047', api.normalise('047'), 'VC-047');
check('VC47', api.normalise('VC47'), 'VC-047');
check('VC 047', api.normalise('VC 047'), 'VC-047');
check('VC-047', api.normalise('VC-047'), 'VC-047');
check('vc-047 (klein)', api.normalise('vc-047'), 'VC-047');
check('  47  (Leerzeichen)', api.normalise('  47  '), 'VC-047');
check('1', api.normalise('1'), 'VC-001');
check('130', api.normalise('130'), 'VC-130');
check('131 (über max)', api.normalise('131'), null);
check('0 (ungültig)', api.normalise('0'), null);
check('abc (ungültig)', api.normalise('abc'), null);
check('leer', api.normalise(''), null);
check('12345 (zu lang)', api.normalise('12345'), null);

console.log('\n--- mit Positivliste [47, 81] ---');
api = load({ prefix: 'VC', max: 130, allowed: [47, 81], codes: {}, fallback: 'vent-celeste-scent-code' });
check('47 (in Liste)', api.normalise('47'), 'VC-047');
check('081 (in Liste)', api.normalise('081'), 'VC-081');
check('50 (nicht in Liste)', api.normalise('50'), null);
check('130 (nicht in Liste)', api.normalise('130'), null);

console.log('\n--- Auflösung öffentlicher Code ---');
api = load({ prefix: 'VC', max: 130, allowed: [], codes: { 'VC-047': { handle: 'vc-047', price: '29,90 €' } }, fallback: 'vent-celeste-scent-code' });
check('VC-047 ist öffentlich', JSON.stringify(api.lookupLocal('VC-047')), '{"handle":"vc-047","price":"29,90 €"}');
check('VC-081 nicht öffentlich', api.lookupLocal('VC-081'), null);
check('Fallback-URL', api.fallbackUrl('VC-081'), '/products/vent-celeste-scent-code?code=VC-081');

console.log(failures === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failures} Prüfung(en) fehlgeschlagen.`);
process.exit(failures === 0 ? 0 : 1);

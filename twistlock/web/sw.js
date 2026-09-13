/* Service Worker — sorgt dafür, dass die App auch im Funkloch startet.
   Bei jeder Änderung an den Dateien die Nummer erhöhen. */
const CACHE = "twistlock-v4";
const SCHALE = ["/fahrer.html", "/anmelden.html", "/einfach.css", "/sprache.js",
                "/fahreransicht.js", "/container.js", "/zeit.js", "/manifest.json", "/icon-192.png", "/icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SCHALE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);

  // Daten immer frisch aus dem Netz holen, niemals aus dem Speicher
  if (u.pathname.startsWith("/api/")) return;

  // Seiten und Bilder: erst Netz, sonst Speicher
  e.respondWith(
    fetch(e.request)
      .then(a => {
        if (a.ok && e.request.method === "GET" && u.origin === location.origin) {
          const kopie = a.clone();
          caches.open(CACHE).then(c => c.put(e.request, kopie));
        }
        return a;
      })
      .catch(() => caches.match(e.request).then(a => a || caches.match("/fahrer.html")))
  );
});

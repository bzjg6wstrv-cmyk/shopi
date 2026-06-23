# Shopi Modern — Shopify Theme

Ein modernes, schnelles **Online Store 2.0** Theme im Stil von Shopifys „Dawn".
Komplett selbst aufgebaut, leichtgewichtig und voll anpassbar über den Theme-Editor.

> Geschrieben mit **Liquid · JavaScript (Web Components) · CSS** — so wie echte
> Shopify-Themes. (Kein Java — Shopify-Themes nutzen JavaScript.)

## ✨ Moderne Funktionen

| Funktion | Beschreibung |
|---|---|
| 🛒 **Cart Drawer** | Ausfahrbarer Warenkorb (AJAX) – Produkte landen im Korb **ohne Seitenreload**. Mengen ändern & entfernen direkt im Drawer. |
| 📌 **Sticky Add-to-Cart** | Mitlaufende Kaufleiste auf der Produktseite, die beim Scrollen erscheint. |
| 🔎 **Predictive Search** | Live-Suchvorschläge mit Produktbildern schon während der Eingabe. |
| 🎚️ **Varianten-Auswahl** | Preis, Verfügbarkeit, Bild und URL aktualisieren sich live beim Variantenwechsel. |
| ✨ **Scroll-Animationen** | Sektionen blenden sanft ein (mit `prefers-reduced-motion`-Unterstützung). |
| ⚡ **Quick-Add** | „In den Warenkorb" direkt aus dem Produktraster. |
| 📱 **Voll responsiv** | Mobiles Slide-in-Menü, flexible Raster, moderne Typografie. |
| 🎨 **Theme-Editor** | Farben, Schriften, Ecken-Radien, Cart-Typ u. v. m. ohne Code einstellbar. |

## 📁 Struktur

```
├── assets/
│   ├── base.css        # Design-System & alle Komponenten-Styles
│   └── global.js       # Web Components: Cart Drawer, Varianten, Suche, Sticky-Bar …
├── config/             # Theme-Einstellungen (settings_schema / settings_data)
├── layout/             # theme.liquid (Haupt-Layout) + password.liquid
├── locales/            # Übersetzungen (en, de) + Schema-Labels
├── sections/           # Header, Footer, Produkt, Kollektion, Cart Drawer, Hero …
├── snippets/           # Wiederverwendbar: Produktkarte, Preis, Icons, Such-Modal …
└── templates/          # JSON-Templates pro Seitentyp + Kundenkonto-Seiten
```

## 🚀 Installation

### Variante A — Shopify CLI (empfohlen für Entwickler)

```bash
# Shopify CLI installieren: https://shopify.dev/themes/tools/cli
shopify theme dev      # lokale Vorschau mit Live-Reload
shopify theme push     # Theme in den Store hochladen
```

### Variante B — als ZIP im Shopify-Admin

1. Diesen Ordner als **ZIP** packen (die Dateien müssen direkt in der ZIP liegen,
   nicht in einem Unterordner).
2. Shopify-Admin → **Online Store → Themes → Add theme → Upload zip file**.
3. **Customize** klicken, um Farben, Menüs und Inhalte anzupassen.

## ⚙️ Nach der Installation einrichten

- **Menüs:** Navigation → ein Menü mit Handle `main-menu` (Kopfzeile) und `footer` (Fußzeile) anlegen.
- **Cart-Typ:** Theme-Einstellungen → *Cart* → „Drawer" oder „Page".
- **Farben & Schriften:** Theme-Einstellungen → *Colors* / *Typography*.
- **Startseite:** Über den Theme-Editor Sektionen (Hero, Featured Collection, Rich Text, Newsletter) anpassen.

## 🧪 Hinweis zum Testen

Die interaktiven Funktionen (Cart Drawer, Live-Suche, Varianten) sprechen die
**Shopify-Storefront-APIs** an (`/cart/add.js`, `/search/suggest`, Section Rendering API).
Sie funktionieren daher erst **in einem echten Shopify-Store** vollständig – nicht in
einer reinen statischen Vorschau.

---

Erstellt als moderne, erweiterbare Grundlage. Viel Erfolg mit deinem Shop! 🛍️

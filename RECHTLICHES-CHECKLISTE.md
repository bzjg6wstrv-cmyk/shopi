# Rechtliches – Prüfbericht und Checkliste

Stand: 29.08.2026 · Theme: VENT CELESTE v6.1.0 · Shop: TUKAN Fragrance GmbH

> **Wichtig:** Diese Datei ist eine technische Bestandsaufnahme des Themes, **keine
> Rechtsberatung**. Die Rechtstexte im Theme sind Vorlagen. Lass Impressum, AGB,
> Widerrufsbelehrung und Datenschutzerklärung vor dem Livegang von einer Anwältin
> oder einem Anwalt bzw. über einen Rechtstexte-Dienst (z. B. IT-Recht Kanzlei,
> Trusted Shops, eRecht24) prüfen und laufend aktualisieren.

---

## 1. Warum Impressum und AGB gefehlt haben

Die Rechtstexte waren **im Theme vorhanden**, wurden aber nicht überall verlinkt.
Zwei Ursachen:

**a) Die Kopfnavigation hat Pflichtdokumente stillschweigend weggelassen.**
`sections/header.liquid` hat für Datenschutz, Widerruf und AGB **ausschließlich** die
Shopify-Bordmittel (`shop.privacy_policy`, `shop.refund_policy`,
`shop.terms_of_service`) abgefragt. Waren diese Richtlinien im Adminbereich leer –
und das sind sie standardmäßig –, wurde der Menüpunkt **ersatzlos entfernt**, obwohl
das Theme unter `templates/page.agb.json` und `templates/page.widerruf.json` fertige
Texte mitbringt. Genau das war der sichtbare Fehler.

**b) Kopf- und Fußbereich haben unterschiedlich aufgelöst.**
Beim Impressum bevorzugte der Fußbereich die Theme-Seite, der Kopfbereich die
Shopify-Richtlinie. Beide konnten damit unter derselben Beschriftung auf
**verschiedene Dokumente** zeigen.

Beides ist behoben: Beide Bereiche fragen jetzt dieselbe Stelle
(`snippets/legal-url.liquid`).

---

## 2. Was in dieser Änderung behoben wurde

| # | Befund | Status |
|---|--------|--------|
| 1 | Kopfnavigation ließ Impressum, AGB, Widerruf, Datenschutz weg, sobald die Shopify-Richtlinien leer waren | behoben |
| 2 | Kopf- und Fußbereich lösten dieselbe Beschriftung auf verschiedene Dokumente auf | behoben – gemeinsame Auflösung in `snippets/legal-url.liquid` |
| 3 | **Es gab überhaupt keine Datenschutzerklärung.** `page.datenschutz` rendert nur `page.content` und war leer | behoben – vollständige DSGVO-Erklärung als `document_type: datenschutz` |
| 4 | `settings.shipping_page` war nie gesetzt → der Link „zzgl. Versandkosten“ auf Produkt-, Warenkorb- und Set-Seiten wurde **nie ausgegeben** (Pflicht nach § 6 PAngV) | behoben – auf `/pages/versand-zahlung` gesetzt |
| 5 | Seite „Rechtliches“ zeigte den Banner „DEMO-INHALT – vor dem Livegang ersetzen“ | behoben – echte Übersichtsseite mit Verlinkung aller Dokumente |
| 6 | Unter den **echten** Firmendaten in Fußbereich und Kontaktseite stand fest „DEMO-INHALT“ | behoben – abschaltbar über `show_demo_notice`, standardmäßig aus |
| 7 | Impressum ohne Erklärung zur Verbraucherschlichtung (§ 36 VSBG) | behoben |
| 8 | **Keine Produktsicherheitsangaben nach GPSR** (VO (EU) 2023/988, gilt seit 13.12.2024) | behoben – neuer Produktblock „Produktsicherheit (GPSR)“ |
| 9 | Fehlende Rechtsseiten scheiterten **stumm** – im Editor war nur eine Lücke zu sehen, nicht der Grund | behoben – Hinweiskasten im Theme-Editor (`snippets/legal-status.liquid`) |

---

## 3. Was du jetzt im Shopify-Adminbereich tun musst

Ohne diese Schritte bleiben die Seiten trotz Code weiterhin unerreichbar.

### 3.1 Seiten anlegen — der wichtigste Schritt

Das Theme sucht die Seiten über **feste Handles**. Stimmt der Handle nicht, wird der
Menüpunkt weggelassen. Lege unter *Verkaufskanäle → Onlineshop → Seiten* an:

| Seitentitel | Handle (muss exakt stimmen) | Theme-Vorlage |
|---|---|---|
| Impressum | `impressum` | `page.impressum` |
| Datenschutzerklärung | `datenschutz` | `page.datenschutz` |
| AGB | `agb` | `page.agb` |
| Widerrufsbelehrung | `widerruf` | `page.widerruf` |
| Versand & Zahlung | `versand-zahlung` | `page.versand-zahlung` |
| Zufriedenheitsgarantie | `zufriedenheitsgarantie` | `page.zufriedenheitsgarantie` |
| Rechtliches | `rechtliches` | `page.rechtliches` |
| Kontakt | `contact` | `page.contact` |
| FAQ | `faq` | `page.faq` |

Der Seiteninhalt bleibt **leer** – der Text kommt aus der Theme-Vorlage. Wichtig ist
nur, rechts unter *Theme-Vorlage* die passende Vorlage auszuwählen.

**Kontrolle:** Öffne danach den Theme-Editor. Fehlt noch ein Pflichtdokument, steht im
Fußbereich ein Kasten „Rechtliches unvollständig“, der genau benennt, welcher Handle
fehlt. Verschwindet der Kasten, sind alle vier Pflichtdokumente verlinkt. Im Shop
selbst ist dieser Kasten nie sichtbar.

### 3.2 Menü prüfen

Die Spalte im Fußbereich heißt im Theme-Editor **„Rechtliches“** (genau so
geschrieben). Nur dann werden die Rechtslinks automatisch gesetzt. Die Einträge des
zugewiesenen Menüs `footer-rechtliches` werden dabei nicht verwendet.

### 3.3 Grundpreis nach PAngV — Pflicht bei Parfum

Bei Kosmetik nach Volumen ist der **Grundpreis** (Preis je 100 ml bzw. je Liter)
verpflichtend. Das Theme zeigt ihn an, sobald die Daten da sind – erzeugt ihn aber
nicht selbst. Trage je Variante unter *Produkt → Variante → Preise* ein:
- „Grundpreis anzeigen“ aktivieren
- Gesamtmenge (z. B. 50) und Einheit (ml)
- Grundpreis-Bezugsmenge (z. B. 100 ml)

Prüfe danach eine Produktseite: Unter dem Preis muss z. B. „59,80 € / 100 ml“ stehen.

### 3.4 Cookie-Banner — fehlt vollständig

Das Theme bringt **keine Einwilligungsverwaltung** mit, und im gesamten Code findet
sich kein Aufruf der Shopify Customer Privacy API. Sobald du Tracking, Marketing-Pixel
(Meta, TikTok, Google) oder Analytics einsetzt, brauchst du nach § 25 TDDDG eine
Einwilligung **vor** dem Setzen der Cookies. Aktiviere dazu im Adminbereich unter
*Einstellungen → Kundendatenschutz* das Cookie-Banner und die Region EU, oder
installiere eine CMP-App. Die Datenschutzerklärung verweist bereits auf diese
Einstellmöglichkeit – der Verweis muss auch stimmen.

### 3.5 Angaben in AGB und Versandseite gegen die echten Einstellungen prüfen

Die Vorlagen enthalten konkrete Zahlen. Weichen sie von den echten Shopify-Einstellungen
ab, ist das eine Falschangabe:
- Versandkosten **4,99 €** (Deutschland und EU) → mit *Einstellungen → Versand und Zustellung* abgleichen
- Lieferzeit **2–4 Werktage** (DE) / **7–10 Werktage** (EU)
- Liefergebiet „Deutschland und EU-Mitgliedstaaten“ → mit den aktiven Versandzonen abgleichen
- Zahlungsarten „Apple Pay, PayPal, Klarna, Kreditkarte, Vorkasse“ → nur nennen, was wirklich aktiv ist
- Der Neukundenrabatt **20 %** aus § 11 AGB muss real existieren und einlösbar sein

### 3.6 Widerrufsbutton

Unter *Theme-Einstellungen → Rechtliche Hinweise → Elektronischer Widerruf* liegt das
leere Feld `withdrawal_url`. Solange es leer ist, erscheint weder der Button im
Fußbereich noch der zugehörige Absatz in der Widerrufsbelehrung. Das Theme selbst
weist darauf hin, dass für B2C-Fernabsatzverträge seit dem 19.06.2026 eine
elektronische Widerrufsfunktion nötig ist. **Diese Angabe habe ich nicht verifiziert** –
kläre den aktuellen Stand mit deiner Rechtsberatung und hinterlege dann die URL einer
Lösung mit Bestätigungsseite und automatischer Eingangsbestätigung.

---

## 4. Weitere Risiken, die du prüfen solltest

### 4.1 Produktsicherheit (GPSR) — neuer Block muss befüllt werden
Der neue Block ist eingebaut, aber leer. Pflichtangaben schon **vor** dem Kauf:
Name, Anschrift und E-Mail des Herstellers; bei Herstellern außerhalb der EU zusätzlich
die verantwortliche Person in der EU; Warn- und Sicherheitshinweise. Pflegen entweder
zentral im Theme-Editor (Produktblock „Produktsicherheit (GPSR)“) oder je Produkt über
die Metafelder `custom.hersteller`, `custom.eu_verantwortlicher`, `custom.warnhinweise`.

### 4.2 Kosmetikkennzeichnung
Der Block „Inhaltsstoffe“ liest `custom.inci` und `custom.allergene` und bleibt leer,
solange diese Metafelder nicht gepflegt sind. Nach VO (EG) Nr. 1223/2009 gehört die
INCI-Liste zum Produkt; Parfum ist zudem nach CLP-Verordnung als entzündbar zu
kennzeichnen (Alkoholgehalt).

### 4.3 „Scent Codes“ und Markenrecht
Das Theme ist auf Duftcodes ausgelegt („Nenn uns deinen Lieblingsduft – wir finden
deinen Scent Code“). Werden dabei Codes fremden Markenparfums zugeordnet – in
Vergleichslisten, Produkttexten, Suchbegriffen, Metafeldern oder in der
WhatsApp-Beratung –, ist das markenrechtlich und nach § 6 UWG heikel und ein häufiger
Abmahngrund. Prüfe die tatsächlichen Produktdaten und die Beratungspraxis.

### 4.4 Bewertungen
`snippets/product-reviews.liquid` liest `metafields.reviews.rating`. Nach § 5b Abs. 3
UWG musst du angeben, **ob und wie** du prüfst, dass Bewertungen von echten Käufern
stammen. Gefälschte Bewertungen sind unzulässig. Der Theme-Code erzeugt korrekterweise
keine Beispielbewertungen.

### 4.5 Werbeaussagen
- Ankündigungsleiste „500+ Duftprofile“ – muss stimmen
- „30 Tage zufrieden oder Geld zurück“ – Garantiebedingungen sind hinterlegt und dürfen
  die gesetzlichen Rechte nicht verkürzen (steht so drin, gut)
- `free_shipping_threshold` steht auf 49 €, `free_shipping_enabled` ist aus. Der
  Locale-Text nennt das ausdrücklich einen „Musterwert“. Vor dem Aktivieren echten
  Wert setzen und den Mustertext in `locales/de.default.json`
  (`sections.cart.free_shipping_disclaimer`) ersetzen.

### 4.6 Newsletter
Die Anmeldung läuft über das Shopify-Kundenformular mit Tag `newsletter`. Die
Datenschutzerklärung beschreibt ein **Double-Opt-in**. Stelle sicher, dass Shopify bzw.
dein E-Mail-Tool tatsächlich eine Bestätigungsmail versendet – sonst stimmt die
Erklärung nicht.

### 4.7 WhatsApp
Die WhatsApp-Beratung ist aktiv (`whatsapp_enabled: true`). Die Datenschutzerklärung
enthält dafür jetzt einen eigenen Abschnitt inklusive Drittlandsübermittlung. Der
Abschnitt wird automatisch ausgeblendet, wenn du die Funktion abschaltest.

### 4.8 Datenschutzerklärung ergänzen
Die neue Erklärung deckt Hosting, Logfiles, Cookies, Bestellung, Zahlung, Kundenkonto,
Kontakt, WhatsApp, Newsletter, Bewertungen, Empfänger, Speicherdauer, Betroffenenrechte,
Widerspruch, Beschwerde und TLS ab. **Ergänzen musst du alles, was individuell dazukommt:**
jedes Tracking-/Marketing-Tool, jede App mit Datenzugriff, Google Fonts (das Theme lädt
Schriften über Shopify, also lokal – bei Umstellung prüfen), Social-Media-Profile sowie
einen Datenschutzbeauftragten, falls einer bestellt ist.

---

## 5. Schnelltest nach dem Deployment

1. Startseite öffnen → Fußbereich: Impressum, Datenschutz, Widerruf & Rückgabe, AGB,
   Versand & Zahlung, Zufriedenheitsgarantie sind sichtbar und öffnen den richtigen Text
2. Dieselben Links im Menü und in der mobilen Navigation prüfen
3. `/pages/impressum` → Firma, Geschäftsführer, Handelsregister, USt-IdNr., § 36 VSBG
4. `/pages/datenschutz` → Erklärung erscheint, Nummerierung 1–18 lückenlos
5. `/pages/agb` und `/pages/widerruf` → Text erscheint inkl. Muster-Widerrufsformular
6. `/pages/rechtliches` → Übersicht ohne „DEMO-INHALT“
7. Produktseite → Preis, Grundpreis je 100 ml, „inkl. MwSt., zzgl. Versandkosten“ mit
   funktionierendem Link, Block „Produktsicherheit“
8. Warenkorb und Warenkorb-Schublade → derselbe Steuer- und Versandhinweis
9. Nirgends darf noch „DEMO-INHALT“ stehen

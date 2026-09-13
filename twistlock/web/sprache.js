/* ===========================================================
   TWISTLOCK — Wörter, Sprachausgabe und Symbole
   Gemeinsam genutzt von Anmeldung, Fahreransicht und Demo-Vorschau.

   Regeln für Texte:
   - normale Groß- und Kleinschreibung, keine Wörter in Großbuchstaben
   - keine Fachbegriffe: „Ankunft etwa“ statt ETA, „Reserve“ statt Puffer
   - Platzhalter in geschweiften Klammern, zum Beispiel {min}
   - fehlt eine Übersetzung, wird automatisch der deutsche Satz genommen

   Neue Sprache: unten einen Block ergänzen und in SPRACHNAME eintragen.
   WICHTIG: Übersetzungen von einem Muttersprachler prüfen lassen.
   =========================================================== */
"use strict";

const W = {
de:{
  /* Kopf und Wege */
  vorlesen:"Vorlesen", sprache:"Sprache", spracheWaehlen:"Sprache wählen",
  heuteAuftraege:"Heute: {n} Aufträge", heuteEinAuftrag:"Heute: 1 Auftrag",
  zurueck:"Zurück", zurueckZumAuftrag:"Zurück zum Auftrag", abbrechen:"Abbrechen",
  /* Schritte */
  jetztAbholen:"Jetzt: Container abholen",
  jetztFahren:"Jetzt: Zum Kunden fahren",
  jetztBeimKunden:"Beim Kunden angekommen",
  abholenBei:"Abholen bei", ziel:"Ziel", tor:"Tor",
  abholzeitAb:"Abholzeit ab", abholzeit:"Abholzeit",
  spaetestensLos:"Spätestens losfahren",
  terminBeimKunden:"Termin beim Kunden: {zeit} in {ort}",
  termin:"Termin", ankunftEtwa:"Ankunft etwa", ankunft:"Ankunft",
  vorOrtSeit:"Seit {min} Minuten vor Ort",
  aufenthalt:"Aufenthalt",
  wartehinweis:"Das Büro prüft, welche Zeit davon berechnet wird.",
  nurAnkunft:"Dieser Schritt meldet nur die Ankunft, noch nicht die Ablieferung.",
  /* Fahrzeugdaten */
  fahrzeugUndContainer:"Fahrzeug und Container",
  container:"Container", chassis:"Chassis", zugmaschine:"Zugmaschine", siegel:"Siegel",
  auftragsnummer:"Auftrag", kunde:"Kunde", keineAngabe:"nicht angegeben",
  /* Zeitstatus */
  rechtzeitig:"Du bist voraussichtlich rechtzeitig",
  knapp:"Es wird knapp. Noch {min} Minuten Reserve.",
  zuSpaet:"Voraussichtlich {min} Minuten zu spät",
  keineDaten:"Ankunft gerade nicht verfügbar",
  keineDatenZusatz:"Keine Verbindung zum Büro. Die Zeiten können sich geändert haben.",
  schaetzung:"Geschätzt aus der geplanten Fahrzeit, ohne Verkehrslage.",
  minutenVorher:"Voraussichtlich {min} Minuten vorher",
  punktgenau:"Voraussichtlich genau zur Zeit",
  /* Aktionen */
  naviAbholort:"Navigation zum Abholort", naviZiel:"Navigation zum Ziel",
  navigation:"Navigation", fahrzeug:"Fahrzeug",
  naviHinweis:"Öffnet die Karten-App deines Handys.",
  problemMelden:"Problem melden",
  fotoAbholung:"Abgeholt? Foto machen", fotoAbgabe:"Abgegeben? Foto machen",
  amZielAngekommen:"Am Ziel angekommen",
  warte:"Moment…",
  /* Foto */
  fotoTitelAbholung:"Foto von der Abholung",
  fotoTitelAbgabe:"Foto von der Ablieferung",
  anweisungAbholung:"Fotografiere den Container von der Seite, so dass Containernummer und Siegel zu sehen sind.",
  anweisungAbgabe:"Fotografiere den abgestellten Container beim Kunden.",
  kameraOeffnen:"Kamera öffnen", fotoVerwenden:"Foto verwenden", fotoNeu:"Neu machen",
  abbrechenHinweis:"Abbrechen schließt den Auftrag nicht ab.",
  schadenHinweis:"Das Foto ist ein Beleg für die Übernahme. Es ist keine vollständige Schadensdokumentation. Schäden bitte zusätzlich dem Büro melden.",
  kameraGehtNicht:"Kamera geht nicht?",
  kameraHilfeTitel:"Kamera geht nicht",
  kameraHilfeText:"Die App darf die Kamera nur mit deiner Erlaubnis benutzen. Öffne die Einstellungen deines Handys, suche den Browser oder TWISTLOCK und erlaube die Kamera. Danach hier weitermachen.",
  kameraHilfeText2:"Wenn es dann noch nicht geht, ruf das Büro an. Der Auftrag bleibt offen.",
  /* Ergebnis senden */
  fotoGespeichert:"Foto gespeichert",
  abholungGebucht:"Abholung ist gespeichert",
  abgabeGebucht:"Ablieferung ist gespeichert",
  nochNichtGesendet:"Noch nicht gesendet",
  keinInternet:"Kein Internet",
  bleibtAufHandy:"Die Aufnahme bleibt auf dem Handy und wird von allein gesendet, sobald du Netz hast.",
  sendenFehlgeschlagen:"Senden hat nicht geklappt",
  sendenFehlerText:"Das Büro hat die Aufnahme noch nicht. Sie liegt weiter auf dem Handy.",
  nichtGemerkt:"Die Aufnahme konnte auf dem Handy nicht gespeichert werden. Bitte im Stand noch einmal versuchen.",
  nochmalSenden:"Nochmal senden",
  weiter:"Weiter",
  /* Problem melden */
  wasIstPassiert:"Was ist passiert?",
  stau:"Stau", mussWarten:"Ich muss warten", containerFehlt:"Container fehlt",
  panne:"Panne", bueroAnrufen:"Büro anrufen",
  keineNummer:"Im Büro ist noch keine Telefonnummer hinterlegt.",
  meldenFrage:"{was} melden?",
  melden:"Melden",
  meldenStandHinweis:"Melde nur, wenn der Lkw sicher steht.",
  meldungGesendet:"Meldung gesendet",
  meldungWartet:"Noch nicht gesendet – kein Internet",
  meldungFehler:"Meldung nicht angekommen",
  meldungGelesen:"Vom Büro gelesen",
  meldungNichtGelesen:"Noch nicht vom Büro gelesen",
  /* Sicherer Stand */
  standTitel:"Steht der Lkw sicher?",
  standText:"Mach das erst im Stand. Die App kann nicht erkennen, ob du fährst.",
  standJa:"Der Lkw steht sicher", standNein:"Noch nicht",
  /* Auftrag abgeschlossen */
  auftragAbgeschlossen:"Auftrag abgeschlossen",
  abgeliefertUm:"Abgeliefert bei {ort} um {zeit}",
  naechsterAuftrag:"Nächster Auftrag: {ort}",
  naechstenAnsehen:"Nächsten Auftrag ansehen",
  keinWeiterer:"Heute kein weiterer Auftrag",
  bueroSiehtVerspaetung:"Das Büro bekommt die Verspätung automatisch gemeldet. Fahr bitte normal weiter.",
  tagFertigAnsehen:"Tag ansehen",
  /* Tagesplan */
  tagesplan:"Heute", uebersicht:"Übersicht",
  statusJetzt:"Jetzt", statusOffen:"Offen", statusUnterwegs:"Unterwegs",
  statusBeimKunden:"Beim Kunden", statusFertig:"Fertig",
  nichtsHeute:"Heute kein Auftrag",
  heuteFertig:"Alle Aufträge von heute sind fertig",
  morgenVorschau:"Vorschau für morgen, {datum}",
  morgenHinweis:"Nur eine Vorschau. Der Auftrag startet erst morgen.",
  /* Verbindung */
  alleGesendet:"Alles ist gesendet",
  wartetAufNetz:"{n} Aufnahmen warten auf Netz",
  einerWartetAufNetz:"1 Aufnahme wartet auf Netz",
  standVon:"Daten vom Büro: {zeit}",
  keinNetzStreifen:"Kein Internet. Angezeigt werden die Daten von {zeit}.",
  keinNetzLaden:"Kein Internet und noch keine Daten auf dem Handy.",
  nochmalLaden:"Nochmal versuchen",
  vorlesenGehtNicht:"Vorlesen geht auf diesem Handy nicht.",
  /* Änderungen */
  geaendert:"Der Auftrag wurde geändert",
  neuStatt:"Neu: {neu} statt {alt}",
  neuOhneAlt:"Neu: {neu}",
  gesehenBestaetigen:"Gesehen und bestätigt",
  bestaetigt:"Bestätigt",
  /* Anmeldung */
  wer:"Wer bist du?", pin:"PIN", falsch:"PIN falsch",
  installieren:"Als App speichern"
},

tr:{
  vorlesen:"Sesli oku", sprache:"Dil", spracheWaehlen:"Dil seç",
  heuteAuftraege:"Bugün: {n} iş", heuteEinAuftrag:"Bugün: 1 iş",
  zurueck:"Geri", zurueckZumAuftrag:"İşe geri dön", abbrechen:"Vazgeç",
  jetztAbholen:"Şimdi: Konteyneri al",
  jetztFahren:"Şimdi: Müşteriye git",
  jetztBeimKunden:"Müşteriye varıldı",
  abholenBei:"Alım yeri", ziel:"Hedef", tor:"Kapı",
  abholzeitAb:"Alım saati", abholzeit:"Alım saati",
  spaetestensLos:"En geç yola çık",
  terminBeimKunden:"Müşteri randevusu: {zeit}, {ort}",
  termin:"Randevu", ankunftEtwa:"Varış yaklaşık", ankunft:"Varış",
  vorOrtSeit:"{min} dakikadan beri burada",
  aufenthalt:"Bekleme",
  wartehinweis:"Bu sürenin ne kadarının ücretli olduğunu ofis kontrol eder.",
  nurAnkunft:"Bu adım sadece varışı bildirir, teslimi değil.",
  fahrzeugUndContainer:"Araç ve konteyner",
  container:"Konteyner", chassis:"Şasi", zugmaschine:"Çekici", siegel:"Mühür",
  auftragsnummer:"İş", kunde:"Müşteri", keineAngabe:"belirtilmemiş",
  rechtzeitig:"Muhtemelen zamanında olacaksın",
  knapp:"Zaman daralıyor. {min} dakika payın kaldı.",
  zuSpaet:"Muhtemelen {min} dakika gecikme",
  keineDaten:"Varış şu an bilinmiyor",
  keineDatenZusatz:"Ofisle bağlantı yok. Saatler değişmiş olabilir.",
  schaetzung:"Planlanan sürüş süresine göre tahmin, trafik hariç.",
  minutenVorher:"Muhtemelen {min} dakika önce",
  punktgenau:"Muhtemelen tam saatinde",
  naviAbholort:"Alım yerine navigasyon", naviZiel:"Hedefe navigasyon",
  navigation:"Navigasyon", fahrzeug:"Araç",
  naviHinweis:"Telefonundaki harita uygulamasını açar.",
  problemMelden:"Sorun bildir",
  fotoAbholung:"Aldın mı? Fotoğraf çek", fotoAbgabe:"Teslim ettin mi? Fotoğraf çek",
  amZielAngekommen:"Hedefe vardım",
  warte:"Bir saniye…",
  fotoTitelAbholung:"Alımın fotoğrafı", fotoTitelAbgabe:"Teslimin fotoğrafı",
  anweisungAbholung:"Konteyneri yandan çek; numara ve mühür görünsün.",
  anweisungAbgabe:"Müşteride bırakılan konteyneri çek.",
  kameraOeffnen:"Kamerayı aç", fotoVerwenden:"Fotoğrafı kullan", fotoNeu:"Yeniden çek",
  abbrechenHinweis:"Vazgeçmek işi tamamlamaz.",
  schadenHinweis:"Bu fotoğraf teslim alma belgesidir, tam hasar tespiti değildir. Hasarları ayrıca ofise bildir.",
  kameraGehtNicht:"Kamera çalışmıyor mu?",
  kameraHilfeTitel:"Kamera çalışmıyor",
  kameraHilfeText:"Uygulama kamerayı ancak izin verirsen kullanır. Telefon ayarlarını aç, tarayıcıyı veya TWISTLOCK'u bul ve kameraya izin ver. Sonra buradan devam et.",
  kameraHilfeText2:"Hâlâ olmuyorsa ofisi ara. İş açık kalır.",
  fotoGespeichert:"Fotoğraf kaydedildi",
  abholungGebucht:"Alım kaydedildi", abgabeGebucht:"Teslim kaydedildi",
  nochNichtGesendet:"Henüz gönderilmedi", keinInternet:"İnternet yok",
  bleibtAufHandy:"Kayıt telefonda kalır ve internet gelince kendiliğinden gönderilir.",
  sendenFehlgeschlagen:"Gönderme olmadı",
  sendenFehlerText:"Ofiste henüz yok. Kayıt telefonda duruyor.",
  nichtGemerkt:"Kayıt telefona kaydedilemedi. Lütfen durduğunda tekrar dene.",
  nochmalSenden:"Tekrar gönder", weiter:"Devam",
  wasIstPassiert:"Ne oldu?",
  stau:"Trafik", mussWarten:"Beklemem gerekiyor", containerFehlt:"Konteyner yok",
  panne:"Arıza", bueroAnrufen:"Ofisi ara",
  keineNummer:"Ofis için telefon numarası kayıtlı değil.",
  meldenFrage:"{was} bildirilsin mi?", melden:"Bildir",
  meldenStandHinweis:"Sadece araç güvenli durduğunda bildir.",
  meldungGesendet:"Bildirim gönderildi",
  meldungWartet:"Henüz gönderilmedi – internet yok",
  meldungFehler:"Bildirim ulaşmadı",
  meldungGelesen:"Ofis okudu", meldungNichtGelesen:"Ofis henüz okumadı",
  standTitel:"Araç güvenli duruyor mu?",
  standText:"Bunu ancak dururken yap. Uygulama sürüp sürmediğini anlayamaz.",
  standJa:"Araç güvenli duruyor", standNein:"Henüz değil",
  auftragAbgeschlossen:"İş tamamlandı",
  abgeliefertUm:"{ort} adresine {zeit} teslim edildi",
  naechsterAuftrag:"Sonraki iş: {ort}", naechstenAnsehen:"Sonraki işi gör",
  keinWeiterer:"Bugün başka iş yok",
  bueroSiehtVerspaetung:"Gecikme ofise otomatik bildirilir. Normal devam et.",
  tagFertigAnsehen:"Günü gör",
  tagesplan:"Bugün", uebersicht:"Genel bakış",
  statusJetzt:"Şimdi", statusOffen:"Açık", statusUnterwegs:"Yolda",
  statusBeimKunden:"Müşteride", statusFertig:"Bitti",
  nichtsHeute:"Bugün iş yok", heuteFertig:"Bugünün işleri bitti",
  morgenVorschau:"Yarın için ön izleme, {datum}",
  morgenHinweis:"Sadece ön izleme. İş yarın başlar.",
  alleGesendet:"Her şey gönderildi",
  wartetAufNetz:"{n} kayıt interneti bekliyor",
  einerWartetAufNetz:"1 kayıt interneti bekliyor",
  standVon:"Ofis verileri: {zeit}",
  keinNetzStreifen:"İnternet yok. Gösterilen veriler {zeit} saatinden.",
  keinNetzLaden:"İnternet yok ve telefonda henüz veri yok.",
  nochmalLaden:"Tekrar dene",
  vorlesenGehtNicht:"Bu telefonda sesli okuma yok.",
  geaendert:"İş değişti", neuStatt:"Yeni: {alt} değil {neu}", neuOhneAlt:"Yeni: {neu}",
  gesehenBestaetigen:"Gördüm ve onaylıyorum", bestaetigt:"Onaylandı",
  wer:"Sen kimsin?", pin:"PIN", falsch:"PIN yanlış",
  installieren:"Uygulama olarak kaydet"
},

pl:{
  vorlesen:"Przeczytaj", sprache:"Język", spracheWaehlen:"Wybierz język",
  heuteAuftraege:"Dziś: {n} zlecenia", heuteEinAuftrag:"Dziś: 1 zlecenie",
  zurueck:"Wstecz", zurueckZumAuftrag:"Wróć do zlecenia", abbrechen:"Anuluj",
  jetztAbholen:"Teraz: Odbierz kontener",
  jetztFahren:"Teraz: Jedź do klienta",
  jetztBeimKunden:"Jestem u klienta",
  abholenBei:"Odbiór w", ziel:"Cel", tor:"Brama",
  abholzeitAb:"Odbiór od", abholzeit:"Godzina odbioru",
  spaetestensLos:"Najpóźniej wyjazd",
  terminBeimKunden:"Termin u klienta: {zeit} w {ort}",
  termin:"Termin", ankunftEtwa:"Przyjazd około", ankunft:"Przyjazd",
  vorOrtSeit:"Na miejscu od {min} minut",
  aufenthalt:"Postój",
  wartehinweis:"Biuro sprawdza, ile z tego czasu jest płatne.",
  nurAnkunft:"Ten krok zgłasza tylko przyjazd, jeszcze nie dostawę.",
  fahrzeugUndContainer:"Pojazd i kontener",
  container:"Kontener", chassis:"Podwozie", zugmaschine:"Ciągnik", siegel:"Plomba",
  auftragsnummer:"Zlecenie", kunde:"Klient", keineAngabe:"brak danych",
  rechtzeitig:"Prawdopodobnie będziesz na czas",
  knapp:"Będzie ciasno. Zostało {min} minut rezerwy.",
  zuSpaet:"Prawdopodobnie {min} minut spóźnienia",
  keineDaten:"Przyjazd chwilowo nieznany",
  keineDatenZusatz:"Brak połączenia z biurem. Godziny mogły się zmienić.",
  schaetzung:"Szacunek z planowanego czasu jazdy, bez ruchu na drodze.",
  minutenVorher:"Prawdopodobnie {min} minut wcześniej",
  punktgenau:"Prawdopodobnie dokładnie na czas",
  naviAbholort:"Nawigacja do odbioru", naviZiel:"Nawigacja do celu",
  navigation:"Nawigacja", fahrzeug:"Pojazd",
  naviHinweis:"Otwiera aplikację map w telefonie.",
  problemMelden:"Zgłoś problem",
  fotoAbholung:"Odebrane? Zrób zdjęcie", fotoAbgabe:"Oddane? Zrób zdjęcie",
  amZielAngekommen:"Jestem na miejscu",
  warte:"Chwila…",
  fotoTitelAbholung:"Zdjęcie odbioru", fotoTitelAbgabe:"Zdjęcie dostawy",
  anweisungAbholung:"Zrób zdjęcie kontenera z boku, tak aby widać było numer i plombę.",
  anweisungAbgabe:"Zrób zdjęcie odstawionego kontenera u klienta.",
  kameraOeffnen:"Otwórz kamerę", fotoVerwenden:"Użyj zdjęcia", fotoNeu:"Zrób nowe",
  abbrechenHinweis:"Anulowanie nie kończy zlecenia.",
  schadenHinweis:"Zdjęcie jest dowodem odbioru, nie pełną dokumentacją szkód. Szkody zgłoś dodatkowo do biura.",
  kameraGehtNicht:"Kamera nie działa?",
  kameraHilfeTitel:"Kamera nie działa",
  kameraHilfeText:"Aplikacja używa kamery tylko za Twoją zgodą. Otwórz ustawienia telefonu, znajdź przeglądarkę lub TWISTLOCK i zezwól na kamerę. Potem wróć tutaj.",
  kameraHilfeText2:"Jeśli nadal nie działa, zadzwoń do biura. Zlecenie pozostaje otwarte.",
  fotoGespeichert:"Zdjęcie zapisane",
  abholungGebucht:"Odbiór zapisany", abgabeGebucht:"Dostawa zapisana",
  nochNichtGesendet:"Jeszcze nie wysłane", keinInternet:"Brak internetu",
  bleibtAufHandy:"Zapis zostaje w telefonie i wyśle się sam, gdy będzie sieć.",
  sendenFehlgeschlagen:"Wysyłka się nie udała",
  sendenFehlerText:"Biuro jeszcze tego nie ma. Zapis jest dalej w telefonie.",
  nichtGemerkt:"Nie udało się zapisać w telefonie. Spróbuj jeszcze raz na postoju.",
  nochmalSenden:"Wyślij ponownie", weiter:"Dalej",
  wasIstPassiert:"Co się stało?",
  stau:"Korek", mussWarten:"Muszę czekać", containerFehlt:"Brak kontenera",
  panne:"Awaria", bueroAnrufen:"Zadzwoń do biura",
  keineNummer:"W biurze nie ma jeszcze zapisanego numeru telefonu.",
  meldenFrage:"Zgłosić: {was}?", melden:"Zgłoś",
  meldenStandHinweis:"Zgłaszaj tylko, gdy pojazd bezpiecznie stoi.",
  meldungGesendet:"Zgłoszenie wysłane",
  meldungWartet:"Jeszcze nie wysłane – brak internetu",
  meldungFehler:"Zgłoszenie nie dotarło",
  meldungGelesen:"Biuro przeczytało", meldungNichtGelesen:"Biuro jeszcze nie przeczytało",
  standTitel:"Czy pojazd bezpiecznie stoi?",
  standText:"Rób to tylko na postoju. Aplikacja nie rozpozna, czy jedziesz.",
  standJa:"Pojazd bezpiecznie stoi", standNein:"Jeszcze nie",
  auftragAbgeschlossen:"Zlecenie zakończone",
  abgeliefertUm:"Dostarczono do {ort} o {zeit}",
  naechsterAuftrag:"Następne zlecenie: {ort}", naechstenAnsehen:"Pokaż następne zlecenie",
  keinWeiterer:"Dziś nie ma więcej zleceń",
  bueroSiehtVerspaetung:"Biuro automatycznie dostaje informację o spóźnieniu. Jedź normalnie.",
  tagFertigAnsehen:"Pokaż dzień",
  tagesplan:"Dziś", uebersicht:"Przegląd",
  statusJetzt:"Teraz", statusOffen:"Otwarte", statusUnterwegs:"W drodze",
  statusBeimKunden:"U klienta", statusFertig:"Gotowe",
  nichtsHeute:"Dziś brak zleceń", heuteFertig:"Wszystkie dzisiejsze zlecenia gotowe",
  morgenVorschau:"Podgląd na jutro, {datum}",
  morgenHinweis:"To tylko podgląd. Zlecenie startuje jutro.",
  alleGesendet:"Wszystko wysłane",
  wartetAufNetz:"{n} zapisów czeka na sieć",
  einerWartetAufNetz:"1 zapis czeka na sieć",
  standVon:"Dane z biura: {zeit}",
  keinNetzStreifen:"Brak internetu. Pokazane dane z godziny {zeit}.",
  keinNetzLaden:"Brak internetu i brak danych w telefonie.",
  nochmalLaden:"Spróbuj ponownie",
  vorlesenGehtNicht:"Ten telefon nie czyta na głos.",
  geaendert:"Zlecenie zostało zmienione", neuStatt:"Nowe: {neu} zamiast {alt}", neuOhneAlt:"Nowe: {neu}",
  gesehenBestaetigen:"Widziałem i potwierdzam", bestaetigt:"Potwierdzone",
  wer:"Kto to?", pin:"PIN", falsch:"Zły PIN",
  installieren:"Zapisz jako aplikację"
},

ro:{
  vorlesen:"Citește cu voce", sprache:"Limba", spracheWaehlen:"Alege limba",
  heuteAuftraege:"Azi: {n} comenzi", heuteEinAuftrag:"Azi: 1 comandă",
  zurueck:"Înapoi", zurueckZumAuftrag:"Înapoi la comandă", abbrechen:"Anulează",
  jetztAbholen:"Acum: Preia containerul",
  jetztFahren:"Acum: Mergi la client",
  jetztBeimKunden:"Ai ajuns la client",
  abholenBei:"Preluare la", ziel:"Destinație", tor:"Poarta",
  abholzeitAb:"Preluare de la", abholzeit:"Ora preluării",
  spaetestensLos:"Cel târziu plecarea",
  terminBeimKunden:"Programare la client: {zeit} în {ort}",
  termin:"Programare", ankunftEtwa:"Sosire aproximativ", ankunft:"Sosire",
  vorOrtSeit:"De {min} minute la fața locului",
  aufenthalt:"Staționare",
  wartehinweis:"Biroul verifică cât din acest timp se facturează.",
  nurAnkunft:"Acest pas anunță doar sosirea, nu încă livrarea.",
  fahrzeugUndContainer:"Vehicul și container",
  container:"Container", chassis:"Șasiu", zugmaschine:"Cap tractor", siegel:"Sigiliu",
  auftragsnummer:"Comandă", kunde:"Client", keineAngabe:"nespecificat",
  rechtzeitig:"Probabil ajungi la timp",
  knapp:"Se strânge timpul. Mai ai {min} minute rezervă.",
  zuSpaet:"Probabil {min} minute întârziere",
  keineDaten:"Sosirea nu este disponibilă acum",
  keineDatenZusatz:"Fără legătură cu biroul. Orele se pot fi schimbat.",
  schaetzung:"Estimare din timpul de mers planificat, fără trafic.",
  minutenVorher:"Probabil {min} minute mai devreme",
  punktgenau:"Probabil exact la timp",
  naviAbholort:"Navigare la preluare", naviZiel:"Navigare la destinație",
  navigation:"Navigare", fahrzeug:"Vehicul",
  naviHinweis:"Deschide aplicația de hărți din telefon.",
  problemMelden:"Raportează o problemă",
  fotoAbholung:"Preluat? Fă o poză", fotoAbgabe:"Predat? Fă o poză",
  amZielAngekommen:"Am ajuns la destinație",
  warte:"Un moment…",
  fotoTitelAbholung:"Poza preluării", fotoTitelAbgabe:"Poza livrării",
  anweisungAbholung:"Fotografiază containerul din lateral, să se vadă numărul și sigiliul.",
  anweisungAbgabe:"Fotografiază containerul lăsat la client.",
  kameraOeffnen:"Deschide camera", fotoVerwenden:"Folosește poza", fotoNeu:"Fă alta",
  abbrechenHinweis:"Anularea nu încheie comanda.",
  schadenHinweis:"Poza este dovada preluării, nu o documentare completă a daunelor. Anunță daunele separat la birou.",
  kameraGehtNicht:"Camera nu merge?",
  kameraHilfeTitel:"Camera nu merge",
  kameraHilfeText:"Aplicația folosește camera numai cu permisiunea ta. Deschide setările telefonului, caută browserul sau TWISTLOCK și permite camera. Apoi continuă aici.",
  kameraHilfeText2:"Dacă tot nu merge, sună la birou. Comanda rămâne deschisă.",
  fotoGespeichert:"Poza a fost salvată",
  abholungGebucht:"Preluarea este salvată", abgabeGebucht:"Livrarea este salvată",
  nochNichtGesendet:"Încă netrimis", keinInternet:"Fără internet",
  bleibtAufHandy:"Înregistrarea rămâne pe telefon și se trimite singură când ai semnal.",
  sendenFehlgeschlagen:"Trimiterea nu a reușit",
  sendenFehlerText:"Biroul nu are încă înregistrarea. Ea rămâne pe telefon.",
  nichtGemerkt:"Înregistrarea nu a putut fi salvată pe telefon. Încearcă din nou din staționare.",
  nochmalSenden:"Trimite din nou", weiter:"Mai departe",
  wasIstPassiert:"Ce s-a întâmplat?",
  stau:"Ambuteiaj", mussWarten:"Trebuie să aștept", containerFehlt:"Lipsește containerul",
  panne:"Pană", bueroAnrufen:"Sună la birou",
  keineNummer:"La birou nu este încă salvat niciun număr de telefon.",
  meldenFrage:"Raportezi {was}?", melden:"Raportează",
  meldenStandHinweis:"Raportează numai când camionul stă în siguranță.",
  meldungGesendet:"Raportarea a fost trimisă",
  meldungWartet:"Încă netrimis – fără internet",
  meldungFehler:"Raportarea nu a ajuns",
  meldungGelesen:"Citit de birou", meldungNichtGelesen:"Încă necitit de birou",
  standTitel:"Stă camionul în siguranță?",
  standText:"Fă asta doar din staționare. Aplicația nu poate ști dacă conduci.",
  standJa:"Camionul stă în siguranță", standNein:"Încă nu",
  auftragAbgeschlossen:"Comandă încheiată",
  abgeliefertUm:"Livrat la {ort} la ora {zeit}",
  naechsterAuftrag:"Comanda următoare: {ort}", naechstenAnsehen:"Vezi comanda următoare",
  keinWeiterer:"Azi nu mai este altă comandă",
  bueroSiehtVerspaetung:"Biroul este anunțat automat despre întârziere. Condu normal.",
  tagFertigAnsehen:"Vezi ziua",
  tagesplan:"Azi", uebersicht:"Privire de ansamblu",
  statusJetzt:"Acum", statusOffen:"Deschis", statusUnterwegs:"Pe drum",
  statusBeimKunden:"La client", statusFertig:"Gata",
  nichtsHeute:"Azi nicio comandă", heuteFertig:"Toate comenzile de azi sunt gata",
  morgenVorschau:"Previzualizare pentru mâine, {datum}",
  morgenHinweis:"Doar o previzualizare. Comanda începe mâine.",
  alleGesendet:"Totul este trimis",
  wartetAufNetz:"{n} înregistrări așteaptă semnal",
  einerWartetAufNetz:"1 înregistrare așteaptă semnal",
  standVon:"Date de la birou: {zeit}",
  keinNetzStreifen:"Fără internet. Se arată datele de la {zeit}.",
  keinNetzLaden:"Fără internet și încă fără date pe telefon.",
  nochmalLaden:"Încearcă din nou",
  vorlesenGehtNicht:"Acest telefon nu citește cu voce.",
  geaendert:"Comanda a fost modificată", neuStatt:"Nou: {neu} în loc de {alt}", neuOhneAlt:"Nou: {neu}",
  gesehenBestaetigen:"Văzut și confirmat", bestaetigt:"Confirmat",
  wer:"Cine ești?", pin:"PIN", falsch:"PIN greșit",
  installieren:"Salvează ca aplicație"
},

ar:{
  vorlesen:"اقرأ بصوت", sprache:"اللغة", spracheWaehlen:"اختر اللغة",
  heuteAuftraege:"اليوم: {n} مهام", heuteEinAuftrag:"اليوم: مهمة واحدة",
  zurueck:"رجوع", zurueckZumAuftrag:"رجوع إلى المهمة", abbrechen:"إلغاء",
  jetztAbholen:"الآن: استلم الحاوية",
  jetztFahren:"الآن: اذهب إلى العميل",
  jetztBeimKunden:"وصلت إلى العميل",
  abholenBei:"الاستلام من", ziel:"الوجهة", tor:"البوابة",
  abholzeitAb:"الاستلام من الساعة", abholzeit:"وقت الاستلام",
  spaetestensLos:"آخر وقت للانطلاق",
  terminBeimKunden:"الموعد عند العميل: {zeit} في {ort}",
  termin:"الموعد", ankunftEtwa:"الوصول تقريباً", ankunft:"الوصول",
  vorOrtSeit:"موجود هنا منذ {min} دقيقة",
  aufenthalt:"مدة التوقف",
  wartehinweis:"المكتب يحدد أي جزء من هذا الوقت يُحسب.",
  nurAnkunft:"هذه الخطوة تُبلغ عن الوصول فقط، وليس عن التسليم.",
  fahrzeugUndContainer:"الشاحنة والحاوية",
  container:"الحاوية", chassis:"الهيكل", zugmaschine:"القاطرة", siegel:"الحرز",
  auftragsnummer:"المهمة", kunde:"العميل", keineAngabe:"غير محدد",
  rechtzeitig:"من المتوقع أن تصل في الوقت",
  knapp:"الوقت ضيق. بقي {min} دقيقة احتياط.",
  zuSpaet:"من المتوقع تأخير {min} دقيقة",
  keineDaten:"الوصول غير متاح الآن",
  keineDatenZusatz:"لا اتصال بالمكتب. قد تكون الأوقات تغيّرت.",
  schaetzung:"تقدير من زمن القيادة المخطط، بدون حالة الطريق.",
  minutenVorher:"من المتوقع {min} دقيقة قبل الموعد",
  punktgenau:"من المتوقع في الوقت بالضبط",
  naviAbholort:"الملاحة إلى مكان الاستلام", naviZiel:"الملاحة إلى الوجهة",
  navigation:"الملاحة", fahrzeug:"الشاحنة",
  naviHinweis:"يفتح تطبيق الخرائط في هاتفك.",
  problemMelden:"أبلغ عن مشكلة",
  fotoAbholung:"استلمت؟ التقط صورة", fotoAbgabe:"سلّمت؟ التقط صورة",
  amZielAngekommen:"وصلت إلى الوجهة",
  warte:"لحظة…",
  fotoTitelAbholung:"صورة الاستلام", fotoTitelAbgabe:"صورة التسليم",
  anweisungAbholung:"صوّر الحاوية من الجانب بحيث يظهر الرقم والحرز.",
  anweisungAbgabe:"صوّر الحاوية بعد إنزالها عند العميل.",
  kameraOeffnen:"افتح الكاميرا", fotoVerwenden:"استخدم الصورة", fotoNeu:"صورة جديدة",
  abbrechenHinweis:"الإلغاء لا يُنهي المهمة.",
  schadenHinweis:"الصورة إثبات للاستلام وليست توثيقاً كاملاً للأضرار. أبلغ المكتب بالأضرار أيضاً.",
  kameraGehtNicht:"الكاميرا لا تعمل؟",
  kameraHilfeTitel:"الكاميرا لا تعمل",
  kameraHilfeText:"يحتاج التطبيق إذنك لاستخدام الكاميرا. افتح إعدادات الهاتف، ابحث عن المتصفح أو TWISTLOCK واسمح بالكاميرا. ثم تابع من هنا.",
  kameraHilfeText2:"إذا استمرت المشكلة، اتصل بالمكتب. تبقى المهمة مفتوحة.",
  fotoGespeichert:"تم حفظ الصورة",
  abholungGebucht:"تم حفظ الاستلام", abgabeGebucht:"تم حفظ التسليم",
  nochNichtGesendet:"لم يُرسل بعد", keinInternet:"لا يوجد إنترنت",
  bleibtAufHandy:"تبقى الصورة في الهاتف وتُرسل تلقائياً عند توفر الشبكة.",
  sendenFehlgeschlagen:"الإرسال لم ينجح",
  sendenFehlerText:"المكتب لم يستلمها بعد. هي محفوظة في الهاتف.",
  nichtGemerkt:"تعذّر حفظ الصورة في الهاتف. حاول مرة أخرى أثناء التوقف.",
  nochmalSenden:"أرسل مرة أخرى", weiter:"متابعة",
  wasIstPassiert:"ماذا حدث؟",
  stau:"ازدحام", mussWarten:"يجب أن أنتظر", containerFehlt:"الحاوية غير موجودة",
  panne:"عطل", bueroAnrufen:"اتصل بالمكتب",
  keineNummer:"لا يوجد رقم هاتف محفوظ للمكتب.",
  meldenFrage:"هل تريد الإبلاغ عن {was}؟", melden:"أبلغ",
  meldenStandHinweis:"أبلغ فقط عندما تكون الشاحنة متوقفة بأمان.",
  meldungGesendet:"تم إرسال البلاغ",
  meldungWartet:"لم يُرسل بعد – لا يوجد إنترنت",
  meldungFehler:"البلاغ لم يصل",
  meldungGelesen:"المكتب قرأ البلاغ", meldungNichtGelesen:"المكتب لم يقرأ البلاغ بعد",
  standTitel:"هل الشاحنة متوقفة بأمان؟",
  standText:"افعل ذلك في التوقف فقط. التطبيق لا يعرف إن كنت تقود.",
  standJa:"الشاحنة متوقفة بأمان", standNein:"ليس بعد",
  auftragAbgeschlossen:"تم إنهاء المهمة",
  abgeliefertUm:"تم التسليم في {ort} الساعة {zeit}",
  naechsterAuftrag:"المهمة التالية: {ort}", naechstenAnsehen:"اعرض المهمة التالية",
  keinWeiterer:"لا مهمة أخرى اليوم",
  bueroSiehtVerspaetung:"يتم إبلاغ المكتب بالتأخير تلقائياً. تابع القيادة بشكل طبيعي.",
  tagFertigAnsehen:"اعرض اليوم",
  tagesplan:"اليوم", uebersicht:"نظرة عامة",
  statusJetzt:"الآن", statusOffen:"مفتوح", statusUnterwegs:"على الطريق",
  statusBeimKunden:"عند العميل", statusFertig:"منتهي",
  nichtsHeute:"لا مهمة اليوم", heuteFertig:"كل مهام اليوم منتهية",
  morgenVorschau:"معاينة للغد، {datum}",
  morgenHinweis:"معاينة فقط. المهمة تبدأ غداً.",
  alleGesendet:"تم إرسال كل شيء",
  wartetAufNetz:"{n} تسجيلات تنتظر الشبكة",
  einerWartetAufNetz:"تسجيل واحد ينتظر الشبكة",
  standVon:"بيانات المكتب: {zeit}",
  keinNetzStreifen:"لا يوجد إنترنت. المعروض بيانات الساعة {zeit}.",
  keinNetzLaden:"لا يوجد إنترنت ولا بيانات على الهاتف.",
  nochmalLaden:"حاول مرة أخرى",
  vorlesenGehtNicht:"هذا الهاتف لا يقرأ بصوت.",
  geaendert:"تم تعديل المهمة", neuStatt:"جديد: {neu} بدل {alt}", neuOhneAlt:"جديد: {neu}",
  gesehenBestaetigen:"رأيت وأؤكد", bestaetigt:"مؤكد",
  wer:"من أنت؟", pin:"الرمز", falsch:"الرمز خطأ",
  installieren:"احفظ كتطبيق"
}
};

/* Sprachen mit Namen anzeigen, Flagge nur als Ergänzung */
const SPRACHNAME = { de:"Deutsch", tr:"Türkçe", pl:"Polski", ro:"Română", ar:"العربية" };
const FLAGGE     = { de:"🇩🇪", tr:"🇹🇷", pl:"🇵🇱", ro:"🇷🇴", ar:"🇸🇦" };
const STIMME     = { de:"de-DE", tr:"tr-TR", pl:"pl-PL", ro:"ro-RO", ar:"ar-SA" };
const RTL        = { ar:true };

/* Sprache wird einmal gewählt und bleibt ein Jahr gemerkt.
   Zuerst ein Cookie, damit auch der Service Worker damit klarkommt.
   Manche Browser verbieten Cookies (privates Fenster, eingebettete Seite).
   Dann darf die App nicht stehenbleiben: sie weicht auf den örtlichen
   Speicher aus und notfalls auf Deutsch für diese Sitzung. */
function spracheLesen(){
  try { const m = document.cookie.match(/tl_lang=(\w\w)/); if (m) return m[1]; } catch (e) {}
  try { const v = localStorage.getItem("tl_lang"); if (v) return v; } catch (e) {}
  return null;
}
function spracheMerken(k){
  try { document.cookie = "tl_lang=" + k + "; Path=/; Max-Age=" + 365*24*3600 + "; SameSite=Lax"; }
  catch (e) {}
  try { localStorage.setItem("tl_lang", k); } catch (e) {}
}

let L = spracheLesen() || "de";
if (!W[L]) L = "de";

function setzeSprache(k){
  if (!W[k]) return;
  L = k;
  spracheMerken(k);
  richtungSetzen();
}
function richtungSetzen(){
  document.documentElement.lang = L;
  document.documentElement.dir  = RTL[L] ? "rtl" : "ltr";
}
richtungSetzen();

/* Übersetzung holen. Fehlt ein Satz, kommt der deutsche.
   t("knapp",{min:8}) -> "Es wird knapp. Noch 8 Minuten Reserve." */
function t(schluessel, werte){
  let s = (W[L] && W[L][schluessel]) || W.de[schluessel] || schluessel;
  if (werte) for (const k in werte) s = s.split("{"+k+"}").join(werte[k]);
  return s;
}

/* ---------- Vorlesen: nur auf Knopfdruck, niemals von allein ---------- */
const vorlesenMoeglich = () => "speechSynthesis" in window;
function sprich(text){
  if (!vorlesenMoeglich() || !text) return;
  try {
    speechSynthesis.cancel();                 // nichts überlagern
    const u = new SpeechSynthesisUtterance(text);
    u.lang = STIMME[L] || "de-DE";
    u.rate = 0.85;
    speechSynthesis.speak(u);
  } catch (e) {}
}

/* ---------- Symbole: immer zusammen mit einem Wort benutzen ---------- */
function sv(g, inhalt, dicke){
  return `<svg width="${g}" height="${g}" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="${dicke||2}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"
    focusable="false">${inhalt}</svg>`;
}
const I = {
  haken:  (g=30)=>sv(g,'<circle cx="12" cy="12" r="9"/><path d="M7.5 12.5l3 3 6-6.5"/>',2.4),
  sanduhr:(g=30)=>sv(g,'<path d="M7 3h10M7 21h10M8 3c0 4 8 5 8 9s-8 5-8 9"/><path d="M16 3c0 4-8 5-8 9s8 5 8 9"/>'),
  warnung:(g=30)=>sv(g,'<path d="M12 3.5L21 19H3z"/><path d="M12 9v5M12 16.6h.01"/>'),
  frage:  (g=30)=>sv(g,'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.3a2.6 2.6 0 1 1 3.4 2.5c-.6.2-.9.8-.9 1.4v.6M12 17h.01"/>'),
  uhr:    (g=30)=>sv(g,'<circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.2 2"/>'),
  wecker: (g=30)=>sv(g,'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 1.5M4 4l3-2M20 4l-3-2"/>'),
  lkw:    (g=28)=>sv(g,'<path d="M2 6h11v10H2z"/><path d="M13 9h4l4 3.5V16h-8z"/><circle cx="6.5" cy="18.5" r="2"/><circle cx="17.5" cy="18.5" r="2"/>'),
  chassis:(g=28)=>sv(g,'<path d="M2 12h20"/><path d="M4 12v3M20 12v3"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/><path d="M5 9h14"/>'),
  box:    (g=28)=>sv(g,'<rect x="3" y="6" width="18" height="12"/><path d="M7 6v12M11 6v12M15 6v12"/>'),
  siegel: (g=28)=>sv(g,'<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10"/>'),
  kamera: (g=34)=>sv(g,'<path d="M3 8h4l1.5-2h7L17 8h4v12H3z"/><circle cx="12" cy="13.5" r="3.5"/>'),
  telefon:(g=28)=>sv(g,'<path d="M6 3h4l2 5-2.5 1.5a12 12 0 0 0 5 5L16 12l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z"/>'),
  ton:    (g=30)=>sv(g,'<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9.5a4 4 0 0 1 0 5"/><path d="M19.5 7a7.5 7.5 0 0 1 0 10"/>'),
  info:   (g=28)=>sv(g,'<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 8h.01"/>'),
  pfeil:  (g=28)=>sv(g,'<path d="M4 12h15M13 6l6 6-6 6"/>'),
  zurueck:(g=28)=>sv(g,'<path d="M20 12H5M11 6l-6 6 6 6"/>'),
  runter: (g=24)=>sv(g,'<path d="M6 9l6 6 6-6"/>'),
  rauf:   (g=24)=>sv(g,'<path d="M6 15l6-6 6 6"/>'),
  navi:   (g=28)=>sv(g,'<path d="M12 2l8.5 19-8.5-5-8.5 5z"/>'),
  liste:  (g=28)=>sv(g,'<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>'),
  kegel:  (g=30)=>sv(g,'<path d="M12 3l5.5 14h-11z"/><path d="M4 20h16"/><path d="M9.5 11h5"/>'),
  schrauben:(g=30)=>sv(g,'<circle cx="12" cy="12" r="3.2"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3'+
    'M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>'),
  globus: (g=28)=>sv(g,'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z"/>'),
  wolkeAus:(g=28)=>sv(g,'<path d="M18 17H7a4 4 0 0 1-.6-7.95A6 6 0 0 1 17 8.5"/><path d="M3 3l18 18"/>'),
  kreuz:  (g=28)=>sv(g,'<path d="M6 6l12 12M18 6L6 18"/>'),
  auge:   (g=28)=>sv(g,'<path d="M2 12s3.8-6 10-6 10 6 10 6-3.8 6-10 6-10-6-10-6z"/><circle cx="12" cy="12" r="3"/>'),
  stift:  (g=28)=>sv(g,'<path d="M4 20h4l11-11-4-4L4 16z"/><path d="M14 5l4 4"/>')
};

/* ---------- App-Installation (nur wenn der Browser sie anbietet) ---------- */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    try { navigator.serviceWorker.register("/sw.js").catch(()=>{}); } catch (e) {}
  });
}
let installEvent = null;
window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault(); installEvent = e;
  const b = document.getElementById("install");
  if (b) { b.style.display = "flex"; b.textContent = t("installieren"); }
});
function installieren(){
  if (!installEvent) return;
  installEvent.prompt(); installEvent = null;
  const b = document.getElementById("install"); if (b) b.style.display = "none";
}

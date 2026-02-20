# Wydatki Checker - PWA do zarządzania wydatkami

Aplikacja PWA (Progressive Web App) do śledzenia wydatków z funkcją powiadomień push i trybem offline. Projekt studenki na przedmiot PWA.

## Funkcjonalności

### Podstawowe funkcje

- 📊 Dashboard z podsumowaniem miesięcznych wydatków
- ➕ Dodawanie wydatków z przypisaniem do kategorii
- 📋 Historia wydatków z podziałem na miesiące i tygodnie
- 💰 Ustawianie miesięcznego limitu budżetu
- 📈 Wizualizacja postępu wydatków w procentach

### Natywne funkcje urządzenia (2+)

1. **📷 Kamera** - robienie zdjęć paragonów przy dodawaniu wydatków
2. **🔔 Powiadomienia Push** - codzienne przypomnienia o stanie budżetu
3. **📍 Geolokalizacja** - opcjonalne zapisywanie lokalizacji przy dodawaniu wydatku

### Funkcje PWA

- ⚡ Instalowalna na urządzeniach mobilnych i desktopowych
- 🔌 Pełna funkcjonalność w trybie offline dzięki Service Worker
- 💾 Cache API do przechowywania danych lokalnie
- 🎨 Responsywny ciemny motyw
- 📱 Manifest z metadanymi aplikacji

## Technologie

- **HTML5** - struktura aplikacji
- **CSS3** - stylowanie z ciemnym motywem, animacje, responsywność
- **JavaScript (Vanilla)** - logika aplikacji, Service Worker
- **LocalStorage** - przechowywanie danych offline
- **Cache API** - buforowanie zasobów
- **Notifications API** - powiadomienia push
- **MediaDevices API** - dostęp do kamery

## Struktura projektu

```
wydatki-checker/
├── index.html                 # Dashboard
├── add-expense.html            # Dodawanie wydatku
├── history.html                # Historia
├── shared/
│   ├── app.js                  # Bootstrap aplikacji
│   ├── state.js                # Stan aplikacji
│   ├── storage.js              # LocalStorage
│   ├── date.js                 # Daty i formatowanie
│   ├── expenses.js             # Logika wydatkow
│   ├── file.js                 # Pliki i geolokalizacja
│   └── base.css                # Style wspolne
├── features/
│   ├── categories/
│   │   └── index.js             # Kategorie i selecty
│   ├── notifications/
│   │   └── index.js             # Powiadomienia
│   ├── online/
│   │   └── index.js             # Status online/offline
│   ├── receipts/
│   │   └── index.js             # Modal paragonu
│   ├── service-worker/
│   │   └── index.js             # Rejestracja SW
│   └── theme/
│       └── index.js             # Motywy
├── pages/
│   ├── dashboard/
│   │   ├── index.js             # Logika dashboardu
│   │   └── styles.css           # Style dashboardu
│   ├── add-expense/
│   │   ├── index.js             # Logika dodawania wydatku
│   │   └── styles.css           # Style dodawania wydatku
│   └── history/
│       ├── index.js             # Logika historii
│       └── styles.css           # Style historii
├── service-worker.js           # Service Worker do cache'owania
├── manifest.json               # Manifest PWA
├── icons/                      # Ikony aplikacji (72-512px)
│   ├── icon-72.png
│   ├── icon-96.png
│   ├── icon-128.png
│   ├── icon-144.png
│   ├── icon-152.png
│   ├── icon-192.png
│   ├── icon-384.png
│   └── icon-512.png
└── README.md                   # Ten plik
```

## Instalacja i uruchomienie

### Wymagania

- Przeglądarka z obsługą Service Workers (Chrome, Firefox, Edge, Safari)
- Lokalny serwer HTTP (aplikacja wymaga HTTPS lub localhost dla Service Worker)

### Krok 1: Sklonuj repozytorium

```bash
git clone https://github.com/twoja-nazwa/wydatki-checker.git
cd wydatki-checker
```

### Krok 2: Uruchom lokalny serwer

#### Opcja A: Python 3

```bash
python -m http.server 8000
```

#### Opcja B: Node.js (http-server)

```bash
npx http-server -p 8000
```

#### Opcja C: PHP

```bash
php -S localhost:8000
```

#### Opcja D: VS Code Live Server

Zainstaluj rozszerzenie "Live Server" w VS Code i kliknij "Go Live"

### Krok 3: Otwórz przeglądarkę

Wejdź na adres: `http://localhost:8000`

### Krok 4: Zainstaluj aplikację

W przeglądarce kliknij ikonę instalacji (zazwyczaj w pasku adresu) aby zainstalować aplikację na urządzeniu.

## Użycie aplikacji

### Dashboard

- Wyświetla aktualny limit miesięczny i wykorzystany budżet
- Pasek postępu zmienia kolor (zielony → żółty → czerwony)
- Lista ostatnich 5 wydatków
- Przyciski do dodawania wydatku i przeglądania historii

### Dodawanie wydatku

1. Kliknij "Dodaj wydatek"
2. Wprowadź kwotę
3. Wybierz kategorię: Jedzenie, Transport, Rozrywka, Rachunki, Inne
4. Opcjonalnie: dodaj opis
5. Wybierz datę
6. Opcjonalnie: zrób zdjęcie paragonu (dostęp do kamery)
7. Kliknij "Dodaj wydatek"

### Historia

- Filtruj wydatki: Wszystko / Tydzień / Miesiąc
- Karty miesięczne z podsumowaniem
- Zielona ramka = budżet OK, czerwona = przekroczono limit
- Lista wszystkich wydatków w danym okresie

### Ustawienia

1. Kliknij ikonę ⚙️ w prawym górnym rogu
2. Ustaw miesięczny limit budżetu
3. Wybierz godzinę codziennych powiadomień
4. Włącz/wyłącz powiadomienia
5. Opcjonalnie: wyczyść wszystkie dane

### Powiadomienia

Aplikacja wysyła codzienne powiadomienie o wybranej godzinie:

- ✅ "Pozostało X zł" - gdy budżet jest OK
- ⚠️ "Przekroczono limit" - gdy wydano więcej niż limit

## Strategia buforowania (Service Worker)

### Cache First (dla statycznych zasobów)

- HTML, CSS, JavaScript, ikony
- Najpierw sprawdza cache, potem sieć
- Aktualizuje cache w tle

### Network First (dla dynamicznych danych)

- API i dane zmienne
- Najpierw próbuje sieci, potem cache
- Zapisuje do cache przy sukcesie

### Offline Fallback

- Wyświetla dedykowaną stronę offline gdy brak połączenia
- Wszystkie dane użytkownika zapisane lokalnie działają offline

## Responsywność

Aplikacja dostosowuje się do różnych rozmiarów ekranu:

- 📱 Mobile: 320px - 599px
- 📱 Tablet: 600px - 1023px
- 💻 Desktop: 1024px+

## Wydajność

Aplikacja zoptymalizowana pod kątem:

- ⚡ Szybkie ładowanie (< 2s)
- 💾 Minimalne użycie pamięci
- 🎨 Płynne animacje (60 FPS)
- 📦 Małe zasoby (cache < 5MB)

Zalecam test w Lighthouse dla oceny wydajności.

## Zgodność przeglądarek

| Przeglądarka | Wersja | Status            |
| ------------ | ------ | ----------------- |
| Chrome       | 67+    | ✅ Pełne wsparcie |
| Firefox      | 63+    | ✅ Pełne wsparcie |
| Safari       | 11.1+  | ✅ Pełne wsparcie |
| Edge         | 79+    | ✅ Pełne wsparcie |

## Problemy i rozwiązania

### Service Worker nie działa

- Sprawdź czy używasz HTTPS lub localhost
- Wyczyść cache przeglądarki
- Zrestartuj przeglądarkę

### Powiadomienia nie działają

- Sprawdź uprawnienia w ustawieniach przeglądarki
- Włącz powiadomienia w ustawieniach aplikacji
- Na iOS: dodaj do ekranu głównego

### Zdjęcia nie działają

- Sprawdź uprawnienia do kamery
- Na urządzeniu mobilnym użyj HTTPS

## Autor

Projekt stworzony na zaliczenie przedmiotu PWA.

## Licencja

MIT License - możesz swobodnie używać i modyfikować kod.

## Deployment (hosting)

### GitHub Pages

1. Stwórz repozytorium na GitHub
2. Wejdź w Settings → Pages
3. Wybierz branch main
4. Aplikacja dostępna pod: `https://twoja-nazwa.github.io/wydatki-checker/`

### Netlify

1. Zaloguj się na Netlify
2. Przeciągnij folder projektu
3. Aplikacja automatycznie wdeploy'owana

### Vercel

```bash
npm i -g vercel
vercel
```

**Uwaga**: Pamiętaj że aplikacja musi działać na HTTPS dla pełnej funkcjonalności PWA!

## Możliwe rozszerzenia

- [ ] Synchronizacja z chmurą
- [ ] Eksport danych do CSV/PDF
- [ ] Wykresy i statystyki
- [ ] Wspólne budżety (multi-user)
- [ ] Integracja z bankami
- [ ] Skanowanie paragonów OCR
- [ ] Kategorie własne użytkownika

---

**Uwaga techniczna**: Pamiętaj żeby wygenerować prawdziwe ikony aplikacji (72x72 do 512x512px) przed deploymentem. Możesz użyć narzędzi online jak realfavicongenerator.net lub pwa-asset-generator.

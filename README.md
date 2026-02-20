# Wydatki Checker (PWA)

Prosty projekt na zajecia z PWA. Aplikacja sluzy do zapisywania wydatkow, ustawiania budzetu i przegladania historii.

## Co robi aplikacja

- dodawanie wydatku (kwota, kategoria, opis, data)
- podglad historii wydatkow
- filtrowanie historii (wszystko / tydzien / miesiac)
- ustawianie miesiecznego limitu budzetu
- lokalny zapis danych w `localStorage`
- dzialanie offline przez `Service Worker`
- instalacja jako PWA (z poziomu przegladarki)

## Uzyte technologie

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- Service Worker API
- Cache API
- LocalStorage API
- Notifications API

## Jak uruchomic lokalnie

1. Sklonuj repo:

```bash
git clone <URL_REPO>
cd progresywne
```

2. Uruchom serwer statyczny (jedna z opcji):

```bash
python -m http.server 8000
```

albo

```bash
npx http-server -p 8000
```

3. Otworz w przegladarce:

```text
http://localhost:8000
```

## Struktura projektu

```text
.
├── index.html
├── add-expense.html
├── history.html
├── manifest.json
├── service-worker.js
├── shared/
├── features/
└── pages/
```

## Informacje o PWA

Aplikacja ma:

- `manifest.json`
- `service-worker.js`
- cache zasobow statycznych
- fallback offline dla dokumentow

Po deployu na HTTPS mozna ja zainstalowac jako aplikacje (opcja w menu przegladarki).

## Dokumentacja kodu

Kod jest podzielony na moduly:

- `shared/` - wspolne funkcje i stan
- `features/` - funkcje dodatkowe (np. kategorie, online, service worker)
- `pages/` - logika konkretnych podstron

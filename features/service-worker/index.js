function resolveAppBasePath() {
    const parts = window.location.pathname.split('/').filter(Boolean);
    if (parts.length === 0) return '/';

    const lastPart = parts[parts.length - 1];
    const looksLikeFile = lastPart.includes('.');
    const baseParts = looksLikeFile ? parts.slice(0, -1) : parts;

    return `/${baseParts.join('/')}/`;
}

async function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;

    try {
        const appBasePath = resolveAppBasePath();
        const swUrl = new URL(`${appBasePath}service-worker.js`, window.location.origin);
        const registration = await navigator.serviceWorker.register(swUrl.href, { scope: appBasePath });
        console.log('Service Worker zarejestrowany:', registration);

        navigator.serviceWorker.addEventListener('controllerchange', () => {
            window.location.reload();
        });

        if (registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
        
        registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (!newWorker) return;

            newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    newWorker.postMessage({ type: 'SKIP_WAITING' });
                }
            });
        });
    } catch (error) {
        console.error('Błąd rejestracji Service Worker:', error);
    }
}

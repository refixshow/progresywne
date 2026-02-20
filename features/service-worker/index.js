const serviceWorkerScriptBaseUrl = document.currentScript
    ? document.currentScript.src
    : window.location.href;

async function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;

    try {
        const swUrl = new URL('../../service-worker.js', serviceWorkerScriptBaseUrl);
        const scopePath = new URL('.', swUrl).pathname;
        const registration = await navigator.serviceWorker.register(swUrl.href, { scope: scopePath });
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

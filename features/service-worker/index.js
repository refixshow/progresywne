async function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;

    try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
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

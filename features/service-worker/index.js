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
    await navigator.serviceWorker.register(swUrl.href, { scope: appBasePath });
  } catch (error) {
    console.error('Error service worker:', error);
  }
}

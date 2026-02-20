let appInitializationPromise = null;
let notificationIntervalId = null;

function initializeApp() {
  if (appInitializationPromise) {
    return appInitializationPromise;
  }

  appInitializationPromise = (async () => {
    await registerServiceWorker();

    loadStateFromStorage();

    applyTheme(state.theme);

    checkOnlineStatus();

    if (state.notificationsEnabled) {
      requestNotificationPermission();
    }

    checkDailyNotification();

    if (!notificationIntervalId) {
      notificationIntervalId = setInterval(
        checkDailyNotification,
        60 * 60 * 1000,
      );
    }

    window.addEventListener("online", checkOnlineStatus);
    window.addEventListener("offline", checkOnlineStatus);
  })();

  return appInitializationPromise;
}

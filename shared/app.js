document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
});

async function initializeApp() {
  await registerServiceWorker();

  loadStateFromStorage();

  applyTheme(state.theme);

  checkOnlineStatus();

  if (state.notificationsEnabled) {
    requestNotificationPermission();
  }

  checkDailyNotification();

  setInterval(checkDailyNotification, 60 * 60 * 1000);

  window.addEventListener("online", checkOnlineStatus);
  window.addEventListener("offline", checkOnlineStatus);
}

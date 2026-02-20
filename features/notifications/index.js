async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.log("Powiadomienia nie są wspierane");
    return;
  }

  if (Notification.permission === "default") {
    const permission = await Notification.requestPermission();
    console.log("Uprawnienia powiadomień:", permission);
  }
}

function showNotification(title, body) {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    return;
  }

  const iconUrl = new URL("icons/icon-192.png", window.location.href).href;
  const badgeUrl = new URL("icons/icon-72.png", window.location.href).href;

  const notification = new Notification(title, {
    body,
    icon: iconUrl,
    badge: badgeUrl,
    tag: "expense-notification",
    requireInteraction: false,
  });

  notification.onclick = () => {
    window.focus();
    notification.close();
  };
}

function checkDailyNotification() {
  if (!state.notificationsEnabled) return;

  const now = new Date();
  const today = now.toDateString();

  if (state.lastNotificationDate === today) {
    return;
  }

  const [hours, minutes] = state.notificationTime.split(":").map(Number);
  const notificationTime = new Date();
  notificationTime.setHours(hours, minutes, 0, 0);

  if (now >= notificationTime) {
    const spent = calculateTotalSpent();
    const remaining = state.budget - spent;

    let title, body;
    if (spent > state.budget) {
      title = "Przekroczono limit!";
      body = `Wydałeś ${spent.toFixed(2)} zł z ${state.budget.toFixed(2)} zł. Przekroczenie o ${(spent - state.budget).toFixed(2)} zł.`;
    } else if (remaining > 0) {
      title = "Raport wydatków";
      body = `Pozostało ${remaining.toFixed(2)} zł z ${state.budget.toFixed(2)} zł (${((remaining / state.budget) * 100).toFixed(0)}%)`;
    } else {
      title = "Osiągnięto limit";
      body = `Wydano dokładnie ${state.budget.toFixed(2)} zł. Dalsze wydatki przekroczą limit.`;
    }

    showNotification(title, body);
    state.lastNotificationDate = today;
    saveStateToStorage();
  }
}

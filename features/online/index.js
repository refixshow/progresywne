function checkOnlineStatus() {
  const indicator = document.getElementById("offline-indicator");
  if (navigator.onLine) {
    indicator.classList.remove("show");
    return;
  }
  indicator.classList.add("show");
}

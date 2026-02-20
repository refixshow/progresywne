function getMonthName(month) {
  const months = [
    "Styczeń",
    "Luty",
    "Marzec",
    "Kwiecień",
    "Maj",
    "Czerwiec",
    "Lipiec",
    "Sierpień",
    "Wrzesień",
    "Październik",
    "Listopad",
    "Grudzień",
  ];
  return months[month];
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now - date;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Dzisiaj";
  if (diffDays === 1) return "Wczoraj";
  if (diffDays < 7) return `${diffDays} dni temu`;

  return date.toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function setTodayDate() {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("expense-date").value = today;
}

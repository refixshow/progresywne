const state = {
  expenses: [],
  budget: 500,
  notificationTime: "09:00",
  notificationsEnabled: true,
  lastNotificationDate: null,
  currentFilter: "all",
  theme: "system",
  categories: [
    { id: "jedzenie", name: "Jedzenie", icon: "JED" },
    { id: "transport", name: "Transport", icon: "TRA" },
    { id: "rozrywka", name: "Rozrywka", icon: "ROZ" },
    { id: "rachunki", name: "Rachunki", icon: "RAC" },
    { id: "inne", name: "Inne", icon: "INN" },
  ],
};

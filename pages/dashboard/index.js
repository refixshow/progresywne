// dashboard.js - logika dla strony głównej

document.addEventListener("DOMContentLoaded", () => {
  initializeApp().then(() => {
    setupDashboard();
  });
});

function setupDashboard() {
  updateDashboard();

  // Modal ustawień
  const settingsBtn = document.getElementById("settings-btn");
  const closeSettings = document.getElementById("close-settings");
  const saveSettings = document.getElementById("save-settings");
  const clearData = document.getElementById("clear-data");
  const addCategoryBtn = document.getElementById("add-category-btn");

  if (settingsBtn) {
    settingsBtn.addEventListener("click", openSettings);
  }

  if (closeSettings) {
    closeSettings.addEventListener("click", closeSettingsModal);
  }

  if (saveSettings) {
    saveSettings.addEventListener("click", saveSettingsData);
  }

  if (clearData) {
    clearData.addEventListener("click", clearAllData);
  }

  if (addCategoryBtn) {
    addCategoryBtn.addEventListener("click", handleAddCategory);
  }
}

// Aktualizacja dashboardu
function updateDashboard() {
  const spent = calculateTotalSpent();
  const remaining = state.budget - spent;
  const percentage = (spent / state.budget) * 100;

  // Aktualizacja liczb
  document.getElementById("budget-limit").textContent =
    `${state.budget.toFixed(2)} zł`;
  document.getElementById("spent-amount").textContent =
    `${spent.toFixed(2)} zł`;
  document.getElementById("remaining-amount").textContent =
    `${remaining.toFixed(2)} zł pozostało`;
  document.getElementById("budget-percent").textContent =
    `${percentage.toFixed(1)}% wykorzystane`;

  // Aktualizacja paska postępu
  const progressFill = document.getElementById("progress-fill");
  progressFill.style.width = `${Math.min(percentage, 100)}%`;

  // Zmiana kolorów w zależności od wydatków
  progressFill.classList.remove("warning", "danger");
  if (percentage >= 90) {
    progressFill.classList.add("danger");
  } else if (percentage >= 70) {
    progressFill.classList.add("warning");
  }

  // Renderowanie ostatnich wydatków
  renderRecentExpenses();
}

// Renderowanie ostatnich wydatków
function renderRecentExpenses() {
  const container = document.getElementById("recent-list");
  const recent = state.expenses
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  if (recent.length === 0) {
    container.innerHTML = `
            <div class="empty-state">
                <p class="empty-state-text">Brak wydatków</p>
            </div>
        `;
    return;
  }

  container.innerHTML = recent
    .map((expense) => createExpenseCard(expense))
    .join("");
}

function openSettings() {
  document.getElementById("budget-input").value = state.budget;
  document.getElementById("notification-time").value = state.notificationTime;
  document.getElementById("enable-notifications").checked =
    state.notificationsEnabled;

  const themeSelect = document.getElementById("theme-select");
  if (themeSelect) {
    themeSelect.value = state.theme || "system";
  }

  renderCategoriesList();

  document.getElementById("settings-modal").classList.add("active");
}

function closeSettingsModal() {
  document.getElementById("settings-modal").classList.remove("active");
}

function saveSettingsData() {
  state.budget =
    parseFloat(document.getElementById("budget-input").value) || 500;
  state.notificationTime = document.getElementById("notification-time").value;
  state.notificationsEnabled = document.getElementById(
    "enable-notifications",
  ).checked;

  const themeSelect = document.getElementById("theme-select");
  if (themeSelect) {
    applyTheme(themeSelect.value);
  }

  const saved = saveStateToStorage();
  if (!saved) {
    alert("Nie udalo sie zapisac ustawien. Sprawdz ilosc danych zapisanych w aplikacji.");
    return;
  }
  updateDashboard();
  closeSettingsModal();

  if (state.notificationsEnabled) {
    requestNotificationPermission();
  }
}

function clearAllData() {
  if (
    confirm(
      "Czy na pewno chcesz usunąć wszystkie dane? Tej operacji nie można cofnąć.",
    )
  ) {
    state.expenses = [];
    state.budget = 500;
    const saved = saveStateToStorage();
    if (!saved) {
      alert("Nie udalo sie wyczyscic danych w localStorage.");
      return;
    }
    updateDashboard();
    closeSettingsModal();
  }
}

function renderCategoriesList() {
  const container = document.getElementById("categories-list");

  if (!container) {
    console.error("Container categories-list not found!");
    return;
  }

  container.innerHTML = state.categories
    .map(
      (cat) => `
        <div class="category-item">
            <div class="category-item-info">
                <span class="category-icon-display">${cat.icon}</span>
                <span class="category-name-display">${cat.name}</span>
            </div>
            <button class="btn-delete-category" data-category-id="${cat.id}">Usuń</button>
        </div>
    `,
    )
    .join("");

  container.querySelectorAll(".btn-delete-category").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const categoryId = e.target.getAttribute("data-category-id");
      handleRemoveCategory(categoryId);
    });
  });
}

function handleAddCategory() {
  const nameInput = document.getElementById("new-category-name");
  const iconInput = document.getElementById("new-category-icon");

  const name = nameInput.value.trim();
  const icon = iconInput.value.trim().toUpperCase();

  if (!name) {
    alert("Proszę podać nazwę kategorii");
    return;
  }

  const success = addCategory(name, icon);
  if (success) {
    nameInput.value = "";
    iconInput.value = "";
    renderCategoriesList();
    updateAllCategorySelects();
  } else {
    alert("Kategoria o takiej nazwie już istnieje");
  }
}

function handleRemoveCategory(categoryId) {
  const hasExpenses = state.expenses.some((e) => e.category === categoryId);
  if (hasExpenses) {
    if (
      !confirm(
        "Ta kategoria ma przypisane wydatki. Czy na pewno chcesz ją usunąć? Wydatki zostaną z nią zachowane.",
      )
    ) {
      return;
    }
  }

  const success = removeCategory(categoryId);
  if (success) {
    renderCategoriesList();
    updateAllCategorySelects();
  }
}

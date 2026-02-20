document.addEventListener("DOMContentLoaded", () => {
  initializeApp().then(() => {
    setupHistory();
  });
});

let historySearchTerm = "";
let historyCategory = "all";

function setupHistory() {
  renderHistory();

  const searchInput = document.getElementById("history-search");
  const categorySelect = document.getElementById("history-category");

  if (categorySelect) {
    renderHistoryCategoryOptions(categorySelect);
    categorySelect.addEventListener("change", (e) => {
      historyCategory = e.target.value;
      renderHistory();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      historySearchTerm = e.target.value.trim().toLowerCase();
      renderHistory();
    });
  }
  document.querySelectorAll(".filter-tabs .tab").forEach((tab) => {
    tab.addEventListener("click", (e) => {
      document
        .querySelectorAll(".filter-tabs .tab")
        .forEach((t) => t.classList.remove("active"));
      e.target.classList.add("active");
      state.currentFilter = e.target.dataset.filter;
      renderHistory();
    });
  });
}
function renderHistory() {
  const container = document.getElementById("history-list");

  let filteredExpenses = [...state.expenses];
  const now = new Date();
  if (state.currentFilter === "week") {
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    filteredExpenses = filteredExpenses.filter(
      (e) => new Date(e.date) >= weekAgo,
    );
  } else if (state.currentFilter === "month") {
    filteredExpenses = filteredExpenses.filter((e) => {
      const d = new Date(e.date);
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    });
  }

  if (historyCategory && historyCategory !== "all") {
    filteredExpenses = filteredExpenses.filter(
      (e) => e.category === historyCategory,
    );
  }

  if (historySearchTerm) {
    filteredExpenses = filteredExpenses.filter((e) =>
      matchesHistorySearch(e, historySearchTerm),
    );
  }

  if (filteredExpenses.length === 0) {
    container.innerHTML = `
            <div class="empty-state">
                <p class="empty-state-text">Brak wyników dla wybranych filtrów</p>
            </div>
        `;
    return;
  }
  const groupedByMonth = groupExpensesByMonth(filteredExpenses);

  container.innerHTML = Object.entries(groupedByMonth)
    .map(([monthKey, expenses]) => createMonthCard(monthKey, expenses))
    .join("");
}

function renderHistoryCategoryOptions(select) {
  const options = state.categories
    .map((cat) => `<option value="${cat.id}">${cat.name}</option>`)
    .join("");

  select.innerHTML = `<option value="all">Wszystkie kategorie</option>${options}`;
}

function matchesHistorySearch(expense, term) {
  const description = (expense.description || "").toLowerCase();
  const categoryName = getCategoryName(expense.category).toLowerCase();
  return description.includes(term) || categoryName.includes(term);
}
function groupExpensesByMonth(expenses) {
  const grouped = {};

  expenses.forEach((expense) => {
    const date = new Date(expense.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(expense);
  });

  return grouped;
}
function createMonthCard(monthKey, expenses) {
  const [year, month] = monthKey.split("-");
  const monthName = getMonthName(parseInt(month) - 1);
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const isOverBudget = total > state.budget;
  const statusClass = isOverBudget ? "danger" : "success";

  const sortedExpenses = expenses.sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  return `
        <div class="history-month-card ${statusClass}">
            <div class="month-header">
                <div class="month-title">${monthName} ${year}</div>
                <div class="month-summary">
                    <div class="month-spent">${total.toFixed(2)} zł</div>
                    <div class="month-limit">Limit: ${state.budget.toFixed(2)} zł</div>
                </div>
            </div>
            <div class="month-expenses">
                ${sortedExpenses.map((e) => createExpenseCard(e)).join("")}
            </div>
        </div>
    `;
}

function calculateTotalSpent(filterType = "month") {
  const now = new Date();

  const filtered = state.expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);

    if (filterType === "month") {
      return (
        expenseDate.getMonth() === now.getMonth() &&
        expenseDate.getFullYear() === now.getFullYear()
      );
    } else if (filterType === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return expenseDate >= weekAgo;
    }
    return true;
  });

  return filtered.reduce((sum, expense) => sum + expense.amount, 0);
}

function createExpenseCard(expense) {
  const icon = getCategoryIcon(expense.category);
  const categoryName = getCategoryName(expense.category);
  const formattedDate = formatDate(expense.date);

  const receiptImage = expense.receipt
    ? `<img src="${expense.receipt}" alt="Paragon" class="expense-receipt" onclick="showReceiptFullScreen('${expense.receipt}')">`
    : "";

  return `
        <div class="expense-card">
            <div class="expense-icon">${icon}</div>
            <div class="expense-details">
                <div class="expense-category">${categoryName}</div>
                <div class="expense-description">${expense.description || "Brak opisu"}</div>
                <div class="expense-date">${formattedDate}</div>
            </div>
            <div class="expense-amount">-${expense.amount.toFixed(2)} zł</div>
            ${receiptImage}
        </div>
    `;
}

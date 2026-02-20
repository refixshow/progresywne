document.addEventListener("DOMContentLoaded", () => {
  initializeApp().then(() => {
    setupAddExpenseForm();
    loadCategoriesIntoSelect();
  });
});

function setupAddExpenseForm() {
  setTodayDate();

  const form = document.getElementById("expense-form");
  if (form) {
    form.addEventListener("submit", handleExpenseSubmit);
  }

  const takePhotoBtn = document.getElementById("take-photo-btn");
  const receiptFile = document.getElementById("receipt-file");

  if (takePhotoBtn) {
    takePhotoBtn.addEventListener("click", () => {
      receiptFile.click();
    });
  }

  if (receiptFile) {
    receiptFile.addEventListener("change", handleReceiptUpload);
  }
}

async function handleExpenseSubmit(e) {
  e.preventDefault();

  const amount = parseFloat(document.getElementById("expense-amount").value);
  const category = document.getElementById("expense-category").value;
  const description = document.getElementById("expense-description").value;
  const date = document.getElementById("expense-date").value;
  const receiptFile = document.getElementById("receipt-file").files[0];

  let receipt = null;
  if (receiptFile) {
    receipt = await fileToBase64(receiptFile);
  }

  const expense = {
    id: Date.now(),
    amount,
    category,
    description,
    date,
    receipt,
    createdAt: new Date().toISOString(),
  };

  state.expenses.push(expense);
  const saved = saveStateToStorage();
  if (!saved) {
    state.expenses.pop();
    alert(
      "Nie udalo sie zapisac wydatku. Sprobuj bez zdjecia paragonu lub wyczysc czesc danych.",
    );
    return;
  }

  const totalSpent = calculateTotalSpent();
  if (totalSpent > state.budget) {
    showNotification(
      "Przekroczono limit!",
      `Wydałeś już ${totalSpent.toFixed(2)} zł z ${state.budget.toFixed(2)} zł`,
    );
  }

  window.location.href = "index.html";
}

function handleReceiptUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const preview = document.getElementById("receipt-preview");
    preview.innerHTML = `<img src="${event.target.result}" alt="Podgląd paragonu">`;
  };
  reader.readAsDataURL(file);
}

function setTodayDate() {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("expense-date").value = today;
}

function loadCategoriesIntoSelect() {
  const select = document.getElementById("expense-category");
  if (!select) return;

  select.innerHTML =
    '<option value="">Wybierz kategorię</option>' +
    state.categories
      .map((cat) => `<option value="${cat.id}">${cat.name}</option>`)
      .join("");
}

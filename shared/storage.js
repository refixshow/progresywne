function saveStateToStorage() {
  try {
    localStorage.setItem("expenseTrackerState", JSON.stringify(state));
  } catch (error) {
    console.error("Błąd zapisu do localStorage:", error);
  }
}

function loadStateFromStorage() {
  try {
    const saved = localStorage.getItem("expenseTrackerState");
    if (saved) {
      const parsed = JSON.parse(saved);
      Object.assign(state, parsed);
    }
  } catch (error) {
    console.error("Błąd odczytu z localStorage:", error);
  }
}

function saveStateToStorage() {
  try {
    localStorage.setItem("expenseTrackerState", JSON.stringify(state));
    return true;
  } catch (error) {
    console.error("Blad zapisu do localStorage:", error);
    return false;
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
    console.error("Blad odczytu z localStorage:", error);
  }
}

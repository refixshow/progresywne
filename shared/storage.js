function saveStateToStorage() {
  try {
    localStorage.setItem("expenseTrackerState", JSON.stringify(state));
    return true;
  } catch (error) {
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
    console.error("Error loadStateFromStorage:", error);
  }
}

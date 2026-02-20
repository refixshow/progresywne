function applyTheme(theme) {
    const def = theme || "system";

    state.theme = def;
    document.documentElement.dataset.theme = def;
}

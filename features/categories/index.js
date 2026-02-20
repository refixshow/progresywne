const categoryIcons = {
    jedzenie: 'JED',
    transport: 'TRA',
    rozrywka: 'ROZ',
    rachunki: 'RAC',
    inne: 'INN'
};

function getCategoryName(category) {
    const cat = state.categories.find(c => c.id === category);
    return cat ? cat.name : 'Inne';
}

function getCategoryIcon(category) {
    const cat = state.categories.find(c => c.id === category);
    return cat ? cat.icon : 'INN';
}

function addCategory(name, icon) {
    const id = name.toLowerCase().replace(/\s+/g, '-');
    const exists = state.categories.find(c => c.id === id);
    if (exists) {
        return false;
    }
    state.categories.push({ id, name, icon: icon || name.substring(0, 3).toUpperCase() });
    const saved = saveStateToStorage();
    if (!saved) {
        state.categories.pop();
        return false;
    }
    return true;
}

function removeCategory(categoryId) {
    const index = state.categories.findIndex(c => c.id === categoryId);
    if (index > -1) {
        const [removed] = state.categories.splice(index, 1);
        const saved = saveStateToStorage();
        if (!saved) {
            state.categories.splice(index, 0, removed);
            return false;
        }
        return true;
    }
    return false;
}

function updateAllCategorySelects() {
    const selects = document.querySelectorAll('#expense-category');
    selects.forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">Wybierz kategorię</option>' +
            state.categories.map(cat => 
                `<option value="${cat.id}">${cat.name}</option>`
            ).join('');
        if (currentValue) {
            select.value = currentValue;
        }
    });
}


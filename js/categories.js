import { state, saveData, generateId } from './state.js';
import { showToast } from './utils.js';
import { renderCategories, renderCards } from './render.js';

export function openCategoryModal(categoryId = null) {
    const titleEl = document.getElementById('categoryModalTitle');
    const nameInput = document.getElementById('categoryNameInput');
    const iconInput = document.getElementById('categoryIconInput');

    if (categoryId) {
        const cat = state.categories.find(c => c.id === categoryId);
        if (!cat) return;
        state.editingCategory = cat;
        titleEl.textContent = '编辑分类';
        nameInput.value = cat.name;
        iconInput.value = cat.icon;
    } else {
        state.editingCategory = null;
        titleEl.textContent = '添加分类';
        nameInput.value = '';
        iconInput.value = '';
    }

    document.getElementById('categoryModal').classList.add('visible');
    nameInput.focus();
}

export function closeCategoryModal() {
    document.getElementById('categoryModal').classList.remove('visible');
    state.editingCategory = null;
}

export function saveCategory() {
    const name = document.getElementById('categoryNameInput').value.trim();
    const icon = document.getElementById('categoryIconInput').value.trim();

    if (!name) {
        showToast('请输入分类名称');
        return;
    }

    if (state.editingCategory) {
        state.editingCategory.name = name;
        state.editingCategory.icon = icon;
    } else {
        const newCat = {
            id: generateId(),
            name,
            icon,
            order: state.categories.length,
            createdAt: Date.now()
        };
        state.categories.push(newCat);
        state.activeCategoryId = newCat.id;
    }

    saveData();
    renderCategories();
    renderCards();
    closeCategoryModal();
    showToast(state.editingCategory ? '分类已更新' : '分类已添加');
}

export function deleteCategory(categoryId) {
    const catCards = state.cards.filter(c => c.categoryId === categoryId);
    if (catCards.length > 0) {
        if (!confirm(`删除分类将同时删除 ${catCards.length} 张卡片，确定要删除吗？`)) return;
        state.cards = state.cards.filter(c => c.categoryId !== categoryId);
    }
    state.categories = state.categories.filter(c => c.id !== categoryId);
    if (state.activeCategoryId === categoryId) {
        state.activeCategoryId = state.categories[0]?.id || null;
    }
    saveData();
    renderCategories();
    renderCards();
    showToast('分类已删除');
}

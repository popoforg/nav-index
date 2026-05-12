import { state, saveData, generateId } from './state.js';
import { showToast } from './utils.js';
import { renderCategories, renderCards } from './render.js';

export function openCardModal(cardId = null) {
    const titleEl = document.getElementById('cardModalTitle');
    const titleInput = document.getElementById('cardTitleInput');
    const categorySelect = document.getElementById('cardCategorySelect');
    const urlInput = document.getElementById('cardUrlInput');
    const iconInput = document.getElementById('cardIconInput');
    const descInput = document.getElementById('cardDescInput');

    // Populate category dropdown
    const sortedCats = [...state.categories].sort((a, b) => a.order - b.order);
    categorySelect.innerHTML = sortedCats.map(cat =>
        `<option value="${cat.id}">${cat.icon || '📁'} ${cat.name}</option>`
    ).join('');

    if (cardId) {
        const card = state.cards.find(c => c.id === cardId);
        if (!card) return;
        state.editingCard = card;
        titleEl.textContent = '编辑卡片';
        titleInput.value = card.title;
        categorySelect.value = card.categoryId;
        categorySelect.disabled = true;
        urlInput.value = card.url;
        iconInput.value = card.icon || '';
        descInput.value = card.desc || '';
    } else {
        state.editingCard = null;
        titleEl.textContent = '添加卡片';
        titleInput.value = '';
        categorySelect.value = state.activeCategoryId;
        categorySelect.disabled = false;
        urlInput.value = '';
        iconInput.value = '';
        descInput.value = '';
    }

    document.getElementById('cardModal').classList.add('visible');
    titleInput.focus();
}

export function closeCardModal() {
    document.getElementById('cardModal').classList.remove('visible');
    state.editingCard = null;
}

export function saveCard() {
    const title = document.getElementById('cardTitleInput').value.trim();
    const url = document.getElementById('cardUrlInput').value.trim();
    const icon = document.getElementById('cardIconInput').value.trim();
    const desc = document.getElementById('cardDescInput').value.trim();

    if (!title) {
        showToast('请输入标题');
        return;
    }

    if (state.editingCard) {
        state.editingCard.title = title;
        state.editingCard.url = url || 'https://';
        state.editingCard.icon = icon;
        state.editingCard.desc = desc;
    } else {
        const categoryId = document.getElementById('cardCategorySelect').value;
        const categoryCards = state.cards.filter(c => c.categoryId === categoryId);
        state.cards.push({
            id: generateId(),
            categoryId,
            title,
            url: url || 'https://',
            icon: icon,
            desc: desc,
            emoji: '🔗',
            size: '1x1',
            color: 'navy',
            order: categoryCards.length,
            createdAt: Date.now()
        });
    }

    saveData();
    renderCategories();
    renderCards();
    closeCardModal();
    showToast(state.editingCard ? '卡片已更新' : '卡片已添加');
}

export function deleteCard(cardId) {
    state.cards = state.cards.filter(c => c.id !== cardId);
    saveData();
    renderCategories();
    renderCards();
    showToast('卡片已删除');
}

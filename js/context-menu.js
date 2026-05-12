import { state, saveData, currentContextCard, setCurrentContextCard } from './state.js';
import { showToast } from './utils.js';
import { renderCategories, renderCards } from './render.js';
import { openCardModal, deleteCard } from './cards.js';
import { openCategoryModal, deleteCategory } from './categories.js';

export function showContextMenu(e, cardId) {
    setCurrentContextCard(state.cards.find(c => c.id === cardId));
    if (!currentContextCard) return;

    const menu = document.getElementById('contextMenu');
    menu.innerHTML = `
        <div class="context-menu-item" data-action="edit"><span>✎</span> 编辑卡片</div>
        <div class="context-menu-item" data-action="move"><span>↔</span> 移动到分类</div>
        <div class="context-menu-divider"></div>
        <div class="context-menu-item danger" data-action="delete"><span>✕</span> 删除</div>
    `;

    menu.style.left = `${e.clientX}px`;
    menu.style.top = `${e.clientY}px`;
    menu.classList.add('visible');

    menu.querySelectorAll('.context-menu-item').forEach(item => {
        item.addEventListener('click', (ev) => {
            ev.stopPropagation();
            const action = item.dataset.action;
            if (action === 'edit') {
                openCardModal(currentContextCard.id);
                hideContextMenu();
            } else if (action === 'delete') {
                deleteCard(currentContextCard.id);
                hideContextMenu();
            } else if (action === 'move') {
                showCategoryPicker(currentContextCard, ev);
            }
        });
    });
}

export function showCategoryContextMenu(e, categoryId) {
    const cat = state.categories.find(c => c.id === categoryId);
    if (!cat) return;

    const menu = document.getElementById('contextMenu');
    menu.innerHTML = `
        <div class="context-menu-item" data-action="edit"><span>✎</span> 编辑分类</div>
        <div class="context-menu-item danger" data-action="delete"><span>✕</span> 删除</div>
    `;

    menu.style.left = `${e.clientX}px`;
    menu.style.top = `${e.clientY}px`;
    menu.classList.add('visible');

    menu.querySelectorAll('.context-menu-item').forEach(item => {
        item.addEventListener('click', (ev) => {
            ev.stopPropagation();
            const action = item.dataset.action;
            if (action === 'edit') openCategoryModal(cat.id);
            else if (action === 'delete') deleteCategory(cat.id);
            hideContextMenu();
        });
    });
}

export function showCategoryPicker(card, e) {
    const menu = document.getElementById('contextMenu');
    const otherCategories = state.categories.filter(c => c.id !== card.categoryId);

    if (otherCategories.length === 0) {
        showToast('没有其他分类');
        return;
    }

    const rect = menu.getBoundingClientRect();

    menu.innerHTML = `
        <div class="context-menu-label">移动到分类</div>
        ${otherCategories.map(c => `
            <div class="context-menu-item" data-action="selectCategory" data-category-id="${c.id}">
                <span>${c.icon || '📁'}</span> ${c.name}
            </div>
        `).join('')}
    `;

    menu.style.left = `${rect.right + 8}px`;
    menu.style.top = `${rect.top}px`;
    menu.classList.add('visible');

    menu.querySelectorAll('.context-menu-item[data-action="selectCategory"]').forEach(item => {
        item.addEventListener('click', (ev) => {
            ev.stopPropagation();
            const targetCategoryId = item.dataset.categoryId;
            card.categoryId = targetCategoryId;
            saveData();
            renderCategories();
            renderCards();
            showToast(`已移动到 ${state.categories.find(c => c.id === targetCategoryId)?.name}`);
            hideContextMenu();
        });
    });
}

export function hideContextMenu() {
    document.getElementById('contextMenu').classList.remove('visible');
}

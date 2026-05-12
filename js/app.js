import { state, loadData } from './state.js';
import { showToast, clearSettingsStatus, getGistConfig, hideCardTooltip } from './utils.js';
import { renderCategories, renderCards } from './render.js';
import { openCategoryModal, closeCategoryModal, saveCategory } from './categories.js';
import { openCardModal, closeCardModal, saveCard } from './cards.js';
import { handleCardDragStart, handleCardDragOver, handleCardDrop, handleCardDragEnd } from './drag.js';
import { showContextMenu, showCategoryContextMenu, hideContextMenu } from './context-menu.js';
import { testGistConnection, uploadToGist, downloadFromGist } from './gist.js';
import { exportConfig, importConfig, handleImportFileChange, closeSettingsModal } from './settings.js';

// Sidebar
document.getElementById('addCategoryBtn').addEventListener('click', () => openCategoryModal());
document.getElementById('categoryCancel').addEventListener('click', closeCategoryModal);
document.getElementById('categoryConfirm').addEventListener('click', saveCategory);

// Card modals
document.getElementById('addCardBtn').addEventListener('click', () => openCardModal());
document.getElementById('cardCancel').addEventListener('click', closeCardModal);
document.getElementById('cardConfirm').addEventListener('click', saveCard);

// Settings
document.getElementById('settingsBtn').addEventListener('click', () => {
    const config = getGistConfig();
    document.getElementById('gistTokenInput').value = config.token;
    document.getElementById('gistIdInput').value = config.id;
    document.getElementById('gistFilenameInput').value = config.filename || 'nav-index.json';
    clearSettingsStatus();
    document.getElementById('settingsModal').classList.add('visible');
});
document.getElementById('settingsClose').addEventListener('click', closeSettingsModal);
document.getElementById('exportConfigBtn').addEventListener('click', exportConfig);
document.getElementById('importConfigBtn').addEventListener('click', importConfig);
document.getElementById('importFileInput').addEventListener('change', handleImportFileChange);
document.getElementById('testGistBtn').addEventListener('click', testGistConnection);
document.getElementById('uploadGistBtn').addEventListener('click', uploadToGist);
document.getElementById('downloadGistBtn').addEventListener('click', downloadFromGist);

// Search
document.getElementById('searchInput').addEventListener('input', (e) => {
    renderCards(e.target.value.trim());
});

document.getElementById('searchInput').addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        e.target.value = '';
        renderCards('');
    }
});

// Sidebar category clicks — scroll to section
document.getElementById('sidebarCategories').addEventListener('click', (e) => {
    const catEl = e.target.closest('.sidebar-category');
    if (!catEl) return;
    const catId = catEl.dataset.id;
    state.activeCategoryId = catId;
    renderCategories();
    document.getElementById(`cat-section-${catId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.getElementById('sidebarCategories').addEventListener('contextmenu', (e) => {
    const catEl = e.target.closest('.sidebar-category');
    if (!catEl) return;
    e.preventDefault();
    e.stopPropagation();
    showCategoryContextMenu(e, catEl.dataset.id);
});

// All categories container — delegated events
const container = document.getElementById('allCategoriesContainer');

container.addEventListener('click', (e) => {
    const cardEl = e.target.closest('.card');
    if (cardEl && e.button === 0) {
        const card = state.cards.find(c => c.id === cardEl.dataset.id);
        if (card) window.open(card.url, '_blank');
    }
});

container.addEventListener('contextmenu', (e) => {
    const cardEl = e.target.closest('.card');
    if (!cardEl) return;
    hideCardTooltip();
    e.preventDefault();
    e.stopPropagation();
    showContextMenu(e, cardEl.dataset.id);
});

container.addEventListener('dragstart', handleCardDragStart);
container.addEventListener('dragover', handleCardDragOver);
container.addEventListener('drop', handleCardDrop);
container.addEventListener('dragend', handleCardDragEnd);

// Global context menu — hide on click or right-click outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.context-menu')) {
        hideContextMenu();
    }
});

document.addEventListener('contextmenu', (e) => {
    if (!e.target.closest('.context-menu') && !e.target.closest('#allCategoriesContainer')) {
        hideContextMenu();
    }
});

document.getElementById('contextMenu').addEventListener('click', (e) => {
    e.stopPropagation();
});

// Modal overlay click to close
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('visible');
        }
    });
});

// Init
loadData();
renderCategories();
renderCards();

const now = new Date();
const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
document.getElementById('dateDisplay').textContent = dateStr;

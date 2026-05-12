import { state } from './state.js';
import { getFaviconUrl, highlightMatch, showCardTooltip, hideCardTooltip } from './utils.js';

export function renderCategories() {
    const container = document.getElementById('sidebarCategories');
    const sorted = [...state.categories].sort((a, b) => a.order - b.order);

    container.innerHTML = sorted.map(cat => {
        const cardCount = state.cards.filter(c => c.categoryId === cat.id).length;
        return `
            <div class="sidebar-category" data-id="${cat.id}">
                <span class="cat-icon">${cat.icon || '📁'}</span>
                <span class="cat-name">${cat.name}</span>
                <span class="cat-count">${cardCount}</span>
            </div>
        `;
    }).join('');
}

export function renderCards(searchQuery = '') {
    const container = document.getElementById('allCategoriesContainer');
    const query = searchQuery?.toLowerCase().trim() || '';

    let sortedCats = [...state.categories].sort((a, b) => a.order - b.order);

    if (query) {
        const matchingCatIds = new Set(
            state.cards
                .filter(c => c.title.toLowerCase().includes(query) ||
                    c.url.toLowerCase().includes(query) ||
                    (c.desc && c.desc.toLowerCase().includes(query)))
                .map(c => c.categoryId)
        );
        sortedCats = sortedCats.filter(c => matchingCatIds.has(c.id));
    }

    if (sortedCats.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="icon">📂</span>
                <p>${query ? '未找到匹配的卡片' : '暂无分类和卡片'}</p>
            </div>
        `;
        return;
    }

    container.innerHTML = sortedCats.map(cat => {
        const cards = state.cards
            .filter(c => c.categoryId === cat.id && (!query ||
                c.title.toLowerCase().includes(query) ||
                c.url.toLowerCase().includes(query) ||
                (c.desc && c.desc.toLowerCase().includes(query))))
            .sort((a, b) => a.order - b.order);

        return `
            <section class="category-section" id="cat-section-${cat.id}" data-category-id="${cat.id}">
                <div class="category-header">
                    <div class="category-title">
                        <span class="icon">${cat.icon || '📁'}</span>
                        <span class="name">${cat.name}</span>
                        <span class="count">${cards.length}</span>
                    </div>
                </div>
                <div class="cards-grid">
                    ${cards.map((card, i) => `
                        <div class="card" data-id="${card.id}" draggable="true" style="animation-delay: ${i * 0.04}s">
                            <div class="card-icon">
                                <img src="${card.icon || getFaviconUrl(card.url)}" alt="${card.title}" onerror="this.style.display='none'">
                            </div>
                            <div class="card-content">
                                <div class="card-title">${highlightMatch(card.title, query)}</div>
                                <div class="card-desc">${highlightMatch(card.desc || card.url, query)}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </section>
        `;
    }).join('');

    // Attach hover tooltip events
    container.querySelectorAll('.card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            const card = state.cards.find(c => c.id === el.dataset.id);
            if (card?.desc && card.desc !== card.url) {
                showCardTooltip(el, card.desc);
            }
        });
        el.addEventListener('mouseleave', hideCardTooltip);
    });
}

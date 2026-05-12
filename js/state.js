export const defaultData = {
    categories: [
        { id: 'cat-1', name: '常用', icon: '🏠', order: 0, createdAt: Date.now() },
        { id: 'cat-2', name: '编程', icon: '💻', order: 1, createdAt: Date.now() },
        { id: 'cat-3', name: 'AI', icon: '🤖', order: 2, createdAt: Date.now() },
    ],
    cards: [
        { id: 'card-1', categoryId: 'cat-1', title: 'GitHub', url: 'https://github.com', emoji: '🐙', size: '1x1', color: 'navy', order: 0, createdAt: Date.now(), desc: '全球最大的代码托管平台' },
        { id: 'card-2', categoryId: 'cat-1', title: 'ChatGPT', url: 'https://chat.openai.com', emoji: '🤖', size: '1x1', color: 'sage', order: 1, createdAt: Date.now(), desc: 'AI 对话助手' },
        { id: 'card-3', categoryId: 'cat-1', title: 'DeepSeek', url: 'https://deepseek.com', emoji: '🧠', size: '1x1', color: 'plum', order: 2, createdAt: Date.now(), desc: '国产大语言模型' },
        { id: 'card-4', categoryId: 'cat-1', title: 'Claude', url: 'https://claude.ai', emoji: '✨', size: '1x1', color: 'amber', order: 3, createdAt: Date.now(), desc: 'Anthropic 开发的 AI 助手' },
        { id: 'card-5', categoryId: 'cat-2', title: 'Stack Overflow', url: 'https://stackoverflow.com', emoji: '📚', size: '1x1', color: 'amber', order: 0, createdAt: Date.now(), desc: '程序员问答社区' },
        { id: 'card-6', categoryId: 'cat-2', title: 'MDN', url: 'https://developer.mozilla.org', emoji: '🦊', size: '1x1', color: 'navy', order: 1, createdAt: Date.now(), desc: 'Web 开发文档' },
        { id: 'card-7', categoryId: 'cat-3', title: 'Midjourney', url: 'https://midjourney.com', emoji: '🎨', size: '1x1', color: 'plum', order: 0, createdAt: Date.now(), desc: 'AI 图像生成工具' },
        { id: 'card-8', categoryId: 'cat-3', title: 'Stable Diffusion', url: 'https://stability.ai', emoji: '🖼️', size: '1x1', color: 'sage', order: 1, createdAt: Date.now(), desc: '开源 AI 图像生成模型' },
    ]
};

export const state = {
    categories: [],
    cards: [],
    activeCategoryId: null,
    editingCard: null,
    editingCategory: null
};

export let currentContextCard = null;
export function setCurrentContextCard(card) {
    currentContextCard = card;
}

export function loadData() {
    const saved = localStorage.getItem('navIndexData');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            state.categories = parsed.categories || [];
            state.cards = parsed.cards || [];
        } catch (e) {
            state.categories = [...defaultData.categories];
            state.cards = [...defaultData.cards];
        }
    } else {
        state.categories = [...defaultData.categories];
        state.cards = [...defaultData.cards];
    }
    if (state.categories.length === 0) {
        state.categories = [...defaultData.categories];
        state.cards = [...defaultData.cards];
    }
    const catIds = state.categories.map(c => c.id);
    const cardCatIds = [...new Set(state.cards.map(c => c.categoryId))];
    const validCatId = catIds.find(id => cardCatIds.includes(id)) || state.categories[0]?.id || null;
    state.activeCategoryId = validCatId;
}

export function saveData() {
    localStorage.setItem('navIndexData', JSON.stringify({
        version: '1.0',
        categories: state.categories,
        cards: state.cards,
        settings: {}
    }));
}

export function generateId() {
    return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

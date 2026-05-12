import { state, saveData } from './state.js';
import { renderCards } from './render.js';

let draggedCardId = null;

function cardFromEvent(e) {
    return e.target.closest('.card');
}

export function handleCardDragStart(e) {
    const el = cardFromEvent(e);
    if (!el) return;
    draggedCardId = el.dataset.id;
    el.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

export function handleCardDragOver(e) {
    const el = cardFromEvent(e);
    if (!el) return;
    e.preventDefault();
    el.classList.add('drag-over');
}

export function handleCardDrop(e) {
    const el = cardFromEvent(e);
    if (!el) return;
    e.preventDefault();
    el.classList.remove('drag-over');
    const targetId = el.dataset.id;
    if (draggedCardId && targetId !== draggedCardId) {
        const draggedIdx = state.cards.findIndex(c => c.id === draggedCardId);
        const targetIdx = state.cards.findIndex(c => c.id === targetId);
        const [removed] = state.cards.splice(draggedIdx, 1);
        state.cards.splice(targetIdx, 0, removed);
        state.cards.forEach((c, i) => c.order = i);
        saveData();
        renderCards();
    }
}

export function handleCardDragEnd(e) {
    const el = cardFromEvent(e);
    if (el) el.classList.remove('dragging');
    draggedCardId = null;
}

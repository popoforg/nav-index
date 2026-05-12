import { state } from './state.js';
import { showToast, showSettingsStatus, clearSettingsStatus, getGistConfig } from './utils.js';
import { renderCategories, renderCards } from './render.js';
import { saveData } from './state.js';

export function openSettingsModal() {
    document.getElementById('settingsModal').classList.add('visible');
}

export function closeSettingsModal() {
    document.getElementById('settingsModal').classList.remove('visible');
}

export function exportConfig() {
    const data = JSON.stringify({
        version: '1.0',
        categories: state.categories,
        cards: state.cards,
        settings: {}
    }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nav-index-config.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('配置已导出');
}

export function importConfig() {
    document.getElementById('importFileInput').click();
}

export function handleImportFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        try {
            const data = JSON.parse(ev.target.result);
            if (data.categories && data.cards) {
                state.categories = data.categories;
                state.cards = data.cards;
                saveData();
                renderCategories();
                renderCards();
                e.target.value = '';
                closeSettingsModal();
                showToast('配置已导入');
            } else {
                showToast('配置格式无效');
            }
        } catch {
            showToast('JSON 解析失败');
        }
    };
    reader.readAsText(file);
}

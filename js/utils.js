export function getFaviconUrl(url) {
    try {
        const hostname = new URL(url.startsWith('http') ? url : 'https://' + url).hostname;
        return hostname ? 'https://www.google.com/s2/favicons?domain=' + hostname + '&sz=64' : '';
    } catch {
        return '';
    }
}

export function highlightMatch(text, query) {
    if (!query || !text) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

export function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 2500);
}

export function showSettingsStatus(message, type = 'info') {
    const el = document.getElementById('settingsStatus');
    el.textContent = message;
    el.className = 'settings-status visible ' + type;
}

export function clearSettingsStatus() {
    const el = document.getElementById('settingsStatus');
    el.className = 'settings-status';
}

export function getGistConfig() {
    return {
        token: document.getElementById('gistTokenInput')?.value?.trim() || localStorage.getItem('gistToken') || '',
        id: document.getElementById('gistIdInput')?.value?.trim() || localStorage.getItem('gistId') || '',
        filename: document.getElementById('gistFilenameInput')?.value?.trim() || 'nav-index.json'
    };
}

export function saveGistConfig(config) {
    localStorage.setItem('gistToken', config.token);
    localStorage.setItem('gistId', config.id);
}

export function showCardTooltip(cardEl, text) {
    const tooltip = document.getElementById('cardTooltip');
    tooltip.textContent = text;
    tooltip.classList.add('visible');

    const rect = cardEl.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const gap = 8;

    let left = rect.left;
    let top = rect.top - tooltipRect.height - gap;

    if (top < 4) {
        top = rect.bottom + gap;
    }
    if (left + tooltipRect.width > window.innerWidth - 4) {
        left = window.innerWidth - tooltipRect.width - 4;
    }
    if (left < 4) {
        left = 4;
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
}

export function hideCardTooltip() {
    const tooltip = document.getElementById('cardTooltip');
    tooltip.classList.remove('visible');
    tooltip.textContent = '';
}

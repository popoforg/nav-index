import { state, saveData } from './state.js';
import { showSettingsStatus, getGistConfig, saveGistConfig } from './utils.js';
import { renderCategories, renderCards } from './render.js';

export async function testGistConnection() {
    const config = getGistConfig();
    if (!config.token) {
        showSettingsStatus('请填写 Gist Token', 'error');
        return;
    }

    showSettingsStatus('测试连接中...', 'info');

    try {
        const response = await fetch('https://api.github.com/gists', {
            headers: {
                'Authorization': `Bearer ${config.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (response.ok) {
            showSettingsStatus('✓ Gist 连接成功', 'success');
        } else if (response.status === 401) {
            showSettingsStatus('✗ Token 无效，请检查', 'error');
        } else {
            showSettingsStatus(`✗ 连接失败 (${response.status})`, 'error');
        }
    } catch (e) {
        showSettingsStatus('✗ 连接失败', 'error');
    }
}

export async function uploadToGist() {
    const config = getGistConfig();
    if (!config.token) {
        showSettingsStatus('请填写 Gist Token', 'error');
        return;
    }

    showSettingsStatus('上传中...', 'info');

    const payload = {
        description: '导航主页配置',
        public: false,
        files: {
            [config.filename]: {
                content: JSON.stringify({
                    version: '1.0',
                    categories: state.categories,
                    cards: state.cards,
                    exportedAt: new Date().toISOString()
                }, null, 2)
            }
        }
    };

    try {
        let url = 'https://api.github.com/gists';
        let method = 'POST';

        if (config.id) {
            url = `https://api.github.com/gists/${config.id}`;
            method = 'PATCH';
            const getResp = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${config.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (getResp.ok) {
                const gist = await getResp.json();
                if (gist.files[config.filename]) {
                    payload.files[config.filename].sha = gist.files[config.filename].sha;
                }
            }
        }

        const response = await fetch(url, {
            method,
            headers: {
                'Authorization': `Bearer ${config.token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const result = await response.json();
            if (!config.id && result.id) {
                config.id = result.id;
                document.getElementById('gistIdInput').value = result.id;
            }
            saveGistConfig(config);
            showSettingsStatus('✓ 上传成功', 'success');
        } else {
            const err = await response.json();
            showSettingsStatus(`✗ 上传失败: ${err.message || response.status}`, 'error');
        }
    } catch (e) {
        showSettingsStatus('✗ 上传失败', 'error');
    }
}

export async function downloadFromGist() {
    const config = getGistConfig();
    if (!config.token) {
        showSettingsStatus('请填写 Gist Token', 'error');
        return;
    }
    if (!config.id) {
        showSettingsStatus('请先填写 Gist ID 或上传配置', 'error');
        return;
    }

    showSettingsStatus('下载中...', 'info');

    try {
        const response = await fetch(`https://api.github.com/gists/${config.id}`, {
            headers: {
                'Authorization': `Bearer ${config.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (response.ok) {
            const gist = await response.json();
            const file = gist.files[config.filename];

            if (file) {
                try {
                    const data = JSON.parse(file.content);
                    if (data.categories && data.cards) {
                        state.categories = data.categories;
                        state.cards = data.cards;
                        saveData();
                        renderCategories();
                        renderCards();
                        showSettingsStatus('✓ 下载成功', 'success');
                    } else {
                        showSettingsStatus('✗ 配置格式无效', 'error');
                    }
                } catch (e) {
                    showSettingsStatus('✗ JSON 解析失败', 'error');
                }
            } else {
                showSettingsStatus('✗ 文件不存在', 'error');
            }
        } else if (response.status === 404) {
            showSettingsStatus('✗ Gist 不存在', 'error');
        } else {
            showSettingsStatus(`✗ 下载失败 (${response.status})`, 'error');
        }
    } catch (e) {
        showSettingsStatus('✗ 下载失败', 'error');
    }
}


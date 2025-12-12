// 페이지 로드 시
window.addEventListener('load', async () => {
    if (!checkAuth()) return;

    const user = getCurrentUser();
    if (user) {
        document.getElementById('userName').textContent = user.username;
    }

    await loadHistory();
});

// 검색 기록 로드
async function loadHistory() {
    showLoading(true);

    try {
        const history = await getSearchHistoryAPI(100); // 최근 100개
        displayHistory(history);
    } catch (error) {
        console.error('Failed to load history:', error);
        alert('검색 기록을 불러오는데 실패했습니다.');
    } finally {
        showLoading(false);
    }
}

// 검색 기록 표시
function displayHistory(history) {
    const container = document.getElementById('historyList');

    if (!history || history.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📜</div>
                <div class="empty-state-text">검색 기록이 없습니다</div>
                <p style="margin-top: 10px; color: #95a5a6;">
                    대시보드에서 캐릭터를 검색하면 여기에 표시됩니다!
                </p>
            </div>
        `;
        return;
    }

    container.innerHTML = history.map(item => {
        const searchDate = new Date(item.searchedAt);
        const dateStr = formatDate(searchDate);

        return `
            <div class="history-card">
                <div class="history-card-header">
                    <div class="history-icon">🔍</div>
                    <div class="history-info">
                        <h3 class="history-name">${item.characterName}</h3>
                        <div class="history-tags">
                            <span class="tag tag-world">${item.worldName}</span>
                            <span class="tag tag-class">${item.characterClass}</span>
                            <span class="tag tag-level">Lv.${item.characterLevel}</span>
                        </div>
                        <div class="history-date">${dateStr}</div>
                    </div>
                </div>
                <div class="history-actions">
                    <button class="action-btn btn-primary" onclick="viewCharacter('${item.characterName}')">
                        📋 다시보기
                    </button>
                    <button class="action-btn btn-delete" onclick="deleteHistoryItem(${item.id})">
                        🗑️ 삭제
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// 날짜 포맷
function formatDate(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;

    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// 캐릭터 상세보기
async function viewCharacter(characterName) {
    showLoading(true);
    try {
        const character = await searchCharacterAPI(characterName);
        localStorage.setItem('viewCharacter', JSON.stringify(character));
        window.location.href = '/character.html';
    } catch (error) {
        alert('캐릭터 정보를 불러오는데 실패했습니다.');
    } finally {
        showLoading(false);
    }
}

// 검색 기록 삭제 (개별)
async function deleteHistoryItem(id) {
    if (!confirm('이 검색 기록을 삭제하시겠습니까?')) return;

    showLoading(true);

    try {
        await deleteSearchHistoryAPI(id);
        await loadHistory();
    } catch (error) {
        alert('삭제 실패: ' + error.message);
    } finally {
        showLoading(false);
    }
}

// 전체 삭제
async function clearAllHistory() {
    if (!confirm('모든 검색 기록을 삭제하시겠습니까?')) return;

    showLoading(true);

    try {
        await clearSearchHistoryAPI();
        await loadHistory();
        alert('모든 검색 기록이 삭제되었습니다.');
    } catch (error) {
        alert('삭제 실패: ' + error.message);
    } finally {
        showLoading(false);
    }
}

// 로딩 표시
function showLoading(show) {
    let overlay = document.getElementById('loadingOverlay');

    if (show) {
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'loadingOverlay';
            overlay.className = 'loading-overlay';
            overlay.innerHTML = '<div class="loading-spinner"></div>';
            document.body.appendChild(overlay);
        }
    } else {
        if (overlay) {
            overlay.remove();
        }
    }
}
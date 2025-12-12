// 즐겨찾기 페이지 JavaScript

let isEditMode = false;

// 페이지 로드 시
window.addEventListener('load', async () => {
    if (!checkAuth()) return;

    const user = getCurrentUser();
    if (user) {
        document.getElementById('userName').textContent = user.username;
    }

    await loadFavorites();
    loadTheme();
    setupThemeToggle();
});

// 즐겨찾기 목록 로드
async function loadFavorites() {
    const grid = document.getElementById('favoritesGrid');
    const emptyState = document.getElementById('emptyState');

    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/favorites', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load favorites');
        }

        const favorites = await response.json();

        if (!favorites || favorites.length === 0) {
            grid.style.display = 'none';
            emptyState.style.display = 'flex';
            return;
        }

        grid.style.display = 'grid';
        emptyState.style.display = 'none';

        grid.innerHTML = favorites.map(fav => `
            <div class="favorite-card ${isEditMode ? 'edit-mode' : ''}" onclick="${isEditMode ? '' : `viewCharacter('${fav.characterName}')`}">
                <button class="favorite-remove" onclick="event.stopPropagation(); removeFavorite('${fav.characterName}')">✕</button>
                <div class="favorite-card-header">
                    <div class="favorite-avatar">
                        ${fav.characterImage ? `<img src="${fav.characterImage}" alt="${fav.characterName}">` : ''}
                    </div>
                    <div class="favorite-info">
                        <div class="favorite-name">${fav.characterName}</div>
                        <div class="favorite-tags">
                            <span class="favorite-tag tag-world">${fav.worldName || '-'}</span>
                            <span class="favorite-tag tag-class">${fav.characterClass || '-'}</span>
                            <span class="favorite-tag tag-level">Lv.${fav.characterLevel || '-'}</span>
                        </div>
                    </div>
                </div>
                <div class="favorite-stats">
                    <div class="stat-item">
                        <span class="stat-label">전투력</span>
                        <span class="stat-value">${formatNumber(fav.combatPower) || '-'}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">유니온</span>
                        <span class="stat-value">${formatNumber(fav.unionLevel) || '-'}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">종합랭킹</span>
                        <span class="stat-value">${formatNumber(fav.overallRanking) || '-'}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">직업랭킹</span>
                        <span class="stat-value">${formatNumber(fav.jobRanking) || '-'}</span>
                    </div>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Failed to load favorites:', error);
        grid.style.display = 'none';
        emptyState.style.display = 'flex';
    }
}

// 캐릭터 보기
function viewCharacter(characterName) {
    window.location.href = `/character?name=${encodeURIComponent(characterName)}`;
}

// 즐겨찾기 제거
async function removeFavorite(characterName) {
    if (!confirm(`${characterName} 캐릭터를 즐겨찾기에서 제거하시겠습니까?`)) {
        return;
    }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/favorites', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ characterName })
        });

        if (!response.ok) {
            throw new Error('Failed to remove favorite');
        }

        // 목록 새로고침
        await loadFavorites();
    } catch (error) {
        console.error('Failed to remove favorite:', error);
        alert('즐겨찾기 제거에 실패했습니다.');
    }
}

// 숫자 포맷팅
function formatNumber(num) {
    if (!num) return '-';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 편집 모드 토글
function toggleEditMode() {
    isEditMode = !isEditMode;
    const editBtn = document.getElementById('editModeBtn');

    if (isEditMode) {
        editBtn.textContent = '완료';
        editBtn.classList.add('active');
    } else {
        editBtn.textContent = '편집';
        editBtn.classList.remove('active');
    }

    // 즐겨찾기 목록 다시 렌더링
    loadFavorites();
}

// 로그아웃
function logout() {
    localStorage.clear();
    window.location.href = '/login';
}

// 테마 로드
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeToggleBtn = document.querySelector('.theme-toggle-btn');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        if (themeToggleBtn) themeToggleBtn.textContent = '☀️';
    } else {
        if (themeToggleBtn) themeToggleBtn.textContent = '🌙';
    }
}

// 테마 토글 설정
function setupThemeToggle() {
    const themeToggleBtn = document.querySelector('.theme-toggle-btn');
    themeToggleBtn?.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLightMode = document.body.classList.contains('light-mode');
        localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
        if (themeToggleBtn) {
            themeToggleBtn.textContent = isLightMode ? '☀️' : '🌙';
        }
    });
}

// 인증 체크
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login';
        return false;
    }
    return true;
}

// 현재 사용자 정보 가져오기
function getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

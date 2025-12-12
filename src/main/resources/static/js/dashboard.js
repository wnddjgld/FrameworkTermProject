// 전역 변수
let noticeData = [];
let updateData = [];
let noticeIndex = 0;
let updateIndex = 0;
const itemsPerPage = 4;

// 페이지 로드 시
window.addEventListener('load', async () => {
    if (!checkAuth()) return;

    // 데이터 로드
    await loadMapleInfo();

    // 테마 로드 및 설정
    loadTheme();
    setupThemeToggle();

    // 외부 클릭 시 검색 기록 닫기
    document.addEventListener('click', handleOutsideClick);
});

// 캐릭터 검색
async function searchCharacter() {
    const searchInput = document.getElementById('searchInput');
    const characterName = searchInput.value.trim();

    if (!characterName) {
        return;
    }

    // 캐릭터 페이지로 직접 이동 (로딩은 character 페이지에서 처리)
    window.location.href = `/character?name=${encodeURIComponent(characterName)}`;
}

// 메이플스토리 공지사항 로드
async function loadMapleInfo() {
    try {
        // API에서 실제 데이터 가져오기 (각각 개별 try-catch)
        const results = await Promise.allSettled([
            getMapleNoticesAPI().catch(() => []),
            getMapleUpdatesAPI().catch(() => []),
            getMapleEventsAPI().catch(() => []),
            getMapleCashshopAPI().catch(() => [])
        ]);

        const notices = results[0].status === 'fulfilled' ? results[0].value : [];
        const updates = results[1].status === 'fulfilled' ? results[1].value : [];
        const events = results[2].status === 'fulfilled' ? results[2].value : [];
        const cashshop = results[3].status === 'fulfilled' ? results[3].value : [];

        // 데이터 저장
        noticeData = notices || [];
        updateData = updates || [];

        // 캐러셀 표시
        displayNoticeCarousel();
        displayUpdateCarousel();

        // 이벤트 및 캐시샵 표시
        displayEventList(events || []);
        displayCashshopList(cashshop || []);

    } catch (error) {
        console.error('Failed to load maple info:', error);
        // 에러가 발생해도 빈 데이터로 표시
        displayNoticeCarousel();
        displayUpdateCarousel();
        displayEventList([]);
        displayCashshopList([]);
    }
}

// 공지사항 캐러셀 표시
function displayNoticeCarousel() {
    const container = document.getElementById('noticeCarousel');
    if (!container) return;

    const startIdx = noticeIndex;
    const endIdx = Math.min(startIdx + itemsPerPage, noticeData.length);
    const items = noticeData.slice(startIdx, endIdx);

    if (items.length === 0) {
        container.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-secondary);">데이터를 불러올 수 없습니다</div>';
        return;
    }

    container.innerHTML = items.map((item, index) => `
        <div class="carousel-item" onclick="window.open('${item.url || '#'}', '_blank')">
            <div class="carousel-item-content">
                ${index === 0 && noticeIndex === 0 ? '<div class="new-badge">N</div>' : ''}
                <span class="carousel-item-title">${item.title}</span>
            </div>
            <span class="carousel-item-date">${item.date}</span>
        </div>
    `).join('');

    // 버튼 상태 업데이트
    updateCarouselButtons('notice');
}

// 업데이트 캐러셀 표시
function displayUpdateCarousel() {
    const container = document.getElementById('updateCarousel');
    if (!container) return;

    const startIdx = updateIndex;
    const endIdx = Math.min(startIdx + itemsPerPage, updateData.length);
    const items = updateData.slice(startIdx, endIdx);

    if (items.length === 0) {
        container.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-secondary);">데이터를 불러올 수 없습니다</div>';
        return;
    }

    container.innerHTML = items.map((item, index) => `
        <div class="carousel-item" onclick="window.open('${item.url || '#'}', '_blank')">
            <div class="carousel-item-content">
                ${index === 0 && updateIndex === 0 ? '<div class="new-badge">N</div>' : ''}
                <span class="carousel-item-title">${item.title}</span>
            </div>
            <span class="carousel-item-date">${item.date}</span>
        </div>
    `).join('');

    // 버튼 상태 업데이트
    updateCarouselButtons('update');
}

// 캐러셀 버튼 상태 업데이트
function updateCarouselButtons(type) {
    const data = type === 'notice' ? noticeData : updateData;
    const currentIndex = type === 'notice' ? noticeIndex : updateIndex;

    const prevBtn = document.getElementById(type === 'notice' ? 'noticePrevBtn' : 'updatePrevBtn');
    const nextBtn = document.getElementById(type === 'notice' ? 'noticeNextBtn' : 'updateNextBtn');

    if (prevBtn) {
        prevBtn.disabled = currentIndex === 0;
    }

    if (nextBtn) {
        nextBtn.disabled = currentIndex + itemsPerPage >= data.length;
    }
}

// 이전/다음 버튼
function prevNotice() {
    if (noticeIndex > 0) {
        noticeIndex -= itemsPerPage;
        displayNoticeCarousel();
    }
}

function nextNotice() {
    if (noticeIndex + itemsPerPage < noticeData.length) {
        noticeIndex += itemsPerPage;
        displayNoticeCarousel();
    }
}

function prevUpdate() {
    if (updateIndex > 0) {
        updateIndex -= itemsPerPage;
        displayUpdateCarousel();
    }
}

function nextUpdate() {
    if (updateIndex + itemsPerPage < updateData.length) {
        updateIndex += itemsPerPage;
        displayUpdateCarousel();
    }
}

// 이벤트 리스트 표시
function displayEventList(items) {
    const container = document.getElementById('eventList');
    if (!container) return;

    if (!items || items.length === 0) {
        container.innerHTML = `
            <div class="event-item-vertical" onclick="window.open('https://maplestory.nexon.com/News/Event', '_blank')" style="cursor: pointer;">
                <div class="event-item-title">메이플스토리 이벤트 보러가기</div>
                <div class="event-item-date">공식 홈페이지로 이동</div>
            </div>
        `;
        return;
    }

    container.innerHTML = items.map(item => `
        <div class="event-item-vertical" onclick="window.open('${item.url || 'https://maplestory.nexon.com/News/Event'}', '_blank')" style="cursor: pointer;">
            <div class="event-item-title">${item.title}</div>
            <div class="event-item-date">${item.date}</div>
        </div>
    `).join('');
}

// 캐시샵 리스트 표시
function displayCashshopList(items) {
    const container = document.getElementById('cashshopList');
    if (!container) return;

    if (!items || items.length === 0) {
        container.innerHTML = `
            <div class="event-item-vertical" onclick="window.open('https://maplestory.nexon.com/News/CashShop', '_blank')" style="cursor: pointer;">
                <div class="event-item-title">캐시샵 공지 보러가기</div>
                <div class="event-item-date">공식 홈페이지로 이동</div>
            </div>
        `;
        return;
    }

    container.innerHTML = items.map(item => `
        <div class="event-item-vertical" onclick="window.open('${item.url || 'https://maplestory.nexon.com/News/CashShop'}', '_blank')" style="cursor: pointer;">
            <div class="event-item-title">${item.title}</div>
            <div class="event-item-date">${item.date}</div>
        </div>
    `).join('');
}

// 검색 기록 표시
async function showSearchHistory() {
    const dropdown = document.getElementById('searchHistoryDropdown');
    const listContainer = document.getElementById('searchHistoryList');

    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/search-history?limit=10', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const history = await response.json();

            if (history.length === 0) {
                listContainer.innerHTML = '<div class="search-history-empty">최근 검색 기록이 없습니다</div>';
            } else {
                listContainer.innerHTML = history.map(item => `
                    <div class="search-history-item" onclick="selectHistory('${item.characterName}')">
                        <span class="history-icon">🔍</span>
                        <span class="history-name">${item.characterName}</span>
                        <button class="history-delete-btn" onclick="event.stopPropagation(); deleteHistory(${item.id})">✕</button>
                    </div>
                `).join('');
            }
            dropdown.style.display = 'block';
        }
    } catch (error) {
        console.error('검색 기록 로드 실패:', error);
    }
}

// 검색 기록 선택
function selectHistory(characterName) {
    document.getElementById('searchInput').value = characterName;
    document.getElementById('searchHistoryDropdown').style.display = 'none';
    searchCharacter();
}

// 개별 검색 기록 삭제
async function deleteHistory(historyId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/search-history/${historyId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            showSearchHistory(); // 목록 새로고침
        }
    } catch (error) {
        console.error('검색 기록 삭제 실패:', error);
    }
}

// 전체 검색 기록 삭제
async function clearAllHistory() {
    if (!confirm('모든 검색 기록을 삭제하시겠습니까?')) return;

    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/search-history/all', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            showSearchHistory(); // 목록 새로고침
        }
    } catch (error) {
        console.error('검색 기록 전체 삭제 실패:', error);
    }
}

// 외부 클릭 시 검색 기록 닫기
function handleOutsideClick(event) {
    const dropdown = document.getElementById('searchHistoryDropdown');
    const searchInput = document.getElementById('searchInput');

    if (!dropdown || !searchInput) return;

    if (!searchInput.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.style.display = 'none';
    }
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

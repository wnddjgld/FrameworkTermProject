// API 기본 설정
const API_BASE_URL = 'http://localhost:8080/api';

// 토큰 가져오기
function getToken() {
    return localStorage.getItem('token') || localStorage.getItem('accessToken');
}

// 인증 헤더
function getAuthHeaders() {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
}

// API 호출 헬퍼
async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        ...options,
        headers: {
            ...getAuthHeaders(),
            ...options.headers
        }
    };

    try {
        const response = await fetch(url, config);

        if (response.status === 401) {
            // 토큰 만료
            localStorage.clear();
            window.location.href = '/index.html';
            return null;
        }

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || '요청 실패');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// 캐릭터 검색
async function searchCharacterAPI(name) {
    return await apiCall(`/characters/search?name=${encodeURIComponent(name)}`);
}

// 즐겨찾기 추가
async function addFavoriteAPI(data) {
    const params = new URLSearchParams(data).toString();
    return await apiCall(`/favorites?${params}`, {
        method: 'POST'
    });
}

// 즐겨찾기 목록 조회
async function getFavoritesAPI() {
    return await apiCall('/favorites');
}

// 즐겨찾기 삭제
async function deleteFavoriteAPI(id) {
    return await apiCall(`/favorites/${id}`, {
        method: 'DELETE'
    });
}

// 즐겨찾기 여부 확인
async function checkFavoriteAPI(characterName) {
    return await apiCall(`/favorites/check?characterName=${encodeURIComponent(characterName)}`);
}

// 검색 기록 조회
async function getSearchHistoryAPI(limit = 20) {
    return await apiCall(`/search-history?limit=${limit}`);
}

// 검색 기록 삭제
async function deleteSearchHistoryAPI(id) {
    return await apiCall(`/search-history/${id}`, {
        method: 'DELETE'
    });
}

// 검색 기록 전체 삭제
async function clearSearchHistoryAPI() {
    return await apiCall('/search-history/all', {
        method: 'DELETE'
    });
}

// 사용자 정보
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// 로그아웃
function logout() {
    localStorage.clear();
    window.location.href = '/index.html';
}

// 인증 확인
function checkAuth() {
    const token = getToken();
    if (!token) {
        window.location.href = '/index.html';
        return false;
    }
    return true;
}

// 메이플 뉴스 API
async function getMapleNoticesAPI() {
    return await apiCall('/maple-news/notices');
}

async function getMapleUpdatesAPI() {
    return await apiCall('/maple-news/updates');
}

async function getMapleEventsAPI() {
    return await apiCall('/maple-news/events');
}

async function getMapleCashshopAPI() {
    return await apiCall('/maple-news/cashshop');
}
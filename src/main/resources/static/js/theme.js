// 테마 관리
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }
    updateThemeIcon();
}

function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const currentTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
}

function updateThemeIcon() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        const isLightMode = document.body.classList.contains('light-mode');
        themeToggle.textContent = isLightMode ? '☀️' : '🌙';
        themeToggle.title = isLightMode ? '다크모드로 전환' : '라이트모드로 전환';
    }
}

// 페이지 로드 시 테마 초기화
document.addEventListener('DOMContentLoaded', initTheme);

// ESC 키로 검색창 포커스
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.focus();
        }
    }
});

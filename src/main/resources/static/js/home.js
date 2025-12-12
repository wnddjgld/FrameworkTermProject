// 츄츄지지 홈페이지 JavaScript

// 캐러셀 관리
class Carousel {
    constructor(selector) {
        this.carousel = document.querySelector(selector);
        if (!this.carousel) return;

        this.track = this.carousel.querySelector('.carousel-track');
        this.prevBtn = this.carousel.querySelector('.carousel-prev');
        this.nextBtn = this.carousel.querySelector('.carousel-next');
        this.indicators = this.carousel.querySelectorAll('.carousel-indicator');

        this.currentIndex = 0;
        this.itemWidth = 278 + 16; // 카드 너비 + gap
        this.visibleItems = 3;

        this.init();
    }

    init() {
        if (!this.track) return;

        this.prevBtn?.addEventListener('click', () => this.prev());
        this.nextBtn?.addEventListener('click', () => this.next());

        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goTo(index));
        });

        // 자동 재생
        this.startAutoPlay();
    }

    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCarousel();
        }
    }

    next() {
        const maxIndex = Math.max(0, this.track.children.length - this.visibleItems);
        if (this.currentIndex < maxIndex) {
            this.currentIndex++;
            this.updateCarousel();
        }
    }

    goTo(index) {
        this.currentIndex = index;
        this.updateCarousel();
    }

    updateCarousel() {
        const offset = -this.currentIndex * this.itemWidth;
        this.track.style.transform = `translateX(${offset}px)`;

        // 인디케이터 업데이트
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            const maxIndex = Math.max(0, this.track.children.length - this.visibleItems);
            if (this.currentIndex >= maxIndex) {
                this.currentIndex = 0;
            } else {
                this.next();
            }
        }, 5000);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }
}

// 검색 기능
function searchCharacter(event) {
    event.preventDefault();
    const searchInput = document.getElementById('characterSearch');
    const characterName = searchInput.value.trim();

    if (!characterName) {
        alert('캐릭터 이름을 입력해주세요.');
        return;
    }

    // 캐릭터 검색 페이지로 이동
    window.location.href = `/character.html?name=${encodeURIComponent(characterName)}`;
}

// 키보드 단축키 (/ 키로 검색)
document.addEventListener('keydown', (event) => {
    if (event.key === '/' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        const searchInput = document.getElementById('characterSearch');
        searchInput?.focus();
    }
});

// 테마 전환
const themeToggleBtn = document.querySelector('.theme-toggle-btn');
themeToggleBtn?.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');

    // 로컬 스토리지에 테마 저장
    const isLightMode = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
});

// 페이지 로드 시 저장된 테마 적용
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }

    // 캐러셀 초기화
    const eventsCarousels = document.querySelectorAll('.events-carousel');
    eventsCarousels.forEach((carousel, index) => {
        new Carousel(`.events-carousel:nth-of-type(${index + 1})`);
    });
});

// 공지사항 클릭 이벤트
document.querySelectorAll('.notice-item').forEach(item => {
    item.addEventListener('click', () => {
        // 실제로는 공지사항 상세 페이지로 이동
        console.log('공지사항 클릭:', item.querySelector('.notice-text').textContent);
    });
});

// 캐릭터 카드 클릭 이벤트
document.querySelectorAll('.character-item').forEach(item => {
    item.addEventListener('click', () => {
        const characterName = item.querySelector('.character-name').textContent;
        window.location.href = `/character.html?name=${encodeURIComponent(characterName)}`;
    });
});

// 반응형 - 화면 크기에 따라 캐러셀 아이템 수 조정
function updateCarouselVisibleItems() {
    const width = window.innerWidth;
    const carousels = document.querySelectorAll('.events-carousel');

    carousels.forEach(carousel => {
        const carouselInstance = carousel._carouselInstance;
        if (carouselInstance) {
            if (width < 768) {
                carouselInstance.visibleItems = 1;
            } else if (width < 1024) {
                carouselInstance.visibleItems = 2;
            } else {
                carouselInstance.visibleItems = 3;
            }
        }
    });
}

window.addEventListener('resize', updateCarouselVisibleItems);
updateCarouselVisibleItems();

// 스크롤 애니메이션
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// 카드 요소들에 애니메이션 적용
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.notice-card, .stats-card, .event-card, .popular-characters');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// 통계 데이터 애니메이션
function animateNumber(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// 페이지 로드 시 통계 숫자 애니메이션
document.addEventListener('DOMContentLoaded', () => {
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(stat => {
        const text = stat.textContent.replace(/,/g, '');
        const number = parseInt(text);
        if (!isNaN(number)) {
            animateNumber(stat, 0, number, 1500);
        }
    });
});

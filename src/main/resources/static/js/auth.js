// API 기본 URL
const API_BASE_URL = 'http://localhost:8080/api';

// 탭 전환
function showLogin() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('signupForm').classList.add('hidden');
    document.querySelectorAll('.tab-btn')[0].classList.add('active');
    document.querySelectorAll('.tab-btn')[1].classList.remove('active');
}

function showSignup() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('signupForm').classList.remove('hidden');
    document.querySelectorAll('.tab-btn')[0].classList.remove('active');
    document.querySelectorAll('.tab-btn')[1].classList.add('active');
}

// 에러 메시지 표시
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.classList.add('show');
    setTimeout(() => {
        errorElement.classList.remove('show');
    }, 5000);
}

// 로그인 폼 제출
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const usernameOrEmail = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading"></span> 로그인 중...';

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usernameOrEmail,
                password
            })
        });

        if (response.ok) {
            const data = await response.json();
            // 토큰 저장 (token 키로 통일)
            localStorage.setItem('token', data.accessToken);
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('user', JSON.stringify(data.user));

            // 대시보드로 이동
            window.location.href = '/dashboard.html';
        } else {
            const error = await response.json();
            showError('loginError', error.message || '로그인에 실패했습니다.');
        }
    } catch (error) {
        showError('loginError', '서버와 통신 중 오류가 발생했습니다.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '로그인';
    }
});

// 회원가입 폼 제출
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const passwordConfirm = document.getElementById('signupPasswordConfirm').value;

    // 비밀번호 확인
    if (password !== passwordConfirm) {
        showError('signupError', '비밀번호가 일치하지 않습니다.');
        return;
    }

    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading"></span> 가입 중...';

    try {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                email,
                password
            })
        });

        if (response.ok) {
            const data = await response.json();
            // 토큰 저장 (token 키로 통일)
            localStorage.setItem('token', data.accessToken);
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('user', JSON.stringify(data.user));

            // 대시보드로 이동
            window.location.href = '/dashboard.html';
        } else {
            const error = await response.json();
            showError('signupError', error.message || '회원가입에 실패했습니다.');
        }
    } catch (error) {
        showError('signupError', '서버와 통신 중 오류가 발생했습니다.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '회원가입';
    }
});

// 페이지 로드 시 토큰 확인
window.addEventListener('load', () => {
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    if (token) {
        // 이미 로그인되어 있으면 대시보드로 이동
        window.location.href = '/dashboard.html';
    }
});
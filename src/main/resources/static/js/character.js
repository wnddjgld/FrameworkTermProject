let currentCharacter = null;

// 페이지 로드 시
window.addEventListener('load', async () => {
    if (!checkAuth()) return;

    const user = getCurrentUser();
    if (user) {
        document.getElementById('userName').textContent = user.username;
    }

    // 로컬 스토리지에서 캐릭터 정보 가져오기
    const characterData = localStorage.getItem('viewCharacter');
    if (!characterData) {
        alert('캐릭터 정보가 없습니다.');
        window.location.href = '/dashboard.html';
        return;
    }

    currentCharacter = JSON.parse(characterData);
    await loadCharacterDetails();
});

// 캐릭터 상세 정보 로드
async function loadCharacterDetails() {
    showLoading(true);

    try {
        // 기본 정보 표시
        displayBasicInfo();

        // 추가 정보는 넥슨 API에서 가져와야 함 (현재는 mock 데이터)
        displayStats();
        displayEquipment();
        displaySkills();
        displayGrowth();

        // 즐겨찾기 상태 확인
        await checkFavoriteStatus();
    } catch (error) {
        console.error('Failed to load character details:', error);
        alert('캐릭터 정보를 불러오는데 실패했습니다.');
    } finally {
        showLoading(false);
    }
}

// 기본 정보 표시
function displayBasicInfo() {
    document.getElementById('characterName').textContent = currentCharacter.characterName;

    document.getElementById('characterTags').innerHTML = `
        <span class="tag tag-world">${currentCharacter.worldName}</span>
        <span class="tag tag-class">${currentCharacter.characterClass}</span>
        <span class="tag tag-level">Lv.${currentCharacter.characterLevel}</span>
    `;

    document.getElementById('characterBasicInfo').innerHTML = `
        <div class="info-item">
            <div class="info-label">캐릭터명</div>
            <div class="info-value">${currentCharacter.characterName}</div>
        </div>
        <div class="info-item">
            <div class="info-label">월드</div>
            <div class="info-value">${currentCharacter.worldName}</div>
        </div>
        <div class="info-item">
            <div class="info-label">직업</div>
            <div class="info-value">${currentCharacter.characterClass}</div>
        </div>
        <div class="info-item">
            <div class="info-label">레벨</div>
            <div class="info-value">Lv.${currentCharacter.characterLevel}</div>
        </div>
    `;
}

// 스탯 표시 (Mock 데이터)
function displayStats() {
    // 실제로는 넥슨 API의 캐릭터 스탯 API를 호출해야 함
    document.getElementById('basicStats').innerHTML = `
        <div class="stat-card">
            <div class="stat-name">STR (힘)</div>
            <div class="stat-value">1,234</div>
        </div>
        <div class="stat-card">
            <div class="stat-name">DEX (민첩)</div>
            <div class="stat-value">2,345</div>
        </div>
        <div class="stat-card">
            <div class="stat-name">INT (지력)</div>
            <div class="stat-value">567</div>
        </div>
        <div class="stat-card">
            <div class="stat-name">LUK (행운)</div>
            <div class="stat-value">890</div>
        </div>
        <div class="stat-card">
            <div class="stat-name">최대 HP</div>
            <div class="stat-value">45,678</div>
        </div>
        <div class="stat-card">
            <div class="stat-name">최대 MP</div>
            <div class="stat-value">23,456</div>
        </div>
    `;

    document.getElementById('combatStats').innerHTML = `
        <div class="stat-card">
            <div class="stat-name">공격력</div>
            <div class="stat-value">1,234,567</div>
        </div>
        <div class="stat-card">
            <div class="stat-name">방어력</div>
            <div class="stat-value">12,345</div>
        </div>
        <div class="stat-card">
            <div class="stat-name">보스 데미지</div>
            <div class="stat-value">300%</div>
        </div>
        <div class="stat-card">
            <div class="stat-name">크리티컬 확률</div>
            <div class="stat-value">100%</div>
        </div>
        <div class="stat-card">
            <div class="stat-name">방어율 무시</div>
            <div class="stat-value">95%</div>
        </div>
        <div class="stat-card">
            <div class="stat-name">최종 데미지</div>
            <div class="stat-value">45%</div>
        </div>
    `;
}

// 장비 표시 (Mock 데이터)
function displayEquipment() {
    const equipmentSlots = [
        { icon: '🎩', name: '모자', type: '앱솔랩스 메이지크라운' },
        { icon: '👕', name: '상의', type: '앱솔랩스 메이지로브' },
        { icon: '👖', name: '하의', type: '앱솔랩스 메이지팬츠' },
        { icon: '🥾', name: '신발', type: '앱솔랩스 메이지슈즈' },
        { icon: '🧤', name: '장갑', type: '앱솔랩스 메이지글러브' },
        { icon: '🛡️', name: '망토', type: '앱솔랩스 메이지케이프' },
        { icon: '⚔️', name: '무기', type: '앱솔랩스 스태프' },
        { icon: '💍', name: '반지', type: '리스트레인트 링' }
    ];

    document.getElementById('equipmentGrid').innerHTML = equipmentSlots.map(eq => `
        <div class="equipment-card">
            <div class="equipment-icon">${eq.icon}</div>
            <div class="equipment-name">${eq.type}</div>
            <div class="equipment-type">${eq.name}</div>
        </div>
    `).join('');
}

// 스킬 표시 (Mock 데이터)
function displaySkills() {
    const skills = [
        { name: '메테오', level: 30, desc: '강력한 운석을 소환하여 적에게 피해를 입힙니다.' },
        { name: '블리자드', level: 30, desc: '눈보라를 일으켜 광범위한 피해를 줍니다.' },
        { name: '체인 라이트닝', level: 30, desc: '번개가 여러 적에게 연쇄로 타격합니다.' },
        { name: '텔레포트', level: 30, desc: '순간적으로 이동합니다.' }
    ];

    document.getElementById('skillsList').innerHTML = skills.map(skill => `
        <div class="skill-card">
            <div class="skill-name">${skill.name}</div>
            <div class="skill-level">레벨 ${skill.level}</div>
            <div class="skill-description">${skill.desc}</div>
        </div>
    `).join('');
}

// 성장 표시
function displayGrowth() {
    // 실제로는 레벨 기록 API를 호출하거나 데이터베이스에서 가져와야 함
    document.getElementById('growthChart').innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 3em; margin-bottom: 20px;">📈</div>
            <h3 style="color: var(--maple-dark); margin-bottom: 10px;">
                현재 레벨: ${currentCharacter.characterLevel}
            </h3>
            <p style="color: #7f8c8d;">
                성장 기록 데이터는 추후 업데이트 예정입니다.
            </p>
        </div>
    `;
}

// 탭 전환
function showTab(tabName) {
    // 모든 탭 비활성화
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // 선택한 탭 활성화
    event.target.classList.add('active');
    document.getElementById(tabName + 'Tab').classList.add('active');
}

// 즐겨찾기 상태 확인
async function checkFavoriteStatus() {
    try {
        const result = await checkFavoriteAPI(currentCharacter.characterName);
        if (result.isFavorite) {
            document.getElementById('favoriteText').textContent = '⭐ 즐겨찾기 제거';
        } else {
            document.getElementById('favoriteText').textContent = '⭐ 즐겨찾기 추가';
        }
    } catch (error) {
        console.error('Failed to check favorite status:', error);
    }
}

// 즐겨찾기 토글
async function toggleFavorite() {
    showLoading(true);

    try {
        const checkResult = await checkFavoriteAPI(currentCharacter.characterName);

        if (checkResult.isFavorite) {
            alert('이미 즐겨찾기에 추가된 캐릭터입니다.');
        } else {
            await addFavoriteAPI({
                characterName: currentCharacter.characterName,
                ocid: currentCharacter.ocid,
                worldName: currentCharacter.worldName,
                characterClass: currentCharacter.characterClass,
                characterLevel: currentCharacter.characterLevel
            });
            alert('즐겨찾기에 추가되었습니다!');
            await checkFavoriteStatus();
        }
    } catch (error) {
        alert(error.message || '즐겨찾기 추가 실패');
    } finally {
        showLoading(false);
    }
}

// 비교 추가
function addToCompare() {
    let compareList = JSON.parse(localStorage.getItem('compareList') || '[]');

    if (compareList.some(char => char.ocid === currentCharacter.ocid)) {
        alert('이미 비교 목록에 추가된 캐릭터입니다.');
        return;
    }

    if (compareList.length >= 4) {
        alert('최대 4개의 캐릭터만 비교할 수 있습니다.');
        return;
    }

    compareList.push(currentCharacter);
    localStorage.setItem('compareList', JSON.stringify(compareList));
    alert('비교 목록에 추가되었습니다!');
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
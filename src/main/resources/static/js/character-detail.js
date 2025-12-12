// 메이플 캐릭터 검색 - 캐릭터 상세 페이지 JavaScript

// 전역 변수
let currentCharacter = null;
let isFavorite = false;
let selectedEquipment = null;
let allSymbols = [];
let currentSymbolType = 'arcane';
let currentEquipmentPreset = 1;
let currentHyperPreset = 1;
let currentAbilityPreset = 1;

// URL에서 캐릭터 이름 추출
function getCharacterNameFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('name');
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', async () => {
    const characterName = getCharacterNameFromURL();

    if (!characterName) {
        alert('캐릭터 이름이 지정되지 않았습니다.');
        window.location.href = '/dashboard.html';
        return;
    }

    // 캐릭터 데이터 로드
    await loadCharacterData(characterName);

    // 이벤트 리스너 설정
    setupTabNavigation();
    setupSymbolTabs();
    setupSkillGradeToggles();
    setupPresetTabs();

    // 사이드바 데이터 로드
    loadPopularCharacters();
    loadFavoriteCharacters();

    // 테마 설정 로드
    loadTheme();
});

// 캐릭터 데이터 로드
async function loadCharacterData(characterName) {
    try {
        showLoading();

        const token = localStorage.getItem('token');

        // 1. 캐릭터 검색으로 OCID 가져오기
        const searchResponse = await fetch(`/api/characters/search?name=${encodeURIComponent(characterName)}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!searchResponse.ok) {
            throw new Error('캐릭터를 찾을 수 없습니다.');
        }

        const basicData = await searchResponse.json();
        const ocid = basicData.ocid;

        console.log('OCID:', ocid);

        // API 호출 딜레이 함수
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
        const headers = { 'Authorization': `Bearer ${token}` };

        // 2. 상세 정보 가져오기
        const detailResponse = await fetch(`/api/characters/${ocid}/detail`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        await delay(200);

        // 3. 장비 정보 가져오기
        const equipmentResponse = await fetch(`/api/characters/${ocid}/equipment`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        await delay(200);

        // 4. 세트 효과 정보 가져오기
        const setEffectResponse = await fetch(`/api/characters/${ocid}/set-effect`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        await delay(200);

        // 5. 심볼 장비 정보 가져오기 (상세)
        const symbolEquipmentResponse = await fetch(`/api/characters/${ocid}/symbol-equipment`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        await delay(200);

        // 6. 어빌리티 정보 가져오기
        const abilityResponse = await fetch(`/api/characters/${ocid}/ability`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        await delay(200);

        // 7. 하이퍼스탯 정보 가져오기
        const hyperStatResponse = await fetch(`/api/characters/${ocid}/hyper-stat`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        await delay(200);

        // 8. 무릉도장 정보 가져오기
        const dojangResponse = await fetch(`/api/characters/${ocid}/dojang`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        // 나머지는 백그라운드에서 로드 (Rate Limit 회피)
        let cashEquipmentData = null;
        let petEquipmentData = null;
        let skillData = null;
        let unionData = null;
        let achievementData = null;

        // 응답 파싱
        const detailData = detailResponse.ok ? await detailResponse.json() : null;
        const equipmentData = equipmentResponse.ok ? await equipmentResponse.json() : null;
        const setEffectData = setEffectResponse.ok ? await setEffectResponse.json() : null;
        const symbolEquipmentData = symbolEquipmentResponse.ok ? await symbolEquipmentResponse.json() : null;
        const abilityData = abilityResponse.ok ? await abilityResponse.json() : null;
        const hyperStatData = hyperStatResponse.ok ? await hyperStatResponse.json() : null;
        const dojangData = dojangResponse.ok ? await dojangResponse.json() : null;

        // 디버깅
        console.log('=== API 응답 디버깅 (초기 로드) ===');
        console.log('detailData:', detailData);
        console.log('equipmentData:', equipmentData);
        console.log('setEffectData:', setEffectData);
        console.log('symbolEquipmentData:', symbolEquipmentData);
        console.log('abilityData:', abilityData);
        console.log('hyperStatData:', hyperStatData);
        console.log('unionData:', unionData);
        console.log('dojangData:', dojangData);

        // 데이터 병합
        currentCharacter = {
            ...basicData,
            ...detailData?.basicInfo,
            ocid: ocid,
            statInfo: detailData?.statInfo?.final_stat || detailData?.finalStat || [],
            equipment: equipmentData,
            cashEquipment: cashEquipmentData,
            petEquipment: petEquipmentData,
            setEffect: setEffectData,
            symbolEquipment: symbolEquipmentData,
            ability: abilityData,
            hyperStat: hyperStatData,
            skills: skillData,
            union: unionData,
            dojang: dojangData,
            achievement: achievementData
        };

        console.log('=== 병합된 캐릭터 데이터 ===');
        console.log(currentCharacter);

        // UI 업데이트
        updateCharacterHeader(currentCharacter);
        updateEquipment(equipmentData);
        updateSetEffects(setEffectData);
        updateSymbols(symbolEquipmentData);
        updateStats(currentCharacter.statInfo, hyperStatData, abilityData);
        updateContents(dojangData, unionData, achievementData);

        // 즐겨찾기 상태 확인
        checkFavoriteStatus(characterName);

        hideLoading();

        // 추가 데이터 백그라운드 로드 (Rate Limit 회피)
        loadAdditionalData(ocid, token);
    } catch (error) {
        console.error('Error loading character data:', error);
        alert('캐릭터 정보를 불러오는 중 오류가 발생했습니다: ' + error.message);
        hideLoading();
    }
}

// 추가 데이터 백그라운드 로드 (Rate Limit 회피)
async function loadAdditionalData(ocid, token) {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    try {
        // 펫 장비 정보
        await delay(1000); // 1초 대기
        const petResponse = await fetch(`/api/characters/${ocid}/pet-equipment`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (petResponse.ok) {
            const petData = await petResponse.json();
            currentCharacter.petEquipment = petData;
            updatePetEquipment(petData);
            console.log('펫 장비 정보 로드 완료:', petData);
        }

        // 캐시 장비 정보 (코디)
        await delay(1000);
        const cashResponse = await fetch(`/api/characters/${ocid}/cash-equipment`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (cashResponse.ok) {
            const cashData = await cashResponse.json();
            currentCharacter.cashEquipment = cashData;
            updateCosmetics(cashData, null);
            console.log('캐시 장비 정보 로드 완료:', cashData);
        }

        // 6차 스킬
        await delay(1000);
        const skillResponse = await fetch(`/api/characters/${ocid}/skill?grade=6`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (skillResponse.ok) {
            const skillData = await skillResponse.json();
            currentCharacter.skills = skillData;
            updateSkills(skillData, null, null);
            console.log('스킬 정보 로드 완료:', skillData);
        }

        // 유니온 정보
        await delay(1000);
        const unionResponse = await fetch(`/api/characters/${ocid}/union`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (unionResponse.ok) {
            const unionData = await unionResponse.json();
            currentCharacter.union = unionData;
            updateContents(currentCharacter.dojang, unionData, currentCharacter.achievement);
            updateCharacterHeader(currentCharacter); // 유니온 레벨 헤더 업데이트
            console.log('유니온 정보 로드 완료:', unionData);
        }

        // 업적 정보
        await delay(1000);
        const achievementResponse = await fetch(`/api/characters/${ocid}/achievement`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (achievementResponse.ok) {
            const achievementData = await achievementResponse.json();
            currentCharacter.achievement = achievementData;
            updateContents(currentCharacter.dojang, currentCharacter.union, achievementData);
            console.log('업적 정보 로드 완료:', achievementData);
        }

        // 인기도 정보
        await delay(1000);
        const popularityResponse = await fetch(`/api/characters/${ocid}/popularity`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (popularityResponse.ok) {
            const popularityData = await popularityResponse.json();
            currentCharacter.popularity = popularityData;
            updateCharacterHeader(currentCharacter); // 인기도 헤더 업데이트
            console.log('인기도 정보 로드 완료:', popularityData);
        }

        console.log('추가 데이터 로드 완료');
    } catch (error) {
        console.error('추가 데이터 로드 중 오류:', error);
    }
}

// 캐릭터 헤더 업데이트
function updateCharacterHeader(data) {
    // 캐릭터 이름
    setText('characterName', data.character_name || data.characterName || '-');

    // 월드/직업 태그
    setText('characterWorldTag', data.world_name || data.worldName || '-');
    setText('characterJobTag', data.character_class || data.characterClass || '-');

    // 길드
    setText('characterGuild', data.character_guild_name || data.guildName || '-');

    // 인기도 (popularity 객체에서만 가져오기)
    const popularity = data.popularity?.popularity ||
                      data.basicInfo?.popularity ||
                      data.character_popularity ||
                      null;
    setText('characterPopularity', popularity ? formatNumber(popularity) : '-');

    // 캐릭터 이미지
    const charImage = data.character_image || data.characterImage;
    if (charImage) {
        setImage('characterImage', charImage);

        // 배경 이미지: 직업별 이미지 사용 (chuchu.gg 스타일)
        const characterClass = data.character_class || data.characterClass || '';
        if (characterClass) {
            // 직업명을 URL 인코딩하여 사용
            const encodedClass = encodeURIComponent(characterClass);
            const bgImageUrl = `https://file.chuchu.gg/v1/character_bg_png/${encodedClass}.png`;

            // 이미지 존재 여부 확인 후 설정
            const bgImage = document.getElementById('characterBgImage');
            if (bgImage) {
                bgImage.onerror = function() {
                    // 직업 이미지가 없으면 캐릭터 이미지 사용
                    bgImage.src = charImage;
                };
                bgImage.src = bgImageUrl;
            }
        } else {
            setImage('characterBgImage', charImage);
        }
    }

    // 레벨
    const level = data.character_level || data.characterLevel;
    setText('characterLevel', level ? `Lv.${level}` : '-');

    // 유니온
    const unionLevel = data.union?.union_level || data.union_level || data.unionLevel;
    setText('characterUnion', unionLevel ? `Lv.${formatNumber(unionLevel)}` : '-');

    // 전투력
    const statInfo = data.statInfo;
    if (statInfo && Array.isArray(statInfo)) {
        const combatPowerStat = statInfo.find(s => s.stat_name === '전투력');
        const combatPower = combatPowerStat ? formatNumber(parseInt(combatPowerStat.stat_value)) : '-';
        setText('combatPower', combatPower);
        setText('currentCombatPower', combatPower);
        setText('statsCombatPower', combatPower);
    }

    // 생성일 (basicInfo에서 가져오기)
    const dateCreate = data.basicInfo?.character_date_create ||
                      data.character_date_create ||
                      data.dateCreate;
    if (dateCreate) {
        const date = new Date(dateCreate);
        setText('createdDate', `생성일 ${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`);
    } else {
        setText('createdDate', '-');
    }

    // 랭킹 정보 (현재는 더미 데이터 - API 연동 필요시 업데이트)
    setText('overallRanking', '-');
    setText('jobRanking', '-');
}

// 장비 정보 업데이트 (커스텀 레이아웃)
function updateEquipment(equipment) {
    const grid = document.getElementById('equipmentCustomGrid');
    if (!grid) return;

    grid.innerHTML = '';

    // 현재 프리셋에 따라 장비 목록 선택
    let items = [];
    if (currentEquipmentPreset === 1) {
        items = equipment?.item_equipment_preset_1 || equipment?.item_equipment || equipment?.itemEquipment || [];
    } else if (currentEquipmentPreset === 2) {
        items = equipment?.item_equipment_preset_2 || equipment?.item_equipment || equipment?.itemEquipment || [];
    } else if (currentEquipmentPreset === 3) {
        items = equipment?.item_equipment_preset_3 || equipment?.item_equipment || equipment?.itemEquipment || [];
    }

    if (items.length === 0) {
        grid.innerHTML = '<div class="empty-state-text">장착된 장비가 없습니다.</div>';
        return;
    }

    // 장비 슬롯 순서 정의 (왼쪽에서 오른쪽으로, 위에서 아래로)
    // 1열 (6행): 반지1, 반지2, 반지3, 반지4, 포켓, 칭호
    // 2열 (4행): 펜던트, 펜던트2, 무기, 벨트 -> 1행 위로 올림
    // 3열 (6행): 모자, 얼굴장식, 눈장식, 상의, 하의, 신발
    // 4열 (3행): 귀고리, 어깨장식, 장갑 -> 1행 위로 올림
    // 5열 (6행): 엠블렘, 뱃지, 훈장, 보조무기, 망토, 기계심장
    // 6열 (1행): 안드로이드

    const columnLayout = [
        ['반지1', '반지2', '반지3', '반지4', '포켓 아이템', '칭호'],
        [null, '펜던트', '펜던트2', '무기', '벨트', null],  // 1행 위로 이동
        ['모자', '얼굴장식', '눈장식', '상의', '하의', '신발'],
        [null, null, '귀고리', '어깨장식', '장갑', null],  // 1행 위로 이동
        ['엠블렘', '뱃지', '훈장', '보조무기', '망토', '기계 심장'],
        [null, null, null, '안드로이드', null, null]
    ];

    // 장비 아이템을 슬롯 이름으로 매핑
    const itemMap = {};
    items.forEach(item => {
        const slot = item.item_equipment_slot || item.itemEquipmentSlot;
        itemMap[slot] = item;
    });

    // 6열 생성 (각 열이 최대 6개 행 가능)
    const maxRows = 6;

    for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = `equipment-row equipment-row-${rowIndex + 1}`;

        columnLayout.forEach((column, colIndex) => {
            const slotName = column[rowIndex];

            if (slotName === null || slotName === undefined) {
                // 빈 칸
                const emptySlot = document.createElement('div');
                emptySlot.className = 'equipment-slot empty';
                rowDiv.appendChild(emptySlot);
            } else {
                // 장비 슬롯
                const item = itemMap[slotName];
                const slot = document.createElement('div');
                slot.className = 'equipment-slot';
                slot.setAttribute('data-slot', slotName);

                if (item) {
                    const grade = item.potential_option_grade || item.potentialOptionGrade;
                    if (grade) {
                        slot.classList.add(getGradeClass(grade));
                    }

                    const starforce = item.item_starforce || item.starforce || 0;
                    const starforceHtml = starforce > 0 ? `<span class="starforce">★${starforce}</span>` : '';
                    const icon = item.item_icon || item.itemIcon;
                    const name = item.item_name || item.itemName || slotName;

                    slot.innerHTML = `
                        ${starforceHtml}
                        ${icon ? `<img src="${icon}" alt="${name}" title="${name}">` : ''}
                    `;

                    slot.addEventListener('click', () => showEquipmentDetail(item));
                } else {
                    // 빈 장비 슬롯
                    slot.classList.add('empty-equipment');
                    slot.innerHTML = `<span class="slot-name">${slotName}</span>`;
                }

                rowDiv.appendChild(slot);
            }
        });

        grid.appendChild(rowDiv);
    }

    // 어빌리티도 업데이트 (장비탭에도 표시)
    updateAbilityInEquipTab(currentCharacter?.ability);
}

// 장비 상세 정보 표시
function showEquipmentDetail(item) {
    const detailCard = document.getElementById('equipmentDetailCard');
    if (!detailCard) return;

    selectedEquipment = item;

    const name = item.item_name || item.itemName || '알 수 없음';
    const icon = item.item_icon || item.itemIcon;
    const starforce = parseInt(item.item_starforce || item.starforce || 0);
    const grade = item.potential_option_grade || item.potentialOptionGrade || '';
    const reqLevel = item.item_base_option?.base_equipment_level || 0;

    // 스타포스 별 표시 (30개 중 채워진 개수)
    const maxStars = 30;
    const filledStars = '★'.repeat(Math.min(starforce, maxStars));
    const emptyStars = '☆'.repeat(Math.max(0, maxStars - starforce));
    const starsDisplay = `${filledStars}${emptyStars}`;

    const totalOption = item.item_total_option || item.itemTotalOption || {};
    const baseOption = item.item_base_option || item.itemBaseOption || {};
    const addOption = item.item_add_option || item.itemAddOption || {};
    const starforceOption = item.item_starforce_option || item.itemStarforceOption || {};
    const etcOption = item.item_etc_option || item.itemEtcOption || {};

    // 작 정보
    const scroll = item.scroll_upgrade || item.scrollUpgrade || 0;
    const scrollUpgradeable = item.scroll_upgradeable_count || item.scrollUpgradeableCount || 0;
    const scrollResilient = item.scroll_resilience_count || item.scrollResilienceCount || 0;
    const goldenHammer = item.golden_hammer_flag || item.goldenHammerFlag || 0;

    const potential1 = item.potential_option_1 || item.potentialOption1 || '';
    const potential2 = item.potential_option_2 || item.potentialOption2 || '';
    const potential3 = item.potential_option_3 || item.potentialOption3 || '';
    const potentialGrade = item.potential_option_grade || item.potentialOptionGrade || '';

    const additional1 = item.additional_potential_option_1 || item.additionalPotentialOption1 || '';
    const additional2 = item.additional_potential_option_2 || item.additionalPotentialOption2 || '';
    const additional3 = item.additional_potential_option_3 || item.additionalPotentialOption3 || '';
    const additionalGrade = item.additional_potential_option_grade || item.additionalPotentialOptionGrade || '';

    // 잠재옵션 등급별 색상 (레전드리=초록, 유니크=노랑, 에픽=보라, 레어=하늘색)
    const getPotentialColor = (grade) => {
        if (!grade) return '';
        const gradeUpper = grade.toUpperCase();
        if (gradeUpper === '레전드리' || gradeUpper === 'LEGENDARY') return 'var(--legendary)'; // 초록
        if (gradeUpper === '유니크' || gradeUpper === 'UNIQUE') return 'var(--unique)'; // 노랑
        if (gradeUpper === '에픽' || gradeUpper === 'EPIC') return 'var(--epic)'; // 보라
        if (gradeUpper === '레어' || gradeUpper === 'RARE') return 'var(--rare)'; // 하늘색
        return '';
    };

    const potentialColor = getPotentialColor(potentialGrade);
    const additionalColor = getPotentialColor(additionalGrade);

    detailCard.innerHTML = `
        <div class="equipment-detail-header">
            ${starforce > 0 ? `<div class="equipment-detail-stars">${starsDisplay}</div>` : ''}
            <div class="equipment-detail-name">${name}${starforce > 0 ? ` (+${starforce})` : ''}</div>
            ${item.item_shape_name ? `<div class="equipment-detail-grade">${item.item_shape_name}</div>` : ''}
            ${reqLevel > 0 ? `<div class="equipment-detail-req">REQ LEV : ${reqLevel}</div>` : ''}
            ${scroll > 0 || scrollUpgradeable > 0 ? `<div class="equipment-detail-req">업그레이드 가능 횟수 : ${scrollUpgradeable} (복구 가능 횟수 : ${scrollResilient})</div>` : ''}
        </div>
        <div class="equipment-detail-icon">
            ${icon ? `<img src="${icon}" alt="${name}">` : ''}
        </div>
        <div class="equipment-detail-stats">
            ${formatEquipmentStatWithColor('STR', totalOption.str, baseOption.str, addOption.str, starforceOption.str, etcOption.str)}
            ${formatEquipmentStatWithColor('DEX', totalOption.dex, baseOption.dex, addOption.dex, starforceOption.dex, etcOption.dex)}
            ${formatEquipmentStatWithColor('INT', totalOption.intelligence || totalOption.int, baseOption.intelligence || baseOption.int, addOption.intelligence || addOption.int, starforceOption.intelligence || starforceOption.int, etcOption.intelligence || etcOption.int)}
            ${formatEquipmentStatWithColor('LUK', totalOption.luk, baseOption.luk, addOption.luk, starforceOption.luk, etcOption.luk)}
            ${formatEquipmentStatWithColor('HP', totalOption.max_hp, baseOption.max_hp, addOption.max_hp, starforceOption.max_hp, etcOption.max_hp)}
            ${formatEquipmentStatWithColor('MP', totalOption.max_mp, baseOption.max_mp, addOption.max_mp, starforceOption.max_mp, etcOption.max_mp)}
            ${formatEquipmentStatWithColor('공격력', totalOption.attack_power, baseOption.attack_power, addOption.attack_power, starforceOption.attack_power, etcOption.attack_power)}
            ${formatEquipmentStatWithColor('마력', totalOption.magic_power, baseOption.magic_power, addOption.magic_power, starforceOption.magic_power, etcOption.magic_power)}
            ${totalOption.boss_damage ? `<div class="stat-line"><span class="stat-label">보스 공격 시 데미지 :</span> <span class="stat-total">+${totalOption.boss_damage}%</span></div>` : ''}
            ${totalOption.ignore_monster_armor ? `<div class="stat-line"><span class="stat-label">방어력 무시 :</span> <span class="stat-total">+${totalOption.ignore_monster_armor}%</span></div>` : ''}
            ${totalOption.damage ? `<div class="stat-line"><span class="stat-label">데미지 :</span> <span class="stat-total">+${totalOption.damage}%</span> <span class="stat-breakdown">(${baseOption.damage || 0}% +${(totalOption.damage - (baseOption.damage || 0))}%)</span></div>` : ''}
        </div>
        ${(potential1 || potential2 || potential3) ? `
            <div class="equipment-potential">
                <div class="equipment-potential-title" style="color: ${potentialColor || 'var(--accent-green)'}">${potentialGrade || '잠재능력'} 잠재옵션</div>
                ${potential1 ? `<div class="equipment-potential-line">${potential1}</div>` : ''}
                ${potential2 ? `<div class="equipment-potential-line">${potential2}</div>` : ''}
                ${potential3 ? `<div class="equipment-potential-line">${potential3}</div>` : ''}
            </div>
        ` : ''}
        ${(additional1 || additional2 || additional3) ? `
            <div class="equipment-potential">
                <div class="equipment-potential-title" style="color: ${additionalColor || 'var(--accent-purple)'}">${additionalGrade || '에디셔널'} 잠재옵션</div>
                ${additional1 ? `<div class="equipment-potential-line">+ ${additional1}</div>` : ''}
                ${additional2 ? `<div class="equipment-potential-line">+ ${additional2}</div>` : ''}
                ${additional3 ? `<div class="equipment-potential-line">+ ${additional3}</div>` : ''}
            </div>
        ` : ''}
    `;
}

// 장비 스탯 포맷 (색상 구분 + 스타포스, 작 분해)
function formatEquipmentStatWithColor(label, total, base, add, star, etc) {
    if (!total && total !== 0) return '';
    const totalNum = parseInt(total) || 0;
    if (totalNum === 0) return '';

    const baseNum = parseInt(base) || 0;
    const addNum = parseInt(add) || 0;
    const starNum = parseInt(star) || 0;
    const etcNum = parseInt(etc) || 0;

    let html = `<div class="stat-line">
        <span class="stat-label">${label} :</span>
        <span class="stat-total">+${totalNum}</span>`;

    // 상세 분해 표시: (기본 +작 +스타포스 +기타)
    const parts = [];
    if (baseNum > 0) parts.push(`${baseNum}`);
    if (addNum > 0) parts.push(`+${addNum}`);
    if (starNum > 0) parts.push(`+${starNum}`);
    if (etcNum > 0) parts.push(`+${etcNum}`);

    if (parts.length > 1) {
        html += ` <span class="stat-breakdown">(${parts.join(' ')})</span>`;
    }

    html += '</div>';
    return html;
}

// 장비 스탯 포맷 (구버전 호환)
function formatEquipmentStat(label, total, base, add) {
    if (!total && total !== 0) return '';
    if (total === 0) return '';

    let html = `<div class="stat-line"><span class="base">${label} : +${total}</span>`;
    if (base && add && add > 0) {
        html += ` <span class="bonus">(${base}+${add})</span>`;
    }
    html += '</div>';
    return html;
}

// 등급 클래스 반환
function getGradeClass(grade) {
    if (!grade) return '';
    const gradeMap = {
        '레전드리': 'legendary',
        '레전더리': 'legendary',
        '유니크': 'unique',
        '에픽': 'epic',
        '레어': 'rare'
    };
    return gradeMap[grade] || '';
}

// 세트 효과 업데이트
function updateSetEffects(data) {
    const list = document.getElementById('setEffectsList');
    if (!list) return;

    // setEffect API 응답이 있는 경우
    const setEffects = data?.set_effect || [];

    if (setEffects.length > 0) {
        list.innerHTML = '';
        setEffects.forEach(set => {
            const item = document.createElement('div');
            item.className = 'set-effect-item';
            item.innerHTML = `
                <span class="set-effect-count">${set.set_count || 0}</span>
                <span class="set-effect-name">${set.set_name || ''}</span>
            `;
            list.appendChild(item);
        });
        return;
    }

    // 세트 효과 API가 없으면 장비에서 추출
    const items = data?.item_equipment || data?.itemEquipment || [];
    if (items.length === 0) {
        list.innerHTML = '<div class="empty-state-text">세트 효과 없음</div>';
        return;
    }

    const setPatterns = [
        { pattern: '칠흑의 보스', name: '칠흑 세트' },
        { pattern: '앱솔랩스', name: '앱솔랩스' },
        { pattern: '에테르넬', name: '에테르넬' },
        { pattern: '아케인셰이드', name: '아케인셰이드' },
        { pattern: '루타비스', name: '루타비스' },
        { pattern: '보스 장신구', name: '보스 장신구' },
        { pattern: '마이스터', name: '마이스터' }
    ];

    const sets = {};
    items.forEach(item => {
        const itemName = item.item_name || item.itemName || '';
        setPatterns.forEach(({ pattern, name }) => {
            if (itemName.includes(pattern)) {
                if (!sets[name]) {
                    sets[name] = { name, count: 0, icon: item.item_icon || item.itemIcon };
                }
                sets[name].count++;
            }
        });
    });

    if (Object.keys(sets).length === 0) {
        list.innerHTML = '<div class="empty-state-text">세트 효과 없음</div>';
        return;
    }

    list.innerHTML = '';
    Object.values(sets).forEach(set => {
        const item = document.createElement('div');
        item.className = 'set-effect-item';
        item.innerHTML = `
            <span class="set-effect-count">${set.count}</span>
            <span class="set-effect-name">${set.name}</span>
        `;
        list.appendChild(item);
    });
}

// 심볼 정보 업데이트
function updateSymbols(symbolData) {
    allSymbols = symbolData?.symbol || [];
    renderSymbols();
}

// 심볼 렌더링
function renderSymbols() {
    const grid = document.getElementById('symbolGrid');
    const totalStatEl = document.getElementById('symbolTotalStat');
    if (!grid) return;

    // 현재 타입에 맞는 심볼 필터
    const filteredSymbols = allSymbols.filter(sym => {
        const name = sym.symbol_name || '';
        if (currentSymbolType === 'arcane') {
            return name.includes('아케인');
        } else {
            return name.includes('어센틱');
        }
    });

    if (filteredSymbols.length === 0) {
        grid.innerHTML = '<div class="empty-state-text">심볼 없음</div>';
        if (totalStatEl) totalStatEl.textContent = '총 스탯 +0';
        return;
    }

    // 총 스탯 계산 (문자열을 정수로 변환)
    let totalSTR = 0, totalDEX = 0, totalINT = 0, totalLUK = 0, totalHP = 0;
    filteredSymbols.forEach(sym => {
        totalSTR += parseInt(sym.symbol_str) || 0;
        totalDEX += parseInt(sym.symbol_dex) || 0;
        totalINT += parseInt(sym.symbol_int) || 0;
        totalLUK += parseInt(sym.symbol_luk) || 0;
        totalHP += parseInt(sym.symbol_hp) || 0;
    });

    const mainStat = Math.max(totalSTR, totalDEX, totalINT, totalLUK);
    let mainStatName = 'STR';
    if (totalDEX === mainStat) mainStatName = 'DEX';
    else if (totalINT === mainStat) mainStatName = 'INT';
    else if (totalLUK === mainStat) mainStatName = 'LUK';

    if (totalStatEl) {
        totalStatEl.textContent = `총 ${mainStatName} +${formatNumber(mainStat)}`;
    }

    // 심볼 그리드 렌더링
    grid.innerHTML = '';
    filteredSymbols.forEach(sym => {
        const item = document.createElement('div');
        item.className = 'symbol-item';
        const icon = sym.symbol_icon || '';
        const level = sym.symbol_level || 0;

        item.innerHTML = `
            ${icon ? `<img class="symbol-icon" src="${icon}" alt="${sym.symbol_name}">` : ''}
            <span class="symbol-level">Lv.${level}</span>
        `;
        grid.appendChild(item);
    });
}

// 스탯 정보 업데이트
function updateStats(statInfo, hyperStatData, abilityData) {
    // 기본 스탯
    const basicList = document.getElementById('basicStatsList');
    if (basicList && statInfo && Array.isArray(statInfo)) {
        const basicStats = ['STR', 'DEX', 'INT', 'LUK', 'HP', 'MP'];
        basicList.innerHTML = '';
        basicStats.forEach(name => {
            const stat = statInfo.find(s => s.stat_name === name || s.stat_name === `최대 ${name}`);
            if (stat) {
                const row = document.createElement('div');
                row.className = 'stat-row';
                row.innerHTML = `
                    <span class="stat-name">${stat.stat_name}</span>
                    <span class="stat-value-large">${formatNumber(parseInt(stat.stat_value))}</span>
                `;
                basicList.appendChild(row);
            }
        });
    }

    // 상세 스탯
    const detailList = document.getElementById('detailStatsList');
    if (detailList && statInfo && Array.isArray(statInfo)) {
        const detailStats = [
            '최대 스탯 공격력', '데미지', '최종 데미지', '보스 몬스터 데미지',
            '방어율 무시', '일반 몬스터 데미지', '크리티컬 확률', '크리티컬 데미지',
            '공격력', '마력', '재사용 대기시간 감소', '버프 지속시간',
            '스타포스', '아케인포스', '어센틱포스'
        ];
        detailList.innerHTML = '';
        detailStats.forEach(name => {
            const stat = statInfo.find(s => s.stat_name === name);
            if (stat) {
                let value = stat.stat_value;
                if (name.includes('데미지') || name.includes('무시') || name.includes('확률')) {
                    value = value + '%';
                } else {
                    value = formatNumber(parseInt(value));
                }
                const row = document.createElement('div');
                row.className = 'stat-row';
                row.innerHTML = `
                    <span class="stat-name">${stat.stat_name}</span>
                    <span class="stat-value-large">${value}</span>
                `;
                detailList.appendChild(row);
            }
        });
    }

    // 하이퍼스탯
    updateHyperStats(hyperStatData);

    // 어빌리티
    updateAbilities(abilityData);
}

// 하이퍼스탯 업데이트
function updateHyperStats(hyperStatData) {
    const list = document.getElementById('hyperStatsList');
    if (!list) return;

    const presetKey = `hyper_stat_preset_${currentHyperPreset}`;
    const stats = hyperStatData?.[presetKey] || hyperStatData?.hyper_stat_preset_1 || [];

    if (stats.length === 0) {
        list.innerHTML = '<div class="empty-state-text">하이퍼스탯 정보 없음</div>';
        return;
    }

    list.innerHTML = '';
    // 모든 스탯 표시 (레벨 0인 것도 포함)
    stats.forEach(stat => {
        const row = document.createElement('div');
        row.className = 'hyper-stat-row';
        const level = stat.stat_level > 0 ? `Lv.${stat.stat_level}` : '-';
        row.innerHTML = `
            <span class="hyper-stat-name">${stat.stat_type || ''}</span>
            <span class="hyper-stat-value">${level}</span>
        `;
        list.appendChild(row);
    });
}

// 장비탭에서 어빌리티 업데이트
function updateAbilityInEquipTab(abilityData) {
    const list = document.getElementById('abilitiesListEquip');
    const fameEl = document.getElementById('abilityFameEquip');
    if (!list) return;

    const presetKey = `ability_preset_${currentAbilityPreset}`;
    const presetData = abilityData?.[presetKey] || abilityData;
    const abilities = presetData?.ability_info || abilityData?.ability_info || [];

    if (fameEl) {
        const fame = abilityData?.remain_fame || 0;
        fameEl.textContent = `보유 명성치 : ${formatNumber(fame)}`;
    }

    if (abilities.length === 0) {
        list.innerHTML = '<div class="empty-state-text">어빌리티 없음</div>';
        return;
    }

    list.innerHTML = '';
    abilities.forEach(ability => {
        const grade = ability.ability_grade || '';
        const value = ability.ability_value || '';
        const gradeClass = getAbilityGradeClass(grade);
        const item = document.createElement('div');
        item.className = `ability-item ${gradeClass}`;
        item.textContent = value;
        list.appendChild(item);
    });
}

// 어빌리티 업데이트
function updateAbilities(abilityData) {
    const list = document.getElementById('abilitiesList');
    const fameEl = document.getElementById('abilityFame');
    if (!list) return;

    const presetKey = `ability_preset_${currentAbilityPreset}`;
    const presetData = abilityData?.[presetKey] || abilityData;
    const abilities = presetData?.ability_info || abilityData?.ability_info || [];

    if (fameEl) {
        const fame = abilityData?.remain_fame || 0;
        fameEl.textContent = `보유 명성치 : ${formatNumber(fame)}`;
    }

    if (abilities.length === 0) {
        list.innerHTML = '<div class="empty-state-text">어빌리티 없음</div>';
        return;
    }

    list.innerHTML = '';
    abilities.forEach(ab => {
        const item = document.createElement('div');
        const grade = ab.ability_grade || '';
        const gradeClass = getAbilityGradeClass(grade);

        item.className = `ability-item ${gradeClass}`;
        item.textContent = ab.ability_value || '';
        list.appendChild(item);
    });

    // 장비탭의 어빌리티도 함께 업데이트
    updateAbilityInEquipTab(abilityData);
}

// 어빌리티 등급 클래스
function getAbilityGradeClass(grade) {
    const map = {
        '레전드리': 'legendary',
        '유니크': 'unique',
        '에픽': 'epic',
        '레어': 'rare'
    };
    return map[grade] || 'rare';
}

// 컨텐츠 탭 업데이트
function updateContents(dojoData, unionData, achievementData) {
    // 무릉도장
    if (dojoData) {
        const floor = dojoData.dojang_best_floor || dojoData.dojo_best_floor || 0;
        const time = dojoData.dojang_best_time || dojoData.dojo_best_time || 0;
        setText('dojoFloor', `${floor}층`);
        // 시간을 분:초 형식으로 변환
        if (time > 0) {
            const minutes = Math.floor(time / 60);
            const seconds = time % 60;
            setText('dojoTime', `${minutes}분 ${seconds}초`);
        } else {
            setText('dojoTime', '-');
        }
    }

    // 유니온
    if (unionData) {
        setText('unionGrade', unionData.union_grade || '-');
        setText('unionLevel', formatNumber(unionData.union_level || 0));
        // 아티팩트 레벨 (유니온 데이터에 포함)
        const artifactLevel = unionData.union_artifact_level || unionData.artifact_level;
        if (artifactLevel) {
            setText('artifactLevel', formatNumber(artifactLevel));
        }
    }

    // 업적
    if (achievementData) {
        const grade = achievementData.achievement_grade;
        const points = achievementData.achievement_point;
        setText('achievementGrade', grade || '-');
        setText('achievementPoints', points !== null && points !== undefined ? formatNumber(points) : '0');
    }
}

// 스킬 탭 업데이트
function updateSkills(skillData, linkSkillData, hexaStatData) {
    // 6차 스킬
    const skills = skillData?.character_skill || [];
    const skill6List = document.getElementById('skill6List');
    if (skill6List) {
        renderSkillList(skill6List, skills);
    }

    // 링크 스킬
    const linkSkills = linkSkillData?.character_link_skill || [];
    const linkGrid = document.getElementById('linkSkillGrid');
    if (linkGrid) {
        if (linkSkills.length === 0) {
            linkGrid.innerHTML = '<div class="empty-state-text">링크 스킬 없음</div>';
        } else {
            linkGrid.innerHTML = '';
            linkSkills.forEach(skill => {
                const item = document.createElement('div');
                item.className = 'link-skill-item';
                item.innerHTML = `
                    <div class="link-skill-icon">
                        ${skill.skill_icon ? `<img src="${skill.skill_icon}" alt="${skill.skill_name}">` : ''}
                    </div>
                    <span class="link-skill-level">Lv.${skill.skill_level || 0}</span>
                `;
                linkGrid.appendChild(item);
            });
        }
    }

    // 헥사 스탯
    const hexaStats = hexaStatData?.character_hexa_stat_core || [];
    const hexaGrid = document.getElementById('hexaStatGrid');
    if (hexaGrid) {
        if (hexaStats.length === 0) {
            hexaGrid.innerHTML = '<div class="empty-state-text">헥사 스탯 없음</div>';
        } else {
            hexaGrid.innerHTML = '';
            hexaStats.forEach(stat => {
                const slot = document.createElement('div');
                slot.className = 'hexa-stat-slot';
                slot.innerHTML = `
                    <span class="hexa-stat-level">Lv.${stat.slot_level || 0}</span>
                    <span class="hexa-stat-name">${stat.main_stat_name || '-'}</span>
                    <span class="hexa-stat-value">${stat.sub_stat_name_1 || ''}</span>
                `;
                hexaGrid.appendChild(slot);
            });
        }
    }
}

// 스킬 목록 렌더링
function renderSkillList(container, skills) {
    if (skills.length === 0) {
        container.innerHTML = '<div class="empty-state-text">스킬 없음</div>';
        return;
    }

    container.innerHTML = '';
    skills.forEach(skill => {
        const item = document.createElement('div');
        item.className = 'skill-item';
        item.innerHTML = `
            <div class="skill-icon">
                ${skill.skill_icon ? `<img src="${skill.skill_icon}" alt="${skill.skill_name}">` : ''}
            </div>
            <div class="skill-info">
                <div class="skill-name">${skill.skill_name || ''}</div>
                <div class="skill-level">Lv.${skill.skill_level || 0}</div>
            </div>
        `;
        container.appendChild(item);
    });
}

// 코디 탭 업데이트
function updateCosmetics(cashEquipData, androidData) {
    console.log('updateCosmetics called with:', cashEquipData, androidData);

    // 기본 코디
    const basicGrid = document.getElementById('basicCashGrid');
    const cashItems = cashEquipData?.cash_item_equipment_base || [];
    if (basicGrid) {
        renderCashItems(basicGrid, cashItems);
    }

    // 프리셋 코디
    const presetGrid = document.getElementById('presetCashGrid');
    const presetItems = cashEquipData?.cash_item_equipment_preset_1 || [];
    if (presetGrid) {
        renderCashItems(presetGrid, presetItems);
    }

    // 안드로이드 코디
    const androidGrid = document.getElementById('androidCashGrid');
    const androidItems = androidData?.android_cash_item_equipment || [];
    if (androidGrid) {
        renderCashItems(androidGrid, androidItems);
    }
}

// 캐시 아이템 렌더링
function renderCashItems(container, items) {
    if (!items || items.length === 0) {
        container.innerHTML = '<div class="empty-state-text">장착된 코디가 없습니다</div>';
        return;
    }

    container.innerHTML = '';
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cash-item';
        div.innerHTML = `
            <div class="cash-item-header">
                <div class="cash-item-icon">
                    ${item.cash_item_icon ? `<img src="${item.cash_item_icon}" alt="${item.cash_item_name}">` : ''}
                </div>
                <span class="cash-item-slot">${item.cash_item_equipment_slot || ''}</span>
            </div>
            <div class="cash-item-name">${item.cash_item_name || '-'}</div>
            ${item.cash_item_date_expire ? `<div class="cash-item-expiry">${item.cash_item_date_expire}</div>` : ''}
        `;
        container.appendChild(div);
    });
}

// 펫 장비 업데이트
function updatePetEquipment(petData) {
    const grid = document.getElementById('petGrid');
    if (!grid) return;

    if (!petData) {
        grid.innerHTML = '<div class="empty-state-text">펫 장비 정보를 불러올 수 없습니다.</div>';
        return;
    }

    grid.innerHTML = '';

    // 펫 3마리 정보 표시
    for (let i = 1; i <= 3; i++) {
        const petName = petData[`pet_${i}_name`];
        const petNickname = petData[`pet_${i}_nickname`];
        const petIcon = petData[`pet_${i}_icon`];
        const petEquipment = petData[`pet_${i}_equipment`];

        if (petName) {
            const petCard = document.createElement('div');
            petCard.className = 'pet-card';
            petCard.innerHTML = `
                <div class="pet-header">
                    ${petIcon ? `<img src="${petIcon}" alt="${petName}" class="pet-icon">` : ''}
                    <div class="pet-name">${petName}</div>
                </div>
                ${petEquipment && petEquipment.item_name ? `
                    <div class="pet-equipment-item">
                        ${petEquipment.item_icon ? `<img src="${petEquipment.item_icon}" alt="${petEquipment.item_name}">` : ''}
                        <span>${petEquipment.item_name}</span>
                    </div>
                ` : ''}
            `;
            grid.appendChild(petCard);
        }
    }

    if (grid.children.length === 0) {
        grid.innerHTML = '<div class="empty-state-text">장착된 펫이 없습니다.</div>';
    }
}

// 탭 네비게이션 설정
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-button');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
}

// 탭 전환
function switchTab(tabName) {
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    const selectedButton = document.querySelector(`[data-tab="${tabName}"]`);
    const selectedContent = document.getElementById(`${tabName}Tab`);

    if (selectedButton && selectedContent) {
        selectedButton.classList.add('active');
        selectedContent.classList.add('active');
    }
}

// 심볼 탭 설정
function setupSymbolTabs() {
    const symbolTabs = document.querySelectorAll('.symbol-tab');
    symbolTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            symbolTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentSymbolType = tab.getAttribute('data-symbol');
            renderSymbols();
        });
    });
}

// 스킬 등급 토글 설정
function setupSkillGradeToggles() {
    const headers = document.querySelectorAll('.skill-grade-header');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const toggleBtn = header.querySelector('.toggle-btn');
            if (content) {
                content.classList.toggle('collapsed');
                if (toggleBtn) {
                    toggleBtn.textContent = content.classList.contains('collapsed') ? '▼' : '▲';
                }
            }
        });
    });
}

// 프리셋 탭 설정
function setupPresetTabs() {
    // 하이퍼스탯 프리셋
    document.querySelectorAll('[data-hyper-preset]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-hyper-preset]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentHyperPreset = parseInt(btn.getAttribute('data-hyper-preset'));
            updateHyperStats(currentCharacter?.hyperStat);
        });
    });

    // 어빌리티 프리셋
    document.querySelectorAll('[data-ability-preset]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-ability-preset]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentAbilityPreset = parseInt(btn.getAttribute('data-ability-preset'));
            updateAbilities(currentCharacter?.ability);
        });
    });

    // 장비 프리셋
    document.querySelectorAll('[data-preset]').forEach(btn => {
        btn.addEventListener('click', () => {
            const presetValue = btn.getAttribute('data-preset');
            if (!presetValue) return; // data-preset이 없으면 무시

            document.querySelectorAll('[data-preset]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentEquipmentPreset = parseInt(presetValue);

            console.log(`프리셋 ${currentEquipmentPreset} 선택됨`);

            // 장비 프리셋 변경 시 현재 데이터에서 해당 프리셋 표시
            if (currentCharacter && currentCharacter.equipment) {
                updateEquipment(currentCharacter.equipment);
                console.log(`프리셋 ${currentEquipmentPreset} 장비 표시 완료`);
            }
        });
    });
}

// 즐겨찾기 토글
async function toggleFavorite() {
    if (!currentCharacter) return;

    try {
        const response = await fetch('/api/favorites', {
            method: isFavorite ? 'DELETE' : 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                characterName: currentCharacter.character_name || currentCharacter.characterName
            })
        });

        if (response.ok) {
            isFavorite = !isFavorite;
            updateFavoriteButton();
            loadFavoriteCharacters();
        }
    } catch (error) {
        console.error('Error toggling favorite:', error);
    }
}

// 즐겨찾기 상태 확인
async function checkFavoriteStatus(characterName) {
    try {
        const response = await fetch(`/api/favorites/check?characterName=${encodeURIComponent(characterName)}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            isFavorite = data.isFavorite;
            updateFavoriteButton();
        }
    } catch (error) {
        console.error('Error checking favorite status:', error);
    }
}

// 즐겨찾기 버튼 업데이트
function updateFavoriteButton() {
    const button = document.getElementById('favoriteButton');
    if (!button) return;

    if (isFavorite) {
        button.textContent = '★';
        button.classList.add('active');
    } else {
        button.textContent = '☆';
        button.classList.remove('active');
    }
}

// 즐겨찾기 캐릭터 로드
async function loadFavoriteCharacters() {
    const container = document.getElementById('favoriteCharacters');
    if (!container) return;

    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/favorites', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const favorites = await response.json();
            displaySidebarCharacters(container, favorites, 'favorite');
        }
    } catch (error) {
        console.error('Error loading favorite characters:', error);
    }
}

// 인기 캐릭터 로드
async function loadPopularCharacters() {
    const container = document.getElementById('popularCharacters');
    if (!container) return;

    try {
        const response = await fetch('/api/statistics/popular-characters?limit=10');

        if (response.ok) {
            const characters = await response.json();
            displaySidebarCharacters(container, characters, 'popular');
        }
    } catch (error) {
        console.error('Error loading popular characters:', error);
    }
}

// 사이드바 캐릭터 목록 표시
function displaySidebarCharacters(container, characters, type) {
    if (!characters || characters.length === 0) {
        container.innerHTML = '<div class="empty-state-text">등록된 캐릭터가 없습니다.</div>';
        return;
    }

    container.innerHTML = '';
    characters.slice(0, 10).forEach((char, index) => {
        const item = document.createElement('div');
        item.className = 'sidebar-character-item';
        item.onclick = () => {
            window.location.href = `/character.html?name=${encodeURIComponent(char.characterName)}`;
        };

        if (type === 'popular') {
            item.innerHTML = `
                <span class="popular-rank">${char.ranking || index + 1}</span>
                <div class="sidebar-character-info">
                    <div class="sidebar-character-name">${char.characterName}</div>
                    <div class="sidebar-character-detail">Lv.${char.characterLevel || ''} ${char.characterClass || ''}</div>
                </div>
            `;
        } else {
            item.innerHTML = `
                <div class="sidebar-character-info">
                    <div class="sidebar-character-name">${char.characterName}</div>
                    <div class="sidebar-character-detail">${char.worldName || ''} ${char.characterClass || ''}</div>
                </div>
            `;
        }
        container.appendChild(item);
    });
}

// 로그아웃
function logout() {
    localStorage.clear();
    window.location.href = '/index.html';
}

// 즐겨찾기 페이지로 이동
function goToFavorites() {
    window.location.href = '/favorites';
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

// 테마 토글
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const isLightMode = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
    const themeToggleBtn = document.querySelector('.theme-toggle-btn');
    if (themeToggleBtn) {
        themeToggleBtn.textContent = isLightMode ? '☀️' : '🌙';
    }
}

const themeToggleBtn = document.querySelector('.theme-toggle-btn');
themeToggleBtn?.addEventListener('click', toggleTheme);

// 로딩 표시
function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.remove('hidden');
    }
}

// 로딩 숨김
function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
}

// 유틸리티: 텍스트 설정
function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

// 유틸리티: 이미지 설정
function setImage(id, src) {
    const el = document.getElementById(id);
    if (el) el.src = src;
}

// 유틸리티: 숫자 포맷
function formatNumber(num) {
    if (num === undefined || num === null || isNaN(num)) return '-';
    return num.toLocaleString('ko-KR');
}

// 키보드 단축키
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        window.location.href = '/dashboard.html';
    }

    if (event.key >= '1' && event.key <= '6') {
        const tabs = ['equipment', 'stats', 'contents', 'skills', 'cosmetics', 'history'];
        const tabIndex = parseInt(event.key) - 1;
        if (tabs[tabIndex]) {
            switchTab(tabs[tabIndex]);
        }
    }
});

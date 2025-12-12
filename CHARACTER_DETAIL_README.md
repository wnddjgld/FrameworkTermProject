# 캐릭터 상세 페이지 구현 완료

피그마 디자인을 기반으로 메이플스토리 캐릭터 상세 정보 페이지를 구현했습니다.

## 구현된 기능

### 1. 캐릭터 헤더
- 캐릭터 이미지 (240x240px)
- 캐릭터 기본 정보 (이름, 월드, 직업, 레벨, 유니온)
- 주요 스탯 요약 (전투력, 스탯 공격력, 아케인포스, 어센틱포스)

### 2. 탭 네비게이션
- **장비** - 착용 장비, 세트 효과, 심볼, 어빌리티, 펫 장비
- **스탯** - 기본 스탯 / 전투 스탯
- **컨텐츠** - 컨텐츠 진행도
- **스킬** - 보유 스킬 목록
- **코디** - 코디 장비
- **히스토리** - 성장 히스토리
- **본캐/부캐** - 같은 계정의 다른 캐릭터

### 3. 장비 탭 상세 기능
- **착용 장비 그리드**
  - 장비 슬롯별 표시
  - 등급별 색상 (레전더리/유니크/에픽/레어)
  - 장비 아이콘 및 이름
  - 스탯 정보 표시
  - 호버 효과 및 애니메이션

- **세트 효과**
  - 활성화된 세트 자동 집계
  - 세트별 효과 표시

- **심볼 & 아케인포스**
  - 심볼별 레벨 및 경험치
  - 진행도 바
  - 스탯 정보

- **어빌리티**
  - 등급별 색상 구분
  - 어빌리티 효과 텍스트

- **펫 장비**
  - 펫 그리드 레이아웃
  - 펫 아이콘 및 이름
  - 펫 레벨

### 4. 사이드바
- **즐겨찾기 버튼**
  - 클릭으로 즐겨찾기 추가/제거
  - 상태에 따른 버튼 스타일 변경

- **인기 캐릭터**
  - 실시간 인기 캐릭터 Top 10
  - 순위 표시
  - 클릭 시 해당 캐릭터 페이지로 이동

### 5. 반응형 디자인
- 데스크톱 (1920px+)
- 태블릿 (768px ~ 1600px)
- 모바일 (~ 768px)

## 파일 구조

```
src/main/resources/static/
├── character.html              # 캐릭터 상세 페이지 (피그마 디자인 기반)
├── css/
│   └── character-detail.css   # 캐릭터 상세 페이지 스타일
└── js/
    └── character-detail.js    # 캐릭터 상세 페이지 로직
```

## 사용 방법

1. **Spring Boot 서버 실행**
   ```bash
   ./gradlew bootRun
   ```

2. **브라우저에서 접속**
   ```
   http://localhost:8080/character.html?name=캐릭터이름
   ```

## 주요 기능 설명

### URL 파라미터
- `name` - 검색할 캐릭터 이름 (필수)
- 예시: `/character.html?name=홍길동`

### 탭 전환
- 클릭으로 탭 전환
- 키보드 단축키 (1~7번 키)로 빠른 탭 전환
- ESC 키로 홈으로 돌아가기

### 데이터 로딩
페이지 로드 시 다음 API를 호출합니다:
- `GET /api/characters/{characterName}` - 캐릭터 전체 정보
- `GET /api/favorites/check?name={characterName}` - 즐겨찾기 상태
- `GET /api/characters/popular` - 인기 캐릭터 목록

### 즐겨찾기 기능
- 로그인한 사용자만 사용 가능
- `POST /api/favorites` - 즐겨찾기 추가
- `DELETE /api/favorites` - 즐겨찾기 제거

## 백엔드 API 연동

### 필요한 API 응답 형식

#### 캐릭터 정보 API
```json
{
  "characterName": "캐릭터이름",
  "characterImage": "이미지URL",
  "world": "월드명",
  "characterClass": "직업명",
  "characterLevel": 250,
  "unionLevel": 8000,
  "combatPower": 1500000000,
  "statAttack": 500000,
  "arcaneForce": 1000,
  "authenticForce": 500,
  "equipment": [
    {
      "slot": "무기",
      "name": "장비명",
      "rarity": "레전더리",
      "icon": "아이콘URL",
      "stats": [
        {"name": "STR", "value": 50},
        {"name": "공격력", "value": 300}
      ],
      "setName": "세트명",
      "setEffects": ["효과1", "효과2"]
    }
  ],
  "stats": {
    "basic": {
      "STR": 10000,
      "DEX": 5000,
      "INT": 5000,
      "LUK": 5000,
      "HP": 50000,
      "MP": 30000
    },
    "combat": {
      "공격력": 500000,
      "마력": 300000,
      "방어율": 50,
      "크리티컬 확률": 100,
      "보스 데미지": 300,
      "방어율 무시": 95
    }
  },
  "symbols": [
    {
      "name": "심볼명",
      "level": 20,
      "currentExp": 5000,
      "maxExp": 10000,
      "stats": ["STR +100", "HP +500"]
    }
  ],
  "abilities": [
    {
      "grade": "legendary",
      "text": "보스 몬스터 공격 시 데미지 +20%"
    }
  ],
  "petEquipment": [
    {
      "name": "펫명",
      "icon": "아이콘URL",
      "level": 30
    }
  ]
}
```

## CSS 변수

`character-detail.css`에서 정의된 주요 색상:

```css
--bg-primary: #15171B        /* 메인 배경 */
--bg-secondary: #1C1F26      /* 카드 배경 */
--bg-tertiary: #252932       /* 서브 카드 배경 */
--bg-header: #121212         /* 헤더 배경 */
--text-primary: #FFFFFF      /* 주요 텍스트 */
--text-secondary: #B0B0B0    /* 보조 텍스트 */
--text-muted: #6B6B6B        /* 비활성 텍스트 */
--accent-orange: #FFA726     /* 강조 오렌지 */
--accent-blue: #29B6F6       /* 강조 블루 */
--accent-purple: #AB47BC     /* 강조 보라 */
--accent-green: #66BB6A      /* 강조 초록 */
```

## 장비 등급 색상

- **레전더리** - 골드 (#FFD700)
- **유니크** - 오렌지 (#FFA726)
- **에픽** - 보라 (#AB47BC)
- **레어** - 파랑 (#29B6F6)

## 키보드 단축키

- **1~7** - 탭 전환 (장비/스탯/컨텐츠/스킬/코디/히스토리/본캐부캐)
- **ESC** - 홈으로 돌아가기

## 기술 스택

- **HTML5** - 시맨틱 마크업
- **CSS3** - Grid, Flexbox, 애니메이션
- **Vanilla JavaScript** - ES6+ (async/await, fetch API)
- **Google Fonts** - Noto Sans KR

## 디자인 시스템

피그마 디자인을 기반으로 한 일관된 디자인 시스템:
- 8px 그리드 시스템
- Material Design 섀도우
- 다크 테마 우선
- 반응형 레이아웃

## 브라우저 지원

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 향후 개선 사항

1. **실시간 데이터 업데이트**
   - WebSocket을 통한 실시간 스탯 변경 감지
   - 자동 새로고침

2. **캐릭터 비교 기능**
   - 여러 캐릭터 동시 비교
   - 스탯 차이 시각화

3. **성장 히스토리 차트**
   - Chart.js를 이용한 레벨/스탯 성장 그래프
   - 기간별 성장률 분석

4. **장비 시뮬레이터**
   - 가상 장비 착용 시뮬레이션
   - 스탯 변화 미리보기

5. **공유 기능**
   - SNS 공유
   - 캐릭터 정보 이미지 생성

## 라이선스

This site is not associated with NEXON Korea.
Data based on NEXON OpenAPI.

---

**문의:** support@chuchu.gg

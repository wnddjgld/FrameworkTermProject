# 츄츄지지 (CHUCHU.gg) - 메이플스토리 정보 검색 서비스

## 프론트엔드 UI 구현 완료

피그마 디자인을 기반으로 메이플스토리 캐릭터 정보 검색 웹사이트의 프론트엔드 UI를 구현했습니다.

## 구현된 페이지

### 홈페이지 (`/home.html`)

피그마 디자인을 완벽하게 재현한 메인 홈페이지입니다.

**주요 기능:**
- 다크 테마 기반 UI (라이트 모드 토글 가능)
- 상단 헤더 및 네비게이션 탭
- 히어로 섹션 (로고 + 검색창)
- 알림 배너
- 메이플스토리 공지사항 / 업데이트 카드
- 통계 카드 (메스피, 월드 인구)
- 실시간 인기 캐릭터 목록
- 진행 중인 이벤트 캐러셀
- 캐시샵 공지 캐러셀
- 반응형 디자인

## 파일 구조

```
src/main/resources/static/
├── home.html              # 새로운 홈페이지
├── css/
│   └── home.css          # 피그마 디자인 스타일
├── js/
│   └── home.js           # 인터랙티브 기능
└── images/
    └── logo.svg          # 로고 이미지
```

## 사용 방법

1. **Spring Boot 서버 실행**
   ```bash
   ./gradlew bootRun
   ```

2. **브라우저에서 접속**
   ```
   http://localhost:8080/home.html
   ```

## 주요 기능 설명

### 1. 검색 기능
- 히어로 섹션의 검색창에서 캐릭터 이름 입력
- `/` 키를 눌러 빠르게 검색창 포커스
- 엔터 또는 검색 버튼 클릭으로 검색

### 2. 테마 전환
- 상단 우측의 달 아이콘 클릭으로 라이트/다크 모드 전환
- 로컬 스토리지에 테마 설정 저장

### 3. 캐러셀
- 이벤트 및 캐시샵 공지를 캐러셀로 표시
- 좌우 화살표로 수동 네비게이션
- 5초마다 자동 재생
- 하단 인디케이터로 현재 위치 표시

### 4. 반응형 디자인
- 데스크톱 (1920px+)
- 태블릿 (768px ~ 1600px)
- 모바일 (~ 768px)

## CSS 변수

`home.css`에서 정의된 주요 색상 변수:

```css
--bg-primary: #15171B        /* 메인 배경 */
--bg-secondary: #1C1F26      /* 카드 배경 */
--text-primary: #FFFFFF      /* 주요 텍스트 */
--accent-orange: #FFA726     /* 강조 오렌지 */
--accent-blue: #29B6F6       /* 강조 블루 */
```

## 백엔드 API 연동

현재는 정적 데이터로 구현되어 있으며, 다음 단계로 백엔드 API와 연동할 수 있습니다:

### 필요한 API 엔드포인트:
- `GET /api/notices` - 공지사항 목록
- `GET /api/updates` - 업데이트 목록
- `GET /api/events` - 진행 중인 이벤트
- `GET /api/characters/popular` - 인기 캐릭터
- `GET /api/stats/mespi` - 메스피 통계
- `GET /api/stats/population` - 월드 인구 통계

## 개선 사항

추가로 구현하면 좋을 기능들:

1. **실시간 데이터 연동**
   - 백엔드 API와 연결
   - 주기적 데이터 업데이트

2. **애니메이션 개선**
   - 페이지 전환 애니메이션
   - 스크롤 애니메이션 강화

3. **접근성 개선**
   - ARIA 레이블 추가
   - 키보드 네비게이션 강화

4. **성능 최적화**
   - 이미지 지연 로딩
   - CSS/JS 압축

## 기술 스택

- **HTML5** - 시맨틱 마크업
- **CSS3** - Flexbox, Grid, 애니메이션
- **Vanilla JavaScript** - ES6+
- **Google Fonts** - Noto Sans KR

## 디자인 시스템

피그마 디자인을 기반으로 한 일관된 디자인 시스템:
- 8px 그리드 시스템
- Material Design 섀도우
- Noto Sans KR 폰트 패밀리
- 다크 테마 우선

## 브라우저 지원

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 라이선스

This site is not associated with NEXON Korea.
Data based on NEXON OpenAPI.

---

**문의:** support@chuchu.gg

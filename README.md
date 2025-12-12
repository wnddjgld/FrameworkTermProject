# 🍁 MapleProject - 메이플스토리 캐릭터 조회 서비스

Spring Boot 기반의 메이플스토리 캐릭터 정보 조회 웹 애플리케이션입니다.

## 📋 프로젝트 개요

Nexon Open API를 활용하여 메이플스토리 캐릭터의 상세 정보를 조회하고, 사용자가 즐겨찾는 캐릭터를 관리할 수 있는 웹 서비스입니다.

## ✨ 주요 기능

- 🔍 **캐릭터 검색**: 캐릭터명으로 실시간 정보 조회
- 📊 **상세 정보**: 스탯, 장비, 스킬, 심볼 등 종합 정보 제공
- ⭐ **즐겨찾기**: 자주 찾는 캐릭터 저장 및 관리
- 📜 **검색 기록**: 최근 검색한 캐릭터 자동 저장
- 🔐 **회원 인증**: JWT 기반 사용자 인증 시스템
- 🌓 **다크모드**: 라이트/다크 테마 지원

## 🛠️ 기술 스택

### Backend
- **Java 17**
- **Spring Boot 4.0.0**
  - Spring Web
  - Spring Data JPA
  - Spring Security
  - Spring WebFlux (Nexon API 연동)
- **MySQL 8.0** (데이터베이스)
- **Redis** (캐싱)
- **JWT** (인증)
- **Gradle** (빌드 도구)

### Frontend
- **Vanilla JavaScript**
- **HTML5/CSS3**
- **Responsive Design**

### Infrastructure
- **Docker** (MySQL, Redis, phpMyAdmin)

## 📦 프로젝트 구조

```
src/
├── main/
│   ├── java/kr/ac/kopo/wnddjgld/mapleproject/
│   │   ├── client/          # Nexon API 클라이언트
│   │   ├── config/          # 설정 (Security, Redis, WebClient)
│   │   ├── controller/      # REST API 컨트롤러
│   │   ├── dto/             # 요청/응답 DTO
│   │   ├── entity/          # JPA 엔티티
│   │   ├── exception/       # 예외 처리
│   │   ├── repository/      # JPA 리포지토리
│   │   ├── security/        # JWT 인증
│   │   └── service/         # 비즈니스 로직
│   └── resources/
│       ├── application.yml                 # 설정 파일 (환경변수 참조)
│       ├── application-local.yml.example   # 로컬 설정 예시
│       └── static/                         # 프론트엔드 리소스
└── test/
```

## 🚀 시작하기

### 1. 사전 요구사항

- Java 17 이상
- Docker & Docker Compose
- Git

### 2. 프로젝트 클론

```bash
git clone https://github.com/wnddjgld/FrameworkTermProject.git
cd FrameworkTermProject
```

### 3. 환경 설정

#### 3.1 로컬 설정 파일 생성

```bash
cp src/main/resources/application-local.yml.example src/main/resources/application-local.yml
```

#### 3.2 Nexon API 키 발급

1. [Nexon Open API](https://openapi.nexon.com/) 회원가입
2. API 키 발급
3. `application-local.yml`에 API 키 입력

```yaml
nexon:
  api:
    key: YOUR_NEXON_API_KEY_HERE

spring:
  security:
    jwt:
      secret-key: YOUR_JWT_SECRET_KEY_HERE  # 최소 32자 이상 권장
```

### 4. Docker 컨테이너 실행

```bash
docker-compose up -d
```

실행되는 서비스:
- MySQL: `localhost:3307`
- Redis: `localhost:6379`
- phpMyAdmin: `http://localhost:8082`

### 5. 애플리케이션 실행

#### Windows (PowerShell)
```powershell
./gradlew.bat bootRun --args='--spring.profiles.active=local'
```

#### Linux/Mac
```bash
./gradlew bootRun --args='--spring.profiles.active=local'
```

### 6. 접속

브라우저에서 `http://localhost:8080` 접속

## 📝 API 명세

### 인증 (Auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | 회원가입 |
| POST | `/api/auth/login` | 로그인 |

### 캐릭터 (Characters)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/characters/search?name={name}` | 캐릭터 검색 |
| GET | `/api/characters/{ocid}/detail` | 캐릭터 상세 정보 |
| GET | `/api/characters/{ocid}/equipment` | 장비 정보 |
| GET | `/api/characters/{ocid}/skill?grade={grade}` | 스킬 정보 |
| GET | `/api/characters/{ocid}/symbol-equipment` | 심볼 정보 |
| GET | `/api/characters/{ocid}/ability` | 어빌리티 정보 |
| GET | `/api/characters/{ocid}/hyper-stat` | 하이퍼스탯 정보 |
| GET | `/api/characters/{ocid}/union` | 유니온 정보 |
| GET | `/api/characters/{ocid}/dojang` | 무릉도장 정보 |

### 즐겨찾기 (Favorites)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/favorites` | 즐겨찾기 목록 조회 |
| POST | `/api/favorites` | 즐겨찾기 추가 |
| DELETE | `/api/favorites` | 즐겨찾기 삭제 |
| GET | `/api/favorites/check?characterName={name}` | 즐겨찾기 여부 확인 |

### 검색 기록 (Search History)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/search-history?limit={limit}` | 검색 기록 조회 |
| DELETE | `/api/search-history/{id}` | 검색 기록 삭제 |
| DELETE | `/api/search-history/all` | 전체 검색 기록 삭제 |

## 🗄️ 데이터베이스 스키마

### users (사용자)
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### favorites (즐겨찾기)
```sql
CREATE TABLE favorites (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    character_name VARCHAR(50) NOT NULL,
    ocid VARCHAR(100),
    world_name VARCHAR(50),
    character_class VARCHAR(50),
    character_level INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### search_history (검색 기록)
```sql
CREATE TABLE search_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    character_name VARCHAR(50) NOT NULL,
    ocid VARCHAR(100),
    world_name VARCHAR(50),
    character_class VARCHAR(50),
    character_level INT,
    searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 🔒 보안

- ✅ JWT 기반 사용자 인증
- ✅ BCrypt 비밀번호 암호화
- ✅ API 키 환경변수 관리
- ✅ CORS 설정
- ✅ Rate Limiting (Nexon API 일일 1000건 제한)
- ✅ Git 히스토리에서 민감정보 제외

## 🎨 화면 구성

### 대시보드
- 캐릭터 검색
- 메이플스토리 공지사항/업데이트
- 진행 중인 이벤트
- 검색 기록 드롭다운

### 캐릭터 상세
- 기본 정보 (레벨, 직업, 길드 등)
- 장비 정보 (3개 프리셋)
- 스탯 정보
- 스킬 정보 (0~6차)
- 심볼/하이퍼스탯/어빌리티
- 컨텐츠 (무릉도장, 유니온, 업적)
- 코디 (캐시장비)

### 즐겨찾기
- 즐겨찾기 캐릭터 목록
- 편집 모드
- 빠른 접근

## 🔧 트러블슈팅

### Docker 컨테이너가 실행되지 않을 때

```bash
# 컨테이너 중지 및 삭제
docker-compose down

# 볼륨까지 삭제 (데이터 초기화)
docker-compose down -v

# 재시작
docker-compose up -d
```

### Nexon API Rate Limit 초과

- Nexon API는 일일 1000건 제한이 있습니다
- 새벽에 초기화되므로, 다음날 다시 시도하세요

### JWT 토큰 만료

- Access Token은 1시간 유효
- Refresh Token은 7일 유효
- 재로그인이 필요합니다

## 📄 라이선스

이 프로젝트는 교육 목적으로 제작되었습니다.

## 👥 개발자

- **정아형** - [GitHub](https://github.com/wnddjgld)

## 📚 참고 자료

- [Nexon Open API](https://openapi.nexon.com/)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [JWT.io](https://jwt.io/)

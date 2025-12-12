# Nexon API 설정 가이드

## 개요

이 프로젝트는 Nexon Open API를 사용하여 메이플스토리 캐릭터 정보를 조회합니다.
API 키는 환경 변수를 통해 설정할 수 있으며, 보안을 위해 직접 코드에 하드코딩하지 않는 것을 권장합니다.

## 1. Nexon API 키 발급

1. [Nexon Open API 포털](https://openapi.nexon.com/)에 접속합니다.
2. 회원가입 및 로그인을 진행합니다.
3. 애플리케이션 등록 후 API 키를 발급받습니다.
4. 메이플스토리 API 사용 권한을 활성화합니다.

## 2. API 키 설정 방법

### 방법 1: 환경 변수 설정 (권장)

#### Windows

1. 시스템 환경 변수 설정:
   ```
   setx NEXON_API_KEY "your-actual-api-key-here"
   ```

2. IntelliJ IDEA 실행 구성에서 설정:
   - Run > Edit Configurations
   - Environment Variables에 추가:
     ```
     NEXON_API_KEY=your-actual-api-key-here
     ```

#### Linux/Mac

1. 터미널에서 환경 변수 설정:
   ```bash
   export NEXON_API_KEY="your-actual-api-key-here"
   ```

2. 영구 설정 (`.bashrc` 또는 `.zshrc`에 추가):
   ```bash
   echo 'export NEXON_API_KEY="your-actual-api-key-here"' >> ~/.bashrc
   source ~/.bashrc
   ```

### 방법 2: application.yml 직접 수정 (비권장)

`src/main/resources/application.yml` 파일에서 API 키를 직접 수정할 수 있습니다:

```yaml
nexon:
  api:
    key: your-actual-api-key-here
```

**주의**: 이 방법은 보안상 권장하지 않으며, Git에 커밋하지 않도록 주의해야 합니다.

## 3. 테스트 환경 API 키 설정

테스트 환경에서는 별도의 환경 변수를 사용할 수 있습니다:

```
NEXON_API_KEY_TEST=your-test-api-key-here
```

## 4. API 키 설정 확인

애플리케이션 실행 후 다음 로그를 확인하여 API 키가 올바르게 설정되었는지 확인할 수 있습니다:

```
2025-xx-xx xx:xx:xx.xxx  INFO --- [           main] k.a.k.w.m.config.NexonApiConfig  : Nexon API initialized with key: test_****...
```

## 5. API 사용 제한

- **일일 호출 제한**: 9,000회
- **타임아웃**: 10초
- **최대 재시도 횟수**: 3회

프로젝트 설정에서 이러한 제한을 고려하여 API를 사용하세요.

## 6. JWT 시크릿 키 설정

보안을 위해 JWT 시크릿 키도 환경 변수로 설정하는 것을 권장합니다:

```
JWT_SECRET_KEY=your-super-secret-key-must-be-at-least-256-bits-long-for-hs256-algorithm
```

## 7. 데이터베이스 설정

MySQL 데이터베이스 연결 정보도 필요에 따라 환경 변수로 설정할 수 있습니다:

```
DB_URL=jdbc:mysql://localhost:3307/maplestory_db
DB_USERNAME=maple_user
DB_PASSWORD=maple_password
```

## 8. 트러블슈팅

### API 키가 작동하지 않을 때

1. API 키가 올바르게 설정되었는지 확인
2. Nexon Open API 포털에서 키가 활성화되어 있는지 확인
3. 일일 호출 제한을 초과하지 않았는지 확인
4. 애플리케이션을 재시작하여 환경 변수가 로드되었는지 확인

### 환경 변수가 인식되지 않을 때

1. IDE를 재시작
2. 시스템 환경 변수가 올바르게 설정되었는지 확인
3. Run Configuration에서 환경 변수가 설정되었는지 확인

## 9. 보안 권장사항

1. **절대 API 키를 Git에 커밋하지 마세요**
2. `.gitignore`에 환경 변수 파일 추가
3. 프로덕션 환경에서는 반드시 환경 변수 사용
4. API 키가 노출되었다면 즉시 재발급
5. 정기적으로 API 키 갱신

## 10. 참고 자료

- [Nexon Open API 문서](https://openapi.nexon.com/game/maplestory/)
- [Spring Boot 환경 변수 설정](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config)

# 게시판 백엔드 (Spring Boot)

앞서 만든 React 프론트엔드와 바로 연동되는 REST API 서버입니다.
별도 DB 설치 없이 H2 인메모리 DB로 바로 실행해볼 수 있습니다.

## 실행 방법

**IntelliJ / STS 등 IDE로 열기 (추천)**
1. `board-backend` 폴더를 IDE에서 Maven 프로젝트로 열기
2. `BoardApplication.java`를 실행 (Run)

**커맨드라인 (Maven이 설치되어 있는 경우)**
```bash
mvn spring-boot:run
```

정상 기동되면 콘솔에 `Tomcat started on port(s): 8080`이 표시됩니다.

## 확인 방법

```bash
curl http://localhost:8080/api/boards
```
샘플 게시글 2개(`DataInitializer`가 자동으로 넣어줌)가 JSON으로 반환되면 정상입니다.

H2 콘솔(브라우저 DB 확인 도구): http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:boarddb;MODE=MySQL`
- User Name: `sa` / Password: (공란)

## API 명세

| 기능 | Method | URL | Body |
|---|---|---|---|
| 목록/검색 | GET | `/api/boards?keyword=검색어` | - |
| 상세 (조회수 +1) | GET | `/api/boards/{id}` | - |
| 작성 | POST | `/api/boards` | `{ "title", "writer", "content" }` |
| 수정 | PUT | `/api/boards/{id}` | `{ "title", "writer", "content" }` |
| 삭제 | DELETE | `/api/boards/{id}` | - |

- `title`, `content`는 필수값이며 비어있으면 400과 함께 에러 메시지를 반환합니다.
- 존재하지 않는 id로 조회/수정/삭제하면 404를 반환합니다.
- 프론트엔드(`http://localhost:5173`)에서의 요청을 허용하는 CORS 설정이 `WebConfig.java`에 이미 되어 있습니다.

## 폴더 구조

```
src/main/java/com/example/board/
  BoardApplication.java     # 메인 실행 클래스
  domain/Board.java          # 게시글 엔티티
  repository/BoardRepository.java
  dto/BoardRequest.java      # 요청 DTO (제목/작성자/내용)
  dto/BoardResponse.java     # 응답 DTO
  service/BoardService.java  # 비즈니스 로직 (CRUD, 조회수 증가 등)
  controller/BoardController.java  # /api/boards REST 엔드포인트
  config/WebConfig.java      # CORS 설정
  config/DataInitializer.java # 샘플 데이터 자동 생성
  exception/GlobalExceptionHandler.java # 404/400 공통 예외 처리
```

## MySQL로 전환하기

지금은 테스트 편의를 위해 H2를 쓰고 있습니다. 실제 운영 DB(MySQL)로 바꾸려면:

1. `pom.xml`에서 주석 처리된 `mysql-connector-j` 의존성의 주석을 해제
2. `application.yml`에서 주석 처리된 MySQL 설정 블록의 주석을 해제하고, H2 관련 설정은 삭제
3. MySQL에 `boarddb` 데이터베이스를 미리 생성

`ddl-auto: update` 설정 덕분에 테이블은 첫 실행 시 자동으로 생성됩니다.

## 추후 로그인 기능 추가 시

프론트엔드의 `axiosInstance.js`가 이미 `Authorization: Bearer {token}` 헤더를 자동으로 보내도록
되어 있으므로, 백엔드에 Spring Security + JWT를 추가하고 `BoardController`의 작성/수정/삭제
엔드포인트에 인증 체크만 추가하면 자연스럽게 연동됩니다.

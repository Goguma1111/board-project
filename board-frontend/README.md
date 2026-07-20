# 게시판 프론트엔드 (React + Vite + Tailwind CSS)

Spring Boot REST API와 연동하는 게시판 프론트엔드입니다.

## 실행 방법

```bash
npm install
cp .env.example .env   # VITE_API_BASE_URL을 백엔드 주소에 맞게 수정
npm run dev
```

## 폴더 구조

```
src/
  api/
    axiosInstance.js   # axios 공통 설정 (baseURL, 인터셉터)
    boardApi.js         # 게시판 관련 API 호출 함수 모음
  components/
    Header.jsx           # 상단 네비게이션 (로그인 버튼 자리 포함)
    BoardList.jsx         # 게시글 목록 + 제목 검색
    BoardItem.jsx         # 목록의 개별 행
    BoardDetail.jsx       # 게시글 상세보기 (수정/삭제 버튼 포함)
    BoardWrite.jsx         # 글쓰기 폼
    BoardEdit.jsx          # 글 수정 폼
  context/
    AuthContext.jsx        # 로그인 상태 관리용 컨텍스트 (추후 확장 대비)
  App.jsx                   # 라우팅 설정
  main.jsx                  # 앱 진입점
```

## 백엔드(Spring Boot)와의 API 계약 (예시)

프론트엔드는 아래 엔드포인트를 기준으로 작성되어 있습니다. 실제 백엔드 응답 형식이 다르다면
`src/api/boardApi.js`와 각 컴포넌트의 `response.data` 사용 부분만 수정하면 됩니다.

| 기능 | Method | URL | 설명 |
|---|---|---|---|
| 목록 조회 | GET | `/api/boards?keyword=검색어` | keyword 없으면 전체 목록 |
| 상세 조회 | GET | `/api/boards/{id}` | |
| 작성 | POST | `/api/boards` | body: `{ title, writer, content }` |
| 수정 | PUT | `/api/boards/{id}` | body: `{ title, writer, content }` |
| 삭제 | DELETE | `/api/boards/{id}` | |

목록 응답은 배열(`[...]`) 또는 스프링 데이터 페이징 형식(`{ content: [...] }`) 둘 다 처리하도록
`BoardList.jsx`에서 분기 처리되어 있습니다.

## 추후 로그인 기능 확장 방법

로그인 기능을 붙이기 쉽도록 아래와 같이 구조를 미리 잡아 두었습니다.

1. `src/context/AuthContext.jsx`
   - 이미 `user`, `login`, `logout`, `isAuthenticated`를 제공합니다.
   - 로그인 API 연동 시 `login()` 함수 안에서 토큰을 `localStorage`에 저장하고,
     서버에서 받은 사용자 정보를 `setUser()`로 저장하면 됩니다.

2. `src/api/axiosInstance.js`
   - 요청 인터셉터가 이미 `localStorage`의 `accessToken`을 읽어
     `Authorization: Bearer {token}` 헤더에 자동으로 실어 보내도록 구현되어 있습니다.
   - 응답 인터셉터에는 401 응답을 처리할 자리가 주석으로 표시되어 있습니다.

3. `src/App.jsx`
   - `/login` 라우트를 추가하고 `Login` 컴포넌트를 만들어 연결하세요.
   - 글쓰기/수정/삭제처럼 로그인이 필요한 라우트는
     `AuthContext`의 `isAuthenticated` 값을 검사하는 `ProtectedRoute` 컴포넌트로
     감싸는 방식으로 쉽게 확장할 수 있습니다.

4. `src/components/Header.jsx`
   - 이미 `isAuthenticated` 값에 따라 로그인/로그아웃 UI를 분기하도록 만들어져 있어,
     실제 로그인 기능만 연결하면 바로 동작합니다.

# 🎀 몽글몽글 게시판 (Mongle Board) ✨

> **오늘의 소소하고 즐거운 일상들을 함께 나누는 공간이에요!** 🌸  
> 파스텔 톤의 귀여운 UI와 실시간 파일 업로드, 공지사항 관리 기능, 회원 인증을 갖춘 풀스택 게시판 프로젝트입니다.

---

## 🎨 주요 기능 (Features)

- 📢 **스마트 공지사항 시스템**: 
  - 관리자(`ADMIN`) 권한을 가진 유저에게만 공지사항 등록 체크박스 노출
  - 상단 앰버 톤 배너에 최신 공지글 **최대 5개** 우선 표출
  - 일반 게시글 카드 목록과 중복되지 않도록 깔끔한 자동 필터링 적용
- 🖼️ **이미지 & GIF 움짤 업로드**: 
  - 내 컴퓨터의 사진 및 GIF 파일을 게시글에 첨부 (미리보기 지원)
  - `uploads` 서버 폴더 디스크 저장 및 UUID 기반 파일명 중복 방지
- 📝 **게시글 작성/수정/삭제**: 
  - 작성자 고정 및 Form Validation(제목/내용 필수 입력)
  - 파스텔 톤의 동글동글한 버블 카드 스타일로 게시글 목록 확인
- 🔍 **실시간 게시글 검색**: 키워드 기반의 빠른 게시글 검색 지원
- 💌 **회원 인증 & 보안**: JWT 토큰 기반 로그인/로그아웃 및 권한별 접근 제어

---

## 🛠️ 기술 스택 (Tech Stack)

### 💻 Frontend
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=Tailwind-CSS&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

### ⚙️ Backend
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=Spring-Boot&logoColor=white)
![Java](https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=java&logoColor=white)
![Spring Data JPA](https://img.shields.io/badge/Spring_Data_JPA-6DB33F?style=for-the-badge&logo=Spring&logoColor=white)

---

## 📁 프로젝트 구조 (Directory)

```text
📁 My-Board-Project
 ├── 📁 board-backend    # Spring Boot 기반 백엔드 API ⚙️
 └── 📁 board-frontend   # React & Tailwind CSS 기반 프론트엔드 🌸
```
---


## 실행방법 (backend)

cd board-backend <br>
mvn spring-boot:run

---

## 실행방법 (frontend)
cd board-frontend <br>
npm install <br>
npm run dev <br>

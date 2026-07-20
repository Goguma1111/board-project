import axiosInstance from "./axiosInstance";

// 게시글 목록 조회 (제목 검색어(keyword)를 옵션으로 전달)
// 백엔드 예시: GET /api/boards?keyword=검색어
export const getBoards = (keyword = "") => {
  return axiosInstance.get("/boards", {
    params: keyword ? { keyword } : {},
  });
};

// 게시글 상세 조회
// 백엔드 예시: GET /api/boards/{id}
export const getBoard = (id) => {
  return axiosInstance.get(`/boards/${id}`);
};

// 게시글 작성 (파일 업로드를 위해 formData와 multipart 헤더 추가!)
export const createBoard = (formData) => {
  return axiosInstance.post("/boards", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
// 게시글 수정
// 백엔드 예시: PUT /api/boards/{id}
export const updateBoard = (id, data) => {
  return axiosInstance.put(`/boards/${id}`, data);
};

// 게시글 삭제
// 백엔드 예시: DELETE /api/boards/{id}
export const deleteBoard = (id) => {
  return axiosInstance.delete(`/boards/${id}`);
};

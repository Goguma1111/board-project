import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/api";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});
// axiosInstance.js
axiosInstance.interceptors.request.use(
  (config) => {
    // "accessToken"이 없으면 "token"도 찾아봅니다.
    const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// 응답에서 401(미인증) 에러가 나면 토큰을 지우고 로그인으로 이동시킵니다.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("accessToken");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance"; // axiosInstance 파일 경로 확인!

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. 앱을 새로고침해도 로컬스토리지에 토큰이 있으면 유저 정보를 다시 가져옵니다.
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const response = await axiosInstance.get("/auth/me");
          setUser(response.data);
        } catch (error) {
          console.error("인증 실패", error);
          localStorage.removeItem("accessToken");
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // 2. 로그인 함수
  const login = async (email, password) => {
    const response = await axiosInstance.post("/auth/login", { email, password });
    const { token, user: userData } = response.data;

    // 토큰 저장 및 상태 업데이트
    localStorage.setItem("accessToken", token);
    setUser(userData || { email, name: email.split("@")[0] });
    return response.data;
  };

  // 3. 회원가입 함수
  const signup = async (email, password, name) => {
    const response = await axiosInstance.post("/auth/signup", { email, password, name });
    return response.data;
  };

  // 4. 로그아웃 함수
  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  const value = { user, login, signup, logout, isAuthenticated: !!user };

  if (loading) return null; // 유저 확인이 끝날 때까지 빈 화면으로 잠시 대기

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
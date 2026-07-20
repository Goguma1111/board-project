import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const [isLoginMode, setIsLoginMode] = useState(
    location.state?.isSignUp ? false : true
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (location.state?.isSignUp !== undefined) {
      setIsLoginMode(!location.state.isSignUp);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      if (isLoginMode) {
        // 1️⃣ 로그인 제출
        await login(email, password);
        alert("🎉 반갑습니다! 로그인되었어요 ✨");
        navigate("/");
      } else {
        // 2️⃣ 회원가입 제출
        await signup(email, password, name);
        alert("🌸 회원가입 성공! 반가워요, 이제 로그인해 주세요 ✨");
        setIsLoginMode(true);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error.response?.data?.message || "😿 요청 처리 중 오류가 발생했어요."
      );
    }
  };

  return (
    <div className="mx-auto mt-16 max-w-md px-4">
      <div className="rounded-3xl border-2 border-pink-200 bg-pink-50/40 p-8 shadow-sm backdrop-blur-sm">
        {/* 🌸 타이틀 & 아이콘 */}
        <div className="mb-6 text-center">
          <span className="inline-block text-3xl mb-2">
            {isLoginMode ? "💌" : "🌷"}
          </span>
          <h2 className="text-2xl font-black text-pink-500 tracking-wide">
            {isLoginMode ? "다시 만나 반가워요!" : "새로운 친구 만나기"}
          </h2>
          <p className="mt-1 text-xs font-semibold text-purple-400">
            {isLoginMode
              ? "아이디와 비밀번호를 입력해 주세요 🌸"
              : "몽글몽글 게시판의 식구가 되어보세요 ✨"}
          </p>
        </div>

        {/* 📝 입력 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 회원가입 모드일 때만 '이름' 입력창 표시 */}
          {!isLoginMode && (
            <div>
              <label className="mb-1 block text-xs font-bold text-pink-600">
                👤 아이디 (이름)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="어떻게 불러드릴까요?"
                className="w-full rounded-2xl border-2 border-pink-100 bg-white px-4 py-2.5 text-xs text-gray-700 placeholder-pink-300 transition focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-bold text-pink-600">
              ✉️ 이메일
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@email.com"
              className="w-full rounded-2xl border-2 border-pink-100 bg-white px-4 py-2.5 text-xs text-gray-700 placeholder-pink-300 transition focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-pink-600">
              🔒 비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full rounded-2xl border-2 border-pink-100 bg-white px-4 py-2.5 text-xs text-gray-700 placeholder-pink-300 transition focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
            />
          </div>

          {/* 에러 메시지 뱃지 */}
          {errorMessage && (
            <div className="rounded-2xl bg-red-100 p-2.5 text-center text-xs font-bold text-red-500">
              {errorMessage}
            </div>
          )}

          {/* 로그인 / 회원가입 제출 버튼 */}
          <button
            type="submit"
            className="w-full rounded-full bg-gradient-to-r from-pink-400 to-purple-400 py-3 text-xs font-bold text-white shadow-md transition hover:from-pink-500 hover:to-purple-500 hover:shadow-lg active:scale-95 mt-2"
          >
            {isLoginMode ? "로그인하기 ✨" : "가입완료하기 🌸"}
          </button>
        </form>

        {/* 🔹 토글 버튼: 회원가입 <-> 로그인 전환 */}
        <div className="mt-6 text-center border-t border-pink-100/80 pt-4">
          <button
            type="button"
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setErrorMessage("");
            }}
            className="text-xs font-bold text-purple-400 hover:text-pink-500 hover:underline transition"
          >
            {isLoginMode
              ? "계정이 없으신가요? 회원가입하기 🌷"
              : "이미 계정이 있으신가요? 로그인하기 💌"}
          </button>
        </div>
      </div>
    </div>
  );
}
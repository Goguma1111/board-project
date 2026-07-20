import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // 글쓰기 버튼 클릭 핸들러
  const handleWriteClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault(); // 페이지 이동 방지
      alert("✨ 글을 작성하려면 로그인이 필요해요!");
      navigate("/login");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-pink-100/60 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        {/* 🌸 로고 영역 */}
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-black tracking-wide text-pink-500 hover:text-pink-600 transition"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-pink-100 text-base">
            🌸
          </span>
          <span>자유 게시판</span>
        </Link>

        {/* 🍧 내비게이션 영역 */}
        <nav className="flex items-center gap-2.5 text-xs font-bold">
          {/* ✏️ 글쓰기 버튼 */}
          <Link
            to="/boards/new"
            onClick={handleWriteClick}
            className="flex items-center gap-1 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 px-4 py-2 text-white shadow-sm transition hover:from-pink-500 hover:to-purple-500 hover:shadow-md active:scale-95"
          >
            <span>✏️</span>
            <span>글쓰기</span>
          </Link>

          {/* 💖 로그인 / 사용자 상태 */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2 pl-1">
              {/* 사용자 뱃지 */}
              <div className="flex items-center gap-1.5 rounded-full bg-pink-50 border border-pink-200/60 px-3 py-1.5 text-pink-600">
                <span className="text-xs">🌷</span>
                <span>{user?.name || user?.email}</span>
                <span className="text-[10px] text-pink-400">님</span>
              </div>

              {/* 로그아웃 버튼 */}
              <button
                onClick={logout}
                className="rounded-full border border-pink-200 bg-white px-3.5 py-2 text-pink-500 transition hover:bg-pink-50 hover:border-pink-300 active:scale-95"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* 1. 로그인 버튼 */}
              <Link
                to="/login"
                state={{ isSignUp: false }}
                className="rounded-full border border-pink-200 bg-white px-4 py-2 text-pink-500 transition hover:bg-pink-50 hover:border-pink-300 active:scale-95"
              >
                로그인
              </Link>

              {/* 2. 회원가입 버튼 */}
              <Link
                to="/login"
                state={{ isSignUp: true }}
                className="rounded-full bg-purple-100 px-4 py-2 text-purple-600 border border-purple-200 transition hover:bg-purple-200 active:scale-95"
              >
                회원가입
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
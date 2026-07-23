import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getBoard, deleteBoard } from "../api/boardApi";
import { useAuth } from "../context/AuthContext"; // 👈 내 작성글인지 확인용

function BoardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // 👈 현재 로그인된 유저 정보

  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBoard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchBoard = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getBoard(id);
      console.log("🌸 백엔드에서 받아온 데이터:", response.data); // 👈 F12 콘솔에서 imageUrl이 있는지 확인용!
      setBoard(response.data);
    } catch (err) {
      console.error(err);
      setError("😿 게시글을 불러오는 중 오류가 발생했어요.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("🎀 정말 이 게시글을 삭제할까요?")) return;
    try {
      await deleteBoard(id);
      alert("🗑️ 깔끔하게 삭제되었어요!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("😿 삭제 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs font-bold text-pink-400 animate-pulse">
        이야기를 불러오는 중이에요... 🌸
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <div className="rounded-2xl bg-pink-100 p-4 text-xs font-bold text-pink-600">
          {error}
        </div>
      </div>
    );
  }

  if (!board) return null;

  // 본인이 작성한 글인지 체크 (작성자 이름 또는 이메일 기반)
  const isOwner = user && (
    user.name === board.writer || 
    user.email === board.writer || 
    user.nickname === board.writer);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {/* 🌸 본문 카드 */}
      <div className="rounded-3xl border-2 border-pink-200 bg-white p-8 shadow-sm">
        {/* 헤더 (제목 + 정보) */}
        <div className="border-b border-pink-100 pb-5">
          <span className="inline-block rounded-full bg-pink-100 px-3 py-1 text-[11px] font-bold text-pink-500">
            소소한 이야기 💬
          </span>
          <h1 className="mt-3 text-xl font-black text-gray-800 leading-snug">
            {board.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-purple-400 font-medium">
            <span className="flex items-center gap-1">
              👤 <strong className="text-gray-700">{board.writer ?? "익명"}</strong>
            </span>
            <span>•</span>
            <span>
              📅 {board.createdAt ? board.createdAt.slice(0, 10) : "오늘"}
            </span>
            <span>•</span>
            <span>👀 조회 {board.viewCount ?? 0}</span>
          </div>
        </div>

        {(() => {
          const imagePath = board.imageUrl || board.fileUrl; // 둘 중 존재하는 값 사용
          if (!imagePath) return null;

          const fullUrl = imagePath.startsWith("http")
              ? imagePath
              : `http://localhost:8081${imagePath}`;

            return (
              <div className="mt-6 flex justify-center">
                <img
                  src={fullUrl}
                  alt="첨부 이미지"
                  className="max-h-96 rounded-2xl border-2 border-dashed border-pink-100 object-cover shadow-sm"
                />
              </div>
            );
          })()}
        {/* 📝 본문 내용 */}
        <div className="py-6 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap min-h-[150px]">
          {board.content}
        </div>
      </div>

      {/* 🎀 하단 버튼 영역 */}
      <div className="mt-6 flex items-center justify-between">
        <Link
          to="/"
          className="rounded-full border-2 border-pink-200 bg-white px-5 py-2.5 text-xs font-bold text-pink-500 shadow-sm hover:bg-pink-50 transition"
        >
          👈 목록으로
        </Link>

        {/* 내 글일 때만 수정/삭제 버튼 표시 (선택) */}
        <div className="flex gap-2">
          {isOwner && (
            <>
              <Link
                to={`/boards/${id}/edit`}
                className="rounded-full bg-purple-400 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-purple-500 transition"
              >
                ✏️ 수정
              </Link>
              <button
                onClick={handleDelete}
                className="rounded-full bg-pink-400 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-pink-500 transition"
              >
                🗑️ 삭제
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default BoardDetail;
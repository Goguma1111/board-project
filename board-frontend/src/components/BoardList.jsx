import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getBoards } from "../api/boardApi";

function BoardList() {
  const [boards, setBoards] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);

  // 게시글 목록 불러오기
  const fetchBoards = async (searchKeyword = "") => {
    try {
      setLoading(true);
      const response = await getBoards(searchKeyword);
      console.log("🌸 백엔드 데이터:", response.data);
      setBoards(response.data);
    } catch (error) {
      console.error("게시글을 불러오는데 실패했어요:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBoards(keyword);
  };

  // 📢 공지사항 데이터 필터링 (상단 공지 박스용)
  const notices = boards
    .filter(
      (board) =>
        board.notice === true ||
        board.isNotice === true ||
        (board.title && board.title.includes("[공지]"))
    )
    .slice(0, 5);

  // 📜 순수 일반 게시글 데이터 필터링 (하단 카드 목록용 - 공지글 제외!)
  const regularBoards = boards.filter(
    (board) =>
      !board.notice &&
      !board.isNotice &&
      (!board.title || !board.title.includes("[공지]"))
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* 🌸 메인 타이틀 & 설명 */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black tracking-wide text-pink-500">
          🎀 몽글몽글 게시판 ✨
        </h1>
        <p className="mt-2 text-xs font-medium text-purple-400">
          오늘의 즐거운 소소한 일상들을 함께 나눠요!
        </p>
      </div>

      {/* 📢 공지사항 섹션 (상단 공지 박스에만 똭!) */}
      {!loading && notices.length > 0 && (
        <div className="mb-8 overflow-hidden rounded-3xl border-2 border-amber-200 bg-amber-50/70 p-5 shadow-sm backdrop-blur-sm">
          <div className="mb-3 flex items-center justify-between border-b border-amber-200/70 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-200 text-sm shadow-xs">
                📢
              </span>
              <h2 className="text-sm font-black text-amber-800">
                알려드려요! (공지사항)
              </h2>
            </div>
            <span className="text-[11px] font-bold text-amber-600/80">
              최신 {notices.length}개
            </span>
          </div>

          <ul className="space-y-2">
            {notices.map((notice) => (
              <li key={`notice-${notice.id}`}>
                <Link
                  to={`/boards/${notice.id}`}
                  className="group flex items-center justify-between rounded-2xl bg-white/80 px-3.5 py-2 text-xs transition hover:bg-white hover:shadow-sm"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-700">
                      공지
                    </span>
                    <span className="truncate font-bold text-gray-700 group-hover:text-amber-600 transition">
                      {notice.title}
                    </span>
                  </div>
                  <span className="ml-2 shrink-0 text-[10px] font-semibold text-amber-500/80">
                    {notice.createdAt
                      ? new Date(notice.createdAt).toLocaleDateString()
                      : "오늘"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 🔍 검색창 & 글쓰기 버튼 */}
      <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearch} className="flex w-full sm:w-auto gap-2">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="검색어를 입력해 봐요~ 🔍"
            className="w-full sm:w-64 rounded-full border-2 border-pink-200 bg-white px-4 py-2 text-xs text-gray-700 placeholder-pink-300 shadow-sm transition focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-100"
          />
          <button
            type="submit"
            className="rounded-full bg-pink-400 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-pink-500 transition"
          >
            검색
          </button>
        </form>

        <Link
          to="/boards/new"
          className="w-full sm:w-auto text-center rounded-full bg-gradient-to-r from-pink-400 to-purple-400 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:from-pink-500 hover:to-purple-500 hover:shadow-lg transition"
        >
          ✏️ 글쓰러 가기
        </Link>
      </div>

      {/* 📜 일반 게시글 목록 영역 (공지글 제외!) */}
      {loading ? (
        <div className="py-20 text-center text-xs font-bold text-pink-400">
          로딩 중이에요... 🌸
        </div>
      ) : regularBoards.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-pink-200 bg-pink-50/30 py-16 text-center">
          <p className="text-sm font-bold text-purple-400">
            아직 작성된 일반 글이 없어요! 😿
          </p>
          <p className="mt-1 text-xs text-pink-300">
            첫 번째 주인공이 되어 글을 올려보세요 ✨
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {regularBoards.map((board) => {
            // 📸 이미지 경로 추출
            const imagePath = board.imageUrl || board.fileUrl;

            return (
              <Link
                key={board.id}
                to={`/boards/${board.id}`}
                className="group flex flex-col justify-between rounded-3xl border-2 border-pink-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-pink-300 hover:shadow-md"
              >
                <div>
                  {/* 📸 이미지 썸네일 */}
                  {imagePath && (
                    <div className="mb-3 overflow-hidden rounded-2xl bg-pink-50">
                      <img
                        src={
                          imagePath.startsWith("http")
                            ? imagePath
                            : `http://localhost:8081${imagePath}`
                        }
                        alt={board.title}
                        className="h-36 w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}

                  {/* 📌 제목 */}
                  <h2 className="line-clamp-1 text-base font-bold text-gray-800 group-hover:text-pink-500 transition">
                    {board.title}
                  </h2>

                  {/* 📝 내용 요약 */}
                  <p className="mt-2 line-clamp-2 text-xs text-gray-500 leading-relaxed">
                    {board.content}
                  </p>
                </div>

                {/* 👤 작성자 & 날짜 정보 */}
                <div className="mt-4 flex items-center justify-between border-t border-pink-50 pt-3 text-[11px] text-purple-400 font-medium">
                  <span className="flex items-center gap-1">
                    👤 {board.writer || "익명"}
                  </span>
                  <span>
                    {board.createdAt
                      ? new Date(board.createdAt).toLocaleDateString()
                      : "오늘"}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default BoardList;
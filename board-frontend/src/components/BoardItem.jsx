import { Link } from "react-router-dom";

function BoardItem({ board }) {
  const { id, title, writer, createdAt, viewCount, isNotice } = board;

  return (
    <li className="list-none">
      <Link
        to={`/boards/${id}`}
        className="group flex items-center justify-between rounded-3xl border-2 border-pink-100 bg-white/90 p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-pink-300 hover:bg-white hover:shadow-md active:scale-[0.99]"
      >
        <div className="min-w-0 flex-1 pr-3">
          {/* 📌 공지 뱃지 & 제목 */}
          <div className="flex items-center gap-2">
            {isNotice && (
              <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-700">
                공지
              </span>
            )}
            <p className="truncate text-sm font-bold text-gray-800 transition group-hover:text-pink-500">
              {title}
            </p>
          </div>

          {/* 👤 작성자 & 작성일 */}
          <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-purple-400/80">
            <span>👤 {writer ?? "익명"}</span>
            <span className="text-[10px] text-pink-200">•</span>
            <span>{createdAt ? createdAt.slice(0, 10) : "오늘"}</span>
          </p>
        </div>

        {/* 👁️ 조회수 버블 뱃지 */}
        <span className="shrink-0 rounded-full bg-pink-50 px-3 py-1 text-[11px] font-bold text-pink-400 border border-pink-100/60 group-hover:bg-pink-100 group-hover:text-pink-500 transition">
          👀 {viewCount ?? 0}
        </span>
      </Link>
    </li>
  );
}

export default BoardItem;
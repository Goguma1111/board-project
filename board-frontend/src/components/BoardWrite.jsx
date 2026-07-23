import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createBoard } from "../api/boardApi";
import { useAuth } from "../context/AuthContext";

function BoardWrite() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // 1. 폼 데이터 상태 (isNotice / notice 체크용 상태 추가)
  const [form, setForm] = useState({
    title: "",
    writer: "",
    content: "",
    isNotice: false, // 👈 공지사항 여부
  });

  // 2. 내 컴퓨터의 GIF/이미지 파일 상태 & 미리보기 URL 상태
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // 👑 관리자 여부 체크 (role이 ADMIN이거나, 이름/이메일이 관리자인 경우)
  const isAdmin =
    user &&
    (user.role === "ADMIN" ||
      user.role === "ROLE_ADMIN" ||
      user.name === "관리자" ||
      user.writer === "관리자" ||
      user.email?.includes("admin"));

  useEffect(() => {
    if (!isAuthenticated) {
      alert("🎀 로그인이 필요한 페이지예요!");
      navigate("/login");
      return;
    }

    if (user) {
      setForm((prev) => ({
        ...prev,
        writer: user.name || user.email || "익명",
      }));
    }
  }, [isAuthenticated, user, navigate]);

  // 텍스트 및 체크박스 입력 처리
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 📸 내 컴퓨터의 GIF/이미지 파일 선택 처리
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  // 💌 폼 제출 처리 (FormData 활용)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.content.trim()) {
      setError("✨ 제목과 내용을 모두 채워주세요!");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content", form.content);
      formData.append("writer", form.writer);

      // 📢 백엔드에서 isNotice 또는 notice 둘 다 호환되도록 둘 다 전송
      formData.append("isNotice", form.isNotice);
      formData.append("notice", form.isNotice);

      // 파일이 선택되었으면 추가
      if (file) {
        formData.append("image", file);
      }

      const response = await createBoard(formData);
      const newId = response.data.id;
      navigate(newId ? `/boards/${newId}` : "/");
    } catch (err) {
      console.error(err);
      setError("😿 게시글 등록 중 오류가 발생했어요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {/* 🎀 헤더 */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-black text-pink-500 tracking-wide">
          ✏️ 몽글몽글 새 글 쓰기 ✨
        </h1>
        <p className="mt-1 text-xs text-purple-400">
          오늘의 이야기를 들려주세요!
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-3xl border-2 border-pink-200 bg-pink-50/40 p-8 shadow-sm backdrop-blur-sm"
      >
        {error && (
          <div className="rounded-2xl bg-red-100 p-3 text-center text-xs font-bold text-red-500">
            {error}
          </div>
        )}

        {/* 👑 관리자일 때만 노출되는 공지사항 체크박스! */}
        {isAdmin && (
          <div className="flex items-center gap-2 rounded-2xl border-2 border-amber-200 bg-amber-50 p-3.5 shadow-xs">
            <input
              type="checkbox"
              id="isNotice"
              name="isNotice"
              checked={form.isNotice}
              onChange={handleChange}
              className="h-4 w-4 rounded-md accent-amber-500 cursor-pointer"
            />
            <label
              htmlFor="isNotice"
              className="text-xs font-extrabold text-amber-800 cursor-pointer select-none"
            >
              📢 이 글을 최상단 [공지사항]으로 등록할까요?
            </label>
          </div>
        )}

        {/* 작성자 (고정) */}
        <div>
          <label className="mb-1 block text-xs font-bold text-pink-600">
            👤 작성자
          </label>
          <input
            type="text"
            name="writer"
            value={form.writer}
            readOnly
            className="w-full rounded-2xl border border-pink-200 bg-white/70 px-4 py-2 text-sm font-semibold text-gray-500 cursor-not-allowed focus:outline-none"
          />
        </div>

        {/* 제목 */}
        <div>
          <label className="mb-1 block text-xs font-bold text-pink-600">
            📌 제목
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="제목을 입력해 주세요~"
            className="w-full rounded-2xl border-2 border-pink-100 bg-white px-4 py-2.5 text-sm text-gray-700 placeholder-pink-300 transition focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
          />
        </div>

        {/* 📸 파일 선택 */}
        <div>
          <label className="mb-1 block text-xs font-bold text-purple-600">
            🖼️ 내 컴퓨터에서 GIF / 사진 선택하기 (움짤 가능! ✨)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-xs text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-purple-100 file:px-4 file:py-2 file:text-xs file:font-bold file:text-purple-600 hover:file:bg-purple-200 cursor-pointer"
          />

          {previewUrl && (
            <div className="mt-4 flex flex-col items-center">
              <p className="mb-2 text-[11px] font-bold text-purple-400">
                ✨ 선택한 GIF / 사진 미리보기
              </p>
              <img
                src={previewUrl}
                alt="선택한 GIF 미리보기"
                className="max-h-52 rounded-2xl border-2 border-dashed border-purple-300 object-cover shadow-sm"
              />
            </div>
          )}
        </div>

        {/* 내용 */}
        <div>
          <label className="mb-1 block text-xs font-bold text-pink-600">
            📝 내용
          </label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={8}
            placeholder="어떤 이야기를 공유하고 싶으신가요? 🌸"
            className="w-full rounded-2xl border-2 border-pink-100 bg-white px-4 py-3 text-sm text-gray-700 placeholder-pink-300 transition focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100 resize-none"
          />
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-end gap-3 pt-2">
          <Link
            to="/"
            className="rounded-full border-2 border-gray-200 bg-white px-5 py-2 text-xs font-bold text-gray-500 hover:bg-gray-50 transition"
          >
            취소
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-gradient-to-r from-pink-400 to-purple-400 px-6 py-2 text-xs font-bold text-white shadow-md hover:from-pink-500 hover:to-purple-500 hover:shadow-lg transition disabled:opacity-50"
          >
            {submitting ? "등록 중... 💌" : "등록하기 ✨"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BoardWrite;
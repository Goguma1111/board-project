import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getBoard, updateBoard } from "../api/boardApi";

function BoardEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: "", writer: "", content: "" });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
      const { title, writer, content, imageUrl, fileUrl } = response.data;
      setForm({ title, writer: writer ?? "", content });

      // 🌸 1. 기존 이미지 경로 처리 (http로 시작 안 하면 백엔드 주소 붙이기)
      const path = imageUrl || fileUrl;
      if (path) {
        const fullUrl = path.startsWith("http")
          ? path
          : `http://localhost:8081${path}`;
        setPreviewUrl(fullUrl);
      }
    } catch (err) {
      console.error(err);
      setError("😿 게시글을 불러오는 중 오류가 발생했어요.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 📸 수정할 GIF / 이미지 파일 선택 처리
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url); // 새 파일 선택 시 미리보기 교체
    }
  };

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

      // 🌸 2. 백엔드 매개변수 명에 맞춰 "file" 키로 추가
      if (file) {
        formData.append("file", file);
      }

      await updateBoard(id, formData);
      navigate(`/boards/${id}`);
    } catch (err) {
      console.error(err);
      setError("😿 게시글 수정 중 오류가 발생했어요.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs font-bold text-pink-400 animate-pulse">
        이야기를 다듬는 중이에요... ✏️🌸
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {/* 🎀 귀여운 헤더 */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-black text-pink-500 tracking-wide">
          ✏️ 몽글몽글 글 수정하기 ✨
        </h1>
        <p className="mt-1 text-xs text-purple-400">
          소중한 이야기를 더 예쁘게 고쳐볼까요?
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

        {/* 작성자 (고정/읽기전용) */}
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

        {/* 📸 GIF / 이미지 파일 수정 영역 */}
        <div>
          <label className="mb-1 block text-xs font-bold text-purple-600">
            🖼️ GIF / 사진 변경하기 (선택)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-xs text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-purple-100 file:px-4 file:py-2 file:text-xs file:font-bold file:text-purple-600 hover:file:bg-purple-200 cursor-pointer"
          />

          {/* 💡 기존 또는 새로 첨부된 GIF 미리보기 */}
          {previewUrl && (
            <div className="mt-4 flex flex-col items-center">
              <p className="mb-2 text-[11px] font-bold text-purple-400">
                ✨ 현재 설정된 GIF / 이미지
              </p>
              <img
                src={previewUrl}
                alt="미리보기"
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
            placeholder="내용을 수정해 보세요 🌸"
            className="w-full rounded-2xl border-2 border-pink-100 bg-white px-4 py-3 text-sm text-gray-700 placeholder-pink-300 transition focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100 resize-none"
          />
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-end gap-3 pt-2">
          <Link
            to={`/boards/${id}`}
            className="rounded-full border-2 border-gray-200 bg-white px-5 py-2 text-xs font-bold text-gray-500 hover:bg-gray-50 transition"
          >
            취소
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-gradient-to-r from-pink-400 to-purple-400 px-6 py-2 text-xs font-bold text-white shadow-md hover:from-pink-500 hover:to-purple-500 hover:shadow-lg transition disabled:opacity-50"
          >
            {submitting ? "수정 중... 💌" : "수정 완료 ✨"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BoardEdit;
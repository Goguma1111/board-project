import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import FortuneModal from './FortuneModal'; // 💡 포춘쿠키 모달 임포트

export default function MongleChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [showFortune, setShowFortune] = useState(false); // 💡 포춘쿠키 모달 상태 추가
  const [messages, setMessages] = useState([
    {
      sender: 'mongle',
      text: '안녕! 나는 몽글이 🌸\n오늘 무슨 일 있었어? 고민이나 나누고 싶은 이야기를 편하게 들려줘! ✨',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // 메시지 추가 시 자동 스크롤 하단 이동
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');

    // 유저 메시지 추가
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    try {
      // 백엔드 AI 컨트롤러 호출
      const response = await axios.post('http://localhost:8081/api/ai/counsel', {
        message: userMsg,
      });

      const reply = response.data.reply;
      setMessages((prev) => [...prev, { sender: 'mongle', text: reply }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'mongle',
          text: '몽글이가 구름 뒤에 잠시 숨었나 봐 ☁️ 다시 이야기해 줄래?',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        {/* 1. 채팅 열기 버튼 */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 bg-pink-300 hover:bg-pink-400 text-white font-bold px-4 py-3 rounded-full shadow-lg transition-all transform hover:scale-105"
          >
            <span className="text-xl">🌸</span>
            <span>몽글이와 고민상담</span>
          </button>
        )}

        {/* 2. 채팅 창 */}
        {isOpen && (
          <div className="w-80 sm:w-96 h-[480px] bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-pink-200 flex flex-col overflow-hidden transition-all">
            {/* 헤더 */}
            <div className="bg-pink-300 text-white p-4 flex justify-between items-center font-bold">
              <div className="flex items-center gap-2">
                <span className="text-2xl">☁️</span>
                <span>몽글이 고민상담소 🌸</span>
              </div>
              
              <div className="flex items-center gap-2">
                {/* 💡 포춘쿠키 버튼 추가! */}
                <button
                  onClick={() => setShowFortune(true)}
                  className="bg-white/30 hover:bg-white/40 text-white text-xs px-2.5 py-1 rounded-full transition-all flex items-center gap-1 shadow-sm border border-white/40"
                >
                  <span>🥠</span>
                  <span>포춘쿠키</span>
                </button>

                {/* 닫기 버튼 */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-pink-400 w-7 h-7 rounded-full flex items-center justify-center transition-colors text-sm"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* 대화 내용 영역 */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-pink-50/30">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl whitespace-pre-line text-sm leading-relaxed shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-pink-300 text-white rounded-br-none'
                        : 'bg-white text-gray-700 border border-pink-100 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* 로딩 표시 */}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white text-pink-400 p-3 rounded-2xl rounded-bl-none text-sm border border-pink-100 flex items-center gap-1 shadow-sm">
                    <span>몽글이가 생각 중이에요...</span>
                    <span className="animate-bounce">💭</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* 입력 폼 */}
            <form
              onSubmit={handleSend}
              className="p-3 bg-white border-t border-pink-100 flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="고민이나 하고 싶은 말을 적어봐요..."
                className="flex-1 px-4 py-2 bg-pink-50/50 border border-pink-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-pink-300 hover:bg-pink-400 text-white font-bold px-4 py-2 rounded-full text-sm transition-colors disabled:opacity-50"
              >
                보내기
              </button>
            </form>
          </div>
        )}
      </div>

      {/* 💡 포춘쿠키 모달 */}
      {showFortune && <FortuneModal onClose={() => setShowFortune(false)} />}
    </>
  );
}
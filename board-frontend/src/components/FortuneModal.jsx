import React, { useState } from 'react';
import axios from 'axios';
import './FortuneModal.css'; // 아래 CSS 파일도 함께 만들어주세요!

function FortuneModal({ onClose }) {
  const [fortune, setFortune] = useState('');
  const [isCracked, setIsCracked] = useState(false); // 쿠키가 깨졌는지 여부
  const [loading, setLoading] = useState(false);

  // 포춘쿠키 깨기 클릭 핸들러
  const handleCookieClick = async () => {
    if (isCracked || loading) return;

    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8081/api/ai/fortune');
      setFortune(res.data.fortune);
      setIsCracked(true); // 쿠키 쪼개기 애니메이션 시작!
    } catch (error) {
      console.error("포춘쿠키 뽑기 실패:", error);
      setFortune("🥠 오늘은 무조건 기분 좋은 일만 가득할 거예요! 🌸");
      setIsCracked(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="fortune-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        
        <h2>🌸 몽글 포춘쿠키 🌸</h2>
        <p className="sub-title">쿠키를 클릭해서 바삭! 깨뜨려보세요!</p>

        {/* 쿠키 애니메이션 영역 */}
        <div className="cookie-container" onClick={handleCookieClick}>
          {!isCracked ? (
            <div className={`cookie-whole ${loading ? 'shake' : ''}`}>
              🥠
            </div>
          ) : (
            <div className="cookie-cracked">
              <span className="cookie-left">🥠</span>
              <span className="cookie-right">🥠</span>
            </div>
          )}
        </div>

        {/* 로딩 표시 */}
        {loading && <p className="loading-text">바삭! 포춘쿠키를 여는 중... ✨</p>}

        {/* 운세 결과 종이 (쿠키가 깨지면 등장) */}
        {isCracked && (
          <div className="fortune-paper">
            <p className="fortune-text">{fortune}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FortuneModal;
'use client';

import { useState } from 'react';

const BG = '#101728';
const CARD_BG = '#181f2b';
const ACCENT = '#FFD700';
const TEXT = '#fff';

export default function PasswordModal({ isOpen, onClose, onPasswordSubmit }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // 비밀번호 (실제 운영시에는 환경변수나 서버에서 관리)
  const CORRECT_PASSWORD = 'fobit2024';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (password === CORRECT_PASSWORD) {
      // 세션 스토리지에 인증 상태 저장
      sessionStorage.setItem('fobit_authenticated', 'true');
      onPasswordSubmit(true);
      onClose();
    } else {
      setError('비밀번호가 올바르지 않습니다.');
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      fontFamily: 'Pretendard, sans-serif'
    }}>
      <div style={{
        backgroundColor: CARD_BG,
        borderRadius: 20,
        padding: 40,
        maxWidth: 400,
        width: '90%',
        boxShadow: '0 0 30px rgba(255, 215, 0, 0.3)',
        border: '2px solid rgba(255, 215, 0, 0.2)'
      }}>
        {/* 제목 */}
        <h2 style={{
          color: ACCENT,
          fontSize: 24,
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: 20
        }}>
          🔐 포비트 프리미엄 접근
        </h2>

        {/* 설명 */}
        <p style={{
          color: TEXT,
          fontSize: 16,
          textAlign: 'center',
          marginBottom: 30,
          lineHeight: 1.5
        }}>
          비트코인 외 모든 코인 정보를 보려면<br/>
          비밀번호를 입력해주세요.
        </p>

        {/* 비밀번호 입력 폼 */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              style={{
                width: '100%',
                padding: '15px 20px',
                fontSize: 16,
                backgroundColor: BG,
                border: '2px solid #555',
                borderRadius: 10,
                color: TEXT,
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = ACCENT}
              onBlur={(e) => e.target.style.borderColor = '#555'}
              autoFocus
            />
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div style={{
              color: '#FF4760',
              fontSize: 14,
              textAlign: 'center',
              marginBottom: 20
            }}>
              {error}
            </div>
          )}

          {/* 버튼들 */}
          <div style={{
            display: 'flex',
            gap: 15,
            justifyContent: 'center'
          }}>
            <button
              type="button"
              onClick={handleClose}
              style={{
                padding: '12px 24px',
                backgroundColor: 'transparent',
                border: '2px solid #555',
                borderRadius: 8,
                color: '#ccc',
                fontSize: 16,
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#777';
                e.target.style.color = TEXT;
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#555';
                e.target.style.color = '#ccc';
              }}
            >
              취소
            </button>
            <button
              type="submit"
              style={{
                padding: '12px 24px',
                backgroundColor: ACCENT,
                border: 'none',
                borderRadius: 8,
                color: '#000',
                fontSize: 16,
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.opacity = '0.8'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              확인
            </button>
          </div>
        </form>

        {/* 안내 메시지 */}
        <div style={{
          marginTop: 20,
          padding: 15,
          backgroundColor: 'rgba(255, 215, 0, 0.1)',
          borderRadius: 10,
          border: '1px solid rgba(255, 215, 0, 0.3)'
        }}>
          <p style={{
            color: '#ccc',
            fontSize: 14,
            textAlign: 'center',
            margin: 0,
            lineHeight: 1.4
          }}>
            💡 비밀번호는 우측상단 '포비트 무료신청' 메뉴에서<br/>
            받으실 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}

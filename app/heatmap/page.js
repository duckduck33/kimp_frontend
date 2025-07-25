'use client';

import React, { useState } from 'react';
import NavBar from '../../components/NavBar';
import RSIPlotChart from '../../components/RSIPlotChart';
import TradingViewChart from '../../components/TradingViewChart';

export default function HeatmapPage() {
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  // 1. 모달의 열림/닫힘 상태를 관리할 state 추가
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ❗ 여기에 본인의 바이비트 래퍼럴 링크를 넣어주세요.
  const myBybitReferralLink = 'https://www.bybit.com/invite?ref=WEWQQG%230';

  return (
    <main style={{ backgroundColor: '#101218', minHeight: '100vh', fontFamily: 'Pretendard, sans-serif' }}>
      <NavBar />
      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '1rem 2rem' }}>
        <h1 className="text-3xl font-bold text-center mt-10 mb-10" style={{ color: 'white' }}>
          RSI 히트맵 (바이비트 거래대금30위 코인)
        </h1>
        
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-end' }}>
          {/* 왼쪽 영역 */}
          <div style={{ flex: 1.5, height: '700px' }}>
            <RSIPlotChart onSymbolClick={setSelectedSymbol} />
          </div>

          {/* 오른쪽 영역 */}
          <div style={{ flex: 1, height: '500px', paddingBottom: '20px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
            {selectedSymbol && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', flexShrink: 0 }}>
                  <h2 style={{ color: 'white', fontSize: '1.5rem', margin: 0 }}>
                    {selectedSymbol} Chart
                  </h2>
                  {/* 2. 기존 a 태그를 모달을 여는 button으로 변경 */}
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    style={{ 
                      color: '#facc15', 
                      backgroundColor: 'transparent',
                      border: '1px solid #facc15',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(250, 204, 21, 0.1)'}
                    onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    거래소로 이동 ↗
                  </button>
                </div>
                
                <div style={{ flexGrow: 1 }}>
                  <TradingViewChart key={selectedSymbol} symbol={selectedSymbol} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 3. 모달 UI (isModalOpen이 true일 때만 보임) */}
      {isModalOpen && (
        <div 
          onClick={() => setIsModalOpen(false)} // 배경 클릭 시 닫기
          style={{ 
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
          }}
        >
          {/* 모달 내용 클릭 시 닫히지 않도록 이벤트 전파 방지 */}
          <div onClick={(e) => e.stopPropagation()} style={{ background: '#1f2937', padding: '2rem', borderRadius: '8px', color: 'white', textAlign: 'center' }}>
            <h3 style={{ marginTop: 0, fontSize: '1.5rem' }}>바이비트 계정이 있으신가요?</h3>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <a href={`https://www.bybit.com/trade/usdt/${selectedSymbol}`} target="_blank" rel="noopener noreferrer" style={{ ...modalButtonStyle, backgroundColor: '#3b82f6' }}>
                네, 거래소로 이동
              </a>
              <a href={myBybitReferralLink} target="_blank" rel="noopener noreferrer" style={{ ...modalButtonStyle, backgroundColor: '#22c55e' }}>
                아니요, 가입하기 (혜택)
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// 모달 버튼 스타일 (중복 방지)
const modalButtonStyle = {
  color: 'white',
  textDecoration: 'none',
  padding: '12px 24px',
  borderRadius: '6px',
  fontWeight: 'bold',
  transition: 'opacity 0.2s'
};
'use client';

import React, { useState } from 'react';
import NavBar from '../../components/NavBar';
import RSIPlotChart from '../../components/RSIPlotChart';
import TradingViewChart from '../../components/TradingViewChart';

export default function HeatmapPage() {
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');

  return (
    <main style={{ backgroundColor: '#101218', minHeight: '100vh', fontFamily: 'Pretendard, sans-serif' }}>
      <NavBar />
      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '1rem 2rem' }}>
        <h1 className="text-3xl font-bold text-center mt-10 mb-10" style={{ color: 'white' }}>
          RSI 히트맵 (바이비트 거래대금30위 코인)
        </h1>
        
        {/* 1. alignItems를 다시 'flex-end'로 변경 */}
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-end' }}>
          
          {/* 왼쪽 영역 (RSI 차트) */}
          <div style={{ flex: 1.5, height: '700px' }}>
            <RSIPlotChart onSymbolClick={setSelectedSymbol} />
          </div>

          {/* 오른쪽 영역 (트레이딩뷰 차트) */}
          <div style={{ 
            flex: 1, 
            height: '500px', 
            // 2. 하단 여백 20px 추가 및 box-sizing 설정
            paddingBottom: '20px',
            boxSizing: 'border-box' 
          }}>
            {selectedSymbol && <TradingViewChart key={selectedSymbol} symbol={selectedSymbol} />}
          </div>

        </div>
      </div>
    </main>
  );
}
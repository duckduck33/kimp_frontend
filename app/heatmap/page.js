'use client';

import NavBar from '../../components/NavBar'; // 기존 네비게이션 바
import RSIPlotChart from '../../components/RSIPlotChart'; // 우리가 만든 차트 컴포넌트

export default function HeatmapPage() {
  return (
    <>
      <NavBar />
      <div
        style={{
          minHeight: 'calc(100vh - 64px)', // 최소 높이 설정
          backgroundColor: '#101728',
          fontFamily: 'Pretendard, sans-serif',
          padding: '2rem', // 차트 주변에 여백 추가
        }}
      >
        <h1 style={{ color: 'white', fontSize: '2rem', marginBottom: '1.5rem' }}>
          RSI Chart
        </h1>
        <RSIPlotChart />
      </div>
    </>
  );
}
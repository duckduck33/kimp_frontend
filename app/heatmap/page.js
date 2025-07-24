'use client';

import NavBar from '../../components/NavBar';
import RSIPlotChart from '../../components/RSIPlotChart';

export default function HeatmapPage() {
  return (
    // 페이지 전체를 감싸는 main 태그
    <main style={{ backgroundColor: '#101728', minHeight: '100vh', fontFamily: 'Pretendard, sans-serif' }}>
      
      {/* 1. NavBar를 가장 먼저 렌더링 */}
      <NavBar />
      
      {/* NavBar 아래에 위치할 컨텐츠 영역 */}
      <div style={{ padding: '1rem 2rem' }}>
        
        {/* 2. 클래스명을 사용한 제목 스타일링 */}
        <h1 className="text-3xl font-bold text-center mt-10 mb-10" style={{ color: 'white' }}>
          RSI 히트맵 (바이비트 거래대금30위 코인)
        </h1>

        {/* 3. 차트 컴포넌트 */}
        <RSIPlotChart />
        
      </div>

    </main>
  );
}
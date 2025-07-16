'use client';

import NavBar from '../../components/NavBar'; // 반드시 맨 위에 import!

export default function HomePage() {
  return (
    <>
      <NavBar />
      <div
        style={{
          height: 'calc(100vh - 64px)', // NavBar 높이만큼 빼기 (적절히 조정)
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#fff',
          backgroundColor: '#101728',
          fontFamily: 'Pretendard, sans-serif',
          gap: '1.5rem',  // 버튼과 텍스트 간격
          padding: '0 20px',
          textAlign: 'center',
        }}
      >
        {/* 버튼 */}
        <a
          href="https://goldentime-production-ecbc.up.railway.app/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: '#FFD700',
            color: '#000',
            padding: '12px 24px',
            borderRadius: '8px',
            fontWeight: '700',
            fontSize: '1.5rem',
            textDecoration: 'none',
            boxShadow: '0 3px 6px rgba(0,0,0,0.3)',
            cursor: 'pointer',
          }}
        >
          바이비트 자동매매 보러가기
        </a>

        {/* 설명 텍스트 */}
        자동매매플랫폼은 현재 바이비트 거래소와 연동되었고, 향후 빙엑스, 오케이엑스 거래소도 연동할 계획입니다.
      </div>
    </>
  );
}

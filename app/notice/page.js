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
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#fff',
          backgroundColor: '#101728',
          fontFamily: 'Pretendard, sans-serif',
        }}
      >
        업비트를 비롯한 국내외 거래소의 상장공지, 거래유의공지를 실시간으로 모니터링하여 매매에 활용할 수 있도록 개발하고 있습니다
      </div>
    </>
  );
}

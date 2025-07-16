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
        포비트가 직접 개발한 수익률 TOP10 지표를 업로드할 예정입니다. 
      </div>
    </>
  );
}

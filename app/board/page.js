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
          padding: '20px',
        }}
      >
        <div className="desc-text">
          포비트채널에서 소개한 지표&매매법 게시판입니다.
        </div>

        {/* 티스토리 블로그 카테고리 작은 창 형태로 삽입 (1번 방법: iframe) */}
        <div
          style={{
            width: '320px',
            height: '480px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            overflow: 'hidden',
            marginTop: '20px'
          }}
        >
          <iframe
            src="https://gongnam.tistory.com/category/%EC%A7%80%ED%91%9C%26%EB%A7%A4%EB%A7%A4%EB%B2%95"
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="auto"
          />
        </div>
      </div>
    </>
  );
}

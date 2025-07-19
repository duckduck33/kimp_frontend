'use client';

import NavBar from '../../components/NavBar'; // 반드시 맨 위에 import!

export default function HomePage() {
  return (
    <main>
      <NavBar />
      <div
        style={{
          height: 'calc(100vh - 64px)', // NavBar 높이만큼 빼기
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
          포비트채널에서 소개한 지표&매매법 게시판입니다.(*자료 유출문제로 칼럼비번은 우측상단의 '포비트무료신청'메뉴에서 통해서 받으실 수 있습니다.)
        </div>

        {/* 티스토리 블로그 카테고리 창을 NavBar 아래 남은 영역 가득 채우기 */}
        <div
          style={{
            flex: 1,
            position: 'relative',
            width: '100%',
            border: '1px solid #ddd',
            borderRadius: '4px',
            overflow: 'hidden',
            marginTop: '20px',
            background: '#fff', // 부모도 흰색!
          }}
        >
          <iframe
            src="https://gongnam.tistory.com/category/%EC%A7%80%ED%91%9C%26%EB%A7%A4%EB%A7%A4%EB%B2%95"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
              background: '#fff', // 이 부분도 혹시 몰라 추가
            }}
            scrolling="auto"
            title="티스토리게시판"
          />
        </div>
      </div>
    </main>
  );
}

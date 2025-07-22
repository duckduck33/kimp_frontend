'use client';

import NavBar from '../../components/NavBar'; // 반드시 맨 위에 import!

export default function HomePage() {
  return (
    <main>
      <NavBar />
      <div
        style={{
          height: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#101728',
          fontFamily: 'Pretendard, sans-serif',
          padding: '20px',
        }}
      >
        {/* 💡 desc-text만 별도 블록! */}
        <div style={{ width: "100%", maxWidth: 800 }}>
          <div className="desc-text" style={{ textAlign: "center", lineHeight: 1.8, marginBottom: 20 }}>
            <div style={{ color: '#47eaff', fontWeight: 500 }}>
              *자료 유출문제로 칼럼비번은 우측상단의 ‘포비트무료신청’ 메뉴에서 받으실 수 있습니다.
            </div>
            <div style={{ height: 4 }} /> {/* 여백용, 필요시 조절 */}
            <div style={{ color: "#fff", fontWeight: 600 }}>
              칼럼 비번을 받으신 후&nbsp;
              <a
                href="https://gongnam.tistory.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#7bdfff", textDecoration: "underline", fontWeight: "bold" }}
              >
                https://gongnam.tistory.com/
              </a>
              &nbsp;링크로 들어오셔서 읽으실 수 있습니다.
            </div>
          </div>
        </div>

        {/* 아래는 그대로 */}
        <div
          style={{
            flex: 1,
            position: 'relative',
            width: '100%',
            border: '1px solid #ddd',
            borderRadius: '4px',
            overflow: 'hidden',
            marginTop: '20px',
            background: '#fff',
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
              background: '#fff',
            }}
            scrolling="auto"
            title="티스토리게시판"
          />
        </div>
      </div>
    </main>
  );
}

'use client';

import NavBar from '../../components/NavBar';

export default function HomePage() {
  return (
    <main>
      <NavBar />
      {/* 안내문: 전체 흰색, 링크만 강조 */}
      <div
        style={{
          width: "100%",
          background: "#101728",
          padding: "24px 0 16px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{
          color: '#fff', // 전체 흰색
          fontWeight: 500,
          fontSize: "1.08rem",
          lineHeight: 1.7,
          textAlign: "center",
          marginBottom: 4,
          wordBreak: "keep-all"
        }}>
          *자료 유출문제로 칼럼비번은 우측상단의 ‘포비트무료신청’ 메뉴에서 받으실 수 있습니다.
        </div>
        <div style={{
          color: "#fff", // 전체 흰색
          fontWeight: 600,
          fontSize: "1.08rem",
          textAlign: "center",
          wordBreak: "keep-all"
        }}>
          칼럼 비번을 받으신 후&nbsp;
          <a
            href="https://gongnam.tistory.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#7bdfff", // 링크만 강조
              textDecoration: "underline",
              fontWeight: "bold"
            }}
          >
            https://gongnam.tistory.com/
          </a>
          &nbsp;링크로 들어오셔서 읽으실 수 있습니다.
        </div>
      </div>

      {/* 티스토리 블로그 카테고리 창 */}
      <div
        style={{
          height: 'calc(100vh - 64px - 80px)', // NavBar와 안내문 높이 감안
          position: 'relative',
          width: '100%',
          border: '1px solid #ddd',
          borderRadius: '4px',
          overflow: 'hidden',
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
    </main>
  );
}

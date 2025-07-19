'use client';

import NavBar from '../../components/NavBar'; // 반드시 맨 위에 import!
import Parser from 'rss-parser';

export default async function BoardPage() {
  const parser = new Parser();
  const feed = await parser.parseURL(
    'https://gongnam.tistory.com/category/%EC%A7%80%ED%91%9C%26%EB%A7%A4%EB%A7%A4%EB%B2%95/rss'
  );

  return (
    <>
      <NavBar />
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          margin: '40px auto',
          background: '#232836',
          borderRadius: 8,
          padding: 24,
          color: '#fff',
        }}
      >
        <h3 style={{ margin: 0, fontWeight: 700 }}>최신 게시글</h3>
        <ul style={{ listStyle: 'none', padding: 0, marginTop: 20 }}>
          {feed.items.slice(0, 7).map(item => (
            <li key={item.link} style={{ margin: '18px 0' }}>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#7bdfff',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '1.1rem'
                }}
              >
                {item.title}
              </a>
              <div style={{ fontSize: '0.92rem', color: '#bbb', marginTop: 3 }}>
                {item.pubDate && new Date(item.pubDate).toLocaleDateString()}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

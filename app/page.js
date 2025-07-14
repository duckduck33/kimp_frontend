'use client';

import { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';


// const WS_URL =
//   process.env.NEXT_PUBLIC_WS_URL ||
//   'ws://144.24.75.165:8000/ws/kimp'; // 여기에 Oracle 서버의 공인 IP와 백엔드 포트 8000을 사용


// const WS_URL = 'ws://localhost:8000/ws/kimp'; // FastAPI WS 엔드포인트
const WS_URL = "wss://kimp-backend.onrender.com/ws/kimp"; // FastAPI WS 엔드포인트
// const WS_URL = "ws://144.24.75.165:8000/ws/kimp"; // FastAPI WS 엔드포인트


export default function HomePage() {
  // 서버로부터 받은 시세/김프 데이터를 저장하는 상태
  const [coins, setCoins] = useState([]);
  // 환율을 저장하는 상태
  const [exchangeRate, setExchangeRate] = useState(null);

  // WebSocket 훅: 자동 재연결 설정
  const { lastMessage, readyState } = useWebSocket(WS_URL, {
    shouldReconnect: () => true,       // 끊어져도 무한 재연결
    reconnectAttempts: Infinity,       // 재시도 횟수 무제한
    reconnectInterval: 3000,           // 3초마다 재연결 시도
  });

  // 메시지 수신 시 JSON 파싱 후 상태 업데이트
  useEffect(() => {
    if (lastMessage?.data) {
      try {
        const data = JSON.parse(lastMessage.data);
        if (data.exchange_rate && data.coin_data) {
          setExchangeRate(data.exchange_rate);
          setCoins(data.coin_data);
        } else {
          console.error('수신된 데이터 형식이 예상과 다릅니다:', data);
        }
      } catch (e) {
        console.error('데이터 파싱 오류:', e);
      }
    }
  }, [lastMessage]);

  return (
    <main
      style={{
        padding: '2rem',
        backgroundColor: '#101728',
        minHeight: '100vh',
        color: '#fff',
        fontFamily: 'Pretendard, sans-serif',
      }}
    >
      {/* 환율 표시 */}
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', textAlign: 'left' }}>
        테더환율: {exchangeRate ? `${exchangeRate.toFixed(2)} KRW/USDT` : '불러오는 중...'}
      </h2>

      {/* 페이지 제목 */}
      <h1 style={{ fontSize: '2.2rem', marginBottom: '1rem', textAlign: 'center' }}>
        실시간 김프(업비트 ↔ 바이비트)
      </h1>

      {/* 테이블 래퍼: 가로 스크롤 시에도 레이아웃 깨지지 않도록 */}
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: 700,
            backgroundColor: '#181f2b',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#232d3f' }}>
              <th style={thStyle}>코인</th>
              <th style={thStyle}>업비트(KRW)</th>
              <th style={thStyle}>바이비트(USDT)</th>
              <th style={thStyle}>바이비트(KRW 환산)</th>
              <th style={thStyle}>김프(%)</th>
            </tr>
          </thead>
          <tbody>
            {coins.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '1rem' }}>
                  데이터 수신 대기중...
                </td>
              </tr>
            ) : (
              coins.map((row) => (
                <tr key={row.coin}>
                  <td style={tdStyle}>{row.coin}</td>
                  <td style={tdStyle}>
                    {row.upbit_krw?.toLocaleString() ?? '—'} KRW
                  </td>
                  <td style={tdStyle}>
                    {row.bybit_usdt
                      ? row.bybit_usdt.toLocaleString(undefined, {
                          minimumFractionDigits: 4,
                          maximumFractionDigits: 8,
                        })
                      : '—'}{' '}
                    USDT
                  </td>
                  <td style={tdStyle}>
                    {row.bybit_krw?.toLocaleString() ?? '—'} KRW
                  </td>
                  <td
                    style={{
                      ...tdStyle,
                      color:
                        row.kimp_percent < 0
                          ? '#FF4760'
                          : row.kimp_percent > 0
                          ? '#42f579'
                          : '#fff',
                    }}
                  >
                    {row.kimp_percent?.toFixed(2) ?? '—'}%
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* WebSocket 연결 상태 및 실제 사용하는 URL 표시 */}
      <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#888' }}>
        <p>
          WebSocket 연결 상태:{' '}
          {readyState === 1 ? '연결됨' : '연결 중'} ({readyState})
        </p>
        <p>WS_URL: {WS_URL}</p>
      </div>

      {/* 우측 상단 고정 문의 버튼 */}
      <a
        href="http://pf.kakao.com/_xlLxcfxj/chat"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#FFEB00',
          color: '#000',
          padding: '12px 16px',
          borderRadius: '4px',
          fontWeight: 'bold',
          textDecoration: 'none',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        }}
      >
        잠코딩개발문의
      </a>
    </main>
  );
}

// 테이블 헤더 스타일
const thStyle = {
  padding: '0.7rem',
  border: '1px solid #303952',
  fontWeight: 'bold',
  textAlign: 'center',
};

// 테이블 셀 스타일
const tdStyle = {
  padding: '0.6rem',
  border: '1px solid #232d3f',
  textAlign: 'center',
  fontSize: '1rem',
};
'use client';

import { useEffect, useState, useRef } from 'react';
import useWebSocket from 'react-use-websocket';
import NavBar from '../components/NavBar'; // 반드시 맨 위에 import!

// WebSocket 주소
const WS_URL = "wss://kimp-backend.onrender.com/ws/kimp";

// 코인별 트레이딩뷰 심볼 (바이비트 기준)
const symbolMap = {
  BTC: 'BYBIT:BTCUSDT',
  ETH: 'BYBIT:ETHUSDT',
  XRP: 'BYBIT:XRPUSDT',
  BCH: 'BYBIT:BCHUSDT',
  SOL: 'BYBIT:SOLUSDT',
  DOGE: 'BYBIT:DOGEUSDT',
  AAVE: 'BYBIT:AAVEUSDT',
  ADA: 'BYBIT:ADAUSDT',
};

// 트레이딩뷰 차트 위젯 컴포넌트
function TradingViewChart({ symbol }) {
  const ref = useRef();

  useEffect(() => {
    if (!symbol) return;
    ref.current.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: false,
      height: 420,
      width: "100%",
      symbol: symbol,
      interval: "15",
      timezone: "Asia/Seoul",
      theme: "dark",
      style: "1",
      locale: "kr",
      toolbar_bg: "#181f2b",
      enable_publishing: false,
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      studies: [],
      container_id: "tradingview_chart_container"
    });
    ref.current.appendChild(script);
  }, [symbol]);

  return (
    <div
      id="tradingview_chart_container"
      ref={ref}
      style={{
        width: '100%',
        height: 420,
        maxWidth: 1000,
        margin: '40px auto 0 auto',
        background: '#181f2b',
        borderRadius: 12,
        boxShadow: '0 2px 16px rgba(0,0,0,0.2)'
      }}
    />
  );
}

export default function HomePage() {
  // 상태 관리
  const [coins, setCoins] = useState([]);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [selectedCoin, setSelectedCoin] = useState('BTC'); // 기본 선택

  // WebSocket 연결
  const { lastMessage, readyState } = useWebSocket(WS_URL, {
    shouldReconnect: () => true,
    reconnectAttempts: Infinity,
    reconnectInterval: 3000,
  });

  // 데이터 수신 처리
  useEffect(() => {
    if (lastMessage?.data) {
      try {
        const data = JSON.parse(lastMessage.data);
        if (data.exchange_rate && data.coin_data) {
          setExchangeRate(data.exchange_rate);
          setCoins(data.coin_data);
        }
      } catch (e) {
        console.error('데이터 파싱 오류:', e);
      }
    }
  }, [lastMessage]);

  return (
    <>

      <main
        style={{
          padding: '2rem',
          backgroundColor: '#101728',
          minHeight: '100vh',
          color: '#fff',
          fontFamily: 'Pretendard, sans-serif',
        }}
      >
      <NavBar /> {/* 여기! 상단 메뉴 항상 노출 */}

        {/* 환율 표시 */}
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', textAlign: 'left' }}>
          테더환율: {exchangeRate ? `${exchangeRate.toFixed(2)} KRW/USDT` : '불러오는 중...'}
        </h2>

        {/* 페이지 제목 */}
        <h1 style={{ fontSize: '2.2rem', marginBottom: '1rem', textAlign: 'center' }}>
          실시간 김프(업비트 ↔ 바이비트)
        </h1>

        {/* 트레이딩뷰 차트(테이블 아래쪽에 두려면 위치만 옮기면 됨) */}
        <section style={{ margin: '0 auto 2rem auto', maxWidth: 900 }}>
          <TradingViewChart symbol={symbolMap[selectedCoin]} />
        </section>

        {/* 테이블 */}
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
                  <tr
                    key={row.coin}
                    onClick={() => setSelectedCoin(row.coin)}
                    style={{
                      cursor: 'pointer',
                      background: selectedCoin === row.coin ? '#222e41' : undefined,
                      fontWeight: selectedCoin === row.coin ? 'bold' : undefined,
                    }}
                  >
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

        {/* WebSocket 연결 상태 */}
        <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#888' }}>
          <p>
            WebSocket 연결 상태:{' '}
            {readyState === 1 ? '연결됨' : '연결 중'} ({readyState})
          </p>
          <p>WS_URL: {WS_URL}</p>
        </div>


      </main>
    </>
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

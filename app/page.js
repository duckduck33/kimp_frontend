'use client';

import { useEffect, useState, useRef } from 'react';
import useWebSocket from 'react-use-websocket';
import NavBar from '../components/NavBar'; // 반드시 맨 위에 import!
import PasswordModal from '../components/PasswordModal';

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
  
  // 비밀번호 보호 상태
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // WebSocket 연결
  const { lastMessage, readyState } = useWebSocket(WS_URL, {
    shouldReconnect: () => true,
    reconnectAttempts: Infinity,
    reconnectInterval: 3000,
  });

  // 인증 상태 확인 (페이지 로드시)
  useEffect(() => {
    const authStatus = sessionStorage.getItem('fobit_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

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

  // 비밀번호 인증 핸들러
  const handlePasswordSubmit = (success) => {
    if (success) {
      setIsAuthenticated(true);
    }
  };

  // 코인 클릭 핸들러 (비트코인이 아닌 경우 비밀번호 확인)
  const handleCoinClick = (coin) => {
    if (coin === 'BTC' || isAuthenticated) {
      setSelectedCoin(coin);
    } else {
      setShowPasswordModal(true);
    }
  };

  // 필터링된 코인 목록 (비트코인만 무료, 나머지는 인증 필요)
  const getFilteredCoins = () => {
    if (isAuthenticated) {
      return coins; // 인증된 경우 모든 코인 표시
    } else {
      return coins.filter(coin => coin.coin === 'BTC'); // 비트코인만 표시
    }
  };

  // // 페이지 상단 패딩을 동적으로 설정
  // useEffect(() => {
  //   const mainElement = document.querySelector('main');
  //   if (mainElement) {
  //     const navHeight = getComputedStyle(document.documentElement).getPropertyValue('--nav-height');
  //     if (navHeight) {
  //       mainElement.style.paddingTop = `calc(${navHeight} + 20px)`; // 기본 패딩 20px 유지
  //     }
  //   }
  // }, []);




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
          포비트 | 포비트앱 실시간 김프(업비트 ↔ 바이비트) 모니터링
        </h1>
        
        {/* SEO를 위한 숨겨진 텍스트 */}
        <div style={{ display: 'none' }}>
          <h2>포비트 | 포비트앱 암호화폐 자동매매 플랫폼</h2>
          <p>포비트는 업비트와 바이비트 간의 실시간 김프율을 모니터링하여 차익거래 기회를 제공하는 암호화폐 자동매매 플랫폼입니다. 포비트와 포비트앱을 통해 스마트한 암호화폐 투자를 시작하세요.</p>
          <p>포비트 주요 기능: 포비트 실시간 김프 모니터링, 포비트 RSI 히트맵 분석, 포비트 경제캘린더, 포비트 골든타임 자동매매, 포비트 트레이딩뷰 자동매매, 포비트 알트코인 폭등감시봇, 포비트 업비트 상장 감시봇, 포비트 바이낸스 상장폐지 감시봇</p>
          <p>포비트앱 다운로드, 포비트 플랫폼, 포비트 서비스, 포비트 자동매매, 포비트 투자, 포비트 분석도구</p>
        </div>

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
                getFilteredCoins().map((row) => (
                  <tr
                    key={row.coin}
                    onClick={() => handleCoinClick(row.coin)}
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

        {/* 인증되지 않은 경우 안내 메시지 */}
        {!isAuthenticated && (
          <div style={{
            backgroundColor: '#181f2b',
            borderRadius: 15,
            padding: 20,
            margin: '20px auto',
            maxWidth: 600,
            border: '2px solid rgba(255, 215, 0, 0.3)',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#FFD700', marginBottom: 15, fontSize: 18 }}>
              🔒 프리미엄 코인 정보
            </h3>
            <p style={{ color: '#ccc', marginBottom: 20, lineHeight: 1.5 }}>
              비트코인 외 모든 코인 정보를 보려면 비밀번호가 필요합니다.<br/>
              우측상단 '포비트 무료신청' 메뉴에서 비밀번호를 받으세요.
            </p>
            <button
              onClick={() => setShowPasswordModal(true)}
              style={{
                backgroundColor: '#FFD700',
                color: '#000',
                border: 'none',
                borderRadius: 8,
                padding: '12px 24px',
                fontSize: 16,
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'opacity 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.opacity = '0.8'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              비밀번호 입력하기
            </button>
          </div>
        )}

        {/* WebSocket 연결 상태 */}
        <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#888' }}>
          <p>
            WebSocket 연결 상태:{' '}
            {readyState === 1 ? '연결됨' : '연결 중'} ({readyState})
          </p>
          <p>WS_URL: {WS_URL}</p>
        </div>

        {/* 비밀번호 모달 */}
        <PasswordModal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          onPasswordSubmit={handlePasswordSubmit}
        />

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

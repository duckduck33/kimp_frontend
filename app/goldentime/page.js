'use client';
import React, { useState, useEffect, useRef } from 'react';
import NavBar from '../../components/NavBar';
import Chart from 'chart.js/auto';

const API_URL = 'https://script.google.com/macros/s/AKfycby60rsO3sCHiRPv6mqMUQa-u2T0nPGTEles189caRS5KfR8ktZMOlmsBpPo9dNw8CrsiA/exec';
const periods = [
  { label: '6개월', value: '6m' },
  { label: '3개월', value: '3m' },
  { label: '1개월', value: '1m' }
];
const BG = '#101728';
const CARD_BG = '#181f2b';
const ACCENT = '#FFD700';
const TEXT = '#fff';

export default function GoldentimePage() {
  const [coins, setCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState('');
  const [coinData, setCoinData] = useState([]); // 원본 데이터
  const chartRef = useRef();

  // 1. 초기 코인 리스트 불러오기 (type=init)
  useEffect(() => {
    fetch(`${API_URL}?type=init`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          console.error(data.error);
          return;
        }
        // 거래대금순위 리스트로 coins 세팅
        if (data.volumeRankList && data.volumeRankList.length > 0) {
          setCoins(data.volumeRankList);
          setSelectedCoin(data.volumeRankList[0]);
        }
      })
      .catch(console.error);
  }, []);

  // 2. 선택된 코인 변경 시 원본 데이터 요청 (type=coinData)
  useEffect(() => {
    if (!selectedCoin) return;
    fetch(`${API_URL}?type=coinData&name=${encodeURIComponent(selectedCoin)}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          console.error(data.error);
          setCoinData([]);
          return;
        }
        // data는 2차원 배열로 날짜, 시간, 고가, 저가, 시가, 종가 형태
        setCoinData(data);
      })
      .catch(err => {
        console.error(err);
        setCoinData([]);
      });
  }, [selectedCoin]);

  // 3. 차트 그리기 (예시로 시간별 종가 차트)
  useEffect(() => {
    if (!chartRef.current || coinData.length < 2) return;
    chartRef.current.innerHTML = '';
    const canvas = document.createElement('canvas');
    chartRef.current.appendChild(canvas);

    // 데이터 가공 (헤더 제외, 시간 및 종가)
    const labels = coinData.slice(1).map(row => `${row[0]} ${row[1]}시`);
    const prices = coinData.slice(1).map(row => row[5]);

    new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: `${selectedCoin} 시가/종가 중 종가`,
          data: prices,
          borderColor: ACCENT,
          backgroundColor: 'rgba(255, 214, 0, 0.3)',
          fill: true,
          tension: 0.1,
          pointRadius: 0,
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: TEXT } } },
        scales: {
          x: { ticks: { color: TEXT } },
          y: { ticks: { color: TEXT } }
        }
      }
    });
  }, [coinData, selectedCoin]);

  return (
    <main style={{
      background: BG,
      minHeight: '100vh',
      color: TEXT,
      fontFamily: 'Pretendard,sans-serif',
      padding: 0,
    }}>
      <NavBar />
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
          zIndex: 9999
        }}
      >
        잠코딩개발문의
      </a>
      <div style={{
        margin: '50px auto 0 auto',
        background: CARD_BG,
        borderRadius: 18,
        boxShadow: '0 2px 18px rgba(0,0,0,0.20)',
        padding: '38px 38px 32px 38px',
        maxWidth: 700,
        minWidth: 370,
        minHeight: 640,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* 코인 버튼 */}
        <div style={{ display: 'flex', gap: 14, marginBottom: 18, flexWrap: 'wrap' }}>
          {coins.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCoin(c)}
              style={{
                padding: '7px 26px',
                border: 'none',
                borderRadius: 12,
                background: selectedCoin === c ? ACCENT : '#232d3f',
                color: selectedCoin === c ? '#000' : '#fff',
                fontWeight: selectedCoin === c ? 900 : 600,
                fontSize: 20,
                cursor: 'pointer',
                boxShadow: selectedCoin === c ? '0 1px 10px rgba(255,214,0,0.10)' : undefined
              }}
            >{c}</button>
          ))}
        </div>

        {/* 차트 영역 */}
        <div ref={chartRef} style={{
          background: CARD_BG,
          borderRadius: 16,
          padding: 22,
          marginBottom: 36,
          width: 640,
          minHeight: 420,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }} />

        {/* 원본 데이터 테이블 (간단 출력용) */}
        <div style={{
          width: '100%',
          maxHeight: 150,
          overflowY: 'auto',
          backgroundColor: '#232d3f',
          borderRadius: 12,
          padding: 12,
          color: '#fff',
          fontSize: 12,
          fontFamily: 'monospace',
          userSelect: 'text'
        }}>
          {coinData.length > 1 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {coinData[0].map((h, i) => (
                    <th key={i} style={{ borderBottom: '1px solid #444', padding: '4px 6px', textAlign: 'center' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {coinData.slice(1, 20).map((row, idx) => (
                  <tr key={idx}>
                    {row.map((cell, i) => (
                      <td key={i} style={{ borderBottom: '1px solid #333', padding: '3px 5px', textAlign: 'center' }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>데이터를 불러오는 중입니다...</p>
          )}
        </div>
      </div>
    </main>
  );
}

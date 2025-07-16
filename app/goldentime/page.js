'use client';
import React, { useState, useEffect, useRef } from 'react';
import NavBar from '../../components/NavBar';
import Chart from 'chart.js/auto';

const API_URL = 'https://script.google.com/macros/s/AKfycbyaVPOXDuSik2-zujcOG7bIT4vcz2xSn1tAYal5mv6yoyAhx7wFu4ik6gXpnRq7w1_0/exec';
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
  const [selectedPeriod, setSelectedPeriod] = useState('6m');
  const [hourly, setHourly] = useState([]);
  const [weekly, setWeekly] = useState([]);
  const chartRef = useRef();

  // 1. 코인 리스트 불러오기
  useEffect(() => {
    fetch(`${API_URL}?type=golden_coins`)
      .then(res => res.json())
      .then(data => {
        setCoins(data);
        setSelectedCoin(data[0] || '');
      });
  }, []);

  // 2. 코인/기간 선택시 변동성 데이터 fetch
  useEffect(() => {
    if (!selectedCoin) return;
    fetch(`${API_URL}?type=golden&coin=${encodeURIComponent(selectedCoin)}&period=${selectedPeriod}`)
      .then(res => res.json())
      .then(data => {
        setHourly(Array.isArray(data.hourly) ? data.hourly : []);
        setWeekly(Array.isArray(data.weekly) ? data.weekly : []);
      });
  }, [selectedCoin, selectedPeriod]);

  // 3. Chart.js Radar 렌더
  useEffect(() => {
    if (!chartRef.current || hourly.length !== 24) return;
    chartRef.current.innerHTML = '';
    const canvas = document.createElement('canvas');
    chartRef.current.appendChild(canvas);
    new Chart(canvas, {
      type: 'radar',
      data: {
        labels: Array.from({ length: 24 }, (_, i) => `${i}시`),
        datasets: [{
          data: hourly,
          borderColor: ACCENT,
          backgroundColor: 'rgba(255, 214, 0, 0.15)',
          pointBackgroundColor: ACCENT,
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          r: {
            angleLines: { color: '#303952' },
            pointLabels: { color: TEXT, font: { size: 15, weight: 700 } },
            ticks: { color: TEXT, showLabelBackdrop: false, font: { size: 13 } }
          }
        }
      }
    });
  }, [hourly]);

  return (
    <main style={{
      background: BG,
      minHeight: '100vh',
      color: TEXT,
      fontFamily: 'Pretendard,sans-serif',
      padding: 0,
    }}>
      <NavBar />
      {/* 우측상단 문의 버튼 */}
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
      {/* 차트 카드 */}
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
        {/* 기간 버튼 */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
          {periods.map(p => (
            <button
              key={p.value}
              onClick={() => setSelectedPeriod(p.value)}
              style={{
                padding: '6px 28px',
                border: 'none',
                borderRadius: 10,
                background: selectedPeriod === p.value ? ACCENT : '#232d3f',
                color: selectedPeriod === p.value ? '#000' : '#fff',
                fontWeight: selectedPeriod === p.value ? 900 : 600,
                fontSize: 17,
                cursor: 'pointer',
                boxShadow: selectedPeriod === p.value ? '0 1px 8px rgba(255,214,0,0.09)' : undefined
              }}
            >{p.label}</button>
          ))}
        </div>
        {/* 레이더 차트 */}
        <div ref={chartRef} style={{
          background: CARD_BG,
          borderRadius: 16,
          padding: 22,
          marginBottom: 36,
          width: 540,
          minHeight: 420,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }} />
        {/* 요일별 변동률 */}
        <div style={{
          background: CARD_BG,
          borderRadius: 13,
          boxShadow: '0 1px 8px rgba(0,0,0,0.10)',
          padding: 16,
          minWidth: 330,
          marginTop: 5
        }}>
          <div style={{
            display: 'flex',
            gap: 12,
            justifyContent: 'center',
            marginBottom: 9,
            color: '#ddd',
            fontWeight: 600,
            fontSize: 18
          }}>
            {['일','월','화','수','목','금','토'].map(d => <span key={d} style={{ minWidth: 36, textAlign: 'center' }}>{d}</span>)}
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            {weekly.map((v, i) =>
              <span key={i}
                style={{
                  background: i === 1 ? ACCENT : '#232d3f',
                  color: i === 1 ? '#181f2b' : '#fff',
                  fontWeight: i === 1 ? 900 : 600,
                  borderRadius: 9,
                  minWidth: 36,
                  textAlign: 'center',
                  padding: 7,
                  fontSize: 18,
                  border: i === 1 ? '2px solid #ffe44e' : 'none'
                }}>
                {typeof v === 'number' ? v.toFixed(2) : '-'}%
              </span>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

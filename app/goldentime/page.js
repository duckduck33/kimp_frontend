'use client';
import React, { useState, useEffect, useRef } from 'react';
import NavBar from '../../components/NavBar';
import Chart from 'chart.js/auto';

const coins = ['XRP', 'BTC', 'ETH', 'XLM', 'STRIKE'];
const periods = [
  { label: '6개월', value: '6m' },
  { label: '3개월', value: '3m' },
  { label: '1개월', value: '1m' }
];

export default function GoldentimePage() {
  const [selectedCoin, setSelectedCoin] = useState('XRP');
  const [selectedPeriod, setSelectedPeriod] = useState('6m');
  const [hourly, setHourly] = useState([]);
  const [weekly, setWeekly] = useState([]);
  const chartRef = useRef();

  // 데이터 패칭 (예시용 더미, 실제론 API 사용)
  useEffect(() => {
    // TODO: API 호출로 대체
    setHourly([1.5, 1.3, 1.1, 0.9, 0.7, 0.6, 0.8, 1.0, 1.1, 1.2, 1.4, 1.5, 1.4, 1.3, 1.1, 0.9, 0.7, 0.6, 0.8, 1.0, 1.1, 1.2, 1.4, 1.5]);
    setWeekly([0.86, 1.58, 1.46, 1.16, 1.12, 1.18, 1.00]);
  }, [selectedCoin, selectedPeriod]);

  // 레이더 차트 렌더
  useEffect(() => {
    if (!chartRef.current) return;
    chartRef.current.innerHTML = '';
    const canvas = document.createElement('canvas');
    chartRef.current.appendChild(canvas);
    new Chart(canvas, {
      type: 'radar',
      data: {
        labels: Array.from({ length: 24 }, (_, i) => `${i}시`),
        datasets: [{
          data: hourly,
          borderColor: '#FFD600',
          backgroundColor: 'rgba(255, 214, 0, 0.15)',
          pointBackgroundColor: '#FFD600',
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          r: {
            angleLines: { color: '#EEE' },
            pointLabels: { color: '#222', font: { size: 13, weight: 600 } },
            ticks: { color: '#222', showLabelBackdrop: false, font: { size: 12 } }
          }
        }
      }
    });
  }, [hourly]);

  return (
    <main style={{ background: '#f5f6fa', minHeight: '100vh', padding: 24 }}>
      <NavBar />
      <div style={{ maxWidth: 370, margin: '30px auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 14px rgba(0,0,0,0.07)', padding: 24 }}>
        {/* 코인 버튼 */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          {coins.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCoin(c)}
              style={{
                padding: '4px 18px',
                border: 'none',
                borderRadius: 8,
                background: selectedCoin === c ? '#222' : '#eee',
                color: selectedCoin === c ? '#FFD600' : '#444',
                fontWeight: 700,
                fontSize: 17,
                cursor: 'pointer'
              }}
            >{c}</button>
          ))}
        </div>
        {/* 기간 버튼 */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 22 }}>
          {periods.map(p => (
            <button
              key={p.value}
              onClick={() => setSelectedPeriod(p.value)}
              style={{
                padding: '2px 16px',
                border: 'none',
                borderRadius: 8,
                background: selectedPeriod === p.value ? '#FFD600' : '#eee',
                color: selectedPeriod === p.value ? '#222' : '#444',
                fontWeight: 600,
                fontSize: 15,
                cursor: 'pointer'
              }}
            >{p.label}</button>
          ))}
        </div>
        {/* 레이더 차트 */}
        <div ref={chartRef} style={{ background: '#fff', borderRadius: 14, padding: 18, marginBottom: 22, minHeight: 320 }} />
        {/* 요일별 변동률 */}
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 8px rgba(0,0,0,0.03)', padding: 12, marginTop: 5 }}>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 5, color: '#666', fontWeight: 600, fontSize: 15 }}>
            {['일','월','화','수','목','금','토'].map(d => <span key={d} style={{ minWidth: 33, textAlign: 'center' }}>{d}</span>)}
          </div>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
            {weekly.map((v, i) =>
              <span key={i}
                style={{
                  background: i === 1 ? '#FFF9C4' : '#eee',
                  color: i === 1 ? '#DAA900' : '#333',
                  fontWeight: i === 1 ? 800 : 600,
                  borderRadius: 7,
                  minWidth: 33,
                  textAlign: 'center',
                  padding: 4,
                  fontSize: 16,
                  border: i === 1 ? '2px solid #FFD600' : 'none'
                }}>
                {v.toFixed(2)}%
              </span>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

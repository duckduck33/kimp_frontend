'use client';
import React, { useEffect, useRef, useState } from 'react';
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
  const [selectedPeriod, setSelectedPeriod] = useState(periods[0].value);

  // API에서 받아올 변동률 데이터 상태 (시간별, 요일별)
  const [hourlyVolatility, setHourlyVolatility] = useState([]);
  const [dailyVolatility, setDailyVolatility] = useState([]);

  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // 1) 초기 코인 리스트 불러오기 (init)
  useEffect(() => {
    fetch(`${API_URL}?type=init`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          console.error(data.error);
          return;
        }
        if (data.volumeRankList && data.volumeRankList.length > 0) {
          setCoins(data.volumeRankList);
          setSelectedCoin(data.volumeRankList[0]);
        }
      })
      .catch(console.error);
  }, []);

  // 2) 선택된 코인과 기간 바뀔 때마다 변동성 데이터 API 요청 (아래 API 주소와 파라미터를 실제 맞게 수정 필요)
  useEffect(() => {
    if (!selectedCoin || !selectedPeriod) return;

    // 예: 변동성 데이터를 주는 API 주소는 /volatility?coin=BTC&period=6m 이런 식이라고 가정
    // 실제 API 주소와 파라미터명에 맞게 수정 필요

    fetch(`${API_URL}?type=volatility&coin=${encodeURIComponent(selectedCoin)}&period=${selectedPeriod}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          console.error(data.error);
          setHourlyVolatility([]);
          setDailyVolatility([]);
          return;
        }

        // 서버에서 받아오는 데이터 형식 예시:
        // {
        //   hourly: [1.6, 1.4, ..., 1.9], 24개 숫자 배열 (시간대별 변동률 %)
        //   daily: [0.86, 1.57, ..., 1.00] 7개 숫자 배열 (요일별 변동률 %)
        // }

        setHourlyVolatility(data.hourly || []);
        setDailyVolatility(data.daily || []);
      })
      .catch(err => {
        console.error(err);
        setHourlyVolatility([]);
        setDailyVolatility([]);
      });
  }, [selectedCoin, selectedPeriod]);

  // 3) Chart.js 레이더 차트 그리기 및 업데이트
  useEffect(() => {
    if (!chartRef.current) return;
    if (!hourlyVolatility || hourlyVolatility.length !== 24) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstanceRef.current = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: Array.from({ length: 24 }, (_, i) => `${i}시`),
        datasets: [{
          label: '시간대별 변동률 (%)',
          data: hourlyVolatility,
          fill: true,
          backgroundColor: 'rgba(255, 213, 79, 0.4)', // 연한 노란색
          borderColor: ACCENT,
          pointBackgroundColor: ACCENT,
          pointRadius: 5,
          borderWidth: 2,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            min: 0,
            max: 2.5,
            ticks: {
              stepSize: 0.5,
              color: TEXT,
              callback: (value) => `${value}%`
            },
            grid: { color: '#444' },
            angleLines: { color: '#444' },
            pointLabels: { color: TEXT, font: { size: 12 } }
          }
        },
        plugins: {
          legend: { labels: { color: TEXT }, display: false }
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [hourlyVolatility]);

  const dayLabels = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <main style={{ background: BG, minHeight: '100vh', padding: 20, fontFamily: 'Pretendard,sans-serif', color: TEXT }}>
      <NavBar />

      {/* 코인 선택 버튼 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {coins.map(c => (
          <button
            key={c}
            onClick={() => setSelectedCoin(c)}
            style={{
              padding: '6px 16px',
              borderRadius: 20,
              border: '1.5px solid',
              borderColor: selectedCoin === c ? ACCENT : '#555',
              background: selectedCoin === c ? ACCENT : 'transparent',
              color: selectedCoin === c ? '#000' : '#ccc',
              fontWeight: selectedCoin === c ? '700' : '400',
              cursor: 'pointer'
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* 기간 선택 버튼 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 40, flexWrap: 'wrap' }}>
        {periods.map(p => (
          <button
            key={p.value}
            onClick={() => setSelectedPeriod(p.value)}
            style={{
              padding: '6px 20px',
              borderRadius: 10,
              border: '1.5px solid',
              borderColor: selectedPeriod === p.value ? ACCENT : '#555',
              background: selectedPeriod === p.value ? ACCENT : 'transparent',
              color: selectedPeriod === p.value ? '#000' : '#ccc',
              fontWeight: selectedPeriod === p.value ? '700' : '400',
              cursor: 'pointer'
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* 시간대별 변동률 레이더 차트 */}
      <div style={{
        width: 420,
        height: 420,
        backgroundColor: CARD_BG,
        borderRadius: 20,
        padding: 20,
        boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)',
        marginBottom: 40,
        position: 'relative'
      }}>
        <h3 style={{ margin: '0 0 14px 10px', color: ACCENT, fontWeight: '700' }}>
          시간대별 변동률
        </h3>
        <canvas ref={chartRef} style={{ width: '100%', height: '360px' }} />
      </div>

      {/* 요일별 변동률 박스 스타일 */}
      <div style={{
        backgroundColor: CARD_BG,
        borderRadius: 20,
        padding: 20,
        width: 420,
        boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)',
        userSelect: 'none',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        {dailyVolatility.length === 7 ? dailyVolatility.map((val, idx) => (
          <div
            key={idx}
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '12px 0',
              borderRadius: 12,
              border: '1.5px solid #aaa',
              backgroundColor: idx === 1 ? ACCENT : 'transparent',
              fontWeight: idx === 1 ? '700' : '400',
              color: idx === 1 ? '#000' : '#ccc',
              marginLeft: idx === 0 ? 0 : 6,
              marginRight: idx === dailyVolatility.length -1 ? 0 : 6,
              userSelect: 'text',
              cursor: 'default',
              fontSize: 18,
              lineHeight: 1.1,
              userSelect: 'text'
            }}
          >
            <div>{dayLabels[idx]}</div>
            <div style={{ marginTop: 6 }}>{val.toFixed(2)}%</div>
          </div>
        )) : <p style={{ color: '#999' }}>요일별 변동률 데이터를 불러오는 중입니다...</p>}
      </div>
    </main>
  );
}

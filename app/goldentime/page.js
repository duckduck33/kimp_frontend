'use client';
import React, { useEffect, useRef, useState } from 'react';
import NavBar from '../../components/NavBar';
import Chart from 'chart.js/auto';

const API_URL = 'https://script.google.com/macros/s/AKfycby60rsO3sCHiRPv6mqMUQa-u2T0nPGTEles189caRS5KfR8ktZMOlmsBpPo9dNw8CrsiA/exec';

const periods = [
  { label: '6개월', value: 6 },
  { label: '3개월', value: 3 },
  { label: '1개월', value: 1 }
];

const BG = '#101728';
const CARD_BG = '#181f2b';
const ACCENT = '#FFD700';
const TEXT = '#fff';

export default function GoldentimePage() {
  const [coins, setCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState(6);

  const [timeVolatility, setTimeVolatility] = useState([]);
  const [timeUpCloseRates, setTimeUpCloseRates] = useState([]);
  const [timeDownCloseRates, setTimeDownCloseRates] = useState([]);
  const [dayVolatility, setDayVolatility] = useState([]);

  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // 1) 초기 코인 리스트와 상장1년미만 제외 필터링 (init API)
  useEffect(() => {
    fetch(`${API_URL}?type=init`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          console.error(data.error);
          return;
        }
        const volumeRankList = data.volumeRankList || [];
        const recentList = data.recentList || [];
        const filtered = volumeRankList.filter(c => !recentList.includes(c));
        setCoins(filtered);
        if (filtered.length > 0) setSelectedCoin(filtered[0]);
      })
      .catch(console.error);
  }, []);

  // 2) 코인, 기간 변경 시 원본 데이터 받아와서 변동률 계산
  useEffect(() => {
    if (!selectedCoin) return;

    fetch(`${API_URL}?type=coinData&name=${encodeURIComponent(selectedCoin)}`)
      .then(res => res.json())
      .then(rawData => {
        if (!Array.isArray(rawData) || rawData.length < 2) {
          console.error('원본 데이터가 없습니다.');
          setTimeVolatility([]);
          setTimeUpCloseRates([]);
          setTimeDownCloseRates([]);
          setDayVolatility([]);
          return;
        }

        const { timeVolatility, dayVolatility, timeUpCloseRates, timeDownCloseRates } = calculateVolatility(rawData, selectedPeriod);

        setTimeVolatility(timeVolatility);
        setDayVolatility(dayVolatility);
        setTimeUpCloseRates(timeUpCloseRates);
        setTimeDownCloseRates(timeDownCloseRates);
      })
      .catch(err => {
        console.error(err);
        setTimeVolatility([]);
        setTimeUpCloseRates([]);
        setTimeDownCloseRates([]);
        setDayVolatility([]);
      });
  }, [selectedCoin, selectedPeriod]);

  // 3) Chart.js 레이더 차트 그리기 및 갱신
  useEffect(() => {
    if (!chartRef.current) return;
    if (!timeVolatility || timeVolatility.length !== 24) return;

    if (chartInstanceRef.current) chartInstanceRef.current.destroy();

    const ctx = chartRef.current.getContext('2d');
    chartInstanceRef.current = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: Array.from({ length: 24 }, (_, i) => `${i}시`),
        datasets: [{
          label: '변동률(%)',
          data: timeVolatility,
          fill: true,
          backgroundColor: 'rgba(255, 205, 86, 0.2)',
          borderColor: ACCENT,
          pointBackgroundColor: ACCENT,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: ACCENT,
          borderWidth: 2,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => {
                const idx = ctx.dataIndex;
                const vol = timeVolatility[idx]?.toFixed(2) ?? 'N/A';
                const upClose = timeUpCloseRates[idx]?.toFixed(2) ?? 'N/A';
                const downClose = timeDownCloseRates[idx]?.toFixed(2) ?? 'N/A';
                return [`변동률: ${vol}%`, `상승 마감: ${upClose}%`, `하락 마감: ${downClose}%`];
              }
            }
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            min: 0,
            max: 2.5,
            ticks: {
              callback: v => v.toFixed(2) + '%',
              color: TEXT,
              backdropColor: 'rgba(0,0,0,0.4)',
              backdropPadding: 4
            },
            grid: { color: '#444' },
            angleLines: { color: '#444' },
            pointLabels: { color: TEXT, font: { size: 12 } }
          }
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) chartInstanceRef.current.destroy();
    };
  }, [timeVolatility, timeUpCloseRates, timeDownCloseRates]);

  // 변동률 계산 함수 (popup.js 내용 React용으로 변환)
  function calculateVolatility(rawData, months) {
    const now = new Date();
    const startDate = new Date();
    startDate.setMonth(now.getMonth() - months);

    const timeVolatilitySum = Array(24).fill(0);
    const timeVolatilityCount = Array(24).fill(0);
    const timeUpCloseCount = Array(24).fill(0);
    const timeDownCloseCount = Array(24).fill(0);

    const dayVolatilitySum = Array(7).fill(0);
    const dayVolatilityCount = Array(7).fill(0);

    const dataOnly = rawData.slice(1);

    dataOnly.forEach(row => {
      const [dateStr, timeStr, highStr, lowStr, openStr, closeStr] = row;
      if (!dateStr) return;

      const date = new Date(dateStr);
      if (date < startDate) return;

      const time = parseInt(timeStr, 10);
      const high = parseFloat(highStr);
      const low = parseFloat(lowStr);
      const open = parseFloat(openStr);
      const close = parseFloat(closeStr);

      if (isNaN(time) || isNaN(high) || isNaN(low) || isNaN(open) || isNaN(close) || low === 0) return;

      const volatility = ((high - low) / low) * 100;
      const day = date.getDay();

      timeVolatilitySum[time] += volatility;
      timeVolatilityCount[time]++;
      dayVolatilitySum[day] += volatility;
      dayVolatilityCount[day]++;

      if (close > open) timeUpCloseCount[time]++;
      else if (close < open) timeDownCloseCount[time]++;
    });

    const timeVolatility = timeVolatilitySum.map((sum, i) => timeVolatilityCount[i] > 0 ? sum / timeVolatilityCount[i] : 0);
    const timeUpCloseRates = timeUpCloseCount.map((count, i) => timeVolatilityCount[i] > 0 ? (count / timeVolatilityCount[i]) * 100 : 0);
    const timeDownCloseRates = timeDownCloseCount.map((count, i) => timeVolatilityCount[i] > 0 ? (count / timeVolatilityCount[i]) * 100 : 0);
    const dayVolatility = dayVolatilitySum.map((sum, i) => dayVolatilityCount[i] > 0 ? sum / dayVolatilityCount[i] : 0);

    return { timeVolatility, dayVolatility, timeUpCloseRates, timeDownCloseRates };
  }

  const dayLabels = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <main style={{ background: BG, minHeight: '100vh', padding: 20, fontFamily: 'Pretendard,sans-serif', color: TEXT }}>
      <NavBar />

      {/* 코인 선택 버튼 */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {coins.map(coin => (
          <button
            key={coin}
            onClick={() => setSelectedCoin(coin)}
            style={{
              padding: '6px 18px',
              borderRadius: 20,
              border: '1.5px solid',
              borderColor: selectedCoin === coin ? ACCENT : '#555',
              backgroundColor: selectedCoin === coin ? ACCENT : 'transparent',
              color: selectedCoin === coin ? '#000' : '#ccc',
              fontWeight: selectedCoin === coin ? '700' : '400',
              cursor: 'pointer'
            }}
          >
            {coin.replace('KRW-', '')}
          </button>
        ))}
      </div>

      {/* 기간 선택 버튼 */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 40 }}>
        {periods.map(p => (
          <button
            key={p.value}
            onClick={() => setSelectedPeriod(p.value)}
            style={{
              padding: '6px 20px',
              borderRadius: 10,
              border: '1.5px solid',
              borderColor: selectedPeriod === p.value ? ACCENT : '#555',
              backgroundColor: selectedPeriod === p.value ? ACCENT : 'transparent',
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
      <section style={{
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
      </section>

      {/* 요일별 변동률 박스 스타일 */}
      <section style={{
        backgroundColor: CARD_BG,
        borderRadius: 20,
        padding: 20,
        width: 420,
        boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)',
        userSelect: 'none',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        {dayVolatility.length === 7 ? dayVolatility.map((val, idx) => (
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
              marginRight: idx === dayVolatility.length - 1 ? 0 : 6,
              userSelect: 'text',
              cursor: 'default',
              fontSize: 18,
              lineHeight: 1.1
            }}
          >
            <div>{dayLabels[idx]}</div>
            <div style={{ marginTop: 6 }}>{val.toFixed(2)}%</div>
          </div>
        )) : <p style={{ color: '#999' }}>요일별 변동률 데이터를 불러오는 중입니다...</p>}
      </section>
    </main>
  );
}

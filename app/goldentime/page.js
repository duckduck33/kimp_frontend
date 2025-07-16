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
  const [allVolumeRankCoins, setAllVolumeRankCoins] = useState([]);
  const [recentCoins, setRecentCoins] = useState([]);
  const [coins, setCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState(periods[0].value);

  const [hourlyVolatility, setHourlyVolatility] = useState([]);
  const [dailyVolatility, setDailyVolatility] = useState([]);

  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // 1) init API 호출, 거래대금순위 + 상장1년미만 코인 리스트 동시 로딩
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

        setAllVolumeRankCoins(volumeRankList);
        setRecentCoins(recentList);

        // 상장1년미만 제외한 리스트 생성
        const filtered = volumeRankList.filter(coin => !recentList.includes(coin));
        setCoins(filtered);

        // 초기 선택 코인 세팅 (첫 번째)
        if (filtered.length > 0) setSelectedCoin(filtered[0]);
      })
      .catch(console.error);
  }, []);

  // 2) 코인, 기간 변경 시 변동성 API 호출
  useEffect(() => {
    if (!selectedCoin || !selectedPeriod) return;

    fetch(`${API_URL}?type=volatility&coin=${encodeURIComponent(selectedCoin)}&period=${selectedPeriod}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          console.error(data.error);
          setHourlyVolatility([]);
          setDailyVolatility([]);
          return;
        }
        setHourlyVolatility(data.hourly || []);
        setDailyVolatility(data.daily || []);
      })
      .catch(err => {
        console.error(err);
        setHourlyVolatility([]);
        setDailyVolatility([]);
      });
  }, [selectedCoin, selectedPeriod]);

  // 3) Chart.js 레이더 차트 그리기 및 갱신
  useEffect(() => {
    if (!chartRef.current) return;
    if (!hourlyVolatility || hourlyVolatility.length !== 24) return;

    if (chartInstanceRef.current) chartInstanceRef.current.destroy();

    const ctx = chartRef.current.getContext('2d');
    chartInstanceRef.current = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: Array.from({ length: 24 }, (_, i) => `${i}시`),
        datasets: [{
          label: '시간대별 변동률 (%)',
          data: hourlyVolatility,
          fill: true,
          backgroundColor: 'rgba(255, 213, 79, 0.4)',
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
      if (chartInstanceRef.current) chartInstanceRef.current.destroy();
    };
  }, [hourlyVolatility]);

  const dayLabels = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <main style={{ background: BG, minHeight: '100vh', padding: 20, fontFamily: 'Pretendard,sans-serif', color: TEXT }}>
      <NavBar />

      {/* 상단: 필터 버튼 */}
      <section style={{ marginBottom: 30 }}>
        <div style={{ marginBottom: 14, fontWeight: '700', fontSize: 18 }}>
          거래대금 상위 10개 중 상장 1년 미만 코인 제외
        </div>

        {/* 코인 선택 버튼 */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
          {coins.length > 0 ? coins.map(coin => (
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
              {coin}
            </button>
          )) : <p>코인 리스트를 불러오는 중입니다...</p>}
        </div>

        {/* 기간 선택 버튼 */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
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
      </section>

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
              marginRight: idx === dailyVolatility.length - 1 ? 0 : 6,
              userSelect: 'text',
              cursor: 'default',
              fontSize: 18,
              lineHeight: 1.1
            }}
          >
            <div>{['일', '월', '화', '수', '목', '금', '토'][idx]}</div>
            <div style={{ marginTop: 6 }}>{val.toFixed(2)}%</div>
          </div>
        )) : <p style={{ color: '#999' }}>요일별 변동률 데이터를 불러오는 중입니다...</p>}
      </section>
    </main>
  );
}

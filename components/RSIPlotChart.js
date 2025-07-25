'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ResponsiveContainer, ScatterChart, XAxis, YAxis, Tooltip, ReferenceArea, Scatter, Cell, LabelList, CartesianGrid } from 'recharts';
import { calculateRSI } from '@/utils/calculations';

const PULLBACK_THRESHOLD = 30;
const REBOUND_THRESHOLD = -30;

const getDotColor = (rsi) => {
  if (rsi >= 60) return '#f87171';
  if (rsi < 40) return '#4ade80';
  return '#9ca3af';
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{ background: 'rgba(0, 0, 0, 0.8)', color: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #555', width: '200px' }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem' }}>{data.symbol}</h3>
        <p style={{ margin: '4px 0' }}>RSI (5분): {data.rsi_5m ?? 'N/A'}</p>
        <p style={{ margin: '4px 0' }}>RSI (15분): {data.rsi_15m ?? 'N/A'}</p>
        <p style={{ margin: '4px 0' }}>RSI (1시간): {data.rsi_1h ?? 'N/A'}</p>
        <p style={{ margin: '4px 0' }}>RSI (4시간): {data.rsi_4h ?? 'N/A'}</p>
        <p style={{ margin: '4px 0' }}>RSI (1일): {data.rsi_1d ?? 'N/A'}</p>
        <hr style={{ border: '1px solid #444', margin: '10px 0' }} />
        <p style={{ margin: '4px 0' }}>가격: ${data.price}</p>
      </div>
    );
  }
  return null;
};

const TIMEFRAME_OPTIONS = ['5m', '15m', '1h', '4h', '1d'];

export default function RSIPlotChart({ onSymbolClick }) {
  const [allData, setAllData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('15m');
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const lastAlertsRef = useRef(new Set());
  const audioRef = useRef(null);

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const handleRequestPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(setNotificationPermission);
    }
  };

  const handleSoundToggle = () => {
    if (!isSoundEnabled && audioRef.current) {
      const audio = audioRef.current;
      audio.play()
        .then(() => {
          console.log('✅ 사운드 미리 재생 성공');
          audio.pause();
          audio.currentTime = 0;
        })
        .catch((e) => {
          console.error('❌ 사운드 미리 재생 실패:', e);
        });
    }
    setIsSoundEnabled(!isSoundEnabled);
  };

  const testNotification = () => {
    if (Notification.permission === 'granted') {
      new Notification("🔔 테스트 알림입니다", {
        body: "알림이 정상적으로 작동합니다!",
        icon: "/favicon.ico",
      });
      if (isSoundEnabled && audioRef.current) {
        audioRef.current.play().catch((e) => console.error("테스트 알림 사운드 실패:", e));
      }
    } else {
      console.log("알림 권한이 없습니다. 버튼을 눌러 허용해주세요.");
    }
  };
  useEffect(() => {
    const fetchData = () => {
      if (!isLoading) setIsLoading(true);
      fetch('https://api.bybit.com/v5/market/tickers?category=linear')
        .then(res => res.json())
        .then(tickerData => {
          if (tickerData.retCode !== 0) throw new Error('Failed to fetch tickers');
          const topTickers = tickerData.result.list.sort((a, b) => parseFloat(b.turnover24h) - parseFloat(a.turnover24h)).slice(0, 30);
          const ALL_TIMEFRAME_KEYS = { '5m': '5', '15m': '15', '1h': '60', '4h': '240', '1d': 'D' };
          const requests = topTickers.map(ticker => {
            const rsiPromises = Object.entries(ALL_TIMEFRAME_KEYS).map(([display, interval]) =>
              fetch(`https://api.bybit.com/v5/market/kline?category=linear&symbol=${ticker.symbol}&interval=${interval}&limit=100`)
                .then(res => res.json())
                .then(klineData => {
                  const rsi = (klineData.retCode === 0 && klineData.result.list?.length > 0)
                    ? calculateRSI(klineData.result.list.map(k => parseFloat(k[4])).reverse())
                    : null;
                  return { key: `rsi_${display}`, value: rsi };
                })
            );
            return Promise.all(rsiPromises).then(rsiResults => {
              const rsiData = rsiResults.reduce((acc, curr) => { acc[curr.key] = curr.value; return acc; }, {});
              return { symbol: ticker.symbol, price: parseFloat(ticker.lastPrice), ...rsiData };
            });
          });
          return Promise.all(requests);
        })
        .then(results => {
          setAllData(results);
          setIsLoading(false);

          const currentAlerts = new Set();
          results.forEach(item => {
            if (item.rsi_4h == null || item.rsi_5m == null) return;
            const spread = item.rsi_4h - item.rsi_5m;
            if (spread >= PULLBACK_THRESHOLD || spread <= REBOUND_THRESHOLD) {
              currentAlerts.add(item.symbol);
            }
          });

          const newAlerts = [...currentAlerts].filter(symbol => !lastAlertsRef.current.has(symbol));
          if (newAlerts.length > 0) {
            const title = `새로운 신호 ${newAlerts.length}건 발생!`;
            const body = `${newAlerts.join(', ')} 에서 신호가 포착되었습니다.`;
            console.log('🔔 새로운 RSI 알림:', newAlerts);  // ✅ 콘솔 로그 추가
            showNotification(title, body);
          }

          lastAlertsRef.current = currentAlerts;
        })
        .catch(error => {
          console.error("Failed to fetch data from Bybit:", error);
          setIsLoading(false);
        });
    };

    fetchData();
    const intervalId = setInterval(fetchData, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const showNotification = (title, body) => {
    if (Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/favicon.ico' });
      if (isSoundEnabled && audioRef.current) {
        audioRef.current.play().catch(err => console.error('🔇 알림 사운드 실패:', err));
      }
    }
  };

  const chartData = useMemo(() => {
    return allData.map(item => ({ ...item, rsi: item[`rsi_${selectedTimeframe}`] })).filter(item => item.rsi !== null);
  }, [allData, selectedTimeframe]);

  const alertCoins = useMemo(() => {
    return allData.map(item => {
      if (item.rsi_4h == null || item.rsi_5m == null) return { ...item, alertText: null };
      const spread = item.rsi_4h - item.rsi_5m;
      let alertText = null;
      if (spread >= PULLBACK_THRESHOLD) alertText = '눌림목 발생!';
      else if (spread <= REBOUND_THRESHOLD) alertText = '반등 발생!';
      return { ...item, alertText };
    }).filter(item => item.alertText !== null);
  }, [allData]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <audio ref={audioRef} src="/alert.mp3" preload="auto" />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <select value={selectedTimeframe} onChange={(e) => setSelectedTimeframe(e.target.value)} style={{ padding: '8px 12px', fontSize: '1rem', backgroundColor: '#1f2937', color: 'white', border: '1px solid #4b5563', borderRadius: '6px' }}>
          {TIMEFRAME_OPTIONS.map(time => (<option key={time} value={time}>{time}</option>))}
        </select>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleRequestPermission} disabled={notificationPermission !== 'default'} style={{
            padding: '8px 16px',
            fontSize: '1rem',
            backgroundColor: notificationPermission === 'granted' ? '#16a34a' : (notificationPermission === 'denied' ? '#dc2626' : '#374151'),
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: notificationPermission === 'default' ? 'pointer' : 'not-allowed',
            opacity: notificationPermission === 'default' ? 1 : 0.6
          }}>
            {notificationPermission === 'granted' ? '✅ 알림 허용됨' : (notificationPermission === 'denied' ? '❌ 알림 차단됨' : '🔔 알림 켜기')}
          </button>

          <button onClick={handleSoundToggle} style={{
            padding: '8px 16px',
            fontSize: '1rem',
            backgroundColor: isSoundEnabled ? '#16a34a' : '#374151',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}>
            {isSoundEnabled ? '🔊 소리 켜짐' : '🔇 소리 꺼짐'}
          </button>

          <button onClick={testNotification} style={{
            padding: '8px 16px',
            fontSize: '1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}>
            📢 테스트 알림
          </button>
        </div>
      </div>

      {alertCoins.length > 0 && (
        <div style={{ marginBottom: '20px', color: 'white' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>주요 신호 발생</h3>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            {alertCoins.map(coin => (
              <div
                key={coin.symbol}
                onClick={() => onSymbolClick(coin.symbol)}
                style={{
                  padding: '8px 12px',
                  background: coin.alertText === '눌림목 발생!' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = coin.alertText === '눌림목 발생!' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(34, 197, 94, 0.4)'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = coin.alertText === '눌림목 발생!' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)'}
              >
                <span style={{ fontWeight: 'bold' }}>{coin.symbol}: </span>
                <span style={{ color: '#facc15' }}>{coin.alertText}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <ResponsiveContainer width="100%" height="100%">
        {isLoading ? (
          <div style={{ color: 'white', textAlign: 'center', paddingTop: '100px' }}>Loading Chart...</div>
        ) : (
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <ReferenceArea y1={60} y2={100} fill="#dc2626" fillOpacity={0.2} label={{ value: '과매수', position: 'insideTopRight', fill: 'rgba(255, 255, 255, 0.7)', fontSize: 14 }} />
            <ReferenceArea y1={40} y2={60} fill="#6b7280" fillOpacity={0.2} label={{ value: '중립', position: 'insideRight', fill: 'rgba(255, 255, 255, 0.7)', fontSize: 14 }} />
            <ReferenceArea y1={0} y2={40} fill="#16a34a" fillOpacity={0.2} label={{ value: '과매도', position: 'insideBottomRight', fill: 'rgba(255, 255, 255, 0.7)', fontSize: 14 }} />
            <CartesianGrid stroke="#555" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="symbol" type="category" axisLine={false} tick={false} />
            <YAxis dataKey="rsi" type="number" domain={[0, 100]} ticks={[10, 20, 30, 40, 50, 60, 70, 80, 90]} tick={{ fill: 'rgba(255, 255, 255, 0.7)' }} />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="RSI" data={chartData} onClick={(data) => onSymbolClick(data.symbol)}>
              <LabelList dataKey="symbol" position="top" style={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getDotColor(entry.rsi)} />
              ))}
            </Scatter>
          </ScatterChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

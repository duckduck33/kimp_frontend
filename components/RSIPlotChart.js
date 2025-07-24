'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ResponsiveContainer, ScatterChart, XAxis, YAxis, Tooltip, ReferenceArea, Scatter, Cell, LabelList, CartesianGrid } from 'recharts';
import { calculateRSI } from '@/utils/calculations'; // RSI 계산 함수는 그대로 사용합니다.

// RSI 값에 따라 점 색상을 반환하는 함수
const getDotColor = (rsi) => {
  if (rsi >= 60) return '#f87171';
  if (rsi < 40) return '#4ade80';
  return '#9ca3af';
};

// 툴팁 컴포넌트
const CustomTooltip = ({ active, payload }) => {
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (active && payload && payload.length) {
      const symbol = payload[0].payload.symbol;
      setIsLoading(true);
      
      const ALL_TIMEFRAMES = { '5m': '5', '15m': '15', '1h': '60', '4h': '240', '1d': 'D' };
      const requests = Object.entries(ALL_TIMEFRAMES).map(([display, interval]) =>
        fetch(`https://api.bybit.com/v5/market/kline?category=linear&symbol=${symbol}&interval=${interval}&limit=100`)
          .then(res => res.json())
          .then(data => {
            const rsi = (data.retCode === 0 && data.result.list?.length > 0)
              ? calculateRSI(data.result.list.map(k => parseFloat(k[4])).reverse())
              : null;
            return { key: `rsi_${display}`, value: rsi };
          })
      );

      Promise.all(requests)
        .then(results => {
          const rsiDetails = results.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
          }, {});
          setDetails(rsiDetails);
          setIsLoading(false);
        })
        .catch(err => {
          console.error(err);
          setIsLoading(false);
        });
    }
  }, [active, payload]);

  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{ background: 'rgba(0, 0, 0, 0.8)', color: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #555', width: '200px' }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem' }}>{data.symbol}</h3>
        {isLoading || !details ? <p>Loading details...</p> : (
          <>
            <p style={{ margin: '4px 0' }}>RSI (5분): {details.rsi_5m ?? 'N/A'}</p>
            <p style={{ margin: '4px 0' }}>RSI (15분): {details.rsi_15m ?? 'N/A'}</p>
            <p style={{ margin: '4px 0' }}>RSI (1시간): {details.rsi_1h ?? 'N/A'}</p>
            <p style={{ margin: '4px 0' }}>RSI (4시간): {details.rsi_4h ?? 'N/A'}</p>
            <p style={{ margin: '4px 0' }}>RSI (1일): {details.rsi_1d ?? 'N/A'}</p>
          </>
        )}
        <hr style={{ border: '1px solid #444', margin: '10px 0' }} />
        <p style={{ margin: '4px 0' }}>가격: ${data.price}</p>
      </div>
    );
  }
  return null;
};

const TIMEFRAME_OPTIONS = ['5m', '15m', '1h', '4h', '1d'];

export default function RSIPlotChart() {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('15m');

  useEffect(() => {
    setIsLoading(true);

    // 1. 거래대금 상위 30개 코인 목록을 바이비트에서 직접 가져오기
    fetch('https://api.bybit.com/v5/market/tickers?category=linear')
      .then(res => res.json())
      .then(tickerData => {
        if (tickerData.retCode !== 0) throw new Error('Failed to fetch tickers');
        
        const topTickers = tickerData.result.list
          .sort((a, b) => parseFloat(b.turnover24h) - parseFloat(a.turnover24h))
          .slice(0, 30);
        
        const bybitInterval = { '5m': '5', '15m': '15', '1h': '60', '4h': '240', '1d': 'D' }[selectedTimeframe];
        
        // 2. 각 코인의 RSI 값을 바이비트에서 직접 가져오기
        const requests = topTickers.map(ticker => 
          fetch(`https://api.bybit.com/v5/market/kline?category=linear&symbol=${ticker.symbol}&interval=${bybitInterval}&limit=100`)
            .then(res => res.json())
            .then(klineData => {
              const rsi = (klineData.retCode === 0 && klineData.result.list?.length > 0)
                ? calculateRSI(klineData.result.list.map(k => parseFloat(k[4])).reverse())
                : null;
              return { symbol: ticker.symbol, price: parseFloat(ticker.lastPrice), rsi: rsi };
            })
        );
        return Promise.all(requests);
      })
      .then(results => {
        setChartData(results.filter(item => item.rsi !== null));
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch data from Bybit:", error);
        setIsLoading(false);
      });
  }, [selectedTimeframe]);

  return (
    // ... JSX 부분은 이전과 동일하게 유지 ...
    <div>
       <div style={{ marginBottom: '20px' }}>
        <select value={selectedTimeframe} onChange={(e) => setSelectedTimeframe(e.target.value)} style={{ padding: '8px 12px', fontSize: '1rem', backgroundColor: '#1f2937', color: 'white', border: '1px solid #4b5563', borderRadius: '6px' }}>
          {TIMEFRAME_OPTIONS.map(time => (<option key={time} value={time}>{time}</option>))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={600}>
        {isLoading ? <div style={{ color: 'white', textAlign: 'center', paddingTop: '100px' }}>Loading Chart...</div> : (
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <ReferenceArea y1={60} y2={100} fill="#dc2626" fillOpacity={0.2} label={{ value: '과매수', position: 'insideTopRight', fill: 'rgba(255, 255, 255, 0.7)', fontSize: 14 }} />
            <ReferenceArea y1={40} y2={60} fill="#6b7280" fillOpacity={0.2} label={{ value: '중립', position: 'insideRight', fill: 'rgba(255, 255, 255, 0.7)', fontSize: 14 }} />
            <ReferenceArea y1={0} y2={40} fill="#16a34a" fillOpacity={0.2} label={{ value: '과매도', position: 'insideBottomRight', fill: 'rgba(255, 255, 255, 0.7)', fontSize: 14 }} />
            <CartesianGrid stroke="#555" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="symbol" type="category" axisLine={false} tick={false} />
            <YAxis 
              dataKey="rsi" 
              type="number" 
              domain={[0, 100]} 
              ticks={[10, 20, 30, 40, 50, 60, 70, 80, 90]} 
              tick={{ fill: 'rgba(255, 255, 255, 0.7)' }} 
            />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="RSI" data={chartData}>
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
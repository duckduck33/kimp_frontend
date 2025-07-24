'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ResponsiveContainer, ScatterChart, XAxis, YAxis, Tooltip, ReferenceArea, Scatter, Cell, LabelList, CartesianGrid } from 'recharts';

// 1. 새로운 RSI 기준에 맞춰 점 색상을 반환하는 함수
const getDotColor = (rsi) => {
  if (rsi >= 60) return '#f87171'; // 밝은 빨강
  if (rsi < 40) return '#4ade80';  // 밝은 녹색
  return '#9ca3af';               // 회색
};

// 커스텀 툴팁 (이전과 동일)
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

export default function RSIPlotChart() {
  const [allData, setAllData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('15m');

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/rsi-heatmap')
      .then((res) => res.json())
      .then((data) => {
        setAllData(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch chart data:", error);
        setIsLoading(false);
      });
  }, []);

  const chartData = useMemo(() => {
    return allData
      .map(item => ({
        ...item,
        rsi: item[`rsi_${selectedTimeframe}`],
      }))
      .filter(item => item.rsi !== null);
  }, [allData, selectedTimeframe]);

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <select value={selectedTimeframe} onChange={(e) => setSelectedTimeframe(e.target.value)} style={{ padding: '8px 12px', fontSize: '1rem', backgroundColor: '#1f2937', color: 'white', border: '1px solid #4b5563', borderRadius: '6px' }}>
          {TIMEFRAME_OPTIONS.map(time => (<option key={time} value={time}>{time}</option>))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={600}>
        {isLoading ? <div style={{ color: 'white', textAlign: 'center', paddingTop: '100px' }}>Loading Chart...</div> : (
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            {/* 1. 새로운 영역 기준에 맞춰 배경 수정 */}
            <ReferenceArea y1={60} y2={100} fill="#dc2626" fillOpacity={0.2} label={{ value: '과매수', position: 'insideTopRight', fill: 'rgba(255, 255, 255, 0.7)', fontSize: 14 }} />
            <ReferenceArea y1={40} y2={60} fill="#6b7280" fillOpacity={0.2} label={{ value: '중립', position: 'insideRight', fill: 'rgba(255, 255, 255, 0.7)', fontSize: 14 }} />
            <ReferenceArea y1={0} y2={40} fill="#16a34a" fillOpacity={0.2} label={{ value: '과매도', position: 'insideBottomRight', fill: 'rgba(255, 255, 255, 0.7)', fontSize: 14 }} />
            <CartesianGrid stroke="#555" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="symbol" type="category" axisLine={false} tick={false} />
            
            {/* 1. Y축 눈금을 10단위로 수정 */}
            <YAxis 
              dataKey="rsi" 
              type="number" 
              domain={[0, 100]} 
              ticks={[10, 20, 30, 40, 50, 60, 70, 80, 90]} 
              tick={{ fill: 'rgba(255, 255, 255, 0.7)' }} 
            />

            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="RSI" data={chartData}>
              <LabelList dataKey="symbol" position="top" style={{ fill: 'rgba(255,255,255,0.6)', fontSize: 15 }} />
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
'use client';

import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceArea,
  Scatter,
} from 'recharts';

// 커스텀 툴팁
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{ background: '#333', color: '#fff', padding: '5px 10px', borderRadius: '5px', border: '1px solid #555' }}>
        <p style={{ margin: 0 }}>{`${data.symbol}`}</p>
        <p style={{ margin: 0, fontWeight: 'bold' }}>{`RSI: ${data.rsi}`}</p>
      </div>
    );
  }
  return null;
};

// 선택 가능한 시간대 목록
const TIMEFRAME_OPTIONS = ['5m', '15m', '1h', '4h', '1d'];

export default function RSIPlotChart() {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('15m'); // 기본 선택값 '15m'

  useEffect(() => {
    setIsLoading(true);
    // API 요청 시 선택된 시간대를 쿼리 파라미터로 넘겨줍니다.
    fetch(`/api/rsi-heatmap?timeframe=${selectedTimeframe}`)
      .then((res) => res.json())
      .then((data) => {
        setChartData(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch chart data:", error);
        setIsLoading(false);
      });
  }, [selectedTimeframe]); // selectedTimeframe이 변경될 때마다 이 useEffect가 다시 실행됩니다.

  return (
    <div>
      {/* 시간대 선택 드롭다운 UI */}
      <div style={{ marginBottom: '20px' }}>
        <select
          value={selectedTimeframe}
          onChange={(e) => setSelectedTimeframe(e.target.value)}
          style={{ padding: '8px 12px', fontSize: '1rem', backgroundColor: '#1f2937', color: 'white', border: '1px solid #4b5563', borderRadius: '6px' }}
        >
          {TIMEFRAME_OPTIONS.map(time => (
            <option key={time} value={time}>{time}</option>
          ))}
        </select>
      </div>

      <ResponsiveContainer width="100%" height={600}>
        {/* 로딩 중일 때 차트가 깜빡이지 않도록 처리 */}
        {isLoading ? <div style={{color: 'white', textAlign: 'center', paddingTop: '100px'}}>Loading Chart...</div> : (
          <ScatterChart margin={{ top: 20, right: 40, bottom: 40, left: 10 }}>
            <ReferenceArea y1={70} y2={100} fill="#5c2c2c" strokeOpacity={0.3} label={{ value: 'OVERBOUGHT', position: 'insideTopRight', fill: '#fff', fontSize: 14 }} />
            <ReferenceArea y1={30} y2={70} fill="#4a4a4a" strokeOpacity={0.3} label={{ value: 'NEUTRAL', position: 'insideRight', fill: '#fff', fontSize: 14 }}/>
            <ReferenceArea y1={0} y2={30} fill="#1e402f" strokeOpacity={0.3} label={{ value: 'OVERSOLD', position: 'insideBottomRight', fill: '#fff', fontSize: 14 }}/>
            <CartesianGrid stroke="#555" strokeDasharray="3 3" />
            <XAxis dataKey="symbol" type="category" angle={-45} textAnchor="end" height={80} tick={{ fill: '#fff', fontSize: 12 }} interval={0} />
            <YAxis dataKey="rsi" type="number" domain={[0, 100]} tick={{ fill: '#fff' }} />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="RSI" data={chartData} fill="#8884d8" />
          </ScatterChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
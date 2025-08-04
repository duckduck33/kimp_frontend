'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../common/Card';

export default function ProfitMonitor() {
  const [profitData, setProfitData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [closedPositionInfo, setClosedPositionInfo] = useState(null);

  // 5초마다 수익률 데이터 업데이트
  useEffect(() => {
    const fetchProfitData = async () => {
      try {
        // localStorage에서 선택된 심볼 가져오기
        const savedSettings = localStorage.getItem('tvAutoSettings');
        const settings = savedSettings ? JSON.parse(savedSettings) : { symbol: 'XRP-USDT' };
        
        const response = await fetch(`http://localhost:8000/api/profit/${settings.symbol}`);
        const data = await response.json();
        
        if (data && data[0]) {
          setProfitData(data[0]);
          
          // 차트 데이터 업데이트
          const newPoint = {
            time: new Date().toLocaleTimeString(),
            profit: data[0].actual_profit_rate,
          };
          
          setChartData(prev => {
            const newData = [...prev, newPoint];
            // 최근 12개 데이터포인트만 유지 (1분)
            return newData.slice(-12);
          });
        }
      } catch (error) {
        console.error('수익률 데이터 조회 실패:', error);
      }
    };

    fetchProfitData(); // 초기 데이터 로드
    const interval = setInterval(fetchProfitData, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!profitData) {
    return <Card title="수익률 모니터링">로딩 중...</Card>;
  }

  const profitColor = profitData.actual_profit_rate >= 0 ? 'text-green-500' : 'text-red-500';

  return (
    <Card title="수익률 모니터링" className="space-y-6">
      {/* 현재 포지션 정보 */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-400">포지션</p>
          <p className="text-lg font-semibold">{profitData.position_side}</p>
        </div>
        <div>
          <p className="text-gray-400">수량</p>
          <p className="text-lg font-semibold">{profitData.position_amt}</p>
        </div>
        <div>
          <p className="text-gray-400">진입가</p>
          <p className="text-lg font-semibold">{profitData.entry_price}</p>
        </div>
        <div>
          <p className="text-gray-400">현재가</p>
          <p className="text-lg font-semibold">{profitData.current_price}</p>
        </div>
        <div>
          <p className="text-gray-400">레버리지</p>
          <p className="text-lg font-semibold">{profitData.leverage}x</p>
        </div>
        <div>
          <p className="text-gray-400">미실현 손익</p>
          <p className={`text-lg font-semibold ${profitColor}`}>
            {profitData.unrealized_profit} VST
          </p>
        </div>
      </div>

      {/* 수익률 */}
      <div>
        <p className="text-gray-400 mb-2">실제 수익률 (레버리지 적용)</p>
        <p className={`text-2xl font-bold ${profitColor}`}>
          {profitData.actual_profit_rate.toFixed(2)}%
        </p>
        <p className="text-gray-400 text-sm">
          기본 수익률: {profitData.base_profit_rate.toFixed(2)}%
        </p>
      </div>

      {/* 종료된 포지션 정보 */}
      {closedPositionInfo && (
        <div className="border border-gray-600 rounded-lg p-4 mt-4">
          <h3 className="text-lg font-semibold text-gray-200 mb-3">종료된 포지션 정보</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">포지션 방향</p>
              <p className="text-lg font-semibold">{closedPositionInfo.position_side}</p>
            </div>
            <div>
              <p className="text-gray-400">수량</p>
              <p className="text-lg font-semibold">{closedPositionInfo.quantity}</p>
            </div>
            <div>
              <p className="text-gray-400">진입가</p>
              <p className="text-lg font-semibold">{closedPositionInfo.entry_price}</p>
            </div>
            <div>
              <p className="text-gray-400">종료가</p>
              <p className="text-lg font-semibold">{closedPositionInfo.exit_price}</p>
            </div>
            <div>
              <p className="text-gray-400">레버리지</p>
              <p className="text-lg font-semibold">{closedPositionInfo.leverage}x</p>
            </div>
            <div>
              <p className="text-gray-400">실현 손익</p>
              <p className={`text-lg font-semibold ${
                closedPositionInfo.realized_profit >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {closedPositionInfo.realized_profit} VST
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 수익률 차트 */}
      <div className="h-72 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="time" 
              tick={{ fill: '#9CA3AF' }}
              interval="preserveStartEnd"
            />
            <YAxis 
              tick={{ fill: '#9CA3AF' }}
              domain={['auto', 'auto']}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '0.375rem',
              }}
            />
            <Line 
              type="monotone" 
              dataKey="profit" 
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
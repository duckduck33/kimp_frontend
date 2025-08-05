'use client';

import { useState, useEffect } from 'react';
import Card from '../common/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

            // 백엔드 서버 주소 설정
            const BACKEND_URL = 'https://146.56.98.210:443';

export default function ProfitMonitor({ closedPositionInfo, hasActivePosition, onPositionEnter, onPositionClose }) {
  const [profitData, setProfitData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [currentSymbol, setCurrentSymbol] = useState('XRP-USDT');
  const [previousHasActivePosition, setPreviousHasActivePosition] = useState(false);
  const [notification, setNotification] = useState(null);

  // 포지션 상태 변화 감지
  useEffect(() => {
    if (hasActivePosition && !previousHasActivePosition && onPositionEnter) {
      onPositionEnter();
      // 진입 신호 알림
      setNotification({
        type: 'enter',
        message: '진입신호가 발생하여 포지션을 진입합니다',
        timestamp: new Date()
      });
    } else if (!hasActivePosition && previousHasActivePosition && onPositionClose) {
      onPositionClose(closedPositionInfo);
      // 종료 신호 알림
      setNotification({
        type: 'exit',
        message: '종료신호가 발생하여 포지션을 종료합니다',
        timestamp: new Date()
      });
    }
    setPreviousHasActivePosition(hasActivePosition);
  }, [hasActivePosition, previousHasActivePosition, onPositionEnter, onPositionClose, closedPositionInfo]);

  // 알림은 수동으로만 제거 (자동 제거 없음)

  // 현재 거래 중인 티커 가져오기
  useEffect(() => {
    const fetchCurrentSymbol = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/current-symbol`);
        if (response.ok) {
          const data = await response.json();
          setCurrentSymbol(data.symbol);
        }
      } catch (error) {
        console.error('현재 티커 조회 실패:', error);
      }
    };

    // 포지션이 있을 때만 현재 티커 조회
    if (hasActivePosition) {
      fetchCurrentSymbol();
    }
  }, [hasActivePosition]);

  useEffect(() => {
    let intervalId;

    const fetchProfitData = async () => {
      try {
        // 현재 티커가 없으면 기본값 사용
        const symbol = currentSymbol || 'XRP-USDT';
        
        const response = await fetch(`${BACKEND_URL}/api/profit/${symbol}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            // 포지션이 없는 경우
            setProfitData(null);
            setChartData([]);
            return;
          }
          console.error('수익률 조회 실패:', response.status);
          return;
        }

        const data = await response.json();
        if (data && data.length > 0) {
          setProfitData(data[0]);
          
          const now = new Date();
          // 5분 단위로 시간 표시 (분 단위까지만)
          const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
          setChartData(prev => [
            ...prev,
            {
              time: timeStr,
              profit: data[0].actual_profit_rate,  // 원래 값 그대로 사용
              isPositive: data[0].actual_profit_rate >= 0
            }
          ].slice(-20));
        }
      } catch (error) {
        console.error('수익률 조회 중 오류:', error);
      }
    };

    // 항상 모니터링 시작 (포지션 상태와 관계없이)
    fetchProfitData();  // 초기 데이터 로드
    intervalId = setInterval(fetchProfitData, 300000);  // 5분마다 업데이트 (300초)

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [currentSymbol]);

  // 수익률 데이터가 없고 종료된 포지션도 없으면 대기 상태 표시
  if (!profitData && !closedPositionInfo) {
    return (
      <Card title="수익률 모니터링">
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <span className="text-2xl">⏳</span>
          </div>
          <div className="text-gray-300 font-medium">
            진입신호를 기다리는 중입니다
          </div>
          <div className="text-gray-500 text-sm mt-2">
            TradingView에서 신호가 오면 자동으로 포지션이 진입됩니다
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card title="수익률 모니터링">
      {/* 알림 메시지 */}
      {notification && (
        <div className={`p-4 rounded-lg mb-4 border-l-4 ${
          notification.type === 'enter' 
            ? 'bg-blue-500/10 border-blue-500 text-blue-200' 
            : 'bg-red-500/10 border-red-500 text-red-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`text-lg ${
                notification.type === 'enter' ? 'text-blue-400' : 'text-red-400'
              }`}>
                {notification.type === 'enter' ? '📈' : '📉'}
              </span>
              <span className="font-semibold">{notification.message}</span>
            </div>
            <button 
              onClick={() => setNotification(null)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      
      {/* 활성 포지션 정보 */}
      {profitData && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400">티커</p>
              <p className="text-xl font-semibold">{currentSymbol}</p>
            </div>
            <div>
              <p className="text-gray-400">포지션 방향</p>
              <p className="text-xl font-semibold">
                {profitData.position_side}
              </p>
            </div>
            <div>
              <p className="text-gray-400">포지션 수량</p>
              <p className="text-xl font-semibold">
                {profitData.position_amt.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-400">레버리지</p>
              <p className="text-xl font-semibold">{profitData.leverage}x</p>
            </div>
            <div>
              <p className="text-gray-400">진입가</p>
              <p className="text-xl font-semibold">{profitData.entry_price}</p>
            </div>
            <div>
              <p className="text-gray-400">현재가</p>
              <p className="text-xl font-semibold">{profitData.current_price}</p>
            </div>
            <div>
              <p className="text-gray-400">실제 수익률</p>
              <p className={`text-xl font-semibold ${profitData.actual_profit_rate >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {profitData.actual_profit_rate.toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-gray-400">미실현 손익</p>
              <p className={`text-xl font-semibold ${profitData.unrealized_profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {profitData.unrealized_profit.toFixed(2)} VST
              </p>
            </div>
          </div>

          {/* 차트 */}
          <div className="h-72">
            <LineChart width={600} height={300} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="time" 
                interval="preserveStartEnd"
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip 
                formatter={(value, name, props) => [
                  `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`,
                  '수익률'
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke={(data) => data.isPositive ? '#10B981' : '#EF4444'}
                name="수익률 (%)"
                strokeWidth={2}
                dot={{ fill: (data) => data.isPositive ? '#10B981' : '#EF4444' }}
              />
            </LineChart>
          </div>

          {/* 종료된 포지션 정보 */}
          {closedPositionInfo && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400">티커</p>
                  <p className="text-xl font-semibold">{closedPositionInfo.symbol || 'XRP-USDT'}</p>
                </div>
                <div>
                  <p className="text-gray-400">포지션 방향</p>
                  <p className="text-xl font-semibold">{closedPositionInfo.position_side}</p>
                </div>
                <div>
                  <p className="text-gray-400">포지션 수량</p>
                  <p className="text-xl font-semibold">{closedPositionInfo.quantity?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400">레버리지</p>
                  <p className="text-xl font-semibold">{closedPositionInfo.leverage}x</p>
                </div>
                <div>
                  <p className="text-gray-400">진입가</p>
                  <p className="text-xl font-semibold">{closedPositionInfo.entry_price}</p>
                </div>
                <div>
                  <p className="text-gray-400">종료가</p>
                  <p className="text-xl font-semibold">{closedPositionInfo.exit_price}</p>
                </div>
                <div>
                  <p className="text-gray-400">최종 수익률</p>
                  <p className={`text-xl font-semibold ${closedPositionInfo.realized_profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {closedPositionInfo.realized_profit_percentage?.toFixed(2) || '0.00'}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">실현 손익</p>
                  <p className={`text-xl font-semibold ${closedPositionInfo.realized_profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {closedPositionInfo.realized_profit?.toFixed(2) || '0.00'} VST
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
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

  // 포지션 상태 변화 감지
  useEffect(() => {
    if (hasActivePosition && !previousHasActivePosition && onPositionEnter) {
      onPositionEnter();
    } else if (!hasActivePosition && previousHasActivePosition && onPositionClose) {
      onPositionClose(closedPositionInfo);
    }
    setPreviousHasActivePosition(hasActivePosition);
  }, [hasActivePosition, previousHasActivePosition, onPositionEnter, onPositionClose, closedPositionInfo]);

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
        // 포지션이 없으면 수익률 조회하지 않음
        if (!hasActivePosition || !currentSymbol) {
          return;
        }

        const response = await fetch(`${BACKEND_URL}/api/profit/${currentSymbol}`);
        
        if (!response.ok) {
          console.error('수익률 조회 실패:', response.status);
          return;
        }

        const data = await response.json();
        if (data && data.length > 0) {
          setProfitData(data[0]);
          
          const now = new Date();
          const timeStr = now.toLocaleTimeString();
          setChartData(prev => [
            ...prev,
            {
              time: timeStr,
              profit: data[0].actual_profit_rate
            }
          ].slice(-20));
        }
      } catch (error) {
        console.error('수익률 조회 중 오류:', error);
      }
    };

    // 포지션이 있을 때만 모니터링 시작
    if (hasActivePosition && currentSymbol) {
      fetchProfitData();  // 초기 데이터 로드
      intervalId = setInterval(fetchProfitData, 5000);  // 5초마다 업데이트
    } else {
      setProfitData(null);
      setChartData([]);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [hasActivePosition, currentSymbol]);

  if (!hasActivePosition) {
    return (
      <Card title="수익률 모니터링">
        <div className="text-center text-gray-400 py-4">
          활성화된 포지션이 없습니다
        </div>
      </Card>
    );
  }

  return (
    <Card title="수익률 모니터링">
      {profitData && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400">티커</p>
              <p className="text-xl font-semibold">{currentSymbol}</p>
            </div>
            <div>
              <p className="text-gray-400">포지션</p>
              <p className="text-xl font-semibold">
                {profitData.position_side} {profitData.position_amt}
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
          </div>

          {/* 차트 */}
          <div className="h-72">
            <LineChart width={600} height={300} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="#8884d8" 
                name="수익률 (%)"
              />
            </LineChart>
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
                  <p className={`text-lg font-semibold ${closedPositionInfo.realized_profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {closedPositionInfo.realized_profit} VST
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
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
  const [isRefreshing, setIsRefreshing] = useState(false);

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
      // 포지션 종료 시 티커 정보 삭제
      localStorage.removeItem('currentTradingSymbol');
    }
    setPreviousHasActivePosition(hasActivePosition);
  }, [hasActivePosition, previousHasActivePosition, onPositionEnter, onPositionClose, closedPositionInfo]);

  // 알림은 수동으로만 제거 (자동 제거 없음)

  // 수동 새로고침 함수11
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      // 설정이 저장되었는지 확인
      const savedSettings = localStorage.getItem('tvAutoSettings');
      if (!savedSettings) {
        alert('설정이 저장되지 않았습니다. 먼저 설정을 저장해주세요.');
        return;
      }
      
      const settings = JSON.parse(savedSettings);
      if (!settings.apiKey || !settings.secretKey) {
        alert('API 키가 설정되지 않았습니다. 먼저 설정을 저장해주세요.');
        return;
      }
      
      // 백엔드에 설정 다시 전송
      const requestBody = {
        ...settings,
        investment: parseFloat(settings.investment),
        leverage: parseInt(settings.leverage),
        takeProfit: parseFloat(settings.takeProfit),
        stopLoss: parseFloat(settings.stopLoss),
        isAutoTradingEnabled: true
      };
      
      const response = await fetch(`${BACKEND_URL}/api/update-settings`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      if (response.ok) {
        // 설정 전송 성공 후 수익률 데이터 다시 불러오기
        // 저장된 티커 정보 우선 사용, 없으면 기본값 사용
        const savedSymbol = localStorage.getItem('currentTradingSymbol');
        const symbol = savedSymbol || currentSymbol || 'XRP-USDT';
        
        console.log('새로고침 시 사용할 티커:', symbol);
        
        const profitResponse = await fetch(`${BACKEND_URL}/api/profit/${symbol}`);
        
        if (profitResponse.ok) {
          const data = await profitResponse.json();
          if (data && data.length > 0) {
            setProfitData(data[0]);
            setCurrentSymbol(symbol); // 현재 티커 업데이트
            alert('데이터를 성공적으로 새로고침했습니다.');
          } else {
            alert('활성 포지션이 없습니다.');
          }
        } else {
          alert('수익률 데이터 조회에 실패했습니다.');
        }
      } else {
        alert('설정 전송에 실패했습니다.');
      }
    } catch (error) {
      console.error('수동 새로고침 중 오류:', error);
      alert('새로고침 중 오류가 발생했습니다.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // 현재 거래 중인 티커 가져오기
  useEffect(() => {
    const fetchCurrentSymbol = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/current-symbol`);
        if (response.ok) {
          const data = await response.json();
          if (data.symbol && data.symbol !== 'XRP-USDT') {
            setCurrentSymbol(data.symbol);
            // 티커 정보를 로컬 스토리지에 저장
            localStorage.setItem('currentTradingSymbol', data.symbol);
            console.log('현재 티커 업데이트:', data.symbol);
          }
        }
      } catch (error) {
        console.error('현재 티커 조회 실패:', error);
      }
    };

    // 저장된 티커 정보가 있으면 먼저 사용
    const savedSymbol = localStorage.getItem('currentTradingSymbol');
    if (savedSymbol) {
      setCurrentSymbol(savedSymbol);
    }

    // 주기적으로 현재 티커 조회 (웹훅 신호 대기)
    fetchCurrentSymbol(); // 초기 로드
    const intervalId = setInterval(fetchCurrentSymbol, 10000); // 10초마다 확인

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  useEffect(() => {
    let intervalId;

    const fetchProfitData = async () => {
      try {
        // 설정이 저장되었는지 확인 (로컬 스토리지에서 API 키 확인)
        const savedSettings = localStorage.getItem('tvAutoSettings');
        if (!savedSettings) {
          // 설정이 저장되지 않은 경우 수익률 조회하지 않음
          return;
        }
        
        const settings = JSON.parse(savedSettings);
        if (!settings.apiKey || !settings.secretKey) {
          // API 키가 설정되지 않은 경우 수익률 조회하지 않음
          return;
        }
        
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
          // 20초 단위로 시간 표시 (초 단위까지 포함)
          const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
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

    // 설정이 저장된 경우에만 모니터링 시작
    const savedSettings = localStorage.getItem('tvAutoSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      if (settings.apiKey && settings.secretKey) {
        fetchProfitData();  // 초기 데이터 로드
        intervalId = setInterval(fetchProfitData, 20000);  // 20초마다 업데이트
      }
    }

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
      {/* 새로고침 버튼 */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleManualRefresh}
          disabled={isRefreshing}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isRefreshing 
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isRefreshing ? '새로고침 중...' : '🔄 새로고침'}
        </button>
      </div>
      
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
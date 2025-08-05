'use client';

import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// 하드코딩된 심볼을 상수로 통합관리
const HARDCODED_SYMBOL = 'XRP-USDT';
const BACKEND_URL = 'https://146.56.98.210:443';

export default function ProfitMonitor({ closedPositionInfo, hasActivePosition, onPositionEnter, onPositionClose }) {
  const [profitData, setProfitData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [currentSymbol, setCurrentSymbol] = useState(HARDCODED_SYMBOL);
  const [previousHasActivePosition, setPreviousHasActivePosition] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [todayProfit, setTodayProfit] = useState(null);

  // 오늘의 수익금 업데이트 함수
  const updateTodayProfit = () => {
    const today = new Date();
    const dateKey = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    
    // localStorage에서 저장된 데이터 불러오기
    const savedCalendarData = localStorage.getItem('profitCalendarData');
    let existingData = savedCalendarData ? JSON.parse(savedCalendarData) : {};
    
    // 오늘의 수익금을 실시간으로 업데이트 (100~600 랜덤)
    const newProfit = Math.floor(Math.random() * 500) + 100;
    existingData[dateKey] = newProfit;
    setTodayProfit(newProfit);
    
    // localStorage에 저장
    localStorage.setItem('profitCalendarData', JSON.stringify(existingData));
  };

  // 캘린더 데이터 생성
  const generateCalendarData = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const todayDate = today.getDate(); // 오늘 날짜
    
    // localStorage에서 저장된 캘린더 데이터 불러오기
    const savedCalendarData = localStorage.getItem('profitCalendarData');
    let existingData = savedCalendarData ? JSON.parse(savedCalendarData) : {};
    
    const calendarData = [];
    let dayCount = 1;
    
    // 이번 달의 모든 날짜에 대해 수익금 데이터 생성
    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          // 이번 달이 시작되기 전의 빈 칸
          week.push({ day: '', profit: null });
        } else if (dayCount > daysInMonth) {
          // 이번 달이 끝난 후의 빈 칸
          week.push({ day: '', profit: null });
        } else if (dayCount > todayDate) {
          // 오늘 이후의 날짜는 빈 칸으로 표시
          week.push({ day: dayCount, profit: null, isFuture: true });
          dayCount++;
        } else {
          // 오늘까지의 날짜만 수익금 생성
          const dateKey = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${dayCount.toString().padStart(2, '0')}`;
          const isToday = dayCount === todayDate;
          
          let profit;
          if (existingData[dateKey]) {
            // 저장된 데이터가 있으면 사용
            profit = existingData[dateKey];
          } else {
            // 새로운 날짜면 랜덤 생성 (4번에 1번 손실)
            const isLoss = Math.random() < 0.25; // 25% 확률로 손실
            if (isLoss) {
              profit = -(Math.floor(Math.random() * 300) + 50); // -50~-350 손실
            } else {
              profit = Math.floor(Math.random() * 500) + 100; // 100~600 수익
            }
            existingData[dateKey] = profit;
          }
          
          week.push({ day: dayCount, profit: profit, isToday: isToday });
          dayCount++;
        }
      }
      calendarData.push(week);
    }
    
    // localStorage에 데이터 저장
    localStorage.setItem('profitCalendarData', JSON.stringify(existingData));
    
    return calendarData;
  };

  // 포지션 상태 변화 감지
  useEffect(() => {
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
        const symbol = currentSymbol || HARDCODED_SYMBOL;
        
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

    const fetchCurrentSymbol = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/current-symbol`);
        if (response.ok) {
          const data = await response.json();
          if (data.symbol && data.symbol !== HARDCODED_SYMBOL) {
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

    // 웹훅 신호가 들어오기 전까지는 API 호출하지 않음
    // 포지션이 생겼을 때만 API 호출 시작
    if (hasActivePosition && !previousHasActivePosition && onPositionEnter) {
      onPositionEnter();
      // 진입 신호 알림
      setNotification({
        type: 'enter',
        message: '진입신호가 발생하여 포지션을 진입합니다',
        timestamp: new Date()
      });
      
      // 포지션 진입 시에만 API 호출 시작
      const savedSettings = localStorage.getItem('tvAutoSettings');
      const savedStatus = localStorage.getItem('tvAutoStatus');
      const isAutoTradingEnabled = savedStatus ? JSON.parse(savedStatus) : false;
      
      if (savedSettings && isAutoTradingEnabled) {
        const settings = JSON.parse(savedSettings);
        if (settings.apiKey && settings.secretKey) {
          // 포지션 진입 시 즉시 데이터 로드
          fetchProfitData();
          // 5초마다 업데이트 시작
          const intervalId = setInterval(fetchProfitData, 5000);
          
          // 현재 티커도 주기적으로 업데이트
          const symbolIntervalId = setInterval(fetchCurrentSymbol, 10000);
          
          // 컴포넌트 언마운트 시 인터벌 정리
          return () => {
            if (intervalId) {
              clearInterval(intervalId);
            }
            if (symbolIntervalId) {
              clearInterval(symbolIntervalId);
            }
          };
        }
      }
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
  }, [hasActivePosition, previousHasActivePosition, onPositionEnter, onPositionClose, closedPositionInfo, currentSymbol]);

  // 자동매매가 활성화된 경우 5초마다 API 호출
  useEffect(() => {
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
        const symbol = currentSymbol || HARDCODED_SYMBOL;
        
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

    // 자동매매가 활성화된 경우에만 5초마다 API 호출
    const savedStatus = localStorage.getItem('tvAutoStatus');
    const isAutoTradingEnabled = savedStatus ? JSON.parse(savedStatus) : false;
    
    if (isAutoTradingEnabled) {
      // 초기 데이터 로드
      fetchProfitData();
      
      // 5초마다 업데이트
      const intervalId = setInterval(fetchProfitData, 5000);
      
      return () => {
        if (intervalId) {
          clearInterval(intervalId);
        }
      };
    }
  }, [currentSymbol]);

  // 오늘의 수익금 주기적 업데이트 (캘린더가 표시될 때만)
  useEffect(() => {
    if (!showCalendar) return;
    
    // 초기 오늘 수익금 설정
    updateTodayProfit();
    
    // 30초마다 오늘의 수익금 업데이트
    const intervalId = setInterval(updateTodayProfit, 30000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [showCalendar]);

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
        const symbol = savedSymbol || currentSymbol || HARDCODED_SYMBOL;
        
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

  // 수익률 데이터가 없고 종료된 포지션도 없으면 대기 상태 표시
  if (!profitData && !closedPositionInfo) {
    return (
      <Card title="수익률 모니터링">
        {/* 캘린더 버튼은 항상 표시 */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            📅 수익률 캘린더
          </button>
        </div>
        
        {/* 캘린더가 활성화된 경우 표시 */}
        {showCalendar && (
          <div className="mt-6 p-4 bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">📅 이번 달 수익률 캘린더</h3>
            <div className="grid grid-cols-7 gap-1">
              {/* 요일 헤더 */}
              {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
                <div key={index} className="text-center text-gray-400 text-sm font-medium py-2">
                  {day}
                </div>
              ))}
              
              {/* 캘린더 데이터 */}
              {generateCalendarData().map((week, weekIndex) => (
                week.map((dayData, dayIndex) => (
                  <div key={`${weekIndex}-${dayIndex}`} className="text-center p-2">
                    {dayData.day ? (
                      <div className={`relative ${dayData.isToday ? 'bg-blue-600 rounded-lg p-1' : ''} ${dayData.isFuture ? 'opacity-50' : ''}`}>
                        <div className={`text-sm font-medium ${dayData.isToday ? 'text-white' : dayData.isFuture ? 'text-gray-500' : 'text-white'}`}>
                          {dayData.day}
                        </div>
                        {dayData.profit && (
                          <div className={`text-xs font-bold mt-1 ${
                            dayData.isToday 
                              ? (dayData.profit >= 0 ? 'text-yellow-300' : 'text-red-300')
                              : (dayData.profit >= 0 ? 'text-green-400' : 'text-red-400')
                          }`}>
                            {dayData.profit >= 0 ? '+' : ''}{dayData.profit.toLocaleString()} USDT
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-600 text-sm">-</div>
                    )}
                  </div>
                ))
              ))}
            </div>
            <div className="mt-4 text-center">
              <p className={`text-sm ${
                generateCalendarData().flat().filter(day => day.profit).reduce((sum, day) => sum + day.profit, 0) >= 0 
                  ? 'text-green-400' 
                  : 'text-red-400'
              }`}>
                💰 이번 달 총 수익: {generateCalendarData().flat().filter(day => day.profit).reduce((sum, day) => sum + day.profit, 0).toLocaleString()} USDT
              </p>
            </div>
          </div>
        )}
        
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
      {/* 새로고침 버튼과 캘린더 버튼 */}
      <div className="flex justify-between mb-4">
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
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          📅 수익률 캘린더
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
              <CartesianGrid strokeDasharray="5 5" stroke="#374151" strokeOpacity={0.3} />
              <XAxis 
                dataKey="time" 
                interval="preserveStartEnd"
                tick={{ fontSize: 11, fill: '#9CA3AF' }}
                axisLine={{ stroke: '#4B5563' }}
                tickLine={{ stroke: '#4B5563' }}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#9CA3AF' }}
                axisLine={{ stroke: '#4B5563' }}
                tickLine={{ stroke: '#4B5563' }}
              />
              <Tooltip 
                formatter={(value, name, props) => [
                  `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`,
                  '수익률'
                ]}
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke={(data) => data.isPositive ? '#10B981' : '#EF4444'}
                name="수익률 (%)"
                strokeWidth={6}
                dot={{ r: 4, fill: (data) => data.isPositive ? '#10B981' : '#EF4444', stroke: '#fff', strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 3, stroke: '#fff', fill: (data) => data.isPositive ? '#10B981' : '#EF4444' }}
                connectNulls={true}
              />
            </LineChart>
          </div>

          {/* 종료된 포지션 정보 */}
          {closedPositionInfo && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400">티커</p>
                  <p className="text-xl font-semibold">{closedPositionInfo.symbol || HARDCODED_SYMBOL}</p>
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

          {/* 수익률 캘린더 */}
          {showCalendar && (
            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4">📅 이번 달 수익률 캘린더</h3>
              <div className="grid grid-cols-7 gap-1">
                {/* 요일 헤더 */}
                {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
                  <div key={index} className="text-center text-gray-400 text-sm font-medium py-2">
                    {day}
                  </div>
                ))}
                
                {/* 캘린더 데이터 */}
                {generateCalendarData().map((week, weekIndex) => (
                  week.map((dayData, dayIndex) => (
                    <div key={`${weekIndex}-${dayIndex}`} className="text-center p-2">
                      {dayData.day ? (
                        <div className={`relative ${dayData.isToday ? 'bg-blue-600 rounded-lg p-1' : ''}`}>
                          <div className={`text-sm font-medium ${dayData.isToday ? 'text-white' : 'text-white'}`}>
                            {dayData.day}
                          </div>
                          {dayData.profit && (
                            <div className={`text-xs font-bold mt-1 ${dayData.isToday ? 'text-yellow-300' : 'text-green-400'}`}>
                              +{dayData.profit.toLocaleString()} VST
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-gray-600 text-sm">-</div>
                      )}
                    </div>
                  ))
                ))}
              </div>
              <div className="mt-4 text-center">
                <p className={`text-sm ${
                  generateCalendarData().flat().filter(day => day.profit).reduce((sum, day) => sum + day.profit, 0) >= 0 
                    ? 'text-green-400' 
                    : 'text-red-400'
                }`}>
                  💰 이번 달 총 수익: {generateCalendarData().flat().filter(day => day.profit).reduce((sum, day) => sum + day.profit, 0).toLocaleString()} USDT
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
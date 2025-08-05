'use client';

import { useState, useEffect } from 'react';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import Dropdown from '../common/Dropdown';

const INDICATORS = [
  { value: 'PREMIUM', label: '프리미엄유료지표_MTV' },
  { value: 'CONBOL', label: '콘볼지표' }
];

const DEFAULT_SETTINGS = {
  apiKey: '',
  secretKey: '',
  investment: '1000',
  leverage: '10',
  takeProfit: '2',
  stopLoss: '2',
  indicator: 'PREMIUM',
  isAutoTradingEnabled: false
};

// 백엔드 서버 주소 설정
const BACKEND_URL = 'http://localhost:8000';

export default function SettingsForm({ onPositionClose, onPositionEnter }) {
  const [isRunning, setIsRunning] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking');

  useEffect(() => {
    // 로컬 스토리지에서 설정 불러오기
    const savedSettings = localStorage.getItem('tvAutoSettings');
    const savedStatus = localStorage.getItem('tvAutoStatus');
    
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    if (savedStatus) {
      setIsRunning(JSON.parse(savedStatus));
    }

    // 백엔드 서버 상태 확인
    checkServerStatus();
    // 백엔드에서 설정 불러오기
    loadSettingsFromBackend();
  }, []);

  const checkServerStatus = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/`);
      if (response.ok) {
        setServerStatus('connected');
      } else {
        setServerStatus('error');
      }
    } catch (error) {
      console.error('서버 연결 실패:', error);
      setServerStatus('error');
    }
  };

  const loadSettingsFromBackend = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/settings`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const backendSettings = data.data;
          setSettings({
            apiKey: backendSettings.apiKey || '',
            secretKey: backendSettings.secretKey || '',
            investment: backendSettings.investment?.toString() || '1000',
            leverage: backendSettings.leverage?.toString() || '10',
            takeProfit: backendSettings.takeProfit?.toString() || '2',
            stopLoss: backendSettings.stopLoss?.toString() || '2',
            indicator: backendSettings.indicator || 'PREMIUM',
            isAutoTradingEnabled: backendSettings.isAutoTradingEnabled || false
          });
          setIsRunning(backendSettings.isAutoTradingEnabled || false);
        }
      }
    } catch (error) {
      console.error('백엔드 설정 불러오기 실패:', error);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // 로컬 스토리지에 저장
      localStorage.setItem('tvAutoSettings', JSON.stringify(settings));
      
      // 백엔드로 설정 전송
      const response = await fetch(`${BACKEND_URL}/api/update-settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...settings,
          investment: parseFloat(settings.investment),
          leverage: parseInt(settings.leverage),
          takeProfit: parseFloat(settings.takeProfit),
          stopLoss: parseFloat(settings.stopLoss),
          isAutoTradingEnabled: isRunning
        })
      });
      
      if (response.ok) {
        alert('설정이 저장되었습니다.');
      } else {
        console.error('백엔드 설정 저장 실패:', response.status);
        alert('설정 저장 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('설정 저장 중 오류:', error);
      alert('설정 저장 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAutoTrading = async () => {
    const newStatus = !isRunning;
    setIsRunning(newStatus);
    localStorage.setItem('tvAutoStatus', JSON.stringify(newStatus));
    
    // 백엔드에 자동매매 상태 업데이트
    try {
      const response = await fetch(`${BACKEND_URL}/api/update-settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...settings,
          investment: parseFloat(settings.investment),
          leverage: parseInt(settings.leverage),
          takeProfit: parseFloat(settings.takeProfit),
          stopLoss: parseFloat(settings.stopLoss),
          isAutoTradingEnabled: newStatus
        })
      });
      
      if (!response.ok) {
        console.error('자동매매 상태 업데이트 실패:', response.status);
        alert('자동매매 상태 업데이트 중 오류가 발생했습니다.');
        // 실패 시 상태 되돌리기
        setIsRunning(!newStatus);
        localStorage.setItem('tvAutoStatus', JSON.stringify(!newStatus));
      } else {
        alert(newStatus ? '자동매매가 활성화되었습니다.' : '자동매매가 비활성화되었습니다.');
      }
    } catch (error) {
      console.error('자동매매 상태 업데이트 중 오류:', error);
      alert('자동매매 상태 업데이트 중 오류가 발생했습니다.');
      // 실패 시 상태 되돌리기
      setIsRunning(!newStatus);
      localStorage.setItem('tvAutoStatus', JSON.stringify(!newStatus));
    }
  };

  return (
    <Card title="트레이딩뷰 자동매매 설정">
      <div className="space-y-4">
        {/* 서버 상태 표시 */}
        <div className={`p-3 rounded-lg text-sm ${
          serverStatus === 'connected' ? 'bg-green-900 text-green-200' :
          serverStatus === 'error' ? 'bg-red-900 text-red-200' :
          'bg-yellow-900 text-yellow-200'
        }`}>
          {serverStatus === 'connected' && '✅ 백엔드 서버 연결됨'}
          {serverStatus === 'error' && '❌ 백엔드 서버 연결 실패'}
          {serverStatus === 'checking' && '⏳ 서버 상태 확인 중...'}
        </div>

        <Input
          type="text"
          label="API 키"
          value={settings.apiKey}
          onChange={(value) => setSettings({ ...settings, apiKey: value })}
        />
        <Input
          type="password"
          label="시크릿 키"
          value={settings.secretKey}
          onChange={(value) => setSettings({ ...settings, secretKey: value })}
        />
        <Input
          type="number"
          label="투자금액 (VST)"
          value={settings.investment}
          onChange={(value) => setSettings({ ...settings, investment: value })}
        />
        <Input
          type="number"
          label="레버리지"
          value={settings.leverage}
          onChange={(value) => setSettings({ ...settings, leverage: value })}
        />
        <Input
          type="number"
          label="익절 (%)"
          value={settings.takeProfit}
          onChange={(value) => setSettings({ ...settings, takeProfit: value })}
        />
        <Input
          type="number"
          label="손절 (%)"
          value={settings.stopLoss}
          onChange={(value) => setSettings({ ...settings, stopLoss: value })}
        />
        <Dropdown
          label="지표 선택"
          value={settings.indicator}
          onChange={(value) => setSettings({ ...settings, indicator: value })}
          options={INDICATORS}
        />
        <div className="flex gap-4 pt-4">
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? '저장 중...' : '설정 저장'}
          </Button>
          <Button
            onClick={toggleAutoTrading}
            variant={isRunning ? 'danger' : 'primary'}
            disabled={serverStatus !== 'connected'}
          >
            {isRunning ? '자동매매 중지' : '자동매매 시작'}
          </Button>
        </div>
        
        {/* 현재 상태 표시 */}
        <div className="mt-4 p-3 bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-400">현재 상태</p>
          <p className={`text-sm font-semibold ${isRunning ? 'text-green-500' : 'text-red-500'}`}>
            {isRunning ? '자동매매 활성화' : '자동매매 비활성화'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            선택된 지표: {INDICATORS.find(i => i.value === settings.indicator)?.label}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            웹훅 URL: {BACKEND_URL}/api/webhook
          </p>
        </div>
      </div>
    </Card>
  );
}
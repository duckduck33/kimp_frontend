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
  indicator: 'PREMIUM'
};

export default function SettingsForm({ onPositionClose, onPositionEnter }) {
  const [isRunning, setIsRunning] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    const savedSettings = localStorage.getItem('tvAutoSettings');
    const savedStatus = localStorage.getItem('tvAutoStatus');
    
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    if (savedStatus) {
      setIsRunning(JSON.parse(savedStatus));
    }
  }, []);

  const handleSave = async () => {
    try {
      // 로컬 스토리지에 저장
      localStorage.setItem('tvAutoSettings', JSON.stringify(settings));
      
      // 백엔드로 설정 전송
      const response = await fetch('http://localhost:8000/api/update-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
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
    }
  };

  const toggleAutoTrading = () => {
    const newStatus = !isRunning;
    setIsRunning(newStatus);
    localStorage.setItem('tvAutoStatus', JSON.stringify(newStatus));
  };

  return (
    <Card title="트레이딩뷰 자동매매 설정">
      <div className="space-y-4">
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
          <Button onClick={handleSave}>설정 저장</Button>
          <Button
            onClick={toggleAutoTrading}
            variant={isRunning ? 'danger' : 'primary'}
          >
            {isRunning ? '자동매매 중지' : '자동매매 시작'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
'use client';

import { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import Dropdown from '../common/Dropdown';
import Card from '../common/Card';

const INDICATORS = [
  { value: 'MTV', label: '프리미엄유료지표_MTV' },
  { value: 'CONBOL', label: '콘볼지표' },
];

const SYMBOLS = [
  { value: 'BTC-USDT', label: 'BTC' },
  { value: 'ETH-USDT', label: 'ETH' },
  { value: 'XRP-USDT', label: 'XRP' },
  { value: 'DOGE-USDT', label: 'DOGE' },
];

export default function SettingsForm({ onPositionClose }) {
  const [settings, setSettings] = useState({
    apiKey: '',
    secretKey: '',
    symbol: 'XRP-USDT',
    investment: '',
    leverage: '',
    takeProfit: '',
    stopLoss: '',
    indicator: 'MTV',
  });

  const [isRunning, setIsRunning] = useState(false);

  // localStorage에서 설정 불러오기
  useEffect(() => {
    const savedSettings = localStorage.getItem('tvAutoSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    const savedStatus = localStorage.getItem('tvAutoStatus');
    if (savedStatus) {
      setIsRunning(JSON.parse(savedStatus));
    }
  }, []);

  // 설정 저장
  const handleSave = () => {
    localStorage.setItem('tvAutoSettings', JSON.stringify(settings));
  };

  // 자동매매 시작/중지
  const toggleAutoTrading = () => {
    const newStatus = !isRunning;
    setIsRunning(newStatus);
    localStorage.setItem('tvAutoStatus', JSON.stringify(newStatus));
  };

  // 모든 포지션 종료
  const closeAllPositions = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symbol: 'XRP-USDT',
          is_close: true
        })
      });

      const data = await response.json();
      
      if (data.success && data.data.closed_positions && data.data.closed_positions.length > 0) {
        const position = data.data.closed_positions[0];
        const info = {
          position_side: position.position_side,
          quantity: position.quantity,
          entry_price: position.result.data.entry_price,
          exit_price: position.result.data.exit_price,
          leverage: position.result.data.leverage,
          realized_profit: position.result.data.realized_profit
        };
        onPositionClose(info);
        alert('모든 포지션이 정상적으로 종료되었습니다.');
        // 자동매매도 중지
        setIsRunning(false);
        localStorage.setItem('tvAutoStatus', JSON.stringify(false));
      } else {
        alert('포지션 종료 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('포지션 종료 실패:', error);
      alert('포지션 종료 중 오류가 발생했습니다.');
    }
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

        <Dropdown
          label="코인 선택"
          value={settings.symbol}
          onChange={(value) => setSettings({ ...settings, symbol: value })}
          options={SYMBOLS}
        />
        
        <Input
          type="number"
          label="투자금액"
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
          label="익절값 (%)"
          value={settings.takeProfit}
          onChange={(value) => setSettings({ ...settings, takeProfit: value })}
        />
        
        <Input
          type="number"
          label="손절값 (%)"
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
          <Button onClick={handleSave}>
            설정 저장
          </Button>
          
          <Button
            onClick={toggleAutoTrading}
            variant={isRunning ? 'danger' : 'primary'}
          >
            {isRunning ? '자동매매 중지' : '자동매매 시작'}
          </Button>

          <Button
            onClick={closeAllPositions}
            variant="danger"
          >
            전체 포지션 종료ㄴ
          </Button>
        </div>
      </div>
    </Card>
  );
}
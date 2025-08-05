'use client';

import { useState } from 'react';
import SettingsForm from '@/components/tv_auto/SettingsForm';
import ProfitMonitor from '@/components/tv_auto/ProfitMonitor';

export default function TvAutoPage() {
  const [closedPositionInfo, setClosedPositionInfo] = useState(null);
  const [hasActivePosition, setHasActivePosition] = useState(false);

  const handlePositionClose = (info) => {
    setClosedPositionInfo(info);
    setHasActivePosition(false);  // 포지션 종료 시 모니터링 중지
  };

  const handlePositionEnter = () => {
    setHasActivePosition(true);  // 포지션 진입 시 모니터링 시작
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-100 mb-8">
        트레이딩뷰 자동매매
      </h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <SettingsForm 
          onPositionClose={handlePositionClose}
          onPositionEnter={handlePositionEnter}
        />
        <ProfitMonitor 
          closedPositionInfo={closedPositionInfo}
          hasActivePosition={hasActivePosition}
          onPositionEnter={handlePositionEnter}
          onPositionClose={handlePositionClose}
        />
      </div>
    </main>
  );
}
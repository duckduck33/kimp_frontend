'use client';

import { useState } from 'react';
import SettingsForm from '@/components/tv_auto/SettingsForm';
import ProfitMonitor from '@/components/tv_auto/ProfitMonitor';

export default function TvAutoPage() {
  const [closedPositionInfo, setClosedPositionInfo] = useState(null);

  const handlePositionClose = (info) => {
    setClosedPositionInfo(info);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-100 mb-8">
        트레이딩뷰 자동매매
      </h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <SettingsForm onPositionClose={handlePositionClose} />
        <ProfitMonitor closedPositionInfo={closedPositionInfo} />
      </div>
    </main>
  );
}
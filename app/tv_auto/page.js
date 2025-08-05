'use client';

import { useState } from 'react';
import SettingsForm from '@/components/tv_auto/SettingsForm';
import ProfitMonitor from '@/components/tv_auto/ProfitMonitor';

export default function TvAutoPage() {
  const [closedPositionInfo, setClosedPositionInfo] = useState(null);
  const [hasActivePosition, setHasActivePosition] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // 하드코딩된 비밀번호 (실제로는 환경변수나 서버에서 관리하는 것이 좋습니다)
  const CORRECT_PASSWORD = 'fobit2024';

  const handlePositionClose = (info) => {
    setClosedPositionInfo(info);
    setHasActivePosition(false);  // 포지션 종료 시 모니터링 중지
  };

  const handlePositionEnter = () => {
    setHasActivePosition(true);  // 포지션 진입 시 모니터링 시작
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      setErrorMessage('');
    } else {
      setErrorMessage('비밀번호가 올바르지 않습니다.');
      setPassword('');
    }
  };

  // 비밀번호 입력 화면
  if (!isAuthenticated) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-gray-100 mb-8 text-center">
            트레이딩뷰 자동매매
          </h1>
          
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-100 mb-4 text-center">
              비밀번호를 입력하세요
            </h2>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호 입력"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              {errorMessage && (
                <p className="text-red-400 text-sm text-center">
                  {errorMessage}
                </p>
              )}
              
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
              >
                로그인
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  // 인증된 사용자를 위한 메인 화면
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-100">
          트레이딩뷰 자동매매
        </h1>
        <button
          onClick={() => setIsAuthenticated(false)}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition duration-200"
        >
          로그아웃
        </button>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2">
        <SettingsForm 
          onPositionClose={handlePositionClose}
          onPositionEnter={handlePositionEnter}
        />
        <ProfitMonitor 
          closedPositionInfo={closedPositionInfo}
          hasActivePosition={hasActivePosition}
        />
      </div>
    </main>
  );
}
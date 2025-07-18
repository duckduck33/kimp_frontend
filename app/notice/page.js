'use client';

import { useEffect, useState } from 'react';
import NavBar from '../../components/NavBar';

export default function NoticePage() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/notices'); // 이 API 또는 static JSON 필요
      const data = await res.json();
      setNotices(data);
    };
    fetchData();
  }, []);

  return (
    <>
      <NavBar />
      <div
        style={{
          minHeight: 'calc(100vh - 64px)',
          backgroundColor: '#101728',
          color: '#fff',
          padding: '2rem',
          fontFamily: 'Pretendard, sans-serif',
        }}
      >
        <h1 className="text-3xl font-bold text-center mb-8">
          🚨 실시간 상장 공지 통합 리스트
        </h1>

        {notices.length === 0 ? (
          <p className="text-center text-lg text-gray-300">📡 데이터를 불러오는 중입니다...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
            {notices.map((notice, idx) => {
              const remaining = getRemainingTime(notice.trade_time);
              return (
                <div
                  key={idx}
                  className="bg-[#1F2937] rounded-xl p-5 shadow hover:shadow-xl transition duration-200 border border-gray-700"
                >
                  <div className="text-sm text-gray-400 mb-1">{notice.exchange}</div>
                  <div className="text-xl font-semibold mb-2">{notice.asset}</div>
                  <div className="text-sm text-gray-300 mb-1">
                    📅 상장 시각: {formatDate(notice.trade_time)}
                  </div>
                  <div className="text-sm text-gray-300 mb-3">
                    ⏳ 남은 시간: {remaining}
                  </div>
                  <a
                    href={notice.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline text-sm"
                  >
                    📎 공지 바로가기
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

// 날짜 포맷
function formatDate(dateStr) {
  const dt = new Date(dateStr);
  return dt.toLocaleString('ko-KR', { hour12: false });
}

// 남은 시간 계산
function getRemainingTime(dateStr) {
  const now = new Date();
  const target = new Date(dateStr);
  const diffMs = target - now;

  if (diffMs < 0) return '이미 시작됨';

  const mins = Math.floor(diffMs / 1000 / 60);
  const hours = Math.floor(mins / 60);
  const remainMins = mins % 60;

  return `${hours}시간 ${remainMins}분`;
}

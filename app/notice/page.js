'use client';

import NavBar from '../../components/NavBar';
import { useEffect, useState } from 'react';

export default function NoticePage() {
  const [groupedNotices, setGroupedNotices] = useState({});

  useEffect(() => {
    // 실제 fetch('/api/notices') 대신 샘플 데이터 사용
    const sampleData = [
      {
        exchange: '업비트',
        asset: '칼데라(ERA)',
        trade_time: '2025-07-18T01:00:00',
        link: 'https://upbit.com/service_center/notice?id=1234',
      },
      {
        exchange: '업비트',
        asset: '루나(LUNA)',
        trade_time: '2025-07-19T10:00:00',
        link: 'https://upbit.com/service_center/notice?id=5678',
      },
      {
        exchange: '바이낸스',
        asset: 'XAI',
        trade_time: '2025-07-20T16:00:00',
        link: 'https://binance.com/announcement/xai',
      },
      {
        exchange: '빗썸',
        asset: '세럼(SRM)',
        trade_time: '2025-07-18T18:30:00',
        link: 'https://bithumb.com/notice/srm',
      },
    ];

    // 거래소별 그룹핑
    const grouped = sampleData.reduce((acc, item) => {
      acc[item.exchange] = acc[item.exchange] || [];
      acc[item.exchange].push(item);
      return acc;
    }, {});
    setGroupedNotices(grouped);
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
        <h1 className="text-3xl font-bold text-center mb-10">🚨 상장 공지 통합 리스트</h1>

        {Object.keys(groupedNotices).length === 0 ? (
          <p className="text-center text-gray-300">📡 데이터를 불러오는 중입니다...</p>
        ) : (
          <div className="space-y-10 max-w-5xl mx-auto">
            {Object.entries(groupedNotices).map(([exchange, notices]) => (
              <div key={exchange}>
                <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
                  📌 {exchange}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {notices.map((notice, idx) => (
                    <div
                      key={idx}
                      className="bg-[#1F2937] rounded-xl p-4 shadow border border-gray-700 hover:shadow-lg transition"
                    >
                      <div className="text-lg font-bold mb-1">{notice.asset}</div>
                      <div className="text-sm text-gray-300 mb-1">
                        📅 {formatDate(notice.trade_time)}
                      </div>
                      <div className="text-sm text-gray-400 mb-3">
                        ⏳ {getRemainingTime(notice.trade_time)}
                      </div>
                      <a
                        href={notice.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline text-sm"
                      >
                        🔗 공지 바로가기
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
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
  const diff = target - now;
  if (diff < 0) return '이미 시작됨';
  const mins = Math.floor(diff / 1000 / 60);
  const hours = Math.floor(mins / 60);
  const remainMins = mins % 60;
  return `${hours}시간 ${remainMins}분 남음`;
}

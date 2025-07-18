'use client';

import NavBar from '../../components/NavBar';
import { useEffect, useState } from 'react';

export default function NoticePage() {
  const [grouped, setGrouped] = useState({});

  useEffect(() => {
    const sampleData = [
      {
        exchange: '업비트',
        type: '상장',
        asset: '칼데라(ERA)',
        trade_time: '2025-07-18T01:00:00',
        link: 'https://upbit.com/service_center/notice?id=1234',
      },
      {
        exchange: '업비트',
        type: '유의',
        asset: '루나(LUNA)',
        trade_time: '2025-07-19T10:00:00',
        link: 'https://upbit.com/service_center/notice?id=5678',
      },
      {
        exchange: '바이낸스',
        type: '상장',
        asset: 'XAI',
        trade_time: '2025-07-20T16:00:00',
        link: 'https://binance.com/announcement/xai',
      },
      {
        exchange: '빗썸',
        type: '유의',
        asset: '세럼(SRM)',
        trade_time: '2025-07-18T18:30:00',
        link: 'https://bithumb.com/notice/srm',
      }
    ];

    // 1차: 거래소, 2차: 타입(상장/유의)으로 그룹핑
    const groupedData = {};
    for (const item of sampleData) {
      if (!groupedData[item.exchange]) groupedData[item.exchange] = { 상장: [], 유의: [] };
      groupedData[item.exchange][item.type].push(item);
    }
    setGrouped(groupedData);
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
        <h1 className="text-3xl font-bold text-center mb-10">🚨 상장/유의 공지 통합</h1>

        {Object.keys(grouped).length === 0 ? (
          <p className="text-center text-gray-300">📡 데이터를 불러오는 중입니다...</p>
        ) : (
          <div className="space-y-12 max-w-5xl mx-auto">
            {Object.entries(grouped).map(([exchange, types]) => (
              <div key={exchange}>
                <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
                  📌 {exchange}
                </h2>

                {/* 상장 공지 */}
                {types.상장.length > 0 && (
                  <>
                    <h3 className="text-md font-semibold text-green-400 mb-2">✅ 상장 공지</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {types.상장.map((notice, idx) => (
                        <NoticeCard key={idx} notice={notice} />
                      ))}
                    </div>
                  </>
                )}

                {/* 유의 공지 */}
                {types.유의.length > 0 && (
                  <>
                    <h3 className="text-md font-semibold text-yellow-400 mb-2">⚠️ 거래 유의 공지</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {types.유의.map((notice, idx) => (
                        <NoticeCard key={idx} notice={notice} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// 카드 UI 컴포넌트
function NoticeCard({ notice }) {
  const remaining = getRemainingTime(notice.trade_time);
  return (
    <div className="bg-[#1F2937] rounded-xl p-4 shadow border border-gray-700 hover:shadow-lg transition">
      <div className="text-lg font-bold mb-1">{notice.asset}</div>
      <div className="text-sm text-gray-300 mb-1">📅 {formatDate(notice.trade_time)}</div>
      <div className="text-sm text-gray-400 mb-3">⏳ {remaining}</div>
      <a
        href={notice.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:underline text-sm"
      >
        🔗 공지 바로가기
      </a>
    </div>
  );
}

// 시간 포맷
function formatDate(dateStr) {
  const dt = new Date(dateStr);
  return dt.toLocaleString('ko-KR', { hour12: false });
}

// 남은 시간
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

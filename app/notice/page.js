'use client';

import NavBar from '../../components/NavBar';
import { useEffect, useState } from 'react';

export default function NoticePage() {
  const BG = '#101728';
  const TEXT = '#FFFFFF';

  const [grouped, setGrouped] = useState({});

  useEffect(() => {
    const sampleData = [
      { exchange: '업비트', type: '상장', asset: '칼데라(ERA)', trade_time: '2025-07-18T01:00:00', link: 'https://upbit.com/service_center/notice?id=1234' },
      { exchange: '업비트', type: '유의', asset: '루나(LUNA)', trade_time: '2025-07-19T10:00:00', link: 'https://upbit.com/service_center/notice?id=5678' },
      { exchange: '바이낸스', type: '상장', asset: 'XAI', trade_time: '2025-07-20T16:00:00', link: 'https://binance.com/announcement/xai' },
      { exchange: '바이낸스', type: '유의', asset: 'DOGE', trade_time: '2025-07-21T10:00:00', link: 'https://binance.com/announcement/doge' },
      { exchange: '빗썸', type: '상장', asset: 'ZETA', trade_time: '2025-07-22T15:00:00', link: 'https://bithumb.com/notice/zeta' },
      { exchange: '빗썸', type: '유의', asset: '세럼(SRM)', trade_time: '2025-07-18T18:30:00', link: 'https://bithumb.com/notice/srm' },
    ];

    const groupedData = {};
    for (const item of sampleData) {
      if (!groupedData[item.exchange]) groupedData[item.exchange] = { 상장: [], 유의: [] };
      groupedData[item.exchange][item.type].push(item);
    }
    setGrouped(groupedData);
  }, []);

  return (
    <main
      style={{
        background: BG,
        minHeight: '100vh',
        padding: 20,
        fontFamily: 'Pretendard,sans-serif',
        color: TEXT,
        position: 'relative',
      }}
    >
      <NavBar />

      <h1 className="text-3xl font-bold text-center mt-10 mb-10">🚨 거래소별 통합 상장공지 상폐공지 (*현재 샘플이고 개발중임다) </h1>

      {Object.keys(grouped).length === 0 ? (
        <p className="text-center text-gray-300">📡 데이터를 불러오는 중입니다...</p>
      ) : (
        <div className="space-y-16 max-w-6xl mx-auto">
          {Object.entries(grouped).map(([exchange, types]) => (
            <div key={exchange}>
              <h2 className="text-xl font-semibold mb-6 border-b border-gray-700 pb-2">
                📌 {exchange}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 상장 공지 */}
                <div>
                  <h3 className="text-md font-semibold text-green-400 mb-3">✅ 상장 공지</h3>
                  {types.상장.length === 0 ? (
                    <p className="text-gray-500 text-sm">상장 공지가 없습니다.</p>
                  ) : (
                    <div className="space-y-3">
                      {types.상장.map((notice, idx) => (
                        <NoticeCard key={idx} notice={notice} />
                      ))}
                    </div>
                  )}
                </div>

                {/* 거래 유의 공지 */}
                <div>
                  <h3 className="text-md font-semibold text-yellow-400 mb-3">⚠️ 거래 유의 공지</h3>
                  {types.유의.length === 0 ? (
                    <p className="text-gray-500 text-sm">거래 유의 공지가 없습니다.</p>
                  ) : (
                    <div className="space-y-3">
                      {types.유의.map((notice, idx) => (
                        <NoticeCard key={idx} notice={notice} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

// 카드 컴포넌트
function NoticeCard({ notice }) {
  const remaining = getRemainingTime(notice.trade_time);
  return (
    <div className="bg-[#1F2937] rounded-xl p-4 shadow border border-gray-700 hover:shadow-lg transition">
      <div className="text-lg font-bold mb-1">{notice.asset}</div>
      <div className="text-sm text-gray-300 mb-1">📅 {formatDate(notice.trade_time)}</div>
      <div className="text-sm text-gray-400 mb-2">⏳ {remaining}</div>
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

function formatDate(dateStr) {
  const dt = new Date(dateStr);
  return dt.toLocaleString('ko-KR', { hour12: false });
}

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

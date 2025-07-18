'use client';

import NavBar from '../../components/NavBar';
import { useEffect, useState } from 'react';

// ✅ 더미 데이터(업비트 상장/유의는 실시간 fetch로 덮어씀)
const sampleData = [
  {
    exchange: '업비트',
    type: '상장',
    asset: '칼데라(ERA)',
    trade_time: '2025-07-18T01:00:00',
    link: 'https://upbit.com/service_center/notice?id=1234',
    title: '더미 상장 공지',
    listed_at: '2025-07-18T00:57:01+09:00',
    first_listed_at: '2025-07-17T18:01:37+09:00'
  },
  {
    exchange: '업비트',
    type: '유의',
    asset: '루나(LUNA)',
    trade_time: '2025-07-19T10:00:00',
    link: 'https://upbit.com/service_center/notice?id=5678',
    title: '더미 유의 공지',
    listed_at: '2025-07-19T10:00:00',
    first_listed_at: '2025-07-19T10:00:00'
  },
  {
    exchange: '바이낸스',
    type: '상장',
    asset: 'XAI',
    trade_time: '2025-07-20T16:00:00',
    link: 'https://binance.com/announcement/xai',
    title: '더미 상장 공지',
    listed_at: '2025-07-20T16:00:00',
    first_listed_at: '2025-07-20T16:00:00'
  },
  {
    exchange: '빗썸',
    type: '유의',
    asset: '세럼(SRM)',
    trade_time: '2025-07-18T18:30:00',
    link: 'https://bithumb.com/notice/srm',
    title: 'Bithumb Notice',
    listed_at: '2025-07-18T18:30:00',
    first_listed_at: '2025-07-18T18:30:00'
  }
];

export default function NoticePage() {
  const BG = '#101728';
  const TEXT = '#FFFFFF';

  const [grouped, setGrouped] = useState({});
  const [sample, setSample] = useState(sampleData);

  // ✅ 업비트 상장 공지 실시간 fetch
  useEffect(() => {
    async function fetchNotice() {
      try {
        const res = await fetch("https://noticebot-production.up.railway.app/latest_notice");
        const data = await res.json();

        if (data.assets && Array.isArray(data.assets)) {
          const notices = data.assets.map(asset => ({
            exchange: "업비트",
            type: "상장",
            asset: asset.asset,
            trade_time: asset.trade_time,
            link: `https://upbit.com/service_center/notice?id=${data.id}`,
            title: data.title,
            listed_at: data.listed_at,
            first_listed_at: data.first_listed_at
          }));

          const filtered = sampleData.filter(
            n => !(n.exchange === '업비트' && n.type === '상장')
          );
          setSample([...notices, ...filtered]);
        } else {
          setSample(sampleData);
        }
      } catch {
        setSample(sampleData);
      }
    }
    fetchNotice();
    const interval = setInterval(fetchNotice, 10000);
    return () => clearInterval(interval);
  }, []);

  // ✅ 업비트 거래 유의 공지 실시간 fetch
  useEffect(() => {
    async function fetchNoticeWarn() {
      try {
        const res = await fetch("https://noticebot-production.up.railway.app/latest_notice_warn");
        const data = await res.json();

        if (data && data.title && data.id) {
          const warnNotice = {
            exchange: "업비트",
            type: "유의",
            asset: "",
            title: data.title,
            link: `https://upbit.com/service_center/notice?id=${data.id}`,
          };
          // 기존 샘플에서 업비트 유의 제외 + 새 유의 추가
          const filtered = sample.filter(
            n => !(n.exchange === '업비트' && n.type === '유의')
          );
          setSample([warnNotice, ...filtered]);
        }
      } catch {
        // 실패 시 아무것도 안함(기존 더미 유지)
      }
    }
    fetchNoticeWarn();
    const interval = setInterval(fetchNoticeWarn, 10000);
    return () => clearInterval(interval);
  }, [sample]);

  useEffect(() => {
    setGrouped(groupByExchangeAndType(sample));
  }, [sample]);

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
      <h1 className="text-3xl font-bold text-center mt-10 mb-10">
        🚨 거래소별 통합 상장공지 상폐공지
      </h1>
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
                {/* ✅ 상장 공지 */}
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

                {/* ⚠️ 거래 유의 공지 */}
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

// ✅ type별 렌더링 분기(유의 공지는 제목+링크만)
function NoticeCard({ notice }) {
  if (notice.type === "유의") {
    return (
      <div className="bg-[#1F2937] rounded-xl p-4 shadow border border-gray-700 hover:shadow-lg transition">
        <div className="text-md font-bold mb-1">⚠️ {notice.title}</div>
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

  // 상장 공지(기존)
  const remaining = getRemainingTime(notice.trade_time);
  const isStarted = remaining === '이미 시작됨';
  return (
    <div className="bg-[#1F2937] rounded-xl p-4 shadow border border-gray-700 hover:shadow-lg transition">
      <div className="text-lg font-bold mb-1">{notice.asset}</div>
      <div className="text-sm text-gray-300 mb-1">
        📅 {isStarted ? '상장' : '상장예정'}: {formatDate(notice.trade_time)}
      </div>
      {isStarted ? (
        <div className="text-sm text-red-400 mb-1">⏳ 이미 시작됨</div>
      ) : (
        <div className="text-sm text-gray-400 mb-1">⏳ {remaining}</div>
      )}
      <div className="text-sm text-gray-400 mb-1">📝 {notice.title}</div>
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

function groupByExchangeAndType(data) {
  const grouped = {};
  for (const item of data) {
    if (!grouped[item.exchange]) grouped[item.exchange] = { 상장: [], 유의: [] };
    grouped[item.exchange][item.type].push(item);
  }
  return grouped;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const parsed = dateStr.replace('KST', '').replace('UTC', '').trim();
  const dt = new Date(parsed);
  if (isNaN(dt)) return dateStr;
  return dt.toLocaleString('ko-KR', { hour12: false });
}

function getRemainingTime(dateStr) {
  if (!dateStr) return "";
  const now = new Date();
  const parsed = dateStr.replace('KST', '').replace('UTC', '').trim();
  const target = new Date(parsed);
  const diff = target - now;
  if (isNaN(target)) return "";
  if (diff < 0) return '이미 시작됨';
  const mins = Math.floor(diff / 1000 / 60);
  const hours = Math.floor(mins / 60);
  const remainMins = mins % 60;
  return `${hours}시간 ${remainMins}분 남음`;
}

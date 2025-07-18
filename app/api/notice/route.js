import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch(
      'https://api-manager.upbit.com/api/v1/announcements?category=trade&page=1&per_page=10',
      {
        headers: {
          'accept': 'application/json',
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: '업비트 API 응답 오류' }, { status: 500 });
    }

    const json = await res.json();
    const notices = json.data?.notices || [];

    const filtered = notices
      .filter(n => n.title.includes('거래지원') || n.title.includes('거래 유의'))
      .map(n => {
        const type = n.title.includes('거래 유의') ? '유의' : '상장';
        const asset = extractAsset(n.title);
        const trade_time = extractTradeTime(n.body) || n.listed_at;

        return {
          exchange: '업비트',
          type,
          asset,
          trade_time,
          link: `https://upbit.com/service_center/notice?id=${n.id}`,
        };
      });

    return NextResponse.json(filtered);
  } catch (e) {
    console.error('업비트 route.js 오류:', e);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}

// ✅ 제목에서 코인명 추출
function extractAsset(title) {
  const match = title.match(/^(.+?)\s?\(/); // 예: "칼데라(ERA) ..." → "칼데라"
  return match ? match[1].trim() : '상장코인';
}

// ✅ 본문에서 상장 시각 추출 (간단 정규식)
function extractTradeTime(body) {
  if (!body) return null;
  const match = body.match(/(\d{4}-\d{2}-\d{2} \d{2}:\d{2})/); // 예: 2025-07-18 01:00
  return match ? match[1] + ':00' : null;
}

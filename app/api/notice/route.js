import { NextResponse } from 'next/server';

// ✅ 업비트 상장공지 키워드 (기존 봇과 동일)
const listingKeywords = ['신규 거래지원 안내', '디지털 자산 추가'];

// ✅ 공지 유형 분류 함수
function getNoticeType(title) {
  if (title.includes('거래 유의')) return '유의';
  if (listingKeywords.some(keyword => title.includes(keyword))) return '상장';
  return null;
}

// ✅ 제목에서 자산명 추출
function extractAsset(title) {
  const match = title.match(/^(.+?)\s?\(/); // "칼데라(ERA) ..." → "칼데라"
  if (match) return match[1].trim();

  const alt = title.split(' ').find(word => word.includes('거래지원') || word.includes('유의'));
  return alt ? title.split(alt)[0].trim() : '코인';
}

// ✅ 본문에서 거래시각 추출 (간단한 정규식)
function extractTradeTime(body) {
  if (!body) return null;
  const match = body.match(/(\d{4}-\d{2}-\d{2} \d{2}:\d{2})/); // "2025-07-18 01:00"
  return match ? match[1] + ':00' : null;
}

export async function GET() {
  try {
    const url = 'https://api-manager.upbit.com/api/v1/announcements?category=trade&page=1&per_page=10';

    const res = await fetch(url, {
      headers: {
        'accept': 'application/json, text/plain, */*',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/115.0.0.0 Safari/537.36',
        'referer': 'https://upbit.com/',
      },
    });

    if (!res.ok) {
      console.error(`[업비트 API 오류] 상태코드: ${res.status}`);
      return NextResponse.json({ error: '업비트 API 응답 오류' }, { status: 500 });
    }

    const json = await res.json();
    const notices = json.data?.notices || [];

    const filtered = notices
      .map(n => {
        const type = getNoticeType(n.title);
        if (!type) return null;

        return {
          exchange: '업비트',
          type, // '상장' 또는 '유의'
          asset: extractAsset(n.title),
          trade_time: extractTradeTime(n.body) || n.listed_at,
          link: `https://upbit.com/service_center/notice?id=${n.id}`,
        };
      })
      .filter(Boolean);

    return NextResponse.json(filtered);
  } catch (e) {
    console.error('업비트 route.js 예외:', e);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}

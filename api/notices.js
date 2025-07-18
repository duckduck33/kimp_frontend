import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = 3030;

app.get('/api/notices', async (req, res) => {
  try {
    const url = 'https://api-manager.upbit.com/api/v1/announcements?category=trade&page=1&per_page=10';

    const upbitRes = await fetch(url, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Referer': 'https://upbit.com/',
        'Origin': 'https://upbit.com',
        'Accept-Encoding': 'gzip, deflate, br',
      },
    });

    if (!upbitRes.ok) {
      console.error('[업비트 응답 오류]', upbitRes.status);
      return res.status(500).json({ error: '업비트 API 응답 오류' });
    }

    const json = await upbitRes.json();
    const notices = json.data?.notices || [];

    const listingKeywords = ['신규 거래지원 안내', '디지털 자산 추가'];

    const result = notices
      .map(n => {
        const type = n.title.includes('거래 유의')
          ? '유의'
          : listingKeywords.some(k => n.title.includes(k))
          ? '상장'
          : null;
        if (!type) return null;

        const asset = extractAsset(n.title);
        const trade_time = extractTradeTime(n.body) || n.listed_at;

        return {
          exchange: '업비트',
          type,
          asset,
          trade_time,
          link: `https://upbit.com/service_center/notice?id=${n.id}`,
        };
      })
      .filter(Boolean);

    res.json(result);
  } catch (e) {
    console.error('[프록시 오류]', e);
    res.status(500).json({ error: '서버 에러' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 프록시 서버 실행 중: http://localhost:${PORT}/api/notices`);
});

// 유틸
function extractAsset(title) {
  const match = title.match(/^(.+?)\s?\(/);
  return match ? match[1].trim() : '상장코인';
}

function extractTradeTime(body) {
  if (!body) return null;
  const match = body.match(/(\d{4}-\d{2}-\d{2} \d{2}:\d{2})/);
  return match ? match[1] + ':00' : null;
}

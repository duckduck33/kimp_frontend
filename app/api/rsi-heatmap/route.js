import { NextResponse } from 'next/server';
import { calculateRSI } from '@/utils/calculations';

const BYBIT_TIMEFRAMES = { '5m': '5', '15m': '15', '1h': '60', '4h': '240', '1d': 'D' };

// getTop30Symbols 함수를 GET 핸들러 위에 한 번만 정의합니다.
async function getTop30Symbols() {
  try {
    const response = await fetch('https://api.bybit.com/v5/market/tickers?category=linear');
    const data = await response.json();
    if (data.retCode !== 0) throw new Error(data.retMsg);
    return data.result.list
      .sort((a, b) => parseFloat(b.turnover24h) - parseFloat(a.turnover24h))
      .slice(0, 30);
  } catch (error) {
    console.error("Error fetching top symbols:", error);
    return [];
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const selectedTimeframe = searchParams.get('timeframe') || '15m';
    const bybitInterval = BYBIT_TIMEFRAMES[selectedTimeframe];
    if (!bybitInterval) return NextResponse.json({ error: 'Invalid timeframe' }, { status: 400 });

    const topTickers = await getTop30Symbols(); // Ticker 정보에는 가격이 포함되어 있음
    const results = await Promise.all(
      topTickers.map(async (ticker) => {
        const res = await fetch(`https://api.bybit.com/v5/market/kline?category=linear&symbol=${ticker.symbol}&interval=${bybitInterval}&limit=100`);
        const klineData = await res.json();
        const rsi = (klineData.retCode === 0 && klineData.result.list.length > 0)
          ? calculateRSI(klineData.result.list.map(k => parseFloat(k[4])).reverse())
          : null;
        
        return {
          symbol: ticker.symbol,
          price: parseFloat(ticker.lastPrice),
          rsi: rsi
        };
      })
    );
    return NextResponse.json(results);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
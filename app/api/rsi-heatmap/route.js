import { NextResponse } from 'next/server';
import { calculateRSI } from '@/utils/calculations';

// 모든 시간대를 정의
const ALL_TIMEFRAMES = {
  '5m': '5', '15m': '15', '1h': '60', '4h': '240', '1d': 'D'
};

async function getTopSymbols() {
  // 거래대금 상위 30개 종목을 가져오는 로직 (이전과 동일)
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
    const topTickers = await getTopSymbols();
    if (topTickers.length === 0) {
      return NextResponse.json({ error: 'Could not retrieve top symbols.' }, { status: 500 });
    }

    const results = await Promise.all(
      topTickers.map(async (ticker) => {
        const rsiData = {};
        // 각 코인에 대해 모든 시간봉의 RSI를 계산
        for (const [display, interval] of Object.entries(ALL_TIMEFRAMES)) {
          const res = await fetch(`https://api.bybit.com/v5/market/kline?category=linear&symbol=${ticker.symbol}&interval=${interval}&limit=100`);
          const klineData = await res.json();
          if (klineData.retCode === 0 && klineData.result.list.length > 0) {
            const closePrices = klineData.result.list.map(k => parseFloat(k[4])).reverse();
            rsiData[`rsi_${display}`] = calculateRSI(closePrices);
          } else {
            rsiData[`rsi_${display}`] = null;
          }
        }

        // 최종 데이터 구조: 심볼, 현재가, 모든 시간봉의 RSI
        return {
          symbol: ticker.symbol,
          price: parseFloat(ticker.lastPrice),
          ...rsiData
        };
      })
    );

    return NextResponse.json(results);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'FailedS to fetch data' }, { status: 500 });
  }
}
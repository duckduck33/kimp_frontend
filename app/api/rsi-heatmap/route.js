import { NextResponse } from 'next/server';
import { calculateRSI } from '@/utils/calculations';

const TIMEFRAMES = {
  '15m': '15',
  '1h': '60',
  '4h': '240',
  '1d': 'D',
};

async function getTop30SymbolsByVolume() {
  // ... (이 함수 내용은 변경 없음) ...
  try {
    const response = await fetch('https://api.bybit.com/v5/market/tickers?category=linear');
    const data = await response.json();
    if (data.retCode !== 0 || !data.result || !data.result.list) {
      throw new Error('Failed to fetch tickers from Bybit API.');
    }
    const symbols = data.result.list
      .sort((a, b) => parseFloat(b.turnover24h) - parseFloat(a.turnover24h))
      .slice(0, 30)
      .map(ticker => ticker.symbol);
    return symbols;
  } catch (error) {
    console.error("Error fetching top symbols:", error);
    return [];
  }
}

// export default async function handler(req, res) { ... } -> 이 부분이 변경됨
export async function GET(request) {
  try {
    const topSymbols = await getTop30SymbolsByVolume();
    if (topSymbols.length === 0) {
      return NextResponse.json({ error: 'Could not retrieve top symbols.' }, { status: 500 });
    }

    const results = await Promise.all(
      topSymbols.flatMap((symbol) =>
        Object.entries(TIMEFRAMES).map(async ([display, bybitInterval]) => {
          const response = await fetch(
            `https://api.bybit.com/v5/market/kline?category=linear&symbol=${symbol}&interval=${bybitInterval}&limit=100`
          );
          const data = await response.json();
          if (data.retCode !== 0 || !data.result || !data.result.list) {
            console.error(`Error fetching kline for ${symbol} ${display}:`, data.retMsg);
            return { symbol, timeframe: display, rsi: null, error: data.retMsg };
          }
          const klines = data.result.list.reverse();
          const closePrices = klines.map((k) => parseFloat(k[4]));
          const rsi = calculateRSI(closePrices);
          return { symbol, timeframe: display, rsi: rsi };
        })
      )
    );
    // res.status(200).json(...) -> 이 부분이 변경됨
    return NextResponse.json(results.flat());
  } catch (error) {
    console.error('API Error:', error);
    // res.status(500).json(...) -> 이 부분이 변경됨
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
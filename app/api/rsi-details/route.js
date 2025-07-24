import { NextResponse } from 'next/server';
import { calculateRSI } from '@/utils/calculations';

const ALL_TIMEFRAMES = { '5m': '5', '15m': '15', '1h': '60', '4h': '240', '1d': 'D' };

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');

    if (!symbol) {
        return NextResponse.json({ error: 'Symbol parameter is required' }, { status: 400 });
    }

    try {
        const rsiData = {};
        for (const [display, interval] of Object.entries(ALL_TIMEFRAMES)) {
            const res = await fetch(`https://api.bybit.com/v5/market/kline?category=linear&symbol=${symbol}&interval=${interval}&limit=100`);
            const klineData = await res.json();
            rsiData[`rsi_${display}`] = (klineData.retCode === 0 && klineData.result.list.length > 0)
                ? calculateRSI(klineData.result.list.map(k => parseFloat(k[4])).reverse())
                : null;
        }
        return NextResponse.json(rsiData);
    } catch (error) {
        console.error(`Error fetching details for ${symbol}:`, error);
        return NextResponse.json({ error: 'Failed to fetch RSI details' }, { status: 500 });
    }
}
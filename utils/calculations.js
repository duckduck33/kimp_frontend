/**
 * 종가 배열을 기반으로 RSI(Relative Strength Index)를 계산합니다.
 * @param {number[]} closePrices - 종가 데이터 배열 (오래된 순 -> 최신 순)
 * @param {number} period - RSI 계산 기간 (기본값: 14)
 * @returns {number | null} 계산된 RSI 값 또는 계산 불가 시 null
 */
export function calculateRSI(closePrices, period = 14) {
  if (closePrices.length <= period) {
    return null; // 데이터가 충분하지 않으면 계산 불가
  }

  const changes = closePrices.slice(1).map((price, i) => price - closePrices[i]);
  const gains = changes.map(change => (change > 0 ? change : 0));
  const losses = changes.map(change => (change < 0 ? -change : 0));

  let avgGain = gains.slice(0, period).reduce((acc, val) => acc + val, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((acc, val) => acc + val, 0) / period;

  for (let i = period; i < gains.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
  }
  
  if (avgLoss === 0) {
    return 100; // 손실이 전혀 없으면 RSI는 100
  }

  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));

  return parseFloat(rsi.toFixed(2)); // 소수점 2자리까지 반올림
}
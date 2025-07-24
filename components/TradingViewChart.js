'use client';

import React, { useEffect, useRef, memo } from 'react';

function TradingViewChart({ symbol }) {
  const container = useRef();

  useEffect(() => {
    // 위젯이 이미 생성되었다면 다시 생성하지 않도록 스크립트를 지웁니다.
    if (container.current.querySelector('script')) {
        container.current.innerHTML = '';
    }

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "autosize": true,
        "symbol": "BYBIT:${symbol}.P",
        "interval": "60",
        "timezone": "Asia/Seoul",
        "theme": "dark",
        "style": "1",
        "locale": "kr",
        "enable_publishing": false,
        "allow_symbol_change": true,
        "support_host": "https://www.tradingview.com"
      }`;
    container.current.appendChild(script);
  }, [symbol]); // symbol이 바뀔 때마다 차트를 새로 그립니다.

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%"}}>
      <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
    </div>
  );
}

// 심볼이 변경될 때만 리렌더링 하도록 memo 사용
export default memo(TradingViewChart);
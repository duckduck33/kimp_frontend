'use client';
import { useEffect, useState } from "react";
import useWebSocket from 'react-use-websocket';

const WS_URL = "ws://localhost:8000/ws/kimp"; // FastAPI WS 엔드포인트

export default function Home() {
  const [coins, setCoins] = useState([]);

  // useWebSocket 훅으로 실시간 수신
  const { lastMessage } = useWebSocket(WS_URL, {
    shouldReconnect: () => true,
    reconnectAttempts: 100,
    reconnectInterval: 3000,
  });

  useEffect(() => {
    if (lastMessage && lastMessage.data) {
      try {
        setCoins(JSON.parse(lastMessage.data));
      } catch {}
    }
  }, [lastMessage]);

  return (
    <main style={{ padding: 32, background: "#101728", minHeight: "100vh", fontFamily: "Pretendard, sans-serif" }}>
      <h1 style={{ color: "#fff", fontSize: "2.2rem", marginBottom: 20 }}>
        실시간 김프(업비트-바이비트)
      </h1>
      <div style={{ overflowX: "auto" }}>
        <table style={{
          borderCollapse: "collapse",
          width: "100%",
          minWidth: 600,
          background: "#181f2b",
          color: "white",
        }}>
          <thead>
            <tr style={{ background: "#232d3f" }}>
              <th style={thStyle}>코인</th>
              <th style={thStyle}>업비트(KRW)</th>
              <th style={thStyle}>바이비트(USDT)</th>
              {/* <th style={thStyle}>환율</th> */}
              <th style={thStyle}>바이비트(원화환산)</th>
              <th style={thStyle}>김프(%)</th>
            </tr>
          </thead>
          <tbody>
            {coins.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: 20 }}>대기중...</td></tr>
            )}
            {coins.map(row => (
              <tr key={row.coin}>
                <td style={tdStyle}>{row.coin}</td>
                <td style={tdStyle}>{row.upbit_krw.toLocaleString()}</td>
                <td style={tdStyle}>{row.bybit_usdt}</td>
                {/* <td style={tdStyle}>{row.usd_krw}</td> */}
                <td style={tdStyle}>{row.bybit_krw.toLocaleString()}</td>
                <td style={{
                  ...tdStyle,
                  color: row.kimp_percent > 0
                    ? "#FF4760"
                    : row.kimp_percent < 0
                    ? "#42f579"
                    : "white"
                }}>{row.kimp_percent}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

const thStyle = {
  padding: "9px 13px",
  border: "1px solid #303952",
  fontWeight: "bold",
  background: "#232d3f",
};
const tdStyle = {
  padding: "8px 12px",
  border: "1px solid #232d3f",
  fontSize: 16,
};

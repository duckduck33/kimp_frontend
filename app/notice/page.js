'use client';

import { useEffect, useState, useRef } from 'react';
import useWebSocket from 'react-use-websocket';
import NavBar from '../../components/NavBar'; // 반드시 맨 위에 import!

export default function HomePage() {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#fff',
        backgroundColor: '#101728',
        fontFamily: 'Pretendard, sans-serif',
      }}
    >
      개발중입니다
    </div>
  );
}
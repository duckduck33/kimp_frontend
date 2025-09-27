'use client';

import React, { useState, useEffect } from 'react';
import NavBar from '../../components/NavBar';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const BG = '#101728';
const CARD_BG = '#181f2b';
const ACCENT = '#FFD700';
const TEXT = '#fff';

export default function CalendarPage() {
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    // 페이지 로드 시 로딩 상태 해제
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <main style={{ 
      background: BG, 
      minHeight: '100vh', 
      fontFamily: 'Pretendard, sans-serif', 
      color: TEXT,
      padding: isMobile ? '10px' : '20px'
    }}>
      <NavBar />
      
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        {/* 페이지 제목 */}
        <h1 style={{
          fontSize: isMobile ? '1.8rem' : '2.5rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginTop: isMobile ? '1rem' : '2rem',
          marginBottom: isMobile ? '1rem' : '2rem',
          color: ACCENT,
          textShadow: '0 0 10px rgba(255, 215, 0, 0.3)',
          padding: isMobile ? '0 10px' : '0'
        }}>
          📊 포비트 경제 & 암호화폐 이벤트 대시보드
        </h1>
        
        {/* SEO를 위한 숨겨진 텍스트 */}
        <div style={{ display: 'none' }}>
          <h2>포비트앱 경제캘린더</h2>
          <p>포비트는 실시간 경제 이벤트와 암호화폐 관련 소식을 한눈에 볼 수 있는 경제캘린더를 제공합니다. 포비트앱의 경제캘린더로 투자 타이밍을 놓치지 마세요.</p>
        </div>

        {/* 로딩 화면 */}
        {isLoading && (
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: ACCENT,
            fontWeight: '700',
            fontSize: '20px',
            zIndex: 1000
          }}>
            데이터를 불러오는 중...
          </div>
        )}

        {/* 메인 컨테이너 */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          opacity: isLoading ? 0.3 : 1,
          transition: 'opacity 0.5s ease-in-out'
        }}>
          
          {/* 경제 이벤트 위젯 */}
          <div style={{
            width: isMobile ? '100%' : '800px',
            maxWidth: '100%',
            backgroundColor: CARD_BG,
            padding: isMobile ? '15px' : '20px',
            borderRadius: '20px',
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.2)',
            border: '1px solid rgba(255, 215, 0, 0.1)'
          }}>
            <h2 style={{
              textAlign: 'center',
              marginBottom: isMobile ? '15px' : '20px',
              color: ACCENT,
              fontSize: isMobile ? '1.2rem' : '1.5rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              flexWrap: 'wrap'
            }}>
              📊 경제 이벤트 (금리·CPI·파월 발언)
            </h2>
            
            <div style={{
              width: '100%',
              height: isMobile ? '400px' : '600px',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}>
              <iframe 
                src="https://sslecal2.investing.com?columns=exc_flags,exc_currency,exc_importance,exc_actual,exc_forecast,exc_previous&category=_employment,_economicActivity,_inflation,_credit,_centralBanks,_confidenceIndex,_balance,_Bonds&importance=3&features=datepicker,timezone&countries=5&calType=week&timeZone=88&lang=18"
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  borderRadius: '12px'
                }}
                title="경제 이벤트 캘린더"
                allowTransparency="true"
                marginWidth="0"
                marginHeight="0"
              />
            </div>
            
            <div style={{
              marginTop: '15px',
              padding: '10px',
              backgroundColor: 'rgba(255, 215, 0, 0.1)',
              borderRadius: '8px',
              fontSize: isMobile ? '0.8rem' : '0.9rem',
              color: '#ccc',
              textAlign: 'center',
              lineHeight: '1.4'
            }}>
              💡 실시간 경제 지표와 중앙은행 발언을 확인하세요
            </div>
          </div>
        </div>

        {/* 하단 정보 */}
        <div style={{
          marginTop: isMobile ? '2rem' : '3rem',
          padding: isMobile ? '15px' : '20px',
          backgroundColor: CARD_BG,
          borderRadius: '15px',
          textAlign: 'center',
          border: '1px solid rgba(255, 215, 0, 0.1)',
          maxWidth: '800px',
          margin: `${isMobile ? '2rem' : '3rem'} auto 0 auto`
        }}>
          <h3 style={{ 
            color: ACCENT, 
            marginBottom: '15px',
            fontSize: isMobile ? '1.3rem' : '1.5rem'
          }}>
            📈 경제 이벤트 활용 가이드
          </h3>
          <div style={{ 
            textAlign: 'left' 
          }}>
            <div>
              <h4 style={{ color: '#42f579', marginBottom: '8px', fontSize: isMobile ? '1rem' : '1.1rem' }}>
                🏛️ 경제 이벤트
              </h4>
              <p style={{ color: '#ccc', fontSize: isMobile ? '0.8rem' : '0.9rem', lineHeight: '1.5' }}>
                • 연준 금리 결정일과 CPI 발표일은 시장 변동성이 큰 날입니다<br/>
                • 파월 의장 발언은 암호화폐 시장에도 큰 영향을 미칩니다<br/>
                • 고중요도 이벤트는 빨간색으로 표시됩니다<br/>
                • 경제 지표 발표 전후로 투자 포지션을 조정하세요
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

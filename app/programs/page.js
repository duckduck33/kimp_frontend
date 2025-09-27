'use client';

import React, { useState, useEffect } from 'react';
import NavBar from '../../components/NavBar';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const BG = '#101728';
const CARD_BG = '#181f2b';
const ACCENT = '#FFD700';
const TEXT = '#fff';

export default function ProgramsPage() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const programs = [
    {
      id: 1,
      title: "알트코인 폭등감시봇",
      description: "수천종류 알트 코인들의 TVL과 시가총액을 분석하여 상대적으로 저평가된 코인, 떡상할 가능성이 높은 코인을 알려줍니다.",
      features: [
        "TVL 분석",
        "시가총액 분석",
        "저평가 코인 탐지",
        "폭등 가능성 예측"
      ],
      image: "/image01.png"
    },
    {
      id: 2,
      title: "업비트 상장 감시봇",
      description: "3~5초 간격으로 업비트 공지사항을 모니터링하고 바이낸스 선물의 코인리스트를 비교하여 상장코인을 발견하면 롱포지션 또는 숏포지션 진입을 합니다.",
      features: [
        "실시간 공지사항 모니터링",
        "바이낸스 선물 비교",
        "자동 포지션 진입",
        "롱/숏 포지션 지원"
      ],
      image: "/image02.png"
    },
    {
      id: 3,
      title: "바이낸스 상장폐지 감시봇",
      description: "3~5초마다 바이낸스 상폐 공지사항과 제목을 모니터링하고 바이낸스 선물거래소의 코인리스트를 비교하여 상폐코인을 발견하면 숏포지션 진입을 합니다.",
      features: [
        "상폐 공지사항 모니터링",
        "선물거래소 비교",
        "자동 숏포지션 진입",
        "상폐 코인 탐지"
      ],
      image: "/image03.png"
    },
    {
      id: 4,
      title: "트레이딩뷰지표 자동매매봇",
      description: "트레이딩뷰 지표를 선택한 봇이 시그널을 읽고 자동으로 매매를 진행합니다.",
      features: [
        "트레이딩뷰 지표 선택",
        "시그널 자동 읽기",
        "자동 매매 실행",
        "맞춤형 설정"
      ],
      image: "/image04.png"
    }
  ];

  return (
    <main style={{ 
      background: BG, 
      minHeight: '100vh', 
      fontFamily: 'Pretendard, sans-serif', 
      color: TEXT,
      padding: isMobile ? '10px' : '20px'
    }}>
      <NavBar />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
          🚀 포비트 | 포비트앱 프로그램 소개
        </h1>
        
        {/* SEO를 위한 숨겨진 텍스트 */}
        <div style={{ display: 'none' }}>
          <h2>포비트 | 포비트앱 자동매매 프로그램</h2>
          <p>포비트는 암호화폐 자동매매를 위한 다양한 프로그램을 제공합니다. 포비트 알트코인 폭등감시봇, 포비트 업비트 상장 감시봇, 포비트 바이낸스 상장폐지 감시봇, 포비트 트레이딩뷰지표 자동매매봇 등 포비트와 포비트앱의 전문적인 자동매매 솔루션을 만나보세요.</p>
          <p>포비트 프로그램, 포비트앱 다운로드, 포비트 자동매매, 포비트 봇, 포비트 투자도구</p>
        </div>

        {/* 프로그램 소개 */}
        <div style={{
          textAlign: 'center',
          marginBottom: isMobile ? '2rem' : '3rem',
          padding: isMobile ? '15px' : '20px',
          backgroundColor: CARD_BG,
          borderRadius: '15px',
          border: '1px solid rgba(255, 215, 0, 0.1)'
        }}>
          <p style={{
            fontSize: isMobile ? '0.9rem' : '1.1rem',
            lineHeight: '1.6',
            color: '#ccc',
            margin: 0
          }}>
            포비트는 암호화폐 시장의 데이터를 분석하여 최적의 투자 기회를 제공하는 종합 플랫폼입니다.<br/>
            포비트와 포비트앱의 각 프로그램은 독립적으로 운영되며, 투자자의 다양한 니즈에 맞춰 설계되었습니다.
          </p>
        </div>

        {/* 프로그램 목록 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap: isMobile ? '1.5rem' : '2rem',
          marginBottom: isMobile ? '2rem' : '3rem'
        }}>
          {programs.map((program) => (
            <div
              key={program.id}
              style={{
                backgroundColor: CARD_BG,
                borderRadius: '20px',
                padding: isMobile ? '20px' : '30px',
                boxShadow: '0 0 20px rgba(255, 215, 0, 0.1)',
                border: '1px solid rgba(255, 215, 0, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(255, 215, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.1)';
              }}
            >
              {/* 프로그램 이미지 */}
              <div style={{
                width: '100%',
                height: isMobile ? '200px' : '250px',
                borderRadius: '15px',
                overflow: 'hidden',
                marginBottom: '20px',
                position: 'relative',
                backgroundColor: '#2a2a2a'
              }}>
                <img
                  src={program.image}
                  alt={program.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '15px'
                  }}
                />
              </div>

              {/* 프로그램 제목 */}
              <h3 style={{
                fontSize: isMobile ? '1.3rem' : '1.5rem',
                fontWeight: 'bold',
                color: ACCENT,
                marginBottom: '15px',
                textAlign: 'center'
              }}>
                {program.title}
              </h3>

              {/* 프로그램 설명 */}
              <p style={{
                fontSize: isMobile ? '0.9rem' : '1rem',
                lineHeight: '1.6',
                color: '#ccc',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                {program.description}
              </p>

              {/* 주요 기능 */}
              <div>
                <h4 style={{
                  fontSize: isMobile ? '1rem' : '1.1rem',
                  fontWeight: 'bold',
                  color: '#42f579',
                  marginBottom: '10px',
                  textAlign: 'center'
                }}>
                  주요 기능
                </h4>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0
                }}>
                  {program.features.map((feature, index) => (
                    <li
                      key={index}
                      style={{
                        fontSize: isMobile ? '0.8rem' : '0.9rem',
                        color: '#ccc',
                        marginBottom: '8px',
                        paddingLeft: '20px',
                        position: 'relative'
                      }}
                    >
                      <span style={{
                        position: 'absolute',
                        left: 0,
                        color: ACCENT,
                        fontWeight: 'bold'
                      }}>
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* 하단 안내 */}
        <div style={{
          textAlign: 'center',
          padding: isMobile ? '20px' : '30px',
          backgroundColor: CARD_BG,
          borderRadius: '15px',
          border: '1px solid rgba(255, 215, 0, 0.1)'
        }}>
          <h3 style={{
            color: ACCENT,
            marginBottom: '15px',
            fontSize: isMobile ? '1.3rem' : '1.5rem'
          }}>
            💡 프로그램 이용 안내
          </h3>
          <p style={{
            fontSize: isMobile ? '0.9rem' : '1rem',
            lineHeight: '1.6',
            color: '#ccc',
            marginBottom: '20px'
          }}>
            각 프로그램은 독립적으로 운영되며, 투자자의 경험과 선호도에 따라 선택하여 이용할 수 있습니다.<br/>
            모든 프로그램은 실시간 데이터를 기반으로 하여 정확하고 신뢰할 수 있는 정보를 제공합니다.
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            <a
              href="https://zamtown.com/fobitapp"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: ACCENT,
                color: '#000',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: isMobile ? '0.9rem' : '1rem',
                transition: 'opacity 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              프로그램무료신청
            </a>
            <a
              href="http://pf.kakao.com/_xlLxcfxj/chat"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: '#FFEB00',
                color: '#000',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: isMobile ? '0.9rem' : '1rem',
                transition: 'opacity 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              프로그램개발문의
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

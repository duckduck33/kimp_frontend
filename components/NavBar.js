"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function NavBar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [navHeight, setNavHeight] = useState(0);

  // 메뉴 링크 정보
  const links = [
    { href: "/", label: "실시간김프" },
    { href: "/goldentime", label: "골든타임 모니터링" },
    { href: "/notice", label: "거래소공지모니터링" },
    { href: "/heatmap", label: "RSI히트맵" },
    { href: "/tradingview", label: "TOP10지표" },
    { href: "/tv_auto", label: "트레이딩뷰 자동매매" },
    { href: "/autobot", label: "골든타임 자동매매" },
    { href: "/board", label: "지표&매매법칼럼" },
  ];

  // NavBar 높이를 측정하여 CSS 변수로 설정
  useEffect(() => {
    const navbarElement = document.querySelector(".navbar");
    if (navbarElement) {
      setNavHeight(navbarElement.offsetHeight);
      document.documentElement.style.setProperty('--nav-height', `${navbarElement.offsetHeight}px`);
    }
  }, []);

  // 페이지 상단 패딩을 동적으로 설정
  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      const navHeight = getComputedStyle(document.documentElement).getPropertyValue('--nav-height');
      if (navHeight) {
        mainElement.style.paddingTop = `calc(${navHeight} + 20px)`;
      }
    }
  }, []);

  // GA4 버튼 클릭 이벤트 함수
  const handleApplyBtnClick = () => {
    // 랜덤 링크선택
    const links = [
      // "https://zamtown.com/ss",
      "https://zamtown.com/fobitapp"
    ];
    const randomLink = links[Math.floor(Math.random() * links.length)];
    
    // 새 창에서 링크 열기
    window.open(randomLink, '_blank', 'noopener,noreferrer');
    
    // GA4 이벤트 추적
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag('event', 'fobit_button', {
        event_category: 'button',
        event_label: '포비트 무료신청',
      });
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          {/* 모바일 햄버거 */}
          <div className="nav-hamburger" onClick={() => setMenuOpen((v) => !v)}>
            <span>☰</span>
          </div>

          {/* 메뉴(PC/모바일) */}
          <div className={`nav-links${menuOpen ? " open" : ""}`}>
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={pathname === href ? "active" : ""}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* 포비트 무료신청 버튼 */}
          <button
            className="apply-btn"
            onClick={handleApplyBtnClick}
          >
            포비트 무료신청
          </button>
        </div>
      </nav>

      {/* 하단 우측 고정 버튼 */}
      <a
        href="http://pf.kakao.com/_xlLxcfxj/chat"
        target="_blank"
        rel="noopener noreferrer"
        className="kakao-btn"
      >
        잠코딩개발문의
      </a>

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          background: #181f2b;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          width: 100%;
          height: var(--nav-height, 70px);
        }
        .navbar-inner {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 20px;
        }
        .nav-links {
          display: flex; gap: 32px;
        }
        .nav-links a {
          color: #fff;
          text-decoration: none;
          font-size: 1.32rem;
          font-weight: 700;
          transition: color 0.2s;
        }
        .nav-links a.active {
          color: #FFD700;
          text-decoration: underline;
        }
        .nav-hamburger {
          display: none;
          font-size: 2.2rem;
          margin-right: 10px;
          cursor: pointer;
        }
        .apply-btn {
          background: #FFEB00;
          color: #000;
          padding: 8px 16px;
          border-radius: 4px;
          font-weight: bold;
          text-decoration: none;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          white-space: nowrap;
          font-size: 1.1rem;
        }
        .kakao-btn {
          position: fixed;
          bottom: 20px; right: 20px;
          background: #FFEB00;
          color: #000;
          padding: 12px 20px;
          border-radius: 6px;
          font-weight: bold;
          text-decoration: none;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          white-space: nowrap;
          z-index: 1000;
          font-size: 1.06rem;
        }
        @media (max-width: 900px) {
          .navbar-inner {
            padding: 10px 10px;
          }
          .nav-hamburger {
            display: block;
          }
          .nav-links {
            display: none;
            position: absolute;
            left: 0; right: 0; top: var(--nav-height, 60px);
            flex-direction: column;
            background: #181f2b;
            box-shadow: 0 6px 16px rgba(0,0,0,0.15);
            padding: 0.7rem 0 0.5rem 1.2rem;
            border-bottom-left-radius: 12px;
            border-bottom-right-radius: 12px;
            gap: 18px;
          }
          .nav-links.open {
            display: flex;
          }
          .nav-links a {
            font-size: 1.05rem;
            padding: 0.4rem 0;
          }
          .apply-btn {
            padding: 6px 8px;
            font-size: 0.98rem;
            border-radius: 4px;
          }
          .kakao-btn {
            padding: 8px 12px;
            font-size: 0.95rem;
          }
        }
      `}</style>
    </>
  );
}

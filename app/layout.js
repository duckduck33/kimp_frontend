'use client';

import NavBar from '@/components/NavBar';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        {/* SEO 메타 태그 */}
        <title>포비트 | 포비트앱 - 암호화폐 자동매매 및 분석 플랫폼</title>
        <meta name="description" content="포비트는 암호화폐 자동매매, 김프 모니터링, RSI 히트맵, 경제캘린더 등 종합적인 투자 분석 도구를 제공하는 플랫폼입니다. 포비트와 포비트앱으로 스마트한 암호화폐 투자를 시작하세요." />
        <meta name="keywords" content="포비트, 포비트앱, 암호화폐, 자동매매, 김프, RSI, 히트맵, 경제캘린더, 업비트, 바이비트, 트레이딩뷰, 투자, 분석, 봇, 알트코인, 폭등감시, 포비트앱, 포비트 플랫폼" />
        <meta name="author" content="포비트" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Open Graph 메타 태그 */}
        <meta property="og:title" content="포비트 | 포비트앱 - 암호화폐 자동매매 및 분석 플랫폼" />
        <meta property="og:description" content="포비트는 암호화폐 자동매매, 김프 모니터링, RSI 히트맵, 경제캘린더 등 종합적인 투자 분석 도구를 제공하는 플랫폼입니다. 포비트와 포비트앱으로 시작하세요." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fobit.app" />
        <meta property="og:image" content="https://fobit.app/og-image.png" />
        <meta property="og:site_name" content="포비트" />
        <meta property="og:locale" content="ko_KR" />
        
        {/* Twitter 메타 태그 */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="포비트 | 포비트앱 - 암호화폐 자동매매 및 분석 플랫폼" />
        <meta name="twitter:description" content="포비트는 암호화폐 자동매매, 김프 모니터링, RSI 히트맵, 경제캘린더 등 종합적인 투자 분석 도구를 제공하는 플랫폼입니다. 포비트와 포비트앱으로 시작하세요." />
        <meta name="twitter:image" content="https://fobit.app/og-image.png" />
        
        {/* 추가 SEO 메타 태그 */}
        <meta name="theme-color" content="#FFD700" />
        <meta name="msapplication-TileColor" content="#FFD700" />
        <link rel="canonical" href="https://fobit.app" />
        
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-C8SVY8E8RQ"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-C8SVY8E8RQ');
            `
          }}
        />
      </head>
      <body className="bg-gray-900 text-white min-h-screen">
        <NavBar />
        <main className="pt-[var(--nav-height)]">
          {children}
        </main>
      </body>
    </html>
  );
}
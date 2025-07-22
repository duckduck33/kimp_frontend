import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "포비트 - 김프/자동매매/공지 모니터링",
  description: "포비트 자동매매는 실시간 김프, 자동매매, 공지 모니터링 기능을 제공하는 암호화폐 투자 지원 플랫폼입니다.",
  keywords: [
    "포비트", "김프", "자동매매", "업비트", "공지 모니터링",
    "비트코인", "가상화폐", "포비트자동매매", "골든타임감시봇", "골든타임모니터링"
  ],
  openGraph: {
    title: "포비트 - 자동매매 & 김프 모니터링",
    description: "포비트는 실시간 암호화폐 도구를 제공합니다.",
    url: "https://fobit.app",
    siteName: "Fobit",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "https://fobit.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Fobit OG 이미지",
      },
    ],
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* Google Analytics GA4 코드 */}
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

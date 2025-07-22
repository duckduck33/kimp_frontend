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
        {/* Google Tag Manager Head 코드 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-PWX8GG8M');
            `
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Tag Manager Body 코드 */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PWX8GG8M"
              height="0" width="0" style="display:none;visibility:hidden"></iframe>`
          }}
        />
        {children}
      </body>
    </html>
  );
}

'use client';

import NavBar from '@/components/NavBar';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
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
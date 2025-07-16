"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "18px 20px",
        background: "#181f2b",
        fontSize: "1.45rem",
        fontWeight: 700,
        width: "100%",
      }}
    >
      {/* 왼쪽 메뉴 그룹 */}
      <div style={{ display: "flex", gap: "32px" }}>
        <Link
          href="/"
          style={{
            color: pathname === "/" ? "#FFD700" : "#fff",
            textDecoration: pathname === "/" ? "underline" : "none",
          }}
        >
          실시간김프
        </Link>
        <Link
          href="/goldentime"
          style={{
            color: pathname === "/goldentime" ? "#FFD700" : "#fff",
            textDecoration:
              pathname === "/goldentime" ? "underline" : "none",
          }}
        >
          골든타임 모니터링
        </Link>
        <Link
          href="/notice"
          style={{
            color: pathname === "/notice" ? "#FFD700" : "#fff",
            textDecoration: pathname === "/notice" ? "underline" : "none",
          }}
        >
          거래소공지모니터링
        </Link>
      </div>

      {/* 오른쪽 버튼 그룹 */}
      <a
        href="http://pf.kakao.com/_xlLxcfxj/chat"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          backgroundColor: "#FFEB00",
          color: "#000",
          padding: "8px 16px",
          borderRadius: "4px",
          fontWeight: "bold",
          textDecoration: "none",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          whiteSpace: "nowrap",
        }}
      >
        잠코딩개발문의
      </a>
    </nav>
  );
}

"use client"; // 꼭 추가!
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const pathname = usePathname();
  return (
    <nav style={{
      display: 'flex',
      gap: '32px',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '18px 0',
      background: '#181f2b',
      fontSize: '1.45rem',
      fontWeight: 700
    }}>
      <Link href="/" style={{
        color: pathname === '/' ? '#FFD700' : '#fff',
        textDecoration: pathname === '/' ? 'underline' : 'none'
      }}>실시간김프</Link>
      <Link href="/goldentime" style={{
        color: pathname === '/goldentime' ? '#FFD700' : '#fff',
        textDecoration: pathname === '/goldentime' ? 'underline' : 'none'
      }}>골든타임 모니터링</Link>
      <Link href="/notice" style={{
        color: pathname === '/notice' ? '#FFD700' : '#fff',
        textDecoration: pathname === '/notice' ? 'underline' : 'none'
      }}>거래소공지모니터링</Link>
    </nav>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Hide on /shop (page has its own UI patterns and a sticky sidebar there)
  if (pathname && pathname.startsWith('/shop')) return null;

  const handleClick = () => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'instant' : 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label="Back to top"
      title="Back to top"
      style={{
        position: 'fixed',
        right: 'clamp(16px, 2vw, 28px)',
        bottom: 'clamp(16px, 2vw, 28px)',
        width: 40,
        height: 40,
        borderRadius: '50%',
        backgroundColor: hover ? '#C9A96E' : 'transparent',
        color: hover ? '#0C0A07' : '#C9A96E',
        border: '1px solid #C9A96E',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 95,
        boxShadow: '0 10px 30px -8px rgba(0,0,0,0.6)',
        opacity: visible ? 1 : 0,
        transform: visible
          ? 'translateY(0) scale(1)'
          : 'translateY(20px) scale(0.85)',
        pointerEvents: visible ? 'auto' : 'none',
        transition:
          'opacity 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 300ms cubic-bezier(0.22, 1, 0.36, 1), background-color 200ms ease, color 200ms ease',
      }}
    >
      <ArrowUp size={16} strokeWidth={1.75} />
    </button>
  );
}

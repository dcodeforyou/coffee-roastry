'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingBag } from 'lucide-react';

const LEFT_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/roast', label: 'Roast' },
  { href: '/journal', label: 'Journal' },
];

const RIGHT_LINKS = [
  { href: '/shop', label: 'Shop', emphasis: 'gold' },
  { href: '/get-in-touch', label: 'Get in Touch', emphasis: 'pill' },
];

const ALL_LINKS = [...LEFT_LINKS, ...RIGHT_LINKS];

function Wordmark({ size = 'md' }) {
  const fontSize =
    size === 'lg' ? '1.6rem' : size === 'sm' ? '1.05rem' : '1.4rem';
  return (
    <span
      className="inline-flex items-baseline select-none"
      style={{
        fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
        fontWeight: 600,
        fontSize,
        letterSpacing: '0.14em',
        color: 'var(--text)',
      }}
    >
      <span>FORMA</span>
      <span
        aria-hidden="true"
        style={{
          color: 'var(--gold)',
          fontStyle: 'italic',
          margin: '0 0.18em',
          display: 'inline-block',
          transform: 'skewX(-14deg) translateY(-1px)',
        }}
      >
        /
      </span>
      <span>ROAST</span>
    </span>
  );
}

export default function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [glowing, setGlowing] = useState(false);
  const prevCountRef = useRef(0);
  const glowTimerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Live cart count — read on mount + on every 'forma-cart-update'
  useEffect(() => {
    const read = () => {
      try {
        const raw = localStorage.getItem('forma-cart');
        if (!raw) return setCartCount(0);
        const arr = JSON.parse(raw);
        if (!Array.isArray(arr)) return setCartCount(0);
        setCartCount(arr.reduce((s, i) => s + (i.qty || 1), 0));
      } catch (_) {
        setCartCount(0);
      }
    };
    read();
    window.addEventListener('forma-cart-update', read);
    window.addEventListener('storage', read);
    return () => {
      window.removeEventListener('forma-cart-update', read);
      window.removeEventListener('storage', read);
    };
  }, [pathname]);

  // Trigger glow when cart count INCREASES (not on initial mount or decrease)
  useEffect(() => {
    if (cartCount > prevCountRef.current) {
      setGlowing(true);
      if (glowTimerRef.current) window.clearTimeout(glowTimerRef.current);
      glowTimerRef.current = window.setTimeout(() => {
        setGlowing(false);
        glowTimerRef.current = null;
      }, 750);
    }
    prevCountRef.current = cartCount;
    return () => {
      if (glowTimerRef.current) {
        window.clearTimeout(glowTimerRef.current);
        glowTimerRef.current = null;
      }
    };
  }, [cartCount]);

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <>
      <header
        className={[
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-bg/95 backdrop-blur-md'
            : 'bg-transparent',
        ].join(' ')}
        style={
          scrolled
            ? { borderBottom: '1px solid var(--border)' }
            : { borderBottom: '1px solid transparent' }
        }
      >
        <nav className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-20">
            {/* Left links */}
            <ul className="hidden md:flex items-center gap-8 flex-1">
              {LEFT_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={`nav-link ${isActive(l.href) ? 'active' : ''}`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Center wordmark */}
            <div className="flex-1 flex justify-start md:justify-center">
              <Link href="/" aria-label="FORMA/ROAST home">
                <Wordmark />
              </Link>
            </div>

            {/* Right links */}
            <ul className="hidden md:flex items-center gap-6 flex-1 justify-end">
              {RIGHT_LINKS.map((l) => {
                if (l.emphasis === 'pill') {
                  return (
                    <li key={l.href} className="inline-flex items-center gap-6">
                      {/* Cart icon button — sits right before the pill */}
                      <Link
                        href="/cart"
                        aria-label={`Cart (${cartCount} item${cartCount === 1 ? '' : 's'})`}
                        className={`forma-cart-icon relative inline-flex items-center justify-center transition ${glowing ? 'glowing' : ''}`}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          color: 'var(--text)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'var(--gold)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--text)';
                        }}
                      >
                        {/* Pulse ring (only animates when .glowing) */}
                        <span
                          aria-hidden="true"
                          className="forma-cart-ring"
                          style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%) scale(1)',
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            border: '1.5px solid rgba(201,169,110,0.6)',
                            opacity: 0,
                            pointerEvents: 'none',
                          }}
                        />
                        <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.5} />
                        {cartCount > 0 && (
                          <span
                            aria-hidden="true"
                            className="forma-cart-badge"
                            style={{
                              position: 'absolute',
                              top: -2,
                              right: -2,
                              minWidth: 18,
                              height: 18,
                              padding: '0 5px',
                              borderRadius: 9,
                              backgroundColor: 'var(--gold)',
                              color: '#0C0A07',
                              fontFamily:
                                "var(--font-dm-sans), 'DM Sans', sans-serif",
                              fontSize: 10,
                              fontWeight: 700,
                              letterSpacing: '0.02em',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              lineHeight: 1,
                              boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
                            }}
                          >
                            {cartCount > 99 ? '99+' : cartCount}
                          </span>
                        )}
                      </Link>
                      <Link href={l.href} className="btn-gold">
                        {l.label}
                      </Link>
                    </li>
                  );
                }
                // SHOP — bold + gold tint
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className={`nav-link ${isActive(l.href) ? 'active' : ''}`}
                      style={{
                        color: 'var(--gold)',
                        fontWeight: 600,
                      }}
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Mobile hamburger */}
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 transition"
              style={{ color: 'var(--gold)' }}
            >
              {menuOpen ? <X className="w-6 h-6" strokeWidth={1.5} /> : <Menu className="w-6 h-6" strokeWidth={1.5} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile full-screen overlay */}
      <div
        className={[
          'fixed inset-0 z-40 md:hidden transition-all duration-300',
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
        style={{ backgroundColor: 'rgba(12,10,7,0.97)' }}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
          className="absolute top-5 right-5 inline-flex items-center justify-center w-10 h-10 transition"
          style={{ color: 'var(--gold)' }}
        >
          <X className="w-6 h-6" strokeWidth={1.5} />
        </button>
        <div className="h-full w-full flex flex-col justify-center items-center px-8">
          <div className="mb-10">
            <Wordmark size="sm" />
          </div>
          <ul className="flex flex-col items-center gap-6 text-center">
            {ALL_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="transition"
                  style={{
                    fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                    fontWeight: 600,
                    fontSize: '2.25rem',
                    color: isActive(l.href) ? 'var(--gold)' : 'var(--text)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/cart"
            onClick={() => setMenuOpen(false)}
            className="mt-12 inline-flex items-center gap-2 text-muted hover:text-gold transition label-tag"
          >
            <ShoppingBag className="w-4 h-4" strokeWidth={1.5} /> Cart
          </Link>

          <div className="absolute bottom-10 left-0 right-0 flex justify-center">
            <span className="label-tag opacity-60">Brooklyn · Est. 2019</span>
          </div>
        </div>
      </div>
    </>
  );
}

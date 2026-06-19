import Link from 'next/link';
import { Instagram, Facebook, AtSign } from 'lucide-react';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/roast', label: 'Roast' },
  { href: '/journal', label: 'Journal' },
  { href: '/shop', label: 'Shop' },
  { href: '/get-in-touch', label: 'Get in Touch' },
];

const SHOP = [
  { href: '/shop?cat=single-origin', label: 'Single Origin' },
  { href: '/shop?cat=blends', label: 'House Blends' },
  { href: '/shop?cat=subscriptions', label: 'Subscriptions' },
  { href: '/shop?cat=gear', label: 'Brew Gear' },
];

const SOCIAL = [
  { href: '#', label: 'Instagram', Icon: Instagram },
  { href: '#', label: 'Facebook', Icon: Facebook },
  { href: '#', label: 'Newsletter', Icon: AtSign },
];

const LEGAL = [
  { href: '#', label: 'Shipping' },
  { href: '#', label: 'Returns' },
  { href: '#', label: 'Privacy' },
  { href: '#', label: 'Terms' },
];

export default function Footer() {
  return (
    <footer
      className="relative mt-24"
      style={{
        backgroundColor: 'var(--surface)',
        color: 'var(--text)',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-20 pb-10">
        {/* Logo centered */}
        <div className="flex justify-center mb-14">
          <Link
            href="/"
            className="inline-flex items-baseline select-none"
            style={{
              fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
              fontWeight: 600,
              fontSize: '1.75rem',
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
                transform: 'skewX(-14deg) translateY(-1px)',
                display: 'inline-block',
              }}
            >
              /
            </span>
            <span>ROAST</span>
          </Link>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-14">
          <FooterColumn title="Navigate">
            {NAV.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="footer-link">
                  {l.label}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Shop">
            {SHOP.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="footer-link">
                  {l.label}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Social">
            {SOCIAL.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="footer-link inline-flex items-center gap-2"
                >
                  <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                  {label}
                </a>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Legal">
            {LEGAL.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="footer-link">
                  {l.label}
                </Link>
              </li>
            ))}
          </FooterColumn>
        </div>

        {/* Bottom row */}
        <div
          className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <p
            className="text-[12px] tracking-[0.04em]"
            style={{ color: 'var(--muted)' }}
          >
            © 2026 FORMA/ROAST. All beans roasted in my DMs.
          </p>
          <p
            className="italic text-[14px]"
            style={{
              fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
              color: 'var(--muted)',
            }}
          >
            Slow craft, every batch.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }) {
  return (
    <div className="flex flex-col gap-5">
      <h4
        className="text-[10px] tracking-[0.22em] uppercase font-semibold"
        style={{
          color: 'var(--gold)',
          fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
        }}
      >
        {title}
      </h4>
      <ul className="flex flex-col gap-3 text-[13px]">{children}</ul>
    </div>
  );
}

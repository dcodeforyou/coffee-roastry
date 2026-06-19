'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Play, Minus, X, ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import CountUp from '@/components/CountUp';
import HeroOrbit from '@/components/HeroOrbit';
import HeroParallax from '@/components/HeroParallax';

/* Render a line of text as per-word .hero-word spans (for load animation)
   each containing per-character .hero-letter spans (for bean/arch collision).
   Each word gets its own animation-delay so words enter staggered. */
function renderLine(text, startDelay = 500) {
  const words = text.split(' ');
  const out = [];
  words.forEach((word, wi) => {
    out.push(
      <span
        key={`w-${wi}-${word}`}
        className="hero-word"
        style={{ animationDelay: `${startDelay + wi * 100}ms` }}
      >
        {word.split('').map((ch, ci) => (
          <span key={ci} className="hero-letter">
            {ch}
          </span>
        ))}
      </span>
    );
    if (wi < words.length - 1) {
      out.push(
        <span
          key={`s-${wi}`}
          aria-hidden="true"
          style={{ display: 'inline-block', width: '0.28em' }}
        >
          {'\u00A0'}
        </span>
      );
    }
  });
  return out;
}

const YT_VIDEO_ID = 'hqaNQy_Alk8';

const MARQUEE_ITEMS = [
  'Single Origin',
  'Hand Roasted',
  'Small Batch',
  'Direct Trade',
  'Ethically Sourced',
  'Specialty Grade',
];

const STATS = [
  { end: 14, prefix: '', suffix: '', label: 'Origins sourced globally' },
  { end: 48, prefix: '< ', suffix: 'h', label: 'From roast to dispatch' },
  { end: 100, prefix: '', suffix: '%', label: 'Direct trade relationships' },
];

const FEATURED = [
  {
    id: 'yirgacheffe',
    name: 'Ethiopia Yirgacheffe',
    meta: 'Single Origin · Light Roast',
    price: '$22',
    img: 'product — Ethiopia Yirgacheffe bag on dark surface',
    imgSrc: '/products/ethiopia-yirgacheffe.jpg',
    tag: 'Single Origin',
  },
  {
    id: 'forma-espresso',
    name: 'FORMA Espresso Blend',
    meta: 'House Blend · Medium-Dark',
    price: '$16',
    img: 'product — FORMA Espresso Blend 250g bag',
    imgSrc: '/products/forma-espresso.jpg',
    tag: 'House Blend',
  },
  {
    id: 'hario-v60',
    name: 'Hario V60 Ceramic',
    meta: 'Brew Gear · Dripper',
    price: '$32',
    img: 'product — Hario V60 white ceramic dripper',
    imgSrc: '/products/hario-v60-ceramic.png',
    tag: 'Brew Gear',
  },
];

const RITUAL = [
  {
    n: '01',
    title: 'The Bean',
    body:
      'We source micro-lots from traceable, ethical farms across Ethiopia, Colombia, and Kenya.',
  },
  {
    n: '02',
    title: 'The Roast',
    body:
      'Small-batch drum roasting, profiled by hand. Light to light-medium. Always to order.',
  },
  {
    n: '03',
    title: 'The Brew',
    body:
      "Every bag ships with a brew guide matched to the coffee's character.",
  },
];

/* ====================================================
   YouTube Player (persistent across open/minimized)
==================================================== */
function VideoPlayer({ mode, onMinimize, onMaximize, onClose }) {
  const playerRef = useRef(null);
  const targetIdRef = useRef('forma-yt-player');
  const animRef = useRef(null);
  const [ready, setReady] = useState(false);

  // Load YT IFrame API once
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.YT && window.YT.Player) return;
    if (document.getElementById('yt-iframe-api')) return;
    const tag = document.createElement('script');
    tag.id = 'yt-iframe-api';
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
  }, []);

  // Create the player once when first opened
  useEffect(() => {
    if (mode === 'closed') return;
    if (playerRef.current) return; // already exists

    const init = () => {
      if (!window.YT || !window.YT.Player) return;
      const el = document.getElementById(targetIdRef.current);
      if (!el) return;
      playerRef.current = new window.YT.Player(targetIdRef.current, {
        videoId: YT_VIDEO_ID,
        playerVars: {
          autoplay: 1,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          enablejsapi: 1,
        },
        events: {
          onReady: (e) => {
            setReady(true);
            try {
              if (mode === 'minimized') {
                e.target.mute();
              } else {
                e.target.unMute();
                e.target.setVolume(80);
              }
              e.target.playVideo();
            } catch (_) {}
          },
        },
      });
    };

    if (window.YT && window.YT.Player) init();
    else window.onYouTubeIframeAPIReady = init;
  }, [mode]);

  // Mute/unMute when mode toggles
  useEffect(() => {
    const p = playerRef.current;
    if (!p || !ready) return;
    try {
      if (mode === 'minimized') {
        p.mute();
      } else if (mode === 'open') {
        p.unMute();
        p.setVolume(80);
      }
    } catch (_) {}
  }, [mode, ready]);

  // Re-trigger CSS animation on every mode change so transitions feel fresh
  useEffect(() => {
    if (!animRef.current) return;
    const node = animRef.current;
    // Reset animation
    node.style.animation = 'none';
    // Force reflow so the browser registers the change
    node.offsetWidth;
    if (mode === 'open') {
      node.style.animation =
        'forma-vp-grow 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94) both';
    } else if (mode === 'minimized') {
      node.style.animation =
        'forma-vp-rise 350ms cubic-bezier(0.25, 0.46, 0.45, 0.94) both';
    }
  }, [mode]);

  // Destroy on full close
  useEffect(() => {
    if (mode !== 'closed') return;
    if (!playerRef.current) return;
    try {
      playerRef.current.destroy();
    } catch (_) {}
    playerRef.current = null;
    setReady(false);
  }, [mode]);

  if (mode === 'closed') return null;

  const isOpen = mode === 'open';

  return (
    <>
      {/* Full overlay backdrop (open only) */}
      {isOpen && (
        <div
          onClick={onClose}
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(12,10,7,0.95)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            animation:
              'forma-vp-overlay-fade 260ms cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
          }}
        />
      )}

      {/* POSITIONER — fixed position per mode (no transitions on position) */}
      <div
        style={{
          position: 'fixed',
          zIndex: 10000,
          ...(isOpen
            ? {
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: 'min(85vw, 1300px)',
                aspectRatio: '16 / 9',
              }
            : {
                right: 24,
                bottom: 24,
                width: 216,
                height: 122,
              }),
        }}
      >
        {/* ANIMATED CONTAINER — scale/opacity grow on open, slide-up on minimize */}
        <div
          ref={animRef}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
            border: `1px solid ${isOpen ? 'rgba(201,169,110,0.35)' : '#C9A96E'}`,
            borderRadius: isOpen ? 4 : 6,
            overflow: 'hidden',
            boxShadow: isOpen
              ? '0 24px 80px -16px rgba(0,0,0,0.8)'
              : '0 14px 36px -10px rgba(0,0,0,0.85), 0 0 0 1px rgba(201,169,110,0.18)',
            transformOrigin: isOpen ? 'center center' : 'bottom right',
          }}
        >
          {/* YouTube IFrame mount point */}
          <div
            id={targetIdRef.current}
            style={{ width: '100%', height: '100%' }}
          />

          {/* Click-blocker over iframe in minimized mode → expand on click */}
          {!isOpen && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(180deg, rgba(12,10,7,0) 0%, rgba(12,10,7,0) 55%, rgba(12,10,7,0.55) 100%)',
                pointerEvents: 'auto',
                cursor: 'pointer',
              }}
              onClick={onMaximize}
              aria-label="Expand player"
              role="button"
            />
          )}

          {/* Top-right controls */}
          <div
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              display: 'flex',
              gap: 6,
              zIndex: 5,
            }}
          >
            {isOpen ? (
              <>
                <CircleBtn label="Minimize" onClick={onMinimize}>
                  <Minus className="w-4 h-4" strokeWidth={1.75} />
                </CircleBtn>
                <CircleBtn label="Close" onClick={onClose}>
                  <X className="w-4 h-4" strokeWidth={1.75} />
                </CircleBtn>
              </>
            ) : (
              <CircleBtn label="Expand" onClick={onMaximize} size={28}>
                <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.75} />
              </CircleBtn>
            )}
          </div>

          {/* Mini player: top-left pulsing gold "now playing" dot */}
          {!isOpen && (
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: 10,
                left: 10,
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'var(--gold)',
                zIndex: 5,
                animation:
                  'forma-vp-dot-pulse 1.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite',
                pointerEvents: 'none',
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}

function CircleBtn({ children, label, onClick, size = 32 }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: '1px solid var(--border)',
        backgroundColor: 'var(--surface)',
        color: 'var(--gold)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        transition:
          'background-color 200ms ease, color 200ms ease, border-color 200ms ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#C9A96E';
        e.currentTarget.style.color = '#0C0A07';
        e.currentTarget.style.borderColor = '#C9A96E';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--surface)';
        e.currentTarget.style.color = 'var(--gold)';
        e.currentTarget.style.borderColor = 'var(--border)';
      }}
    >
      {children}
    </button>
  );
}

/* ====================================================
   Hero / Home page
==================================================== */
export default function HomePage() {
  const [videoMode, setVideoMode] = useState('closed');

  return (
    <>
      <section
        className="relative w-full overflow-hidden forma-hero"
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--bg)',
          perspective: '1200px',
        }}
      >
        {/* Subtle radial warm-light backdrop */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 38%, #1a140c 0%, rgba(12,10,7,0) 60%), radial-gradient(circle at 50% 32%, rgba(201,169,110,0.10) 0%, rgba(201,169,110,0) 38%)',
          }}
        />

        {/* Spotlight (above backdrop, behind everything else) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 1,
            background:
              'radial-gradient(ellipse 280px 180px at 50% 0%, rgba(201,169,110,0.10) 0%, transparent 68%)',
          }}
        />

        {/* Orbiting beans (single rAF loop handles 3D math + letter collisions) */}
        <div className="hero-load-orbit absolute inset-0 pointer-events-none">
          <HeroOrbit />
        </div>

        {/* Hero mouse parallax (separate rAF from orbit) */}
        <HeroParallax />

        {/* Bottom legibility gradient */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: '70%',
            background:
              'linear-gradient(180deg, rgba(12,10,7,0) 0%, rgba(12,10,7,0.45) 45%, rgba(12,10,7,0.92) 100%)',
          }}
        />

        {/* ===== HERO COLLAGE (centerpiece) — outer wrapper centers, inner animates ===== */}
        <div
          className="forma-hero-collage"
          style={{
            position: 'absolute',
            top: '46%',
            left: '50%',
            width: 420,
            height: 540,
            zIndex: 5,
          }}
        >
          <div
            className="hero-load-arch"
            data-parallax="arch"
            style={{ position: 'relative', width: '100%', height: '100%' }}
          >
          {/* ---- ARCH SHAPE (photo-1: coffee sculpture) ---- */}
          <div
            data-arch
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50% 50% 48% 48% / 42% 42% 58% 58%',
              backgroundColor: '#080604',
              overflow: 'hidden',
              boxShadow: 'inset 0 -80px 80px #080604',
            }}
          >
            <img
              src="/hero/photo-1-sculpture.png"
              alt="coffee sculpture"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block',
              }}
            />

            {/* SMOKE EFFECT — 4 layered blurry blobs animating upward */}
            <span
              aria-hidden="true"
              data-parallax="smoke1"
              style={{
                position: 'absolute',
                top: '10%',
                left: '30%',
                width: 120,
                height: 80,
                backgroundColor: 'rgba(100,50,200,0.28)',
                filter: 'blur(28px)',
                borderRadius: '50%',
                pointerEvents: 'none',
                zIndex: 2,
                animation:
                  'forma-smoke-drift 5s ease-in-out 0s infinite alternate',
                willChange: 'transform, opacity',
              }}
            />
            <span
              aria-hidden="true"
              data-parallax="smoke2"
              style={{
                position: 'absolute',
                top: '5%',
                left: '50%',
                width: 100,
                height: 90,
                backgroundColor: 'rgba(30,170,110,0.22)',
                filter: 'blur(24px)',
                borderRadius: '50%',
                pointerEvents: 'none',
                zIndex: 2,
                animation:
                  'forma-smoke-drift 4s ease-in-out 1s infinite alternate',
                willChange: 'transform, opacity',
              }}
            />
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: '20%',
                left: '40%',
                width: 80,
                height: 80,
                backgroundColor: 'rgba(120,60,220,0.2)',
                filter: 'blur(32px)',
                borderRadius: '50%',
                pointerEvents: 'none',
                zIndex: 2,
                animation:
                  'forma-smoke-drift 6.5s ease-in-out 2s infinite alternate',
                willChange: 'transform, opacity',
              }}
            />
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: '15%',
                left: '25%',
                width: 90,
                height: 70,
                backgroundColor: 'rgba(20,140,130,0.18)',
                filter: 'blur(26px)',
                borderRadius: '50%',
                pointerEvents: 'none',
                zIndex: 2,
                animation:
                  'forma-smoke-drift 3.8s ease-in-out 0.5s infinite alternate',
                willChange: 'transform, opacity',
              }}
            />
          </div>

          {/* ---- CIRCLE CROP (photo-2: coffee tree overhead) ---- */}
          <div
            className="hero-load-circle"
            data-parallax="circle"
            style={{
              position: 'absolute',
              bottom: 70,
              left: -70,
              width: 180,
              height: 180,
              borderRadius: '50%',
              overflow: 'hidden',
              backgroundColor: '#080604',
              zIndex: 10,
              boxShadow: '0 18px 36px -12px rgba(0,0,0,0.75)',
            }}
          >
            <img
              src="/hero/photo-2-tree.png"
              alt="coffee tree overhead"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>

          {/* ---- RECTANGLE CROP (photo-3: roasting machine close-up) ---- */}
          <div
            className="hero-load-rect"
            data-parallax="rect"
            style={{
              position: 'absolute',
              top: '52%',
              right: -60,
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <div
              style={{
                width: 150,
                height: 110,
                overflow: 'hidden',
                backgroundColor: '#080604',
                boxShadow: '0 14px 26px -10px rgba(0,0,0,0.75)',
              }}
            >
              <img
                src="/hero/photo-3-roaster.jpg"
                alt="roasting machine close-up"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
            <span
              style={{
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                fontSize: 10,
                color: 'var(--muted)',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                lineHeight: 1,
              }}
            >
              The Roast
            </span>
          </div>

          {/* ---- ROTATING BADGE (overlapping arch upper-center) ---- */}
          <button
            type="button"
            onClick={() => setVideoMode('open')}
            aria-label="Play roaster's story video"
            className="group absolute"
            style={{
              top: '28%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 150,
              height: 150,
              zIndex: 12,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full forma-spin"
              aria-hidden="true"
            >
              <defs>
                <path
                  id="story-path"
                  d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0"
                />
              </defs>
              <text
                fill="#C9A96E"
                style={{
                  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                  fontSize: 12.5,
                  letterSpacing: '5px',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                }}
              >
                <textPath href="#story-path" startOffset="0">
                  THE ROASTER&apos;S STORY ✦ THE ROASTER&apos;S STORY ✦
                </textPath>
              </text>
            </svg>

            <span
              className="absolute inset-0 m-auto flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                border: '1px solid rgba(201,169,110,0.55)',
                backgroundColor: 'rgba(20,17,8,0.6)',
                backdropFilter: 'blur(6px)',
              }}
            >
              <Play
                className="ml-[3px]"
                size={20}
                strokeWidth={1.5}
                style={{ fill: '#C9A96E', color: '#C9A96E' }}
              />
            </span>
          </button>
          </div>
        </div>

        {/* ===== MOBILE-ONLY heritage stats panel (right side, near sculpture head) ===== */}
        <aside
          className="lg:hidden absolute flex flex-col hero-load-stats"
          aria-label="Heritage stats"
          style={{
            top: 'clamp(72px, 11vh, 110px)',
            right: 8,
            width: 'min(43vw, 168px)',
            zIndex: 9,
            gap: 8,
            textAlign: 'right',
          }}
        >
          <p
            style={{
              fontFamily:
                "var(--font-cormorant), 'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 11.5,
              lineHeight: 1.3,
              color: 'var(--muted)',
              margin: 0,
            }}
          >
            More than just a coffee.
            <br />
            It’s our heritage in every roast.
          </p>
          <ul
            style={{
              borderTop: '1px solid var(--border)',
              margin: 0,
              padding: 0,
              listStyle: 'none',
            }}
          >
            {[
              '$ 2M+ sourced in single-origin lots',
              'Direct trade · 100% traceable',
              '10+ partners · 3 continents',
            ].map((line) => (
              <li
                key={line}
                style={{
                  borderBottom: '1px solid var(--border)',
                  padding: '5px 0',
                  fontFamily:
                    "var(--font-dm-sans), 'DM Sans', sans-serif",
                  fontSize: 9.5,
                  color: 'var(--text)',
                  letterSpacing: '0.01em',
                  lineHeight: 1.35,
                }}
              >
                {line}
              </li>
            ))}
          </ul>
          <div className="flex flex-col items-end" style={{ gap: 2, marginTop: 4 }}>
            <span
              style={{
                fontFamily:
                  "var(--font-cormorant), 'Cormorant Garamond', serif",
                fontWeight: 700,
                fontSize: 28,
                lineHeight: 0.95,
                letterSpacing: '-0.02em',
                color: 'var(--gold)',
              }}
            >
              14<span style={{ opacity: 0.75 }}>/YRS</span>
            </span>
            <span
              style={{
                fontFamily:
                  "var(--font-dm-sans), 'DM Sans', sans-serif",
                fontSize: 7.5,
                color: 'var(--muted)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              Of crafting experiences
            </span>
          </div>
        </aside>

        {/* Bottom content */}
        <div
          className="absolute inset-x-0 bottom-0 z-10"
          style={{ paddingBottom: 'clamp(2.5rem, 5vh, 4.5rem)' }}
        >
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            {/* LEFT */}
            <div className="lg:col-span-7 flex flex-col gap-7">
              <span
                className="label-tag hero-load-est"
                style={{ color: 'var(--gold)', letterSpacing: '0.22em' }}
              >
                Est. MMXXIV · Small Batch Roasters
              </span>

              <h1
                className="display-heading"
                aria-label="Where fire meets obsession."
                style={{
                  fontFamily:
                    "var(--font-cormorant), 'Cormorant Garamond', serif",
                  fontWeight: 700,
                  fontSize: 'clamp(2.75rem, 6.5vw, 4.75rem)',
                  lineHeight: 0.96,
                  letterSpacing: '-0.02em',
                  color: 'var(--text)',
                  maxWidth: '14ch',
                  position: 'relative',
                  zIndex: 10,
                  perspective: '1000px',
                }}
                data-parallax="headline"
              >
                <span aria-hidden="true">{renderLine('Where fire meets', 500)}</span>
                <br />
                <span aria-hidden="true">{renderLine('obsession.', 800)}</span>
              </h1>

              <p
                style={{
                  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                  fontWeight: 300,
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: 'var(--muted)',
                  maxWidth: 460,
                }}
              >
                We source rare single-origin beans and roast them in small
                batches. Not for scale. For flavor.
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-2 hero-load-buttons">
                <Link
                  href="/roast"
                  className="btn-gold group"
                  style={{ padding: '0.85rem 1.4rem', fontSize: 12.5 }}
                >
                  Explore the Roast
                  <ArrowRight
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    strokeWidth={1.5}
                  />
                </Link>

                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2"
                  style={{
                    padding: '0.85rem 1.6rem',
                    backgroundColor: '#C9A96E',
                    color: '#0C0A07',
                    borderRadius: 999,
                    border: '1px solid #C9A96E',
                    fontFamily:
                      "var(--font-dm-sans), 'DM Sans', sans-serif",
                    fontSize: 12.5,
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    transition: 'background-color 220ms ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#d6b97d';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#C9A96E';
                  }}
                >
                  Shop Now
                </Link>
              </div>
            </div>

            {/* RIGHT — heritage stats (desktop layout) */}
            <div
              className="hidden lg:col-span-5 lg:flex flex-col gap-5 lg:items-end lg:text-right hero-load-stats"
              data-parallax="stats"
            >
              <p
                style={{
                  fontFamily:
                    "var(--font-cormorant), 'Cormorant Garamond', serif",
                  fontStyle: 'italic',
                  fontWeight: 400,
                  fontSize: 20,
                  lineHeight: 1.35,
                  color: 'var(--muted)',
                  maxWidth: 320,
                  margin: 0,
                }}
              >
                More than just a coffee.
                <br />
                It’s our heritage in every roast.
              </p>

              {/* 3 stat lines with thin --border dividers */}
              <ul
                className="flex flex-col w-full lg:max-w-[340px] mt-1"
                style={{ borderTop: '1px solid var(--border)' }}
              >
                {[
                  { node: (<>$&nbsp;<CountUp end={2} suffix="M+" duration={1200} /> sourced in single-origin lots</>), key: '2m' },
                  { node: 'Direct trade · 100% traceable origins', key: 'direct' },
                  { node: (<><CountUp end={10} suffix="+" duration={1200} /> roast partners across 3 continents</>), key: '10p' },
                ].map((item) => (
                  <li
                    key={item.key}
                    style={{
                      borderBottom: '1px solid var(--border)',
                      padding: '11px 0',
                      fontFamily:
                        "var(--font-dm-sans), 'DM Sans', sans-serif",
                      fontSize: 12.5,
                      color: 'var(--text)',
                      letterSpacing: '0.02em',
                      lineHeight: 1.45,
                    }}
                  >
                    {item.node}
                  </li>
                ))}
              </ul>

              {/* 14 /YRS block */}
              <div className="flex flex-col items-end gap-1 mt-2">
                <span
                  style={{
                    fontFamily:
                      "var(--font-cormorant), 'Cormorant Garamond', serif",
                    fontWeight: 700,
                    fontSize: 56,
                    lineHeight: 0.95,
                    letterSpacing: '-0.02em',
                    color: 'var(--gold)',
                  }}
                >
                  14<span style={{ opacity: 0.75 }}>/YRS</span>
                </span>
                <span
                  style={{
                    fontFamily:
                      "var(--font-dm-sans), 'DM Sans', sans-serif",
                    fontSize: 10,
                    color: 'var(--muted)',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                  }}
                >
                  Of crafting experiences
                </span>
              </div>

              {/* Arrow pair ← → */}
              <div className="inline-flex items-center gap-3 mt-2">
                <button
                  type="button"
                  aria-label="Previous"
                  className="forma-arrow-btn"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    border: '1px solid var(--border)',
                    backgroundColor: 'transparent',
                    color: 'var(--text)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition:
                      'background-color 200ms ease, color 200ms ease, border-color 200ms ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#C9A96E';
                    e.currentTarget.style.color = '#0C0A07';
                    e.currentTarget.style.borderColor = '#C9A96E';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                >
                  <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  aria-label="Next"
                  className="forma-arrow-btn"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    border: '1px solid var(--gold)',
                    backgroundColor: '#C9A96E',
                    color: '#0C0A07',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition:
                      'background-color 200ms ease, color 200ms ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#d6b97d';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#C9A96E';
                  }}
                >
                  <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 2. SCROLLING MARQUEE TICKER ===== */}
      <section
        aria-label="Roastery values ticker"
        className="relative overflow-hidden marquee-3d"
        style={{
          backgroundColor: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div
          className="marquee-track py-5"
          style={{ animation: 'marquee-ltr 40s linear infinite' }}
        >
          {/* Two identical copies → seamless loop */}
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              className="flex items-center gap-12 pr-12"
              aria-hidden={copy === 1 ? 'true' : undefined}
            >
              {MARQUEE_ITEMS.map((m, i) => (
                <li
                  key={`${copy}-${i}`}
                  className="flex items-center gap-12"
                  style={{
                    color: 'var(--gold)',
                    fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                    fontSize: 13,
                    fontWeight: 500,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span>{m}</span>
                  <span
                    aria-hidden="true"
                    style={{ color: 'var(--gold)', opacity: 0.6 }}
                  >
                    ·
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </section>

      {/* ===== 3. PHILOSOPHY STRIP ===== */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left ~55% — quote */}
          <div className="lg:col-span-7">
            <span
              className="label-tag block mb-8"
              style={{ color: 'var(--gold)' }}
              data-reveal-body
            >
              Philosophy / 2024
            </span>
            <p
              data-reveal-heading
              style={{
                fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                fontWeight: 300,
                fontStyle: 'italic',
                fontSize: 'clamp(1.75rem, 3.5vw, 3.25rem)',
                lineHeight: 1.12,
                letterSpacing: '-0.01em',
                color: 'var(--text)',
                maxWidth: '20ch',
              }}
            >
              &ldquo;Roasting is not a process. It is a conversation with the
              bean.&rdquo;
            </p>
            <span
              className="label-tag block mt-8"
              style={{ color: 'var(--muted)' }}
              data-reveal-body
            >
              — Marius Veil, Head Roaster
            </span>
          </div>

          {/* Right ~45% — stat blocks */}
          <div className="lg:col-span-5 flex flex-col">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                data-reveal-card
                className="flex items-baseline justify-between gap-6 py-7"
                style={{
                  borderTop: '1px solid var(--border)',
                  borderBottom:
                    i === STATS.length - 1 ? '1px solid var(--border)' : 'none',
                }}
              >
                <span
                  style={{
                    fontFamily:
                      "var(--font-cormorant), 'Cormorant Garamond', serif",
                    fontWeight: 600,
                    fontSize: 'clamp(2.5rem, 4vw, 3.75rem)',
                    lineHeight: 1,
                    letterSpacing: '-0.02em',
                    color: 'var(--text)',
                  }}
                >
                  <CountUp
                    end={s.end}
                    prefix={s.prefix}
                    suffix={s.suffix}
                    duration={1400}
                  />
                </span>
                <span
                  className="text-right"
                  style={{
                    fontFamily:
                      "var(--font-dm-sans), 'DM Sans', sans-serif",
                    fontSize: 13,
                    color: 'var(--muted)',
                    maxWidth: 220,
                    lineHeight: 1.4,
                  }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 4. FEATURED PRODUCTS ===== */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 lg:mb-16">
            <div className="flex flex-col gap-5">
              <span
                className="label-tag"
                style={{ color: 'var(--gold)' }}
                data-reveal-body
              >
                From the Roastery
              </span>
              <h2
                data-reveal-heading
                style={{
                  fontFamily:
                    "var(--font-cormorant), 'Cormorant Garamond', serif",
                  fontWeight: 600,
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                  color: 'var(--text)',
                }}
              >
                This week&apos;s selection.
              </h2>
            </div>

            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 self-start md:self-end"
              style={{
                color: 'var(--text)',
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                fontSize: 13,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              <span>View all</span>
              <ArrowUpRight
                className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                strokeWidth={1.5}
                style={{ color: 'var(--gold)' }}
              />
            </Link>
          </div>

          {/* 3 frosted cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7">
            {FEATURED.map((p) => (
              <Link
                key={p.id}
                href="/shop"
                data-reveal-card
                className="frost-card group flex flex-col"
                style={{ textDecoration: 'none' }}
              >
                {/* Tag */}
                <div className="flex items-center justify-between mb-5">
                  <span
                    className="label-tag"
                    style={{
                      color: 'var(--gold)',
                      letterSpacing: '0.18em',
                    }}
                  >
                    {p.tag}
                  </span>
                  <span
                    style={{
                      fontFamily:
                        "var(--font-cormorant), 'Cormorant Garamond', serif",
                      fontWeight: 600,
                      fontSize: 22,
                      color: 'var(--gold)',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {p.price}
                  </span>
                </div>

                {/* Image */}
                <div
                  data-img-placeholder={p.img}
                  className="w-full mb-6 rounded-md overflow-hidden"
                  style={{ aspectRatio: '4 / 5', backgroundColor: 'var(--surface)' }}
                >
                  {p.imgSrc && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={p.imgSrc}
                      alt={p.name}
                      draggable="false"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        display: 'block',
                        userSelect: 'none',
                      }}
                    />
                  )}
                </div>

                {/* Title + meta */}
                <h3
                  style={{
                    fontFamily:
                      "var(--font-cormorant), 'Cormorant Garamond', serif",
                    fontWeight: 600,
                    fontSize: 26,
                    lineHeight: 1.1,
                    letterSpacing: '-0.01em',
                    color: 'var(--text)',
                    marginBottom: 6,
                  }}
                >
                  {p.name}
                </h3>
                <span
                  style={{
                    fontFamily:
                      "var(--font-dm-sans), 'DM Sans', sans-serif",
                    fontSize: 13,
                    color: 'var(--muted)',
                  }}
                >
                  {p.meta}
                </span>

                {/* Bottom action */}
                <div
                  className="mt-6 pt-5 flex items-center justify-between"
                  style={{ borderTop: '1px solid var(--border)' }}
                >
                  <span
                    style={{
                      fontFamily:
                        "var(--font-dm-sans), 'DM Sans', sans-serif",
                      fontSize: 12,
                      color: 'var(--text)',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Shop
                  </span>
                  <ArrowRight
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    strokeWidth={1.5}
                    style={{ color: 'var(--gold)' }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 5. THE RITUAL ===== */}
      <section
        className="py-24 lg:py-32"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex flex-col gap-5 mb-14">
            <span
              className="label-tag"
              style={{ color: 'var(--gold)' }}
              data-reveal-body
            >
              What we offer
            </span>
            <h2
              data-reveal-heading
              style={{
                fontFamily:
                  "var(--font-cormorant), 'Cormorant Garamond', serif",
                fontWeight: 600,
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                lineHeight: 1,
                letterSpacing: '-0.02em',
                color: 'var(--text)',
                maxWidth: '14ch',
              }}
            >
              The full ritual.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3">
            {RITUAL.map((r, i) => (
              <div
                key={r.n}
                data-reveal-card
                className="flex flex-col gap-6 py-10 md:py-2 md:px-10 first:md:pl-0 last:md:pr-0"
                style={
                  i > 0
                    ? {
                        // dividers between cols on md+
                        borderTop: '1px solid var(--border)',
                      }
                    : { borderTop: '1px solid var(--border)' }
                }
              >
                <span
                  className="label-tag"
                  style={{ color: 'var(--muted)' }}
                >
                  {r.n}
                </span>
                <h3
                  style={{
                    fontFamily:
                      "var(--font-cormorant), 'Cormorant Garamond', serif",
                    fontWeight: 600,
                    fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                    lineHeight: 1.05,
                    letterSpacing: '-0.015em',
                    color: 'var(--text)',
                  }}
                >
                  {r.title}
                </h3>
                <p
                  style={{
                    fontFamily:
                      "var(--font-dm-sans), 'DM Sans', sans-serif",
                    fontWeight: 300,
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: 'var(--muted)',
                    maxWidth: 360,
                  }}
                >
                  {r.body}
                </p>
              </div>
            ))}
          </div>

          {/* Vertical dividers helper — visible only at md+ via CSS pseudo trick is hard,
              so we already use horizontal top borders per col. Add vertical via
              absolute spans on md+ using flex column reorder is overkill; the top
              borders give clean separation in this dark layout. */}
        </div>
      </section>

      {/* ===== 6. FULL-WIDTH CTA STRIP ===== */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundColor: 'var(--bg)',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        {/* Subtle gold radial glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(201,169,110,0.10) 0%, rgba(201,169,110,0.04) 35%, transparent 70%)',
          }}
        />
        {/* Gold noise overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.08,
            mixBlendMode: 'screen',
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='matrix' values='0 0 0 0 0.79  0 0 0 0 0.66  0 0 0 0 0.43  0 0 0 1 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
            backgroundSize: '180px 180px',
          }}
        />

        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 py-24 lg:py-32 flex flex-col items-center text-center gap-6">
          <span
            className="label-tag"
            style={{ color: 'var(--gold)', letterSpacing: '0.22em' }}
            data-reveal-body
          >
            One more thing
          </span>

          <h2
            data-reveal-heading
            style={{
              fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
              fontWeight: 600,
              fontSize: 'clamp(2.5rem, 5.5vw, 4rem)',
              lineHeight: 1.02,
              letterSpacing: '-0.02em',
              color: 'var(--text)',
              maxWidth: '16ch',
            }}
          >
            Ready to taste obsession?
          </h2>

          <p
            data-reveal-body
            style={{
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              fontWeight: 300,
              fontSize: 15,
              color: 'var(--muted)',
              maxWidth: 480,
              lineHeight: 1.6,
            }}
          >
            Free shipping on orders over $45.
          </p>

          <Link
            href="/shop"
            data-reveal-body
            className="inline-flex items-center gap-2 mt-2"
            style={{
              padding: '1rem 2rem',
              backgroundColor: '#C9A96E',
              color: '#0C0A07',
              borderRadius: 999,
              border: '1px solid #C9A96E',
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              transition: 'background-color 220ms ease, transform 220ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#d6b97d';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#C9A96E';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Shop the Collection
            <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
          </Link>
        </div>
      </section>

      <style>{`
        .forma-spin {
          animation: forma-spin 15s linear infinite;
          transform-origin: 50% 50%;
        }
        @keyframes forma-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      <VideoPlayer
        mode={videoMode}
        onMinimize={() => setVideoMode('minimized')}
        onMaximize={() => setVideoMode('open')}
        onClose={() => setVideoMode('closed')}
      />
    </>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';

const HOVER_SELECTOR =
  'a, button, [role="button"], [data-cursor-hover], input[type="submit"], input[type="button"], label';

const MAX_PETALS = 12;
const SPAWN_THROTTLE_MS = 30;
const PETAL_LIFETIME_MS = 800;

/* Dark theme colors: gold core, warm trail */
const COLOR_DOT = '#C9A96E';      // gold
const COLOR_RING = '#E4DDD1';     // soft text color
const COLOR_TRAIL = '#C9A96E';    // gold petals
const COLOR_TRAIL_HOVER = '#E4DDD1'; // text on hover

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const targetRef = useRef({ x: -100, y: -100 });
  const currentRef = useRef({ x: -100, y: -100 });
  const ringPosRef = useRef({ x: -100, y: -100 });
  const lastSpawnRef = useRef(0);
  const rafRef = useRef(null);
  const petalIdRef = useRef(0);

  const [mounted, setMounted] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [petals, setPetals] = useState([]);

  useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;

    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (coarse) { setEnabled(false); return; }
    setReducedMotion(reduce);

    document.documentElement.classList.add('custom-cursor-active');

    const onMove = (e) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
      if (reduce) return;

      const now = performance.now();
      if (now - lastSpawnRef.current < SPAWN_THROTTLE_MS) return;
      lastSpawnRef.current = now;

      const id = ++petalIdRef.current;
      const petal = {
        id,
        x: e.clientX + (Math.random() - 0.5) * 22,
        y: e.clientY + (Math.random() - 0.5) * 22,
        rot: Math.random() * 360,
        size: 16 + Math.random() * 10,
      };

      setPetals((prev) => {
        const next = prev.length >= MAX_PETALS ? prev.slice(1) : prev;
        return [...next, petal];
      });
      window.setTimeout(() => {
        setPetals((prev) => prev.filter((p) => p.id !== id));
      }, PETAL_LIFETIME_MS);
    };

    const onOver = (e) => {
      if (e.target?.closest?.(HOVER_SELECTOR)) setHovering(true);
    };
    const onOut = (e) => {
      if (e.target?.closest?.(HOVER_SELECTOR)) {
        const to = e.relatedTarget;
        if (!to || !to.closest?.(HOVER_SELECTOR)) setHovering(false);
      }
    };
    const onWindowLeave = () => {
      targetRef.current.x = -200;
      targetRef.current.y = -200;
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    document.addEventListener('mouseout', onOut, { passive: true });
    document.addEventListener('mouseleave', onWindowLeave);

    const loop = () => {
      const cur = currentRef.current;
      const ring = ringPosRef.current;
      const tar = targetRef.current;
      cur.x += (tar.x - cur.x) * 0.28;
      cur.y += (tar.y - cur.y) * 0.28;
      ring.x += (tar.x - ring.x) * 0.14;
      ring.y += (tar.y - ring.y) * 0.14;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%) rotate(${(performance.now() / 30) % 360}deg)`;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.removeEventListener('mouseleave', onWindowLeave);
      cancelAnimationFrame(rafRef.current);
      document.documentElement.classList.remove('custom-cursor-active');
    };
  }, []);

  if (!mounted || !enabled) return null;
  const petalColor = hovering ? COLOR_TRAIL_HOVER : COLOR_TRAIL;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: 'fixed', left: 0, top: 0,
          width: hovering ? 14 : 8,
          height: hovering ? 14 : 8,
          borderRadius: '50%',
          backgroundColor: COLOR_DOT,
          pointerEvents: 'none',
          zIndex: 9999,
          transition: 'width 200ms ease, height 200ms ease',
          willChange: 'transform',
        }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: 'fixed', left: 0, top: 0,
          width: hovering ? 56 : 36,
          height: hovering ? 56 : 36,
          borderRadius: '50%',
          border: `1.5px dashed ${COLOR_RING}`,
          backgroundColor: 'transparent',
          mixBlendMode: hovering ? 'difference' : 'normal',
          pointerEvents: 'none',
          zIndex: 9998,
          transition:
            'width 220ms ease, height 220ms ease, border-color 220ms ease',
          willChange: 'transform',
          opacity: hovering ? 1 : 0.55,
        }}
      />
      {petals.map((p) => (
        <Petal key={p.id} petal={p} color={petalColor} />
      ))}
    </>
  );
}

function Petal({ petal, color }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        left: petal.x, top: petal.y,
        width: petal.size, height: petal.size,
        transform: `translate(-50%, -50%) rotate(${petal.rot}deg)`,
        pointerEvents: 'none', zIndex: 9997,
        willChange: 'opacity, transform',
      }}
    >
      <div
        style={{
          width: '100%', height: '100%',
          animation: 'petal-fade 800ms cubic-bezier(0.22, 1, 0.36, 1) forwards',
        }}
      >
        <svg viewBox="0 0 24 24" width="100%" height="100%" style={{ display: 'block' }}>
          <g transform="translate(12 12)" fill={color}>
            {[0, 72, 144, 216, 288].map((deg) => (
              <ellipse key={deg} cx="0" cy="-5.5" rx="2.4" ry="5" transform={`rotate(${deg})`} />
            ))}
            <circle r="1.6" fill="#0C0A07" opacity="0.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

// keyframes are declared in globals.css

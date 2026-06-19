'use client';

import { useEffect, useRef } from 'react';

/**
 * HeroOrbit (corrected) — mouse tilt only, no scroll tilt.
 *
 * 35 coffee beans orbit elliptically around the hero center.
 * Single shared requestAnimationFrame loop:
 *   - rotate baseAngle, position every bean (cos/sin, depth-based filter)
 *   - every 2nd frame: collide letters with the arch (.behind-image)
 *     and with front beans (.bean-over)
 *   - tilt the orbit container with rotateY only, driven by mouse over hero
 *
 * Listens to mousemove + mouseleave on the parent hero section (NOT window).
 */
const BEAN_COUNT = 35;
const ORBIT_RX = 340;
const ORBIT_RY = 155;
const ORBIT_RZ = 200;
const BEAN_SIZE = 26;
const ANGULAR_VELOCITY = 0.0014;
const MOUSE_TILT_FACTOR = 0.012;
const LERP = 0.055;

export default function HeroOrbit() {
  const containerRef = useRef(null);
  const rafRef = useRef(0);
  const beansRef = useRef([]);
  const stateRef = useRef({
    baseAngle: 0,
    targetTiltY: 0,
    currentTiltY: 0,
    frame: 0,
    visible: true,
    archEl: null,
    archRect: null,
    archRectFrame: -100,
    reduce: false,
    coarse: false,
    beanX: new Float32Array(BEAN_COUNT),
    beanY: new Float32Array(BEAN_COUNT),
    beanZ: new Float32Array(BEAN_COUNT),
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const container = containerRef.current;
    if (!container) return;

    const s = stateRef.current;
    s.reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    s.coarse = window.matchMedia('(pointer: coarse)').matches;

    /* Mobile / coarse-pointer guard — hide beans, clear letter classes, exit */
    if (s.coarse) {
      container.style.display = 'none';
      document
        .querySelectorAll('.hero-letter')
        .forEach((el) => el.classList.remove('lit'));
      return undefined;
    }

    /* Cache bean elements */
    beansRef.current = Array.from(container.querySelectorAll('[data-bean]'));

    /* The hero section is the closest section ancestor */
    const hero = container.closest('section');
    s.archEl = document.querySelector('[data-arch]');

    /* ---------------- Listeners on the hero element ---------------- */
    const onMouseMove = (e) => {
      const rect = hero.getBoundingClientRect();
      s.targetTiltY =
        (e.clientX - rect.left - rect.width / 2) * MOUSE_TILT_FACTOR;
    };

    const onMouseLeave = () => {
      s.targetTiltY = 0;
    };

    const onVisibility = () => {
      s.visible = document.visibilityState === 'visible';
    };

    const onResize = () => {
      s.archEl = document.querySelector('[data-arch]');
      s.archRect = null;
    };

    hero.addEventListener('mousemove', onMouseMove, { passive: true });
    hero.addEventListener('mouseleave', onMouseLeave, { passive: true });
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);

    /* ---------------- Collision helper ---------------- */
    const rectsOverlap = (a, b) =>
      !(
        a.right < b.left ||
        b.right < a.left ||
        a.bottom < b.top ||
        b.bottom < a.top
      );

    const runCollision = () => {
      const letters = document.querySelectorAll('.hero-letter');
      if (letters.length === 0) return;

      const archRect = s.archRect;

      letters.forEach((span) => {
        const lr = span.getBoundingClientRect();
        let shouldLight = false;

        // (A) Arch overlapping letter
        if (archRect && rectsOverlap(archRect, lr)) {
          shouldLight = true;
        }

        // (B) Front beans (z > 40) over letter
        if (!shouldLight) {
          for (let i = 0; i < BEAN_COUNT; i++) {
            if (s.beanZ[i] <= 40) continue;
            const bx = s.beanX[i];
            const by = s.beanY[i];
            const br = {
              left: bx - 15,
              right: bx + 15,
              top: by - 10,
              bottom: by + 10,
            };
            if (rectsOverlap(br, lr)) {
              shouldLight = true;
              break;
            }
          }
        }

        // CSS transition handles smooth fade
        if (shouldLight) {
          span.classList.add('lit');
        } else {
          span.classList.remove('lit');
        }
      });
    };

    /* ---------------- The shared rAF loop ---------------- */
    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);
      if (!s.visible) return;

      s.frame++;

      /* Mouse tilt only — no scroll handling */
      if (!s.reduce) {
        s.currentTiltY += (s.targetTiltY - s.currentTiltY) * LERP;
        container.style.transform = `rotateY(${s.currentTiltY.toFixed(2)}deg)`;
      }

      /* Update baseAngle (frozen if reduced-motion) */
      if (!s.reduce) s.baseAngle += ANGULAR_VELOCITY;

      /* Re-query arch rect every ~30 frames */
      if (!s.archRect || s.frame - s.archRectFrame > 30) {
        if (s.archEl) {
          s.archRect = s.archEl.getBoundingClientRect();
          s.archRectFrame = s.frame;
        }
      }

      /* Orbit center = hero center (orbit container fills the hero, inset:0) */
      const orbitRect = container.getBoundingClientRect();
      const centerX = orbitRect.width / 2;
      const centerY = orbitRect.height / 2;

      /* Position every bean */
      const beans = beansRef.current;
      for (let i = 0; i < BEAN_COUNT; i++) {
        const angle = s.baseAngle + (i / BEAN_COUNT) * Math.PI * 2;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const x = centerX + cos * ORBIT_RX;
        const y = centerY + sin * ORBIT_RY;
        const z = sin * ORBIT_RZ;

        const scale = 0.45 + (z + ORBIT_RZ) / 420;
        const opacity = 0.3 + (z + ORBIT_RZ) / 310;

        const bean = beans[i];
        // Per spec: translate(x, y) directly (origin offset compensated below)
        // We subtract BEAN_SIZE/2 so the visual center sits on (x, y)
        bean.style.transform = `translate3d(${(x - BEAN_SIZE / 2).toFixed(
          1
        )}px, ${(y - BEAN_SIZE / 2).toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
        bean.style.opacity = String(Math.max(0, Math.min(1, opacity)));
        bean.style.zIndex = String(z > 0 ? 20 : 2);
        bean.style.filter =
          z > 80
            ? 'sepia(0.5) brightness(1.15) drop-shadow(0 0 5px rgba(201,169,110,0.5))'
            : 'sepia(0.2) brightness(0.7)';

        // Cache screen-space center for collision (visual center sits on x,y in orbit)
        s.beanX[i] = orbitRect.left + x;
        s.beanY[i] = orbitRect.top + y;
        s.beanZ[i] = z;
      }

      /* Collision every 2nd frame */
      if (!s.reduce && s.frame % 2 === 0) {
        runCollision();
      }
    };

    /* Reduced-motion → place beans statically once, no animation */
    if (s.reduce) {
      const orbitRect = container.getBoundingClientRect();
      const cx = orbitRect.width / 2;
      const cy = orbitRect.height / 2;
      beansRef.current.forEach((bean, i) => {
        const a = (i / BEAN_COUNT) * Math.PI * 2;
        const x = cx + Math.cos(a) * ORBIT_RX;
        const y = cy + Math.sin(a) * ORBIT_RY;
        const z = Math.sin(a) * ORBIT_RZ;
        const scale = 0.45 + (z + ORBIT_RZ) / 420;
        bean.style.transform = `translate3d(${x - BEAN_SIZE / 2}px, ${y - BEAN_SIZE / 2}px, 0) scale(${scale})`;
        bean.style.opacity = String(0.3 + (z + ORBIT_RZ) / 310);
        bean.style.zIndex = String(z > 0 ? 20 : 2);
        bean.style.filter =
          z > 80
            ? 'sepia(0.5) brightness(1.15) drop-shadow(0 0 5px rgba(201,169,110,0.5))'
            : 'sepia(0.2) brightness(0.7)';
      });
    } else {
      rafRef.current = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      hero.removeEventListener('mousemove', onMouseMove);
      hero.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      document
        .querySelectorAll('.hero-letter')
        .forEach((el) => el.classList.remove('lit'));
    };
  }, []);

  return (
    <div
      ref={containerRef}
      data-orbit-container
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'visible',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        transition: 'transform 0.18s linear',
      }}
    >
      {Array.from({ length: BEAN_COUNT }).map((_, i) => (
        <div
          key={i}
          data-bean
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: BEAN_SIZE,
            height: 'auto',
            opacity: 0,
            willChange: 'transform, opacity',
          }}
        >
          {/* Bean image is plain <img> for tight perf control over 35 nodes */}
          <img
            src="/hero/bean.png"
            alt=""
            draggable="false"
            style={{
              width: BEAN_SIZE,
              height: 'auto',
              display: 'block',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          />
        </div>
      ))}
    </div>
  );
}

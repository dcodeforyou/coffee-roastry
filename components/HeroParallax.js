'use client';

import { useEffect, useRef } from 'react';

/**
 * HeroParallax — separate from HeroOrbit's mouse handler.
 * Listens to mousemove/mouseleave on the closest <section> ancestor
 * and translates `[data-parallax]` elements using the CSS `translate`
 * property (so existing `transform` rules stay untouched).
 *
 * Lerp factor: 0.04 each rAF frame.
 * Disabled on coarse pointer + prefers-reduced-motion.
 */
const FACTORS = {
  arch: { x: 0.008, y: 0.006 },
  circle: { x: 0.022, y: 0.018 },
  rect: { x: 0.016, y: 0.013 },
  smoke1: { x: 0.012, y: 0.01 },
  smoke2: { x: 0.018, y: 0.015 },
  headline: { x: -0.004, y: 0 },
  stats: { x: 0.006, y: 0.004 },
};
const LERP = 0.04;

export default function HeroParallax() {
  const stateRef = useRef({
    mx: 0,
    my: 0,
    cmx: 0,
    cmy: 0,
    groups: {},
    raf: 0,
    hero: null,
    visible: true,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (reduce || coarse) return undefined;

    const s = stateRef.current;

    const allTargets = document.querySelectorAll('[data-parallax]');
    if (allTargets.length === 0) return undefined;

    const groups = {};
    allTargets.forEach((el) => {
      const key = el.dataset.parallax;
      if (!FACTORS[key]) return;
      if (!groups[key]) groups[key] = [];
      groups[key].push(el);
    });
    s.groups = groups;

    const hero = allTargets[0].closest('section');
    if (!hero) return undefined;
    s.hero = hero;

    const onMouseMove = (e) => {
      const rect = hero.getBoundingClientRect();
      s.mx = e.clientX - rect.left - rect.width / 2;
      s.my = e.clientY - rect.top - rect.height / 2;
    };
    const onMouseLeave = () => {
      s.mx = 0;
      s.my = 0;
    };
    const onVis = () => {
      s.visible = document.visibilityState === 'visible';
    };

    hero.addEventListener('mousemove', onMouseMove, { passive: true });
    hero.addEventListener('mouseleave', onMouseLeave, { passive: true });
    document.addEventListener('visibilitychange', onVis);

    const tick = () => {
      s.raf = requestAnimationFrame(tick);
      if (!s.visible) return;

      // Lerp toward target
      s.cmx += (s.mx - s.cmx) * LERP;
      s.cmy += (s.my - s.cmy) * LERP;

      // Apply translate property to each group
      for (const [key, els] of Object.entries(s.groups)) {
        const f = FACTORS[key];
        const tx = (s.cmx * f.x).toFixed(2);
        const ty = (s.cmy * f.y).toFixed(2);
        const str = `${tx}px ${ty}px`;
        for (let i = 0; i < els.length; i++) {
          els[i].style.translate = str;
        }
      }
    };
    s.raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(s.raf);
      hero.removeEventListener('mousemove', onMouseMove);
      hero.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('visibilitychange', onVis);
      Object.values(s.groups)
        .flat()
        .forEach((el) => {
          el.style.translate = '';
        });
    };
  }, []);

  return null;
}

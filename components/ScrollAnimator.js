'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/* ---------- Bloom petal colors (rotate) ---------- */
const BLOOM_COLORS = ['#E8C4B8', '#A8B8A0', '#C4B5D0']; // rose, sage, lavender
let bloomCounter = 0;

function spawnBloom() {
  if (typeof document === 'undefined') return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  const seed = bloomCounter++;
  const container = document.createElement('div');
  container.setAttribute('aria-hidden', 'true');
  container.style.cssText = [
    'position:fixed',
    'left:50%',
    'top:50%',
    'width:0',
    'height:0',
    'pointer-events:none',
    'z-index:9985',
    'transform:translate(-50%,-50%)',
  ].join(';');
  document.body.appendChild(container);

  const petalCount = 6;
  const distance = 220;

  for (let i = 0; i < petalCount; i++) {
    const angle = (i / petalCount) * 360;
    const color = BLOOM_COLORS[(seed + i) % BLOOM_COLORS.length];
    const petal = document.createElement('div');
    petal.style.cssText = [
      'position:absolute',
      'left:0',
      'top:0',
      'width:34px',
      'height:34px',
      'will-change:transform,opacity',
      'transform:translate(-50%,-50%) rotate(' + angle + 'deg) translateY(0) scale(0)',
      'opacity:1',
      'transition:transform 700ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 700ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    ].join(';');
    petal.innerHTML =
      '<svg viewBox="0 0 24 24" width="100%" height="100%" style="display:block">' +
      '<g transform="translate(12 12)" fill="' + color + '">' +
      [0, 72, 144, 216, 288]
        .map((d) => '<ellipse cx="0" cy="-5.5" rx="2.4" ry="5" transform="rotate(' + d + ')"/>')
        .join('') +
      '<circle r="1.6" fill="#1C2B4B" opacity="0.45"/>' +
      '</g></svg>';
    container.appendChild(petal);

    // Two RAFs so the transition picks up the initial state first
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        petal.style.transform =
          'translate(-50%,-50%) rotate(' + angle + 'deg) translateY(-' + distance + 'px) scale(1)';
        petal.style.opacity = '0';
      });
    });
  }

  window.setTimeout(() => {
    container.remove();
  }, 760);
}

/* ---------- Component ---------- */
export default function ScrollAnimator() {
  const pathname = usePathname();
  const cleanupBag = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Delay so the new page's DOM has time to settle after navigation
    const initTimer = window.setTimeout(() => {
      // ----- Reset any previously revealed elements so they animate again -----
      document.querySelectorAll('.reveal').forEach((el) => {
        el.classList.remove('in-view');
        // force reflow so the next add('in-view') re-runs the transition
        void el.offsetHeight;
      });
      document
        .querySelectorAll('[data-reveal-heading], [data-reveal-body], [data-reveal-card]')
        .forEach((el) => el.classList.remove('revealed'));

      /* 1a. Pre-compute 80ms stagger for [data-reveal-card] siblings */
      const cardsAll = document.querySelectorAll('[data-reveal-card]');
      cardsAll.forEach((card) => {
        const parent = card.parentElement;
        if (!parent) return;
        const siblings = Array.from(parent.children).filter((el) =>
          el.hasAttribute('data-reveal-card')
        );
        const idx = siblings.indexOf(card);
        if (idx >= 0) {
          card.style.transitionDelay = `${idx * 80}ms`;
        }
      });

      /* 1. Generic [data-reveal-*] reveal */
      const reveals = document.querySelectorAll(
        '[data-reveal-heading], [data-reveal-body], [data-reveal-card]'
      );
      const revealObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              revealObs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
      );
      reveals.forEach((el) => revealObs.observe(el));

      /* 1b. New 3D `.reveal` reveal (threshold 0.12, adds .in-view) */
      const revealsNew = document.querySelectorAll('.reveal');
      const revealObsNew = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
              revealObsNew.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
      );
      revealsNew.forEach((el) => revealObsNew.observe(el));

      /* Immediately show anything already above the fold (so users coming
         back to the page see filled content right away, not blank). */
      const showAboveFold = (selectorList, className) => {
        document.querySelectorAll(selectorList).forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add(className);
          }
        });
      };
      showAboveFold('.reveal', 'in-view');
      showAboveFold(
        '[data-reveal-heading], [data-reveal-body], [data-reveal-card]',
        'revealed'
      );

      /* 2. Section bloom — fires once per <section> or [data-bloom] */
      const bloomTargets = document.querySelectorAll('main section, [data-bloom]');
      const bloomObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              spawnBloom();
              bloomObs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.25, rootMargin: '0px 0px -100px 0px' }
      );
      if (!reduce) bloomTargets.forEach((el) => bloomObs.observe(el));

      /* Failsafe — guarantees reveal elements become visible
         even if IntersectionObserver misses them (route change, race, etc.). */
      const failsafe = window.setTimeout(() => {
        document
          .querySelectorAll(
            '[data-reveal-heading], [data-reveal-body], [data-reveal-card]'
          )
          .forEach((el) => el.classList.add('revealed'));
        document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in-view'));
      }, 1600);

      /* 3. Auto-apply image placeholder fallback to all <img> inside main */
      const images = document.querySelectorAll('main img');
      images.forEach((img) => {
        const parent = img.parentElement;
        if (!parent) return;
        if (parent.dataset.imgPlaceholder == null && img.alt) {
          parent.dataset.imgPlaceholder = img.alt;
        }
        const markLoaded = () => parent.classList.add('img-loaded');
        if (img.complete && img.naturalWidth > 0) {
          markLoaded();
        } else {
          img.addEventListener('load', markLoaded, { once: true });
          img.addEventListener(
            'error',
            () => {
              parent.classList.remove('img-loaded');
            },
            { once: true }
          );
        }
      });

      // Stash on the timer ref so cleanup below can find/kill them
      cleanupBag.current = { revealObs, revealObsNew, bloomObs, failsafe };
    }, 80);

    return () => {
      window.clearTimeout(initTimer);
      const bag = cleanupBag.current;
      if (bag) {
        try { bag.revealObs.disconnect(); } catch (_) {}
        try { bag.revealObsNew.disconnect(); } catch (_) {}
        try { bag.bloomObs.disconnect(); } catch (_) {}
        window.clearTimeout(bag.failsafe);
        cleanupBag.current = null;
      }
    };
  }, [pathname]);

  return null;
}

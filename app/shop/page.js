'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ShoppingBag, Plus, Check, X } from 'lucide-react';

/* ---------- Categories ---------- */
const CATEGORIES = [
  { id: 'all', label: 'All Products' },
  { id: 'single-origin', label: 'Single Origin' },
  { id: 'international-roast', label: 'International Roast' },
  { id: 'equipment', label: 'Equipment' },
  { id: 'filters', label: 'Filters & Accessories' },
];

/* ---------- Grind options ---------- */
const GRIND_OPTIONS = [
  { id: 'whole-bean', label: 'Whole Bean' },
  { id: 'v60', label: 'V60' },
  { id: 'chemex', label: 'Chemex' },
  { id: 'kalita', label: 'Kalita Wave' },
  { id: 'espresso', label: 'Espresso' },
  { id: 'moka', label: 'Moka Pot' },
];

/* ---------- Products ---------- */
const PRODUCTS = [
  /* ===== Single Origin ===== */
  {
    id: 'eth-yirg',
    name: 'Ethiopia Yirgacheffe',
    cat: 'single-origin',
    catLabel: 'Single Origin',
    type: 'coffee',
    notes: 'Blueberry · Jasmine · Dark Chocolate',
    process: 'Natural',
    altitude: '1,850m',
    sizes: [
      { id: '250g', label: '250g', price: 22 },
      { id: '500g', label: '500g', price: 40 },
      { id: '1kg', label: '1kg', price: 74 },
    ],
    img: 'product — Ethiopia Yirgacheffe bag',
    imgSrc: '/products/ethiopia-yirgacheffe.jpg',
    addedAt: 12,
    cardSize: 'tall',
  },
  {
    id: 'col-huila',
    name: 'Colombia Huila',
    cat: 'single-origin',
    catLabel: 'Single Origin',
    type: 'coffee',
    notes: 'Red Apple · Caramel · Hazelnut',
    process: 'Washed',
    altitude: '1,700m',
    sizes: [
      { id: '250g', label: '250g', price: 20 },
      { id: '500g', label: '500g', price: 36 },
      { id: '1kg', label: '1kg', price: 68 },
    ],
    img: 'product — Colombia Huila bag',
    imgSrc: '/products/colombia-huila.jpg',
    addedAt: 11,
    cardSize: 'tall',
  },
  {
    id: 'kenya-aa',
    name: 'Kenya AA',
    cat: 'single-origin',
    catLabel: 'Single Origin',
    type: 'coffee',
    notes: 'Blackcurrant · Grapefruit · Brown Sugar',
    process: 'Washed',
    altitude: '1,900m',
    sizes: [
      { id: '250g', label: '250g', price: 24 },
      { id: '500g', label: '500g', price: 44 },
      { id: '1kg', label: '1kg', price: 82 },
    ],
    img: 'product — Kenya AA bag',
    imgSrc: '/products/kenya-aa.png',
    addedAt: 10,
    cardSize: 'tall',
  },

  /* ===== International Roast (Blends) ===== */
  {
    id: 'forma-esp',
    name: 'FORMA Espresso Blend',
    cat: 'international-roast',
    catLabel: 'House Blend',
    type: 'coffee',
    notes: 'Dark Chocolate · Walnut · Molasses',
    sizes: [
      { id: '250g', label: '250g', price: 16 },
      { id: '500g', label: '500g', price: 28 },
      { id: '1kg', label: '1kg', price: 52 },
    ],
    img: 'product — FORMA Espresso bag',
    imgSrc: '/products/forma-espresso.jpg',
    addedAt: 9,
    cardSize: 'tall',
  },
  {
    id: 'morning-ritual',
    name: 'Morning Ritual',
    cat: 'international-roast',
    catLabel: 'House Blend',
    type: 'coffee',
    notes: 'Toasted Almond · Caramel · Honey',
    sizes: [
      { id: '250g', label: '250g', price: 14 },
      { id: '500g', label: '500g', price: 26 },
      { id: '1kg', label: '1kg', price: 48 },
    ],
    img: 'product — Morning Ritual bag',
    imgSrc: '/products/morning-ritual.png',
    addedAt: 8,
    cardSize: 'tall',
  },

  /* ===== Equipment ===== */
  {
    id: 'hario-v60-02',
    name: 'Hario V60 Ceramic 02',
    cat: 'equipment',
    catLabel: 'Dripper',
    type: 'equipment',
    notes: 'Hand-poured ceramic · Size 02',
    price: 32,
    img: 'product — Hario V60 ceramic 02',
    imgSrc: '/products/hario-v60-ceramic.png',
    addedAt: 7,
    cardSize: 'normal',
  },
  {
    id: 'chemex-6cup',
    name: 'Chemex Classic 6-Cup',
    cat: 'equipment',
    catLabel: 'Brewer',
    type: 'equipment',
    notes: 'Hand-blown borosilicate · 6-cup',
    price: 48,
    img: 'product — Chemex Classic 6-cup',
    imgSrc: '/products/chemex-classic.jpg',
    addedAt: 6,
    cardSize: 'tall',
  },
  {
    id: 'kalita-wave-185',
    name: 'Kalita Wave 185 Glass',
    cat: 'equipment',
    catLabel: 'Dripper',
    type: 'equipment',
    notes: 'Flat-bottom glass · Size 185',
    price: 42,
    img: 'product — Kalita Wave 185 glass',
    imgSrc: '/products/kalita-wave-185.png',
    addedAt: 5,
    cardSize: 'normal',
  },
  {
    id: 'origami-air-s',
    name: 'Origami Air Dripper S',
    cat: 'equipment',
    catLabel: 'Dripper',
    type: 'equipment',
    notes: 'Faceted resin · Size Small',
    price: 30,
    img: 'product — Origami Air Dripper S',
    imgSrc: '/products/origami-air-dripper.png',
    addedAt: 4,
    cardSize: 'normal',
  },

  /* ===== Filters & Accessories ===== */
  {
    id: 'v60-filters-100',
    name: 'V60 Paper Filters 100pk',
    cat: 'filters',
    catLabel: '100 Pack',
    type: 'equipment',
    notes: 'Natural unbleached · For Hario V60 02',
    price: 10,
    img: 'product — V60 filter pack',
    imgSrc: '/products/v60-filters.png',
    addedAt: 3,
    cardSize: 'short',
  },
  {
    id: 'chemex-filters-100',
    name: 'Chemex Natural Filters 100pk',
    cat: 'filters',
    catLabel: '100 Pack',
    type: 'equipment',
    notes: 'Pre-folded squares · For Classic 6-cup',
    price: 12,
    img: 'product — Chemex filters pack',
    imgSrc: '/products/chemex-filters.jpg',
    addedAt: 2,
    cardSize: 'short',
  },
  {
    id: 'kalita-filters-100',
    name: 'Kalita Wave Filters 100pk',
    cat: 'filters',
    catLabel: '100 Pack',
    type: 'equipment',
    notes: 'Wave-shaped · For Kalita 185',
    price: 11,
    img: 'product — Kalita Wave filters',
    imgSrc: '/products/kalita-filters.png',
    addedAt: 1,
    cardSize: 'short',
  },
];

/* ---------- Sort options ---------- */
const SORTS = [
  { id: 'newest', label: 'Newest' },
  { id: 'low-high', label: 'Price: Low to High' },
  { id: 'high-low', label: 'Price: High to Low' },
];

/* ---------- Tiny logo mark ---------- */
function LogoMark() {
  return (
    <span
      className="inline-flex items-baseline select-none"
      style={{
        fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
        fontWeight: 600,
        fontSize: '1.05rem',
        letterSpacing: '0.16em',
        color: 'var(--text)',
      }}
    >
      FORMA
      <span
        aria-hidden="true"
        style={{
          color: 'var(--gold)',
          fontStyle: 'italic',
          margin: '0 0.18em',
          transform: 'skewX(-14deg)',
          display: 'inline-block',
        }}
      >
        /
      </span>
      ROAST
    </span>
  );
}

/* ---------- Custom dropdown for sort ---------- */
function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  useEffect(() => {
    const onClick = (e) => {
      if (!wrapRef.current || wrapRef.current.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);
  const current = SORTS.find((s) => s.id === value) || SORTS[0];
  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-sm"
        style={{
          border: '1px solid var(--border)',
          color: 'var(--text)',
          backgroundColor: 'rgba(228,221,209,0.02)',
          fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
          fontSize: 12,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        <span style={{ color: 'var(--muted)' }}>Sort:</span>
        <span>{current.label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          style={{ color: 'var(--gold)' }}
        />
      </button>
      {open && (
        <ul
          className="absolute right-0 mt-2 min-w-[230px] py-1 z-10"
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 4,
            boxShadow: '0 12px 30px -8px rgba(0,0,0,0.6)',
          }}
        >
          {SORTS.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => {
                  onChange(s.id);
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 inline-flex items-center justify-between gap-3"
                style={{
                  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                  fontSize: 13,
                  color: value === s.id ? 'var(--gold)' : 'var(--text)',
                  backgroundColor:
                    value === s.id ? 'rgba(201,169,110,0.06)' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (value !== s.id)
                    e.currentTarget.style.backgroundColor = 'rgba(228,221,209,0.04)';
                }}
                onMouseLeave={(e) => {
                  if (value !== s.id)
                    e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span>{s.label}</span>
                {value === s.id && <Check className="w-3.5 h-3.5" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------- Variant dropdown (Size / Grind) ---------- */
function VariantDropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  useEffect(() => {
    const onClick = (e) => {
      if (!wrapRef.current || wrapRef.current.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);
  const current = options.find((o) => o.id === value) || options[0];
  return (
    <div ref={wrapRef} className="relative w-full" onClick={(e) => e.stopPropagation()}>
      <span
        style={{
          display: 'block',
          fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
          fontSize: 10.5,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--muted)',
          marginBottom: 5,
          fontWeight: 500,
        }}
      >
        {label}
      </span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="w-full inline-flex items-center justify-between gap-2 px-3 py-2"
        style={{
          border: '1px solid var(--border)',
          backgroundColor: 'var(--surface)',
          color: 'var(--text)',
          fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
          fontSize: 12.5,
          letterSpacing: '0.02em',
          borderRadius: 3,
          minHeight: 36,
        }}
      >
        <span style={{ color: 'var(--gold)', fontWeight: 500 }}>{current.label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          style={{ color: 'var(--gold)' }}
        />
      </button>
      {open && (
        <ul
          className="absolute left-0 right-0 mt-1 py-1 z-20"
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 3,
            boxShadow: '0 14px 32px -10px rgba(0,0,0,0.75)',
            maxHeight: 220,
            overflowY: 'auto',
          }}
        >
          {options.map((o) => (
            <li key={o.id}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(o.id);
                  setOpen(false);
                }}
                className="w-full text-left px-3 py-2 inline-flex items-center justify-between gap-3"
                style={{
                  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                  fontSize: 12.5,
                  color: value === o.id ? 'var(--gold)' : 'var(--text)',
                  backgroundColor:
                    value === o.id ? 'rgba(201,169,110,0.06)' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (value !== o.id)
                    e.currentTarget.style.backgroundColor = 'rgba(228,221,209,0.04)';
                }}
                onMouseLeave={(e) => {
                  if (value !== o.id)
                    e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span>{o.label}</span>
                {value === o.id && (
                  <Check className="w-3.5 h-3.5" style={{ color: 'var(--gold)' }} />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------- Product Card ---------- */
function ProductCard({ product, onAdd }) {
  const isCoffee = product.type === 'coffee';

  const [selectorOpen, setSelectorOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState(
    isCoffee ? product.sizes[0].id : null
  );
  const [selectedGrind, setSelectedGrind] = useState(
    isCoffee ? 'whole-bean' : null
  );

  const sizeOptions = isCoffee
    ? product.sizes.map((s) => ({ id: s.id, label: s.label }))
    : [];

  const currentSizeObj = isCoffee
    ? product.sizes.find((s) => s.id === selectedSize) || product.sizes[0]
    : null;
  const currentPrice = isCoffee ? currentSizeObj.price : product.price;

  const handleCardClick = () => {
    if (isCoffee) setSelectorOpen((v) => !v);
  };

  const handleAdd = (e) => {
    e.stopPropagation();
    if (isCoffee) {
      const grindLabel =
        GRIND_OPTIONS.find((g) => g.id === selectedGrind)?.label || 'Whole Bean';
      onAdd({
        variantId: `${product.id}-${selectedSize}-${selectedGrind}`,
        id: product.id,
        name: product.name,
        catLabel: product.catLabel,
        notes: product.notes,
        size: currentSizeObj.label,
        grind: grindLabel,
        price: currentSizeObj.price,
      });
      // Soft-close the selector after adding
      setTimeout(() => setSelectorOpen(false), 240);
    } else {
      onAdd({
        variantId: product.id,
        id: product.id,
        name: product.name,
        catLabel: product.catLabel,
        notes: product.notes,
        size: null,
        grind: null,
        price: product.price,
      });
    }
  };

  // 3D tilt on mousemove (desktop only)
  const cardRef = useRef(null);
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const rect = card.getBoundingClientRect();
    const rx = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
    const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    card.style.transition = 'none';
    card.style.transform = `perspective(900px) rotateX(${(-rx).toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(1.03)`;
  };
  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transition = 'transform 400ms ease-out';
    card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
  };

  return (
    <article
      ref={cardRef}
      className={`forma-product-card group ${selectorOpen ? 'forma-card-open' : ''}`}
      onClick={handleCardClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        overflow: selectorOpen ? 'visible' : 'hidden',
        borderRadius: 6,
        border: '1px solid var(--border)',
        backgroundColor: 'var(--surface)',
        cursor: 'pointer',
        transformStyle: 'preserve-3d',
        zIndex: selectorOpen ? 30 : 'auto',
      }}
    >
      {/* Image (square 1:1) */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1',
          overflow: 'hidden',
          backgroundColor: 'var(--surface)',
          flexShrink: 0,
        }}
      >
        {product.imgSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imgSrc}
            alt={product.name}
            draggable="false"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              backgroundColor: 'var(--surface)',
              display: 'block',
              userSelect: 'none',
            }}
          />
        ) : (
          <div
            data-img-placeholder={product.img}
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 50% 45%, #1f1810 0%, #100c08 70%, #0C0A07 100%)',
              border: 'none',
            }}
          />
        )}

        {/* Anamorphic lens-flare streak — across image only */}
        <span
          aria-hidden="true"
          className="forma-flare"
          style={{
            position: 'absolute',
            left: '-12%',
            right: '-12%',
            top: '58%',
            height: 2,
            background:
              'linear-gradient(90deg, rgba(201,169,110,0) 0%, rgba(201,169,110,0.55) 50%, rgba(201,169,110,0) 100%)',
            filter: 'blur(8px)',
            opacity: 0,
            transform: 'scaleX(0)',
            transformOrigin: 'left center',
            transition:
              'opacity 350ms ease, transform 700ms cubic-bezier(0.25,0.46,0.45,0.94)',
            pointerEvents: 'none',
          }}
        />
        <span
          aria-hidden="true"
          className="forma-flare-2"
          style={{
            position: 'absolute',
            left: '-12%',
            right: '-12%',
            top: '62%',
            height: 1,
            background:
              'linear-gradient(90deg, rgba(228,221,209,0) 0%, rgba(228,221,209,0.4) 50%, rgba(228,221,209,0) 100%)',
            filter: 'blur(3px)',
            opacity: 0,
            transform: 'scaleX(0)',
            transformOrigin: 'left center',
            transition:
              'opacity 400ms ease 80ms, transform 700ms cubic-bezier(0.25,0.46,0.45,0.94) 60ms',
            pointerEvents: 'none',
          }}
        />

        {/* Close button when selector is open (coffee only) */}
        {isCoffee && selectorOpen && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectorOpen(false);
            }}
            aria-label="Close selector"
            className="forma-close-btn"
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              width: 30,
              height: 30,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              border: '1px solid rgba(201,169,110,0.3)',
              backgroundColor: 'rgba(12,10,7,0.7)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              color: 'var(--gold)',
              cursor: 'pointer',
              zIndex: 5,
              transition:
                'background-color 180ms ease, border-color 180ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(201,169,110,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(12,10,7,0.7)';
            }}
          >
            <X className="w-3.5 h-3.5" strokeWidth={1.75} />
          </button>
        )}
      </div>

      {/* Info panel (sits below the square image) */}
      <div
        className="forma-glass"
        style={{
          position: 'relative',
          backgroundColor: 'var(--surface)',
          borderTop: '1px solid rgba(201,169,110,0.12)',
          padding: '16px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          transition: 'background-color 320ms ease, padding 320ms ease',
        }}
      >
        <span
          style={{
            color: 'var(--gold)',
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            fontSize: 9.5,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            fontWeight: 500,
          }}
        >
          {product.catLabel}
        </span>

        <h3
          style={{
            fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
            fontWeight: 600,
            fontSize: 20,
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
            color: 'var(--text)',
            margin: 0,
          }}
        >
          {product.name}
        </h3>

        <p
          style={{
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: 11,
            color: 'var(--muted)',
            fontStyle: 'italic',
            margin: 0,
            lineHeight: 1.45,
          }}
        >
          {product.notes}
        </p>

        {/* Single-origin meta (process + altitude) */}
        {isCoffee && product.process && (
          <span
            style={{
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              fontSize: 10,
              color: 'var(--muted)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginTop: 2,
            }}
          >
            {product.process} · {product.altitude}
          </span>
        )}

        {/* DEFAULT STATE: price shown when selector is closed */}
        {!selectorOpen && (
          <div
            className="flex items-end justify-between gap-3"
            style={{ marginTop: 10 }}
          >
            <span
              style={{
                fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                fontWeight: 700,
                fontSize: 22,
                color: 'var(--gold)',
                letterSpacing: '-0.01em',
                lineHeight: 1,
              }}
            >
              {isCoffee ? (
                <>
                  <span
                    style={{
                      fontSize: 11,
                      color: 'var(--muted)',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      fontFamily:
                        "var(--font-dm-sans), 'DM Sans', sans-serif",
                      fontWeight: 400,
                      marginRight: 6,
                    }}
                  >
                    From
                  </span>
                  ${product.sizes[0].price}
                </>
              ) : (
                <>${product.price}</>
              )}
            </span>
            <span
              aria-hidden="true"
              style={{
                color: 'var(--gold)',
                fontSize: 10,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                opacity: 0.7,
              }}
            >
              {isCoffee ? 'Tap to select' : 'Hover to add'}
            </span>
          </div>
        )}

        {/* OPEN STATE: selector dropdowns (coffee only) */}
        {isCoffee && selectorOpen && (
          <div
            className="forma-selector"
            style={{
              marginTop: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <div className="grid grid-cols-2 gap-3">
              <VariantDropdown
                label="Size"
                options={sizeOptions}
                value={selectedSize}
                onChange={setSelectedSize}
              />
              <VariantDropdown
                label="Grind"
                options={GRIND_OPTIONS}
                value={selectedGrind}
                onChange={setSelectedGrind}
              />
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className="forma-add-cart-live"
              style={{
                marginTop: 6,
                width: '100%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                padding: '12px 16px',
                backgroundColor: '#C9A96E',
                color: '#0C0A07',
                border: 'none',
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                fontSize: 12.5,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontWeight: 600,
                cursor: 'pointer',
                borderRadius: 3,
                transition: 'background-color 200ms ease, transform 200ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#d6b97d';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#C9A96E';
              }}
            >
              <span>Add to Cart</span>
              <span style={{ opacity: 0.55 }}>—</span>
              <span>${currentPrice}</span>
            </button>
          </div>
        )}

        {/* Equipment: hover-triggered slide-up Add to Cart */}
        {!isCoffee && (
          <button
            type="button"
            onClick={handleAdd}
            className="forma-add-btn"
            aria-label={`Add ${product.name} to cart`}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: 0,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              backgroundColor: '#C9A96E',
              color: '#0C0A07',
              border: 'none',
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              fontSize: 12,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontWeight: 600,
              transition:
                'height 300ms cubic-bezier(0.22,1,0.36,1), background-color 200ms ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#d6b97d')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#C9A96E')}
          >
            <span>Add to Cart</span>
            <span style={{ opacity: 0.55 }}>—</span>
            <span>${product.price}</span>
            <Plus className="w-4 h-4" strokeWidth={1.75} />
          </button>
        )}
      </div>
    </article>
  );
}

/* ---------- Page ---------- */
export default function ShopPage() {
  const [cat, setCat] = useState('all');
  const [sort, setSort] = useState('newest');
  const [toast, setToast] = useState(null); // { name, id, time }

  // Cart persistence (localStorage)
  const [cart, setCart] = useState([]);
  useEffect(() => {
    try {
      const stored = localStorage.getItem('forma-cart');
      if (stored) setCart(JSON.parse(stored));
    } catch (_) {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem('forma-cart', JSON.stringify(cart));
    } catch (_) {}
    // Notify nav (and any other listeners) within the same tab
    try {
      window.dispatchEvent(new Event('forma-cart-update'));
    } catch (_) {}
  }, [cart]);

  const addToCart = (product) => {
    // product here is normalized by ProductCard.handleAdd to include variantId/size/grind/price
    setCart((prev) => {
      const existing = prev.find((i) => i.variantId === product.variantId);
      if (existing) {
        return prev.map((i) =>
          i.variantId === product.variantId
            ? { ...i, qty: (i.qty || 1) + 1 }
            : i
        );
      }
      return [
        ...prev,
        {
          variantId: product.variantId,
          id: product.id,
          name: product.name,
          price: product.price,
          catLabel: product.catLabel,
          notes: product.notes,
          size: product.size || null,
          grind: product.grind || null,
          qty: 1,
        },
      ];
    });
    setToast({
      name: product.name,
      size: product.size || null,
      time: Date.now(),
    });
  };

  // Auto-dismiss toast (3s per spec)
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(t);
  }, [toast]);

  // Helper: get base/starting price for any product (coffee uses smallest size)
  const priceOf = (p) =>
    p.type === 'coffee' ? p.sizes[0].price : p.price;

  // Filter + sort
  const filtered = useMemo(() => {
    let list = cat === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.cat === cat);
    if (sort === 'low-high')
      list = [...list].sort((a, b) => priceOf(a) - priceOf(b));
    else if (sort === 'high-low')
      list = [...list].sort((a, b) => priceOf(b) - priceOf(a));
    else list = [...list].sort((a, b) => b.addedAt - a.addedAt); // newest
    return list;
  }, [cat, sort]);

  const cartCount = cart.reduce((sum, i) => sum + (i.qty || 1), 0);

  return (
    <section className="pt-28 lg:pt-32 pb-20 min-h-screen">
      <div
        className="max-w-[1500px] mx-auto px-6 lg:px-10 grid gap-10 lg:gap-14 forma-shop-grid"
      >
        {/* ============ MOBILE: HORIZONTAL PILL ROW ============ */}
        <div className="lg:hidden -mx-6 px-6 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          <ul
            className="flex items-center gap-2 pb-2"
            style={{ width: 'max-content', minWidth: '100%' }}
          >
            {CATEGORIES.map((c) => {
              const active = cat === c.id;
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => setCat(c.id)}
                    className="whitespace-nowrap transition"
                    style={{
                      fontFamily:
                        "var(--font-dm-sans), 'DM Sans', sans-serif",
                      fontSize: 12,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      padding: '8px 16px',
                      borderRadius: 999,
                      border: `1px solid ${active ? 'var(--gold)' : 'var(--border)'}`,
                      color: active ? 'var(--gold)' : 'var(--muted)',
                      backgroundColor: active
                        ? 'rgba(201,169,110,0.08)'
                        : 'transparent',
                      fontWeight: active ? 600 : 500,
                    }}
                  >
                    {c.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ============ SIDEBAR (desktop only) ============ */}
        <aside
          className="hidden lg:flex flex-col gap-8 self-start"
          style={{
            position: 'sticky',
            top: 110,
            borderRight: '1px solid var(--border)',
            paddingRight: '1.5rem',
            minHeight: 'calc(100vh - 200px)',
          }}
        >
          <Link href="/" className="inline-flex">
            <LogoMark />
          </Link>

          <div className="flex flex-col gap-1 mt-2">
            <span className="label-tag" style={{ color: 'var(--muted)' }}>
              Categories
            </span>
            <ul className="flex flex-col mt-3">
              {CATEGORIES.map((c, i) => {
                const active = cat === c.id;
                return (
                  <li
                    key={c.id}
                    style={{
                      borderTop: '1px solid var(--border)',
                      borderBottom:
                        i === CATEGORIES.length - 1
                          ? '1px solid var(--border)'
                          : 'none',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setCat(c.id)}
                      className="w-full text-left py-3.5 pl-3 transition"
                      style={{
                        fontFamily:
                          "var(--font-dm-sans), 'DM Sans', sans-serif",
                        fontSize: 13,
                        letterSpacing: '0.04em',
                        color: active ? 'var(--gold)' : 'var(--muted)',
                        borderLeft: active
                          ? '2px solid var(--gold)'
                          : '2px solid transparent',
                      }}
                      onMouseEnter={(e) => {
                        if (!active) e.currentTarget.style.color = 'var(--text)';
                      }}
                      onMouseLeave={(e) => {
                        if (!active) e.currentTarget.style.color = 'var(--muted)';
                      }}
                    >
                      {c.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Cart summary */}
          <Link
            href="/cart"
            className="mt-4 flex items-center justify-between gap-3 px-4 py-3 transition"
            style={{
              border: '1px solid var(--border)',
              borderRadius: 4,
              color: 'var(--text)',
              backgroundColor: 'rgba(201,169,110,0.04)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(201,169,110,0.45)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
          >
            <span className="inline-flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" strokeWidth={1.5} style={{ color: 'var(--gold)' }} />
              <span style={{ fontSize: 13, letterSpacing: '0.04em' }}>
                Cart
              </span>
            </span>
            <span
              style={{
                fontSize: 12,
                color: 'var(--gold)',
                fontWeight: 600,
                letterSpacing: '0.08em',
              }}
            >
              {cartCount}
            </span>
          </Link>
        </aside>

        {/* ============ MAIN GRID ============ */}
        <div className="flex flex-col gap-8 min-w-0">
          {/* Page heading */}
          <div className="flex flex-col gap-3 mb-2">
            <span className="label-tag" style={{ color: 'var(--gold)' }}>
              {CATEGORIES.find((c) => c.id === cat)?.label}
            </span>
            <h1
              style={{
                fontFamily:
                  "var(--font-cormorant), 'Cormorant Garamond', serif",
                fontWeight: 600,
                fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)',
                lineHeight: 1,
                letterSpacing: '-0.02em',
                color: 'var(--text)',
              }}
            >
              The Shop.
            </h1>
          </div>

          {/* Sort row */}
          <div
            className="flex items-center justify-between gap-4 pb-5"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <span
              style={{
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                fontSize: 13,
                color: 'var(--muted)',
                letterSpacing: '0.04em',
              }}
            >
              Showing <strong style={{ color: 'var(--text)' }}>{filtered.length}</strong>{' '}
              product{filtered.length === 1 ? '' : 's'}
            </span>
            <SortDropdown value={sort} onChange={setSort} />
          </div>

          {/* Masonry grid (CSS columns) */}
          {filtered.length === 0 ? (
            <div className="py-24 text-center">
              <p
                style={{
                  fontFamily:
                    "var(--font-cormorant), 'Cormorant Garamond', serif",
                  fontStyle: 'italic',
                  fontSize: 22,
                  color: 'var(--muted)',
                }}
              >
                No products in this category yet.
              </p>
            </div>
          ) : (
            <div className="forma-products-grid">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} onAdd={addToCart} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'fixed',
          right: 'clamp(16px, 2vw, 28px)',
          bottom: 'clamp(80px, 7vh, 90px)',
          zIndex: 80,
          pointerEvents: 'none',
        }}
      >
        {toast && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              minWidth: 280,
              maxWidth: 360,
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--gold)',
              borderRadius: 4,
              boxShadow: '0 14px 34px -10px rgba(0,0,0,0.75)',
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              animation: 'toast-pop 240ms cubic-bezier(0.22,1,0.36,1)',
              pointerEvents: 'auto',
            }}
          >
            {/* Top hairline divider */}
            <span
              aria-hidden="true"
              style={{
                display: 'block',
                height: 1,
                margin: '10px 18px 0',
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(201,169,110,0.55) 50%, transparent 100%)',
              }}
            />

            <div
              className="flex flex-col"
              style={{ padding: '12px 18px 14px', gap: 4 }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  color: 'var(--gold)',
                  fontSize: 11,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    border: '1px solid var(--gold)',
                    fontSize: 9,
                    fontWeight: 700,
                  }}
                >
                  ✓
                </span>
                Added to order
              </span>
              <span
                style={{
                  color: 'var(--text)',
                  fontFamily:
                    "var(--font-cormorant), 'Cormorant Garamond', serif",
                  fontWeight: 600,
                  fontSize: 16,
                  letterSpacing: '-0.005em',
                  lineHeight: 1.25,
                }}
              >
                {toast.name}
                {toast.size && (
                  <span
                    style={{
                      color: 'var(--muted)',
                      fontFamily:
                        "var(--font-dm-sans), 'DM Sans', sans-serif",
                      fontWeight: 300,
                      fontSize: 12.5,
                      marginLeft: 8,
                      letterSpacing: '0.02em',
                    }}
                  >
                    · {toast.size}
                  </span>
                )}
              </span>
            </div>

            {/* Bottom hairline divider */}
            <span
              aria-hidden="true"
              style={{
                display: 'block',
                height: 1,
                margin: '0 18px 10px',
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(201,169,110,0.55) 50%, transparent 100%)',
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
}

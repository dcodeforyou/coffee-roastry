'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Plus, Minus, ArrowRight, ArrowLeft } from 'lucide-react';

const FREE_SHIPPING_THRESHOLD = 45;
const SHIPPING_FEE = 6;

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  // Read cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('forma-cart');
      if (stored) setCart(JSON.parse(stored));
    } catch (_) {}
    setHydrated(true);
  }, []);

  // Sync cart to localStorage on change (only after hydration)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem('forma-cart', JSON.stringify(cart));
    } catch (_) {}
    try {
      window.dispatchEvent(new Event('forma-cart-update'));
    } catch (_) {}
  }, [cart, hydrated]);

  const updateQty = (variantId, delta) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.variantId === variantId
            ? { ...i, qty: Math.max(0, (i.qty || 1) + delta) }
            : i
        )
        .filter((i) => (i.qty || 0) > 0)
    );
  };

  const removeItem = (variantId) => {
    setCart((prev) => prev.filter((i) => i.variantId !== variantId));
  };

  const itemCount = useMemo(
    () => cart.reduce((s, i) => s + (i.qty || 1), 0),
    [cart]
  );

  const subtotal = useMemo(
    () => cart.reduce((s, i) => s + i.price * (i.qty || 1), 0),
    [cart]
  );

  const shipping =
    subtotal === 0
      ? 0
      : subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : SHIPPING_FEE;
  const total = subtotal + shipping;

  return (
    <section className="pt-28 lg:pt-32 pb-24 min-h-screen">
      <div className="max-w-[720px] mx-auto px-6">
        {/* ============ HEADER ============ */}
        <div className="flex flex-col gap-3 mb-10 lg:mb-14">
          <span
            className="label-tag"
            style={{ color: 'var(--gold)' }}
            data-reveal-body
          >
            Your Order
          </span>
          <h1
            data-reveal-heading
            style={{
              fontFamily:
                "var(--font-cormorant), 'Cormorant Garamond', serif",
              fontWeight: 700,
              fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              color: 'var(--text)',
              margin: 0,
            }}
          >
            Before you go.
          </h1>
          {hydrated && itemCount > 0 && (
            <span
              style={{
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                fontSize: 13,
                color: 'var(--muted)',
                letterSpacing: '0.04em',
              }}
            >
              ({itemCount} item{itemCount === 1 ? '' : 's'})
            </span>
          )}
        </div>

        {!hydrated ? (
          // Skeleton while reading localStorage
          <div className="py-10" style={{ opacity: 0.5 }}>
            <div
              style={{
                height: 1,
                width: '100%',
                backgroundColor: 'var(--border)',
              }}
            />
          </div>
        ) : cart.length === 0 ? (
          /* ============ EMPTY STATE ============ */
          <div
            className="flex flex-col items-center text-center gap-7 py-16"
            data-reveal-body
          >
            <p
              style={{
                fontFamily:
                  "var(--font-cormorant), 'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontWeight: 500,
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                lineHeight: 1.25,
                color: 'var(--muted)',
                maxWidth: 460,
              }}
            >
              Your ritual hasn’t begun yet.
            </p>
            <Link
              href="/shop"
              className="btn-gold"
              style={{
                paddingLeft: '1.6rem',
                paddingRight: '1.6rem',
                paddingTop: '0.7rem',
                paddingBottom: '0.7rem',
              }}
            >
              Explore the Collection
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
            </Link>
          </div>
        ) : (
          /* ============ CART ITEMS + SUMMARY ============ */
          <>
            <ul className="flex flex-col" style={{ listStyle: 'none' }}>
              {cart.map((item, idx) => (
                <li
                  key={item.variantId}
                  style={{
                    borderTop:
                      idx === 0 ? '1px solid var(--border)' : 'none',
                    borderBottom: '1px solid var(--border)',
                    padding: '24px 0',
                  }}
                  data-reveal-body
                >
                  <div
                    className="grid items-start gap-5"
                    style={{ gridTemplateColumns: '64px 1fr auto' }}
                  >
                    {/* Image placeholder */}
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        backgroundColor: '#100c08',
                        border: '1px solid var(--border)',
                        borderRadius: 4,
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background:
                            'radial-gradient(circle at 50% 45%, #1f1810 0%, #100c08 70%, #0C0A07 100%)',
                        }}
                      />
                    </div>

                    {/* Middle: name + variant */}
                    <div className="flex flex-col gap-1 min-w-0">
                      <h3
                        style={{
                          fontFamily:
                            "var(--font-cormorant), 'Cormorant Garamond', serif",
                          fontWeight: 600,
                          fontSize: 18,
                          lineHeight: 1.2,
                          letterSpacing: '-0.005em',
                          color: 'var(--text)',
                          margin: 0,
                        }}
                      >
                        {item.name}
                      </h3>
                      {(item.size || item.grind) && (
                        <p
                          style={{
                            fontFamily:
                              "var(--font-dm-sans), 'DM Sans', sans-serif",
                            fontWeight: 300,
                            fontSize: 12,
                            color: 'var(--muted)',
                            margin: 0,
                            letterSpacing: '0.02em',
                          }}
                        >
                          {item.size && item.grind
                            ? `${item.size} · ${item.grind} Grind`
                            : item.size || item.grind}
                        </p>
                      )}
                      {item.catLabel && !item.size && !item.grind && (
                        <p
                          style={{
                            fontFamily:
                              "var(--font-dm-sans), 'DM Sans', sans-serif",
                            fontWeight: 300,
                            fontSize: 12,
                            color: 'var(--muted)',
                            margin: 0,
                            letterSpacing: '0.02em',
                          }}
                        >
                          {item.catLabel}
                        </p>
                      )}
                    </div>

                    {/* Right: price / qty / remove */}
                    <div className="flex flex-col items-end gap-2">
                      <span
                        style={{
                          fontFamily:
                            "var(--font-cormorant), 'Cormorant Garamond', serif",
                          fontWeight: 700,
                          fontSize: 20,
                          color: 'var(--gold)',
                          letterSpacing: '-0.01em',
                          lineHeight: 1,
                        }}
                      >
                        ${(item.price * (item.qty || 1)).toFixed(2)}
                      </span>

                      <div className="inline-flex items-center gap-2.5 mt-1">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => updateQty(item.variantId, -1)}
                          className="forma-qty-btn"
                          style={{
                            width: 26,
                            height: 26,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid rgba(201,169,110,0.4)',
                            borderRadius: '50%',
                            backgroundColor: 'transparent',
                            color: 'var(--gold)',
                            cursor: 'pointer',
                            transition:
                              'background-color 200ms ease, border-color 200ms ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                              'rgba(201,169,110,0.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              'transparent';
                          }}
                        >
                          <Minus className="w-3 h-3" strokeWidth={1.75} />
                        </button>
                        <span
                          style={{
                            fontFamily:
                              "var(--font-dm-sans), 'DM Sans', sans-serif",
                            fontSize: 13,
                            color: 'var(--text)',
                            minWidth: 18,
                            textAlign: 'center',
                            fontWeight: 500,
                            letterSpacing: '0.02em',
                          }}
                        >
                          {item.qty || 1}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => updateQty(item.variantId, +1)}
                          className="forma-qty-btn"
                          style={{
                            width: 26,
                            height: 26,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid rgba(201,169,110,0.4)',
                            borderRadius: '50%',
                            backgroundColor: 'transparent',
                            color: 'var(--gold)',
                            cursor: 'pointer',
                            transition:
                              'background-color 200ms ease, border-color 200ms ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                              'rgba(201,169,110,0.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              'transparent';
                          }}
                        >
                          <Plus className="w-3 h-3" strokeWidth={1.75} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.variantId)}
                        style={{
                          fontFamily:
                            "var(--font-dm-sans), 'DM Sans', sans-serif",
                          fontSize: 10,
                          color: 'var(--muted)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.16em',
                          backgroundColor: 'transparent',
                          border: 'none',
                          padding: '2px 0',
                          cursor: 'pointer',
                          transition: 'color 200ms ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'var(--gold)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--muted)';
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* ============ ORDER SUMMARY ============ */}
            <div className="flex justify-end mt-10">
              <div
                data-reveal-body
                style={{
                  width: '100%',
                  maxWidth: 380,
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 4,
                  padding: 28,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0,
                }}
              >
                {/* Subtotal */}
                <div
                  className="flex justify-between items-baseline"
                  style={{ marginBottom: 10 }}
                >
                  <span
                    style={{
                      fontFamily:
                        "var(--font-dm-sans), 'DM Sans', sans-serif",
                      fontSize: 13,
                      color: 'var(--muted)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    Subtotal
                  </span>
                  <span
                    style={{
                      fontFamily:
                        "var(--font-dm-sans), 'DM Sans', sans-serif",
                      fontSize: 14,
                      color: 'var(--text)',
                      fontWeight: 500,
                    }}
                  >
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                {/* Shipping */}
                <div
                  className="flex justify-between items-baseline"
                  style={{ marginBottom: 6 }}
                >
                  <span
                    style={{
                      fontFamily:
                        "var(--font-dm-sans), 'DM Sans', sans-serif",
                      fontSize: 13,
                      color: 'var(--muted)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    Shipping
                  </span>
                  <span
                    style={{
                      fontFamily:
                        "var(--font-dm-sans), 'DM Sans', sans-serif",
                      fontSize: 14,
                      color: shipping === 0 ? 'var(--gold)' : 'var(--text)',
                      fontWeight: 500,
                    }}
                  >
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p
                    style={{
                      fontFamily:
                        "var(--font-dm-sans), 'DM Sans', sans-serif",
                      fontSize: 10.5,
                      color: 'var(--muted)',
                      fontStyle: 'italic',
                      margin: '0 0 4px',
                      letterSpacing: '0.02em',
                    }}
                  >
                    Free shipping on orders over ${FREE_SHIPPING_THRESHOLD}.
                  </p>
                )}

                {/* Divider */}
                <div
                  style={{
                    height: 1,
                    backgroundColor: 'var(--border)',
                    margin: '16px 0',
                  }}
                />

                {/* Total */}
                <div className="flex justify-between items-baseline">
                  <span
                    style={{
                      fontFamily:
                        "var(--font-cormorant), 'Cormorant Garamond', serif",
                      fontSize: 17,
                      color: 'var(--text)',
                      letterSpacing: '-0.005em',
                      fontWeight: 500,
                    }}
                  >
                    Total
                  </span>
                  <span
                    style={{
                      fontFamily:
                        "var(--font-cormorant), 'Cormorant Garamond', serif",
                      fontWeight: 700,
                      fontSize: 24,
                      color: 'var(--gold)',
                      letterSpacing: '-0.01em',
                      lineHeight: 1,
                    }}
                  >
                    ${total.toFixed(2)}
                  </span>
                </div>

                {/* Checkout button */}
                <button
                  type="button"
                  className="mt-6 inline-flex items-center justify-center gap-2"
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    backgroundColor: '#C9A96E',
                    color: '#0C0A07',
                    border: 'none',
                    fontFamily:
                      "var(--font-dm-sans), 'DM Sans', sans-serif",
                    fontSize: 14,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    cursor: 'pointer',
                    borderRadius: 3,
                    transition: 'background-color 200ms ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#d6b97d';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#C9A96E';
                  }}
                  onClick={() => {
                    // Placeholder — wire to checkout backend later
                    alert(
                      'Checkout flow coming soon.\nTotal: $' + total.toFixed(2)
                    );
                  }}
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" strokeWidth={1.6} />
                </button>

                {/* Continue shopping */}
                <Link
                  href="/shop"
                  className="mt-4 inline-flex items-center justify-center gap-1.5 self-center"
                  style={{
                    fontFamily:
                      "var(--font-dm-sans), 'DM Sans', sans-serif",
                    fontSize: 12,
                    color: 'var(--muted)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    transition: 'color 200ms ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--text)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--muted)';
                  }}
                >
                  <ArrowLeft className="w-3 h-3" strokeWidth={1.6} />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

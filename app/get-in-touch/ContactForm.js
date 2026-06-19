'use client';

import { useState } from 'react';
import { ArrowRight, ChevronDown, Instagram } from 'lucide-react';

const STRIP_TEXT =
  'AI WEBSITE DESIGN · CUSTOM BUILDS · BUILT IN DAYS NOT MONTHS · DROP YOUR IDEA · FORMA/ROAST · WHERE FIRE MEETS OBSESSION · NOT FOR EVERYONE · ONLY THE UNUSUAL · ';

const STRIPS = [
  { top: '-5%', dir: 'ltr', duration: 28 },
  { top: '22%', dir: 'rtl', duration: 34 },
  { top: '42%', dir: 'ltr', duration: 28 },
  { top: '63%', dir: 'rtl', duration: 34 },
  { top: '84%', dir: 'ltr', duration: 28 },
];

const BUDGET_OPTIONS = [
  'Under $500',
  '$500 — $1,500',
  '$1,500 — $5,000',
  "Let's discuss",
];

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fadeOut, setFadeOut] = useState(false);
  const [budget, setBudget] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const form = e.currentTarget;
    const data = new FormData(form);
    setSubmitting(true);
    try {
      const res = await fetch('https://formspree.io/f/mykarded', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        setFadeOut(true);
        // Wait for fade-out animation, then swap content
        setTimeout(() => setSubmitted(true), 300);
      } else {
        const json = await res.json().catch(() => ({}));
        setErrorMsg(
          json?.errors?.[0]?.message || 'Something went wrong. Try again.'
        );
      }
    } catch (err) {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg)',
        paddingTop: 'clamp(7rem, 14vh, 9rem)',
        paddingBottom: 'clamp(4rem, 8vh, 6rem)',
      }}
    >
      {/* ===== Background diagonal text strips ===== */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      >
        {STRIPS.map((s, i) => (
          <div
            key={i}
            className="forma-contact-strip"
            style={{
              position: 'absolute',
              top: s.top,
              left: '-75vw',
              width: '250vw',
              transform: 'rotate(-16deg)',
              transformOrigin: 'left center',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              pointerEvents: 'none',
            }}
          >
            <div
              className={
                s.dir === 'ltr'
                  ? 'forma-strip-track-ltr'
                  : 'forma-strip-track-rtl'
              }
              style={{
                display: 'inline-flex',
                width: 'max-content',
                animationDuration: `${s.duration}s`,
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                fontWeight: 400,
                fontSize: 11,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(201,169,110,0.065)',
              }}
            >
              {/* Doubled so we can loop seamlessly with -50% translate */}
              <span>{STRIP_TEXT.repeat(8)}</span>
              <span>{STRIP_TEXT.repeat(8)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ===== Content (above strips) ===== */}
      <div
        className="relative w-full max-w-[1100px] mx-auto px-6 lg:px-10 flex flex-col items-center text-center"
        style={{ zIndex: 10, gap: 'clamp(28px, 4vh, 40px)' }}
      >
        {/* Eyebrow */}
        <span
          style={{
            color: 'var(--gold)',
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            fontWeight: 500,
            fontSize: 9,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
          }}
        >
          Get in Touch · FORMA/ROAST
        </span>

        {/* Heading */}
        <h1
          style={{
            fontFamily:
              "var(--font-cormorant), 'Cormorant Garamond', serif",
            fontWeight: 700,
            fontSize: 'clamp(2.25rem, 6vw, 3.625rem)',
            lineHeight: 1.02,
            letterSpacing: '-0.02em',
            color: 'var(--text)',
            margin: 0,
            maxWidth: '14ch',
          }}
        >
          Let&apos;s build
          <br />
          something unusual.
        </h1>

        {/* Subtext */}
        <p
          style={{
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: 14,
            lineHeight: 1.7,
            color: 'var(--muted)',
            maxWidth: 440,
            margin: 0,
          }}
        >
          Hey — I&apos;m Dushyant. This entire site, the animations, the shop,
          the orbital beans, was built by me with help of AI in a matter of
          days.
          <br />
          <br />
          If you want something like this for your brand, tell me what you need
          and what you&apos;re working with. If it&apos;s a good fit, you&apos;ll
          hear from me.
        </p>

        {/* ===== Form / Success card ===== */}
        <div
          className="forma-contact-card"
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: 520,
            background: 'rgba(12,10,7,0.45)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            border: '1px solid rgba(201,169,110,0.12)',
            borderRadius: 6,
            padding: 'clamp(28px, 4vw, 40px) clamp(24px, 4vw, 44px)',
            zIndex: 10,
            textAlign: 'left',
          }}
        >
          {!submitted ? (
            <form
              onSubmit={onSubmit}
              className={fadeOut ? 'forma-fade-out' : 'forma-fade-in'}
              style={{ display: 'flex', flexDirection: 'column', gap: 22 }}
            >
              <Field label="Your Name" name="name" type="text" placeholder="How should I address you" />
              <Field label="Email" name="email" type="email" required placeholder="Where I can reach you" />
              <FieldTextarea
                label="What Do You Need"
                name="message"
                required
                rows={4}
                placeholder="Tell me about your project, your brand, what you're building"
              />
              <BudgetSelect value={budget} onChange={setBudget} />

              {errorMsg && (
                <p
                  style={{
                    color: '#e0aa6e',
                    fontSize: 12,
                    fontFamily:
                      "var(--font-dm-sans), 'DM Sans', sans-serif",
                    margin: 0,
                    letterSpacing: '0.02em',
                  }}
                >
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="forma-send-btn"
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: '1px solid rgba(201,169,110,0.5)',
                  color: 'var(--gold)',
                  padding: '16px',
                  fontFamily:
                    "var(--font-dm-sans), 'DM Sans', sans-serif",
                  fontWeight: 500,
                  fontSize: 11,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  cursor: submitting ? 'wait' : 'pointer',
                  marginTop: 8,
                  transition:
                    'background 0.3s ease, border-color 0.3s ease, opacity 0.3s ease',
                  opacity: submitting ? 0.6 : 1,
                  borderRadius: 3,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                }}
              >
                <span>{submitting ? 'Sending' : 'Send it'}</span>
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            </form>
          ) : (
            <SuccessState />
          )}
        </div>

        {/* ===== Or find me on ===== */}
        <div
          className="w-full flex flex-col items-center"
          style={{ marginTop: 16, gap: 18, maxWidth: 520 }}
        >
          <span
            aria-hidden="true"
            style={{
              display: 'block',
              width: '100%',
              height: 1,
              backgroundColor: 'var(--border)',
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
            }}
          >
            Or find me on
          </span>
          <div className="inline-flex items-center" style={{ gap: 32 }}>
            <a
              href="https://instagram.com/mainplottwist"
              target="_blank"
              rel="noreferrer"
              className="forma-social-link inline-flex items-center"
              style={{
                gap: 8,
                color: 'var(--muted)',
                fontFamily:
                  "var(--font-dm-sans), 'DM Sans', sans-serif",
                fontSize: 10,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = 'var(--gold)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = 'var(--muted)')
              }
            >
              <Instagram className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Subcomponents ---------------- */

function Label({ children }) {
  return (
    <label
      style={{
        display: 'block',
        fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
        fontSize: 9,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'var(--gold)',
        marginBottom: 6,
        fontWeight: 500,
      }}
    >
      {children}
    </label>
  );
}

function Field({ label, name, type = 'text', placeholder, required }) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        className="forma-input"
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        style={{
          background: 'transparent',
          border: 'none',
          borderBottom: '1px solid rgba(228,221,209,0.15)',
          color: 'var(--text)',
          fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
          fontWeight: 300,
          fontSize: 14,
          padding: '14px 0',
          width: '100%',
          outline: 'none',
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        }}
      />
    </div>
  );
}

function FieldTextarea({ label, name, rows, placeholder, required }) {
  return (
    <div>
      <Label>{label}</Label>
      <textarea
        className="forma-input"
        name={name}
        rows={rows}
        placeholder={placeholder}
        required={required}
        style={{
          background: 'transparent',
          border: 'none',
          borderBottom: '1px solid rgba(228,221,209,0.15)',
          color: 'var(--text)',
          fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
          fontWeight: 300,
          fontSize: 14,
          padding: '14px 0',
          width: '100%',
          outline: 'none',
          resize: 'none',
          lineHeight: 1.6,
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        }}
      />
    </div>
  );
}

function BudgetSelect({ value, onChange }) {
  return (
    <div>
      <Label>Your Budget</Label>
      <div style={{ position: 'relative' }}>
        <select
          className="forma-select"
          name="budget"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            background: 'transparent',
            border: '1px solid rgba(228,221,209,0.15)',
            color: value ? 'var(--text)' : 'rgba(228,221,209,0.35)',
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: 14,
            padding: '12px 36px 12px 16px',
            width: '100%',
            outline: 'none',
            appearance: 'none',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            borderRadius: 3,
            transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer',
          }}
        >
          <option value="" disabled>
            Select a range
          </option>
          {BUDGET_OPTIONS.map((o) => (
            <option key={o} value={o} style={{ backgroundColor: '#141108', color: '#E4DDD1' }}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown
          className="w-4 h-4 pointer-events-none"
          strokeWidth={1.5}
          style={{
            position: 'absolute',
            right: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--gold)',
          }}
        />
      </div>
    </div>
  );
}

function SuccessState() {
  return (
    <div
      className="forma-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 14,
        padding: '14px 0',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          display: 'block',
          width: 60,
          height: 1,
          background: 'var(--gold)',
          opacity: 0.8,
          marginBottom: 4,
        }}
      />
      <span
        style={{
          color: 'var(--gold)',
          fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
          fontSize: 10,
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          fontWeight: 500,
        }}
      >
        Received
      </span>
      <h3
        style={{
          fontFamily:
            "var(--font-cormorant), 'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontWeight: 500,
          fontSize: 32,
          lineHeight: 1.2,
          color: 'var(--text)',
          margin: 0,
        }}
      >
        You&apos;ll hear from me
        <br />
        if it&apos;s a fit.
      </h3>
      <p
        style={{
          fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
          fontSize: 13,
          color: 'var(--muted)',
          margin: 0,
        }}
      >
        Usually within 48 hours.
      </p>
    </div>
  );
}

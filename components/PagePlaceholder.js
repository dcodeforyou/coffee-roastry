// Minimal placeholder used while pages are being built.
export default function PagePlaceholder({ eyebrow = '', title = '', subtitle = '' }) {
  return (
    <section className="min-h-screen pt-32 pb-24 px-6 lg:px-10">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col items-start gap-6">
          {eyebrow && <span className="label-tag opacity-70">{eyebrow}</span>}
          <h1
            className="display-heading"
            style={{
              fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
              fontSize: 'clamp(3rem, 10vw, 9rem)',
              fontWeight: 600,
              lineHeight: 0.92,
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="max-w-xl text-muted text-base md:text-lg leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

'use client';

export function Chip({ icon, children, title, tone = 'neutral' }: { icon?: React.ReactNode; children: React.ReactNode; title?: string; tone?: 'neutral' | 'accent' | 'engine' | 'alert' }) {
  const colors = {
    neutral: { fg: 'var(--ink-muted)', bg: 'var(--card-hover)', bd: 'var(--border)' },
    accent: { fg: 'var(--accent)', bg: 'var(--accent-subtle)', bd: 'color-mix(in oklch, var(--accent) 25%, transparent)' },
    engine: { fg: 'var(--engine)', bg: 'var(--engine-subtle)', bd: 'color-mix(in oklch, var(--engine) 25%, transparent)' },
    alert: { fg: 'var(--alert)', bg: 'var(--alert-subtle)', bd: 'color-mix(in oklch, var(--alert) 25%, transparent)' },
  }[tone];
  return (
    <span
      title={title}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium whitespace-nowrap"
      style={{ color: colors.fg, backgroundColor: colors.bg, borderColor: colors.bd, cursor: title ? 'help' : undefined }}
    >
      {icon}
      {children}
    </span>
  );
}

export function CalendarIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="2" y="3" width="12" height="11" rx="1.5" />
      <path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3" />
    </svg>
  );
}

export function PeopleIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="6" cy="5" r="2.25" />
      <path d="M1.75 13.5c.5-2.4 2.2-3.75 4.25-3.75s3.75 1.35 4.25 3.75" />
      <circle cx="11.5" cy="5.75" r="1.75" />
      <path d="M11 9.8c1.7.1 2.9 1.3 3.25 3.2" />
    </svg>
  );
}

export function ShieldIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M8 1.5l5.5 2v4.25c0 3.25-2.3 5.6-5.5 6.75-3.2-1.15-5.5-3.5-5.5-6.75V3.5L8 1.5z" />
      <path d="M5.5 8l1.75 1.75L10.5 6.5" strokeLinecap="round" />
    </svg>
  );
}

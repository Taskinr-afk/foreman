'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import Link from 'next/link';

const YELLOW = '#FFE500';
const BLACK = '#0A0A0A';
const OFF_WHITE = '#F5F5F0';

function RepeatingText({ text, count = 20, className = '' }: { text: string; count?: number; className?: string }) {
  return (
    <div className={`whitespace-nowrap overflow-hidden select-none pointer-events-none ${className}`}>
      <motion.div
        className="inline-flex gap-4"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <span key={i} className="text-[8vw] lg:text-[6vw] font-black tracking-tighter opacity-[0.04]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function Nav({ onSignIn }: { onSignIn: () => void }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0A0A0A]/80 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/foreman/" className="flex items-center gap-3 no-underline">
          <div className="w-8 h-8 flex items-center justify-center" style={{ background: YELLOW }}>
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill={BLACK} stroke="none">
              <path d="M12 2L2 7v2h20V7L12 2zM4 11v8h3v-8H4zm5 0v8h3v-8H9zm5 0v8h3v-8h-3zm5 0v8h3v-8h-3zM2 21h20v2H2v-2z" />
            </svg>
          </div>
          <span className="text-white font-bold text-lg tracking-tight" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
            FOREMAN
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={onSignIn}
            className="text-white/70 hover:text-white text-sm font-medium transition-colors cursor-pointer bg-transparent border-none"
            style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
          >
            Sign In
          </button>
          <Link
            href="/foreman/app"
            className="text-sm font-bold px-5 py-2.5 no-underline transition-all hover:brightness-90"
            style={{
              background: YELLOW,
              color: BLACK,
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
            }}
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden" style={{ background: BLACK }}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[10%] w-full">
          <RepeatingText text="FOREMAN" />
        </div>
        <div className="absolute top-[30%] w-full">
          <RepeatingText text="SAFETY" />
        </div>
        <div className="absolute top-[50%] w-full">
          <RepeatingText text="COMPLIANCE" />
        </div>
        <div className="absolute top-[70%] w-full">
          <RepeatingText text="FOREMAN" />
        </div>
        <div className="absolute top-[90%] w-full">
          <RepeatingText text="CONSTRUCTION" />
        </div>
      </div>

      <div className="absolute left-0 top-0 bottom-0 w-1 lg:w-2" style={{ background: YELLOW }} />

      <motion.div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 pt-24 pb-16" style={{ y, opacity }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1 max-w-[60px]" style={{ background: YELLOW }} />
            <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: YELLOW, fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
              AI-Powered Safety
            </span>
          </div>

          <h1
            className="text-5xl sm:text-7xl lg:text-[100px] font-black leading-[0.9] tracking-tighter text-white mb-8"
            style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
          >
            Your OSHA
            <br />
            <span style={{ color: YELLOW }}>compliance</span>
            <br />
            engine.
          </h1>

          <p className="text-lg lg:text-xl text-white/50 max-w-xl mb-12 leading-relaxed" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
            AI reads every incident report. Classifies recordability in seconds.
            Your safety manager signs off. The 300 Log writes itself.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/foreman/app"
              className="inline-flex items-center gap-2 text-base font-bold px-8 py-4 no-underline transition-all hover:brightness-90"
              style={{
                background: YELLOW,
                color: BLACK,
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
              }}
            >
              Launch Dashboard
              <svg viewBox="0 0 20 20" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 10h10M11 6l4 4-4 4" />
              </svg>
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 text-base font-bold px-8 py-4 border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all no-underline"
              style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
            >
              See How It Works
            </a>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 right-8 hidden lg:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <div className="text-right">
            <div className="text-xs font-mono text-white/20 tracking-widest">GL20261016</div>
            <div className="text-[10px] font-mono text-white/15 mt-1 tracking-wider">OSHA 1904 COMPLIANT</div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

const features = [
  {
    tag: '01',
    title: 'AI EXTRACTION',
    desc: 'Drop in a supervisor note. The engine pulls every fact, cites the source text, and flags anything uncertain.',
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="4" y="4" width="24" height="24" rx="2" />
        <path d="M10 12h12M10 16h8M10 20h10" />
        <circle cx="24" cy="22" r="4" fill={YELLOW} stroke="none" />
        <path d="M22.5 22l1 1 2-2" stroke={BLACK} strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    tag: '02',
    title: 'RULES ENGINE',
    desc: 'Part 1904 encoded. Recordable, not recordable, or needs more info. Every call backed by regulation citations.',
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M16 4l12 6v4c0 8-5 14-12 17C9 28 4 22 4 14v-4l12-6z" />
        <path d="M12 16l3 3 5-6" />
      </svg>
    ),
  },
  {
    tag: '03',
    title: 'SIGN-OFF QUEUE',
    desc: 'Your safety manager reviews every case. Accept, override with a reason, or send back for more detail. Nothing hits the log without human approval.',
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="6" y="6" width="20" height="20" rx="2" />
        <path d="M6 12h20" />
        <path d="M12 12v14" />
        <circle cx="22" cy="10" r="3" fill={YELLOW} stroke="none" />
      </svg>
    ),
  },
  {
    tag: '04',
    title: 'LIVE 300 LOG',
    desc: 'Auto-populated OSHA 300 with every signed-off recordable. CSV export ready. Privacy cases handled.',
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M4 26V8l6-4h14a2 2 0 012 2v18a2 2 0 01-2 2H6a2 2 0 01-2-2z" />
        <path d="M10 4v6H4" />
        <path d="M10 14h12M10 18h8M10 22h10" />
      </svg>
    ),
  },
  {
    tag: '05',
    title: 'RATE TRACKING',
    desc: 'Injury Rate and Missed Work Rate calculated live, benchmarked against your targets. Know when you cross the line.',
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="16" cy="16" r="11" />
        <path d="M16 8v8l5 5" />
        <path d="M16 5v1M27 16h-1M16 27v-1M5 16h1" strokeWidth="2" />
      </svg>
    ),
  },
  {
    tag: '06',
    title: 'AUDIT TRAIL',
    desc: 'Every action logged. Every override recorded with a reason. Five-year retention built in. Inspectors get a clean chain.',
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M8 8h16M8 14h16M8 20h12M8 26h8" />
        <circle cx="4" cy="8" r="1.5" fill="currentColor" />
        <circle cx="4" cy="14" r="1.5" fill="currentColor" />
        <circle cx="4" cy="20" r="1.5" fill="currentColor" />
        <circle cx="4" cy="26" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
];

function Features() {
  return (
    <section id="features" className="relative py-24 lg:py-32" style={{ background: OFF_WHITE }}>
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute -top-[5%] w-full">
          <RepeatingText text="FEATURES" />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-1" style={{ background: YELLOW }} />
            <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: BLACK, fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
              What It Does
            </span>
          </div>
          <h2
            className="text-4xl lg:text-6xl font-black tracking-tighter"
            style={{ color: BLACK, fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
          >
            The engine decides.
            <br />
            <span className="text-black/30">The manager signs off.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
          {features.map((f, i) => (
            <motion.div
              key={f.tag}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group relative bg-white border border-black/5 p-8 hover:bg-black hover:text-white transition-all duration-300"
            >
              <div className="absolute top-0 left-0 w-full h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" style={{ background: YELLOW }} />
              <div className="text-black/20 group-hover:text-white/20 text-xs font-mono mb-6 tracking-widest" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
                {f.tag}
              </div>
              <div className="mb-4 text-black/40 group-hover:text-white/60 transition-colors">
                {f.icon}
              </div>
              <h3
                className="text-sm font-black tracking-wider mb-3 text-black group-hover:text-white transition-colors"
                style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
              >
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed text-black/50 group-hover:text-white/50 transition-colors" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { value: '< 30s', label: 'Classification time' },
    { value: '1904', label: 'OSHA Part compliance' },
    { value: '100%', label: 'Audit trail coverage' },
    { value: '5 yr', label: 'Record retention' },
  ];

  return (
    <section className="relative py-20" style={{ background: BLACK }}>
      <div className="absolute left-0 top-0 bottom-0 w-1 lg:w-2" style={{ background: YELLOW }} />
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center lg:text-left"
            >
              <div
                className="text-4xl lg:text-5xl font-black tracking-tighter mb-2"
                style={{ color: YELLOW, fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
              >
                {s.value}
              </div>
              <div className="text-xs font-medium tracking-widest uppercase text-white/40" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BuiltFor() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden" style={{ background: OFF_WHITE }}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-1" style={{ background: YELLOW }} />
              <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: BLACK, fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
                Built for Construction
              </span>
            </div>
            <h2
              className="text-4xl lg:text-5xl font-black tracking-tighter mb-6"
              style={{ color: BLACK, fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
            >
              Your sites.
              <br />
              Your workers.
              <br />
              <span className="text-black/30">Your compliance.</span>
            </h2>
            <p className="text-base text-black/50 leading-relaxed max-w-md mb-8" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
              Supervisors report from the field. The engine classifies in seconds. Your safety
              manager signs off from anywhere. OSHA gets a clean, defensible record.
            </p>
            <Link
              href="/foreman/app"
              className="inline-flex items-center gap-2 text-sm font-bold px-6 py-3 no-underline transition-all hover:brightness-90"
              style={{
                background: BLACK,
                color: YELLOW,
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
              }}
            >
              Try the Demo
              <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 10h10M11 6l4 4-4 4" />
              </svg>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="bg-black p-8 relative">
              <div className="absolute top-0 right-0 w-24 h-24" style={{ background: YELLOW }} />
              <div className="relative z-10 space-y-6">
                {[
                  { step: '01', text: 'Supervisor describes the incident' },
                  { step: '02', text: 'AI extracts facts, cites sources' },
                  { step: '03', text: 'Engine classifies per Part 1904' },
                  { step: '04', text: 'Safety manager reviews and signs off' },
                  { step: '05', text: 'Case hits the OSHA 300 Log' },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4">
                    <span className="text-xs font-mono tracking-widest shrink-0 mt-1" style={{ color: YELLOW, fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
                      {item.step}
                    </span>
                    <div className="flex-1">
                      <div className="h-px bg-white/10 mb-3" />
                      <span className="text-sm text-white/70" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
                        {item.text}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden" style={{ background: YELLOW }}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[20%] w-full opacity-[0.06]">
          <motion.div
            className="whitespace-nowrap inline-flex gap-6"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          >
            {Array.from({ length: 15 }).map((_, i) => (
              <span key={i} className="text-[12vw] font-black tracking-tighter" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", color: BLACK }}>
                FOREMAN
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2
            className="text-4xl lg:text-6xl font-black tracking-tighter mb-6"
            style={{ color: BLACK, fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
          >
            Stop guessing.
            <br />
            Start knowing.
          </h2>
          <p className="text-lg mb-10 max-w-lg mx-auto" style={{ color: 'rgba(10,10,10,0.6)', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
            Every incident classified. Every decision documented. Every log defensible.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/foreman/app"
              className="inline-flex items-center gap-2 text-base font-bold px-8 py-4 no-underline transition-all hover:bg-[#1a1a1a]"
              style={{
                background: BLACK,
                color: YELLOW,
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
              }}
            >
              Launch Dashboard
              <svg viewBox="0 0 20 20" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 10h10M11 6l4 4-4 4" />
              </svg>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SignInModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
      />
      <motion.div
        className="relative w-full max-w-md bg-[#111] border border-white/10 p-8"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: YELLOW }} />

        <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors bg-transparent border-none cursor-pointer">
          <svg viewBox="0 0 20 20" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M5 5l10 10M15 5L5 15" />
          </svg>
        </button>

        <h3
          className="text-2xl font-black tracking-tight text-white mb-2"
          style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
        >
          Sign In
        </h3>
        <p className="text-sm text-white/40 mb-8" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
          Access your safety dashboard
        </p>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-bold tracking-wider text-white/50 mb-2 uppercase" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#FFE500]/50 transition-colors placeholder:text-white/20"
              style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
            />
          </div>
          <div>
            <label className="block text-xs font-bold tracking-wider text-white/50 mb-2 uppercase" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#FFE500]/50 transition-colors placeholder:text-white/20"
              style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
            />
          </div>
        </div>

        <Link
          href="/foreman/app"
          className="flex items-center justify-center w-full py-3.5 text-sm font-bold tracking-wider no-underline transition-all hover:brightness-90"
          style={{
            background: YELLOW,
            color: BLACK,
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
          }}
        >
          SIGN IN
        </Link>

        <p className="text-center text-xs text-white/30 mt-4" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
          Demo mode - no real authentication
        </p>
      </motion.div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="py-8 border-t border-white/5" style={{ background: BLACK }}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 flex items-center justify-center" style={{ background: YELLOW }}>
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill={BLACK} stroke="none">
              <path d="M12 2L2 7v2h20V7L12 2zM4 11v8h3v-8H4zm5 0v8h3v-8H9zm5 0v8h3v-8h-3zm5 0v8h3v-8h-3zM2 21h20v2H2v-2z" />
            </svg>
          </div>
          <span className="text-white/40 text-xs font-medium" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
            FOREMAN
          </span>
        </div>
        <span className="text-white/20 text-xs" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
          NVA1 - AI Safety Compliance
        </span>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  const [signInOpen, setSignInOpen] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
      `}</style>
      <div className="w-full min-h-screen" style={{ background: BLACK }}>
        <Nav onSignIn={() => setSignInOpen(true)} />
        <Hero />
        <Features />
        <Stats />
        <BuiltFor />
        <CTA />
        <Footer />
        <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
      </div>
    </>
  );
}

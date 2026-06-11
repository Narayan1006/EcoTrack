'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4';

const FADE_DURATION = 0.5;

const NAV_LINKS = [
  { label: 'Home', href: '/', active: true },
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how' },
  { label: 'AI Assistant', href: '/assistant' },
  { label: 'About', href: '#about' },
];

function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.style.opacity = '0';

    const tick = () => {
      const { currentTime, duration } = video;
      if (!duration || isNaN(duration)) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      if (currentTime < FADE_DURATION) {
        video.style.opacity = String(currentTime / FADE_DURATION);
      } else if (currentTime > duration - FADE_DURATION) {
        video.style.opacity = String((duration - currentTime) / FADE_DURATION);
      } else {
        video.style.opacity = '1';
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    const handleEnded = () => {
      video.style.opacity = '0';
      setTimeout(() => {
        video.currentTime = 0;
        video.play().catch(() => {});
      }, 100);
    };

    video.addEventListener('ended', handleEnded);
    video.play().catch(() => {});
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 0 }} aria-hidden="true">
      <video
        ref={videoRef}
        src={VIDEO_URL}
        muted
        playsInline
        preload="auto"
        style={{
          position: 'absolute',
          inset: 'auto 0 0 0',
          top: '300px',
          width: '100%',
          height: 'calc(100% - 300px)',
          objectFit: 'cover',
          opacity: 0,
          willChange: 'opacity',
        }}
      />
      {/* Gradient overlays — white fade top & bottom */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, #ffffff 0%, rgba(255,255,255,0.55) 28%, rgba(255,255,255,0) 50%, rgba(255,255,255,0) 68%, rgba(255,255,255,0.55) 85%, #ffffff 100%)',
          zIndex: 1,
        }}
      />
    </div>
  );
}

export default function LandingPage() {
  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{ background: '#ffffff', fontFamily: "'Inter', sans-serif" }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600&display=swap');
        @keyframes fade-rise {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim-0 { animation: fade-rise 0.8s ease-out both; }
        .anim-1 { animation: fade-rise 0.8s ease-out 0.2s both; }
        .anim-2 { animation: fade-rise 0.8s ease-out 0.4s both; }
        .anim-3 { animation: fade-rise 0.8s ease-out 0.6s both; }
      `}</style>

      {/* ── Video layer ── */}
      <VideoBackground />

      {/* ── Navbar ── */}
      <nav className="relative w-full" style={{ zIndex: 10 }} aria-label="Main navigation">
        <div
          style={{
            maxWidth: '80rem',
            margin: '0 auto',
            padding: '1.5rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: '1.875rem',
              letterSpacing: '-0.025em',
              color: '#000000',
              textDecoration: 'none',
              lineHeight: 1,
              userSelect: 'none',
            }}
            aria-label="EcoTrack home"
          >
            EcoTrack
            <sup style={{ fontSize: '0.55em', verticalAlign: 'super', letterSpacing: 0 }}>®</sup>
          </Link>

          {/* Nav links */}
          <ul
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '2rem',
              listStyle: 'none',
              margin: 0,
              padding: 0,
              alignItems: 'center',
            }}
          >
            {NAV_LINKS.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  style={{
                    fontSize: '0.875rem',
                    color: item.active ? '#000000' : '#6F6F6F',
                    textDecoration: 'none',
                    fontWeight: 400,
                    transition: 'color 0.2s',
                  }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Link
            href="/login"
            className="hidden md:inline-flex items-center justify-center"
            style={{
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#ffffff',
              background: '#000000',
              borderRadius: '9999px',
              padding: '0.625rem 1.5rem',
              textDecoration: 'none',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Open Dashboard
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section
        style={{
          position: 'relative',
          zIndex: 10,
          paddingTop: 'calc(8rem - 75px)',
          paddingBottom: '10rem',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        {/* Headline */}
        <h1
          className="anim-1"
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontWeight: 400,
            fontSize: 'clamp(2.8rem, 8vw, 6rem)',
            lineHeight: 0.95,
            letterSpacing: '-2.46px',
            maxWidth: '80rem',
            color: '#000000',
            margin: '0',
          }}
        >
          Beyond awareness,{' '}
          <em style={{ fontStyle: 'italic', color: '#6F6F6F' }}>we track</em>
          <br />
          <em style={{ fontStyle: 'italic', color: '#6F6F6F' }}>the eternal footprint.</em>
        </h1>

        {/* Description */}
        <p
          className="anim-2"
          style={{
            fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
            lineHeight: 1.75,
            maxWidth: '42rem',
            marginTop: '2rem',
            color: '#6F6F6F',
            fontWeight: 400,
          }}
        >
          Empowering individuals to understand, track, and reduce their carbon
          footprint through simple daily logging and{' '}
          <span style={{ color: '#000', fontWeight: 500 }}>Google Gemini AI</span>-powered
          personalized insights.
        </p>

        {/* CTAs */}
        <div
          className="anim-3"
          style={{ display: 'flex', gap: '1rem', marginTop: '3rem', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <Link
            href="/login"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '1rem',
              fontWeight: 500,
              color: '#ffffff',
              background: '#000000',
              borderRadius: '9999px',
              padding: '1.25rem 3.5rem',
              textDecoration: 'none',
              transition: 'transform 0.2s',
              display: 'inline-block',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Start Tracking Free
          </Link>

          <Link
            href="/login"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '1rem',
              fontWeight: 400,
              color: '#000000',
              background: 'rgba(0,0,0,0.06)',
              borderRadius: '9999px',
              padding: '1.25rem 2.5rem',
              textDecoration: 'none',
              transition: 'transform 0.2s, background 0.2s',
              display: 'inline-block',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.background = 'rgba(0,0,0,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = 'rgba(0,0,0,0.06)'; }}
          >
            🤖 Try Gemini AI
          </Link>
        </div>

        {/* Stats row */}
        <div
          className="anim-3"
          style={{
            display: 'flex',
            gap: '3rem',
            marginTop: '4rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {[
            { value: '30+', label: 'Activity types tracked' },
            { value: '15', label: 'Eco actions library' },
            { value: '100%', label: 'Free & open source' },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: '2rem',
                  fontWeight: 400,
                  color: '#000',
                  lineHeight: 1,
                }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#6F6F6F', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature highlights row ── */}
      <section
        id="features"
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '72rem',
          margin: '0 auto',
          padding: '0 2rem 8rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
        }}
      >
        {[
          { icon: '🌡️', title: 'Live Carbon Score', desc: 'Real-time gauge showing your daily CO₂ footprint vs global & India averages' },
          { icon: '🤖', title: 'Gemini AI Advisor', desc: 'Personalized reduction tips powered by Google Gemini based on your patterns' },
          { icon: '📊', title: 'Deep Analytics', desc: 'Stacked charts, category breakdowns, and period-based trend analysis' },
          { icon: '🏆', title: 'Goals & Badges', desc: 'Set monthly targets and earn achievement badges for sustainable habits' },
        ].map((f) => (
          <div
            key={f.title}
            style={{
              background: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'left',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{f.icon}</div>
            <h3
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: '1.15rem',
                fontWeight: 400,
                color: '#000',
                marginBottom: '8px',
              }}
            >
              {f.title}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#6F6F6F', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

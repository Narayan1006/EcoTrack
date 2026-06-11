'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/ui/contexts/AuthContext';

export default function LoginPage() {
  const { user, loading, isDemo, signIn } = useAuth();
  const router = useRouter();
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState('');

  // Already logged in → go to dashboard
  useEffect(() => {
    if (!loading && (user || isDemo)) {
      router.replace('/dashboard');
    }
  }, [user, loading, isDemo, router]);

  const handleGoogleSignIn = async () => {
    setError('');
    setSigningIn(true);
    try {
      await signIn();
      router.replace('/dashboard');
    } catch {
      setError('Sign-in failed. Please try again.');
    } finally {
      setSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#ffffff',
      }}>
        <div className="loading-dots"><span /><span /><span /></div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-body)',
    }}>
      {/* Background subtle grid */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        opacity: 0.4,
      }} />

      {/* Card */}
      <div style={{
        position: 'relative', zIndex: 1,
        background: '#ffffff',
        border: '1px solid #f0f0f0',
        borderRadius: 24,
        padding: '48px 40px',
        width: '100%',
        maxWidth: 420,
        boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
        animation: 'slideUp 0.4s ease',
        textAlign: 'center',
      }}>
        {/* Logo */}
        <div style={{
          width: 52, height: 52,
          background: '#000000',
          borderRadius: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26, margin: '0 auto 20px',
        }}>
          🌍
        </div>

        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '2.4rem',
          fontWeight: 400,
          letterSpacing: '-0.03em',
          marginBottom: 8,
          color: '#000000',
        }}>
          EcoTrack
        </h1>

        <p style={{
          color: '#6F6F6F',
          fontSize: '0.95rem',
          marginBottom: 36,
          lineHeight: 1.6,
        }}>
          Track your carbon footprint.<br />Make every action count.
        </p>

        {/* Google Sign-In Button */}
        <button
          id="google-signin-btn"
          onClick={handleGoogleSignIn}
          disabled={signingIn}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            padding: '14px 20px',
            background: signingIn ? '#f9f9f9' : '#ffffff',
            border: '1.5px solid #e5e7eb',
            borderRadius: 12,
            fontSize: '0.95rem',
            fontWeight: 500,
            fontFamily: 'var(--font-body)',
            color: '#000000',
            cursor: signingIn ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            marginBottom: 12,
          }}
          onMouseEnter={e => {
            if (!signingIn) (e.currentTarget as HTMLButtonElement).style.borderColor = '#000000';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#e5e7eb';
          }}
        >
          {/* Google SVG */}
          <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
            <path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.5 20-21 0-1.3-.2-2.7-.5-4z" fill="#FFC107"/>
            <path d="M6.3 14.7l7 5.1C15.2 16.2 19.2 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3c-7.7 0-14.4 4.4-17.7 11.7z" fill="#FF3D00"/>
            <path d="M24 45c5.5 0 10.5-1.9 14.4-5.2l-6.7-5.5C29.8 36 27 37 24 37c-6 0-10.6-3.1-11.8-8.5L5.3 34C8.6 40.5 15.8 45 24 45z" fill="#4CAF50"/>
            <path d="M44.5 20H24v8.5h11.8c-.6 2.1-1.8 3.9-3.4 5.2l6.7 5.5C42.8 36.2 45 30.6 45 24c0-1.3-.2-2.7-.5-4z" fill="#1976D2"/>
          </svg>
          {signingIn ? 'Signing in...' : 'Continue with Google'}
        </button>

        {error && (
          <p style={{ color: '#EF4444', fontSize: '0.82rem', marginBottom: 12 }}>{error}</p>
        )}

        <div style={{
          borderTop: '1px solid #f0f0f0',
          paddingTop: 20,
          marginTop: 8,
        }}>
          <p style={{ fontSize: '0.8rem', color: '#9CA3AF', marginBottom: 12 }}>
            No account? Continue without signing in:
          </p>
          <button
            id="demo-mode-btn"
            onClick={() => router.replace('/dashboard')}
            style={{
              width: '100%',
              padding: '12px 20px',
              background: '#f9fafb',
              border: '1px solid #f0f0f0',
              borderRadius: 12,
              fontSize: '0.88rem',
              color: '#6F6F6F',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#f3f4f6'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#f9fafb'; }}
          >
            👀 Explore in Demo Mode
          </button>
        </div>

        <p style={{ fontSize: '0.72rem', color: '#D1D5DB', marginTop: 24 }}>
          By signing in, you agree to our Terms of Service.<br />
          Your data is stored securely with Firebase.
        </p>
      </div>
    </div>
  );
}

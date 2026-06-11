'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/log', label: 'Log Activity', icon: '📝' },
  { href: '/analytics', label: 'Analytics', icon: '📈' },
  { href: '/assistant', label: 'AI Assistant', icon: '🤖' },
  { href: '/goals', label: 'Goals', icon: '🏆' },
  { href: '/actions', label: 'Eco Actions', icon: '🌱' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="mobile-menu-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation menu"
        style={{ position: 'fixed', top: 16, left: 16, zIndex: 150 }}
      >
        {isOpen ? '✕' : '☰'}
      </button>

      <aside className={`sidebar ${isOpen ? 'open' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon" aria-hidden="true">🌍</div>
          <h1>EcoTrack</h1>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${pathname === item.href ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
              id={`nav-${item.href.replace('/', '') || 'dashboard'}`}
            >
              <span className="nav-icon" aria-hidden="true">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.9rem', fontWeight: 600, color: 'white'
            }}>
              N
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Demo User</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>🟢 Demo Mode</div>
            </div>
          </div>
        </div>
      </aside>

      {isOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 99, display: 'none',
          }}
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

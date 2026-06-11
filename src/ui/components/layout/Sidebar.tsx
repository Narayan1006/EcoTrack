"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/ui/contexts/AuthContext";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/log", label: "Log Activity", icon: "📝" },
  { href: "/analytics", label: "Analytics", icon: "📈" },
  { href: "/assistant", label: "AI Assistant", icon: "🤖" },
  { href: "/goals", label: "Goals", icon: "🏆" },
  { href: "/actions", label: "Eco Actions", icon: "🌱" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isDemo, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/login");
  };

  // Resolve display name and avatar letter
  const displayName = user?.name ?? (isDemo ? "Demo User" : "Guest");
  const displayEmail = user?.email ?? (isDemo ? "demo@ecotrack.app" : "");
  const avatarLetter = displayName.charAt(0).toUpperCase();
  const photoURL = user?.photoURL;

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="mobile-menu-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation menu"
        style={{ position: "fixed", top: 16, left: 16, zIndex: 150 }}
      >
        {isOpen ? "✕" : "☰"}
      </button>

      <aside
        className={`sidebar ${isOpen ? "open" : ""}`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon" aria-hidden="true">
            🌍
          </div>
          <h1>EcoTrack</h1>
        </div>

        {/* Nav links */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${pathname === item.href ? "active" : ""}`}
              onClick={() => setIsOpen(false)}
              id={`nav-${item.href.replace("/", "") || "dashboard"}`}
            >
              <span className="nav-icon" aria-hidden="true">
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User profile section */}
        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: 16,
            marginTop: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "0 8px 12px",
            }}
          >
            {/* Avatar */}
            {photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoURL}
                alt={displayName}
                referrerPolicy="no-referrer"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid var(--border)",
                }}
              />
            ) : (
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "#000000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "white",
                  flexShrink: 0,
                }}
              >
                {avatarLetter}
              </div>
            )}

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {displayName}
              </div>
              <div
                style={{
                  fontSize: "0.72rem",
                  color: "var(--text-muted)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {isDemo ? "🟡 Demo Mode" : displayEmail}
              </div>
            </div>
          </div>

          {/* Sign Out button — only shown when logged in via Firebase */}
          {!isDemo && user && (
            <button
              onClick={handleSignOut}
              id="sign-out-btn"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "9px 16px",
                background: "none",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                color: "var(--text-secondary)",
                fontSize: "0.82rem",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(239,68,68,0.05)";
                (e.currentTarget as HTMLButtonElement).style.color = "#EF4444";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "rgba(239,68,68,0.2)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "none";
                (e.currentTarget as HTMLButtonElement).style.color =
                  "var(--text-secondary)";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "var(--border)";
              }}
            >
              <span>↩</span> Sign Out
            </button>
          )}
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            zIndex: 99,
          }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

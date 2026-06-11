"use client";

// Layout for all inner app pages — includes sidebar navigation + auth guard
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/ui/components/layout/Sidebar";
import StoreInitializer from "@/ui/components/StoreInitializer";
import { useAuth } from "@/ui/contexts/AuthContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isDemo } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If Firebase is configured and user is not logged in → redirect to login
    if (!loading && !isDemo && !user) {
      router.replace("/login");
    }
  }, [user, loading, isDemo, router]);

  // Show loading spinner while auth state resolves
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🌍</div>
          <div className="loading-dots">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    );
  }

  // If Firebase is configured but no user, don't flash the app before redirect
  if (!isDemo && !user) return null;

  return (
    <>
      <StoreInitializer />
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">{children}</main>
      </div>
    </>
  );
}

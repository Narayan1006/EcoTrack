'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithGoogle,
  signOutUser,
  subscribeToAuthState,
  isFirebaseConfigured,
  type User,
} from '@/backend/firebase';

// ─── Types ───────────────────────────────────────────────────────────────────

interface AuthUser {
  uid: string;
  name: string | null;
  email: string | null;
  photoURL: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  isDemo: boolean;           // true when Firebase is not configured
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  isDemo: false,
  signIn: async () => {},
  signOut: async () => {},
});

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const isDemo = !isFirebaseConfigured();

  useEffect(() => {
    // If Firebase is not configured, skip auth entirely (demo mode)
    if (isDemo) {
      setLoading(false);
      return;
    }

    // Subscribe to Firebase auth state changes
    const unsubscribe = subscribeToAuthState((firebaseUser: User | null) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isDemo]);

  const signIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Sign-in error:', err);
    }
  };

  const signOut = async () => {
    try {
      await signOutUser();
      setUser(null);
    } catch (err) {
      console.error('Sign-out error:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isDemo, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}

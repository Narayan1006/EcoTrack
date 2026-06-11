// ============================================================================
// EcoTrack — Firebase Client (with mock fallback)
// Initializes Firebase Auth + Firestore + Analytics when configured,
// otherwise falls back to localStorage-based demo mode.
// ============================================================================

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth, Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

/**
 * Check if Firebase is configured with real credentials.
 */
export function isFirebaseConfigured(): boolean {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
}

/**
 * Initialize Firebase if configured (safe to call multiple times).
 */
export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) return null;
  if (getApps().length > 0) return getApps()[0];
  app = initializeApp(firebaseConfig);

  // Initialize Analytics in browser only (not SSR)
  if (typeof window !== 'undefined') {
    import('firebase/analytics').then(({ getAnalytics, isSupported }) => {
      isSupported().then((yes) => {
        if (yes) getAnalytics(app!);
      });
    });
  }

  return app;
}

/**
 * Get Firebase Auth instance (null in demo mode).
 */
export function getFirebaseAuth(): Auth | null {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  if (!auth) auth = getAuth(firebaseApp);
  return auth;
}

/**
 * Get Firestore instance (null in demo mode).
 */
export function getFirestoreDb(): Firestore | null {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  if (!db) db = getFirestore(firebaseApp);
  return db;
}

/**
 * Sign in with Google popup. Returns the signed-in User.
 */
export async function signInWithGoogle(): Promise<User | null> {
  const authInstance = getFirebaseAuth();
  if (!authInstance) return null;
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const result = await signInWithPopup(authInstance, provider);
  return result.user;
}

/**
 * Sign out the current user.
 */
export async function signOutUser(): Promise<void> {
  const authInstance = getFirebaseAuth();
  if (!authInstance) return;
  await firebaseSignOut(authInstance);
}

/**
 * Subscribe to auth state changes. Returns unsubscribe function.
 */
export function subscribeToAuthState(callback: (user: User | null) => void): () => void {
  const authInstance = getFirebaseAuth();
  if (!authInstance) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(authInstance, callback);
}

// Re-export User type for convenience
export type { User };

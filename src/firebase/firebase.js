import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Production Firebase Configuration for Power24
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ''
};

// Check if Firebase credentials are valid and provided
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey.trim() !== '' &&
  !firebaseConfig.apiKey.includes('YOUR_') &&
  !firebaseConfig.apiKey.includes('PLACEHOLDER') &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId.trim() !== ''
);

let appInstance = null;
let dbInstance = null;
let authInstance = null;
let storageInstance = null;
let analyticsInstance = null;

if (isFirebaseConfigured) {
  try {
    appInstance = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    dbInstance = getFirestore(appInstance);
    authInstance = getAuth(appInstance);
    storageInstance = getStorage(appInstance);

    if (typeof window !== 'undefined') {
      isSupported().then((supported) => {
        if (supported) {
          analyticsInstance = getAnalytics(appInstance);
          console.log('⚡ [Power24] Firebase Analytics & Firestore connected successfully.');
        }
      }).catch((err) => {
        console.warn('[Power24] Firebase Analytics initialization note:', err);
      });
    }
  } catch (err) {
    console.warn('[Power24] Firebase initialization skipped or failed:', err);
    appInstance = null;
    dbInstance = null;
    authInstance = null;
  }
} else {
  console.info('⚡ [Power24] Firebase running in in-memory mode.');
}

// Exported instances (null when offline / not configured)
export const app = appInstance;
export const db = dbInstance;
export const auth = authInstance;
export const storage = storageInstance;
export const analytics = analyticsInstance;

export default app;

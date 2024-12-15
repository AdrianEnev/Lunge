import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import * as firebaseAuth from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "REDACTED",
  authDomain: "REDACTED",
  projectId: "REDACTED",
  storageBucket: "REDACTED.appspot.com",
  messagingSenderId: "REDACTED",
  appId: "1:REDACTED:web:45d6427d74cd12ec471cba",
  measurementId: "REDACTED"
};

const AsyncStorage = ReactNativeAsyncStorage;
const reactNativePersistence = (firebaseAuth as any).getReactNativePersistence;

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
const auth = firebaseAuth.initializeAuth(FIREBASE_APP, {
    persistence: reactNativePersistence(AsyncStorage),
});
export const FIREBASE_AUTH = auth;
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);
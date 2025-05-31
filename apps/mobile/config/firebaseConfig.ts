import { initializeApp } from 'firebase/app';
//import { getFirestore } from 'firebase/firestore';
import * as firebaseAuth from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const AsyncStorage = ReactNativeAsyncStorage;
const reactNativePersistence = (firebaseAuth as any).getReactNativePersistence;

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
//export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
const auth = firebaseAuth.initializeAuth(FIREBASE_APP, {
    persistence: reactNativePersistence(AsyncStorage),
});
export const FIREBASE_AUTH = auth;
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);
import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
	apiKey: 'AIzaSyDf45f2ufBQw-AWd9WKKKtw_Gr7WLRIto4',
	authDomain: 'my-pos-bubt.firebaseapp.com',
	projectId: 'my-pos-bubt',
	storageBucket: 'my-pos-bubt.firebasestorage.app',
	messagingSenderId: '203417345640',
	appId: '1:203417345640:web:7e54bec777657bd3cd25dd',
	measurementId: 'G-LKVMS1K4N3',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence (with try-catch)
let auth;
try {
    auth = getAuth(app);
} catch (error) {
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
    });
}

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };

export const storage = getStorage(app);

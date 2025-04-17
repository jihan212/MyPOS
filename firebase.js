import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// app's Firebase configuration
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
export const auth = getAuth(app);
export const db = getFirestore(app);

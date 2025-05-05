import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';  // Add this import

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

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

// Initialize Auth
const auth = getAuth(app);  // Add this line

// Export services
export { db, storage, auth };  // Add auth to exports

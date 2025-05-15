import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

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

// Enable persistence
enableIndexedDbPersistence(db)
  .catch((err) => {
      if (err.code === 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled in one tab at a time.
          console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
      } else if (err.code === 'unimplemented') {
          // The current browser doesn't support all of the features required to enable persistence
          console.warn('The current browser does not support offline persistence');
      }
  });

// Initialize Storage
const storage = getStorage(app);

// Initialize Auth
const auth = getAuth(app);

// Export services
export { db, storage, auth };

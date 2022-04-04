import { initializeApp } from "firebase/app";
// Importação de serviços que vai ser usado 
import { GoogleAuthProvider, getAuth } from 'firebase/auth';
import { 
  getDatabase,
  set, 
  ref, 
  push, 
  get, 
  child, 
  onValue, 
  off, 
  remove, 
  update,
} from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATA_BASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth()
const database = getDatabase(app);


export { auth, database, GoogleAuthProvider, set, ref, push, get, child, onValue, off, remove, update };

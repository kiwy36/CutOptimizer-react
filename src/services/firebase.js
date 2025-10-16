import { initializeApp } from 'firebase/app';
//import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Tu configuración de Firebase (reemplaza con tus datos)
const firebaseConfig = {
  apiKey: "AIzaSyBcwEbWfgcxHYb6rb-RojkJUWsetQvwWzA",
  authDomain: "cutoptimizer-react.firebaseapp.com",
  projectId: "cutoptimizer-react",
  storageBucket: "cutoptimizer-react.firebasestorage.app",
  messagingSenderId: "596452166993",
  appId: "1:596452166993:web:2f3d4965322a3a7a4fd770",
  measurementId: "G-KE5VWGGG5S"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

// Exportar servicios
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app
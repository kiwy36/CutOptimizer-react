import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { auth } from './firebase';

export const authService = {
  async register(email, password, displayName) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    return userCredential;
  },

  async login(email, password) {
    return await signInWithEmailAndPassword(auth, email, password);
  },

  async logout() {
    return await auth.signOut();
  }
};
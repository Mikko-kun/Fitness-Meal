import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const getUserData = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (err) {
    console.error("Error fetching user data:", err);
    return null;
  }
};

export const saveUserData = async (uid, data) => {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, data, { merge: true });
  } catch (err) {
    console.error("Error saving user data:", err);
  }
};

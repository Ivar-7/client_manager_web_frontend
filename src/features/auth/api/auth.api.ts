import {signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut} from 'firebase/auth';
import {firebaseApp} from '../../../shared/firebase/app.ts';
import {getAuth} from 'firebase/auth';

const auth = getAuth(firebaseApp!);

export async function signIn(email: string, password: string) {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error('Error signing in:', error);
        throw error;
    }
}

export async function signUp(email: string, password: string) {
    try {
        await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error('Error signing up:', error);
        throw error;
    }
}

export async function signOutUser() {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Error signing out:', error);
        throw error;
    }
}
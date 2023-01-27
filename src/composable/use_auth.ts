import { app } from "@/firebase";
import {
    GoogleAuthProvider, getAuth, signInWithPopup, signOut as signAuthFirebase
} from 'firebase/auth';

export const useAuth = () => {
    const auth = getAuth(app);

    const signInViaGoogle = async () => {
        await signInWithPopup(auth, new GoogleAuthProvider());
    }

    const signOut = async () => {
        await signAuthFirebase(auth);
    }

    return {
        auth,
        currentUser: auth.currentUser,
        signInViaGoogle,
        signOut,
    };
}
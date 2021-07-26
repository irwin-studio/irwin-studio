import createService from '@adamdickinson/react-service';
import {useState} from 'react';
import {useFirebase} from '../Firebase';
import Firebase from 'firebase/app';

interface AuthProvider {
    providerId: string;
}

// Add other providers here when supported eg. | 'FACEBOOK' | 'GITHUB'
export type LOGIN_PROVIDER = 'GOOGLE';
export type LOGIN_METHOD = 'REDIRECT' | 'POPUP';
type LoginAction = (provider: AuthProvider) => Promise<void | Firebase.auth.UserCredential>;

export interface AuthAPI {
    user: Firebase.User;
    logout: () => void;
    login: (providerKey: LOGIN_PROVIDER, method?: LOGIN_METHOD) => void;
}

function useAuthAPI(): AuthAPI {
    const firebase = useFirebase();
    const [user, setUser] = useState<Firebase.User | undefined>(undefined);

    firebase.auth().onAuthStateChanged(user => {
        setUser(user);
    });

    const providers: Record<LOGIN_PROVIDER, AuthProvider> = {
        GOOGLE: new firebase.auth.GoogleAuthProvider(),
    };

    const loginMethods: Record<LOGIN_METHOD, LoginAction> = {
        REDIRECT: (provider: AuthProvider) => firebase.auth().signInWithRedirect(provider),
        POPUP: (provider: AuthProvider) => firebase.auth().signInWithPopup(provider),
    };

    const login = (providerKey: LOGIN_PROVIDER, method: LOGIN_METHOD = 'REDIRECT') => {
        const provider = providers[providerKey];
        const performLogin = loginMethods[method];

        performLogin(provider);
    };

    const logout = () => {
        firebase.auth().signOut();
    };

    return {
        user,
        login,
        logout,
    };
}

const [AuthContext, useAuth] = createService(useAuthAPI);

export {AuthContext, useAuth};

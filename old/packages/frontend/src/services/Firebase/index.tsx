import createService from '@adamdickinson/react-service';
import {default as Firebase} from 'firebase/app';

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import 'firebase/analytics';

// Add the Firebase products that you want to use
import 'firebase/auth';
import 'firebase/firestore';

export const initializeFirebase = (): typeof Firebase => {
    try {
        Firebase.initializeApp(FIREBASE_CONFIG);
        if (!IS_TESTING) Firebase.analytics();
    } catch {
        // no-up
    }

    return Firebase;
};

const [FirebaseContext, untypedHook] = createService(
    (props: {firebase?: typeof Firebase}): typeof Firebase => {
        return props.firebase || initializeFirebase();
    },
);

const useFirebase = untypedHook as () => typeof Firebase;
export {FirebaseContext, useFirebase};

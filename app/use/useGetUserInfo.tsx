import { collection, doc, getDocs } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from 'firebaseConfig';
import type { Workout } from 'interfaces';

export const getWorkouts = async () => {
    const usersCollectionRef = collection(FIRESTORE_DB, "users");
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userWorkoutsCollectionRef = collection(userDocRef, "workouts");

    const userWorkoutsSnapshot = await getDocs(userWorkoutsCollectionRef);
    const userWorkoutsData = userWorkoutsSnapshot.docs.map(doc => doc.data() as Workout);

    return userWorkoutsData;
}
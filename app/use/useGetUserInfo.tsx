import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from 'firebaseConfig';
import type { Workout } from 'interfaces';

export const getUserLoginInfo = async (user: any) => {

    const usersCollectionRef = collection(FIRESTORE_DB, "users");
    const userDocRef = doc(usersCollectionRef, user.uid);
    const userInfoCollectionRef = collection(userDocRef, "user_info");
    
    // Get the username -----------------------------------------------------
    const usernameDocRef = doc(userInfoCollectionRef, "username");
    const username = await getDoc(usernameDocRef);
    if (username.exists()) {
        localStorage.setItem("username", username.data().username);
    }   

    // Get the daily goals  -----------------------------------------------------
    const dailyGoalsDocRef = doc(userInfoCollectionRef, "nutrients");
    const dailyGoals = await getDoc(dailyGoalsDocRef);
    if (dailyGoals.exists()) {
        localStorage.setItem("dailyGoals", JSON.stringify(dailyGoals.data()));
    }

    // Get the language -----------------------------------------------------
    const languageDocRef = doc(userInfoCollectionRef, "language");
    const language = await getDoc(languageDocRef);
    if (language.exists()) {
        localStorage.setItem("language", language.data().language);
    }

}

export const getWorkouts = async () => {
    const usersCollectionRef = collection(FIRESTORE_DB, "users");
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userWorkoutsCollectionRef = collection(userDocRef, "workouts");

    const userWorkoutsSnapshot = await getDocs(userWorkoutsCollectionRef);
    const userWorkoutsData = userWorkoutsSnapshot.docs.map(doc => doc.data() as Workout);

    return userWorkoutsData;
}
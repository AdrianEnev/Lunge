import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from 'firebaseConfig';
import type { Workout, SavedWorkout } from 'interfaces';

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

    // Get workout splits -----------------------------------------------------
    // if contains folderId -> add to corresponding folder
    const workoutsCollectionRef = collection(userDocRef, "workouts");
    const workoutsSnapshot = await getDocs(workoutsCollectionRef);
    const workoutsData = workoutsSnapshot.docs
        .map(doc => ({ 
            id: doc.id, 
            title: (doc.data() as Workout).title || "Error!", 
            created: (doc.data() as any).created,
            colour: (doc.data() as Workout).colour,
            folderId: (doc.data() as Workout).folderId || null,
            numberOfExercises: (doc.data() as Workout).numberOfExercises || 0
        }))
        .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

    localStorage.setItem("workouts", JSON.stringify(workoutsData));

    // Get saved workout splits -----------------------------------------------------
    const savedWorkoutsCollectionRef = collection(userDocRef, "saved_workouts");
    const savedWorkoutsSnapshot = await getDocs(savedWorkoutsCollectionRef);
    const savedWorkoutsData = savedWorkoutsSnapshot.docs
        .map(doc => ({
            id: doc.id,
            title: (doc.data() as SavedWorkout).title || "Error!",
            created: (doc.data() as any).created,
            duration: (doc.data() as SavedWorkout).duration,
        }))
        .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

    localStorage.setItem("saved_workouts", JSON.stringify(savedWorkoutsData));

    // Get food days -----------------------------------------------------
    getFoodDays(userDocRef);

}

export const getFoodDays = async (userDocRef: any) => {
    const foodDaysCollectionRef = collection(userDocRef, "food_days");
    const foodDaysSnapshot = await getDocs(foodDaysCollectionRef);

    // title example - "2024-11-17"
    // converted to created to be used as a date and not string, title is used for front end
    const foodDaysData = foodDaysSnapshot.docs
    .map(doc => {
        const data = doc.data() as any;
        const title = data.title || "Error!";
        const created = new Date(title); // Convert title to Date object

        return {
            id: doc.id,
            title,
            calories: data.calories || "-",
            protein: data.protein || "-",
            carbs: data.carbs || "-",
            fat: data.fat || "-",
            created
        };
    })
    .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

    localStorage.setItem("food_days", JSON.stringify(foodDaysData));
}

export const getWorkouts = async () => {
    const usersCollectionRef = collection(FIRESTORE_DB, "users");
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userWorkoutsCollectionRef = collection(userDocRef, "workouts");

    const userWorkoutsSnapshot = await getDocs(userWorkoutsCollectionRef);
    const userWorkoutsData = userWorkoutsSnapshot.docs.map(doc => doc.data() as Workout);

    return userWorkoutsData;
}
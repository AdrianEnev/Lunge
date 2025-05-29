import { collection, doc, setDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "firebaseConfig";

export const changeDailyGoal = async (nutrient: string, dailyGoals: any[], newValue: any) => {

    const dailyGoal = dailyGoals[0];

    if (dailyGoal.hasOwnProperty(nutrient)) {
        dailyGoal[nutrient] = Number(newValue); // Convert the new value to a number
    
        localStorage.setItem('dailyGoals', JSON.stringify(dailyGoal));
    
        try {
            const usersCollectionRef = collection(FIRESTORE_DB, 'users');
            const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
            const userInfoCollectionRef = collection(userDocRef, 'user_info');
            const nutrientsDocRef = doc(userInfoCollectionRef, 'nutrients');
    
            // Create a shallow copy of dailyGoal without the id property
            const { id, ...dailyGoalWithoutId } = dailyGoal;
    
            // Convert all values in dailyGoalWithoutId to numbers
            const dailyGoalWithNumbers = Object.fromEntries(
                Object.entries(dailyGoalWithoutId).map(([key, value]) => [key, Number(value)])
            );
    
            await setDoc(nutrientsDocRef, dailyGoalWithNumbers, { merge: true });
        } catch (e) {
            console.log(e);
        }
    } else {
        throw new Error('Invalid nutrient');
    }
}
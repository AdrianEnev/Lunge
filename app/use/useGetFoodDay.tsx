import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "firebaseConfig";

export const getFoodDay = async (foodDate: string, currentUserUid: any, setLoading: any) => {

    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, currentUserUid);
    const foodDaysCollectionRef = collection(userDocRef, "food_days")
    const foodDayDocRef = doc(foodDaysCollectionRef, foodDate)

    const foodDaySnapshot = await getDoc(foodDayDocRef);

    if (!foodDaySnapshot.exists()) {
        console.log('Empty!');
        setLoading(false)
        return null;
    }

    const foodDayData = foodDaySnapshot.data();

    setLoading(false)
    return foodDayData.calories;
}
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "firebaseConfig";
import type { FoodDay, Food } from 'interfaces';

export const getFoodDay = async (foodDate: string, currentUserUid: any): Promise<FoodDay | null> => {
    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, currentUserUid);
    const foodDaysCollectionRef = collection(userDocRef, "food_days");
    const foodDayDocRef = doc(foodDaysCollectionRef, foodDate);

    const foodDaySnapshot = await getDoc(foodDayDocRef);

    if (!foodDaySnapshot.exists()) {
        console.log('Empty!');
        return null;
    }

    const foodDayData = foodDaySnapshot.data();
    const foods: Food[] = [];

    const foodsCollectionRef = collection(foodDayDocRef, 'foods');
    const foodsSnapshot = await getDocs(foodsCollectionRef);

    for (const foodDoc of foodsSnapshot.docs) {
        foods.push({
            ...foodDoc.data(),
            id: foodDoc.id
        } as Food);
    }

    return {
        ...foodDayData,
        foods,
        id: foodDaySnapshot.id
    } as any;
};
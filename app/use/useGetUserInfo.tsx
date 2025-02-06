import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from 'firebaseConfig';
import type { Workout } from 'interfaces';

const retreiveWorkoutById = async (workoutId: string) => {
    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const workoutsCollectionRef = collection(userDocRef, 'workouts');
    const workoutDocRef = doc(workoutsCollectionRef, workoutId);
    const workoutDoc = await getDoc(workoutDocRef);

    if (!workoutDoc.exists()) {
        console.log('Workout not found');
        return;
    }

    const workout = { id: workoutDoc.id, ...workoutDoc.data() };

    try {
        const workoutInfoCollectionRef = collection(workoutsCollectionRef, workout.id, 'info');
        const workoutInfoSnapshot = await getDocs(workoutInfoCollectionRef);
        let exercises = [];

        for (const exerciseDoc of workoutInfoSnapshot.docs) {
            const exerciseData = exerciseDoc.data();
            const setsCollectionRef = collection(workoutInfoCollectionRef, exerciseDoc.id, 'sets');
            const setsSnapshot = await getDocs(setsCollectionRef);
            let sets = setsSnapshot.docs.map(setDoc => setDoc.data());

            // Sort sets by setIndex
            sets = sets.sort((a, b) => a.setIndex - b.setIndex);

            exercises.push({
                id: exerciseDoc.id,
                ...exerciseData,
                sets,
                exerciseIndex: (exerciseData.exerciseIndex || 1) - 1
            });
        }

        // Sort exercises by exerciseIndex
        exercises = exercises.sort((a, b) => a.exerciseIndex - b.exerciseIndex);

        console.log('Retrieved Workout:', {
            ...workout,
            exercises
        });

    } catch (err) {
        console.error(err);
        alert('error');
    }
}

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
            title: (doc.data() as Workout).title, 
            created: (doc.data() as any).created,
            colour: (doc.data() as Workout).colour,
            folderId: (doc.data() as Workout).folderId || null,
            numberOfExercises: (doc.data() as Workout).numberOfExercises || 0
        }))
        .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

    localStorage.setItem("workouts", JSON.stringify(workoutsData));

}

export const getWorkouts = async () => {
    const usersCollectionRef = collection(FIRESTORE_DB, "users");
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userWorkoutsCollectionRef = collection(userDocRef, "workouts");

    const userWorkoutsSnapshot = await getDocs(userWorkoutsCollectionRef);
    const userWorkoutsData = userWorkoutsSnapshot.docs.map(doc => doc.data() as Workout);

    return userWorkoutsData;
}
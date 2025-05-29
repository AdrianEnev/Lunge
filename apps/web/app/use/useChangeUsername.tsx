import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "firebaseConfig";
import checkUsernameNSFW from "./useCheckUsernameNSFW";

const proceedChange = async (newUsername: string, oldUsername: string, setUsername: any) => {

    if (newUsername) {

        try {
            if (await checkUsernameNSFW(newUsername)) {
                setUsername(oldUsername);
                //alert('nsfw-username');
                return;
            }
        } catch (error: any) {
            // Check if the error message contains the specific model loading error
            if (error && error.error && error.error.includes('Model facebook/bart-large-mnli is currently loading')) {
                setUsername(oldUsername);
                //alert('error');
                return;
            }
        }
        
        const trimmedUsername = newUsername.trim();
        console.log(trimmedUsername);

        if (newUsername.length <= 2) {
            setUsername(oldUsername);
            //alert('username-at-least-three-symbols');
            return;
        } 

        const weirdCharPattern = /[^a-zA-Z0-9@#$£€%^&*()"'-/|.,?![]{}+=_~<>¥]/;
        if (weirdCharPattern.test(newUsername)) {
            setUsername(oldUsername);
            //alert('password-no-emojis');
            return;
        }
    
        let isUsernameTaken = false;
    
        const usersSnapshot = await getDocs(collection(FIRESTORE_DB, 'users'));
        for (const doc of usersSnapshot.docs) {
            const userInfoCollectionRef = collection(doc.ref, 'user_info');
            const usernameDoc = await getDocs(userInfoCollectionRef);
            for (const doc of usernameDoc.docs) {
                if (doc.id === 'username') {
                    if (doc.data().username.trim() === trimmedUsername) {
                        setUsername(oldUsername);
                        //alert('username-taken');
                        isUsernameTaken = true;
                        break;
                    }
                }
            }
            if (isUsernameTaken) break;
        }
    
        if (isUsernameTaken) return;

        localStorage.setItem('username', trimmedUsername);
    
        try {
            const usersCollectionRef = collection(FIRESTORE_DB, 'users');
            const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
            const userInfoCollectionRef = collection(userDocRef, 'user_info');
    
            // add a document inside userInfoCollectionRef and call that document "username"
            await setDoc(doc(userInfoCollectionRef, 'username'), { username: trimmedUsername, date: new Date()});
            //setUsername(trimmedUsername);

            //await changeUsernameForFriends(FIREBASE_AUTH.currentUser?.uid, trimmedUsername);
            
            //alert('Името ви успешно беше сменено на ' + trimmedUsername);
        } catch(err: any) {
            setUsername(oldUsername);
            alert('error');
        }

    }
}

export const changeUsername = async (newUsername: string, oldUsername: string, setUsername: any) => {

    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userInfoCollectionRef = collection(userDocRef, 'user_info');

    const usernameDocRef = doc(userInfoCollectionRef, 'username');
    // get the date property inside the usernameDocRef and check the difference between the timestamp property and the current date
    const usernameDoc = await getDoc(usernameDocRef);
    const usernameData = usernameDoc.data();
    const date = usernameData?.date?.toDate(); // add a check for undefined date
    const currentDate = new Date();
    const difference = currentDate.getTime() - (date?.getTime() || 0); // use 0 if date is undefined
    const daysDifference = difference / (1000 * 3600 * 24);

    // if 7 days haven't passed since the last username change, alert the user that there is still a cooldown
    if (daysDifference < 7) {
        setUsername(oldUsername)
        alert('Please wait another ' + Math.round(7 - daysDifference) + ' days before changing your username again');
        return;
    }

    proceedChange(newUsername, oldUsername, setUsername);
}
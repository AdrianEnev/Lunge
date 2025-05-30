import AsyncStorage from "@react-native-async-storage/async-storage";
import getEmail from "@use/settings/get/useGetEmail";
import { FIREBASE_AUTH } from "@config/firebaseConfig";
import { useContext } from "react";
import GlobalContext from "@config/GlobalContext";
import { Friend } from "@config/interfaces";

const acceptFriendRequest = async (userToCheck: Friend, navigation: any, translation: any) => {

    const {friendRequestsNumber, setFriendRequestsNumber} = useContext(GlobalContext);
    
    const email = await getEmail();
    const loggedUserUsername = await AsyncStorage.getItem(`username_${email}`)

    const currentUserUid = FIREBASE_AUTH.currentUser?.uid;

    console.log('Attempting to accept friend request from:', userToCheck.username);

    try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/friends/${currentUserUid}/accept`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify({
                userToCheck: userToCheck,
                loggedUserUsername: loggedUserUsername
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("acceptFriendRequest: error:", errorData.message);
            alert(translation(errorData.message));
            navigation.goBack();
            return null;
        }

        // Remove 1 friend request from the friend requests received count
        setFriendRequestsNumber((Number(friendRequestsNumber) - 1).toString());

        console.log('Friend request accepted successfully!');
        navigation.navigate('Settings');
        alert(translation('friend-request-accepted'))

    } catch (error) {
        alert(translation('error'))
        return null;
    }

};

export default acceptFriendRequest
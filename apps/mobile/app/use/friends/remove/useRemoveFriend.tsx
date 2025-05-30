import { FIREBASE_AUTH } from "@config/firebaseConfig";
import { Friend } from "@config/interfaces";

const removeFriend = async (userToCheck: Friend, navigation: any, translation: any) => {

    const currentUserUid = FIREBASE_AUTH.currentUser?.uid;

    console.log('Attempting to remove friend: ', userToCheck.username);

    try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/friends/${currentUserUid}/${userToCheck.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json', 
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("removeFriend: error:", errorData.message);
            alert(translation(errorData.message));
            navigation.goBack();
            return null;
        }

        console.log('Friend removed successfully!');
        navigation.navigate('Settings');
        //alert(translation('friend-removed'))

    } catch (error) {
        alert(translation('error'))
        return null;
    }
    
}

export default removeFriend;
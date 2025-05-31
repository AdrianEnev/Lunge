const getFriendsList = async (userId: string | undefined) => {

    console.log('Attempting to fetch friends list...')
    try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/friends/${userId}`);

        if (!response.ok) {
            console.error("getFriendsList: error:", response.statusText);
            return null;
        }

        const data = await response.json();
        console.log('Friends list successfuly fetched:', data);
        return data || null;

    } catch (error) {
        console.error("getFriendsList: error:", error);
        return null;
    }

}

export default getFriendsList;
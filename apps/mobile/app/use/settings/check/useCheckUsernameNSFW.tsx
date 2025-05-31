const checkUsernameNSFW = async (username: string) => {

    try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/models/checkUsernameNSFW/${username}`);
        if (!response.ok) {
            console.error("Error fetching data:", response.statusText);
            return null;
        }

        const data = await response.json();
        const isUsernameNSFW = data.isUsernameNSFW;
        return isUsernameNSFW;

    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }

}

export default checkUsernameNSFW;
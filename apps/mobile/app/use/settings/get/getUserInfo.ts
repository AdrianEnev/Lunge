import { UserInfo } from "@config/interfaces";

const getUserInfo = async (userId: string) => {
    try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/users/${userId}`);
        if (!response.ok) {
            console.error("Error fetching data:", response.statusText);
            return null;
        }

        const data = await response.json() as UserInfo;
        //console.log(data)
        return data;

    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

export default getUserInfo;
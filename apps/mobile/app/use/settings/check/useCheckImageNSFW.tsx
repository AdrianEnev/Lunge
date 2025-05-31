const checkImage = async (uri: any) => {
    try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/models/checkImageNSFW/${uri}`);
        if (!response.ok) {
            console.error("Error fetching data:", response.statusText);
            return null;
        }

        const data = await response.json();
        const isImageNSFW = data.isImageNSFW
        return isImageNSFW;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

export default checkImage;
import reauthenticateAndDelete from "@app/use/settings/remove/useDeleteAccount";
import { Alert } from "react-native";

// Prompt the user to enter their password for account deletion
const promptDeleteAccount = async (
    t: any, 
    setProfilePicture: any, 
    setSetupRan: any, 
    setIsAccountDeleted: any, 
    internetConnected: boolean,
    setIsDeletingAccountModalVisible: any
) => {

    if (!internetConnected) {
        alert(t('unstable-connection'))
        return
    }

    Alert.prompt(
        'Изтриване на акаунт',
        'Въведи паролата за този акаунт, за да го изтриеш',
        [
            {
                text: t('cancel'),
                style: 'cancel',
            },
            {
                text: t('delete'),
                style: 'destructive',
                onPress: async (password: string | undefined) => {

                    setIsDeletingAccountModalVisible(true);
                    const isVerified = true;
                    await reauthenticateAndDelete(setSetupRan, setIsAccountDeleted, isVerified, password, setProfilePicture);                    
                },
            },
        ],
        'secure-text'
    );
}

export default promptDeleteAccount;
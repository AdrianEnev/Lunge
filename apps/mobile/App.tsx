import React, { useEffect, useState } from 'react';
import { StatusBar, View, Text, TouchableOpacity, Vibration } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged, User } from 'firebase/auth';
import { FIREBASE_AUTH } from '@config/firebaseConfig';
import Login from '@screens/Login';
import Register from '@screens/Register';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Setup from '@screens/Setup';
import { createStackNavigator } from '@react-navigation/stack';
import Welcome from '@screens/Welcome';
import getProfilePicture from '@use/settings/get/useGetProfilePicture';
import GlobalContext from '@config/GlobalContext';
import getFriendRequests from '@use/friends/get/useGetFriendRequestsRecieved';
import ChangePassword from '@screens/ChangePassword';
import { checkUserGoalNutrientsLocally, checkLanguageDocumentLocally, checkUsernamesMatch, checkUsernameDoc } from '@use/settings/check/useCheckUserInfo';
import LottieView from 'lottie-react-native';
import tw from 'twrnc';
import { useTranslation } from 'react-i18next';
import * as LocalAuthentication from 'expo-local-authentication';
import NetInfo from "@react-native-community/netinfo";
import checkReceiveFriendRequestsLocally from '@use/friends/get/useCheckReceiveFriendRequestsLocally';
import checkFaceIdEnabledLocally from '@use/settings/check/useCheckFaceIdEnabledLocally';
import checkForBiometricsLocally from '@use/settings/check/checkForBiometricsLocally';
import EmailNotVerified from '@screens/EmailNotVerified';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getLocalLanguageSet from '@use/settings/get/useGetLocalLanguageSet';
import LanguageScreen from '@screens/language/LanguageScreen';
import { useNavigationContainerRef } from '@react-navigation/native';
import syncInformation from '@use/settings/useSyncInfo';
import checkInternetSpeed from '@use/settings/check/useCheckInternetSpeed';
import * as Device from 'expo-device';
import LanguageScreenSmall from '@screens/language/LanguageScreenSmall';
import { StripeProvider } from '@stripe/stripe-react-native';
import MainMenuStack from '@app/components/MainMenuStack';
import { getLungeCoins } from '@app/use/settings/useHandleLungeCoins';

const Stack = createStackNavigator();

const SetupPage = () => {

    return (
        <Stack.Navigator>
            <Stack.Screen
                name='Setup'
                component={Setup}
                options={() => ({
                    headerShown: false,
                })}
            />
        </Stack.Navigator>
    );
}

const AuthenticatedTabNavigator = ({ setupRan }: any) => {
    
    return (
        <Stack.Navigator initialRouteName={setupRan ? "Main-Menu" : "Setup"}>
            <Stack.Screen
                name="Main-Menu"
                component={MainMenuStack}
                options={{
                    headerShown: false,
                    gestureEnabled: false,
                }}
            />
        </Stack.Navigator>
    );
};

const UnauthenticatedTabNavigator = () => (

    <Stack.Navigator>

        <Stack.Screen
            name="Welcome"
            component={Welcome}
            options={{
                headerShown: false,
            }}
        />
        <Stack.Screen
            name="Register"
            component={Register}
            options={{
                headerShown: false,
            }}
        />
        <Stack.Screen
            name="Login"
            component={Login}
            options={{
                headerShown: false,
            }}
        />
        <Stack.Screen
            name="Change-Password"
            component={ChangePassword}
            options={{
                headerShown: false,
            }}
        />
        <Stack.Screen
            name="Email-Not-Verified"
            component={EmailNotVerified}
            options={{
                headerShown: false,
                gestureEnabled: false,
            }}
        />

    </Stack.Navigator>
);

function App() {

    /*const clearEmailFoodDayData = async () => {
        try {

            const email = await getEmail();

            const keys = await AsyncStorage.getAllKeys();
            const emailKeys = keys.filter(key => key.startsWith(`folders_${email}`));
            await AsyncStorage.multiRemove(emailKeys);
            console.log(`Cleared all items in folders_${email}`);
        } catch (error) {
            console.error("Error clearing AsyncStorage items:", error);
        }
    };*/

    /*const clearAllFoodDays = async () => {
        try {
            const email = await getEmail();
            const keys = await AsyncStorage.getAllKeys();
            const foodDayKeys = keys.filter(key => key.startsWith(`${email}-foodDay`));
            await AsyncStorage.multiRemove(foodDayKeys);
            console.log(`Cleared all food days for ${email}`);
        } catch (error) {
            console.error("Error clearing food days:", error);
        }
    };

    const logAllFoodDays = async () => {
        try {
            const email = await getEmail();
            const keys = await AsyncStorage.getAllKeys();
            const foodDayKeys = keys.filter(key => key.startsWith(`${email}-foodDay`));
            const foodDayData = await AsyncStorage.multiGet(foodDayKeys);
            console.log(`All food days for ${email}:`, foodDayData);
        } catch (error) {
            console.error("Error logging food days:", error);
        }
    };

    const clearAsyncStorage = async () => {
        try {
            await AsyncStorage.clear();
            console.log('Cleared AsyncStorage');
        } catch (error) {
            console.error("Error clearing AsyncStorage:", error);
        }
    };

    useEffect(() => {
        //logAllFoodDays();
        //AsyncStorage.setItem('retreiveInfo', 'false');
        clearAsyncStorage();
    }, [])*/

    const onAuthenticate = async () => {

        const auth = await LocalAuthentication.authenticateAsync({
            promptMessage: t('face-id-prompt'),
            cancelLabel: t('cancel')
        });

        if (auth.success) {
            setIsAuthenticated(true);
            //console.log(auth);
        } else {
            console.log('Authentication failed or cancelled');
            onAuthenticate();
        }
    };

    const BiometricsFailed = () => {

        return (
            <View style={tw`flex-1 justify-center items-center bg-white`}>
                
                <TouchableOpacity style={tw`w-[75%] h-[6.5%] bg-gray-700 rounded-[30px] shadow-lg flex items-center justify-center`}
                   onPress={() => onAuthenticate()}
                >
                    <Text style={tw`text-3xl font-semibold text-white`}>{t('try-face-id-again')}</Text>
                </TouchableOpacity>
                
            </View>
        );
    }

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const {t} = useTranslation();

    const navigationRef = useNavigationContainerRef();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [setupRan, setSetupRan] = useState(false);
    const [checkingSetup, setCheckingSetup] = useState(true);
    const [profilePicture, setProfilePicture] = useState('');
    const [friendRequestsNumber, setFriendRequestsNumber] = useState("");
    const [receiveFriendRequests, setReceiveFriendRequests] = useState(false);
    const [faceIdEnabled, setFaceIdEnabled] = useState(false);
    const [isAccountDeleted, setIsAccountDeleted] = useState(false);

    const [isConnected, setIsConnected] = useState(false)

    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [localEmail, setLocalEmail] = useState<string | null>(null);

    const [localLanguageSet, setLocalLanguageSet] = useState(false);
    const [emailVerifiedChanged, setEmailVerifiedChanged] = useState(false);

    const [hasSynced, setHasSynced] = useState(false);

    const [generatingWorkout, setGeneratingWorkout] = useState(false);
    const [generatingWorkoutInFolder, setGeneratingWorkoutInFolder] = useState('');

    const [syncingInfoRunning, setSyncingInfoRunning] = useState(false);

    const [accountJustRegistered, setAccountJustRegistered] = useState(false);

    const [iphoneModel, setIphoneModel] = useState('')

    const [loggingIn, setLoggingIn] = useState(false);

    const [internetSpeed, setInternetSpeed] = useState(0);
    
    const [lungeCoinsAmount, setLungeCoinsAmount] = useState(0)

    const getIphoneModel = async () => {
        if (Device.brand === 'Apple') {
            setIphoneModel(Device.modelName || 'Unknown iPhone');
        } 
    };

    // Ensure setupRan is loaded from persistent storage on every app start
    const fetchData = async () => {
        try {
            const setupHasRanLocally = await checkUserGoalNutrientsLocally();
            setSetupRan(setupHasRanLocally);

            const lungeCoins = (await getLungeCoins()) || 0;
            setLungeCoinsAmount(lungeCoins);
            
            checkLanguageDocumentLocally();
            
            let profilePic = null;
            let friendRequests = 0;

            const netInfo = await NetInfo.fetch();
            setIsConnected(netInfo.isConnected ?? false);

            if (netInfo.isConnected && isAuthenticated && setupRan) {
                profilePic = await getProfilePicture();
                friendRequests = await getFriendRequests();
                await checkUsernamesMatch();
            }
            
            const receiveFriendRequests = await checkReceiveFriendRequestsLocally();
            const isFaceIdEnabled = await checkFaceIdEnabledLocally();
    
            setProfilePicture(profilePic || '');

            if (friendRequests <= 9 && friendRequests > 0) {
                setFriendRequestsNumber(friendRequests.toString())
            }else if (friendRequests == 0){
                setFriendRequestsNumber('');
            }else{
                setFriendRequestsNumber('9+');
            }
            
            setReceiveFriendRequests(receiveFriendRequests);
            setFaceIdEnabled(isFaceIdEnabled);
            setCheckingSetup(false);
        } catch (error) {
            console.error("Error fetching user data:", error);
            setCheckingSetup(false);
        } finally {
            setLoading(false);
        }
    };

    const checkLocalEmail = async () => {
        try {
            const email = await AsyncStorage.getItem('email');
            setLocalEmail(email);
        } catch (error) {
            console.error("Error checking local email:", error);
        }
    };

    const userLoggedIn = async (user: any) => {
        try {
            if (user && user.emailVerified) {
                setIsEmailVerified(true);
    
                if (await checkForBiometricsLocally()) {
                    const compatible = await LocalAuthentication.hasHardwareAsync();
    
                    if (compatible) {
                        await onAuthenticate();
                    }
                } else {
                    setIsAuthenticated(true);
                }
    
                setLoading(true);
                await fetchData();
            } else {
                setLoading(false);
                setCheckingSetup(false);
            }
        } catch (error) {
            if (error == '[FirebaseError: Function doc() cannot be called with an empty path.]') {
                console.log('No user is logged in');
            } else {
                console.log(error);
            }
            setLoading(false);
            setCheckingSetup(false);
        }
    };

    const userNotLoggedIn = async () => {
        if (await checkForBiometricsLocally()) {
            const compatible = await LocalAuthentication.hasHardwareAsync();

            if (compatible) {
                await onAuthenticate();
            }

        } else {
            setIsAuthenticated(true);
        }

        setLoading(true);
        await fetchData();
    }

    useEffect(() => {
        const initializeApp = async () => {

            await checkLocalEmail();
            getIphoneModel();

            const localLanguageSet = await getLocalLanguageSet();
            if (localLanguageSet) {
                setLocalLanguageSet(true)
            }
    
            const netInfo = await NetInfo.fetch();
            setIsConnected(netInfo.isConnected ?? false);

            try {
                if (netInfo.isConnected) {
                    const speed = await checkInternetSpeed()
                    setInternetSpeed(speed)
                    //console.log(speed)
                }
            }catch (error: any) {
                console.log('Failed to check internet speed')
                console.log(error)
            }
            
            if (netInfo.isConnected) {
                const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
                    if (!loggingIn) {
                        setUser(user);
                        userLoggedIn(user);
                    }
                });
    
                return () => unsubscribe();
            } else {
                userNotLoggedIn();
            }
        };
    
        initializeApp();
    
    }, []);

    useEffect(() => {
        let lastChecked = 0;
    
        // Check internet speed every time a change is detected
        // Prevent check if 6.9 seconds have not passed
        const netListener = NetInfo.addEventListener(async state => {
            try {
                const now = Date.now();
    
                if (state.isConnected && (now - lastChecked > 6900)) { // 6.9 Sec delay
                    lastChecked = now;
                    const speed = await checkInternetSpeed();
                    setInternetSpeed(speed);

                    /*if (speed < 32) {
                        setIsConnected(false)
                    }else{
                        setIsConnected(true)
                    }*/
                }
            } catch (error) {
                console.error("Error checking internet speed:", error);
            }
        });
    
        return () => netListener();
    }, []);

    // Run useEffect every 1 second to check if user has verified their email
    // This only starts executing while the "email-not-verified" page is active
    useEffect(() => {
        const interval = setInterval(async () => {

            if (user && !isEmailVerified && !isAccountDeleted && accountJustRegistered && !loggingIn) {
                await user.reload().then(async () => {
                    if (user.emailVerified) {

                        console.log('setting email verified to true')
                        setIsEmailVerified(true);
                        setEmailVerifiedChanged(true);
                        setAccountJustRegistered(false);
                        setSetupRan(false);

                        // Adds username to the user_info collection
                        await checkUsernameDoc();
                        Vibration.vibrate();
                    }
                });
            }
        }, 1000); 

        return () => clearInterval(interval);
    }, [user, isEmailVerified, isConnected]);

    useEffect(() => {
        if (emailVerifiedChanged && !loggingIn) {
            setLoading(true);
            fetchData();
        }
    }, [emailVerifiedChanged]);

    // Compare firebase data to local storage data and sync any mismatches
    // Only runs once per log in if the user is connected to the internet and authenticated
    useEffect(() => {

        if (isEmailVerified && !loggingIn && setupRan && isConnected && isAuthenticated && !hasSynced && user && internetSpeed > 32) {
            setHasSynced(true);

            const query = async () => {
                setSyncingInfoRunning(true)
                await syncInformation();
                setSyncingInfoRunning(false)
            }
            query();
        }
    }, [isConnected, isAuthenticated, hasSynced]);

    // listen for firebase.logOut/logIn and navigate to unauthenticated screen if called
    useEffect(() => {

        const unsubscribe = FIREBASE_AUTH.onAuthStateChanged(async (user) => {
            if (user && isConnected && isEmailVerified && !isAccountDeleted && !loggingIn) {
                setIsAuthenticated(true);

                // check goal nutrients again -> prevents setup from running unnecessarily on login
                const setupHasRanLocally = await checkUserGoalNutrientsLocally();
                setSetupRan(setupHasRanLocally);

                if (!setupHasRanLocally){
                    console.log('Setup has not been run yet!');
                }
                
                setIsAccountDeleted(false);
            } else if (!user && isConnected) {
                setIsAuthenticated(false);
            }
          });
      
          // Clean up the subscription
          return () => unsubscribe();

    }, [navigationRef])

    const handleNavigation = () => {

        // Handles the logic for navigation based on language and authentication
        if (!localLanguageSet && !iphoneModel.includes('SE')) {
            return <LanguageScreen setLocalLanguageSet={setLocalLanguageSet} iphoneModel={iphoneModel}/>;
        }else if (!localLanguageSet && (iphoneModel.includes('SE') || iphoneModel.includes('Mini'))) {
            return <LanguageScreenSmall setLocalLanguageSet={setLocalLanguageSet} iphoneModel={iphoneModel}/>;
        }

        if (!localEmail && !user) {
            return <UnauthenticatedTabNavigator />;
        } else {
            return isAccountDeleted && setupRan && !user ? (
                <UnauthenticatedTabNavigator />
            ) : setupRan && isAuthenticated && user && !accountJustRegistered && !loggingIn  ? (
                <AuthenticatedTabNavigator setupRan={setupRan} />
            ) : !isEmailVerified && user && accountJustRegistered ? (
                // Show EmailNotVerified page after registration until email is verified
                <EmailNotVerified />
            ) : setupRan && !isAuthenticated && user && isAccountDeleted ? (
                <BiometricsFailed />
            )  : user && !setupRan && isEmailVerified ?  (
                <SetupPage />
            ): (
                <UnauthenticatedTabNavigator />
            );
        }
    };

   if (loading || checkingSetup || loggingIn) {
        return (
            <View style={tw`flex-1 justify-center items-center bg-red-500`}>

                <LottieView
                    style={{ width: 350, height: 350 }}
                    source={require('./assets/loading_plane.json')}
                    speed={2}
                    autoPlay
                    loop
                />
                
                {/*
                    <View style={tw`flex flex-row`}>
                        <Text style={tw`text-2xl font-bold text-white mt-4`}>{t('loading')}</Text>
                        <LottieView
                            style={tw`w-24 h-24 mt-[-6px] ml-[-22px]`}
                            source={require('./assets/loading_animation_white_dots.json')}
                            speed={0.8}
                            autoPlay
                            loop
                        />
                    </View>
                */}

            </View>
        );
    }

    return (
        <GlobalContext.Provider value={{
            setupRan, setSetupRan, profilePicture, setProfilePicture, friendRequestsNumber, setFriendRequestsNumber,
            receiveFriendRequests, setReceiveFriendRequests, faceIdEnabled, setFaceIdEnabled,
            internetConnected: isConnected, isAccountDeleted, setIsAccountDeleted, generatingWorkout, setGeneratingWorkout,
            generatingWorkoutInFolder, setGeneratingWorkoutInFolder, syncingInfoRunning, setSyncingInfoRunning, internetSpeed, setAccountJustRegistered,
            iphoneModel, setLoggingIn, lungeCoinsAmount, setLungeCoinsAmount,
            setIsEmailVerified, setEmailVerifiedChanged
        }}>

            <StripeProvider 
                publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}
                merchantIdentifier="com.nafle.LungeFitnessTracker"
                urlScheme='lunge-fitness-tracker'
            >
                <GestureHandlerRootView style={tw`w-full h-full`}>
                    <StatusBar barStyle='dark-content' />
                    
                    {/*<
                        {handleNavigation()}
                        <SetupPage />
                        {handleNavigation()}
                        <LanguageScreen />
                    */}
                    
                    <NavigationContainer ref={navigationRef}>
                        {handleNavigation()}
                    </NavigationContainer>
                
                </GestureHandlerRootView>
            </StripeProvider>
        </GlobalContext.Provider>
    );
};

export default App;
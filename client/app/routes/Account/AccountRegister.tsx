import { FIREBASE_AUTH, FIRESTORE_DB } from 'firebaseConfig'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { collection, doc, getDocs, setDoc } from 'firebase/firestore'
import checkUsernameNSFW from '~/use/useCheckUsernameNSFW'

const AccountRegister = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(FIREBASE_AUTH.currentUser ? true : false)

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const [registerButtonDisabled, setRegisterButtonDisabled] = useState(false);

    const [passwordCharacters, setPasswordCharacters] = useState(65);
    const [confirmPasswordCharacters, setPasswordConfirmCharacters] = useState(65);

    const [passwordStrength, setPasswordStrength] = useState('');
    const [passwordConfirmStrenght, setPasswordConfirmStrenght] = useState('');

    const signUp = async () => {

        /*if (!internetConnected || internetSpeed < 16) {
            alert('unstable-connection');
            return;
        }*/
        
        const trimmedUsername = username.trim();
        const trimmedEmail = email.trim();
    
        if (trimmedEmail.length == 0 || password.length == 0 || passwordConfirm.length == 0 || trimmedUsername.length == 0) {    
            setRegisterButtonDisabled(false)
            return;
        }

        const weirdCharPattern = /[^a-zA-Z0-9@#$£€%^&*()"'-/|.,?![]{}+=_~<>¥]/;
        if (weirdCharPattern.test(password)) {
            alert('password-no-emojis');
            return;
        }
        if (password !== passwordConfirm) {
            alert('passwords-not-match');
            return;
        }
        if (trimmedUsername.length <= 2) {
            alert('username-at-least-three-symbols');
            return;
        } 
        if (password.length <= 8) {
            alert('password-at-least-eight-symbols');
            return;
        }
        if (password === trimmedUsername) {
            alert('password-not-same-as-username');
            return;
        }

        /*if (await isAccountLimitReached()) {
            alert('max-number-accounts-device');
            return;
        } */  
        
        if (await checkUsernameNSFW(trimmedUsername)) {
            alert('nsfw-username');
            return;
        }
    
        if (await isUsernameTaken(trimmedUsername)) {
            alert('username-taken');
            return;
        }
    
        try {
            const after = await createUserWithEmailAndPassword(FIREBASE_AUTH, trimmedEmail, password);
            //setIsAccountDeleted(false)

            const usersCollectionRef = collection(FIRESTORE_DB, 'users');
            const userDocRef = doc(usersCollectionRef, after.user.uid);

            await setDoc(userDocRef, { lungeCoins: 1, lastGeneratedWorkout: null }, { merge: false });

            const userInfoCollectionRef = collection(userDocRef, 'user_info');
    
            // add a document inside userInfoCollectionRef and call that document "username"
            await setDoc(doc(userInfoCollectionRef, 'username'), { username: trimmedUsername });

            // save username locally using AsyncStorage
            //console.log(trimmedEmail)
            /*await AsyncStorage.setItem(`email`, trimmedEmail);
            await AsyncStorage.setItem(`username_${email}`, trimmedUsername);

            // send email verification
            sendEmailVerification(after.user);
            checkUserDocument(userDocRef, after.user, userInfoCollectionRef);
            setAccountJustRegistered(true)
            navigation.navigate('Непотвърден-Имейл')*/

            navigate('/') 

        } catch(err: any) {
            console.log('error', err)
        }
    }

    const isUsernameTaken = async (trimmedUsername: any) => {
        const usersSnapshot = await getDocs(collection(FIRESTORE_DB, 'users'));

        for (const doc of usersSnapshot.docs) {
            const userInfoCollectionRef = collection(doc.ref, 'user_info');
            const usernameDoc = await getDocs(userInfoCollectionRef);

            for (const user of usernameDoc.docs) {
                if (user.id === 'username' && user.data().username.trim() === trimmedUsername) {
                    return true; // Username is taken
                }
            }
        }

        return false; 
    }

    const checkPasswordStrength = (password: string): string => {

        if (password.length <= 8) {
            return 'weak';
        }
        if (password.length <= 12) {
            let hasNumber = /\d/.test(password);
            let hasSpecialChar = /[^A-Za-z0-9]/.test(password);
            if (hasNumber && hasSpecialChar) {
                return 'strong';
            } else if (hasNumber || hasSpecialChar) {
                return 'decent';
            } else {
                return 'weak';
            }
        }
        if (password.length > 12) {
            let hasNumber = /\d/.test(password);
            let hasSpecialChar = /[^A-Za-z0-9]/.test(password);
            if (hasNumber && hasSpecialChar) {
                return 'very strong';
            } else if (hasNumber || hasSpecialChar) {
                return 'good';
            } else {
                return 'decent';
            }
        }
        return 'weak';
    }

    useEffect(() => {

        setPasswordCharacters(65 - password.length);
        setPasswordConfirmCharacters(65 - passwordConfirm.length);

        const strength = checkPasswordStrength(password);
        setPasswordStrength(strength)
        
        const confirmStrenght = checkPasswordStrength(passwordConfirm);
        setPasswordConfirmStrenght(confirmStrenght)

    }, [password, passwordConfirm])

    const handleRegister = () => {

        if (email === '' || password === '') {
            alert('Please fill in all fields')
            return
        }
        
        signUp();

    }

    return (
        <div className="w-full h-full"> 

            <div className="flex flex-col items-center justify-center mt-[7%]">
                
                <div className="w-[37%] h-[500px] bg-white rounded-xl shadow-md">
                                
                    <div className="flex flex-col items-center justify-center mt-3">
                        <p className="text-2xl text-black font-bold">Account</p>
                    </div>

                    <div className='flex w-full h-full flex-col items-center mt-5'>
                        
                        <p className='text-xl font-medium text-gray-600 mb-2'>Register</p>

                        <p className='text-xl font-medium text-gray-600 mt-2'>Email</p>
                        <input
                            type="text"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                            placeholder="Type something..."
                            className='border border-gray-300 p-2'
                        />

                        <p className='text-xl font-medium text-gray-600 mt-2'>username</p>
                        <input
                            type="text"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value)}
                            placeholder="Type something..."
                            className='border border-gray-300 p-2'
                        />

                        <p className='text-xl font-medium text-gray-600 mt-2'>password</p>
                        <input
                            type="text"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                            placeholder="Type something..."
                            className='border border-gray-300 p-2'
                        />
                        
                        <p className='text-xl font-medium text-gray-600 mt-2'>confirm password</p>
                        <input
                            type="text"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPasswordConfirm(event.target.value)}
                            placeholder="Type something..."
                            className='border border-gray-300 p-2'
                        />

                        <button className='w-24 h-12 bg-red-400 mt-3 active:opacity-60'
                            onClick={handleRegister}
                        >
                            <p className='text-xl font-medium text-white mt-2'>Register</p>
                        </button>

                    </div>

                </div>

            </div>
            
        </div>
    )
}

export default AccountRegister
import { FIREBASE_AUTH, FIRESTORE_DB } from 'firebaseConfig';
import React, { useContext, useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { changeUsername } from '~/use/useChangeUsername';
import { GlobalContext } from '~/GlobalContext';
import { sendPasswordResetEmail } from 'firebase/auth';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';

const Account = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [isAuthenticated, setIsAuthenticated] = useState(FIREBASE_AUTH.currentUser ? true : false);

    const [oldUsername, setOldUsername] = useState('');
    const [username, setUsername] = useState('');

    const [editModeEnabled, setEditModeEnabled] = useState(false)

    const [passwordResetEmailSent, setPasswordResetEmailSent] = useState(false)

    useEffect(() => {

        const username = localStorage.getItem('username');
        setUsername(username || 'User');
        setOldUsername(username || 'User');

    }, []);

    const changePassword = async () => {

        //if (email.length <= 0) {    
           // return;
        //}

        if (passwordResetEmailSent) {
            return;
        }

        setPasswordResetEmailSent(true)

        // Check if 3 days have passed since last password update
        const usersCollectionRef = collection(FIRESTORE_DB, 'users');
        const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);

        const userDocRefSnapshot = await getDoc(userDocRef)

        // Get current date + last changed date which is a string and has to be converted to a date
        const lastSentEmail = new Date(userDocRefSnapshot.data()?.resetPasswordEmailLastSent);
        const currentDate = new Date();

        const difference = currentDate.getTime() - (lastSentEmail?.getTime() || 0); // use 0 if date is undefined
        const daysDifference = difference / (1000 * 3600 * 24);

        if (daysDifference < 3) {
            setEditModeEnabled(false)
            setPasswordResetEmailSent(false)
            alert('Please wait another ' + Math.round(3 - daysDifference) + ' days before changing your password again');
            return
        }

        const email = FIREBASE_AUTH.currentUser?.email?.toString();

        if (email) {
            sendPasswordResetEmail(FIREBASE_AUTH, email)
        .then(async () => {

            const currentDateString = currentDate.toISOString();

            await updateDoc(userDocRef, {
                resetPasswordEmailLastSent: currentDateString
            });
            alert('email-sent-sucessfuly');
        })
        .catch((error) => {
            alert(error.message);
        });}

        setEditModeEnabled(false)
        setPasswordResetEmailSent(false)
    }

    const clearLocalStorageExcept = (exceptions: string[]) => {
        const keysToKeep = new Set(exceptions);
        Object.keys(localStorage).forEach(key => {
            if (!keysToKeep.has(key)) {
                localStorage.removeItem(key);
            }
        });
    };

    return (
        <div className="w-full h-full font-rubik p-5"> 
                
            <p className="text-3xl text-black mt-5 font-semibold">
                Profile
            </p>

            <div className='flex flex-row justify-between pr-4'>
                <p className='text-lg font-medium mt-4'>User</p>

                {(editModeEnabled && !loading) ? (
                    <div className='flex flex-row gap-x-3'>

                        <button 
                            className='w-[70px] h-8 border border-gray-200 
                            shadow-md rounded-lg flex flex-row items-center justify-center 
                            gap-x-2 active:opacity-60'
                            onClick={() => {
                                setEditModeEnabled(!editModeEnabled)
                                setUsername(oldUsername)
                            }}
                        >
                            <p>Cancel</p>
                        </button>

                        <button 
                            className={`w-[70px] h-8 bg-red-400 text-white 
                            shadow-md rounded-lg flex items-center justify-center 
                            gap-x-2 active:opacity-60 
                            ${username === localStorage.getItem('username') ? 'opacity-60' : 'opacity-100'}`}

                            onClick={async () => {
                                if (username !== oldUsername) {
                                    setLoading(true);
                                    await changeUsername(username, oldUsername, setUsername);
                                    setEditModeEnabled(false)
                                    setLoading(false)
                                }
                            }}
                        >
                            <p>Save</p>
                        </button>

                    </div>
                ) : (!editModeEnabled && !loading) ? (
                    <button 
                        className='w-[70px] h-8 border border-gray-200 
                        shadow-md rounded-lg flex flex-row items-center justify-center 
                        gap-x-2 active:opacity-60'

                        onClick={() => {
                            setEditModeEnabled(!editModeEnabled)
                        }}
                    >
                        <p>Edit</p>
                        <FontAwesomeIcon icon={faEdit} className='text-black mt-[-1px]'/>
                    </button>
                ) : (
                    null
                )}
                
            </div>
            <div className='w-full h-[2px] bg-gray-100 rounded-full mt-2'></div>

            <div className='flex flex-row gap-x-16 mt-6'>

                <div>
                    {!loading && (
                        <div  className={`flex flex-col ${editModeEnabled ? 'gap-y-6' : 'gap-y-6'}`}>
                            <p>Email</p>
                            <p>Username</p>
                            <p>Password</p>
                        </div>
                    )}
                </div>
            
                
                {(editModeEnabled && !loading) ? (
                    <div className='flex flex-col gap-y-4'>

                        <p>{FIREBASE_AUTH.currentUser?.email}</p>
                        
                        <input 
                            type="text"
                            maxLength={16}
                            defaultValue={username || ''}
                            className='border border-gray-300 rounded-md w-64 h-8 px-2'
                            onChange={(event) => {setUsername(event.target.value)}}
                        />
                        
                        <button 
                            className='w-[160px] h-8 border border-gray-200 
                            shadow-md rounded-lg flex flex-row items-center justify-center 
                            gap-x-2 active:opacity-60'
                            onClick={() => {
                                changePassword();
                            }}
                        >
                            <p>Change Password</p>
                        </button>
                    </div>
                ) : (!editModeEnabled && !loading) ? (
                    <div className='flex flex-col gap-y-6'>
                        <p>{FIREBASE_AUTH.currentUser?.email}</p>
                        <p>{username}</p>
                        <p>*******</p>
                    </div>
                ) : (
                    <div>
                        <p className='text-xl font-medium'>Loading</p>
                    </div>
                )}
                    
            </div>

            
            
            <div className='mt-12'>
                <button onClick={() => {

                    if (!isAuthenticated) {
                        return
                    }

                    FIREBASE_AUTH.signOut()
                    clearLocalStorageExcept(['language'])
                    console.log('cleared storage')
                    navigate('/')
                }}>
                    <p className='text-xl p-5 bg-red-400 rounded-xl text-white font-bold mt-3 shadow-md'>Logout</p>
                </button>
            </div>


        </div>
    )
}

export default Account
import {signInWithEmailAndPassword} from 'firebase/auth'
import { FIREBASE_AUTH } from 'firebaseConfig'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { GlobalContext } from '~/GlobalContext'
import { getUserLoginInfo } from '~/use/useGetUserInfo'

const Account = () => {

    const navigate = useNavigate()

    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')

    const [isAuthenticated, setIsAuthenticated] = useState(FIREBASE_AUTH.currentUser ? true : false)

    const {setLoading} = useContext(GlobalContext) || {setLoading: () => {console.log('error')}}

    /*useEffect(() => {

        if (isAuthenticated) {
            navigate('/account')
        }

    }, [isAuthenticated])*/


    const handleFirebaseLogin = (email: string, password: string) => {

        const currentUser = FIREBASE_AUTH.currentUser?.uid

        if (currentUser) {
            console.log('User already logged in')
            return
        }
        
        signInWithEmailAndPassword(FIREBASE_AUTH, email, password)
        .then(async (userCredential) => {
            
            // Signed in 
            const user = userCredential.user;

            // show loading screen while retreiving info
            setLoading(true)
            await getUserLoginInfo(user)
            setLoading(false)

            navigate('/');
            
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
    }

    const handleLogin = () => {

        if (email === '' || password === '') {
            alert('Please fill in all fields')
            return
        }
        
        handleFirebaseLogin(email, password)

    }

    return (
        <div className="w-full h-full font-rubik"> 

            <div className="flex flex-col items-center justify-center mt-[5%]">
                
                <div className="w-[40%] h-96 bg-white rounded-xl shadow-md border border-gray-100 px-14 py-12">
                                
                    <div className="flex flex-col">
                        <p className="text-2xl text-gray-800 font-medium">Sign in to your account</p>
                    </div>

                    <div className='flex w-full h-full flex-col mt-3'>
                        
                        <p className='text-xl text-gray-600 my-2'>Email</p>
                        <input
                            type="text"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                            placeholder="example@gmail.com"
                            className='border border-gray-300 p-2 rounded-md'
                        />
                        
                        <p className='text-xl text-gray-600 my-2'>Password</p>
                        <input
                            type="text"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                            placeholder="SecurePassword123"
                            className='border border-gray-300 p-2 rounded-md'
                        />

                        <button className='w-full h-12 bg-red-400 mt-3 rounded-xl active:opacity-60'
                            onClick={handleLogin}
                        >
                            <p className='text-xl font-medium text-white'>Log in</p>
                        </button>

                    </div>

                </div>

            </div>
            
        </div>
    )
}

export default Account

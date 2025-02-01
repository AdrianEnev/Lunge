import { FIREBASE_AUTH } from 'firebaseConfig';
import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router'

/**
 
    {!isAuthenticated && (
                <div className={`flex flex-col gap-y-3 text-xl text-white font-bold`}>

                    <button onClick={() => {
                        navigate('/account/register')
                    }}>
                        <p>Register</p>
                    </button>  

                    <button onClick={() => {
                        navigate('/account/login')
                    }}>
                        <p>Login</p>
                    </button>

                </div>
            )}

 */

const Account = () => {

    const navigate = useNavigate();

    const [isAuthenticated, setIsAuthenticated] = useState(FIREBASE_AUTH.currentUser ? true : false);

    return (
        <div>
            <p className='text-3xl text-black font-medium p-5'>You are logged in!</p>
            
            <div className=''>
                <button onClick={() => {

                    if (!isAuthenticated) {
                        return
                    }

                    FIREBASE_AUTH.signOut()
                    
                    navigate('/')
                }}>
                    <p className='text-xl p-5 bg-red-400 rounded-xl text-white font-bold mt-3 shadow-md'>Logout</p>
                </button>
            </div>


        </div>
    )
}

export default Account
import { faChevronDown, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FIREBASE_AUTH } from 'firebaseConfig'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

const HeaderUnauthenticated = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(FIREBASE_AUTH.currentUser ? true : false);

    useEffect(() => {
        FIREBASE_AUTH.onAuthStateChanged((user) => {
            if (user) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        });
    }, []);

    const navigate = useNavigate();

    return (
        <div className='w-auto h-16 m-2 mt-3 px-1 flex items-center font-rubik'>
            
            <div className='flex w-full flex-row justify-between items-center mx-4'>

                <div className='flex flex-row gap-x-5'> 

                    <button onClick={() => {
                        navigate('/')
                    }}>
                        <h1 className='text-2xl text-black font-bold'>Lunge</h1>
                    </button>

                    <h1 className='text-2xl text-black font-bold opacity-0'>Lunge</h1>
                </div>
                
                <div className='flex flex-row gap-x-5'>

                    <button onClick={() => {
                        
                        //const currentUser = FIREBASE_AUTH.currentUser?.uid
                        navigate('/login')
                        
                    }}>
                        <p className='text-lg text-black font-medium hover:opacity-60 flex flex-row gap-x-2'>
                            Sign in &gt;
                        </p>
                    </button>

                    <button 
                    className='w-24 p-2 rounded-full h-10 bg-red-400 flex items-center justify-center hover:opacity-70'
                        onClick={() => {
                            navigate('/contact')
                        }}
                    >
                        <p className='text-base font-medium text-white'>Contact</p>
                    </button>
                </div>

            </div>

        </div>
    )
}

export default HeaderUnauthenticated
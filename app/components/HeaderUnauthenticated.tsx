import { faChevronDown, faLanguage, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FIREBASE_AUTH } from 'firebaseConfig'
import i18n from 'i18next'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

const HeaderUnauthenticated = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(FIREBASE_AUTH.currentUser ? true : false);
    const [language, setLanguage] = useState(i18n.language);

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

    const {t} = useTranslation();

    const changeLanguage = () => {
        const newLanguage = language === 'en' ? 'bg' : 'en';
        i18n.changeLanguage(newLanguage);
        setLanguage(newLanguage);
    }


    return (
        <div className='w-auto h-16 m-2 mt-3 px-1 flex items-center font-rubik'>
            
            <div className='flex w-full flex-row justify-between items-center mx-4'>

                <div className='flex flex-row gap-x-5'> 

                    <button onClick={() => {
                        navigate('/')
                    }}>
                        <h1 className='text-2xl text-black font-bold'>Lunge</h1>
                    </button>

                    <button onClick={() => {changeLanguage()}}>
                        <FontAwesomeIcon icon={faLanguage}  className='text-[#ff2056] text-lg w-10 h-10 mt-[6px]' />
                    </button>
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
                    className='w-24 p-2 rounded-full h-10 bg-rose-500 flex items-center justify-center hover:opacity-70'
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
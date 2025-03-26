import { faCalendar, faChartLine, faChevronDown, faCog, faDumbbell, faEnvelope, faHome, faHouse, faMagnifyingGlass, faPerson, faPhone, faRunning, faShieldHalved, faUser, faUsers, faUtensils } from '@fortawesome/free-solid-svg-icons'
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FIREBASE_AUTH } from 'firebaseConfig'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import SidebarCategories from './SidebarCategories'
import { useTranslation } from 'react-i18next'

const SidebarAuthenticated = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(FIREBASE_AUTH.currentUser ? true : false);
    const [currentPage, setCurrentPage] = useState('Home')
    const [screenHeight, setScreenHeight] = useState(window.innerHeight);

    useEffect(() => {
        FIREBASE_AUTH.onAuthStateChanged((user) => {
            if (user) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        });
        
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setScreenHeight(getScreenHeight());
        };
        console.log(screenHeight)

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [])

    const getScreenHeight = () => {
        return window.innerHeight;
    }

    const navigate = useNavigate();
    const {t} = useTranslation();

    return (
        <div className='w-full h-full font-rubik'>
            
            <div className='w-full h-full mx-4 border-r border-gray-200 py-4 pr-12 pl-2'>

                <div className='flex items-start gap-x-5'>

                    <button onClick={() => {
                        navigate('/');
                    }}>
                        <h1 className='text-2xl text-black font-semibold'>Lunge</h1>
                    </button>
                    
                </div>

                <div className='mt-12 flex flex-col gap-y-1'>
                    <SidebarCategories title={t('home')} icon={faHome} route={() => navigate("/")}/>
                    <SidebarCategories title={t('account')} icon={faUser} route={() => navigate("/account")}/>
                    <SidebarCategories title={t('friends')} icon={faUsers} route={() => navigate("/friends")}/>
                    
                    <p className='text-gray-500 text-sm mt-5'>{t('workouts')}</p>

                    <SidebarCategories title={t('workout-splits')} icon={faDumbbell} route={() => navigate("/workouts")}/>
                    <SidebarCategories title={t('saved-workout-splits')} icon={faRunning} route={() => navigate("/workouts/saved")}/>

                    <p className='text-gray-500 text-sm mt-5'>{t('statistics')}</p>
                    <SidebarCategories title={t('food')} icon={faUtensils} route={() => navigate("/food-log")}/>
                    <SidebarCategories title={t('statistics')} icon={faChartLine} route={() => navigate("/statistics")}/>

                    <p className='text-gray-500 text-sm mt-5'>{t('settings')}</p>
                    <SidebarCategories title={t('settings')} icon={faCog} route={() => navigate("/settings")}/>

                    <div className={`absolute bottom-4 ${screenHeight >= 700 ? "" : "hidden"}`}>
                        <SidebarCategories title={t('contact')} icon={faPhone} route={() => navigate("/contact")}/>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default SidebarAuthenticated
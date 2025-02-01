import { faChevronDown, faEnvelope, faHouse, faMagnifyingGlass, faPerson, faShieldHalved } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FIREBASE_AUTH } from 'firebaseConfig'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import SidebarCategories from './SidebarCategories'

const SidebarAuthenticated = () => {

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
        <div className='w-[14%] h-full font-rubik'>
            
            <div className='w-full h-full mx-4 border-r border-gray-200 py-4 pr-12 pl-2'>

                <div className='flex items-start gap-x-5 '>

                    <button onClick={() => {
                        navigate('/')
                    }}>
                        <h1 className='text-2xl text-black font-semibold'>Lunge</h1>
                    </button>
                    
                </div>

                <div className='mt-12 flex flex-col gap-y-1 font-medium font-sans text-gray-500'>

                    <SidebarCategories title='Home' icon={faHouse} route={() => navigate("/")}/>
                    <SidebarCategories title='Account' icon={faShieldHalved} route={() => navigate("/account")}/>
                    <SidebarCategories title='Friends' icon={faMagnifyingGlass} route={() => navigate("/friends")}/>
                    
                    <p className='text-gray-500 text-sm mt-5'>Test</p>

                    <SidebarCategories title='Workouts' icon={faPerson} route={() => navigate("/workouts")}/>
                    <SidebarCategories title='Food Log' icon={faChevronDown} route={() => navigate("/food-log")}/>
                    <SidebarCategories title='Statistics' icon={faMagnifyingGlass} route={() => navigate("/statistics")}/>

                    <p className='text-gray-500 text-sm mt-5'>Test</p>

                    <SidebarCategories title='Daily Goals' icon={faShieldHalved} route={() => navigate("/daily-goals")}/>
                    <SidebarCategories title='Language' icon={faChevronDown} route={() => navigate("/language")}/>
                    <SidebarCategories title='Settings' icon={faHouse} route={() => navigate("/settings")}/>

                    <div className='w-[10%] absolute bottom-4'>
                        <SidebarCategories title='Contact' icon={faEnvelope} route={() => navigate("/contact")}/>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default SidebarAuthenticated
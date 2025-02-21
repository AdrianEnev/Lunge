import { faCalendar, faChevronDown, faEnvelope, faHouse, faMagnifyingGlass, faPerson, faShieldHalved } from '@fortawesome/free-solid-svg-icons'
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FIREBASE_AUTH } from 'firebaseConfig'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import SidebarCategories from './SidebarCategories'

const SidebarAuthenticated = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(FIREBASE_AUTH.currentUser ? true : false);
    const [currentPage, setCurrentPage] = useState('Home')

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
        <div className='w-full h-full font-rubik'>
            
            <div className='w-full h-full mx-4 border-r border-gray-200 py-4 pr-12 pl-2'>

                <div className='flex items-start gap-x-5 '>

                    <button onClick={() => {
                        navigate('/')
                    }}>
                        <h1 className='text-2xl text-black font-semibold'>Lunge</h1>
                    </button>
                    
                </div>

                <div className='mt-12 flex flex-col gap-y-1 text-gray-700'>

                    <SidebarCategories title='Home' icon={faHouse} currentPage={'Test'} route={() => navigate("/")}/>
                    <SidebarCategories title='Account' icon={faShieldHalved} currentPage={'Test'} route={() => navigate("/account")}/>
                    <SidebarCategories title='Friends' icon={faMagnifyingGlass} currentPage={'Test'} route={() => navigate("/friends")}/>
                    
                    <p className='text-gray-500 text-sm mt-5'>Workouts</p>

                    <SidebarCategories title='Splits' icon={faPerson} currentPage={'Test'} route={() => navigate("/workouts")}/>
                    <SidebarCategories title='Saved' icon={faPerson} currentPage={'Test'} route={() => navigate("/workouts/saved")}/>

                    <p className='text-gray-500 text-sm mt-5'>Nigga</p>
                    <SidebarCategories title='Food' icon={faCalendar} currentPage={'Test'} route={() => navigate("/food-log")}/>
                    <SidebarCategories title='Statistics' icon={faMagnifyingGlass} currentPage={'Test'} route={() => navigate("/statistics")}/>

                    <p className='text-gray-500 text-sm mt-5'>Faggot</p>

                    <SidebarCategories title='Settings' icon={faHouse} currentPage={'Test'} route={() => navigate("/settings")}/>

                    <div className='w-[10%] absolute bottom-4'>
                        <SidebarCategories title='Contact' icon={faEnvelope} currentPage={'Test'} route={() => navigate("/contact")}/>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default SidebarAuthenticated
import { FIREBASE_AUTH } from 'firebaseConfig';
import React, { useContext, useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { changeUsername } from '~/use/useChangeUsername';
import { GlobalContext } from '~/GlobalContext';

const Account = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [isAuthenticated, setIsAuthenticated] = useState(FIREBASE_AUTH.currentUser ? true : false);

    const [oldUsername, setOldUsername] = useState('');
    const [username, setUsername] = useState('');

    const [editModeEnabled, setEditModeEnabled] = useState(false);

    useEffect(() => {

        const username = localStorage.getItem('username');
        setUsername(username || 'User');
        setOldUsername(username || 'User');

    }, []);

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
                        
                        <button className='w-[160px] h-8 border border-gray-200 
                        shadow-md rounded-lg flex flex-row items-center justify-center 
                        gap-x-2 active:opacity-60'>
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
                    localStorage.clear();
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
import { FIREBASE_AUTH } from 'firebaseConfig';
import i18n from 'i18next-config';
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

const Contact = () => {

    const {t} = useTranslation();

    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [isAuthenticated, setIsAuthenticated] = useState(FIREBASE_AUTH.currentUser ? true : false);

    const sendMessage = async () => {
        console.log(email);
        console.log(message);
    }

    return (
        <div className="w-full h-full font-rubik"> 

            <div className={`${isAuthenticated ? "p-5" : "flex flex-col items-center justify-center mt-[5%]"}`}>
                
                <div className={`${isAuthenticated ? "w-[40%] h-98 bg-white rounded-xl border-gray-100" : "w-[40%] h-98 bg-white rounded-xl shadow-md border border-gray-100 px-14 py-12"}`}>
                                
                    <div className="flex flex-col">
                        <p className="text-2xl text-gray-800 font-medium">{t('contact-us')}</p>
                    </div>

                    <div className='flex w-full h-full flex-col mt-3'>
                        
                        <p className='text-xl text-gray-600 my-2'>{t('email')}</p>
                        <input
                            type="text"
                            placeholder={t('example-email')}
                            className='border border-gray-300 p-2 rounded-md'
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                        />
                        
                        <p className='text-xl text-gray-600 my-2'>{t('message')}</p>
                        <textarea
                            className='border border-gray-300 p-2 rounded-md h-32'
                            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(event.target.value)}
                        />

                        <button className='w-full h-12 bg-red-400 mt-3 rounded-xl active:opacity-60'
                            onClick={() => sendMessage()}
                        >
                            <p className='text-xl font-medium text-white'>{i18n.language == "en" ? 'Send' : t('done')}</p>
                        </button>

                    </div>

                </div>

            </div>
            
        </div>
    )
}

export default Contact
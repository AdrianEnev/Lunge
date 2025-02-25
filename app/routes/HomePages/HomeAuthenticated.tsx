import i18n from 'i18next-config';
import React from 'react'
import { useTranslation } from 'react-i18next'

const HomeAuthenticated = ({username}: any) => {

    const {t} = useTranslation();
    
    return (
        <div className="w-full h-full font-rubik p-5"> 

            <div className="flex flex-col">
                
                <div className='flex flex-row gap-x-2 mt-5'>
                    <p className="text-3xl text-black font-semibold">
                        {t('welcome')}, 
                    </p>

                    <p className='text-3xl text-gray-700 font-medium'>{username}</p>
                </div>
                

                <p className="text-3xl text-black mt-5 font-base">
                    {i18n.language == "en" ? "All account information will be displayed here." : "Всякаква информация за акаунта ви ще бъде показана тук."}
                </p>  
            </div>
        
        </div>
    )
}

export default HomeAuthenticated
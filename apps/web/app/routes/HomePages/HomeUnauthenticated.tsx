import i18n from 'i18next-config'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const HomeUnauthenticated = ({username}: any) => {

    const {t} = useTranslation()

    return (
        <div className="w-full h-full font-rubik flex justify-center pt-5"> 

            <div className="flex flex-col">

                <p className="text-5xl text-black mt-5 font-base">
                    {t('welcome')}!
                </p>  
            </div>
    
        </div>
    )
}

export default HomeUnauthenticated
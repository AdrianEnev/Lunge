import { faLanguage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { collection, doc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from 'firebaseConfig';
import i18n from 'i18next-config';
import type { GoalNutrients } from 'interfaces'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { changeDailyGoal } from '~/use/useChangeDailyGoal';

interface DailyGoalsElementProps {
    dailyGoal: any;
    index: number;
    selectedNutrient: string;
    setSelectedNutrient: (nutrient: string) => void;
}

const Settings = () => {
    
    const [selectedNutrient, setSelectedNutrient] = useState('')

    const [dailyGoals, setDailyGoals] = useState<GoalNutrients[]>([])
    const [loading, setLoading] = useState(false)
    const [language, setLanguage] = useState(i18n.language);

    const {t} = useTranslation();

    const DailyGoalsElement = ({ dailyGoal, index, selectedNutrient, setSelectedNutrient }: DailyGoalsElementProps) => {

        return (
            <div
                className={`w-full h-10 text-gray-600 border-y border-gray-100 px-3 
                flex flex-row items-center
               `}
            >
                {['calories', 'protein', 'carbs', 'fat'].map((nutrient) => (
                    <button
                        key={nutrient}
                        className={`text-base w-1/4 hover:opacity-50 
                            ${selectedNutrient === nutrient ? 'text-red-400' : ''}
                        `}
                        onClick={() => setSelectedNutrient(nutrient)}
                    >
                        {selectedNutrient === nutrient ? (
                            <input
                                type="text"
                                defaultValue={dailyGoal[nutrient]}
                                className="w-full text-center border-none outline-none"
                                onBlur={(e) => {
                                    setSelectedNutrient('')
                                    changeDailyGoal(nutrient, dailyGoals, e.target.value)
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        setSelectedNutrient('')
                                        changeDailyGoal(nutrient, dailyGoals, e.currentTarget.value)
                                    }
                                }}
                                maxLength={selectedNutrient === 'calories' ? 4 : 3}
                            />
                        ) : (
                            <p>{dailyGoal[nutrient]}</p>
                        )}
                    </button>
                ))}
            </div>
        );
    };

    const dailyGoalsLS = localStorage.getItem('dailyGoals')

    useEffect(() => {
        if (dailyGoalsLS) {
            // get goals object
            const dailyGoalsObject = JSON.parse(dailyGoalsLS)

            // convert to an array (easier to use)
            const convertToGoalNutrients = (obj: { [key: string]: string }): GoalNutrients[] => {
                return [{
                  ...obj,
                  id: crypto.randomUUID()
                } as GoalNutrients];
            };

            const convertedDailyGoals = convertToGoalNutrients(dailyGoalsObject)
            setDailyGoals(convertedDailyGoals)
        }
    }, [dailyGoalsLS])

    const changeLanguage = () => {
        const newLanguage = language === 'en' ? 'bg' : 'en';
        i18n.changeLanguage(newLanguage);
        setLanguage(newLanguage)
    }

    return (
        <div className="w-full h-full font-rubik p-5"> 
                
            <p className="text-3xl text-black mt-5 font-semibold">
                {t('settings')}
            </p>
            <div className='w-full h-[2px] bg-gray-100 rounded-full mt-2'></div>

            <div className='h-52'>
                {loading ? (
                        <div className='mt-2'>
                            <p className='text-xl text-red-500'>{t('loading')}</p>
                        </div>
                    ) : (
                        dailyGoals ? 
                            (
                                <div className='flex flex-row flex-wrap gap-x-2 gap-y-12 w-full'>
                                    <div className='w-full'>
                                        <p className='text-xl text-gray-700 mt-4 mb-2 font-medium'>{t('daily-goals')}</p>

                                        <div className='w-[49%] h-full border border-gray-200 rounded-md mb-4'>
                                            <div className={`flex flex-row justify-center gap-x-4 px-1 mt-2 mb-2 font-sans font-semibold`}>
                                                <p className='w-1/4 text-center text-lg mr-[-20px]'>{t('calories')}</p>
                                                <p className='w-1/4 text-center text-lg mr-[-20px]'>{t('protein')}</p>
                                                <p className='w-1/4 text-center text-lg '>{t('carbs')}</p>
                                                <p className='w-1/4 text-center text-lg ml-[-20px]'>{t('fat')}</p>
                                            </div>

                                            {dailyGoals.map((dailyGoal, index) => (
                                                <DailyGoalsElement
                                                    dailyGoal={dailyGoal}
                                                    index={index}
                                                    key={dailyGoal.id}
                                                    selectedNutrient={selectedNutrient}
                                                    setSelectedNutrient={setSelectedNutrient}
                                                />
                                            ))}

                                        </div>
                                    </div>
                                </div>
                            ) 
                                : 
                            (
                                <div>
                                    <p>{t('no-data-available')}</p>
                                </div>
                            )
                    )
                }
            </div>

            <button onClick={() => {changeLanguage()}} className='absolute bottom-0 right-4'>
                <FontAwesomeIcon icon={faLanguage}  className='text-[#ff2056] text-lg w-10 h-10 mt-[6px]' />
            </button>

        </div>
    )
}

export default Settings
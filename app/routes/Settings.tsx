import { collection, doc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from 'firebaseConfig';
import type { GoalNutrients } from 'interfaces'
import React, { useEffect, useState } from 'react'
import { changeDailyGoal } from '~/use/useChangeDailyGoal';
import { getFoodDays } from '~/use/useGetUserInfo';

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
                            ${selectedNutrient === nutrient ? 'text-blue-500' : ''}
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

    return (
        <div className="w-full h-full font-rubik p-5"> 
                
            <p className="text-3xl text-black mt-5 font-semibold">
                Settings
            </p>
            <div className='w-full h-[2px] bg-gray-100 rounded-full mt-2'></div>

            {loading ? (
                    <div className='mt-2'>
                        <p className='text-xl text-red-500'>Loading...</p>
                    </div>
                ) : (
                    dailyGoals ? 
                        (
                            <div className='flex flex-row flex-wrap gap-x-2 gap-y-12 w-full'>
                                <div className='w-full'>
                                    <p className='text-xl text-gray-700 mt-4 mb-2 font-medium'>Daily goals</p>

                                    <div className='w-[49%] h-full border border-gray-200 rounded-md mb-4'>
                                        <div className={`flex flex-row justify-center gap-x-4 px-1 mt-2 mb-2 font-sans font-semibold`}>
                                            <p className='w-1/4 text-center text-lg mr-[-20px]'>Calories</p>
                                            <p className='w-1/4 text-center text-lg mr-[-20px]'>Protein</p>
                                            <p className='w-1/4 text-center text-lg '>Carbs</p>
                                            <p className='w-1/4 text-center text-lg ml-[-20px]'>Fat</p>
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
                                <p>Daily nutrients not retreived succesfuly</p>
                            </div>
                        )
                )
            }

        </div>
    )
}

export default Settings
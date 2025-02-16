import type { GoalNutrients } from 'interfaces'
import React, { useEffect, useState } from 'react'

interface DailyGoalsElementProps {
    dailyGoal: any;
    index: number;
}

const DailyGoalsElement = ({ dailyGoal, index }: DailyGoalsElementProps) => {
    return (
        <button
            className={`w-full h-10 text-gray-600 border-y border-gray-100 px-3 
            flex flex-row items-center
           `}
            onClick={() => {}}
        >
            <p className={`text-base w-1/4 hover:opacity-50`}>
                {dailyGoal.calories}
            </p>

            <p className='text-base w-1/4 hover:opacity-50'>
                {dailyGoal.carbs}
            </p>
            
            <p className='text-base w-1/4 hover:opacity-50'>
                {dailyGoal.fat}
            </p>

            <p className='text-base w-1/4 hover:opacity-50'>
                {dailyGoal.protein}
            </p>

        </button>
    );
};

const Settings = () => {

    const [dailyGoals, setDailyGoals] = useState<GoalNutrients[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const dailyGoalsLS = localStorage.getItem('dailyGoals')
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
        
    }, [])

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
                                            <DailyGoalsElement dailyGoal={dailyGoal} index={index} />
                                        ))}

                                    </div>
                                </div>
                            </div>
                        ) 
                            : 
                        (
                            <div>
                                <p>not found</p>
                            </div>
                        )
                )}

        </div>
    )
}

export default Settings
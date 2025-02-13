import React, { useEffect, useState } from 'react'
import type { Route } from "./+types/FoodDay"
import { useNavigate } from 'react-router';
import type { FoodDay } from 'interfaces';
import { FIREBASE_AUTH } from 'firebaseConfig';
import { getFoodDay } from '~/use/useGetFoodDay';

interface LoaderData {
    foodDate: string;
}

export async function loader({ params }: Route.LoaderArgs) {
    
    const foodDate = params.foodDate

    return { foodDate };
}

const FoodDay = ({loaderData}: { loaderData: LoaderData }) => {

    const navigate = useNavigate();

    const [foodDay, setFoodDay] = useState<FoodDay | null>(null)
    const [date, setDate] = useState('');

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetch = async () => {

            // remove any zeros from the start (example -> "2025-05-03" to "2025-5-3")
            // required due to how titles are formatted in firebase
            const foodDateTrimmed = loaderData.foodDate.replace(/-0+/g, '-');

            const foodDay = await getFoodDay(
                foodDateTrimmed, FIREBASE_AUTH.currentUser?.uid, setLoading
            )
            setFoodDay(foodDay)
            setDate(loaderData.foodDate)
        }

        fetch();
    }, [])

    return (
        <div className="w-full h-full font-rubik p-5"> 
            
            <p className="text-3xl text-black mt-5 font-semibold">
                {date}
            </p>
            <div className='w-full h-[2px] bg-gray-100 rounded-full mt-2'></div>

            <div className='py-3'>
                {loading ? (
                    <div>
                        <p>Loading...</p>
                    </div>
                ) : (
                    foodDay ? (
                        <div>
                            <p>loaded</p>
                        </div>
                    ) : (
                        <div>
                            <p>No data available</p>
                        </div>
                    )
                )}
            </div>

        </div>
    )
}

export default FoodDay
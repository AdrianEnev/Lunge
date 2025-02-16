import React, { useEffect, useState } from 'react';
import type { Route } from "./+types/FoodDay";
import { useNavigate } from 'react-router';
import type { FoodDay } from 'interfaces';
import { FIREBASE_AUTH } from 'firebaseConfig';
import { getFoodDay } from '~/use/useGetFoodDay';
import { FixedSizeList as List } from 'react-window';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

interface FoodElementProps {
    food: any;
    index: number;
}

const FoodElement = ({ food, index }: FoodElementProps) => {
    return (
        <button
            className={`w-full h-10 text-gray-600 border-y border-gray-100 px-3 
            flex flex-row items-center
            hover:opacity-50 hover:bg-gray-100`}
            onClick={() => {}}
        >
            <p className={`text-base w-1/6`}>
                {food.title}
            </p>

            <p className='text-base w-1/6'>
                {food.grams}
            </p>
            
            <p className='text-base w-1/6'>
                {food.calories}
            </p>

            <p className='text-base w-1/6'>
                {food.calories}
            </p>

            <p className='text-base w-1/6'>
                {food.calories}
            </p>

            <p className='text-base w-1/6'>
                {food.calories}
            </p>
        </button>
    );
};

export async function loader({ params }: Route.LoaderArgs) {
    const foodDate = params.foodDate;
    return { foodDate };
}

interface LoaderData {
    foodDate: string;
}

const FoodDay = ({ loaderData }: { loaderData: LoaderData }) => {
    
    const navigate = useNavigate();
    const [foodDay, setFoodDay] = useState<any | null>(null);
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            const foodDateTrimmed = loaderData.foodDate.replace(/-0+/g, '-');
            const foodDay = await getFoodDay(foodDateTrimmed, FIREBASE_AUTH.currentUser?.uid);
            setFoodDay(foodDay);
            setDate(loaderData.foodDate);
            setLoading(false);

            console.log(foodDay)
        };

        fetch();
    }, [loaderData.foodDate]);

    const foodItems = foodDay ? [...foodDay.foods] : [];

    return (
        <div className="w-full h-full font-rubik p-5"> 

            <div className='flex flex-row gap-x-3 mt-5 '>
                <button onClick={() => {
                    navigate('/food-log')
                }}>
                    <FontAwesomeIcon icon={faArrowLeft} className='w-8 h-8 hover:opacity-60'/> 
                </button>

                <p className="text-3xl font-semibold">
                    Food Log
                </p>
            </div>
            <div className='w-full h-[2px] bg-gray-100 rounded-full mt-2 '></div>

            <div className="mt-2 h-[calc(100vh-150px)] overflow-y-hidden">
                {loading ? (
                    <div className='mt-2'>
                        <p className='text-xl text-red-500'>Loading...</p>
                    </div>
                ) : (
                    foodDay ? (
                        <div className='mt-2'>
                            <p className='text-2xl text-gray-700 my-4'>Date: {foodDay.title}</p>
                            <p className='text-2xl text-gray-700 my-4'>Calories: {foodDay.calories}</p>
                            <p className='text-2xl text-gray-700 my-4'>Protein: {foodDay.protein}</p>
                            <p className='text-2xl text-gray-700 my-4'>Carbs: {foodDay.carbs}</p>
                            <p className='text-2xl text-gray-700 my-4'>Fat: {foodDay.fat}</p>

                            <div className='flex flex-row flex-wrap gap-x-2 gap-y-12 w-full'>
                                <div className='w-full'>
                                    <p className='text-lg font-medium'>Foods</p>

                                    <div className='w-full h-full border border-gray-200 rounded-md mb-4'>
                                        <div className={`flex flex-row justify-center gap-x-4 px-1 mt-2 mb-2 font-sans font-semibold`}>
                                            <p className='w-1/6 text-center text-lg mr-[-10px]'>Title</p>
                                            <p className='w-1/6 text-center text-lg mr-[-10px]'>Grams</p>
                                            <p className='w-1/6 text-center text-lg mr-[-10px]'>Calories</p>
                                            <p className='w-1/6 text-center text-lg mr-[-10px]'>Protein</p>
                                            <p className='w-1/6 text-center text-lg ml-[-10px]'>Carbs</p>
                                            <p className='w-1/6 text-center text-lg mr-2'>Fat</p>
                                        </div>

                                        <List
                                            height={foodItems.length * 40}
                                            width={'100%'}
                                            itemCount={foodItems.length}
                                            itemSize={40}
                                            layout="vertical"
                                        >
                                            {({ index }) => {
                                                return (
                                                    <div>
                                                        <FoodElement key={foodItems[index].id} 
                                                            food={foodItems[index]} 
                                                            index={index}
                                                        />
                                                    </div>
                                                );
                                            }}
                                        </List>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='mt-2'>
                            <p className='text-xl text-red-500'>No data available</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default FoodDay;
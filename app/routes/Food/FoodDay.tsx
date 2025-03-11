import React, { useEffect, useState } from 'react';
import type { Route } from "./+types/FoodDay";
import { useNavigate } from 'react-router';
import type { FoodDay } from 'interfaces';
import { FIREBASE_AUTH, FIRESTORE_DB } from 'firebaseConfig';
import { getFoodDay } from '~/use/useGetFoodDay';
import { FixedSizeList as List } from 'react-window';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { collection, doc, deleteDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

interface FoodElementProps {
    food: any;
    index: number;
}

const FoodElement = ({ food, index }: FoodElementProps) => {

    const foodDetails = [
        { label: 'Title', value: food.title },
        { label: 'Grams', value: food.grams },
        { label: 'Calories', value: food.calories },
        { label: 'Protein', value: food.protein },
        { label: 'Carbs', value: food.carbs },
        { label: 'Fat', value: food.fat },
    ];

    return (
        <button
            className={`w-full h-10 text-gray-600 border-y border-gray-100 px-3 
            flex flex-row items-center
            hover:opacity-50 hover:bg-gray-100`}
            onClick={() => {}}
        >
            {foodDetails.map((detail, idx) => (
                <p key={idx} className='text-base w-1/6'>
                    {detail.value || '-'}
                </p>
            ))}
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
    const [foodDayEmpty, setFoodDayEmpty] = useState(false);

    const {t} = useTranslation();

    // if food day contains 1 or more items but no total, delete all documents
    const checkDeleteEmptyFoodDay = async (foodDay: any) => {

        console.log(foodDay)

        if (!foodDay.calories || !foodDay.protein || !foodDay.carbs || !foodDay.fat) {
            
            const usersCollectionRef = collection(FIRESTORE_DB, 'users');
            const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
            const foodDaysCollectionRef = collection(userDocRef, 'food_days');
            const foodDayDocRef = doc(foodDaysCollectionRef, foodDay.title);

            await deleteDoc(foodDayDocRef);
            console.log('empty - deleted')

            // also remove from local storage if needed
        }
        console.log('not empty')

    }

    useEffect(() => {
        const fetch = async () => {

            // get food day
            const foodDay = await getFoodDay(loaderData.foodDate, FIREBASE_AUTH.currentUser?.uid);
            setFoodDay(foodDay);
            setDate(loaderData.foodDate);
            setLoading(false);

            // some days may appear as marked on the calendar even if they are empty, mark them as empty
            if (!foodDay?.calories && !foodDay?.protein && !foodDay?.carbs && !foodDay?.fat) {
                setFoodDayEmpty(true)
            }
            
            if (!foodDay) return;

            // if empty -> delete day
            checkDeleteEmptyFoodDay(foodDay);
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

                <div className='flex flex-row gap-x-3 '>
                    <p className="text-3xl font-medium">
                        {t('food-log')}
                    </p>

                    <p className='text-3xl text-gray-500'>
                        ({foodDay && foodDay.title ? foodDay.title : date})
                    </p>
                </div>
            </div>
            <div className='w-full h-[2px] bg-gray-100 rounded-full mt-2 '></div>

            <div className="mt-2 h-[calc(100vh-150px)] overflow-y-hidden">
                {loading ? (
                    <div className='mt-2'>
                        <p className='text-xl text-red-500'>{t('loading')}</p>
                    </div>
                ) : (
                    (foodDay && !foodDayEmpty) ? (
                        <div className='flex flex-row flex-wrap gap-x-2 gap-y-12 w-full mt-2'>
                            <div className='w-full'>

                                <div className='w-full flex flex-row justify-between'>

                                    <div className='w-full h-full border border-gray-200 rounded-md mb-4'>
                                        <div className={`flex flex-row justify-center gap-x-4 px-1 mt-2 mb-2 font-sans font-semibold`}>
                                            <p className='w-1/6 text-center text-lg mr-[-10px]'>{t('food-2')}</p>
                                            <p className='w-1/6 text-center text-lg mr-[-10px]'>{t('grams')}</p>
                                            <p className='w-1/6 text-center text-lg mr-[-10px]'>{t('calories')}</p>
                                            <p className='w-1/6 text-center text-lg mr-[-10px]'>{t('protein')}</p>
                                            <p className='w-1/6 text-center text-lg ml-[-10px]'>{t('carbs')}</p>
                                            <p className='w-1/6 text-center text-lg mr-2'>{t('fat')}</p>
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

                                        <div className='w-full h-full border-[0.5px] border-gray-200'>
                                            <p className='text-lg font-medium mx-2 my-1'>{t('total')}</p>
                                        </div>

                                        <FoodElement key={0} 
                                            food={{
                                                calories: foodDay.calories,
                                                protein: foodDay.protein,
                                                carbs: foodDay.carbs,
                                                fat: foodDay.fat
                                            }} 
                                            index={0}
                                            />
                                    </div>
                                </div>

                            </div>
                        </div>
                    ) : (
                        <div className='mt-2'>
                            <p className='text-xl text-red-500'>{t('no-data-available')}</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default FoodDay;
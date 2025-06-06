import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router'
import type { Route } from "./+types/SavedWorkouts"
import { getSavedWorkout } from '~/use/useGetSavedWorkout';
import { FIREBASE_AUTH } from 'firebaseConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FixedSizeList as List } from 'react-window'
import { useTranslation } from 'react-i18next';

interface ExerciseElementProps {
    set: any
    index: number
}

const ExerciseElement = ({set, index}: ExerciseElementProps) => {

    return (
        <button
            className={`w-full h-10 text-gray-600 border-y border-gray-100 px-3 
            flex flex-row items-center
            hover:opacity-50 hover:bg-gray-100`}
            onClick={() => {

            }}
        >
            <p className={`text-base w-1/3`}>
                {set.setIndex}
            </p>

            <p className='text-base w-1/3'>
                {set.reps | 0}
            </p>
            
            <p className='text-base w-1/3'>
                {set.weight | 0}
            </p>
        </button>
    )
}

export async function loader({params}: Route.LoaderArgs) {
    const savedWorkoutId = params.savedWorkoutId
    return {savedWorkoutId};
}

interface LoaderData {
    savedWorkoutId: string;
}

const ViewSavedWorkout = ({loaderData}: { loaderData: LoaderData }) => {

    const [savedWorkout, setSavedWorkout] = useState<any | null>(null)
    const navigate = useNavigate();

    const {t} = useTranslation();

    useEffect(() => {
        const fetch = async () => {
            const savedWorkout = await getSavedWorkout(
                loaderData?.savedWorkoutId, FIREBASE_AUTH.currentUser?.uid
            )
            setSavedWorkout(savedWorkout)
        }

        fetch();
    }, [])

    const exerciseItems = savedWorkout ? [...savedWorkout.exercises] : []

    return (
        <div className="w-full h-full font-rubik p-5"> 
            
            {savedWorkout ? (
                <div className="mt-4 h-[calc(100vh-150px)] overflow-y-scroll">
                    
                    <div className='flex flex-row gap-x-3'>

                        <button onClick={() => {
                            navigate('/workouts/saved')
                        }}>
                            <FontAwesomeIcon icon={faArrowLeft} className='w-8 h-8 hover:opacity-60'/> 
                        </button>

                        <p className="text-3xl font-semibold">
                            {savedWorkout.title}
                        </p>

                    </div>
                    <div className='w-full h-[2px] bg-gray-100 rounded-full my-2'></div>

                    <div className='flex flex-row flex-wrap gap-x-2 gap-y-12 w-full mt-6'>
                        {exerciseItems.map((exercise, exerciseIndex) => (
                            <div key={exercise.id} className='w-[49%]'>
                                <div className='flex flex-row gap-x-2'>
                                    <p className='text-xl text-gray-700 font-medium'>{exercise.title}</p>
                                    <p className='text-xl text-red-400 font-medium'>({exerciseIndex + 1})</p>

                                </div>

                                <div className='w-full h-full border border-gray-200 rounded-md mb-4'>

                                    <div className={`flex flex-row justify-center gap-x-4 px-1 mt-2 mb-2 font-sans font-semibold`}>
                                        <p className='w-1/3 text-center text-lg mr-[-24px]'>{t('set')}</p>
                                        <p className='w-1/3 text-center text-lg'>{t('reps')}</p>
                                        <p className='w-1/3 text-center text-lg ml-[-24px]'>{t('weight')}</p>
                                    </div>

                                    <List
                                        height={exercise.sets.length * 40}
                                        width={'100%'}
                                        itemCount={exercise.sets.length}
                                        itemSize={40}
                                        layout="vertical"
                                    >
                                        {({ index }) => {
                                            // Sort the sets by setIndex
                                            const sortedSets = [...exercise.sets].sort((a, b) => a.setIndex - b.setIndex);
                                            return (
                                                <div>
                                                    <ExerciseElement key={sortedSets[index].setIndex} 
                                                        set={sortedSets[index]} 
                                                        index={index}
                                                    />
                                                </div>
                                            );
                                        }}
                                    </List>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
            ) : (
                <div className='w-[90%] h-[80%] flex items-center justify-center'>
                    <p className='text-4xl font-medium text-red-400'>{t('retreiving-workout')}</p>
                </div>
            )}

        </div>
    )
}

export default ViewSavedWorkout
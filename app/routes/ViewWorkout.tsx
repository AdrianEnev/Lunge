import React, { useEffect, useState } from 'react'
import type { Route } from "./+types/ViewWorkout"
import type { Workout } from 'interfaces';
import { getWorkout } from '~/use/useGetWorkout';
import { FIREBASE_AUTH } from 'firebaseConfig';
import { timestampToDate } from '~/use/useTimestampToDate';
import { FixedSizeList as List } from 'react-window'

interface ExerciseElementProps {
    set: any
    index: number
}

const ExerciseElement = ({set, index}: ExerciseElementProps) => {

    console.log(set)

    return (
        <button
            className={`w-full h-10 text-gray-600 border-y border-gray-100 px-3 
            flex flex-row items-center
            hover:opacity-50 hover:bg-gray-100`}
            onClick={() => {

            }}
        >
            <p className='text-base w-1/3'>
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
    const workoutId = params.workoutId
    return {workoutId};
}

interface LoaderData {
    workoutId: string;
}

const ViewWorkout = ({loaderData}: { loaderData: LoaderData }) => {

    const [workout, setWorkout] = useState<Workout | null>(null)

    useEffect(() => {
        const fetch = async () => {
            const workout = await getWorkout(
                loaderData?.workoutId, FIREBASE_AUTH.currentUser?.uid
            )

            setWorkout(workout)
            
        }

        fetch();
    }, [])

    const exerciseItems = workout ? [...workout.exercises] : []

    return (
        <div className="w-full h-full font-rubik p-5"> 

            <p className="text-3xl mt-5 font-semibold">
                Workout Splits
            </p>
            <div className='w-full h-[2px] bg-gray-100 rounded-full mt-2'></div>

            {workout ? (
                <div className='mt-2'>
                    <p className='text-xl text-gray-700 my-2'>{workout.title} ({timestampToDate(workout.created)})</p>

                    {exerciseItems.map((exercise, exerciseIndex) => (
                        <div key={exercise.id}>
                            <p>{exercise.title}</p>

                            <div className='w-[49%] h-full border border-gray-200 rounded-md mb-4'>

                                <div className={`flex flex-row justify-center gap-x-4 px-1 mt-2 mb-2 font-sans font-semibold`}>
                                    <p className='w-1/3 text-center'>Set</p>
                                    <p className='w-1/3 text-center'>Reps</p>
                                    <p className='w-1/3 text-center'>Weight</p>
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
                                                <ExerciseElement key={sortedSets[index].setIndex} set={sortedSets[index]} index={index}/>
                                            </div>
                                        );
                                    }}
                                </List>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className='mt-2'>
                    <p className='text-xl text-red-500'>Loading...</p>
                </div>
            )}
        </div>
    )
}

export default ViewWorkout
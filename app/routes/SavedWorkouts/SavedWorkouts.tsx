import type { SavedWorkout } from 'interfaces';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { FixedSizeList as List } from 'react-window'
import { timestampToDate } from '~/use/useTimestampToDate';

const SavedWorkouts = () => {

    const [savedWorkouts, setSavedWorkouts] = useState<any[]>([]);
    const savedWorkoutItems = [...savedWorkouts]

    const navigate = useNavigate();

    useEffect(() => {

        const savedWorkoutsLS = localStorage.getItem('saved_workouts');
        //console.log(workoutsLS)

        const savedWorkouts: SavedWorkout[] = [];

        if (savedWorkoutsLS) {
            const savedWorkoutsData = JSON.parse(savedWorkoutsLS) as SavedWorkout[];

            savedWorkoutsData.forEach(savedWorkout => {
                savedWorkouts.push(savedWorkout);
            });
        }

        console.log(savedWorkouts)
        setSavedWorkouts(savedWorkouts);

    }, [])

    const SavedWorkoutElement = ({workout, navigate}: any) => {

        const workoutDate = timestampToDate(workout.created)
    
        return (
            <button
                className={`w-full h-10 text-gray-600 border-y border-gray-100 px-3 
                flex flex-row items-center
                hover:opacity-50 hover:bg-gray-100`}
                onClick={() => {

                    if (workout.title == "Rest~+!_@)#($*&^@&$^*@^$&@*$&#@&#@(&#$@*&($") {
                        return
                    }

                    navigate(`/workouts/saved/${workout.id}`)
                }}
            >
                <p className='text-base w-1/3'>
                    {
                        workout.title !== "Rest~+!_@)#($*&^@&$^*@^$&@*$&#@&#@(&#$@*&($" ? 
                            workout.title : "Rest Day"
                    }
                </p>
    
                <p className='text-base w-1/3'>
                    {workoutDate}
                </p>
                
                <p className='text-base w-1/3'>
                    {workout.duration} seconds
                </p>

            </button>
        )
    }

    const WorkoutsRenderer = ({ index, style }: { index: number, style: React.CSSProperties }) => {

        const sortedWorkoutItems = savedWorkouts.sort((a, b): any => {

            if (a.created && b.created) {
                const dateA = new Date(a.created.seconds * 1000)
                const dateB = new Date(b.created.seconds * 1000)
                return dateB.getTime() - dateA.getTime()
            }
        })

        const item = sortedWorkoutItems[index] || savedWorkouts[index]

        return (
            <div style={style}>
                <SavedWorkoutElement key={item.id} {...item} workout={item} navigate={navigate} />
            </div>
        )
    }

    return (
        <div className="w-full h-full font-rubik p-5"> 
                
            <p className="text-3xl text-black mt-5 font-semibold">
                Completed Workouts
            </p>
            <div className='w-full h-[2px] bg-gray-100 rounded-full mt-2'></div>
            

            <div className='w-full h-1/2 border border-gray-200 rounded-md mt-4'>

                <div className={`flex flex-row justify-center gap-x-4 px-1 mt-2 mb-2 font-sans font-semibold`}>
                    <p className='w-1/3 text-center text-lg mr-[-24px]'>Title</p>
                    <p className='w-1/3 text-center text-lg'>Created on</p>
                    <p className='w-1/3 text-center text-lg ml-[-24px]'>Duration</p>
                </div>

                <List
                    height={410}
                    width={'100%'}
                    itemCount={savedWorkoutItems.length}
                    itemSize={40}
                    layout="vertical"
                    
                >
                    {WorkoutsRenderer}
                </List>
            </div>

        </div>
    )
}

export default SavedWorkouts
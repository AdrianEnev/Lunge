import { serverTimestamp } from 'firebase/firestore'
import type { Workout } from 'interfaces'
import React, { useEffect, useState } from 'react'
import { FixedSizeList as List } from 'react-window'
import { Outlet, useNavigate } from 'react-router'
import { timestampToDate } from '~/use/useTimestampToDate'

interface WorkoutElementProps {
    workout: Workout
    navigate: any
}

const WorkoutElement = ({workout, navigate}: WorkoutElementProps) => {

    const workoutDate = timestampToDate(workout.created)

    return (
        <button
            className={`w-full h-10 text-gray-600 border-y border-gray-100 px-3 
            flex flex-row items-center
            hover:opacity-50 hover:bg-gray-100`}
            onClick={() => {
                //viewWorkout(workout.id)
                navigate(`workout/${workout.id}`)
            }}
        >
            <p className='text-base w-1/3'>
                {workout.title}
            </p>

            <p className='text-base w-1/3'>
                {workoutDate}
            </p>

            <p className='text-base w-1/3'>
                {workout.numberOfExercises}
            </p>
        </button>
    )
}

const FolderElement = (folder: any) => {

    const workoutCount = folder.workouts.length;

    return (
        <button
            className='w-full h-10 text-gray-600 border-y border-gray-100 px-3 
            flex items-center
            hover:opacity-50'
            onClick={() => {
                
            }}
        >
            <p className='text-base w-1/3'>
                {folder.title}
            </p>

            <p className='text-base w-1/3'>
                -
            </p>

            <p className='text-base w-1/3'>
                {workoutCount}
            </p>
        </button>
    )
}

const Workouts = () => {

    const [workouts, setWorkouts] = useState<Workout[]>([])
    const [folders, setFolders] = useState<Workout[]>([])

    const navigate = useNavigate();

    useEffect(() => {
        const workoutsLS = localStorage.getItem('workouts');

        const folderMap: { [key: string]: Workout[] } = {}
        const workouts: Workout[] = []

        if (workoutsLS) {
            const workoutsData = JSON.parse(workoutsLS) as Workout[]
            workoutsData.forEach(workout => {
                if (workout.folderId) {
                    if (!folderMap[workout.folderId]) {
                        folderMap[workout.folderId] = []
                    }
                    folderMap[workout.folderId].push(workout)
                } else {
                    workouts.push(workout)
                }
            })
        }

        const folders: any[] = Object.keys(folderMap).map(folderId => {
            const middleDigit = folderId.replace('folder_', '')[Math.floor((folderId.replace('folder_', '').length - 1) / 2)];
            return {
            id: folderId,
            title: `Folder ${middleDigit}`,
            folderId: folderId,
            workouts: folderMap[folderId],
            exercises: [],
            colour: '',
            numberOfExercises: 0,
            created: serverTimestamp()
            }
        })

        setWorkouts(workouts)
        setFolders(folders)

    }, [])

    const workoutItems = [...workouts]
    const folderItems = [...folders]

    const WorkoutsRenderer = ({ index, style }: { index: number, style: React.CSSProperties }) => {

        const sortedWorkoutItems = workoutItems.sort((a, b): any => {

            if (a.created && b.created) {
                const dateA = new Date(a.created.seconds * 1000)
                const dateB = new Date(b.created.seconds * 1000)
                return dateB.getTime() - dateA.getTime()
            }
        })

        const item = sortedWorkoutItems[index] || workoutItems[index]

        return (
            <div style={style} className=''>
                <WorkoutElement key={item.id} {...item} workout={item} navigate={navigate} />
            </div>
        )
    }

    const FoldersRenderer = ({ index, style }: { index: number, style: React.CSSProperties }) => {

        const item = folderItems[index]

        return (
            <div style={style} className=''>
                <FolderElement key={item.id} {...item} />
            </div>
        )
    }

    return (
        <div className="w-full h-full font-rubik p-5"> 
                
            <p className="text-3xl text-black mt-5 font-semibold">
                Workout Splits
            </p>

            <div className='w-full h-[2px] bg-gray-100 rounded-full mt-2'></div>

            <div className='my-3 flex flex-row gap-x-3 hidden'>
                <div 
                    className='rounded-lg w-[150px] h-[65px] border-[1.5px] 
                    border-gray-200 text-red-400 px-2 py-2 hover:border-red-400'
                >
                    <p>All</p>
                    <p className='font-medium'>160</p>
                </div>

                <div 
                    className='rounded-lg w-[150px] h-[65px] border-[1.5px] 
                    border-gray-200 text-red-400 px-2 py-2 hover:border-red-400'
                >
                    <p>Folders</p>
                    <p className='font-medium'>10</p>
                </div>

                <div 
                    className='rounded-lg w-[150px] h-[65px] border-[1.5px] 
                    border-gray-200 text-red-400 px-2 py-2 hover:border-red-400'
                >
                    <p>Workouts</p>
                    <p className='font-medium'>150</p>
                </div>
            </div>

            <div className='flex flex-row gap-x-2 mt-2 mb-1 px-2'>
                <p className='text-xl font-medium text-yellow-400 w-[49%]'>Folders</p>
                <p className='text-xl font-medium text-red-400 w-[49%]'>Workouts</p>
            </div>

            <div className='flex flex-row w-full gap-x-2'>
                <div className='w-[49%] h-full border border-gray-200 rounded-md'>

                    <div className={`flex flex-row justify-center gap-x-4 px-1 mt-2 mb-2 font-sans font-semibold`}>
                        <p className='w-1/3 text-center'>Title</p>
                        <p className='w-1/3 text-center'>Created On</p>
                        <p className='w-1/3 text-center'>Workouts</p>
                    </div>

                    <List
                        height={410}
                        width={'100%'}
                        itemCount={folderItems.length}
                        itemSize={40}
                        layout="vertical"
                        
                    >
                        {FoldersRenderer}
                    </List>
                </div>

                <div className='w-[49%] h-full border border-gray-200 rounded-md'>

                    <div className={`flex flex-row justify-center gap-x-4 px-1 mt-2 mb-2 font-sans font-semibold`}>
                        <p className='w-1/3 text-center'>Title</p>
                        <p className='w-1/3 text-center'>Created On</p>
                        <p className='w-1/3 text-center'>Exercises</p>
                    </div>

                    <List
                        height={410}
                        width={'100%'}
                        itemCount={workoutItems.length}
                        itemSize={40}
                        layout="vertical"
                        
                    >
                        {WorkoutsRenderer}
                    </List>
                </div>
            </div>
        </div>
    )
}

export default Workouts
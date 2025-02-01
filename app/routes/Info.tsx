
import type { Workout } from 'interfaces';
import React, { useEffect, useState } from 'react'
import { getWorkouts } from '~/use/useGetUserInfo';

const Info = () => {

    const [workouts, setWorkouts] = useState<Workout[]>([]);

    useEffect(() => {

        const fetchWorkouts = async () => {
            await getWorkouts().then((workouts) => {
                setWorkouts(workouts)
                console.log('workouts set successfully')
            })
        }

        fetchWorkouts();

    }, [])

    return (
        <div>
            <div className='flex flex-col gap-y-3 text-xl text-white font-bold'>

                <p className='text-center'>Info</p>

            </div>
        </div>
    )
}

export default Info
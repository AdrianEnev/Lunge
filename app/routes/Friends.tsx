import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { FixedSizeList as List } from 'react-window'
import { timestampToDate } from '~/use/useTimestampToDate';

const Friends = () => {

    const [friends, setFriends] = useState<any[]>([])
    const friendItems = [...friends];
    const navigate = useNavigate();

    useEffect(() => {
        const friendsLS = localStorage.getItem("friends");

        if (friendsLS) {
            setFriends(JSON.parse(friendsLS));
        }
    }, [])

    const FriendElement = ({friend, navigate}: any) => {

        //const friendDate = timestampToDate(friend.created)
    
        return (
            <button
                className={`w-full h-10 text-gray-600 border-y border-gray-100 px-3 
                flex flex-row items-center
                hover:opacity-50 hover:bg-gray-100`}
                onClick={() => {
                    //navigate(`/friends/${friend.id}`)
                }}
            >
    
                <p className='text-base w-1/3'>
                    {friend.username}
                </p>
                <p className='text-base w-1/3'>
                    -
                </p>
                <p className='text-base w-1/3'>
                    -
                </p>

            </button>
        )
    }

    const FriendsRenderer = ({ index, style }: { index: number, style: React.CSSProperties }) => {

        /*const sortedFriendItems = friends.sort((a, b): any => {

            if (a.created && b.created) {
                const dateA = new Date(a.created.seconds * 1000)
                const dateB = new Date(b.created.seconds * 1000)
                return dateB.getTime() - dateA.getTime()
            }
        })

        const item = sortedFriendItems[index] || friends[index]*/

        const item = friends[index]

        return (
            <div style={style}>
                <FriendElement key={item.id} {...item} friend={item} navigate={navigate} />
            </div>
        )
    }

    return (
        <div className="w-full h-full font-rubik p-5"> 
                
            <p className="text-3xl text-black mt-5 font-semibold">
                Friends
            </p>
            <div className='w-full h-[2px] bg-gray-100 rounded-full mt-2'></div>

            <div className='w-full h-1/2 border border-gray-200 rounded-md mt-4'>

                <div className={`flex flex-row justify-center gap-x-4 px-1 mt-2 mb-2 font-sans font-semibold`}>
                    <p className='w-1/3 text-center text-lg mr-[-24px]'>Username</p>
                    <p className='w-1/3 text-center text-lg'>Friend Since</p>
                    <p className='w-1/3 text-center text-lg ml-[-24px]'>Workouts completed</p>
                </div>

                <List
                    height={410}
                    width={'100%'}
                    itemCount={friendItems.length}
                    itemSize={40}
                    layout="vertical"
                    
                >
                    {FriendsRenderer}
                </List>
            </div>

        </div>
    )
}

export default Friends
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { FixedSizeList as List } from 'react-window'

const Statistics = () => {

    const [statistics, setStatistics] = useState<any[]>([]);
    const statisticItems = [...statistics];
    const {t} = useTranslation();

    useEffect(() => {
        const statisticsLS = localStorage.getItem("statistics");

        if (statisticsLS) {
            setStatistics(JSON.parse(statisticsLS));
        }
    }, []);

    const StatisticsElement = ({statistic, navigate}: any) => {

        //const friendDate = timestampToDate(friend.created)
    
        return (
            <button
                className={`w-full h-10 text-gray-600 border-y border-gray-100 px-3 
                flex flex-row items-center
                hover:opacity-50 hover:bg-gray-100`}
                onClick={() => {
                    //navigate(`/statistics/${friend.id}`)
                }}
            >
    
                <p className='text-base w-1/2'>
                    {statistic.id === 'finishedWorkouts' ? t('workouts-completed') : t('total-weight-lifted')}
                </p>
                <p className='text-base w-1/2'>
                    {statistic.value} {statistic.id === 'weightLifted' ? 'kg' : ''}
                </p>

            </button>
        )
    }

    const StatisticsRenderer = ({ index, style }: { index: number, style: React.CSSProperties }) => {

        /*const sortedstatisticItems = statistics.sort((a, b): any => {

            if (a.created && b.created) {
                const dateA = new Date(a.created.seconds * 1000)
                const dateB = new Date(b.created.seconds * 1000)
                return dateB.getTime() - dateA.getTime()
            }
        })

        const item = sortedstatisticItems[index] || statistics[index]*/

        const item = statistics[index]

        return (
            <div style={style}>
                <StatisticsElement key={item.id} statistic={item} />
            </div>
        );
    }


    return (
        <div className="w-full h-full font-rubik p-5"> 
                
            <p className="text-3xl text-black mt-5 font-semibold">
                {t('statistics')}
            </p>
            <div className='w-full h-[2px] bg-gray-100 rounded-full mt-2'></div>

            <div className='w-full h-1/2 border border-gray-200 rounded-md mt-4'>

                <div className={`flex flex-row justify-center gap-x-4 px-1 mt-2 mb-2 font-sans font-semibold`}>
                    <p className='w-1/2 text-center text-lg mr-[-24px]'>{t('statistics')}</p>
                    <p className='w-1/2 text-center text-lg'>{t('values')}</p>
                </div>

                <List
                    height={410}
                    width={'100%'}
                    itemCount={statisticItems.length}
                    itemSize={40}
                    layout="vertical"
                >
                    {StatisticsRenderer}
                </List>
            </div>


        </div>
    )
}

export default Statistics
import React from 'react'

const HomeAuthenticated = ({username}: any) => {
    return (
        <div className="w-full h-full font-rubik p-5"> 

            <div className="flex flex-col">
                
                <p className="text-3xl text-black mt-5 font-semibold">
                    Welcome back, {username}!
                </p>

                <p className="text-3xl text-black mt-5 font-base">
                    All account information will be displayed here.
                </p>  
            </div>
        
        </div>
    )
}

export default HomeAuthenticated
import React from 'react'

const HomeUnauthenticated = ({username}: any) => {
    return (
        <div className="w-full h-full font-rubik flex justify-center pt-5"> 

            <div className="flex flex-col">
                
                <p className="text-3xl text-black mt-5 font-semibold text-center">
                    Welcome!
                </p>

                <p className="text-3xl text-black mt-5 font-base">
                    Please log in!
                </p>  
            </div>
    
        </div>
    )
}

export default HomeUnauthenticated
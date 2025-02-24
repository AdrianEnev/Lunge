import React, { useState } from 'react'

const Contact = () => {

    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')

    const sendMessage = async () => {
        console.log(email);
        console.log(message);
    }

    return (
        <div className="w-full h-full font-rubik"> 

            <div className="flex flex-col items-center justify-center mt-[5%]">
                
                <div className="w-[40%] h-98 bg-white rounded-xl shadow-md border border-gray-100 px-14 py-12">
                                
                    <div className="flex flex-col">
                        <p className="text-2xl text-gray-800 font-medium">Contact Info</p>
                    </div>

                    <div className='flex w-full h-full flex-col mt-3'>
                        
                        <p className='text-xl text-gray-600 my-2'>Email</p>
                        <input
                            type="text"
                            placeholder="example@gmail.com"
                            className='border border-gray-300 p-2 rounded-md'
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                        />
                        
                        <p className='text-xl text-gray-600 my-2'>Message</p>
                        <textarea
                            placeholder="Message"
                            className='border border-gray-300 p-2 rounded-md h-32'
                            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(event.target.value)}
                        />

                        <button className='w-full h-12 bg-red-400 mt-3 rounded-xl active:opacity-60'
                            onClick={() => sendMessage()}
                        >
                            <p className='text-xl font-medium text-white'>Send</p>
                        </button>

                    </div>

                </div>

            </div>
            
        </div>
    )
}

export default Contact
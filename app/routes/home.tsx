import { useContext, useEffect, useState } from "react";
import type { Route } from "./+types/Home";
import { GlobalContext } from "~/GlobalContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Lunge" },
    { name: "description", content: "Lunge: Fitness Tracker" },
  ];
}

export default function Home() {

    //const user = JSON.parse(localStorage.getItem("user") || '{}');

    const [username, setUsername] = useState('User');

    useEffect(() => {   

        setUsername(localStorage.getItem("username") || 'User');

    }, [])

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
    );
}

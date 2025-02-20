import { useContext, useEffect, useState } from "react";
import type { Route } from "./+types/Home";
import { GlobalContext } from "~/GlobalContext";
import { FIREBASE_AUTH } from "firebaseConfig";
import HomeAuthenticated from "./Home/HomeAuthenticated";
import HomeUnauthenticated from "./Home/HomeUnauthenticated";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Lunge" },
        { name: "description", content: "Lunge: Fitness Tracker" },
    ];
}

export default function Home() {

    const [username, setUsername] = useState('User');
    const [isAuthenticated, setIsAuthenticated] = useState(FIREBASE_AUTH.currentUser ? true : false);

    useEffect(() => {   
        setUsername(localStorage.getItem("username") || 'User');
    }, [])

    return (
        <>
            {isAuthenticated ? (
                <HomeAuthenticated username={username}/>
            ) 
                :
            (
                <HomeUnauthenticated />
            )
            }
        </>
    );
}

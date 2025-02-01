import { useEffect, useContext, useState } from "react";
import { FIREBASE_AUTH } from "../../firebaseConfig";
//import { onAuthStateChanged } from "firebase/auth";
import React from "react";

const AuthContext = React.createContext({
    currentUser: null,
    userLoggedIn: false,
    loading: true
});

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {

    const [currentUser, setCurrentUser] = useState(null);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = FIREBASE_AUTH.onAuthStateChanged(user => {

            if (user) {
                setCurrentUser({ ...user });
                setUserLoggedIn(true);
                setLoading(false);
            }else{
                setCurrentUser(null);
                setUserLoggedIn(false);
            }
            setLoading(false);

        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userLoggedIn,
        loading
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
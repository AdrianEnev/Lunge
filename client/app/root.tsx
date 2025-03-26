import {
isRouteErrorResponse,
Links,
Meta,
Outlet,
Scripts,
ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import stylesheet from "./app.css?url";
//import i18n from "i18next-config";
import '../i18next-config';

import { useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "firebaseConfig";
import SidebarAuthenticated from "./components/SidebarAuthenticated";
import HeaderUnauthenticated from "./components/HeaderUnauthenticated";
import { GlobalContext, GlobalProvider } from "./GlobalContext";
import { initReactI18next } from "react-i18next";

export const links: Route.LinksFunction = () => [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
    },
    {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
    },
    { rel: "stylesheet", href: stylesheet },
];

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body>
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

function AppContent() {

    const [testBackendData, setTestBackEndData] = useState([{}]);
    
    useEffect(() => {
        fetch("/api")
            .then((res) => res.json()) // Return the parsed JSON
            .then((data) => {
                setTestBackEndData(data); // Update state with the fetched data
            })
            .catch((error) => {
                console.error("Error fetching data:", error); // Handle errors
            });
    }, []);

    const { loading, setLoading } = useContext(GlobalContext) || { loading: false, setLoading: () => {} };
    const [isAuthenticated, setIsAuthenticated] = useState(FIREBASE_AUTH.currentUser ? true : false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {

            if (user) {
                console.log('user is logged in');
                setIsAuthenticated(true);
            } else {
                console.log("No user is logged in");
                setIsAuthenticated(false);
            }
            
            setLoading(false)
        });
    
        return () => unsubscribe(); // Clean up the listener
    }, []);

    // Handle loading while navigating between pages
    useEffect(() => {
        const handleNavigationStart = () => {
            setLoading(true);
        };

        const handleNavigationEnd = () => {
            setLoading(false);
        };

        window.addEventListener("beforeunload", handleNavigationStart);
        window.addEventListener("load", handleNavigationEnd);

        return () => {
            window.removeEventListener("beforeunload", handleNavigationStart);
            window.removeEventListener("load", handleNavigationEnd);
        };
    }, []);

    if (loading) {
        return <div>
            <p className="text-3xl font-medium text-center mt-12">Loading...</p>
        </div>;
    }

    return (
        <div className="w-full h-full">

            {!isAuthenticated && (
                <HeaderUnauthenticated />
            )}

            <div className="flex flex-row w-full h-full">

                <div className={`${isAuthenticated ? "min-w-[14%]" : "w-0"} h-full`}>
                    {isAuthenticated ? (
                        <SidebarAuthenticated />
                    ) : (
                        null
                    )}
                </div>

                <div className={`h-full ${isAuthenticated ? "w-[86%]" : "w-[95%]"} pl-8`}>
                    <main className="w-full h-full">
                        <Outlet /> {/* The content of each route will be rendered here */}
                    </main>
                </div>
            </div>
        </div>
    );
}

export default function App() {
    return (
        <GlobalProvider>
            <AppContent />
        </GlobalProvider>
    );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    let message = "Oops!";
    let details = "An unexpected error occurred.";
    let stack: string | undefined;

    if (isRouteErrorResponse(error)) {
        message = error.status === 404 ? "404" : "Error";
        details =
        error.status === 404
            ? "The requested page could not be found."
            : error.statusText || details;
    } else if (import.meta.env.DEV && error && error instanceof Error) {
        details = error.message;
        stack = error.stack;
    }

    return (
        <main className="pt-16 p-4 container mx-auto">
        <h1>{message}</h1>
        <p>{details}</p>
        {stack && (
            <pre className="w-full p-4 overflow-x-auto">
            <code>{stack}</code>
            </pre>
        )}
        </main>
    );
}
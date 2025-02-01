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

import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "firebaseConfig";
import SidebarAuthenticated from "./components/SidebarAuthenticated";
import HeaderUnauthenticated from "./components/HeaderUnauthenticated";

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

export default function App() {

    // always set to false for now
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(FIREBASE_AUTH.currentUser ? true : false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {

            if (user) {
                console.log('user is logged in');
                setIsAuthenticated(true);
                setLoading(false);
            } else {
                console.log("No user is logged in");
                setIsAuthenticated(false);
                setLoading(false);
            }

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
        return <div></div>;
    }

    return (
            <div className="w-full h-full">

                <div className="flex flex-row w-full h-full">
                    
                    {isAuthenticated ? (
                        <SidebarAuthenticated />
                    ) : (
                        <HeaderUnauthenticated />
                    )}
                    
                    <div className="h-full w-[86%] pl-8">
                        <main className="">
                            <Outlet /> {/* The content of each route will be rendered here */}
                        </main>
                    </div>

                </div>
                
            </div>
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

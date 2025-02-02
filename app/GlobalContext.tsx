import React, { createContext, useState, type ReactNode } from 'react';

// Define the shape of the context state
interface GlobalContextProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

// Create a default value for the context
export const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

// Create the provider component
interface GlobalProviderProps {
    children: ReactNode; // Define children prop type as ReactNode to support all valid JSX children
}

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
    const [loading, setLoading] = useState<boolean>(true);

    // Return the provider with the correct value type
    return (
        <GlobalContext.Provider value={{ loading, setLoading }}>
            {children}
        </GlobalContext.Provider>
    );
};

import { createContext, useState } from "react"

export const UserContext = createContext({});

export const UserProvider = ({children} : any) => {
    const [me, setMe] = useState({} as any);

    return (
        <UserContext.Provider value={
            {me, setMe}
        }>
            {children}
        </UserContext.Provider>
    )
}
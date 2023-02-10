import { createContext, useState } from "react"

export const UserContext = createContext({});

export const UserProvider = ({children} : any) => {
    const [user, setUser] = useState({} as any);

    return (
        <UserContext.Provider value={
            {user, setUser}
        }>
            {children}
        </UserContext.Provider>
    )
}
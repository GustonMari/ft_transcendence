import React from "react";
import { createContext, useState } from "react";

export const ProfilePopUpContext = createContext({});

export const ProfilePopUpProvider = ({children}: any) => {
    const [show, setShow] = useState(false);
    const [user, setUser] = useState({} as any);

    return (        
        <ProfilePopUpContext.Provider value={{show, setShow, user, setUser}}>
            {children}
        </ProfilePopUpContext.Provider>
    )
}

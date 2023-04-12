import React from "react";
import { createContext, useState } from "react";
import { ProfileComponent } from "../components/users/ProfileComponent";

export const ProfilePopUpContext = createContext({});

export const ProfilePopUpProvider = ({children}: any) => {
    const [show, setShow] = useState(false);
    const [user, setUser] = useState({} as any);

    return (        
        <ProfilePopUpContext.Provider value={{show, setShow, user, setUser}}>
            {children}
            {show && <ProfileComponent/>}
        </ProfilePopUpContext.Provider>
    )
}


import React from "react";
import { createContext, useState } from "react";
import { ProfileComponent } from "../components/users/ProfileComponent";

export const ProfilePopUpContext = createContext({});

export const ProfilePopUpProvider = ({children}: any) => {
    // const [show, setShow] = useState(false);
    const [popUpID, setPopUpID] = useState<number | undefined>(undefined);

    return (        
        <ProfilePopUpContext.Provider value={{popUpID, setPopUpID}}>
            {children}
            {popUpID && <ProfileComponent/>}
        </ProfilePopUpContext.Provider>
    )
}


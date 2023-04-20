import React from "react";
import { createContext, useState } from "react";
import { ProfileComponent } from "../components/users/ProfileComponent";
import { PopUpHistory } from "../components/history/PopUpHistory";

export const ProfilePopUpContext = createContext({});

export const ProfilePopUpProvider = ({children}: any) => {
    // const [show, setShow] = useState(false);
    const [popUpID, setPopUpID] = useState<number | undefined>(undefined);
    
    const [history, setHistory] = useState<number | undefined>(undefined)

    return (        
        <ProfilePopUpContext.Provider value={{popUpID, setPopUpID}}>
            {children}

            { history &&
                <PopUpHistory
                    show={history !== undefined}
                    id={history ? history : 0}
                    onClose={() => {setHistory(undefined)}}
                />
            }
            {popUpID && history === undefined && <ProfileComponent setHistory={setHistory}/>}
        </ProfilePopUpContext.Provider>
    )
}


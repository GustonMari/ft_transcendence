import React from "react";
import { createContext, useState } from "react";
import s from "../styles/context/Alert.module.css"

export const AlertContext = createContext({});

export const AlertProvider = ({children}: any) => {
    const [show, setShow] = useState(false);
    const [color, setColor] = useState(true); // true = green, false = red
    const [msg, setMsg] = useState("");

    function handleError (msg: string) {
        setMsg(msg);
        setShow(true);
        setColor(false);
         setTimeout(() => {
            setShow(false);
        }, 2000);
    }

    function handleSuccess (msg: string) {
        setMsg(msg);
        setShow(true);
        setColor(true);
        setTimeout(() => {
            setShow(false);
        }, 5000);
    }

    return (        
        <AlertContext.Provider value={{handleError, handleSuccess}}>
            {show &&
                <div
                    className={s.error_pop_up}
                    style={{backgroundColor: color ? "#498024" : "#da4848"}}
                    >
                    <p>{msg}</p>
                </div>
            }
            {children}
        </AlertContext.Provider>
    )
}

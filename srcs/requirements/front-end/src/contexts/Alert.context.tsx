import { createContext, useState } from "react";
import { RxCross2 } from "react-icons/rx";

export const AlertContext = createContext({});

export const AlertProvider = ({children}: any) => {
    const [show, setShow] = useState<boolean>(false);
    const [color, setColor] = useState<boolean>(true); // true = green, false = red
    const [msg, setMsg] = useState<string>("");

    function handleError (msg: string) {
        setMsg(msg);
        setShow(true);
        setColor(false);
        setTimeout(() => {
            setShow(false);
        }, 5000);
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
                    className={
                    (color ? `bg-green-500` : `bg-red-500`) + 
                    `
                    absolute
                    z-10
                    top-10
                    left-1/2
                    transform
                    -translate-x-1/2
                    
                    max-w-md
                    max-h-md
                    rounded-md
                    pt-3                             
                    flex
                    flex-row
                    

                    transition
                    duration-500
                    ease-in-out
                    `}
                >
                    <p
                        className="
                        p-2
                        mr-12
                        ml-4
                        text-gray-900
                        text-center
                        "
                    >{msg}</p>
                    <div
                        className="
                        absolute
                        top-3
                        right-3
                        w-[30px]
                        h-[30px]
                        p-0.5
                        cursor-pointer
                        hover:bg-green-800
                        rounded-md
                        "
                        onClick={() => setShow(false)}
                    >
                       <RxCross2
                            className="
                            w-full
                            h-full
                            "
                            color="#111827"
                       /> 
                    </div>
                </div>
            }
            {children}
        </AlertContext.Provider>
    )
}

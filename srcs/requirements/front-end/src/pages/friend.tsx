import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react"
import API from "../network/api"
import { NavBar } from "../components/communs/NavBar"
import { FriendList } from "../components/relations/FriendList"
import { RequestList } from "../components/relations/RequestList"
import { ProfileComponent } from "../components/users/ProfileComponent"
import { ProfilePopUpContext } from "../contexts/ProfilePopUp.context"
import g from "../styles/background.module.css"


export const Friends = ({user}: any) => {

    // const friends = useRef<any[]>([]);
    const [friends, setFriends] = useState<any[]>([]);

    // const pending = useRef<any[]>([]);
    const [pending, setPending] = useState<any[]>([]);

    const {show} : any = useContext(ProfilePopUpContext);

    const [popUser, setPopUser] = useState({} as any);

    const [list, setList] = useState(0);

    useLayoutEffect(() => {
        API.getFriends((data: any) => {
            // friends.current = data;
            setFriends(data);
            // console.log("data", friends.current);
        }, (err: any) => {
            console.log(err);
        });

        API.getIncomingRequest((data: any) => {
            // pending.current = data;
            setPending(data);
            // console.log("request data -> ", data, " request array -> ", pending.current);
        }, (err: any) => {
            console.log(err);
        });


    }, []);
    

    return (
        <>
        <div className={g.bg}>
            <div className="absolute flex flex-row">
                <div className="relative w-auto ml-20">
                    <div className="flex flex-row gap-4 mx-10 mt-10">
                        <button type="button" className="focus:outline-none text-white bg-blue-400 hover:bg-blue-500 focus:bg-blue-900 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:focus:ring-blue-900"
                            onClick={() => setList(0)}>Friends</button>
                        <button type="button" className="focus:outline-none text-white bg-blue-400 hover:bg-blue-500 focus:bg-blue-900 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:focus:ring-blue-900"
                            onClick={() => setList(1)}>Incoming Requests</button>
                        <button type="button" className="focus:outline-none text-white bg-blue-400 hover:bg-blue-500 focus:bg-blue-900 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:focus:ring-blue-900"
                            onClick={() => setList(2)}>Outgoing Requests</button>
                    </div>
                    {
                        ((list === 0) ? 
                            <FriendList relations={friends}/>
                        : ((list === 1) ? 
                            <RequestList relations={pending}/>
                        :
                            <RequestList relations={pending}/>
                        ))
                    }
                    
                </div>
                <div className="relative w-auto">
                    <NavBar/>
                </div>
            </div>
            <div className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                {show ? <ProfileComponent/> : ""}
            </div>
        </div>
        </>
    )
}
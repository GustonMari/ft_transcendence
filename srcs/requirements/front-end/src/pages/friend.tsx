import React, { useLayoutEffect, useState } from "react"
import API from "../api/api"
import { NavBar } from "../components/NavBar"
import { FriendList } from "../components/relations/FriendList"
import { RequestList } from "../components/relations/RequestList"
import { ProfileComponent } from "../components/user/ProfileComponent"
import g from "../styles/background.module.css"


export const Friends = (props: any) => {

    const [friends, setFriends] = useState([]);
    const [pending, setPending] = useState([]);

    const [ pop, setPop ] = useState(false);
    const [popUser, setPopUser] = useState({} as any);

    const [list, setList] = useState(0);

    useLayoutEffect(() => {
        API.getFriends((data: any) => {
            setFriends(data);
            console.log(data);
        }, (err: any) => {
            console.log(err);
        });

        API.getIncomingRequest((data: any) => {
            setPending(data);
            console.log("data", data);
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
                            onClick={
                                () => {
                                    setList(0);
                                }
                            }>Friends</button>
                        <button type="button" className="focus:outline-none text-white bg-blue-400 hover:bg-blue-500 focus:bg-blue-900 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:focus:ring-blue-900"
                            onClick={
                                () => {
                                    setList(1);
                                }
                            }>Incoming Requests</button>
                        <button type="button" className="focus:outline-none text-white bg-blue-400 hover:bg-blue-500 focus:bg-blue-900 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:focus:ring-blue-900"
                            onClick={
                                () => {
                                    setList(2);
                                }
                            }>Outgoing Requests</button>
                    </div>
                    {
                        ((list === 0) ? 
                            <FriendList relations={friends} onShow={(e: any) => {
                                setPop(true);
                                setPopUser(e);
                            }}
                            />
                        : ((list === 1) ? 
                            <RequestList relations={pending}/>
                        :
                            <RequestList relations={pending}/>
                        ))
                    }
                    
                </div>
                <div className="relative w-auto">
                    <NavBar />
                    {/* <FriendList></FriendList> */}
                </div>
            </div>
            <div className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                {pop ? <ProfileComponent offShow={
                    () => {
                        setPop(false);
                    }
                }
                user={popUser}
                /> : ""}
            </div>
        </div>
        </>
    )
}
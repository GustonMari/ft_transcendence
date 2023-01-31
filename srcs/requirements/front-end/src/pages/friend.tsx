import React, { useLayoutEffect, useState } from "react"
import API from "../api/api"
import { NavBar } from "../components/NavBar"
import { FriendList } from "../components/relations/FriendList"
import { RequestList } from "../components/relations/RequestList"


export const Friends = (props: any) => {

    const [friends, setFriends] = useState([]);
    const [pending, setPending] = useState([]);

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
        <div className="absolute flex flex-row">
            <div className="relative w-auto">
                <FriendList relations={friends}/>
                <RequestList relations={pending}/>
            </div>
            <div className="relative w-auto">
                <NavBar />
                {/* <FriendList></FriendList> */}
            </div>
        </div>
        </>
    )
}
import React from "react"
import { NavBar } from "../components/NavBar"
import { FriendList } from "../components/relations/FriendList"
import { RequestList } from "../components/relations/RequestList"


export const Friends = (props: any) => {

    return (
        <>
        <div className="absolute flex flex-row">
            <div className="relative w-auto">
                <RequestList/>
            </div>
            <div className="relative w-auto">
                <NavBar />
                {/* <FriendList></FriendList> */}
            </div>
        </div>
        </>
    )
}
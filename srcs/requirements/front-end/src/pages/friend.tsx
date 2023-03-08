import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react"
import API from "../network/api"
import s from "../styles/pages/friend.module.css"
import { ButtonChangeList } from "../components/relations/ButtonChangeList"
import { RelationList } from "../components/relations/RelationList"
import { FriendElement } from "../components/relations/FriendElement"
import { AlertContext } from "../contexts/Alert.context"
import { FriendList } from "../components/relations/FriendList"


export const Friends = ({user}: any) => {

    const [friends, setFriends] = useState<any[]>([]);
    const [incomming, setIncomming] = useState<any[]>([]);
    const [outgoing, setOutgoing] = useState<any[]>([]);
    const [list, setList] = useState<number>(1);

    const {handleError} = useContext<any>(AlertContext);

    useLayoutEffect(
        () => {
			API.getFriends(
                (d: any) => {
                    setFriends(d);
                }, () => {
                    handleError("Error while fetching friends");
                }
            )
            API.getIncomingRequest(
                (d: any) => {
                    setIncomming(d);
                }, () => {
                    handleError("Error while fetching incomming friends");
                }
            )
            API.getOutgoinRequest(
                (d: any) => {
                    setOutgoing(d);
                }, () => {
                    handleError("Error while fetching outgoing friends");
                }
            )
        }, []
    )


    return (
        <>
            <div className={s.container}>
                <div className={s.btn_lists}>
                    <ButtonChangeList title="Friend" setList={setList} listNumber={1}/>
                    <ButtonChangeList title="Incomming" setList={setList} listNumber={2}/>
                    <ButtonChangeList title="Outgoing" setList={setList} listNumber={3}/>
                </div>
                <div className={s.lists}>
                    {/* {list === 1 && <RelationList className={s.list} relations={friends} setRelation={setFriends} cpnt={FriendElement}/>} */}
                    {list === 1 && <FriendList relations={friends}/>}
                    {list === 2 && <RelationList className={s.list} relations={incomming} setRelation={setIncomming} cpnt={FriendElement}/>}
                    {list === 3 && <RelationList className={s.list} relations={outgoing} setRelation={setOutgoing} cpnt={FriendElement}/>}
                </div>
            </div>
        </>
    ) 
}
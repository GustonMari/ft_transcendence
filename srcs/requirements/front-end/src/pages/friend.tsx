import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react"
import API from "../network/api"
import { NavBar } from "../components/communs/NavBar"
import { FriendList } from "../components/relations/FriendList"
import s from "../styles/pages/friend.module.css"
import { ButtonChangeList } from "../components/relations/ButtonChangeList"
import { RelationList } from "../components/relations/RelationList"


export const Friends = ({user}: any) => {

    const [friends, setFriends] = useState<any[]>([]);
    const [incomming, setIncomming] = useState<any[]>([]);
    const [outgoing, setOutgoing] = useState<any[]>([]);
    const [list, setList] = useState<number>(1);

    useEffect(
        () => {

        },
        [friends, incomming, outgoing]
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
                    {list === 1 && <RelationList className={s.list} relations={friends} changeRelation={setFriends}/>}
                    {list === 2 && <RelationList className={s.list} relations={incomming} changeRelation={setIncomming}/>}
                    {list === 3 && <RelationList className={s.list} relations={outgoing} changeRelation={setOutgoing}/>}
                </div>
            </div>
        </>
    ) 
}
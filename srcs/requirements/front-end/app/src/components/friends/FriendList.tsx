import { useLayoutEffect, useState } from "react";
import API from "../../api/api";
import {List} from "../list/List";
import { FriendElem } from "./FriendElem";
import { RequestElem } from "./RequestElem";

export default function FriendList() {

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
      <div className="all_list">
        <List relations={friends} title="friend" comp={FriendElem}/>
        <List relations={pending} title="pending" comp={RequestElem}/>
        {/* <List relations={pending} title="pending"/> */}
      </div>
    </>
  );
}

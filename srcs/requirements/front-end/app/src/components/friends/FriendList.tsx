import { useLayoutEffect, useState } from "react";
import API from "../../api/api";

export default function FriendList() {

    const [friends, setFriends] = useState([]);

    useLayoutEffect(() => {
        API.getFriends((data: any) => {
            setFriends(data);
            console.log(data);
        }, (err: any) => {
            console.log(err);
        });
    }, []);

  return (
    <>
      <div className="all_list">
        <h2>Friends</h2>
        <div className="list">
            {
                friends.map((friend: any) => {
                    return (
                        <div key={friend.id} className="friend">
                            <div className="friend_name">{friend.user.login}</div>
                            <div className="friend_status">{friend.user.status}</div>
                        </div>
                    );
                })
            }
        </div>
      </div>
    </>
  );
}

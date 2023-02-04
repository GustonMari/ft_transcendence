import { MdArchitecture } from "react-icons/md";

export const FriendElem = (props: any) => {
  return (
    <>
      <div className="container">
        <li className="friend">
          <div className="friend_name">
            <h2 className="text_friend_name">{props.login}</h2>
          </div>
          <div className="friend_activity">
            <input type="checkbox" defaultChecked={props.state}></input>
          </div>
        </li>
      </div>
    </>
  );
};
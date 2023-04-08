import { useContext } from "react";
import { BsXLg } from "react-icons/bs";
import { FiSend } from "react-icons/fi";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { ProfilePopUpContext } from "../../contexts/ProfilePopUp.context";
import s from "../../styles/profile/ProfileComponent.module.css";
import API from "../../network/api";
import { AlertContext } from "../../contexts/Alert.context";
import { UserContext } from "../../contexts/User.context";

export const ProfileComponent = () => {

    const {user, setShow} : any = useContext(ProfilePopUpContext);
    const {handleError, handleSuccess} : any = useContext(AlertContext);
    const {me} : any = useContext(UserContext);

    const handleSendFriendRequest = () => {
        API.sendFriendRequest(user.id,
            () => {
                handleSuccess("Friend request sent successfully.")
            }, (err: any) => {
                handleError(err.message)
            }
        )
    }

  return (
    <>
        <div className={s.container}>
            <div className={s.pop_up}>
                <a className={s.close_button} onClick={() => setShow(false)} title="Close the window">
                    <BsXLg/>
                </a>  
                <div className={s.action_buttons}>
                    <a className={s.send_message} title="Send message to this person">
                        <FiSend/>
                    </a>
                    <a className={s.friend_request} title="Send friend request to this person"  onClick={() => handleSendFriendRequest()}>
                        <AiOutlineUsergroupAdd/>
                    </a>
                </div>
                <div className={s.picture_section}>
                    <img src={user.avatar_url}></img>
                </div>
                <div className={s.name_section}>
                    <h1>{user.login?.substring(0, 25)}</h1>
                    <h2>{user.first_name?.substring(0, 25)} {user.last_name?.substring(0, 25)}</h2>
                    <div className={s.stats}>
                        <div className={s.stats_wins}>
                            <h3>Wins</h3>
                            <h3>{user.wins}</h3>
                        </div>
                        <div className={s.stats_losses}>
                            <h3>Losses</h3>
                            <h3>{user.loses}</h3>
                        </div>
                    </div>
                    <div className={s.separator}></div>
                    <div className={s.bio_section}>
                        <p>{
                            user.description ? user.description?.substring(0, 250) : "No description"}</p>
                    </div>
                </div>
            </div>
        </div>
    </>
  );
};

import { useContext, useEffect, useState } from "react";
import { BsXLg } from "react-icons/bs";
import { FiSend } from "react-icons/fi";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { ProfilePopUpContext } from "../../contexts/ProfilePopUp.context";
import s from "../../styles/profile/ProfileComponent.module.css";
import API from "../../network/api";
import { AlertContext } from "../../contexts/Alert.context";
import { UserContext } from "../../contexts/User.context";
import { IoLogoGameControllerA } from "react-icons/io";

export const ProfileComponent = () => {

    const {popUpID, setPopUpID} : any = useContext(ProfilePopUpContext);
    const {handleError, handleSuccess} : any = useContext(AlertContext);
    const {me}: any = useContext(UserContext)

    const [user, setUser] = useState<any | undefined>(undefined)

    const handleSendFriendRequest = () => {
        API.sendFriendRequest(user.id,
            () => {
                handleSuccess("Friend request sent successfully.")
            }, (err: any) => {
                handleError(err.message)
            }
        )
    }

    const handleLaunchGame = () => {
        // TODO: launch game
    }

    useEffect(() => {
        API.getUser(
            popUpID,
            (u: any) => {
                setUser(u)
            }, (err: any) => {
                handleError(err.message)
            })
    }, [popUpID])

  return (
    <>
        {/*{console.log(me.id)}*/}
        <div className={s.container}>
            <div className={s.pop_up}>
                { user && me && <>
                    <a className={s.close_button} onClick={() => setPopUpID(undefined)} title="Close the window">
                        <BsXLg/>
                    </a>
                    {me?.login !== user?.login &&
                        <div className={s.action_buttons}>
                            <a className={s.send_message} title="Send message to this person">
                                <FiSend/>
                            </a>
                            <a className={s.friend_request} title="Send friend request to this person"  onClick={() => handleSendFriendRequest()}>
                                <AiOutlineUsergroupAdd/>
                            </a>
                            <a className={s.friend_request} title="Send request to play"  onClick={() => handleLaunchGame()}>
                                <IoLogoGameControllerA/>
                            </a>
                        </div>
                    }
                    <div className={s.picture_section}>
                        <img src={"http://localhost:3000/api/public/picture/" + user.login}></img>
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
                </>}
            </div>
        </div>
    </>
  );
};

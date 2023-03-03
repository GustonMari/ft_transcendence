import { useContext } from "react";
import { BsXLg } from "react-icons/bs";
import { FiSend } from "react-icons/fi";
import { IoPeopleOutline } from "react-icons/io5";
import { ProfilePopUpContext } from "../../contexts/ProfilePopUp.context";
import s from "../../styles/profile/ProfileComponent.module.css";

export const ProfileComponent = () => {

    const {user, setShow} : any = useContext(ProfilePopUpContext);

  return (
    <>
        {console.log(user)}
        <div className={s.container}>
            <div className={s.pop_up}>
                <a className={s.close_button} onClick={() => setShow(false)} title="Close the window">
                    <BsXLg/>
                </a>
                <div className={s.action_buttons}>
                    <a className={s.send_message} title="Send message to this person">
                        <FiSend/>
                    </a>
                    <a className={s.friend_request} title="Send friend request to this person">
                        <IoPeopleOutline/>
                    </a>
                </div>
                <div className={s.picture_section}>
                    <img src="https://placehold.co/150x150"></img>
                </div>
                <div className={s.name_section}>
                    <h1>{user.login.substring(0, 25)}</h1>
                    <h2>{user.first_name.substring(0, 25)} {user.last_name.substring(0, 25)}</h2>
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
                        <p>{user.description.substring(0, 250)}</p>
                    </div>
                </div>
            </div>
        </div>
    </>
  );
};

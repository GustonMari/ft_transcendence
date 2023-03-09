import s from '../../styles/relations/FriendElement.module.css'
import { MdOutlineRemoveCircleOutline } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { useContext } from 'react';
import { ProfilePopUpContext } from '../../contexts/ProfilePopUp.context';

export const FriendElement = ({user, removeElem} : any) => {

    const {setShow, setUser}: any = useContext(ProfilePopUpContext)

    const handleProfile = (e: any) => {
        e.preventDefault();
        setUser(user);
        setShow(true);
    } 

    const handleRemoveFriend = (e: any) => {
        e.preventDefault();
        removeElem(user.id);
    } 

    return (
        <>
            <td className={s.first_part}>
                <img className={s.profile_pic} src="https://placehold.co/150x150"></img>
                <div className={s.names}>
                    <p>{user.login}</p>
                    <p className={s.fl_names}>{(!user.first_name ? "" : user.first_name) + " " + (!user.last_name ? "" : user.last_name)}</p>
                </div>
            </td>
            <td className={s.status_wrap}>
            {
                user.state ?
                <div className={s.status_online_wrap}>
                    <span className={s.status_cercle_online}></span>
                    <span className={s.status_text_online}>Online</span>
                </div>
                :
                <div className={s.status_offline_wrap}>
                    <span className={s.status_cercle_offline}></span>
                    <span className={s.status_text_offline}>Offline</span>
                </div>
            }
            </td>
            <td className={s.description}>
                {user.description ? user.description.substring(0, 250) : "No description"}
            </td>
            <td className={s.buttons_wrap}>
                <a className={s.profile_btn} onClick={(e: any) => {handleProfile(e)}}>
                    <CgProfile className={s.icones}/>
                </a>
                <a className={s.remove_btn} onClick={(e: any) => {handleRemoveFriend(e)}}>
                    <MdOutlineRemoveCircleOutline className={s.icones}/>
                </a>
            </td>
        </>
    )
}
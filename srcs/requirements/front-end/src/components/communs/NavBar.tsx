import {useContext, useState} from "react";
import {BiGroup, BiHome, BiLogOut, BiMessage, BiSearch, BiUser,} from "react-icons/bi";
import {FaBars} from "react-icons/fa";

import s from "../../styles/nav/NavBar.module.css";
import API from "../../network/api";
import {useNavigate} from "react-router-dom";
import {UserContext} from "../../contexts/User.context";
import {ProfilePopUpContext} from "../../contexts/ProfilePopUp.context";
import {AlertContext} from "../../contexts/Alert.context";
import { IoLogoGameControllerA } from "react-icons/io";

interface ISideElem {
    icon: any;
    title: string;
    link: string;
}

const sideElems: ISideElem[] = [
    {
        icon: <IoLogoGameControllerA className={s.icons}/>,
        title: "Game",
        link: "/game"
    },
    {
        icon: <BiSearch className={s.icons}/>,
        title: "Search",
        link: "/search"
    },
    {
        icon: <BiGroup className={s.icons}/>,
        title: "Friends",
        link: "/friends"
    },
    {
        icon: <BiMessage className={s.icons}/>,
        title: "Messages",
        link: "/messages"
    },
    {
        icon: <BiUser className={s.icons}/>,
        title: "Profile",
        link: "/profile"
    },
];

export const NavBar = ({onProfile, profilePic}: any) => {

    const {me}: any = useContext(UserContext)
    const {setPopUpID}: any = useContext(ProfilePopUpContext);
    const {handleSuccess, handleError}: any = useContext(AlertContext);

    const [showSideBar, setShowSideBar] : any = useState<boolean>(false);

    const navigate = useNavigate();

    const handleSideBarChange = () => {setShowSideBar(!showSideBar)};

    const handleLogOut = () => {
        API.logOut(() => {
            handleSuccess("You have been logged out")
            navigate("/welcome");
        }, () => {
            handleError("An error occured while logging out")
        });
            
    }

    return (
        <section className={showSideBar ? s.navbar__active : s.navbar}>
            <div className={s.show}>
                <a onClick={handleSideBarChange}>
                    <FaBars className={s.show__btn}/>
                </a>
            </div>
            <nav className={s.list}>
                <ul className={s.list__item}>
                    {
                        sideElems.map((e: ISideElem, index: number) => {
                            return (
                                <li  key={index}>
                                    <a className={ showSideBar ? s.side_elem__active : s.side_elem} href={e.link}>
                                        {e.icon}
                                        { (showSideBar) &&
                                            <span className={showSideBar ? s.span__active : s.span}>{e.title}</span>
                                        }
                                    </a>
                                </li>
                            );
                        })
                    }
                    <li>
                        <a className={ showSideBar ? s.side_elem__active : s.side_elem} onClick={handleLogOut}>
                            <BiLogOut className={s.icons}/>
                            { (showSideBar) &&
                                <span className={showSideBar ? s.span__active : s.span}>Log Out</span>
                            }
                        </a>
                    </li>
                </ul>
            </nav>

            { window.innerWidth > 767 &&
                <div className={showSideBar ? s.footer__active : s.footer}>
                    <a onClick={
                        (e) => {
                            e.preventDefault();
                            setPopUpID(me.id);
                        }
                    }>
                        <img className={s.avatar} src={`http://${process.env.REACT_APP_LOCAL_IP}:3000/api/public/picture/` + me.login}/>
                        { showSideBar &&
                            <div className={showSideBar ? s.profile_info__active : s.profile_info}>
                                <p>{me.login.substring(0, 20)}</p>
                                <div className={s.match_history}>
                                    <span>W : {me.loses} | L : {me.wins}</span>
                                </div>
                            </div>
                        }
                    </a>
                </div>
            }

        </section>
    )

};
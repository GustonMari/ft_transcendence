import {useContext, useEffect, useState} from "react";
import {BiGroup, BiHome, BiLogOut, BiMessage, BiSearch, BiUser,} from "react-icons/bi";
import {FaBars} from "react-icons/fa";

import s from "../../styles/Nav/NavBar.module.css";
import sa from "../../styles/Nav/NavBar.hidden.module.css";
import API from "../../network/api";
import {useNavigate} from "react-router-dom";
import {UserContext} from "../../contexts/User.context";
import {ProfilePopUpContext} from "../../contexts/ProfilePopUp.context";
import {AlertContext} from "../../contexts/Alert.context";

interface ISideElem {
    icon: any;
    title: string;
    link: string;
}

const sideElems: ISideElem[] = [
    {
        icon: <BiHome className={s.icons}/>,
        title: "Home",
        link: "/home"
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
    {
        icon: <BiLogOut className={s.icons}/>,
        title: "Logout",
        link: "/logout"
    },
];
export const NavBar = ({onProfile, profilePic}: any) => {

    const {me}: any = useContext(UserContext)
    const {setUser, setShow}: any = useContext(ProfilePopUpContext);
    const {handleSuccess, handleError}: any = useContext(AlertContext);

    const {showSideBar, setShowSideBar} : any = useState<boolean>(false);

    const [styles, setStyles] = useState(sa as any);

    const navigate = useNavigate();

    const handleSideBarChange = () => setShowSideBar(!showSideBar);

    return (
        <>
            <section>
                <div>
                    <FaBars onClick={handleSideBarChange}/>
                </div>
                <nav>
                    <ul>
                        <li></li>
                    </ul>
                </nav>
            </section>
        </>
    )

};
    // useEffect(() => {
    //     const handleMouseMove = (event: any) => {
    //         const nav = document.getElementById('navbar');
    //         if (window.innerWidth > 767) {
    //             if (event.clientX < 80) {
    //                 setStyles(s);
    //                 nav?.focus();
    //             } else if (event.clientX > 240) {
    //                 setStyles(sa);
    //                 nav?.focus();
    //             }
    //         }
    //     };
    //     window.addEventListener("mousemove", handleMouseMove);
    //     return () => {
    //         window.removeEventListener("mousemove", handleMouseMove);
    //     };
    // }, []);
    //
    //
    // return (
    //     <>
    //         <div id="navbar" className={styles.container}>
    //             <nav className={styles.navbar}>
    //                 <ul className={styles.list}>
    //                     <li>
    //                         {window.innerWidth > 767 &&
    //                             <div>
    //                                 <div className={styles.search_icon}>
    //                                     <BiSearch className={styles.icons}/>
    //                                 </div>
    //                                 <input
    //                                     type="text"
    //                                     placeholder="Search"
    //                                     onKeyDown={(e: any) => {
    //                                         if (e.key === "Enter") {
    //                                             e.preventDefault();
    //                                             navigate("/search?user=" + e.target.value);
    //                                             window.location.reload();
    //                                         }
    //                                     }}/>
    //                             </div>
    //                         }
    //                         { window.innerWidth < 768 &&
    //                             <div>
    //                                 <a href="/search">
    //                                     <BiSearch className={styles.icons}/>
    //                                 </a>
    //                             </div>
    //
    //                         }
    //                     </li>
    //                     <li>
    //                         <a href="/home">
    //                             <BiHome className={styles.icons}/>
    //                             <span>Home</span>
    //                         </a>
    //                     </li>
    //                     <li>
    //                         <a href="/friends">
    //                             <BiGroup className={styles.icons}/>
    //                             <span>Friends</span>
    //                         </a>
    //                     </li>
    //                     <li>
    //                         <a href="/messages">
    //                             <BiMessage className={styles.icons}/>
    //                             <span>Messages</span>
    //                         </a>
    //                     </li>
    //                     <li>
    //                         <a href="/profile">
    //                             <BiUser className={styles.icons}/>
    //                             <span>My Profile</span>
    //                         </a>
    //                     </li>
    //                 </ul>
    //             </nav>
    //
    //             <div className={styles.profile_footer}>
    //                 <a onClick={
    //                     (e) => {
    //                         e.preventDefault();
    //                         setUser(me);
    //                         setShow(true);
    //                     }
    //                 }>
    //                     <div className={styles.avatar}>
    //                         <img src={"http://localhost:3000/api/public/picture/" + me.login}/>
    //                     </div>
    //                     <div className={styles.profile_info}>
    //                         <a>{me.login}</a> {/*TODO: Error here*/}
    //                         <div className={styles.match_history}>
    //                             <span>W : 5 | L : 2</span>
    //                         </div>
    //                     </div>
    //                 </a>
    //                 <a
    //                     className={styles.logout_btn}
    //                     onClick={() => {
    //                         API.logOut(() => {
    //                             handleSuccess("You have been logged out")
    //                             navigate("/signin");
    //                         }, () => {
    //                             handleError("An error occured while logging out")
    //                         });
    //                     }}
    //                 >
    //                     <BiLogOut className={styles.logout_btn_icon}/>
    //                 </a>
    //             </div>
    //         </div>
    //     </>
    // );

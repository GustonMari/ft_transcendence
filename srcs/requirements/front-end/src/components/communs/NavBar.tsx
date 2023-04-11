import { useEffect, useState, useContext } from "react";
import {
  BiGroup,
  BiUser,
  BiMessage,
  BiSearch,
  BiLogOut,
  BiHome,
} from "react-icons/bi";
import s from "../../styles/Nav/NavBar.module.css";
import sa from "../../styles/Nav/NavBar.hidden.module.css";
import API from "../../network/api";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/User.context";
import { ProfilePopUpContext } from "../../contexts/ProfilePopUp.context";
import { AlertContext } from "../../contexts/Alert.context";

export const NavBar = ({ onProfile, profilePic }: any) => {

  const {me}: any = useContext(UserContext)
  const {setUser, setShow} : any = useContext(ProfilePopUpContext);
  const {handleSuccess, handleError} : any = useContext(AlertContext);
  
  const [styles, setStyles] = useState(sa as any);

  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (event: any) => {
      const nav = document.getElementById('navbar');
      if (event.clientX < 80) {
        setStyles(s);
          nav?.focus();
      } else if (event.clientX > 240) {
        setStyles(sa);
        nav?.focus();
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  

  return (
    <>
      <div id="navbar" className={styles.container}>
        <nav className={styles.navbar}>
          <ul className={styles.list}>
            <li>
              <div className={styles.search_icon}>
                <BiSearch className={styles.icons} />
              </div>
              <input
                type="text"
                placeholder="Search"
                onKeyDown={(e: any) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    navigate("/search?user=" + e.target.value);
                    window.location.reload();
                  }
                }}
              />
            </li>
            <li>
              <a href="/home">
                <BiHome className={styles.icons} />
                <span>Home</span>
              </a>
            </li>
            <li>
              <a href="/friends">
                <BiGroup className={styles.icons} />
                <span>Friends</span>
              </a>
            </li>
            <li>
              <a href="/messages">
                <BiMessage className={styles.icons} />
                <span>Messages</span>
              </a>
            </li>
            <li>
              <a href="/profile">
                <BiUser className={styles.icons} />
                <span>My Profile</span>
              </a>
            </li>
          </ul>
        </nav>
        <div className={styles.profile_footer}>
            <a onClick={
                (e) => {
                    e.preventDefault();
                    setUser(me);
                    setShow(true);
                }
            }>
                <div className={styles.avatar}>
                    <img src={"http://localhost:3000/api/public/picture/" + me.login} />
                </div>
                <div className={styles.profile_info}>
                    <a>{me.login}</a> {/*TODO: Error here*/}
                    <div className={styles.match_history}>
                    <span>W : 5 | L : 2</span>
                    </div>
                </div>
            </a>
          <a
            className={styles.logout_btn}
            onClick={() => {
                API.logOut(() => {
                    handleSuccess("You have been logged out")
                    navigate("/signin");
                }, () => {
                    handleError("An error occured while logging out")
                });
            }}
          >
            <BiLogOut className={styles.logout_btn_icon} />
          </a>
        </div>
      </div>
    </>
  );
};

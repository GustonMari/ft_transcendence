import { useEffect, useState, useLayoutEffect } from "react";
import { BiGroup, BiUser, BiMessage, BiSearch, BiLogOut, BiHome } from "react-icons/bi";
import s from "../styles/Nav/NavBar.module.css";
import sa from "../styles/Nav/NavBar.hidden.module.css";
import API from "../api/api";
import { useNavigate } from "react-router-dom";


export const NavBar = (props: any) => {
    const [me, setMe] = useState({} as any);
    const [styles, setStyles] = useState(sa as any);

    const navigate = useNavigate();
    
  useEffect(() => {
    const handleMouseMove = (event: any) => {
      if (event.clientX < 80) {
        setStyles(s);
      } else if (event.clientX > 240) {
        setStyles(sa);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useLayoutEffect(() => {
    API.checkAuth((data: any) => {
        setMe(data);
    }, (err: any) => {
        console.log(err);
    });
}, []);

  return (
    <>
      <div className={styles.container}>
        <nav className={styles.navbar}>
          <ul className={styles.list}>
            <li>
              <div className={styles.search_icon}>
                <BiSearch className={styles.icons} />
              </div>
              <input type="text" placeholder="Search" onKeyDown={
                    (e: any) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            navigate("/search?user=" + e.target.value);
                            window.location.reload();
                        }
                    }
              }/>
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
              <a href="/register">
                <BiMessage className={styles.icons} />
                <span>Messages</span>
              </a>
            </li>
            <li>
              <a href="/register">
                <BiUser className={styles.icons} />
                <span>My Profile</span>
              </a>
            </li>
          </ul>
        </nav>
        <div className={styles.profile_footer}>
          <div className={styles.avatar}>
            <img src={props.img} />
          </div>
          <div className={styles.profile_info}>
            <a>{me.login}</a>
            <div className={styles.match_history}>
              <span>W : 5 | L : 2</span>
            </div>
          </div>
          <a
            className={styles.logout_btn}
            onClick={() => {
              API.logOut(
                () => {
                    navigate("/signin");
                },
                () => {
                    navigate("/signin");
                }
              );
            }}
          >
            <BiLogOut className={styles.logout_btn_icon} />
          </a>
        </div>
      </div>
    </>
  );
};

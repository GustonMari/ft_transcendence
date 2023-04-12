import { BiSearch } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { MdOutlineRemoveCircleOutline } from "react-icons/md";
import { AiOutlinePlusCircle } from "react-icons/ai";

import s from "./../styles/search/result.module.css";
import g from "./../styles/communs/global.module.css";

import { useNavigate, useSearchParams } from "react-router-dom";
import { NavBar } from "../components/communs/NavBar";
import { useContext, useLayoutEffect, useState } from "react";
import API from "../network/api";
import { ProfileComponent } from "../components/users/ProfileComponent";
import { ProfilePopUpContext } from "../contexts/ProfilePopUp.context";
import { AlertContext } from "../contexts/Alert.context";

export const Result = (props: any) => {
    const [param, setParam] = useSearchParams();
    const [search, setSearch] = useState("");
    const [oriSearch, setOriSearch] = useState(param.get('user'));
    const [apiRes, setApiRes] = useState([] as any);

    const {setUser, setShow, show} : any = useContext(ProfilePopUpContext);
    const {handleError, handleSuccess} : any = useContext(AlertContext);

    const navigate = useNavigate();

    useLayoutEffect(() => {
        API.searchUser(
            oriSearch,
            (u: any) => {
                console.log(u);
                setApiRes(u);
            },
            (err: any) => {
                console.log(err);
            }
        );
    }, []);

    return (
        <>
            <div className={g.background}>
                <NavBar/>
                <div className={s.container}>
                        <div className={s.search_input}>
                                <input type="text" placeholder="Search" onChange={
                                        (e: any) => {                                    
                                            e.preventDefault();
                                            setSearch(e.target.value);
                                        }
                                    }
                                    onKeyDown={
                                        (e: any) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                navigate("/search?user=" + search);
                                                window.location.reload();
                                        }
                                    }
                                }/>
                                <button onClick={
                                    (e: any) => {
                                        e.preventDefault();
                                        navigate("/search?user=" + search);
                                        window.location.reload();
                                    }
                                }>
                                    <BiSearch className={s.search_btn}/>
                                </button>
                        </div>
                        <div className={s.split_bar}></div>
                        {oriSearch &&
                            <div>
                                <p className={s.search_result_title}>Search result for "{oriSearch}"</p>
                            </div>
                        }
                        <div className={s.result}>
                            <table>
                                <tbody>
                                    {
                                        apiRes.map((user: any) => {
                                            return <tr className={s.user_row} key={user.id}>
                                                <td className={s.user_login_and_pic}>
                                                    <img src="https://picsum.photos/200" alt="user" className={s.user_img}/>
                                                    <p>{user.login}</p>
                                                </td>
                                                <td className={s.user_description}>{(user.description ? user.description : "No Description")}</td>
                                                <td className={s.user_action_buttons}>
                                                    <a className={s.btn_see_profile} onClick={(e: any) => {
                                                        e.preventDefault();
                                                        setShow(true);
                                                        setUser(user);
                                                    }}>
                                                        <CgProfile/>
                                                    </a>
                                                    <a className={s.btn_send_request} onClick={
                                                        (e: any) => {
                                                            e.preventDefault();
                                                            API.sendFriendRequest(
                                                                user.id,
                                                                () => {
                                                                    handleSuccess("Friend Request has been sent");
                                                                },
                                                                (err: any) => {
                                                                    handleError(err.message);
                                                                });
                                                            }
                                                        }>
                                                        <AiOutlinePlusCircle/>
                                                    </a>
                                                    <a className={s.btn_block}>
                                                        <MdOutlineRemoveCircleOutline/>
                                                    </a>
                                                </td>

                                            </tr>
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    <div>
                        {show && <ProfileComponent/>}
                    </div>
                </div>
            </div>
        </>
    );
}
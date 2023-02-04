import { BiSearch } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { MdOutlineRemoveCircleOutline } from "react-icons/md";
import { AiOutlinePlusCircle } from "react-icons/ai";
import s from "./../../styles/search/result.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { NavBar } from "../NavBar";
import { useLayoutEffect, useState } from "react";
import API from "../../api/api";
import { ProfileComponent } from "../user/ProfileComponent";

export const Result = (props: any) => {
    const [param, setParam] = useSearchParams();
    const [search, setSearch] = useState("");
    const [oriSearch, setOriSearch] = useState(param.get('user'));
    const [apiRes, setApiRes] = useState([] as any);

    const [ pop, setPop ] = useState(false);
    const [popUser, setPopUser] = useState({} as any);

    const navigate = useNavigate();

    // const [users, setUsers] = useState([] as any);

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
    

    const users = [
        {
            id: 1,
            login: "user111111111111111111111111111111111111111111111111",
            first_name: "User",
            last_name: "One",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc sit amet aliquam tincidunt, nunc nisl aliquam tortor, eget aliquam nisl nisl sit amet lorem. Sed euismod, nunc sit amet aliquam tincidunt, nunc nisl aliquam tortor, eget aliquam nisl nisl sit amet lorem.",
        },
        {
            id: 2,
            login: "user2",
            first_name: "User",
            last_name: "Two",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc sit amet aliquam tincidunt, nunc nisl aliquam tortor, eget aliquam nisl nisl sit amet lorem. Sed euismod, nunc sit amet aliquam tincidunt, nunc nisl aliquam tortor, eget aliquam nisl nisl sit amet lorem.",
        },
        {
            id: 3,
            login: "user3",
            first_name: "User",
            last_name: "Three",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc sit amet aliquam tincidunt, nunc nisl aliquam tortor, eget aliquam nisl nisl sit amet lorem. Sed euismod, nunc sit amet aliquam tincidunt, nunc nisl aliquam tortor, eget aliquam nisl nisl sit amet lorem.",
        },
        {
            id: 4,
            login: "user4",
            first_name: "User",
            last_name: "Four",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc sit amet aliquam tincidunt, nunc nisl aliquam tortor, eget aliquam nisl nisl sit amet lorem. Sed euismod, nunc sit amet aliquam tincidunt, nunc nisl aliquam tortor, eget aliquam nisl nisl sit amet lorem.",
        },
    ]

    return (
        <>
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
                                                    setPop(true);
                                                    setPopUser(user);
                                                }}>
                                                    <CgProfile/>
                                                </a>
                                                <a className={s.btn_send_request} onClick={
                                                    (e: any) => {
                                                        e.preventDefault();
                                                        API.sendFriendRequest(
                                                            user.id,
                                                            () => {
                                                                console.log("Friend request sent");
                                                            },
                                                            (err: any) => {
                                                                console.log(err);
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
                    {pop && <ProfileComponent offShow={() => setPop(false)} user={popUser}/>}
                </div>
            </div>
        </>
    );
}
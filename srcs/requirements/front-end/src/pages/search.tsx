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
import { Avatar, Button, IconButton, Input, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography } from '@mui/material';
import { PopUp } from "../components/communs/PopUp";

const db: any[] = [
    {
        id: 1,
        login: "mamaurai1",
        description: "je suis mamaurai",
        first_name: "Jean",
        last_name: "Dupont",
    },
    {
        id: 2,
        login: "mamaurai2",
        description: "je suis mamaurai2",
        first_name: "Jean",
        last_name: "Dupont",
    },
    {
        id: 3,
        login: "mamaurai3",
        description: "je suis mamaurai3",
        first_name: "Jean",
        last_name: "Dupont",
    },
]

export const Result = (props: any) => {
    const [param, setParam] = useSearchParams();
    const [search, setSearch] = useState("");
    const [oriSearch, setOriSearch] = useState(param.get('user'));
    const [apiRes, setApiRes] = useState(db);

    const {setUser, setShow, show} : any = useContext(ProfilePopUpContext);
    const {handleError, handleSuccess} : any = useContext(AlertContext);

    // Informations used by the popup component
    const [showPU, setShowPU] = useState(false);
    const [messagePU, setMessagePU] = useState("");
    const [titlePU, setTitlePU] = useState("");
    const [onConfirm, setOnConfirm] = useState<() => void>();

    const navigate = useNavigate();

    // useLayoutEffect(() => {
    //     API.searchUser(
    //         oriSearch,
    //         (u: any) => {
    //             console.log(u);
    //             setApiRes(u);
    //         },
    //         (err: any) => {
    //             console.log(err);
    //         }
    //     );
    // }, []);

    const handleProfile = (event: any, e: any) => {
        event.preventDefault();
        setShow(true);
        setUser(e);
    }
    
    const handleAddFriend = () => {
        console.log("plus")
    }

    const handleBlockUser = () => {
        console.log("moins")
    }

    const createConfirmPopUp = (event: any, title: string, content:string, onConfirm: () => void) => {
        event.preventDefault();
        setTitlePU(title);
        setMessagePU(content);
        setShowPU(true);
        setOnConfirm(() => onConfirm);
    }

    return (
        <>
            <div className={g.background}>

                <NavBar/>

                {/* Search Bar */}
                <Input
                    onChange={
                    (e: any) => {   
                        e.preventDefault();
                        setSearch(e.target.value);
                    }}
                    placeholder="Search"
                    sx={{
                        ml: 20,
                        mt: 10,
                        width: 200,
                        bgcolor: "white",
                        borderRadius: 1,
                        height: 40,
                        padding: 1,
                    }}
                />

                {/* Button to valid the search field */}
                <Button
                    startIcon={<BiSearch/>}
                    onClick={
                        (e: any) => {
                            e.preventDefault();
                            navigate("/search?user=" + search);
                            window.location.reload();   
                        }
                    }
                    sx={{ml: 2}}
                    variant="contained"
                >
                Search
                </Button>

                {/* PopUp used to confirm the request */}
                <PopUp
                    show={showPU}
                    title={titlePU}
                    content={messagePU}
                    onClose={() => {setShowPU(false)}}
                    onConfirm={() => {if (onConfirm) {onConfirm()}}}
                />

                {/* List of users */}
                <List
                    sx={{
                        ml: 12,
                        mr: 3,
                        mt: 3,
                        padding: 3,
                        bgcolor: "white",
                        borderRadius: 2,
                    }}
                    subheader={
                        <Typography variant="h6" component="div" sx={{ml: 2}}>
                            Search result for "{oriSearch}"
                        </Typography>
                    }
                >
                    { apiRes.map((user: any, idx: number) => { return (
                        <ListItem key={idx}
                            secondaryAction={
                                <>
                                    <IconButton onClick={(e: any) => {handleProfile(e, user)}}>
                                        <CgProfile/>
                                    </IconButton>
                                    <IconButton onClick={(e: any) => createConfirmPopUp(
                                        e,
                                        "Add friend",
                                        "Do you want to add " + user.login + " as a friend ?",
                                        handleAddFriend
                                    )}>
                                        <AiOutlinePlusCircle/>
                                    </IconButton>
                                    <IconButton onClick={(e: any) => createConfirmPopUp(
                                        e,
                                        "Block user",
                                        "Do you want to block " + user.login + " ?",
                                        handleBlockUser
                                    )}>
                                        <MdOutlineRemoveCircleOutline/>
                                    </IconButton>
                                </>                    
                            }
                            sx={{
                                "&:hover": {
                                    bgcolor: "grey.100",
                                    borderRadius: 1,
                                }
                            }}
                        >
                            <ListItemAvatar>
                                <Avatar  alt="jean" src="http://localhost:3000/api/public/picture/mamaurai1"/>
                            </ListItemAvatar>
                            <ListItemText
                                primary={user.login}
                                secondary={user.first_name + " " + user.last_name} 
                                sx={{width: 3/4}}
                            />
                            
                        </ListItem>
                    )})}
                </List>
            </div>
        </>
    );
}



            // <div className={g.background}>
            //     <NavBar/>
            //     <div className={s.container}>
            //             <div className={s.search_input}>
            //                     <input type="text" placeholder="Search" onChange={
            //                             (e: any) => {                                    
            //                                 e.preventDefault();
            //                                 setSearch(e.target.value);
            //                             }
            //                         }
            //                         onKeyDown={
            //                             (e: any) => {
            //                                 if (e.key === "Enter") {
            //                                     e.preventDefault();
            //                                     navigate("/search?user=" + search);
            //                                     window.location.reload();
            //                             }
            //                         }
            //                     }/>
            //                     <button onClick={
            //                         (e: any) => {
            //                             e.preventDefault();
            //                             navigate("/search?user=" + search);
            //                             window.location.reload();
            //                         }
            //                     }>
            //                         <BiSearch className={s.search_btn}/>
            //                     </button>
            //             </div>
            //             <div className={s.split_bar}></div>
            //             {oriSearch &&
            //                 <div>
            //                     <p className={s.search_result_title}>Search result for "{oriSearch}"</p>
            //                 </div>
            //             }
            //             <div className={s.result}>
            //                 <table>
            //                     <tbody>
            //                         {
            //                             apiRes.map((user: any) => {
            //                                 return <tr className={s.user_row} key={user.id}>
            //                                     <td className={s.user_login_and_pic}>
            //                                         <img src="https://picsum.photos/200" alt="user" className={s.user_img}/>
            //                                         <p>{user.login}</p>
            //                                     </td>
            //                                     <td className={s.user_description}>{(user.description ? user.description : "No Description")}</td>
            //                                     <td className={s.user_action_buttons}>
            //                                         <a className={s.btn_see_profile} onClick={(e: any) => {
            //                                             e.preventDefault();Jean Dup
            //                                             setShow(true);
            //                                             setUser(user);
            //                                         }}>
            //                                             <CgProfile/>
            //                                         </a>
            //                                         <a className={s.btn_send_request} onClick={
            //                                             (e: any) => {
            //                                                 e.preventDefault();
            //                                                 API.sendFriendRequest(
            //                                                     user.id,
            //                                                     () => {
            //                                                         handleSuccess("Friend Request has been sent");
            //                                                     },
            //                                                     (err: any) => {
            //                                                         handleError(err.message);
            //                                                     });
            //                                                 }
            //                                             }>
            //                                             <AiOutlinePlusCircle/>
            //                                         </a>
            //                                         <a className={s.btn_block}>
            //                                             <MdOutlineRemoveCircleOutline/>
            //                                         </a>
            //                                     </td>

            //                                 </tr>
            //                             })
            //                         }
            //                     </tbody>
            //                 </table>
            //             </div>
            //         <div>
            //             {show && <ProfileComponent/>}
            //         </div>
            //     </div>
            // </div>
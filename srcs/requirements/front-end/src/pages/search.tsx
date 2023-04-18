import { BiSearch } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { MdOutlineRemoveCircleOutline } from "react-icons/md";
import { AiOutlinePlusCircle } from "react-icons/ai";

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
import { IUser } from "./friend";

export const Result = (props: any) => {
    const [param, setParam] = useSearchParams();
    const [search, setSearch] = useState("");
    const [oriSearch, setOriSearch] = useState(param.get('user'));
    const [apiRes, setApiRes] = useState<IUser[]>([]);

    const {setPopUpID} : any = useContext(ProfilePopUpContext);
    const {handleError, handleSuccess} : any = useContext(AlertContext);

    // Informations used by the popup component
    const [showPU, setShowPU] = useState(false);
    const [messagePU, setMessagePU] = useState("");
    const [titlePU, setTitlePU] = useState("");
    const [onConfirm, setOnConfirm] = useState<() => void>();

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

    const handleProfile = (event: any, id: number) => {
        event.preventDefault();
        setPopUpID(id);
    }
    
    const handleAddFriend = (id: number) => {
        API.sendFriendRequest(
            id,
            () => {
                handleSuccess("Friend request sent");
            }, (err: any) => {
                handleError(err.message);
            }
        )
    }

    const handleBlockUser = (id: number) => {
        API.blockUser(
            id,
            () => {
                handleSuccess("User blocked");
            }, (err: any) => {
                handleError(err.message);
            }
        )
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

                        if (e.key === "Enter") {
                            navigate("/search?user=" + search);
                            window.location.reload();
                        }
                    }}
                    onKeyDown={ (e: any) => {
                        if (e.key === "Enter") {
                            navigate("/search?user=" + search);
                            window.location.reload();
                        }}
                    }
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
                { oriSearch &&
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
                                    <IconButton onClick={(e: any) => {handleProfile(e, user.id)}}>
                                        <CgProfile/>
                                    </IconButton>
                                    <IconButton onClick={(e: any) => createConfirmPopUp(
                                        e,
                                        "Add friend",
                                        "Do you want to add " + user.login + " as a friend ?",
                                        () => handleAddFriend(user.id)
                                    )}>
                                        <AiOutlinePlusCircle/>
                                    </IconButton>
                                    <IconButton onClick={(e: any) => createConfirmPopUp(
                                        e,
                                        "Block user",
                                        "Do you want to block " + user.login + " ?",
                                        () => handleBlockUser(user.id)
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
                                <Avatar  alt={user.login} src={"http://localhost:3000/api/public/picture/" + user.login}/>
                            </ListItemAvatar>
                            <ListItemText
                                primary={user.login}
                                secondary={(user.first_name ? user.first_name : "") + " " + (user.last_name ? user.last_name : "")}
                                sx={{width: 3/4}}
                            />
                            
                        </ListItem>
                    )})}
                </List>
                }
            </div>
        </>
    );
}

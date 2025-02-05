import { BiSearch } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { MdBlock, MdOutlineRemoveCircleOutline } from "react-icons/md";
import { AiOutlinePlusCircle } from "react-icons/ai";

import g from "./../styles/communs/global.module.css";

import { useNavigate, useSearchParams } from "react-router-dom";
import { NavBar } from "../components/communs/NavBar";
import { useContext, useEffect, useState } from "react";
import API from "../network/api";
import { ProfilePopUpContext } from "../contexts/ProfilePopUp.context";
import { AlertContext } from "../contexts/Alert.context";
import { Avatar, Button, IconButton, Input, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import { PopUp } from "../components/communs/PopUp";
import { IUser } from "./friend";
import { APP } from "../network/app";

export const Result = (props: any) => {
    const [param] = useSearchParams();
    const [search, setSearch] = useState("");
    const [oriSearch] = useState(param.get('user'));
    const [apiRes, setApiRes] = useState<IUser[]>([]);

    const {setPopUpID} : any = useContext(ProfilePopUpContext);
    const {handleError, handleSuccess} : any = useContext(AlertContext);

    // Informations used by the popup component
    const [showPU, setShowPU] = useState(false);
    const [messagePU, setMessagePU] = useState("");
    const [titlePU, setTitlePU] = useState("");
    const [onConfirm, setOnConfirm] = useState<() => void>();

    const navigate = useNavigate();

    useEffect(() => {
        if (!oriSearch) {
            if (oriSearch === "") {
                handleError("Please enter a username to search");
            }
            return;
        }
        API.searchUser(
            oriSearch,
            (u: any) => {
                setApiRes(u);
            },
            (err: any) => {
                handleError(err?.message || "Cannot search user, please try again later");
            }
        );
    }, [oriSearch]);

    const handleProfile = (event: any, id: number) => {
        event.preventDefault();
        setPopUpID(id);
    }
    
    const handleAddFriend = (id: number) => {
        APP.post("/relation/create", {
            id_target: id,
            relation_type: "PENDING",

        }).then(() => {
            handleSuccess("Friend request sent");
        }).catch((err) => {
            handleError(err.message);
        });
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
            <div className={g.background + " flex flex-col w-full md:flex-row"}>

                <NavBar/>

                {/* Search Bar */}
                <div className="w-full -z-10">
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
                            ml: 10,
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
                            ml: 3,
                            mr: 3,
                            mt: 3,
                            padding: 3,
                            bgcolor: "white",
                            borderRadius: 2,
                        }}
                        subheader={
                            <Typography variant="h6" component="div" sx={{ml: 2}}>
                                {oriSearch ? `Search result for ${oriSearch}` : "Make new friends" }
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
                                            <MdBlock/>
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
                                    <Avatar  alt={user.login} src={`http://${process.env.REACT_APP_LOCAL_IP}:3000/api/public/picture/` + user.login}/>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={user.login}
                                    secondary={(user.first_name ? user.first_name : "") + " " + (user.last_name ? user.last_name : "")}
                                    sx={{width: 3/4}}
                                />
                                
                            </ListItem>
                        )})}
                    </List>
                </div>
            </div>
        </>
    );
}

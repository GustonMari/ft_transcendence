import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react"
import API from "../network/api"
import { AlertContext } from "../contexts/Alert.context"
import MenuSelector from "../components/relations/MenuSelector"
import { FaUserFriends } from "react-icons/fa"
import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material"
import { NavBar } from "../components/communs/NavBar"
import g from "../styles/communs/global.module.css"
import { ProfilePopUpContext } from "../contexts/ProfilePopUp.context"

import { CgProfile } from "react-icons/cg"
import { MdOutlineRemoveCircleOutline } from "react-icons/md";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { RiDeleteBin5Line } from "react-icons/ri"
import { PopUp } from "../components/communs/PopUp"


export interface IMenu {
    id: number,
    title: string,
    icon: any,
    separator?: boolean,
    url: string,
}

export interface IUser {
    id: number,
    login: string,
    first_name: string,
    last_name: string,
    description: string,
}

const menuItems: IMenu[] = [
    {
        id: 0,
        title: 'Friends',
        icon: <FaUserFriends/>,
        url: 'friend',
    },
    {
        id: 1,
        title: 'Incoming',
        icon: <FaUserFriends/>,
        url: 'incoming',
    },
    {
        id: 2,
        title: 'Outgoing',
        icon: <FaUserFriends/>,
        separator: true,
        url: 'outgoing',
    },
    {
        id: 3,
        title: 'Blocked',
        icon: <FaUserFriends/>,
        url: 'blocked',
    },
]

const user: IUser[] = [
    {
        id: 0,
        login: 'test',
        first_name: 'test',
        last_name: 'test',
        description: 'test',
    },
    {
        id: 1,
        login: 'test2',
        first_name: 'test2',
        last_name: 'test2',
        description: 'test2',
    },
    {
        id: 2,
        login: 'test3',
        first_name: 'test3',
        last_name: 'test3',
        description: 'test3',
    },
    {
        id: 3,
        login: 'test4',
        first_name: 'test4',
        last_name: 'test4',
        description: 'test4',
    },
    {
        id: 4,
        login: 'test5',
        first_name: 'test5',
        last_name: 'test5',
        description: 'test5',
    }
]

export const Friends = () => {

    const [relations, setRelations] = useState<IUser[]>([]);
    const [menuID, setMenuID] = useState<number>(1);

    const [showPU, setShowPU] = useState(false);
    const [messagePU, setMessagePU] = useState("");
    const [titlePU, setTitlePU] = useState("");
    const [onConfirm, setOnConfirm] = useState<() => void>();

    const {handleError, handleSuccess} = useContext<any>(AlertContext);
    const {setShow, setUser} = useContext<any>(ProfilePopUpContext);

    const _removeRelation = (id: number) => {
        setRelations(relations.filter((item: any) => item.id !== id));
    }

    useEffect(() => {
        API.getRelation(
            "http://localhost:3000/api/relation/list/" + menuItems[menuID].url,
            (res: any) => {
                setRelations(res);
            }, (err: any) => {
                handleError(err.message);
            }
        )
    }, [menuID])

    const handleProfile = (event: any, id: number) => {
        event.preventDefault();

        const user = API.getUser(
            id,
            (res: any) => {
                setShow(true);
                setUser(res);
            }, (err: any) => {
                handleError(err.message);
            }
        );
    }

    const createConfirmPopUp = (event: any, title: string, content:string, onConfirm: () => void) => {
        event.preventDefault();
        setTitlePU(title);
        setMessagePU(content);
        setShowPU(true);
        setOnConfirm(() => onConfirm);
    }

    const handleRemoveFriend = (event: any, id: number) => {}

    const handleAcceptRequest = (rid: number) => {
        API.acceptRequest(
            rid,
            () => {
                _removeRelation(rid);
                handleSuccess("Request accepted");
            }, (err: any) => {
                handleError(err.message);
            }
        )
    }

    const handleRemoveRelation = (rid: number) => {
        API.removeRelation(
            rid,
            () => {
                _removeRelation(rid);
                handleSuccess("Request accepted");
            }, (err: any) => {
                handleError(err.message);
            }
        )
    }

    const handleUnblock = (event: any, id: number) => {}

    return (
        <div className={g.background}>
            <NavBar/>

            <MenuSelector
                setListValue={(id: number) => setMenuID(id)}
                listValue={menuID}
                listElements={menuItems}
            />

            <PopUp
                show={showPU}
                title={titlePU}
                content={messagePU}
                onClose={() => {setShowPU(false)}}
                onConfirm={() => {if (onConfirm) {onConfirm()}}}
            />

            <List
                sx={{
                    ml: 12,
                    mr: 3,
                    mt: 3,
                    padding: 3,
                    bgcolor: "white",
                    borderRadius: 2,
                }}
            >
                { relations && relations.map((item: any, id: number) => {
                    const user : IUser = item.user;
                    console.log("test" + user);
                    return (
                        <div key={id}>
                            <ListItem
                                secondaryAction={
                                    <>
                                        <IconButton onClick={(e: any) => {handleProfile(e, user.id)}}>
                                            <CgProfile/>
                                        </IconButton>
                                        {menuID === 0 &&
                                            <IconButton
                                                onClick={(e: any) => createConfirmPopUp(
                                                    e,
                                                    "Remove friend",
                                                    "Do you want to remove " + user.login + " from your friend list ?",
                                                    () => handleRemoveRelation(item.id),
                                                )}
                                            >
                                                <MdOutlineRemoveCircleOutline/>
                                            </IconButton>
                                        }
                                        { menuID === 1 &&
                                            <IconButton  
                                                onClick={(e: any) => createConfirmPopUp(
                                                    e,
                                                    "Accept friend request",
                                                    "Do you want to accept " + user.login + " friend request ?",
                                                    () => handleAcceptRequest(item.id),
                                                )}
                                            >
                                                <AiOutlinePlusCircle/>
                                            </IconButton>
                                        }
                                        { (menuID === 2 || menuID === 1) &&
                                            <IconButton 
                                                onClick={(e: any) => createConfirmPopUp(
                                                    e,
                                                    "Decline friend request",
                                                    "Do you want to remove " + user.login + " friend request ?",
                                                    () => handleRemoveRelation(item.id),
                                                )}
                                            >
                                                <RiDeleteBin5Line/>
                                            </IconButton>
                                        }
                                        { menuID === 3 &&
                                            <IconButton 
                                                onClick={(e: any) => createConfirmPopUp(
                                                    e,
                                                    "Unblock user",
                                                    "Do you want to unblock " + user.login + " ?",
                                                    () => handleRemoveRelation(item.id),
                                            )}
                                            >
                                                <MdOutlineRemoveCircleOutline/>
                                            </IconButton>
                                        }

                                    </>
                                }    
                            >
                                <ListItemAvatar>
                                    <Avatar  alt="jean" src="http://localhost:3000/api/public/picture/mamaurai1"/>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={user.login}
                                    secondary={user.first_name + " " + user.last_name}
                                    sx={{width: 3/4}}
                                />
                                {/* {menuID === 0 &&
                                    <div>
                                        <ListItemText
                                            primary={item.description}
                                        />
                                    </div>
                                } */}
                            </ListItem>
                        </div>
                    )
                })}
            </List>
        </div>
    ) 
}
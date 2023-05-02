import { useContext, useEffect, useState } from "react"
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
import { IoLogoGameControllerA } from "react-icons/io"
import { StyledBadge } from "../components/communs/StyledBadge"
import { APP } from "../network/app"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../contexts/User.context"

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
    state: boolean,
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

export const Friends = () => {

    const [relations, setRelations] = useState<IUser[]>([]);
    const [menuID, setMenuID] = useState<number>(0);

    const [showPU, setShowPU] = useState(false);
    const [messagePU, setMessagePU] = useState("");
    const [titlePU, setTitlePU] = useState("");
    const [onConfirm, setOnConfirm] = useState<() => void>();

    const {handleError, handleSuccess} = useContext<any>(AlertContext);
    const {setPopUpID} = useContext<any>(ProfilePopUpContext);
    const {me}: any = useContext(UserContext)

    const navigate = useNavigate();

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
    }, [menuID, handleError])

    const handleProfile = (event: any, id: number) => {
        event.preventDefault();
        setPopUpID(id);
    }

    const createConfirmPopUp = (event: any, title: string, content:string, onConfirm: () => void) => {
        event.preventDefault();
        setTitlePU(title);
        setMessagePU(content);
        setShowPU(true);
        setOnConfirm(() => onConfirm);
    }

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
                handleSuccess("Request removed");
            }, (err: any) => {
                handleError(err.message);
            }
        )
    }

    const launchGame = async (event: any, user: IUser) => {
        event.preventDefault();
        await APP.post('/pong/create_game', {master: me, slave: user});
        await APP.post('/pong/create_invitation_pong', {master: me.login, slave: user.login});
        setPopUpID(undefined);
        navigate("/pong", {state: {
            user: me.login, 
            opponent: user?.login,
        }});
    }

    return (
        <div className={g.background + " flex flex-col w-full md:flex-row"}>
            <NavBar/>
            <div className="w-full">
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
                        ml: 3,
                        mr: 3,
                        mt: 3,
                        padding: 3,
                        bgcolor: "white",
                        borderRadius: 2,
                        zIndex: 100,
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
                                            {menuID === 0 && <>
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
                                                <IconButton
                                                    onClick={(e: any) => launchGame(e, user)}
                                                >
                                                    <IoLogoGameControllerA/>
                                                </IconButton>
                                                </>
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
                                        <StyledBadge
                                            overlap="circular"
                                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                            variant={(menuID === 0 && user.state) ? "dot" : "standard"}
                                        >
                                            <Avatar  alt="jean" src="http://localhost:3000/api/public/picture/mamaurai1"/>
                                        </StyledBadge>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={user.login}
                                        secondary={(user.first_name ? user.first_name : "") + " " + (user.last_name ? user.last_name : "")}
                                        sx={{width: 3/4}}
                                    />
                                </ListItem>
                            </div>
                        )
                    })}
                    { relations.length === 0 && <>
                        <ListItem>
                            <ListItemText
                                primary="No result"
                                secondary="No result found"
                            />
                        </ListItem>
                    </>
                    }
                </List>
            </div>
        </div>
    ) 
}
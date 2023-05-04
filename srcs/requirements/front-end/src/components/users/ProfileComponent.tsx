import { useContext, useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import { AiOutlineClockCircle, AiOutlineUserAdd } from "react-icons/ai";
import { ProfilePopUpContext } from "../../contexts/ProfilePopUp.context";
import s from "../../styles/profile/ProfileComponent.module.css";
import API from "../../network/api";
import { AlertContext } from "../../contexts/Alert.context";
import { UserContext } from "../../contexts/User.context";
import { IoLogoGameControllerA } from "react-icons/io";
import { Box, CircularProgress, CircularProgressProps, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { APP } from "../../network/app";
import { AxiosResponse } from "axios";
import { StyledBadge } from "../communs/StyledBadge";

function CircularProgressWithLabel(
    props: CircularProgressProps & { value: number },
  ) {
    
    const progress = Math.floor((props.value - Math.floor(props.value)) * 100);

    return (
        <Box
            sx={{
                top: "25px",
                left: "25px",
                position: 'absolute',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: "100px",
                height: "100px",
                borderRadius: "50000px",
                boxShadow: "0px 0px 2px 0px rgba(0,0,0,0.75)",
            }}
        >
        <CircularProgress variant="determinate" value={progress}
            sx={{
                color: "white",
                bgcolor: "#7f5082",
                borderRadius: "100%",

                // backgroundColor: "red",
            }}
            size={"100px"}
        />
        <Box
          sx={{
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: "100px",
            height: "100px",
          }}
        >
          <Typography
            variant="caption"
            component="div"
            color="text.secondary"
            fontSize={40}
            sx={{
                color: "white",
            }}
          >{`${Math.floor(props.value)}`}</Typography>
        </Box>
      </Box>
    );
  }
  
export const ProfileComponent = ({setHistory}: any) => {

    const {popUpID, setPopUpID} : any = useContext(ProfilePopUpContext);
    const {handleError, handleSuccess} : any = useContext(AlertContext);
    const {me}: any = useContext(UserContext)

    const [isFriend, setIsFriend] = useState<boolean | undefined>(undefined);

    const [user, setUser] = useState<any | undefined>(undefined)

    const navigate = useNavigate();

    const handleLaunchGame = async () => {
        await APP.post('/pong/create_game', {master: me, slave: user})
        .catch((err) => {
            handleError("Error while creating game");
        });
        await APP.post('/pong/create_invitation_pong', {master: me.login, slave: user.login})
        .catch((err) => {
            handleError("Error while inviting user");
        });
        setPopUpID(undefined);
        navigate("/pong", {state: {
            user: me.login, 
            opponent: user?.login,
        }});
    }

    const handleSendMessage = (id: number) => {
        navigate('/messages?__create_room__=' + id);
        setPopUpID(undefined);
    }

    const handleProfile = () => {
        navigate('/profile');
        setPopUpID(undefined);
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
        
    useEffect(() => {
        API.getUser(
            popUpID,
            (u: any) => {
                setUser(u)
            }, (err: any) => {
                handleError(err.message)
            }
        )

        if (me.id !== popUpID) {
            APP.get('/relation/isfriend/id/' + popUpID)
            .then((response: AxiosResponse) => {
                console.log(response.data)
                setIsFriend(response.data);
            })
            .catch(() => {
                setIsFriend(false);
                handleError("Error while getting user's relation")
            })
        } else {
            setIsFriend(false);
        }
    }, [popUpID])

    const outsideRef = useRef<any>(null);
    
    const handleClickOutside = (e: any) => {
        if (outsideRef.current && !outsideRef.current.contains(e.target)) {
            setPopUpID(undefined);
        }
    }

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        }
    }, [handleClickOutside])

    return (
    <>
        <div className={s.page}>
            <div ref={outsideRef}>
                <div className={s.container}>
                { user && isFriend !== undefined && <>
                    <div className={s.profile_picture_div}>
                        <img src={`http://${process.env.REACT_APP_LOCAL_IP}:3000/api/public/picture/` + user?.login }></img>
                    </div>
                    <div className={s.profile_bio_div}>
                        {user.state ? <>
                            <StyledBadge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                variant="dot"
                                sx={{
                                    top: "25px",
                                    left: "-275px",
                                }}
                            >
                            </StyledBadge>
                            <h2>Online</h2>
                            </>
                            : 
                            <h2>Offline</h2>
                        }
                        <hr></hr>
                        <p>{user?.description ? user?.description?.substring(0, 200) : "No Description"}</p>
                    </div>
                    <div className={s.profile_stats_div}>
                        <CircularProgressWithLabel value={user?.level} />
                    </div>
                    <div className={s.profile_name_div}>
                        <h1>{user?.login?.substring(0, 20)}</h1>
                        <h2>{user?.first_name?.substring(0, 15)} {user?.last_name?.substring(0, 15)}</ h2>
                    </div>
                    <div className={s.profile_history_div}>
                        <button
                            onClick={() => setHistory(user.id)}
                        >
                            <AiOutlineClockCircle/>
                        </button>
                    </div>

                    <div className={s.profile_btn_div}>
                        { user?.id !== me?.id ?
                        <>
                            { !isFriend &&
                            <>
                                <button
                                    onClick={() => handleAddFriend(user?.id)}
                                >
                                    <AiOutlineUserAdd/>
                                </button>
                            </>
                            }
                            <button
                                onClick={() => handleSendMessage(user?.id)}
                            >
                                <FiSend/>
                            </button>
                            <button
                                onClick={() => handleLaunchGame()}
                            >
                                <IoLogoGameControllerA/>
                            </button>
                        </>
                        :
                        <>
                            <button
                                onClick={() => handleProfile()}
                            >
                                <CgProfile/>
                            </button>
                        </>
                        }
                    </div>
                </>}
                { !user && <>
                    <CircularProgress
                        sx={{
                            color: "#7f5082",
                            // bgcolor: "#7f5082",
                            borderRadius: "100%",
                            position: "absolute",
                            top: "45%",
                            left: "45%",
                            transform: "translate(-50%, -50%)",
                            // backgroundColor: "red",
                        }}
                        size={"50px"}
                    />
                
                </>}
                </div>
            </div>
        </div>
    </>
  );
};

import { useContext, useEffect, useState } from "react";
import { BsXLg } from "react-icons/bs";
import { FiSend } from "react-icons/fi";
import { AiOutlineClockCircle, AiOutlineUsergroupAdd } from "react-icons/ai";
import { ProfilePopUpContext } from "../../contexts/ProfilePopUp.context";
import s from "../../styles/profile/ProfileComponent.module.css";
import API from "../../network/api";
import { AlertContext } from "../../contexts/Alert.context";
import { UserContext } from "../../contexts/User.context";
import { IoLogoGameControllerA } from "react-icons/io";
import { PopUpHistory } from "../history/PopUpHistory";
import { Box, CircularProgress, CircularProgressProps, Typography } from "@mui/material";

function CircularProgressWithLabel(
    props: CircularProgressProps & { value: number },
  ) {
    
    const progress = Math.floor((props.value - Math.floor(props.value)) * 100);

    useEffect(() => {{console.log(progress)}})

    return (
        <Box
            sx={{
                top: -51,
                left: 205,
                position: 'absolute',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
        <CircularProgress variant="determinate" value={progress}
            sx={{
                color: "white",
                bgcolor: "black",
                borderRadius: "50%",
            }}
        />
        <Box
          sx={{
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="caption"
            component="div"
            color="text.secondary"
            fontSize={20}
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

    const [user, setUser] = useState<any | undefined>(undefined)

    const handleLaunchGame = () => {
        // TODO: launch game
    }

    useEffect(() => {
        API.getUser(
            popUpID,
            (u: any) => {
                setUser(u)
            }, (err: any) => {
                handleError(err.message)
            })
    }, [popUpID])

  return (
    <>
        <div className={s.container}>
            <div className={s.pop_up}>
                { user && me && <>
                    <a className={s.close_button} onClick={() => setPopUpID(undefined)} title="Close the window">
                        <BsXLg/>
                    </a>
                    <div className={s.action_buttons}>
                            <a className={s.friend_request} title="Send friend request to this person"  onClick={() => setHistory(user.id)}>
                                <AiOutlineClockCircle/>
                            </a>
                        {me?.login !== user?.login && <>
                            <a className={s.send_message} title="See History">
                                <FiSend/>
                            </a>
                            <a className={s.friend_request} title="Send request to play"  onClick={() => handleLaunchGame()}>
                                <IoLogoGameControllerA/>
                            </a>
                        </>}
                    </div>
                    <div className={s.picture_section}>
                        <img src={"http://localhost:3000/api/public/picture/" + user.login}></img>
                    </div>
                    <div className={s.name_section}>
                        <h1>{user.login?.substring(0, 25)}</h1>
                        <h2>{user.first_name?.substring(0, 25)} {user.last_name?.substring(0, 25)}</h2>
                        <div className={s.stats}>
                            <div className={s.stats_wins}>
                                <h3>Wins</h3>
                                <h3>{user.wins}</h3>
                            </div>
                            <CircularProgressWithLabel value={user.level} />
                            <div className={s.stats_losses}>
                                <h3>Losses</h3>
                                <h3>{user.loses}</h3>
                            </div>
                        </div>
                        <div className={s.separator}></div>
                        <div className={s.bio_section}>
                            <p>
                                {user.description ? user.description?.substring(0, 250) : "No description"}
                            </p>
                        </div>
                    </div>
                </>}
            </div>
        </div>
    </>
  );
};

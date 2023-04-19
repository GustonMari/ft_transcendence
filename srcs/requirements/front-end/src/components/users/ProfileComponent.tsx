import { useContext, useEffect, useRef, useState } from "react";
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
    }, [])

    return (
    <>
        <div className={s.page}>
            <div ref={outsideRef}>
                <div className={s.container}>
                    <div className={s.profile_picture_div}>
                        <img src={"http://localhost:3000/api/public/picture/" + user?.login }></img>
                    </div>
                    <div className={s.profile_bio_div}>
                        <h2>Description</h2>
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
                        <button

                        >
                            <FiSend/>
                        </button>
                        <button
                            onClick={() => handleLaunchGame()}
                        >
                            <IoLogoGameControllerA/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </>
  );
};


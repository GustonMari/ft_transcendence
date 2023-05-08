import { Theme } from "@emotion/react";
import { Avatar, Dialog, Divider, List, ListItem, ListItemAvatar, ListItemText, SxProps } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { ProfilePopUpContext } from "../../contexts/ProfilePopUp.context";
import API from "../../network/api";
import { AlertContext } from "../../contexts/Alert.context";

interface IPopUpHistoryProps {
    show: boolean;
    id: number;
    onClose: () => void;
}

interface IMatch {
    id: number;
    user_1: number;
    user_2: number;
    user_1_username: string;
    user_2_username: string;
    user_1_score: number;
    user_2_score: number;
    date: string;
}

const centerSX : SxProps<Theme> = {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
}

export const PopUpHistory  = (props: IPopUpHistoryProps) => {

    const [matches, setMatches] = useState<IMatch[] | undefined>(undefined);
    const {setPopUpID} = useContext<any>(ProfilePopUpContext);
    const {handleError} = useContext<any>(AlertContext);

    useEffect(() => {
        API.getHistory(
            props.id,
            (r: any) => {
                console.log(props.id);
                setMatches(r);
            }, (err: any) => {
                handleError(err.message)
            });
    }, [props.id]);

    return (
        <>
            <Dialog
                open={props.show}
                onClose={props.onClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
            <List
                sx={{
                    width: "600px",
                }}                    
            >
                { (matches && matches.length > 0) ? matches.map((match: IMatch, item: number) => {
                    const labelId = `list-label-${item}`;
                    return (
                        <ListItem
                            sx={{
                                width: "600px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                            key={item}
                        >
                            <ListItemAvatar
                                sx={{
                                    ...centerSX,
                                    cursor: "pointer",
                                }}
                                onClick={() => {setPopUpID(match.user_1); ; props.onClose()}}
                            >
                                <Avatar alt={match.user_1_username} src={`http://${process.env.REACT_APP_LOCAL_IP}:3000/api/public/picture/` + match.user_1_username}/>
                            </ListItemAvatar>
                            <ListItemText
                                id={labelId}
                                primary={match.user_1_username}
                                sx={{
                                    ml: "10px",
                                    justifyContent: "start",
                                    alignItems: "center",
                                    display: "flex",
                                    cursor: "pointer",
                                    width: "160px",
                                    maxWidth: "160px",
                                }}
                                primaryTypographyProps={{
                                    color: match.user_1_score > match.user_2_score ? "green" : "red",
                                    fontSize: "0.9rem",
                                    letterSpacing: "0.15rem",
                                    fontWeight: '800',
                                    fontFamily: 'Open Sans',
                                    overflow: "hidden",
                                }}
                                onClick={() => {setPopUpID(match.user_1); ; props.onClose()}}
                            />
                            <ListItemText id={labelId}
                                primary={match.user_1_score}
                                sx={{...
                                    centerSX,
                                    maxWidth: "50px",
                                }}
                                primaryTypographyProps={{
                                    fontSize: "1.8rem",
                                }}
                            />
                            <Divider
                                sx={{
                                    padding: "0px 10px",
                                    borderColor: "black",
                                    borderRadius: "5px",
                                    borderWidth: "1px",
                                }}
                                
                            />
                            <ListItemText id={labelId}
                                primary={match.user_2_score}
                                sx={{...
                                    centerSX,
                                    maxWidth: "50px",
                                }}
                                primaryTypographyProps={{
                                    fontSize: "1.8rem",
                                }}
                            />
                            <ListItemText id={labelId}
                                primary={match.user_2_username}
                                sx={{
                                    mr: "10px",
                                    justifyContent: "end",
                                    alignItems: "center",
                                    display: "flex",
                                    cursor: "pointer",
                                    width: "160px",
                                    maxWidth: "160px",
                                }}
                                primaryTypographyProps={{
                                    color: match.user_1_score < match.user_2_score ? "green" : "red",
                                    fontSize: "0.9rem",
                                    letterSpacing: "0.15rem",
                                    fontWeight: '800',
                                    fontFamily: 'Open Sans',
                                    overflow: "hidden",
                                }}
                                onClick={() => {setPopUpID(match.user_2); ; props.onClose()}}
                            />
                            <ListItemAvatar
                                sx={{
                                    ...centerSX,
                                    cursor: "pointer",
                                }}
                                onClick={() => {setPopUpID(match.user_2); props.onClose()}}
                            >
                                <Avatar alt={match.user_1_username} src={`http://${process.env.REACT_APP_LOCAL_IP}:3000/api/public/picture/` + match.user_2_username}/>
                            </ListItemAvatar>
                        </ListItem>
                    );
                    })
                :
                    <ListItem>
                        <ListItemText
                            primary="History is empty."
                            sx={centerSX}
                        />
                    </ListItem>
                }
            </List>
            </Dialog>
        </>
    );
}
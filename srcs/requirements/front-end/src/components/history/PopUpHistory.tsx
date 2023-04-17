import { Theme } from "@emotion/react";
import { Avatar, Dialog, Divider, List, ListItem, ListItemAvatar, ListItemText, SxProps, createTheme } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { RxCross1 } from "react-icons/rx";
import { ProfilePopUpContext } from "../../contexts/ProfilePopUp.context";

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

const db: any[] = [
    {
        id: 1,
        user_1: 1,
        user_2: 3,
        user_1_username: "user1",
        user_2_username: "user2",
        user_1_score: 2,
        user_2_score: 1,
        date: "2021-10-10 10:10:10",
    },
    {
        id: 2,
        user_1: 2,
        user_2: 3,
        user_1_username: "user1",
        user_2_username: "user2",
        user_1_score: 2,
        user_2_score: 1,
        date: "2021-10-10 10:10:10",
    },
    {
        id: 3,
        user_1: 2,
        user_2: 3,
        user_1_username: "usfgnmfgrfdesfeskm",
        user_2_username: "usnhujikrfesfefesf2",
        user_1_score: 2,
        user_2_score: 1,
        date: "2021-10-10 10:10:10",
    },
    {
        id: 4,
        user_1: 2,
        user_2: 3,
        user_1_username: "user1",
        user_2_username: "user2",
        user_1_score: 2,
        user_2_score: 1,
        date: "2021-10-10 10:10:10",
    },
]

const theme = createTheme({
    typography: {
      fontFamily: [
        'Open Sans',
      ].join(','),
    },});

const centerSX : SxProps<Theme> = {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
}

export const PopUpHistory  = (props: IPopUpHistoryProps) => {

    const [matches, setMatches] = useState<IMatch[] | undefined>(db);
    const {setPopUpID} = useContext<any>(ProfilePopUpContext);

    useEffect(() => {
        // fetch(`http://localhost:3001/api/history/list/${props.id}`)
    }, []);

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
                { db ? db.map((match: IMatch, item: number) => {
                    const labelId = `checkbox-list-label-${item}`;
                    return (
                        <ListItem
                            sx={{
                                width: "600px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <ListItemAvatar
                                sx={{
                                    ...centerSX,
                                    cursor: "pointer",
                                }}
                                onClick={() => setPopUpID(match.user_1)}
                            >
                                <Avatar alt={match.user_1_username} src={"http://localhost:3000/api/public/picture/" + match.user_1_username}/>
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
                                onClick={() => setPopUpID(match.user_1)}
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
                                onClick={() => setPopUpID(match.user_2)}
                            />
                            <ListItemAvatar
                                sx={{
                                    ...centerSX,
                                    cursor: "pointer",
                                }}
                                onClick={() => setPopUpID(match.user_2)}
                            >
                                <Avatar alt={match.user_1_username} src={"http://localhost:3000/api/public/picture/" + match.user_2_username}/>
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
import React, { CSSProperties, useContext, useEffect, useLayoutEffect, useRef } from "react";
import { useState } from "react";
import io, { Socket } from "socket.io-client";
import axios from "axios";
//BUG: replace the path of create_socket
import App from "../../App";
// import "./pong.css";
import Style from "./pong.module.css";
import { Ball } from "./ball";
import { Paddle } from "./paddle";
import { PopupWinLose} from "./modalpong";
import { Navigate, useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { IconContext } from "react-icons";
import Create_socket from "../../network/chat.socket";
import { APP } from "../../network/app";
import { User } from "../../dtos/chat.dto";
import { BsCheck, BsX } from "react-icons/bs";
import { NavBar } from "../../components/communs/NavBar";


export default function HomePong() {
	const [currentUser, setCurrentUser] = useState<any>(null);
	const [triggerPong, setTriggerPong] = React.useState(0);
	const [waitingForGame, setWaitingForGame] = React.useState(false);
	const navigate = useNavigate();
	const socket = Create_socket();

	const [trigger, setTrigger] = React.useState<number>(0);
	const roomContainer = useRef<HTMLDivElement>(null);
	const [rooms, setRooms] = useState<any>([]);
	const [invitations, setInvitations] = useState<any>([]);
	const [waitTrigger, setWaitTrigger] = useState<boolean>(false);
	const [renderReact, setRenderReact] = useState<number>(0);

	useEffect(() => {
		const getRooms = async () => {
			try {
				const all_games = await APP.post("/pong/get_games_rooms")
				console.log("all_games = ", all_games.data);
				setRooms(all_games.data);
				console.log("all_games = ", all_games.data);

				if (roomContainer.current) {
					roomContainer.current.scrollTop = roomContainer.current.scrollHeight;
				}
			} catch (error) {
				console.error(error);
			}
		};
		getRooms();
	}, [renderReact]);
	
	
	useEffect(() => {
		const getCurrentUser = async () => {
			try {
				const res = await APP.get("/user/me");
				const all_invitations = await APP.post("/pong/get_invitations_pong", res.data);
				setInvitations(all_invitations.data);
				setCurrentUser(res.data);
			} catch (error) {
				console.error(error);
			}
		};
		getCurrentUser();
	}, [renderReact]);

	const isMatched = async (): Promise<any> => {
		const ret = await APP.post("/pong/is_matched");
		console.log("isMatched = ", ret.data);
		if (ret.data != null)
			return ret.data;
		return null;
	}

	const addPlayerToList = async (user: User) => {
		try {
			const res = await APP.post("/pong/add_player_to_waiting_list", currentUser);
		}
		catch (error) {
			console.error(error);
		}
	}

	const enterInWaitingFile = async () => {
		const in_game = await APP.post("/pong/is_player_is_in_game", currentUser);
		if (in_game.data === true)
		{
			console.log("player is in game");
			navigate("/pong", {state: {
			}});
		}
		const res = await APP.post("/pong/is_player_in_waiting_list", currentUser);
		if (res.data === false)
		{
			console.log("player is not in waiting list, added")
			await addPlayerToList(currentUser);
			const is_match = await isMatched();
			if (!is_match)
			{
				console.log("not matched");
				//put message waiting
				socket?.emit("joinWaitingRoom");
				setWaitingForGame(true);
			}
			else
			{
				console.log("enterInWaitingFile : is_match = ", is_match);
				setWaitingForGame(false);
				socket?.emit("joinWaitingRoom", is_match);
			}
		}
	}

	const leaveWaitingFile = async () => {
		socket?.emit("leaveWaitingRoom");
		await APP.post("/pong/remove_player_from_waiting_list", currentUser);
		setWaitingForGame(false);
		setWaitTrigger(false);
	}

	const spectateGame = async (room: any) => {
		console.log("spectateGame : room = ", room);
		console.log("socket = ", socket);
		socket?.emit("changeGame", room.name);
		navigate("/pong", {state: {
			game_name_param: room.name,
	}});
	}

	socket?.on("startGame", (data: any) => {
		console.log("starting the game")
		setWaitingForGame(false);
			const clearWait = async () => {
				await APP.post("/pong/clear_waiting_list");
			}
			clearWait();
		navigate("/pong", {state: {
		}});
	});

	socket.on('renderReact', (data: any) => {
		setRenderReact(renderReact + 1);
	});

	const acceptInvitation = async (invitation: any) => {
		await APP.post("/pong/delete_invitation", invitation);
		navigate("/pong", {state: {
			user: invitation.sender_player_login, 
			opponent: invitation.invited_player_login,
		}});
	}

	const refuseInvitation = async (invitation: any) => {
		await APP.post("/pong/delete_invitation", invitation);
		const all_invitations = await APP.post("/pong/get_invitations_pong", currentUser);
		socket.emit('refusePlay', invitation);
		setRenderReact(renderReact + 1);
		setInvitations(all_invitations.data);
	}

	return (
		<div className="flex flex-row w-full h-full">
            <NavBar/>
            <div className={Style['homepong']}>
                <h1 className={Style['homepong-title']}>LOBBY</h1>
                <div className={Style['homepong-container']}>

                    {/* <button className={Style['join-waiting-list']} onClick={() =>{
                        enterInWaitingFile();
                    } }
                    >Join Waiting List

                    </button> */}
                    <div className={Style['game-list']}>
                            <h1 className={Style['game-title']}>Invitation list</h1>
                                {invitations.map((invitation : any) =>(
                                <li key={invitation.id} className={Style["li-line"]}>
                                    <div className={Style['line-game-room']}>
                                        <div className={Style['room-game-name']}>{invitation.sender_player_login} invited you</div>
                                        <button
                                            // type="submit"
                                            className={Style['game-room-image']}
                                            onClick={() => {
                                                APP.post("/pong/delete_invitation", invitation);
                                                navigate("/pong", {state: {
                                                    user: invitation.sender_player_login, 
                                                    opponent: invitation.invited_player_login,
                                                }});
                                                // navigate("/pong");
                                            }}
                                            >
                                            <IconContext.Provider value={{className: Style['icon-game-room']}}>
                                                <BsCheck />
                                            </IconContext.Provider>

                                        </button>
                                        <button
                                            type="submit"
                                            className={Style['game-room-image']}
                                            onClick={() => {
                                                refuseInvitation(invitation);
                                            }}
                                            >
                                            <IconContext.Provider value={{className: Style['icon-game-room']}}>
                                                <BsX />
                                            </IconContext.Provider>

                                        </button>
                                    </div>
                                </li>
                                ))}	
                    </div>
                    <div>

					{waitTrigger ? 
					<button className={Style['join-waiting-search']} onClick={() =>{
						leaveWaitingFile();
					} }>
						<div className={Style['body-waiting-search']}>
							<div className={Style['play-search']}>
								Search Game
							</div>
							<div className={Style['resize-animation']}>
								<div className={Style['lds-roller']}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
							</div>
							{/* <div className={Style['lds-dual-ring']}></div> */}
						</div>
					</button> 
					
					: <button className={Style['join-waiting-list']} onClick={() =>{
                            enterInWaitingFile();
							setWaitTrigger(true);
                        } }>
                        <div className={Style['body-waiting-list']} >
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <div className={Style['play-game']}>
                                Play Game
                            </div>
                        </div>
                        </button>}

                    </div>

                    <div className={Style['game-list']}>
                        {/* <div className="center-line"> */}
                            <h1 className={Style['game-title']}>Game list</h1>
                                {rooms.map((room : any) =>(
                                    <li key={room.id} className={Style["li-line"]}>
                                    <div className={Style['line-game-room']}>
                                        <div className={Style['room-game-name']}>{room.name}</div>
                                        <button
                                            type="submit"
                                            className={Style['game-room-image']}
                                            onClick={() => {
												spectateGame(room);
											}}
                                            >
                                            <IconContext.Provider value={{className: Style['icon-game-room']}}>
                                                <FaEye />
                                            </IconContext.Provider>

                                        </button>
                                    </div>
                                </li>
                                ))}	
                        {/* </div> */}
                    </div>
                </div>
                    {/* <div>
                        {waitingForGame ? (<p>Waiting for a game</p>) : ""}
                    </div> */}
            </div>
		</div>
		
	)
}
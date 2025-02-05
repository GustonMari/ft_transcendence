import React, { useEffect, useRef } from "react";
import { useState } from "react";
//BUG: replace the path of create_socket
import Style from "./pong.module.css";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { IconContext } from "react-icons";
import Create_socket from "../../network/chat.socket";
import { APP } from "../../network/app";
import { User } from "../../dtos/chat.dto";
import { BsCheck, BsX } from "react-icons/bs";
import { NavBar } from "../../components/communs/NavBar";
// import { AlertContext } from "../../contexts/Alert.context";


export default function HomePong() {
	const [currentUser, setCurrentUser] = useState<any>(null);
	// const [waitingForGame, setWaitingForGame] = React.useState(false); // BUG: can we delete this?
	const navigate = useNavigate();
	//TODO changer ce mode de creation de socket
	const socket = Create_socket();

	const roomContainer = useRef<HTMLDivElement>(null);
	const [rooms, setRooms] = useState<any>([]);
	const [invitations, setInvitations] = useState<any>([]);
	const [waitTrigger, setWaitTrigger] = useState<boolean>(false);
	const [renderReact, setRenderReact] = useState<number>(0);

    // const {handleError}: any = useContext(AlertContext);

	useEffect(() => {
		const getRooms = async () => {
			try {
				const all_games = await APP.post("/pong/get_games_rooms");
				setRooms(all_games.data);

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
		if (ret.data != null)
			return ret.data;
		return null;
	}

	const addPlayerToList = async (user: User) => {
		try {
			await APP.post("/pong/add_player_to_waiting_list", currentUser);
		}
		catch (error) {
			console.error(error);
		}
	}

	const enterInWaitingFile = async () => {
		const in_game = await APP.post("/pong/is_player_is_in_game", currentUser);
		if (in_game.data === true)
		{
			// setWaitingForGame(false);
			// const clearWait = async () => {
			// 	await APP.post("/pong/clear_waiting_list");
			// }
			// clearWait();
			navigate("/pong", {state: {
			}});
		}
		else 
		{
			const res = await APP.post("/pong/is_player_in_waiting_list", currentUser);
			if (res.data === false)
			{
				await addPlayerToList(currentUser);
				const is_match = await isMatched();
				if (!is_match)
					socket?.emit("joinWaitingRoom", null);
				else
					socket?.emit("joinWaitingRoom", is_match);
			}
		}
	}

	const leaveWaitingFile = async () => {
		socket?.emit("leaveWaitingRoom");
		await APP.post("/pong/remove_player_from_waiting_list", currentUser);
		setWaitTrigger(false);
	}

	const spectateGame = async (room: any) => {
		socket?.emit("changeGame", room.name);
		navigate("/pong", {state: {
			game_name_param: room.name,
	}});
	}

	socket?.on("startGame", (data: any) => {
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

	const refuseInvitation = async (invitation: any) => {
		await APP.post("/pong/delete_invitation", { id: invitation.id });
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
                    <div className={Style['game-list']}>
                            <h1 className={Style['game-title']}>Invitation list</h1>
                                {invitations.map((invitation : any) =>(
                                <li key={invitation.id} className={Style["li-line"]}>
                                    <div className={Style['line-game-room']}>
                                        <div className={Style['room-game-name']}>{invitation.sender_player_login} invited you</div>
                                        <button
                                            className={Style['game-room-image']}
                                            onClick={() => {
                                                APP.post("/pong/delete_invitation", invitation);
                                                navigate("/pong", {state: {
                                                    user: invitation.sender_player_login, 
                                                    opponent: invitation.invited_player_login,
                                                }});
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
                    </div>
                </div>
            </div>
		</div>
		
	)
}
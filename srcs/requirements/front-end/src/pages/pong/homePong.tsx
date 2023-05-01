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


export default function HomePong() {
	const [currentUser, setCurrentUser] = useState<any>(null);
	const [triggerPong, setTriggerPong] = React.useState(0);
	const [waitingForGame, setWaitingForGame] = React.useState(false);
	const navigate = useNavigate();
	const socket = Create_socket();

	const [trigger, setTrigger] = React.useState<number>(0);
	const roomContainer = useRef<HTMLDivElement>(null);
	const [rooms, setRooms] = useState<any>([]);


	useEffect(() => {
		const getRooms = async () => {
			try {
				const all_games = await APP.post("/pong/get_games_rooms")
				setRooms(all_games.data);
				if (roomContainer.current) {
					roomContainer.current.scrollTop = roomContainer.current.scrollHeight;
				  }
			} catch (error) {
				console.error(error);
			}
		};
		getRooms();
		// console.log("rooms = ", rooms);
	}, [trigger/* , define_room */]);

	const render_react_pong = () => {
		setTrigger((p) => p + 1);
	}

	useEffect(() => {
		const getCurrentUser = async () => {
			try {
				const res = await APP.get("/user/me");

				setCurrentUser(res.data);
			} catch (error) {
				console.error(error);
			}
		};
		getCurrentUser();
	}, []);

	const isMatched = async (): Promise<any> => {
		const ret = await APP.post("/pong/is_matched");
		// console.log("isMatched = ", ret.data);
		if (ret.data != null)
			return ret.data;
		return null;
	}

	const addPlayerToList = async (user: User) => {
		try {
			// const res = await APP.post("/pong/add_player_to_waiting_list", {currentUser: currentUser});
			const res = await APP.post("/pong/add_player_to_waiting_list", currentUser);
			// console.log("addPlayerToList = ", res.data);
		}
		catch (error) {
			console.error(error);
		}
	}

	const enterInWaitingFile = async () => {
		// console.log("enterInWaitingFile: currentUser = ", currentUser);
		await addPlayerToList(currentUser);
		const is_match = await isMatched();
		if (!is_match)
		{
			//put message waiting
			// console.log('is_match = null');
			socket?.emit("joinWaitingRoom");
			setWaitingForGame(true);
		}
		else
		{
			setWaitingForGame(false);
			// await APP.post("/pong/clear_waiting_list");
			// console.log("socket = ", socket);
			socket?.emit("joinWaitingRoom", is_match);
			// console.log("is_match = ", is_match);

			// navigate("/pong", {state: {
			// 	user: is_match.player1, 
			// 	opponent: is_match.player2,
			// }});
		}
	}

	socket?.on("startGame", (data: any) => {
		// console.log("datatatatatattat = ", data);
		// console.log("startGame");
		setWaitingForGame(false);

		navigate("/pong", {state: {
				user: data.is_match.player1, 
				opponent: data.is_match.player2,
		}});
	});

	return (
		<div>
		<div className={Style['homepong']}>
			<h1 className={Style['homepong-title']}>LOBBY</h1>
			<div className={Style['homepong-container']}>

				{/* <button className={Style['join-waiting-list']} onClick={() =>{
					enterInWaitingFile();
				} }
				>Join Waiting List

				</button> */}
				<button className={Style['join-waiting-list']} onClick={() =>{
					enterInWaitingFile();
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
				</button>

				<div className={Style['game-list']}>
						<h1 className={Style['game-title']}>Game list</h1>
							{rooms.map((room : any) =>(
							<li key={room.id}>
								<div className={Style['line-game-room']}>
									<div className={Style['room-game-name']}>{room.name}</div>
									<button
										type="submit"
										className={Style['game-room-image']}
										onClick={() => {}}
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
				{/* <div>
					{waitingForGame ? (<p>Waiting for a game</p>) : ""}
				</div> */}
			</div>
		</div>
		
	)
}
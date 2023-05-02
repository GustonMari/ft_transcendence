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
import { useLocation, useParams } from "react-router-dom";
// import { URLSearchParams } from "url";
import { IconContext } from "react-icons";
import { BsPlayFill } from "react-icons/bs";
import { BiPause } from "react-icons/bi";
import Create_socket from "../../network/chat.socket";
import { APP } from "../../network/app";
import { Navigate, useNavigate } from "react-router-dom";

// import kd from "./keydrown";


const PongContext = React.createContext<any>(null);
export default function Pong() {
	const [ready, setReady] = useState(false);
	const [currentUser, setCurrentUser] = useState<any>(null);
	const [isMaster, setIsMaster] = useState<boolean>(false);
	const [gameName, setGameName] = useState<string>("");
	const [isSlave, setIsSlave] = useState<boolean>(false);
	const [isWatcher, setIsWatcher] = useState<boolean>(false);
	const [userTo, setUserTo] = useState<any>(null);
	const socket = Create_socket();
	const location = useLocation();

	useLayoutEffect(() => {
	  const getUsers = async () => {
		try {
			const res = await APP.get("/user/me");
			setCurrentUser(res.data);
			const is_master = await APP.post("/pong/is_user_master", {
				login: res.data.login,
			});

			const is_slave = await APP.post("/pong/is_user_slave", {
				login: res.data.login,
			});
			let game_name;
			if (is_master.data || is_slave.data) {
				game_name = await APP.post("/pong/get_game_name", {
					login: res.data.login,
				});
				game_name = game_name.data;
			}
			else {
				const { game_name_param } = location.state;
				game_name = game_name_param;
			}
			let game = await APP.post('/pong/get_game', {game_name: game_name})
			if (is_master.data) {
				setIsMaster(true);
				setIsSlave(false);
				await APP.post('/pong/init_game', {game: game});
			} else {
				setIsMaster(false);
				
				if (is_slave.data) {
					setIsSlave(true);
				}
				else {
					setIsWatcher(true);
				}
			}
			setGameName(game_name);

				setReady(true); // set ready state to true after data has been fetched
				// setTrigger(trigger + 1);
		} catch (error) {
			console.error(error);
		}
	};
		getUsers();
	}, []);

	if (!ready) {
	  return (
		<div>
		  <h1>Loading...</h1>
		</div>
	  );
	} else if (currentUser && isMaster && !isSlave && !isWatcher) {
	  return (
		<>
		  {socket && (
			<PongContext.Provider value={{ socket }}>
			  <ExecutePong isMaster={isMaster} gameName={gameName} isWatcher={isWatcher} /* rooms={rooms} *//>
			</PongContext.Provider>
		  )}
		</>
	  );
	} else if (currentUser && isSlave && !isMaster && !isWatcher) {
	  return (
		<>
		  {socket && (
			<PongContext.Provider value={{ socket }}>
			  <ExecutePong isMaster={isMaster} gameName={gameName} isWatcher={isWatcher} /* rooms={rooms} *//>
			</PongContext.Provider>
		  )}
		</>
	  );
	} else {
		return (
			<>
			  {socket && (
				<PongContext.Provider value={{ socket }}>
				  <ExecutePong isMaster={isMaster} gameName={gameName} isWatcher={isWatcher} /* rooms={rooms} *//>
				</PongContext.Provider>
			  )}
			</>
		)
	}
  }
  

export function ExecutePong(props: any) {
	const [ball, setBall] = useState<HTMLDivElement | null>(null);
	const [limit, setLimit] = useState<DOMRect | undefined>(undefined);
	const [trigger, setTrigger] = useState<number>(0);
	const [leftscore, setLeftScore] = useState<number>(0);
	const [rightscore, setRightScore] = useState<number>(0);
	const [changeMap, setChangeMap] = useState<number>(0);
	const [popupwinlose ,setPopupWinLose] = useState<{popup: boolean, winlosemessage: string}>({popup: false, winlosemessage: ""});
	let {isMaster, gameName, isWatcher/* , rooms */} = props;
	let newLimit: DOMRect | undefined;
	let first: boolean = false;
	let playerPaddleLeft = new Paddle(document.getElementById("player-paddle-left") as HTMLDivElement);
	let playerPaddleRight = new Paddle(document.getElementById("player-paddle-right") as HTMLDivElement);
	let	leftUpPressed : boolean = false;
	let leftDownPressed : boolean = false;
	let rightUpPressed : boolean = false;
	let rightDownPressed : boolean = false;
	let collision = document.getElementById("collision");
	const {socket} = useContext(PongContext);
	const kd					= useRef(require('keydrown'));
	const navigate = useNavigate();


	let pongBall: Ball; 



	useEffect(() => {
		const ballElement = document.getElementById("ball") as HTMLDivElement;

		let rect;
		
		const divElement = document.getElementById("pong-body");
		if (divElement)
		rect = divElement?.getBoundingClientRect();
		
		if (ballElement && rect) {
			setLimit(rect);
			newLimit = document.getElementById("pong-body")?.getBoundingClientRect();
			setBall(ballElement);
		}
	}, []);
		
		const DownHandler = async () => {
			
			if (kd.current.UP.isDown() && !isWatcher) {
			rightUpPressed = true;
			if (isMaster) {
				if (newLimit && playerPaddleLeft) {
					socket.emit('updatePaddleLeft', {paddle: 'up', gameName: gameName});
				}
			} else if (!isWatcher) {
				if (newLimit && playerPaddleRight) {
					socket.emit('updatePaddleRight', {paddle: 'up', gameName: gameName});
				}
			}
			} else {
				rightUpPressed = false;
			}
			if (kd.current.DOWN.isDown()) {
				rightDownPressed = true;
				if (isMaster) {
					if (newLimit && playerPaddleLeft) {
						socket.emit('updatePaddleLeft', {paddle: 'down', gameName: gameName});
					}
				} else if (!isMaster && !isWatcher) {
					if (newLimit && playerPaddleRight) {
						socket.emit('updatePaddleRight', {paddle: 'down', gameName: gameName});
					}
				}
			} else {
				rightDownPressed = false;
			}
			if (kd.current.W.isDown()) {
				leftUpPressed = true;
			} else {
				leftUpPressed = false;
			}
			if (kd.current.S.isDown()) {
				leftDownPressed = true;
			} else {
				leftDownPressed = false;
			}
	}

	const UpHandler = async ()  => {
		if (!isWatcher)
		{
			kd.current.W.up(() => {
				leftUpPressed = false;
			});
			kd.current.S.up(() => {
				leftDownPressed = false;
			});
			kd.current.UP.up(() => {
				rightUpPressed = false;
			});
			kd.current.DOWN.up(() => {
				rightDownPressed = false;
			});
		}
	}

			const update = (lastTime: number, pongBall: Ball, playerPaddleLeft: Paddle, playerPaddleRight: Paddle, limit?: DOMRect) => (time: number) => {

				if (lastTime != undefined || lastTime != null) {
					const delta = time - lastTime;
					if (first === false) {
						newLimit = document.getElementById("pong-body")?.getBoundingClientRect();
						first = true;
					}
					if (newLimit /* && !isWatcher */)
					{
						pongBall.update(delta, playerPaddleLeft, playerPaddleRight, gameName, isMaster);
					}
					kd.current.run(function () {
						kd.current.tick();
					});
					DownHandler()
					UpHandler();
					window.addEventListener('resize', () => {
						newLimit = document.getElementById("pong-body")?.getBoundingClientRect();
						// console.log('resize');
					});
				}
				let ret_timeout = setTimeout(() => {
						lastTime = time;
						window.requestAnimationFrame(update(lastTime, pongBall, playerPaddleLeft, playerPaddleRight, newLimit));
						clearTimeout(ret_timeout);
				}, 1);
				
			};

			
			
			useEffect(() => {
				if (ball && socket) {
					pongBall = new Ball(ball, setLeftScore, setRightScore, socket);
					socket?.on('GameUpdated', (data: any) => {
						pongBall.x = data.x;
						pongBall.y = data.y;
						pongBall.setLeftScore(data.leftScore);
						pongBall.setRightScore(data.rightScore);
						playerPaddleLeft.position = data.paddleLeftY;
						playerPaddleRight.position = data.paddleRightY;
					});
					let lastTime: number = 0;
						window.requestAnimationFrame(update(lastTime, pongBall, playerPaddleLeft, playerPaddleRight));
			  }
			}, [ball]);
			socket.on('GameFinished', async (data: any) => {
				let msg_tmp = '';
						
				if (isMaster && data.leftScore >= 11)
				{
					msg_tmp = 'You won'
				}
				else if (!isWatcher && !isMaster && data.rightScore >= 11)
				{
					msg_tmp = 'You won!';
				}
				else if (isMaster && data.rightScore >= 11)
				{
					msg_tmp = 'You lose :(';
				}
				else if (!isWatcher &&  !isMaster && data.leftScore >= 11)
				{
					msg_tmp = 'You lose :(';
				}
				else if (isWatcher)
				{
					navigate("/game");
				}
				if (!isWatcher)
				{
					setPopupWinLose({popup: true, winlosemessage: msg_tmp});
					await APP.post("/pong/set_game_over", {
						game_name: gameName
					});
					const is_game_over = await APP.post("/pong/is_game_over", {
						game_name: gameName
					});
					// setTrigger(trigger += 1);
				}
			})

			const click = (map: number) => {
				setChangeMap(map);
			}

			useEffect(() => {
				const map_background = document.getElementById("main-window");
				const pong_game = document.getElementById("pong-body");
				if (map_background && pong_game && changeMap === 1) {
							pong_game.style.backgroundColor = 'black';
							document.documentElement.style.setProperty('--color-paddle', 'red');
					} else if (map_background && pong_game && changeMap === 2) {
						pong_game.style.backgroundColor = '#59f7f785';
						document.documentElement.style.setProperty('--color-paddle', '#f09');
					} else if (map_background && pong_game && changeMap === 3) {
						pong_game.style.backgroundColor = 'rgba(238, 130, 238, 0.5)';
						document.documentElement.style.setProperty('--color-paddle', '#0ff');
					}
			}, [changeMap])


	return (
		<div className={Style['container-game']} id="main-window">
			<div>
				{popupwinlose.popup ? (<PopupWinLose popupwinlose={popupwinlose} setPopupWinLose={setPopupWinLose} isMaster={isMaster} socket={socket} gameName={gameName}/> ) : (<></>)}
			</div>
			 <div className={Style['container-button-map']}>
				<button className={Style['button-map']} onClick={() => click(1)}>
					1
				</button>
				<button className={Style['button-map']} onClick={() => click(2)}>2</button>
				<button className={Style['button-map']} onClick={() => click(3)}>3</button>
			</div>
			<div className={Style['responsive-game']}>

				<div className={Style['game']} >
					<div className={Style['pong-body']} id="pong-body">
						<span id="collision"></span>
						<title>Pong</title>
						<div className={Style.score}>
							<div className={Style['left-score']} id="score-one">{leftscore}</div>
							<div className={Style['right-score']} id="score-two">{rightscore}</div>
						</div>
							<div className={`${Style.ball} `} id="ball">
								<div className={`${Style.insideball} `} ></div>
							</div>
						<div className={`${Style.paddle} ${Style.left}`} id="player-paddle-left"></div>
						<div className={`${Style.paddle} ${Style.right}`} id="player-paddle-right"></div>
					</div>
				</div>
			</div>
				<div className={Style['container-button-play-stop']}>
					<div>
						<button 
							className={Style['button-play']} 
							onClick={() => {socket.emit('resumeGame', gameName)}}>
								<IconContext.Provider value={{className: Style['icon-center']}}>
									<BsPlayFill />
								</IconContext.Provider>
						</button>
					</div>
					<div>
						<button 
							className={Style['button-pause']} 
							onClick={() => {socket.emit('pauseGame', gameName)}}>
								<IconContext.Provider value={{className: Style['icon-center']}}>
									<BiPause className="icon-center"/>
								</IconContext.Provider>
						</button>
					</div>
			</div>
		</div>
	);
}
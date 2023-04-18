// import React, { CSSProperties, useContext, useEffect, useLayoutEffect, useRef } from "react";
// import { useState } from "react";
// import io, { Socket } from "socket.io-client";
// import axios from "axios";
// //BUG: replace the path of create_socket
// import Create_socket from "../chat/socket";
// import { APP } from "../../api/app";
// import App from "../../App";
// // import "./pong.css";
// import Style from "./pong.module.css";
// import { Ball } from "./ball";
// import { Paddle } from "./paddle";
// import { PopupWinLose} from "./modalpong";
// import { User } from "../chat/dto/chat.dto";
// // import kd from "./keydrown";


// const PongContext = React.createContext<any>(null);
// // const PongContext = React.createContext<Socket | null>(null);
// export default function Pong() {
// 	const [ready, setReady] = useState(false);
// 	const [currentUser, setCurrentUser] = useState<any>(null);
// 	const [isMaster, setIsMaster] = useState<boolean>(false);
// 	const [gameName, setGameName] = useState<string>("");
// 	const [isSlave, setIsSlave] = useState<boolean>(false);
// 	const [isWatcher, setIsWatcher] = useState<boolean>(false);
// 	const [userTo, setUserTo] = useState<any>(null);
// 	const socket = Create_socket();
  
// 	useLayoutEffect(() => {
// 	  const getUsers = async () => {
// 		try {
// 			const res = await APP.get("/user/me");
// 			setCurrentUser(res.data);
// 			const is_master = await APP.post("/pong/is_user_master", {
// 				login: res.data.login,
// 			});

// 			const is_slave = await APP.post("/pong/is_user_slave", {
// 				login: res.data.login,
// 			});
// 			const game_name = await APP.post("/pong/get_game_name", {
// 				login: res.data.login,
// 			});

// 			console.log(
// 				"Bonjour ismaster.data = ",
// 				is_master.data,
// 				"res.data.login = ",
// 				res.data.login
// 			);
// 			if (is_master.data) {
// 				setIsMaster(true);
// 				setIsSlave(false);
// 				// console.log("master zooo");
// 			} else {
// 				setIsMaster(false);
				
// 				if (is_slave.data) {
// 					setIsSlave(true);
// 					// console.log("slave zooo");
// 				}
// 				else {
// 					setIsWatcher(true);
// 					// console.log("watcher zooo");
// 				}
// 			}
// 			setGameName(game_name.data);
// 			setReady(true); // set ready state to true after data has been fetched
// 			// console.log("is_master = ", is_master.data, "is_slave = ", is_slave.data)
// 		} catch (error) {
// 			console.error(error);
// 		}
// 		// console.log("ismaster = ", isMaster, "isSlave = ", isSlave)
// 	  };
// 		getUsers();
// 	}, []);
  
// 	if (!ready) {
// 	  return (
// 		<div>
// 		  <h1>Loading...</h1>
// 		</div>
// 	  );
// 	} else if (currentUser && isMaster && !isSlave && !isWatcher) {
// 	  console.log("MASTER =", isMaster, "date =", Date.now());
// 	  return (
// 		<>
// 		  {socket && (
// 			<PongContext.Provider value={{ socket }}>
// 			  <ExecutePong isMaster={isMaster} gameName={gameName}/>
// 			</PongContext.Provider>
// 		  )}
// 		</>
// 	  );
// 	} else if (currentUser && isSlave && !isMaster && !isWatcher) {
// 	  console.log(" NON MASTER =", isMaster, "date =", Date.now());
// 	  return (
// 		<>
// 		  {socket && (
// 			<PongContext.Provider value={{ socket }}>
// 			  <ExecutePong isMaster={isMaster} gameName={gameName}/>
// 			</PongContext.Provider>
// 		  )}
// 		</>
// 	  );
// 	} else {
// 	  return (
// 		<div>
// 		  <h1>watcher</h1>
// 		</div>
// 	  );
// 	}
//   }
  

// export function ExecutePong(props: any) {
// 	const [ball, setBall] = useState<HTMLDivElement | null>(null);
// 	const [limit, setLimit] = useState<DOMRect | undefined>(undefined);
// 	const [trigger, setTrigger] = useState<number>(0);
// 	const [leftscore, setLeftScore] = useState<number>(0);
// 	const [rightscore, setRightScore] = useState<number>(0);
// 	const [changeMap, setChangeMap] = useState<number>(0);
// 	const [popupwinlose ,setPopupWinLose] = useState<{popup: boolean, winlosemessage: string}>({popup: false, winlosemessage: ""});
// 	let {isMaster, gameName} = props;
// 	let newLimit: DOMRect | undefined;
// 	let first: boolean = false;
// 	let playerPaddleLeft = new Paddle(document.getElementById("player-paddle-left") as HTMLDivElement);
// 	let playerPaddleRight = new Paddle(document.getElementById("player-paddle-right") as HTMLDivElement);
// 	let	leftUpPressed : boolean = false;
// 	let leftDownPressed : boolean = false;
// 	let rightUpPressed : boolean = false;
// 	let rightDownPressed : boolean = false;
// 	let collision = document.getElementById("collision");
// 	const {socket} = useContext(PongContext);
// 	const kd					= useRef(require('keydrown'));


// 	useEffect(() => {
// 		console.log ("isMasterrrrrrrrrrrrrrrrrrrrrrrrrrr = ", isMaster);
// 		const ballElement = document.getElementById("ball") as HTMLDivElement;
		
// 		let rect;
		
// 		const divElement = document.getElementById("pong-body");
// 		if (divElement)
// 		rect = divElement?.getBoundingClientRect();
		
// 		if (ballElement && rect) {
// 			setLimit(rect);
// 			newLimit = document.getElementById("pong-body")?.getBoundingClientRect();
// 			setBall(ballElement);
// 		}
// 	}, []);

	
// 	const DownHandler = async () => {

// 		if (kd.current.UP.isDown()) {
// 			rightUpPressed = true;
// 			if (isMaster) {
// 				if (newLimit && playerPaddleLeft) {
// 					socket.emit('updatePaddleLeft', 'up');
// 				}
// 			} else {
// 				if (newLimit && playerPaddleRight) {
// 					socket.emit('updatePaddleRight', 'up');
// 				}
// 			}
// 			} else {
// 				rightUpPressed = false;
// 			}
// 			if (kd.current.DOWN.isDown()) {
// 				rightDownPressed = true;
// 				if (isMaster) {
// 					if (newLimit && playerPaddleLeft) {
// 						socket.emit('updatePaddleLeft', 'down');
// 					}
// 				} else if (!isMaster) {
// 					if (newLimit && playerPaddleRight) {
// 						socket.emit('updatePaddleRight', 'down');
// 					}
// 				}
// 			} else {
// 				rightDownPressed = false;
// 			}
// 			if (kd.current.W.isDown()) {
// 				leftUpPressed = true;
// 			} else {
// 				leftUpPressed = false;
// 			}
// 			if (kd.current.S.isDown()) {
// 				leftDownPressed = true;
// 			} else {
// 				leftDownPressed = false;
// 			}
// 	}

// 	const UpHandler = async ()  => {
// 		kd.current.W.up(() => {
// 			leftUpPressed = false;
// 		  });
// 		  kd.current.S.up(() => {
// 			leftDownPressed = false;
// 		  });
// 		  kd.current.UP.up(() => {
// 			rightUpPressed = false;
// 		  });
// 		  kd.current.DOWN.up(() => {
// 			rightDownPressed = false;
// 		  });
// 	}

// 			const update = (lastTime: number, pongBall: Ball, playerPaddleLeft: Paddle, playerPaddleRight: Paddle, limit?: DOMRect) => (time: number) => {

// 				if (lastTime != undefined || lastTime != null) {
// 					const delta = time - lastTime;
// 					if (first === false) {
// 						newLimit = document.getElementById("pong-body")?.getBoundingClientRect();
// 						first = true;
// 						console.log("first rect of update");
// 					}
// 					if (newLimit)
// 					{
// 								pongBall.update(delta, playerPaddleLeft, playerPaddleRight, gameName);
// 					}
// 					// document.addEventListener("keydown", DownHandler);
// 					// document.addEventListener("keyup", UpHandler);
// 					kd.current.run(function () {
// 						kd.current.tick();
// 					});
// 					DownHandler()
// 					UpHandler();
// 					window.addEventListener('resize', () => {
// 						newLimit = document.getElementById("pong-body")?.getBoundingClientRect();
// 						console.log('resize');
// 					});
// 				}
// 				lastTime = time;
// 				// setTimeout(() => {
// 					window.requestAnimationFrame(update(lastTime, pongBall, playerPaddleLeft, playerPaddleRight, newLimit));

// 				//   }, 1000 / 45);
// 				// window.requestAnimationFrame(update(lastTime, pongBall, playerPaddleLeft, playerPaddleRight, newLimit));
				
// 			};


			
// 			useEffect(() => {
// 				if (ball && socket) {
// 					const pongBall = new Ball(ball, setLeftScore, setRightScore, socket);
// 					let lastTime: number = 0;
// 					window.requestAnimationFrame(update(lastTime, pongBall, playerPaddleLeft, playerPaddleRight));
// 			  }
// 			}, [ball]);

// 			socket.on('GameFinished', (data: any) => {
// 				let msg_tmp = '';

// 				if (isMaster && data.leftScore >= 11)
// 				{
// 					console.log("You won!");
// 					msg_tmp = 'You won'
// 				}
// 				else if (!isMaster && data.rightScore >= 11)
// 				{
// 					console.log("slave won");
// 					msg_tmp = 'You won!';
// 				}
// 				else if (isMaster && data.rightScore >= 11)
// 				{
// 					console.log('master lose');
// 					msg_tmp = 'You lose :(';
// 				}
// 				else if (!isMaster && data.leftScore >= 11)
// 				{
// 					console.log('slave lose');
// 					msg_tmp = 'You lose :(';
// 				}
// 				setPopupWinLose({popup: true, winlosemessage: msg_tmp});
// 			})

// 			// function changeMap(map: number) {

// 			// 	const map_background = document.getElementById("main-window");
// 			// 	if (map_background && map === 1) {
// 			// 		console.log("map1");
// 			// 			map_background.style.backgroundImage = 'url("../../../static/pong/background_pong_2.png")';
				
// 			// 		// map_background?.style.setProperty('--background-image-main', 'url(\'../../../static/pong/background_pong.png\')');
// 			// 		// setGameName('map1');
// 			// 	} else if (map_background && map === 2) {
// 			// 		console.log("map2");
// 			// 		map_background.style.backgroundImage = 'url("../../../static/pong/background_pong_2.png")';

// 			// 		// setGameName('map2');
// 			// 	} else if (map_background && map === 3) {
// 			// 		// setGameName('map3');
// 			// 	}
// 			// }
// 			const click = (map: number) => {
// 				setChangeMap(map);
// 			}

// 			useEffect(() => {
// 				const map_background = document.getElementById("main-window");
// 				const pong_game = document.getElementById("pong-body");
// 				if (map_background && pong_game && changeMap === 1) {
// 						console.log("map1");
// 							// map_background.style.backgroundImage = 'url(../../../static/pong/background_pong_2.png)';
// 							// map_background.style.backgroundImage = 'url(../../../static/pong/chat.png)';
// 							// pong_game.style.backgroundColor = '#ee82ee';
// 							pong_game.style.backgroundColor = 'black';
// 							document.documentElement.style.setProperty('--color-paddle', 'red');
// 							// map_background.style.backgroundColor = 'blue';
// 						// map_background?.style.setProperty('--background-image-main', 'url(\'../../../static/pong/background_pong.png\')');
// 						// setGameName('map1');
// 					} else if (map_background && pong_game && changeMap === 2) {
// 						// map_background.style.backgroundColor = 'yellow';
// 						console.log("map2");
// 						pong_game.style.backgroundColor = '#59f7f785';
// 						document.documentElement.style.setProperty('--color-paddle', '#f09');
// 						// map_background.style.backgroundImage = 'url(../../../static/pong/background_pong_2.png)';

// 						// setGameName('map2');
// 					} else if (map_background && pong_game && changeMap === 3) {
// 						// setGameName('map3');
// 						pong_game.style.backgroundColor = 'rgba(238, 130, 238, 0.5)';
// 						document.documentElement.style.setProperty('--color-paddle', '#0ff');
// 					}
// 			}, [changeMap])


// 	return (
// 		<div className={Style['container-game']} id="main-window">
// 		{/* <h1>Pong game</h1> */}
// 			<div>
// 				{popupwinlose.popup ? (<PopupWinLose popupwinlose={popupwinlose} setPopupWinLose={setPopupWinLose} isMaster={isMaster} socket={socket}/> ) : (<></>)}
// 			</div>
// 			<button className="" onClick={() => click(1)}>Map 1</button>
// 			<button className="" onClick={() => click(2)}>Map 2</button>
// 			<button className="" onClick={() => click(3)}>Map 3</button>
// 			{/* <button className="" onClick={() => changeMap(1)}>Map 1</button> */}
// 			{/* <button className="" onClick={() => changeMap(2)}>Map 2</button> */}
// 			{/* <button className="" onClick={() => changeMap(3)}>Map 3</button> */}
// 				<div className={Style['game']} >
// 					<div className={Style['pong-body']} id="pong-body">
// 						<span id="collision"></span>
// 						<title>Pong</title>
// 						<div className={Style.score}>
// 							<div className={Style['left-score']} id="score-one">{leftscore}</div>
// 							<div className={Style['right-score']} id="score-two">{rightscore}</div>
// 						</div>
// 						<div className={`${Style.ball} `} id="ball"></div>
// 						<div className={`${Style.paddle} ${Style.left}`} id="player-paddle-left"></div>
// 						<div className={`${Style.paddle} ${Style.right}`} id="player-paddle-right"></div>
// 					</div>
// 				</div>
// 		</div>
// 	);
// }

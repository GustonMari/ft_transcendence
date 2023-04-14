import React, { CSSProperties, useContext, useEffect, useLayoutEffect, useRef } from "react";
import { useState } from "react";
import io, { Socket } from "socket.io-client";
import axios from "axios";
//BUG: replace the path of create_socket
import Create_socket from "../chat/socket";
import { APP } from "../../api/app";
import App from "../../App";
// import "./pong.css";
import Style from "./pong.module.css";
import { Ball } from "./ball";
import { Paddle } from "./paddle";
import { User } from "../chat/dto/chat.dto";

const PongContext = React.createContext<any>(null);
// const PongContext = React.createContext<Socket | null>(null);
export default function Pong() {
	const [ready, setReady] = useState(false);
	const [currentUser, setCurrentUser] = useState<any>(null);
	const [isMaster, setIsMaster] = useState<boolean>(false);
	const [userTo, setUserTo] = useState<any>(null);
	const socket = Create_socket();
  
	useLayoutEffect(() => {
	  const getUsers = async () => {
		try {
		  const res = await APP.get("/user/me");
		  setCurrentUser(res.data);
		  const is_master = await APP.post("/pong/is_user_master", {
			login: res.data.login,
		  });
		  console.log(
			"Bonjour ismaster.data = ",
			is_master.data,
			"res.data.login = ",
			res.data.login
		  );
		  if (is_master.data) {
			setIsMaster(true);
			console.log("master zooo");
		  } else {
			setIsMaster(false);
			console.log("slave zooo");
		  }
		  setReady(true); // set ready state to true after data has been fetched
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
	} else if (currentUser && isMaster) {
	  console.log("MASTER =", isMaster, "date =", Date.now());
	  return (
		<>
		  {socket && (
			<PongContext.Provider value={{ socket }}>
			  <ExecutePong isMaster={isMaster} />
			</PongContext.Provider>
		  )}
		</>
	  );
	} else if (currentUser && !isMaster) {
	  console.log(" NON MASTER =", isMaster, "date =", Date.now());
	  return (
		<>
		  {socket && (
			<PongContext.Provider value={{ socket }}>
			  <ExecutePong isMaster={isMaster} />
			</PongContext.Provider>
		  )}
		</>
	  );
	} else {
	  return (
		<div>
		  <h1>watcher</h1>
		</div>
	  );
	}
  }
  

export function ExecutePong(props: any) {
	const [ball, setBall] = useState<HTMLDivElement | null>(null);
	const [limit, setLimit] = useState<DOMRect | undefined>(undefined);
	const [trigger, setTrigger] = useState<number>(0);
	const [leftscore, setLeftScore] = useState<number>(0);
	const [rightscore, setRightScore] = useState<number>(0);
	let isMaster = props.isMaster;
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

	useEffect(() => {
		// console.log('init the game');
		console.log ("isMasterrrrrrrrrrrrrrrrrrrrrrrrrrr = ", isMaster);
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


	const DownHandler = (e: any) => {
		// if (isMaster) {
		// 	console.log("isMaster");
		// 	if (e.keyCode == 87) {
		// 		leftUpPressed = true;
		// 		if (newLimit && playerPaddleLeft) {
		// 			// playerPaddleLeft.position -= 2;
		// 			socket.emit('updatePaddleLeft', 'up');
		// 			console.log("1 up");
		// 		}
		// 	}
		// 	else if (e.keyCode == 83) {
		// 		leftDownPressed = true;
		// 		if (newLimit && playerPaddleLeft) {
		// 			// playerPaddleLeft.position += 2;
		// 			socket.emit('updatePaddleLeft', 'down');
		// 			console.log("1 down");
		// 		}
		// 	}
		// }
		// else {
		// 	if (e.keyCode == 38) {
		// 		rightUpPressed = true;
		// 		console.log("2 up");
		// 	}
		// 	else if (e.keyCode == 40) {
		// 		rightDownPressed = true;
		// 		console.log("2 down");
		// 	}
		// }

		if (e.keyCode == 38) {
			rightUpPressed = true;
			if (isMaster)
			{
				if (newLimit && playerPaddleLeft)
				{
					socket.emit('updatePaddleLeft', 'up');
					console.log("master up", isMaster)
				}
			}
			else
			{
				if (newLimit && playerPaddleRight)
				{
					socket.emit('updatePaddleRight', 'up');
					console.log("slave up")
				}
			}
			// console.log("2 up");
		}
		else if (e.keyCode == 40) {
			rightDownPressed = true;
			if (isMaster)
			{
				if (newLimit && playerPaddleLeft)
				{
					socket.emit('updatePaddleLeft', 'down');
					console.log("master down")
				}
				
			}
			else if (!isMaster)
			{
				if (newLimit && playerPaddleRight)
				{
					socket.emit('updatePaddleRight', 'down');
					console.log("slave down")
				}	
			}
			// console.log("2 down");
		}
		e.preventDefault();
	}
			
			const UpHandler = (e: any) => {
				if (e.keyCode == 87) {

					leftUpPressed = false;
				}
				else if (e.keyCode == 83) {
					leftDownPressed = false;
				}
				if (e.keyCode == 38) {
					rightUpPressed = false;
				}
				else if (e.keyCode == 40) {
					rightDownPressed = false;
				}
			}

			const update = (lastTime: number, pongBall: Ball, playerPaddleLeft: Paddle, playerPaddleRight: Paddle, limit?: DOMRect) => (time: number) => {

				if (lastTime != undefined || lastTime != null) {
					const delta = time - lastTime;
					if (first === false) {
						newLimit = document.getElementById("pong-body")?.getBoundingClientRect();
						first = true;
					}
					if (newLimit)
					{
								pongBall.update(delta, newLimit, playerPaddleLeft, playerPaddleRight);
					}

					document.addEventListener("keydown", DownHandler);
					document.addEventListener("keyup", UpHandler);
					window.addEventListener('resize', () => {
						newLimit = document.getElementById("pong-body")?.getBoundingClientRect();
					});
				}
				lastTime = time;
				window.requestAnimationFrame(update(lastTime, pongBall, playerPaddleLeft, playerPaddleRight, newLimit));
				
			};


			
			useEffect(() => {
				if (ball && socket) {
					const pongBall = new Ball(ball, setLeftScore, setRightScore, socket);
					let lastTime: number = 0;
					window.requestAnimationFrame(update(lastTime, pongBall, playerPaddleLeft, playerPaddleRight));
			  }
			}, [ball]);

	return (
		<div className={Style['container-game']}>
		{/* <h1>Pong game</h1> */}
			<div className={Style['pong-body']} id="pong-body">
				<span id="collision"></span>
				<title>Pong</title>
				<div className={Style.score}>
					<div className={Style['left-score']}>{leftscore}</div>
					<div className={Style['right-score']}>{rightscore}</div>
				</div>
				<div className={`${Style.ball} `} id="ball"></div>
				<div className={`${Style.paddle} ${Style.left}`} id="player-paddle-left"></div>
				<div className={`${Style.paddle} ${Style.right}`} id="player-paddle-right"></div>
			</div>
		</div>
	);
}

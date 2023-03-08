import React, { CSSProperties, useEffect, useRef } from "react";
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


export default function Pong() {

	const [currentUser, setCurrentUser] = useState<any>(null);
	const [userTo, setUserTo] = useState<any>(null);
	const socket = Create_socket();

	

	useEffect(() => {
		const getUsers = async () => {
			try {
				const res = await APP.get("/user/me");
				setCurrentUser(res.data);

				const res2 = await APP.get("/user/get", {
					params: {
						// login: userTo.login,
						login: "gus",
					},
				});
				setUserTo(res2.data);

				// console.log("============= currentUser = ", res.data, " userTo = ", res2.data);
				const create_game = await APP.post("/pong/create_game", {
						master: res.data,
						slave: res2.data,
					});
				// const create_game = await APP.post("/pong/create_game", {
				// 	params: {
				// 		master: res.data,
				// 		slave: res2.data,
				// 		}});
				console.log("create_game = ", create_game);
			} catch (error) {
				console.error(error);
			}
		};
		getUsers();
	}, []);
	// console.log("-currentUser = ", currentUser);
	// console.log("-userTo = ", userTo);



	
	// socket?.emit('createGame', {master: currentUser, slave: userTo});
	// // socket?.on('gameCreated', (data) => {
	// 	// console.log("gameCreated = ", data);
	// 	//TODO: enlever ce qui a en dur ici
	// 	useEffect(() => {
	// 		const start_master_game = async () => {
	// 			const isMaster = await APP.get("/pong/is_user_master", {
	// 				params: {
	// 					login: currentUser.login,
	// 				},
	// 			});
	// 			if (isMaster) {
	// 				// return (
	// 				// 	<>
	// 				// 		{/* <PongContext.Provider value={socket}> */}
	// 				// 			{/* <ExecutePong /> */}
	// 				// 			<div>
	// 				// 				<h1>je suis master: {currentUser.login}</h1>
	// 				// 			</div>
	// 				// 		{/* </PongContext.Provider> */}
	// 				// 	</>
	// 				// )
	// 				console.log("JE SUIS MASTER FDP");
	// 			}
	// 			else {
	// 				// return (
	// 				// 	<div>
	// 				// 		<h1>je suis slave: {userTo.login}</h1>
	// 				// 	</div>
	// 				// );
	// 				console.log("JE SUIS SLAVE FDP");
	// 			}
	// 		};
	// 		start_master_game();
	// 	}, []);


	// // });




	return (
		<>
			{/* <PongContext.Provider value={socket}> */}
				<ExecutePong />
			{/* </PongContext.Provider> */}
		</>
	)

}

export function ExecutePong() {
	const [ball, setBall] = useState<HTMLDivElement | null>(null);
	const [limit, setLimit] = useState<DOMRect | undefined>(undefined);
	const [trigger, setTrigger] = useState<number>(0);
	const [leftscore, setLeftScore] = useState<number>(0);
	const [rightscore, setRightScore] = useState<number>(0);
	let newLimit: DOMRect | undefined;
	let first: boolean = false;
	let playerPaddleLeft = new Paddle(document.getElementById("player-paddle-left") as HTMLDivElement);
	let playerPaddleRight = new Paddle(document.getElementById("player-paddle-right") as HTMLDivElement);
	let	leftUpPressed : boolean = false;
	let leftDownPressed : boolean = false;
	let rightUpPressed : boolean = false;
	let rightDownPressed : boolean = false;
	let collision = document.getElementById("collision");
	
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


	const DownHandler = (e: any) => {
		if (e.keyCode == 87) {
			leftUpPressed = true;
			if (newLimit && playerPaddleLeft) {
				playerPaddleLeft.position -= 2;
			}
		}
					else if (e.keyCode == 83) {
						leftDownPressed = true;
						if (newLimit && playerPaddleLeft) {
							playerPaddleLeft.position += 2;
						}
					}
					if (e.keyCode == 38) {
						rightUpPressed = true;
						console.log("up");
					}
					else if (e.keyCode == 40) {
						rightDownPressed = true;
						console.log("down");
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
					// if (newLimit)
					// 	pongBall.update(delta, newLimit, playerPaddleLeft, playerPaddleRight);


						// ball?.classList.add('scored');
						// ball?.animate([
						// 	{ transform: 'translateX(0)' },
						// 	{ transform: 'translateX(1000px)' },
						// ], {
						// 	duration: 10000,
						// 	fill: 'forwards',
						// });

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
				if (ball) {
					console.log("ball");
					const pongBall = new Ball(ball, setLeftScore, setRightScore);
					console.log('paddle left', playerPaddleLeft);
					let lastTime: number = 0;
					window.requestAnimationFrame(update(lastTime, pongBall, playerPaddleLeft, playerPaddleRight));
			  }
			}, [ball]);

	return (
		<div className={Style['container-game']}>
		<h1>Pong game</h1>
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
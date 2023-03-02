import React, { CSSProperties, useEffect } from "react";
import { useState } from "react";
import io, { Socket } from "socket.io-client";
import axios from "axios";
import Create_socket from "../chat/socket";
import { APP } from "../../api/app";
import App from "../../App";
import "./pong.css";
// import "./pong"




export default function Pong() {

	useEffect(() => {

		function playGame() {
	
		}
		playGame();
	}, []);

	return (
		<div className="container-game">
		<h1>Pong game</h1>
			<div className="pong-body">
				<title>Pong</title>
				<div className="score">
					<div className="left-score">0</div>
					<div className="right-score">0</div>
				</div>
				<div className="ball" id="ball"></div>
				<div className="paddle left" id="player-paddle-left"></div>
				<div className="paddle right" id="player-paddle-right"></div>
			</div>
		</div>
	);
}




// export default function Pong() {

// 	useEffect(() => {

// 		function playGame() {
// 			var canvas = document.getElementById("canvas") as HTMLCanvasElement;
// 			var ctx = canvas?.getContext("2d");
// 			var x = canvas?.width/2;
// 			var y = canvas?.height-30;
// 			var dx = 4;
// 			var dy = -4;
// 			var ballRadius = 10;

// 			// varibles declared to handle the movement of paddles
// 			var leftUpPressed = false;
// 			var leftDownPressed = false;
// 			var rightUpPressed = false;
// 			var rightDownPressed = false;

// 			function DownHandler(e: any) {
// 				if(e.keyCode == 87) {
// 					leftUpPressed = true;
// 				}
// 				else if (e.keyCode == 83) {
// 					leftDownPressed = true;
// 				}
// 				if (e.keyCode == 38) {
// 					rightUpPressed = true;
// 				}
// 				else if (e.keyCode == 40) {
// 					rightDownPressed = true;
// 				}
// 				e.preventDefault();
// 			}

// 			function UpHandler(e: any) {
// 				if (e.keyCode == 87) {
// 					leftUpPressed = false;
// 				}
// 				else if (e.keyCode == 83) {
// 					leftDownPressed = false;
// 				}
// 				if (e.keyCode == 38) {
// 					rightUpPressed = false;
// 				}
// 				else if (e.keyCode == 40) {
// 					rightDownPressed = false;
// 				}
// 			}

// 			function Ball() {
// 				if (ctx)
// 				{
// 					ctx.beginPath();
// 					ctx.arc(x, y, ballRadius, 0, Math.PI*2);
// 					ctx.fillStyle = "red";
// 					ctx.fill();
// 					ctx.closePath();
// 				}
// 			}
// 			var leftScore = 0;
// 			var rightScore = 0;

// 			function Scores() {
// 				if (ctx)
// 				{
// 					ctx.font = "80px Arial";
// 					ctx.fillStyle = "blue";
// 					ctx.fil
// 					ctx.fillText(leftScore.toString(), (canvas.width / 2) - 180, 70);
// 					ctx.fillText(rightScore.toString(), (canvas.width / 2) + 120, 70);
// 				}
// 			}

// 			function collisionsWithLeftPaddle() {
// 			if ((x - ballRadius) <= 5 + l_PaddleWidth) {
// 				if (y > l_PaddleY && y < l_PaddleY + l_PaddleHeight)
// 					dx = -dx;
// 				else if ((x - ballRadius) <= 0) {
// 					rightScore++;

// 					//alert("Game Over");
// 					x = canvas.width / 2;
// 					y = canvas.height / 2;
// 					dx = -dx;
// 					dy = -dy;
					
					
// 					//document.location.reload();
// 				}
// 			}
// 			}

// 			function collisionsWithRightPaddle() {
// 			if ((x + ballRadius) >= canvas.width - (r_PaddleWidth + 5)) {
// 				if (y > r_PaddleY && y < r_PaddleY + r_PaddleHeight)
// 					dx = -dx;
// 				else if (x + ballRadius >= canvas.width) {
// 					leftScore++;

// 					//alert("Game Over");
// 					x = canvas.width / 2;
// 					y = canvas.height / 2;
// 					dx = -dx;
// 					dy = -dy;

// 					//document.location.reload();
// 				}
// 			}
// 			}

// 			function computeCollisionsWithWallsAndPaddle() {
// 				collisionsWithLeftPaddle();
// 				collisionsWithRightPaddle();
// 				if (((y - ballRadius) <= 0) || ((y + ballRadius) >= canvas.height)) {
// 					dy = -dy;
// 				}
// 			}

// 			// For left-hand side player 
// 			var l_PaddleHeight = 80
// 			var l_PaddleWidth = 10
// 			var l_PaddleX = 5;
// 			var l_PaddleY = canvas.height / 2 - l_PaddleHeight / 2;
// 			function drawLeftPaddle() {
// 			if (ctx)
// 			{
// 				ctx.beginPath();
// 				ctx.rect(l_PaddleX, l_PaddleY, l_PaddleWidth, l_PaddleHeight);
// 				ctx.fillStyle = "green";
// 				ctx.fill();
// 				ctx.closePath();
// 			}
// 			if (leftDownPressed && l_PaddleY < canvas.height - l_PaddleHeight) {
// 				l_PaddleY += 7;
// 			}
// 			else if (leftUpPressed && l_PaddleY > 0) {
// 				l_PaddleY -= 7;
// 			}
// 			}

// 			// For Right-hand side player 
// 			var r_PaddleHeight = 80
// 			var r_PaddleWidth = 10
// 			var r_PaddleX = canvas.width - (r_PaddleWidth + 5);
// 			var r_PaddleY = canvas.height / 2 - r_PaddleHeight / 2;
// 			function drawRightPaddle() {
// 				if (ctx)
// 				{
// 					ctx.beginPath();
// 					ctx.rect(r_PaddleX, r_PaddleY, r_PaddleWidth, r_PaddleHeight);
// 					ctx.fillStyle = "green";
// 					ctx.fill();
// 					ctx.closePath();
// 				}
// 				if (rightDownPressed && r_PaddleY < canvas.height - r_PaddleHeight) {
// 					r_PaddleY += 7;
// 				}
// 				else if (rightUpPressed && r_PaddleY > 0) {
// 					r_PaddleY -= 7;
// 				}
// 			}

// 			function Scene() {
// 			if (ctx)
// 			{
// 				ctx.beginPath();
// 				ctx.rect(canvas.width / 2 - 1, 0, 3, canvas.height);
// 				ctx.fillStyle = "yellow";
// 				ctx.fill();
// 				ctx.closePath();
// 			}
// 			}

// 			function draw() {
// 			//clear everything
// 			if (ctx)
// 				ctx.clearRect(0, 0, canvas.width, canvas.height);
// 			Scores();
// 			Scene();
// 			drawLeftPaddle();
// 			drawRightPaddle();
// 			Ball();
// 			computeCollisionsWithWallsAndPaddle();
// 			x += dx;
// 			y += dy;
// 			}

// 			setInterval(draw, 10);
// 			document.addEventListener("keydown", DownHandler, false);
// 			document.addEventListener("keyup", UpHandler, false);
// 		}
// 		playGame();
// 	}, []);

// 	return (
// 		<div className="container-game">
// 			<title>Pong</title>
// 			<h1>Pong game</h1>
// 		   <canvas id="canvas" width="854"height="480" >
// 			This Browser does not support HTML5 Canvas.
// 		   </canvas>
// 		    <script >
// 		    </script>
// 		</div>
// 	);
// }
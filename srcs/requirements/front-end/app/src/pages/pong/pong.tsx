import React, { useEffect } from "react";
import { useState } from "react";
import io, { Socket } from "socket.io-client";
import axios from "axios";
import Create_socket from "../chat/socket";
import { APP } from "../../api/app";
import App from "../../App";
import "./pong.css";

export default function Pong() {

	return (
		<div className="">
			<div className="board">
				<div className='ball'>
					<div className="ball_effect"></div>
				</div>
				<div className="paddle_1 paddle"></div>
				<div className="paddle_2  paddle"></div>
				<h1 className="player_1_score">0</h1>
				<h1 className="player_2_score">0</h1>
				<h1 className="message">
					Press Enter to Play Pong
				</h1>
			</div>
		</div>
	);
}
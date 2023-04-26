/* eslint-disable prettier/prettier */

import { User } from "@prisma/client";


export interface InfoPongRoom {
	PausePlay: boolean;
	// BallElem: any;
	vector: {x: number, y: number};
	velocity: number;
	leftScore: number;
	rightScore: number;
	x: number;
	y: number;
	back_width: number;
	back_height: number;
	back_ball: {width: number, height: number, left: number, right: number, top: number, bottom: number};
	back_limit: {top: number, bottom: number, left: number, right: number};
	back_paddle_left: {left: number, right: number, top: number, bottom: number, x: number, y: number};
	back_paddle_right: {left: number, right: number, top: number, bottom: number, x:number, y: number};
	back_paddle_width: number;
	back_paddle_height: number;

	game_name: string;
	waiter: number;
	player1_id: number;
	player2_id: number;
	// player1_name: string;
	// player2_name: string;


}

export interface MovePaddle {
	paddle: string;
	gameName: string;
}

export interface PlayerMatched {
	player1: User;
	player2: User;
}
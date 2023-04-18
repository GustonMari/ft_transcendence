import { Socket } from "socket.io-client";
import { Paddle } from "./paddle";
import { useEffect } from "react";

export class Ball {
	
	BallElem: any;
	ballRect: any;
	velocity: number = 0.25;
	setLeftScore: any;
	setRightScore: any;
	socket: Socket;

	constructor(BallElem: any, setLeftScore: any, setRightScore: any, socket: Socket)
	{
		console.log('constructor ball');
		socket.emit('defineBall');
		this.BallElem = BallElem;
		this.socket = socket;
		this.ballRect = this.rect();
		this.setLeftScore = setLeftScore;
		this.setRightScore = setRightScore;
	}
	
	/*
	getComputedStyle() is a built-in JavaScript function 
	that returns an object containing the computed style properties of an element.

	getComputedStyle(this.BallElem).getPropertyValue('--x') 
	returns the value of the --x custom CSS property that is set 
	on the this.BallElem element as a string. */

	get x() {
		//convert into a float
		return parseFloat(getComputedStyle(this.BallElem).getPropertyValue('--x'));
	}

	set x(value: number) {
	 if (this.BallElem === null)
	 {
		 return;
	 }
		this.BallElem.style.setProperty('--x', value.toString());
	}

	get y() {
		//convert into a float
		return parseFloat(getComputedStyle(this.BallElem).getPropertyValue('--y'));
	}
	
	set y(value: number) {
		if (this.BallElem === null)
		{
			return;
		}
		this.BallElem.style.setProperty('--y', value.toString());
	}

	//Get the position of the ball
	rect() {
		/* retourne un objet DOMRect fournissant des informations sur la taille d'un élément
		 et sa position relative par rapport à la zone d'affichage. */
		return this.BallElem.getBoundingClientRect();
	}

	reset() {
		

	}

	update(delta: number, playerPaddleLeft: Paddle, playerPaddleRight: Paddle, gameName: string) {
		// this.socket.emit('updateGame', {delta: delta, limit: limit, playerPaddleLeft: playerPaddleLeft.rect, playerPaddleRight: playerPaddleRight.rect, ballRect: this.rect()});
		this.socket.emit('updateGame', {delta: delta, gameName: gameName});
		this.socket?.on('GameUpdated', (data: any) => {
			this.x = data.x;
			this.y = data.y;
			this.setLeftScore(data.leftScore);
			this.setRightScore(data.rightScore);
			playerPaddleLeft.position = data.paddleLeftY;
			playerPaddleRight.position = data.paddleRightY;

			// console.log('paddle rect left =', playerPaddleLeft.rect, 'paddle rect right =', playerPaddleRight.rect);
			// console.log("playerPaddleLeft.position: " + data.paddleLeftY, "playerPaddleRight.position: " + data.paddleRightY);
		});
	}

	// update(delta: number, limit: DOMRect, playerPaddleLeft: Paddle, playerPaddleRight: Paddle, gameName: string) {
	// 	// this.socket.emit('updateGame', {delta: delta, limit: limit, playerPaddleLeft: playerPaddleLeft.rect, playerPaddleRight: playerPaddleRight.rect, ballRect: this.rect()});
	// 	this.socket.emit('updateGame', {delta: delta, limit: limit, playerPaddleLeft: playerPaddleLeft.rect, playerPaddleRight: playerPaddleRight.rect, ballRect: this.ballRect, gameName: gameName});
	// 	this.socket?.on('GameUpdated', (data: any) => {
	// 		this.x = data.x;
	// 		this.y = data.y;
	// 		this.setLeftScore(data.leftScore);
	// 		this.setRightScore(data.rightScore);
	// 		playerPaddleLeft.position = data.paddleLeftY;
	// 		playerPaddleRight.position = data.paddleRightY;

	// 		// console.log('paddle rect left =', playerPaddleLeft.rect, 'paddle rect right =', playerPaddleRight.rect);
	// 		// console.log("playerPaddleLeft.position: " + data.paddleLeftY, "playerPaddleRight.position: " + data.paddleRightY);
	// 	});
	// }

}
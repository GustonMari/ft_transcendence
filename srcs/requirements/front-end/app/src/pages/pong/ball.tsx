import { Socket } from "socket.io-client";
import { Paddle } from "./paddle";
import { useEffect } from "react";

export class Ball {
	
	BallElem: any;
	vector: {x: number, y: number}/*  = {x: 0, y: 0} */;
	velocity: number = 0.25;
	setLeftScore: any;
	setRightScore: any;
	socket: Socket;

	constructor(BallElem: any, setLeftScore: any, setRightScore: any, socket: Socket)
	{
		socket.emit('defineBall');
		this.vector = {x: 0.1, y: 0.1};
		this.BallElem = BallElem;
		this.socket = socket;
		// this.reset();
		// socket.emit('resetGame');
		this.setLeftScore = setLeftScore;
		this.setRightScore = setRightScore;
		// console.log('constructor =', this.BallElem);
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
		console
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
		
		// this.x = 50;
		// this.y = 50;
		// this.vector = { x: 0, y: 0};
		
		// // make random direction, but not too much up or down
		// while (Math.abs(this.vector.x) <= .2 || Math.abs(this.vector.x) >= .9)
		// {
		// 	//generate a random number between 0 and 2PI (360 degrees)
		// 	const heading = Math.random() * 2 * Math.PI;
		// 	this.vector = { x: Math.cos(heading), y: Math.sin(heading) };
		// }
		// //initial velocity
		// this.velocity = .025;
	}


	// sideColision(rect: DOMRect, limit: DOMRect) {
	// 	if (rect.left <= limit.left || rect.right >= limit.right) {
	// 		//TODO: divier cette fonction en deux pour les points, et pour le reset
	// 		if (rect.left <= limit.left)
	// 		{
	// 			//trigger animation for the ball
	// 			// this.BallElem.classList.add('scored')
	// 			// document?.getElementById('collision').classList.add('scored');
				
	// 			this.setRightScore((prevScore: number) => prevScore + 1);
	// 			this.reset();
	// 		}
	// 		if (rect.right >= limit.right)
	// 		{
	// 			//trigger animation for the ball
	// 			// this.BallElem.classList.add('scored');
	// 			this.setLeftScore((prevScore: number) => prevScore + 1);
	// 			this.reset();
	// 		}
	// 		this.vector.x *= -1;
	// 	}
	// }

	update(delta: number, limit: DOMRect, playerPaddleLeft: Paddle, playerPaddleRight: Paddle) {
		this.socket.emit('updateGame', {delta: delta, limit: limit, playerPaddleLeft: playerPaddleLeft, playerPaddleRight: playerPaddleRight, ballRect: this.rect()});
		// this.x += this.vector.x * this.velocity * delta;
		// this.y += this.vector.y * this.velocity * delta;
		// // console.log('x =', this.x);
		// // console.log('y =', this.y);
		// this.velocity += 0.00001 * delta;
		// const rect = this.rect();

		// if(rect.top <= limit.top || rect.bottom >= limit.bottom) {
		// 	this.vector.y *= -1;
		// }
		// if (this.isCollision(rect, playerPaddleLeft.rect) 
		// 	|| this.isCollision(rect, playerPaddleRight.rect))
		// {
		// 	this.vector.x *= -1;
		// }
		// this.sideColision(rect, limit);
	}

	// isCollision(rect1: DOMRect, rect2: DOMRect) {
	// 	return (
	// 	  rect1.left <= rect2.right &&
	// 	  rect1.right >= rect2.left &&
	// 	  rect1.top <= rect2.bottom &&
	// 	  rect1.bottom >= rect2.top
	// 	)
	//   }
}
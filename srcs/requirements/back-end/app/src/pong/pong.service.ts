import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { exit } from 'process';
import { Socket } from 'socket.io';


@Injectable()
export class PongService {

	BallElem: any;
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
	// socket: Socket;

	constructor(private readonly prisma: PrismaService) {
		this.x = 50;
		this.y = 50;
		this.back_width = 100;
		this.back_height = 100;
		this.back_ball = {width: ((100 * 2) / 90), height: ((100 * 2) * 55), left: (50 - ((100 * 2) * (90 - 3))) , right: (50 + ((100 * 2) * 90)), top: (50 - ((100 * 2) * (55 - 3))), bottom: (50 + ((100 * 2) * 55))};
		// this.back_ball = {width: ((100 * 2) / 90), height: ((100 * 2) * 55), left: (50 - ((100 * 2) * 90)) , right: (50 + ((100 * 2) * 90)), top: (50 - ((100 * 2) * 55)), bottom: (50 + ((100 * 2) * 55))};
		


		// this.back_ball = {width: 4.44444, height: 7.2727, left: 47.77778, right: 53.6363, top: 0, bottom: 0};
		// this.vector = { x: 0.1, y: 0.1};
		this.back_limit = {top: 0, bottom: 100, left: 0, right: 100};
		this.leftScore = 0;
		this.rightScore = 0;
		// this.velocity = .25;
		//BUG: ATTENTION: ici ce n'est pas await car dans le constucteur on ne peut pas mettre await
		 this.reset();
	 }
	
	get all()
	{
		let all = {BallElem: this.BallElem, vector: this.vector, velocity: this.velocity, leftScore: this.leftScore, rightScore: this.rightScore , x: this.x, y: this.y};
		return (all);
	}

	// async assignSocket(socket: Socket)
	// {
	// 	this.socket = socket;
	// }

	async createGame(master: User, slave: User): Promise<boolean> {

		let game_name = "";
		console.log('\x1b[36m%s', "slave = ", slave, "master = ", master, '\x1b[0m');
		if (!slave || !master)
			return (false);
		if (slave.login.localeCompare(master.login) < 0)
			game_name = slave.login + "-" + master.login;
		else
			game_name = master.login + "-" + slave.login;
		console.log("BLALBA game_name = ", game_name);
		const game_exist = await this.prisma.game.findUnique({
			where: {
				name: game_name,
			}
		});
		if (game_exist)
			return (false);
		const game = await this.prisma.game.create({
			data: {
				name: game_name,	
				master_id: master.id,
				slave_id: slave.id,
			}
		});
		await this.prisma.userInGame.create({
			data: {
				user_id: master.id,
				game_id: game.id,
				role: "MASTER",
			}
		});
		await this.prisma.userInGame.create({
			data: {
				user_id: slave.id,
				game_id: game.id,
				role: "SLAVE",
			}
		});
		return (true);
	}

	async isUserMaster(login: string): Promise<boolean> {
		if (!login)
			return (false);
		const user = await this.prisma.user.findUnique({
			where: {
				login: login,
			}
		});
		if (user == null)
			return (false);
		const game = await this.prisma.game.findFirst({
			where: {
				master_id: user.id,
				UserInGame: {
					some: {
						role: "MASTER",
					}
				},
			}
		});
		if (game == null)
			return (false);
		return (true);
	}

	// async bounceBallTop(): Promise<{x: number, y: number}> {
	// 	let new_vector = this.vector.y * -1;
	// 	this.vector.y = new_vector;
	// 	let new_y = this.y + 5;
	// 	this.y = new_y;
	// 	return ({x: this.x, y: this.y});
	// }

	// async bounceBallBottom(): Promise<{x: number, y: number}> {
	// 	let new_vector = this.vector.y * -1;
	// 	this.vector.y = new_vector;
	// 	let new_y = this.y - 5;
	// 	this.y = new_y;
	// 	return ({x: this.x, y: this.y});
	// }

	async calculateBallLimmit()
	{
		this.back_ball.left = (this.x - ((this.back_width * 2) / 90) + 3);
		this.back_ball.right = (this.x + ((this.back_width * 2) / 90) - 3);
		// this.back_ball.top = (this.y - ((100 * 2) / 55));
		// this.back_ball.bottom = (this.y + ((100 * 2) / 55));
		this.back_ball.top = (this.y - ((100 * 2) / 55));
		this.back_ball.bottom = (this.y + ((100 * 2) / 55) - 7.27);
	}

	async updateGame(data: any): Promise<{x: number, y: number, leftScore: number, rightScore: number}>
	{
		if (this.leftScore == 11 || this.rightScore == 11)
		{
			this.restartGame();
		}
		this.x += this.vector.x * this.velocity * data.delta;
		this.y += this.vector.y * this.velocity * data.delta;
		// this.x += this.vector.x * this.velocity;
		// this.y += this.vector.y * this.velocity;
		this.velocity += 0.00001 * data.delta;
		await this.calculateBallLimmit();
		// this.back_ball.left = (this.x - ((this.back_width * 4) / 90));
		// this.back_ball.right = (this.x + ((this.back_width * 4) / 90));
		// this.back_ball.top = (this.y - ((100 * 4) / 55));
		// this.back_ball.bottom = (this.y + ((100 * 4) / 55));
		// console.log(' x = ', this.x, ' y = ', this.y, ' ball left =', this.back_ball.left, ' ball right =', this.back_ball.right, ' ball top =', this.back_ball.top, ' ball bottom =', this.back_ball.bottom);
		// const rect = this.back_ball;
		if(this.back_ball.top && this.back_ball.top <= this.back_limit.top) {
			// await this.bounceBallTop();
			// this.y += 5;
			this.vector.y *= -1;
			// console.log('1 this y = ', this.y, 'vector y =', this.vector.y);

		}
		else if ( this.back_ball.bottom >= this.back_limit.bottom)
		{
			// await this.bounceBallBottom();
			// this.y -= 5;
			console.log('this y = ', this.y, "back_ball bottom = ", this.back_ball.bottom, "| back_ball_top = ", this.back_ball.top)
			this.vector.y *= -1;

			// console.log('2 this y = ', this.y, 'vector y =', this.vector.y);
		}
		if (await this.isCollision(this.back_ball, data.playerPaddleLeft))
		{
			this.vector.x *= -1;

			// this.x += 1.5;
		}
		else if (await this.isCollision(this.back_ball, data.playerPaddleRight))
		{
			this.vector.x *= -1;

			// this.x -= 1.5;
		}
		//TODO: faire en sorte que la ball sorte entierement pour marquer un point
		await this.sideColision(this.back_ball, this.back_limit);
		return ({x: this.x, y: this.y, leftScore: this.leftScore, rightScore: this.rightScore});
		
	}

	// async updateGame(data: any): Promise<{x: number, y: number, leftScore: number, rightScore: number}>
	// {
	// 	if (this.leftScore == 11 || this.rightScore == 11)
	// 	{
	// 		this.restartGame();
	// 	}
	// 	this.x += this.vector.x * this.velocity * data.delta;
	// 	this.y += this.vector.y * this.velocity * data.delta;
	// 	this.velocity += 0.00001 * data.delta;
	// 	const rect = data.ballRect;
	// 	if(rect.top <= data.limit.top) {
	// 		// await this.bounceBallTop();
	// 		this.y += 5;
	// 		this.vector.y *= -1;
	// 		// console.log('1 this y = ', this.y, 'vector y =', this.vector.y);

	// 	}
	// 	else if ( rect.bottom >= data.limit.bottom)
	// 	{
	// 		// await this.bounceBallBottom();
	// 		this.y -= 5;
	// 		this.vector.y *= -1;
	// 		// console.log('2 this y = ', this.y, 'vector y =', this.vector.y);
	// 	}
	// 	if (await this.isCollision(rect, data.playerPaddleLeft))
	// 	{
	// 		this.vector.x *= -1;
	// 		this.x += 1.5;
	// 	}
	// 	else if (await this.isCollision(rect, data.playerPaddleRight))
	// 	{
	// 		this.vector.x *= -1;
	// 		this.x -= 1.5;
	// 	}
	// 	await this.sideColision(rect, data.limit);
	// 	if (this.x < 0)
	// 		this.x *= -1;
	// 	if (this.y < 0)
	// 		this.y *= -1;
	// 	return ({x: this.x, y: this.y, leftScore: this.leftScore, rightScore: this.rightScore});
		
	// }
	
	
	// async isCollision(ball: DOMRect, paddle: DOMRect): Promise<boolean> {
	async isCollision(ball: any, paddle: any): Promise<boolean> {
		return (
			(ball.left <= paddle.right &&
			ball.right >= paddle.left &&
			ball.top <= paddle.bottom &&
			ball.bottom >= paddle.top)
		)
	}

	async reset(): Promise<void>
	{
		this.x = 50;
		this.y = 50;
		this.vector = { x: 0.1, y: 0.1};
		
		// make random direction, but not too much up or down
		while (Math.abs(this.vector.x) <= .2 || Math.abs(this.vector.x) >= .9)
		{
			//generate a random number between 0 and 2PI (360 degrees)
			const heading = Math.random() * 2 * Math.PI;
			this.vector = { x: Math.cos(heading), y: Math.sin(heading) };
		}
		//initial velocity
		this.velocity = .025;
	}

	async incrLeftScore() {
		this.leftScore++;
	}

	async incrRightScore() {
		this.rightScore++;
	}


	// async sideColision(rect: DOMRect, limit: DOMRect): Promise<void> {
	async sideColision(rect: any, limit: any): Promise<void> {
		if (rect.left <= limit.left || rect.right >= limit.right) {
			//TODO: divier cette fonction en deux pour les points, et pour le reset
			if (rect.left <= limit.left)
			{
				await this.reset();
				await this.incrRightScore();
			}
			else if (rect.right >= limit.right)
			{
				await this.reset();
				await this.incrLeftScore();
			}
			// this.vector.x *= -1;
		}
	}

	async restartGame(): Promise<void> {
		this.leftScore = 0;
		this.rightScore = 0;
		await this.reset();
	}


	// async convert_front_to_back(new_witdh: number, new_height: number): Promise<any> {
	// 	let ratio_x = new_witdh / this.back_width;
	// 	let ratio_y = new_height / this.back_height;
	// 	let new_x = this.x * ratio_x;
	// 	let new_y = this.y * ratio_y;
	// 	return ({x: new_x, y: new_y});
	// }

	// async convert_back_to_front(new_witdh: number, new_height: number): Promise<any> {
	// 	let ratio_x = this.back_width / new_witdh;
	// 	let ratio_y = this.back_height / new_height;
	// 	let new_x = this.x * ratio_x;
	// 	let new_y = this.y * ratio_y;
	// 	return ({x: new_x, y: new_y});
	// }
}

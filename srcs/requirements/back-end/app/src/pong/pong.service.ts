import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { exit } from 'process';

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

	constructor(private readonly prisma: PrismaService) {
		// this.x = 50;
		// this.y = 50;
		this.back_width = 900;
		this.back_height = 550;
		// this.vector = { x: 0.1, y: 0.1};
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

	async updateGame(data: any): Promise<{x: number, y: number, leftScore: number, rightScore: number}>
	{
		this.x += this.vector.x * this.velocity * data.delta;
		this.y += this.vector.y * this.velocity * data.delta;
		this.velocity += 0.00001 * data.delta;
		const rect = data.ballRect;

		// if(rect.top <= data.limit.top || rect.bottom >= data.limit.bottom) {
		// 	this.vector.y *= -1;
		// }
		if(rect.top <= data.limit.top) {
			this.vector.y *= -1;
			this.y += 3;
		}
		else if ( rect.bottom >= data.limit.bottom)
		{
			this.vector.y *= -1;
			this.y -= 3;
		}
		// if (await this.isCollision(rect, data.playerPaddleLeft)
		// || await this.isCollision(rect, data.playerPaddleRight))
		// { 
		// 	this.vector.x *= -1;
		// }
		if (await this.isCollision(rect, data.playerPaddleLeft))
		{
			this.vector.x *= -1;
			this.x += 1.5;
		}
		else if (await this.isCollision(rect, data.playerPaddleRight))
		{
			this.vector.x *= -1;
			this.x -= 1.5;
		}
		await this.sideColision(rect, data.limit);
		return ({x: this.x, y: this.y, leftScore: this.leftScore, rightScore: this.rightScore});
		
	}
	
	
	async isCollision(ball: DOMRect, paddle: DOMRect): Promise<boolean> {
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
		this.leftScore += 1;
	}

	async incrRightScore() {
		this.rightScore += 1;
	}


	async sideColision(rect: DOMRect, limit: DOMRect): Promise<void> {
		if (rect.left <= limit.left || rect.right >= limit.right) {
			//TODO: divier cette fonction en deux pour les points, et pour le reset
			if (rect.left <= limit.left)
			{
				console.log("scored left!!", this.leftScore, "scored right!!", this.rightScore);
				await this.incrRightScore();
				await this.reset();
			}
			if (rect.right >= limit.right)
			{
				console.log("scored left!!", this.leftScore, "scored right!!", this.rightScore);
				await this.incrLeftScore();
				await this.reset();
			}
			this.vector.x *= -1;
		}
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

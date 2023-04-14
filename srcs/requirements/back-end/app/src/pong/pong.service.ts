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
	back_paddle_left: {left: number, right: number, top: number, bottom: number, x: number, y: number};
	back_paddle_right: {left: number, right: number, top: number, bottom: number, x:number, y: number};
	back_paddle_width: number;
	back_paddle_height: number;

	constructor(private readonly prisma: PrismaService) {
		this.x = 50;
		this.y = 50;
		this.back_width = 100;
		this.back_height = 100;
		this.back_ball = {width: ((100 * 2) / 90), height: ((100 * 2) * 55), left: (50 - ((100 * 2) * (90 - 3))) , right: (50 + ((100 * 2) * 90)), top: (50 - ((100 * 2) * (55 - 3))), bottom: (50 + ((100 * 2) * 55))};
		this.back_limit = {top: 0, bottom: 100, left: 0, right: 100};
		this.leftScore = 0;
		this.rightScore = 0;
		this.reset();
		this.back_paddle_width = (100 * 2) / 90;
		this.back_paddle_height = (100 * 12) / 55;
		this.back_paddle_left = {left: 100 / 90, right: (100 * 3) / 90, top: (100 * 21.5) / 55, bottom: (100 * 33.5) / 55, x: (100 * 2 ) / 90, y: (100 * 27.5) / 55};
		this.back_paddle_right = {left: (87 * 100) / 90, right: (89 * 100) / 90, top: (100 * 21.5) / 55, bottom: (100 * 33.5) / 55, x: ((100 * 88 ) / 90), y: (100 * 27.5) / 55};
	 }
	
	get all()
	{
		let all = {BallElem: this.BallElem, vector: this.vector, velocity: this.velocity, leftScore: this.leftScore, rightScore: this.rightScore , x: this.x, y: this.y};
		return (all);
	}

	async createGame(master: User, slave: User): Promise<boolean> {

		let game_name = "";
		// console.log('\x1b[36m%s', "slave = ", slave, "master = ", master, '\x1b[0m');
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
		{
			console.log('------------------------------------------------------- game exist', game_exist);
			return (false);
		}
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

	async getGameName(): Promise<any> {

	}

	async isUserMaster(login: string): Promise<boolean> {
		if (!login)
			return (false);
		// console.log("111")
		const user = await this.prisma.user.findUnique({
			where: {
				login: login,
			}
		});
		// console.log("222")
		if (user == null)
			return (false);
		// console.log("333")
		console.log("ARGHHHHHHHH user = ", user);
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
		console.log("ARGHHHHHHHH game = ", game);

		// console.log("444")
		if (game == null || game == undefined)
			return (false);
		// console.log("555")
		return (true);
	}

	async calculateBallLimmit()
	{
		this.back_ball.left = (this.x - ((this.back_width * 2) / 90) + 3);
		this.back_ball.right = (this.x + ((this.back_width * 2) / 90) - 3);
		this.back_ball.top = (this.y - ((100 * 2) / 55));
		this.back_ball.bottom = (this.y + ((100 * 2) / 55) - 1.27);
	}

	async movePaddeLeft(data: string): Promise<void>
	{
		if (data == 'up' && this.back_paddle_left.top > 0)
		{
			this.back_paddle_left.y -= 0.2;
			this.back_paddle_left.top -= 0.2;
			this.back_paddle_left.bottom -= 0.2;
		}
		else if (data == 'down' && this.back_paddle_left.bottom < 100)
		{
			this.back_paddle_left.y += 0.2;
			this.back_paddle_left.top += 0.2;
			this.back_paddle_left.bottom += 0.2;
		}
	}

		async movePaddeRight(data: string): Promise<void>
	{
		if (data == 'up' && this.back_paddle_right.top > 0)
		{
			this.back_paddle_right.y -= 0.2;
			this.back_paddle_right.top -= 0.2;
			this.back_paddle_right.bottom -= 0.2;
		}
		else if (data == 'down' && this.back_paddle_right.bottom < 100)
		{
			this.back_paddle_right.y += 0.2;
			this.back_paddle_right.top += 0.2;
			this.back_paddle_right.bottom += 0.2;
		}
	}


	async defineWinnerLooser()
	{
	
	}

	async updateGame(data: any): Promise<{x: number, y: number, leftScore: number, rightScore: number, paddleLeftY: number, paddleRightY: number}>
	{
		if (this.leftScore >= 11 || this.rightScore >= 11)
		{
			this.defineWinnerLooser();
			this.restartGame();
		}
		this.x += this.vector.x * this.velocity * data.delta;
		this.y += this.vector.y * this.velocity * data.delta;
		// this.velocity += 0.00001 * data.delta;
		await this.calculateBallLimmit();
		if(this.back_ball.top && this.back_ball.top <= this.back_limit.top) {
			this.velocity += 0.0005 * data.delta;
			this.vector.y *= -1;
		}
		else if ( this.back_ball.bottom >= this.back_limit.bottom)
		{
			this.velocity += 0.0005 * data.delta;

			this.vector.y *= -1;
		}
		if (await this.isCollision(this.back_ball, this.back_paddle_left))
		{
			this.velocity += 0.0005 * data.delta;
			this.vector.x *= -1;
		}
		else if (await this.isCollision(this.back_ball, this.back_paddle_right))
		{
			this.velocity += 0.0005 * data.delta;
			this.vector.x *= -1;
		}
		//TODO: faire en sorte que la ball sorte entierement pour marquer un point
		await this.sideColision(this.back_ball, this.back_limit);
		// console.log('paddleLeft = ', this.back_paddle_left, "paddleRight = ", this.back_paddle_right);
		return ({x: this.x, y: this.y, leftScore: this.leftScore, rightScore: this.rightScore, paddleLeftY: this.back_paddle_left.y, paddleRightY: this.back_paddle_right.y});
		
	}

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
				//TODO: do we have to add score to prisma ?
			}
			else if (rect.right >= limit.right)
			{
				await this.reset();
				await this.incrLeftScore();
				//TODO: do we have to add score to prisma ?
			}
		}
	}

	async restartGame(): Promise<void> {
		this.leftScore = 0;
		this.rightScore = 0;
		await this.reset();
	}

}

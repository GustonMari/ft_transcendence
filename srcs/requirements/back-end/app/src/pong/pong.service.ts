import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { exit } from 'process';

@Injectable()
export class PongService {

	BallElem: any;
	vector: {x: number, y: number};
	velocity: number;
	setLeftScore: any;
	setRightScore: any;
	x: number;
	y: number;

	constructor(private readonly prisma: PrismaService) {
		this.x = 50;
		this.y = 50;
		this.vector = { x: 0.1, y: 0.1};
		this.setLeftScore = 0;
		this.setRightScore = 0;
		this.velocity = .25;
		this.reset();
	 }
	
	get all()
	{
		let all = {BallElem: this.BallElem, vector: this.vector, velocity: this.velocity, setLeftScore: this.setLeftScore, SetRightScore: this.setRightScore, x: this.x, y: this.y};
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

	async updateGame(data: any): Promise<{x: number, y: number}>
	{
		// console.log('vector.x =', this.vector.x, 'vector.y =', this.vector.y, 'velocity =', this.velocity);
		console.log()
		this.x += this.vector.x * this.velocity * data.delta;
		this.y += this.vector.y * this.velocity * data.delta;
		// console.log('x =', this.x);
		// console.log('y =', this.y);
		this.velocity += 0.00001 * data.delta;
		const rect = data.ballRect;
		if(rect.top <= data.limit.top || rect.bottom >= data.limit.bottom) {
			this.vector.y *= -1;	
			console.log("piscine chez paulette part 2", rect)
			// console.log("exited bitch")
			// exit(1);
		}
		if (this.isCollision(rect, data.playerPaddleLeft) 
		|| this.isCollision(rect, data.playerPaddleRight))
		{ 
			console.log('collision !!! rect =', rect, ' player left =', data.playerPaddleLeft, ' player right = ', data.playerPaddleRight );
			// exit(1);
			
			this.vector.x *= -1; 
		}
		// this.sideColision(rect, data.limit);
		return ({x: this.x, y: this.y});
		
	}
	
	
	async isCollision(rect1: DOMRect, rect2: DOMRect): Promise<boolean> {
		// console.log('rect1 =', rect1, 'rect2 =', rect2);
		return (
			rect1.left <= rect2.right &&
			rect1.right >= rect2.left &&
			rect1.top <= rect2.bottom &&
			rect1.bottom >= rect2.top
		)
	}

	async reset(): Promise<void>
	{
		this.x = 50;
		this.y = 50;
		this.vector = { x: 0, y: 0};
		
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

	async sideColision(rect: DOMRect, limit: DOMRect): Promise<void> {
		if (rect.left <= limit.left || rect.right >= limit.right) {
			//TODO: divier cette fonction en deux pour les points, et pour le reset
			if (rect.left <= limit.left)
			{
				console.log("scored!!");
				this.setRightScore((prevScore: number) => prevScore + 1);
				this.reset();
			}
			if (rect.right >= limit.right)
			{
				console.log("scored!!");
				this.setLeftScore((prevScore: number) => prevScore + 1);
				this.reset();
			}
			this.vector.x *= -1;
		}
	}
}

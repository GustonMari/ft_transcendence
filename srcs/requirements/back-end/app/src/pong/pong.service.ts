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
	back_width: number;
	back_height: number;

	constructor(private readonly prisma: PrismaService) {
		// this.x = 50;
		// this.y = 50;
		this.back_width = 900;
		this.back_height = 550;
		// this.vector = { x: 0.1, y: 0.1};
		this.setLeftScore = 0;
		this.setRightScore = 0;
		// this.velocity = .25;
		//BUG: ATTENTION: ici ce n'est pas await car dans le constucteur on ne peut pas mettre await
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
		this.x += this.vector.x * this.velocity * data.delta;
		this.y += this.vector.y * this.velocity * data.delta;
		this.velocity += 0.00001 * data.delta;
		const rect = data.ballRect;

		if(rect.top <= data.limit.top || rect.bottom >= data.limit.bottom) {
			this.vector.y *= -1;	
			// console.log('vector y =', this.vector.y);
			// console.log("piscine chez paulette part 2", rect)
			// console.log("exited bitch")
			this.reset();
		}
		if (await this.isCollision(rect, data.playerPaddleLeft)
		|| await this.isCollision(rect, data.playerPaddleRight))
		{ 
			// console.log('collision !!! rect =', rect, ' player left =', data.playerPaddleLeft, ' player right = ', data.playerPaddleRight );
			// exit(1);
			// console.log('ball = ', rect, ' paddle  left = ', data.playerPaddleLeft, 'paddle right = ', data.playerPaddleRight );
			this.vector.x *= -1;
			// exit(1);
		}
		await this.sideColision(rect, data.limit);
		return ({x: this.x, y: this.y});
		
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
			console.log('heading =', heading, ' x = ', Math.cos(heading), ' y = ', Math.sin(heading));
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
				await this.setRightScore((prevScore: number) => prevScore + 1);
				await this.reset();
			}
			if (rect.right >= limit.right)
			{
				console.log("scored!!");
				await this.setLeftScore((prevScore: number) => prevScore + 1);
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

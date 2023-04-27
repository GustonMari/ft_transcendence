/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Game, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { exit } from 'process';
import { Socket } from 'socket.io';
import { InfoPongRoom } from './pong.interface';
import { AddGameDTO } from '../history/dtos';


@Injectable()
export class PongService {

	constructor(private readonly prisma: PrismaService) {
		// this.reset(this.game_name);
		//TODO: vraiment vraiment ne pas oublier de remette le reset
	 }

	static allRooms: InfoPongRoom[] = [];
	static waitingList: User[] = [];

	async createInvitationPong(master: User, slave: User): Promise<void> {
		this.prisma.invitationPong.create({
			data: {
				game_name: master.login + "-" + slave.login,
				sender_player: master,
				invited_player: slave,
			}
		});
	}

	async getGame(game_name: string): Promise<InfoPongRoom>
	{
		// console.log("game_name = ", game_name)
		const all =  await PongService.allRooms.find(currentRoom => currentRoom.game_name === game_name)
		// console.log("GETGAME = ", all);
		return (all);
	}

	async createGame(master: User, slave: User): Promise<boolean> {

		// let game_name = "";
		console.log("create game : master = ", master, " slave = ", slave);
		let new_game_name = "";
		if (!slave || !master)
			return (false);
		if (slave.login.localeCompare(master.login) < 0)
			new_game_name = slave.login + "-" + master.login;
		else
			new_game_name = master.login + "-" + slave.login;
		const game_exist = await this.prisma.game.findUnique({
			where: {
				name: new_game_name,
			}
		});
		if (game_exist)
			return (false);
		const game = await this.prisma.game.create({
			data: {
				name: new_game_name,	
				master_id: master.id,
				slave_id: slave.id,
				game_over: false,
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

	async getGameName(login:string): Promise<any> {
		if (!login)
			return ('Error: problem with login');
		const user = await this.prisma.user.findUnique({
			where: {
				login: login,
			}
		});

		const game: Game = await this.prisma.game.findFirst({
			where: {
				OR: [
					{
						master_id: user.id,
					},
					{
						slave_id: user.id,
					}
				]

			}
		});
		if (game == null || game == undefined)
			return ('Error game dont exist');
		// console.log("GAME NAME = ", game.name);
		return (game.name);
	}

	async getGameByGameName(gameName: string): Promise<Game> {
		if (!gameName)
			return (null);
		const game: Game = await this.prisma.game.findUnique({
			where: {
				name: gameName,
			}
		});
		if (game == null || game == undefined)
			return (null);
		return (game);
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
		if (game == null || game == undefined)
			return (false);
		return (true);
	}

	async isUserSlave(login: string): Promise<boolean> {
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
				slave_id: user.id,
				UserInGame: {
					some: {
						role: "SLAVE",
					}
				},
			}
		});
		if (game == null || game == undefined)
			return (false);
		return (true);
	}

	async calculateBallLimmit(game: InfoPongRoom)
	{
		game.back_ball.left = (game.x - ((game.back_width * 2) / 90) + 3);
		game.back_ball.right = (game.x + ((game.back_width * 2) / 90) - 3);
		game.back_ball.top = (game.y - ((100 * 2) / 55));
		game.back_ball.bottom = (game.y + ((100 * 2) / 55) - 1.27);

		// game.back_ball.left = (((game.x - 2) * game.back_width) / 90);
		// game.back_ball.right = (((game.x + 2) * game.back_width) / 90);
		// game.back_ball.top = (((game.y - 2) * game.back_height) / 55);
		// game.back_ball.bottom = (((game.y + 2) * game.back_height) / 55);
	}

	async movePaddeLeft(data: string, current_game_name: string): Promise<void>
	{
		const game = await this.getGame(current_game_name);
		if (data == 'up' && game.back_paddle_left.top > 0)
		{
			game.back_paddle_left.y -= 2;
			game.back_paddle_left.top -= 2;
			game.back_paddle_left.bottom -= 2;
		}
		else if (data == 'down' && game.back_paddle_left.bottom < 100)
		{
			game.back_paddle_left.y += 2;
			game.back_paddle_left.top += 2;
			game.back_paddle_left.bottom += 2;
		}
	}

		async movePaddeRight(data: string, current_game_name: string): Promise<void>
	{
		const game = await this.getGame(current_game_name);
		if (data == 'up' && game.back_paddle_right.top > 0)
		{
			game.back_paddle_right.y -= 2;
			game.back_paddle_right.top -= 2;
			game.back_paddle_right.bottom -= 2;
		}
		else if (data == 'down' && game.back_paddle_right.bottom < 100)
		{
			game.back_paddle_right.y += 2;
			game.back_paddle_right.top += 2;
			game.back_paddle_right.bottom += 2;
		}
	}

	async PauseGame(current_game_name: string): Promise<void>
	{
		//TODO: check si l'on est en pause est ce que la partie stop d'autre partie en cours
		// this.PausePlay = !this.PausePlay;
		// this.PausePlay = false;
		const game = await this.getGame(current_game_name);
		// console.log("PAUSE GAME current_game_name = ", game);
		// console.log("PAUSE GAME game = ", game);
		game.PausePlay = false;
	}

	async resumeGame(current_game_name: string): Promise<void>
	{
		const game = await this.getGame(current_game_name);
		// console.log("RESUME GAME current_game_name = ", game);
		// console.log("RESUME GAME game = ", game);
		game.PausePlay = true;
	}

	async isGamePaused(current_game_name: string): Promise<boolean>
	{
		const game = await this.getGame(current_game_name);
		return (game.PausePlay);
	}

	async playGame(current_game_name: string): Promise<void>
	{
		// this.PausePlay = true;
		const game = await this.getGame(current_game_name);
		
		
		//TODO: comment ou quoi faire lorsqu'un joueur accepte ou non de jouer
		//TODO: vraiment changer ce systeme lorsquon aurra les queues
		if (game.waiter == 1) // ici on mets 1 car le deuxieme joueur est le second waiter
		{
			// console.log("2 waiters are ready");
			game.PausePlay = true;
			game.waiter = 0;
			// await game.pongService.playGame(data.gameName);
		}	else
		{
			// console.log("1 waiter is ready");
			game.waiter++;
		}
		//TODO: faire le systeme de queue, ou l'on passe au jour suivant si il y a un joueur qui veut jouer
	}

	// @SubscribeMessage('playGame')
	// async playGame(@MessageBody() data: any, @ConnectedSocket() socket: Socket): Promise<void> {
	// 	console.log("playGame");

	// 	//TODO: comment ou quoi faire lorsqu'un joueur accepte ou non de jouer
	// 	//TODO: vraiment changer ce systeme lorsquon aurra les queues
	// 	if (this.waiter == 1) // ici on mets 1 car le deuxieme joueur est le second waiter
	// 	{
	// 		console.log("2 waiters are ready");
	// 		this.waiter = 0;
	// 		await this.pongService.playGame(data.gameName);
	// 	}	else
	// 	{
	// 		console.log("1 waiter is ready");
	// 		this.waiter++;
	// 	}
	// 	//TODO: faire le systeme de queue, ou l'on passe au jour suivant si il y a un joueur qui veut jouer
	// }

	async defineWinnerLooser()
	{
	
	}

	async updateGame(data: any): Promise<{x: number, y: number, leftScore: number, rightScore: number, paddleLeftY: number, paddleRightY: number}>
	{
		const game = await this.getGame(data.gameName);
		if (game && game.PausePlay == false)
			return ({x: game.x, y: game.y, leftScore: game.leftScore, rightScore: game.rightScore, paddleLeftY: game.back_paddle_left.y, paddleRightY: game.back_paddle_right.y});
		if (game.leftScore >= 11 || game.rightScore >= 11)
		{
			// game.defineWinnerLooser();
			this.restartGame(game);
		}
		if (data.isMaster)
		{
			game.x += game.vector.x * game.velocity * data.delta;
			game.y += game.vector.y * game.velocity * data.delta;
			// game.velocity += 0.00001 * data.delta;
			await this.calculateBallLimmit(game);
			if(game.back_ball.top && game.back_ball.top <= (game.back_limit.top + 1)) {
				if (game.velocity < 0.080)
					game.velocity += 0.0001 * data.delta;
				game.vector.y *= -1;
			}
			else if ( game.back_ball.bottom >= (game.back_limit.bottom - 1))
			{
				if (game.velocity < 0.080)
					game.velocity += 0.0001 * data.delta;
	
				game.vector.y *= -1;
			}
			else
			{
				if (await this.isCollision(game.back_ball, game.back_paddle_left))
				{
					if (game.velocity < 0.080)
						game.velocity += 0.0001 * data.delta;
					
					game.vector.x *= -1;
					game.x += 3;
				}
				else if (await this.isCollision(game.back_ball, game.back_paddle_right))
				{
					if (game.velocity < 0.080)
						game.velocity += 0.0001 * data.delta;
					game.vector.x *= -1;
					game.x -= 3;
				}
			}
			await this.sideColision(game.back_ball, game.back_limit, game);
		}
		//TODO: faire en sorte que la ball sorte entierement pour marquer un point
		return ({x: game.x, y: game.y, leftScore: game.leftScore, rightScore: game.rightScore, paddleLeftY: game.back_paddle_left.y, paddleRightY: game.back_paddle_right.y});
		
	}

	// async isCollision(ball: any, paddle: any): Promise<boolean> {

	// 	return (
	// 		(ball.left <= (paddle.right + 1) &&
	// 		ball.right >= (paddle.left - 1) &&
	// 		ball.top <= (paddle.bottom + 1) &&
	// 		ball.bottom >= (paddle.top + 1))
	// 	)
	// }

	async isCollision(ball: any, paddle: any): Promise<boolean> {
		const collidesFromTop = ball.bottom >= paddle.top && ball.top < paddle.top && ball.right >= paddle.left && ball.left <= paddle.right;
		const collidesFromBottom = ball.top <= paddle.bottom && ball.bottom > paddle.bottom && ball.right >= paddle.left && ball.left <= paddle.right;
		const collidesFromSides = ball.left <= (paddle.right + 1) && ball.right >= (paddle.left - 1) && ball.top <= (paddle.bottom + 1) && ball.bottom >= (paddle.top + 1);
	  
		return collidesFromTop || collidesFromBottom || collidesFromSides;
	  }
	  

	async resetScore(current_game_name: string): Promise<void>
	{
		const game = await this.getGame(current_game_name);
		game.leftScore = 0;
		game.rightScore = 0;
	}

	async reset(game: InfoPongRoom): Promise<void>
	{
		game.x = 50;
		game.y = 50;
		game.vector = { x: 0.1, y: 0.1};
		
		// make random direction, but not too much up or down
		while (Math.abs(game.vector.x) <= .2 || Math.abs(game.vector.x) >= .9)
		{
			//generate a random number between 0 and 2PI (360 degrees)
			const heading = Math.random() * 2 * Math.PI;
			game.vector = { x: Math.cos(heading), y: Math.sin(heading) };
		}
		//initial velocity
		game.velocity = .025;
		// game.velocity = .080;
	}

	async incrLeftScore(game: InfoPongRoom) {
		game.leftScore++;
	}

	async incrRightScore(game: InfoPongRoom) {
		game.rightScore++;
	}


	// async sideColision(rect: DOMRect, limit: DOMRect): Promise<void> {
	async sideColision(rect: any, limit: any, game: InfoPongRoom): Promise<void> {
		if (rect.left <= limit.left || rect.right >= limit.right) {
			if (rect.left <= limit.left)
			{
				await this.reset(game);
				await this.incrRightScore(game);
			}
			else if (rect.right >= limit.right)
			{
				await this.reset(game);
				await this.incrLeftScore(game);
			}
		}
	}

	async restartGame(game: InfoPongRoom): Promise<void> {
		game.leftScore = 0;
		game.rightScore = 0;
		await this.reset(game);
	}

	async getGamesRooms(): Promise<any> {
		return await this.prisma.game.findMany();
	}

	async setGameOver(info: any): Promise<any> {

		await this.prisma.game.update({
			where: {
				name: info.game_name
			},
			data: {
				game_over: true,
			}
		})
	}

	async isGameOver(info: any): Promise<boolean> {
		const game = await this.prisma.game.findUnique({
			where: {
				name: info.game_name
			}
		})
		return game.game_over;
	}

	async initGame(info: any) : Promise<void> {
		console.log('game inited')
		const newGame: InfoPongRoom = {
			PausePlay: false,
			// PausePlay: true,
			x: 50,
			y: 50,
			back_width: 100,
			back_height: 100,
			// back_ball: { width: ((100 * 4) / 90), height: ((100 * 4) / 55), left: ((43 * 100) / 90), right: ((47 * 100) / 90), top: ((25.5 * 100) / 55), bottom: ((29.5 * 100) / 55) },
			back_ball: { width: ((100 * 2) / 90), height: ((100 * 2) * 55), left: (50 - ((100 * 2) * (90 - 3))), right: (50 + ((100 * 2) * 90)), top: (50 - ((100 * 2) * (55 - 3))), bottom: (50 + ((100 * 2) * 55)) },
			back_limit: { top: 0, bottom: 100, left: 0, right: 100 },
			leftScore: 0,
			rightScore: 0,
			back_paddle_width: (100 * 2) / 90,
			back_paddle_height: (100 * 12) / 55,
			back_paddle_left: { left: 100 / 90, right: (100 * 3) / 90, top: (100 * 21.5) / 55, bottom: (100 * 33.5) / 55, x: (100 * 2) / 90, y: (100 * 27.5) / 55 },
			back_paddle_right: { left: (87 * 100) / 90, right: (89 * 100) / 90, top: (100 * 21.5) / 55, bottom: (100 * 33.5) / 55, x: ((100 * 88) / 90), y: (100 * 27.5) / 55 },
			waiter: 0,
			game_name: info.game.data.name,
			vector: {
				x: 0.1,
				y: 0.1
			},
			// velocity: 0.80,
			velocity: 0.25,
			player1_id: info.game.data.master_id,
			player2_id: info.game.data.slave_id,
			// player1_name: '',
			// player2_name: ''
		}
		PongService.allRooms.push(newGame);
		await this.reset(await this.getGame(newGame.game_name));
	}

	async addPlayerToWaitingList(info: User) : Promise<any> {
		console.log("info waiting = ", info);
		PongService.waitingList.push(info);
		console.log("waiting list = ", PongService.waitingList);
	}

	async IsPlayerMatched() : Promise<boolean> {
		const ret = PongService.waitingList.length % 2;
		console.log("isplayermatched ret = ", ret)
		if (ret === 0)
		{
			console.log("matched lolilol");	
			return true;
		}
		return (false);
	}

	async clearWaitingList() : Promise<void> {
		PongService.waitingList = [];
	}

	async getWaitingList() : Promise<any> {
		return PongService.waitingList;
	}

	async formatGameForAddGame(game: InfoPongRoom) : Promise<AddGameDTO> {
		const ret: AddGameDTO = {
			user_1_id: game.player1_id,
			user_2_id: game.player2_id,
			user_1_score: game.leftScore,
			user_2_score: game.rightScore,
		}
		return (ret);
	}
}
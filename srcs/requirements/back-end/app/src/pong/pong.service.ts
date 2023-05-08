/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Game, InvitationPong, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { exit } from 'process';
import { Socket, Server } from 'socket.io';
import { InfoPongRoom } from './pong.interface';
import { AddGameDTO } from '../history/dtos';
import { UserDTO } from './dtos';

const VELOCITY_MAX = 0.080;
const VELOCITY_ACCEL = 0.0001;

@Injectable()
export class PongService {

	constructor(private readonly prisma: PrismaService) {
		// this.reset(this.game_name);
		//TODO: vraiment vraiment ne pas oublier de remette le reset
	 }

	static allRooms: InfoPongRoom[] = [];
	static waitingList: UserDTO[] = [];

	async createInvitationPong(master_str: string, slave_str: string): Promise<void> {
		let new_game_name: string;
		const master = await this.prisma.user.findUnique({
			where: {
				login: master_str,
			}
		});
		const slave = await this.prisma.user.findUnique({
			where: {
				login: slave_str,
			}
		});
		if (!master || !slave)
		{
			console.error("Error: master or slave not found, createInvitationPong failed");
			return ;
		}
		if (slave.login.localeCompare(master.login) < 0)
			new_game_name = slave.login + "-" + master.login;
		else
			new_game_name = master.login + "-" + slave.login;
		await this.prisma.invitationPong.create({
			data: {
				game_name: new_game_name,
				sender_player_id: master.id,
				sender_player_login: master.login,
				invited_player_id: slave.id,
				invited_player_login: slave.login,
			}
		});
	}

	async getInvitationsPong(login:	string): Promise<InvitationPong[]> {
		const user = await this.prisma.user.findUnique({
			where: {
				login: login,
			}
		});
		if (!user)
			return ([]);
		
		const invitations = await this.prisma.invitationPong.findMany({
			where: {
				invited_player_id: user.id
			}
		});
		return (invitations);
	}

	async findInvitationPongByGameName(game_name: string): Promise<InvitationPong> {
		const invitation =  await this.prisma.invitationPong.findUnique({
			where: {
				game_name: game_name,
			}
		});
		return (invitation);
	}
	async deleteOneInvitationPong(invitation: number): Promise<void> {
		await this.prisma.invitationPong.delete({
			where: {
				// game_name: invitation.game_name,
				id: invitation,
			}
		});
	}

	async getGame(game_name: string): Promise<InfoPongRoom>
	{
		let all: InfoPongRoom = null;
		try {
			all =  await PongService.allRooms.find(currentRoom => currentRoom.game_name === game_name)
		}catch (e) {
			console.error("Error: getGame failed = ", e);
			return (all);
		}
		return (all);
	}



	async createGame(master: UserDTO, slave: UserDTO): Promise<boolean> {
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

	async deleteGame(game_name: string): Promise<boolean> {
		if (!game_name)
			return (false);
		const game = await this.prisma.game.findUnique({
			where: {
				name: game_name,
			}
		});
		if (!game)
			return (false);
		await this.prisma.game.deleteMany({
			where: {
				name: game_name,
			}
		});
		return (true);
	}


	//TODO: big problem here, need to find a way to delete the game in allRooms
	async deleteGameInAllRooms(game_name: string): Promise<boolean> {
		if (!game_name)
			return (false);
		// PongService.allRooms = PongService.allRooms.filter(currentRoom => currentRoom.game_name === game_name);
		const index = PongService.allRooms.findIndex(
			(currentRoom) => currentRoom.game_name === game_name
		);
		if (index === -1) {
			return false;
		}
		console.log("NONONONO index = ", index)
		console.log("NONONONO allRooms[index] = ", PongService.allRooms[index])
		PongService.allRooms.splice(index, 1);
		console.log("MDRRRRR = ", PongService.allRooms);
		// console.log("deleteGameInAllRooms = ", PongService.allRooms, "| ohoh game_name = ", game_name);
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
		game.PausePlay = false;
	}

	async resumeGame(current_game_name: string): Promise<void>
	{
		const game = await this.getGame(current_game_name);
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
		if (!game)
			return;
		
		if (game.waiter == 1) // ici on mets 1 car le deuxieme joueur est le second waiter
		{
			game.PausePlay = true;
			game.waiter = 0;
		}	else
		{
			game.waiter++;
		}
	}


	async defineWinnerLooser()
	{
	
	}

	async updateGame(data: any): Promise<{x: number, y: number, leftScore: number, rightScore: number, paddleLeftY: number, paddleRightY: number}>
	{
		const game = await this.getGame(data.gameName);
		if (game === null || game === undefined)
			return ({
				x: 50,
				y: 50,
				leftScore: 0,
				rightScore: 0,
				paddleLeftY: ((100 * 27.5) / 55),
				paddleRightY: ((100 * 27.5) / 55),
			});
		if (game && game.PausePlay == false)
			return ({x: game.x, y: game.y, leftScore: game.leftScore, rightScore: game.rightScore, paddleLeftY: game.back_paddle_left.y, paddleRightY: game.back_paddle_right.y});
		// if (game.leftScore >= 11 || game.rightScore >= 11)
		if (game.leftScore >= 1 || game.rightScore >= 1)
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
				if (game.velocity < VELOCITY_MAX)
					game.velocity += VELOCITY_ACCEL * data.delta;
				game.vector.y *= -1;
			}
			else if ( game.back_ball.bottom >= (game.back_limit.bottom - 1))
			{
				if (game.velocity < VELOCITY_MAX)
					game.velocity += VELOCITY_ACCEL * data.delta;
	
				game.vector.y *= -1;
			}
			else
			{
				if (await this.isCollision(game.back_ball, game.back_paddle_left))
				{
					console.log('collision-------------------------------')
					if (game.velocity < VELOCITY_MAX)
						game.velocity += VELOCITY_ACCEL * data.delta;
					
					game.vector.x *= -1;
					game.x += 1.5;
				}
				else if (await this.isCollision(game.back_ball, game.back_paddle_right))
				{
					console.log('collision-------------------------------')
					if (game.velocity < VELOCITY_MAX)
						game.velocity += VELOCITY_ACCEL * data.delta;
					game.vector.x *= -1;
					game.x -= 1.5;
				}
			}
			await this.sideColision(game.back_ball, game.back_limit, game);
		}
		//TODO: faire en sorte que la ball sorte entierement pour marquer un point
		return ({x: game.x, y: game.y, leftScore: game.leftScore, rightScore: game.rightScore, paddleLeftY: game.back_paddle_left.y, paddleRightY: game.back_paddle_right.y});
		
	}

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
		console.log('reset', game.velocity);
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
			x: 50,
			y: 50,
			back_width: 100,
			back_height: 100,
			back_ball: { width: ((100 * 2) / 90), height: ((100 * 2) * 55), left: (50 - ((100 * 2) * (90 - 3))), right: (50 + ((100 * 2) * 90)), top: (50 - ((100 * 2) * (55 - 3))), bottom: (50 + ((100 * 2) * 55)) },
			back_limit: { top: 0, bottom: 100, left: 0, right: 100 },
			leftScore: 0,
			rightScore: 0,
			back_paddle_width: (100 * 2) / 90,
			back_paddle_height: (100 * 12) / 55,
			back_paddle_left: { left: 100 / 90, right: (100 * 3) / 90, top: (100 * 21.5) / 55, bottom: (100 * 33.5) / 55, x: (100 * 2) / 90, y: (100 * 27.5) / 55 },
			back_paddle_right: { left: (87 * 100) / 90, right: (89 * 100) / 90, top: (100 * 21.5) / 55, bottom: (100 * 33.5) / 55, x: ((100 * 88) / 90), y: (100 * 27.5) / 55 },
			waiter: 0,
			game_name: info.name,
			vector: {
				x: 0.1,
				y: 0.1
			},
			velocity: 0.025,
			player1_id: info.master_id,
			player2_id: info.slave_id,
		}
		PongService.allRooms.push(newGame);
		await this.reset(await this.getGame(newGame.game_name));
	}

	async fillAllRooms() {
		const games = await this.prisma.game.findMany();
		for (const game of games) {
			this.initGame({ game: { data: game } });
		}
	}


	async addPlayerToWaitingList(info: UserDTO) : Promise<any> {
		PongService.waitingList.push(info);
	}

	async removePlayerFromWaitingList(info: User) : Promise<void> {
		for (const player of PongService.waitingList)
		{
			if (player.id === info.id)
			{
				const index = PongService.waitingList.indexOf(player);
				PongService.waitingList.splice(index, 1);
			}
		}
	}

	async isPlayerIsInWaitingList(info: UserDTO) : Promise<boolean> {
		for (const player of PongService.waitingList)
		{
			if (player.id === info.id)
				return true;
		}
		return false;
	}

	async isPlayerIsInGame(info: UserDTO) : Promise<boolean> {
		const res = await this.prisma.game.findMany({
			where: {
				OR: [
					{
						master_id: info.id,
					},
					{
						slave_id: info.id,
					}
				]
			}
		})
		if (res.length > 0)
			return true;
		return false;
	}

	async IsPlayerMatched() : Promise<boolean> {
		const ret = PongService.waitingList.length % 2;
		if (ret === 0)
			return true;
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
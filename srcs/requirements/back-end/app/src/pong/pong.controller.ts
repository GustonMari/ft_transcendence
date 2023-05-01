/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Res } from '@nestjs/common';
import { MessageBody } from '@nestjs/websockets';
import { PrismaService } from '../prisma/prisma.service';
import { PongService } from './pong.service';
import { Response } from 'express';
import { exit } from 'process';
import { PlayerMatched } from './pong.interface';
import { User } from '@prisma/client';

@Controller('pong')
export class PongController {
	constructor(
		private readonly pongService: PongService, private readonly prisma: PrismaService 
		){}

		@Post('create_game') // Subscribe to the event 'joinGame'
		// async create_game(@Res() response: Response ,@MessageBody() info: {master: User, slave: User}): Promise<void> {
		async create_game(@Res() response: Response ,@MessageBody() info: any): Promise<void> {
		console.log('DTTTTTTTTTTTTTTTTTTTTTTTOOOOOOOOOOOOOOOOOOOO WORK'); 
		// exit(1);
		await this.pongService.createGame(info.master, info.slave);
		response.send("Created game");

	}

		@Post('is_user_master')
		async is_user_master(@Res() response: Response ,@MessageBody() info: User): Promise<void> {
			const master = await this.pongService.isUserMaster(info.login);
			response.send(master);
		}

		@Post('is_user_slave')
		async is_user_slave(@Res() response: Response ,@MessageBody() info: User): Promise<void> {
			const slave = await this.pongService.isUserSlave(info.login);
			response.send(slave);
		}
		
		@Post('get_game_name')
		async get_game_name(@Res() response: Response ,@MessageBody() info: User): Promise<void> {
			const game_name = await this.pongService.getGameName(info.login);
			response.send(game_name);
		}

		@Post('get_games_rooms')
		async get_games_rooms(@Res() response: Response): Promise<void> {
			const games = await this.pongService.getGamesRooms();
			response.send(games);
		}

		@Post('set_game_over')
		async set_game_over(@Res() response: Response ,@MessageBody() info: any): Promise<void> {
			await this.pongService.setGameOver(info);
		}

		@Post('is_game_over')
		async is_game_over(@Res() response: Response ,@MessageBody() info: any): Promise<void> {
			const game = await this.pongService.isGameOver(info);
			response.send(game);
		}

		@Post('get_game')
		// async get_game(@Res() response: Response ,@MessageBody() info: any): Promise<void> {
		async get_game(@Res() response: Response ,@MessageBody() info: any): Promise<void> {

			// console.log('inside NTMMMMMMMMMM', info)
			console.log("getgetgetgame: info = ", info.game_name);
			// const game = await this.pongService.getGameByGameName(info.game_name.data);
			const game = await this.pongService.getGameByGameName(info.game_name);

			// exit(1);
			response.send(game);
		}

		@Post('init_game')
		async init_game(@Res() response: Response ,@MessageBody() info: any): Promise<void> {
			const game = await this.pongService.initGame(info);
			response.send(game);
		}

		@Post('is_matched')
		async is_matched(@Res() response: Response): Promise<void> {
			// console.log("burger king");
			const bool = await this.pongService.IsPlayerMatched();
			if (bool === true)
			{
				// console.log("MATCHED");
				// send les players
				// console.log("waiting list = ", await this.pongService.getWaitingList());
				response.send(await this.pongService.getWaitingList());
				// response.send("salut");

				// vider la list
				// await this.pongService.clearWaitingList();
			}
			else
			{
				//send null
				response.send(null);
				// console.log("NOT MATCHED");
			}
		}

		@Post('add_player_to_waiting_list')
		async add_player_to_waiting_list(@Res() response: Response ,@MessageBody() info: User): Promise<void> {
			await this.pongService.addPlayerToWaitingList(info);
			response.send("added");
		}

		@Post('is_player_in_waiting_list')
		async is_player_in_waiting_list(@Res() response: Response ,@MessageBody() info: any): Promise<void> {
			const bool = await this.pongService.isPlayerIsInWaitingList(info);
			response.send(bool);
		}

		@Post('is_player_is_in_game')
		async is_player_is_in_game(@Res() response: Response ,@MessageBody() info: any): Promise<void> {
			const bool = await this.pongService.isPlayerIsInGame(info);
			response.send(bool);
		}

		@Post('clear_waiting_list')
		async clear_waiting_list(@Res() response: Response): Promise<void> {
			await this.pongService.clearWaitingList();
			response.send("cleared");
		}

		// @Post('pause_game')
		// async pause_game(@Res() response: Response ,@MessageBody() info: any): Promise<void> {
		// 	// const game = await this.pongService.getGameName(info.login);
		// 	// await this.pongService.PauseGame(game.data.game_name);
		// 	await this.pongService.PauseGame(info);
		// 	response.send("paused");
		// }

		// @Post('resume_game')
		// async resume_game(@Res() response: Response ,@MessageBody() info: any): Promise<void> {
		// 	// const game = await this.pongService.getGameName(info.login);
		// 	// await this.pongService.resumeGame(game.data.game_name);
		// 	await this.pongService.resumeGame(info);
		// 	response.send("resumed");
		// }

		@Post('create_invitation_pong')
		async create_invitation_pong(@Res() response: Response ,@MessageBody() info: any): Promise<any> {
		
			await this.pongService.createInvitationPong(info.master, info.slave);
			response.send("invitation created");
		}

		@Post('delete_game')
		async delete_game(@Res() response: Response ,@MessageBody() info: any): Promise<void> {
			console.log("delete_game: info = ", info.game_name);	
			await this.pongService.deleteGame(info.game_name);
			response.send("deleted");
		}

		@Post('fill_all_rooms')
		async fill_all_rooms(@Res() response: Response): Promise<void> {
			await this.pongService.fillAllRooms();
			response.send("filled");
		}

}
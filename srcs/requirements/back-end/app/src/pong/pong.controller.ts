/* eslint-disable prettier/prettier */
import { Controller, Get, HttpServer, Inject, Post, Res } from '@nestjs/common';
import { MessageBody } from '@nestjs/websockets';
import { PrismaService } from '../prisma/prisma.service';
import { PongService } from './pong.service';
import { Response } from 'express';
import { exit } from 'process';
import { PlayerMatched } from './pong.interface';
import { InvitationPong, User } from '@prisma/client';
import { PongGateway } from './gateways/pong.gateway';

@Controller('pong')
export class PongController {
	constructor(
		private readonly pongService: PongService, private readonly prisma: PrismaService,
		){}

		@Post('create_game') // Subscribe to the event 'joinGame'
		async create_game(@Res() response: Response ,@MessageBody() info: any): Promise<void> {
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

		@Post('get_game')
		async get_game(@Res() response: Response ,@MessageBody() info: any): Promise<void> {

			const game = await this.pongService.getGameByGameName(info.game_name);
			response.send(game);
		}

		@Post('init_game')
		async init_game(@Res() response: Response ,@MessageBody() info: any): Promise<void> {
			const game = await this.pongService.initGame(info);
			response.send(game);
		}

		@Post('is_matched')
		async is_matched(@Res() response: Response): Promise<void> {
			const bool = await this.pongService.IsPlayerMatched();
			if (bool === true)
			{
				response.send(await this.pongService.getWaitingList());
				// vider la list
				// await this.pongService.clearWaitingList();
			}
			else
				response.send(null);
		}

		@Post('add_player_to_waiting_list')
		async add_player_to_waiting_list(@Res() response: Response ,@MessageBody() info: User): Promise<void> {
			await this.pongService.addPlayerToWaitingList(info);
			response.send("added");
		}

		@Post('remove_player_from_waiting_list')
		async remove_player_from_waiting_list(@Res() response: Response ,@MessageBody() info: User): Promise<void> {
			await this.pongService.removePlayerFromWaitingList(info);
			response.send("removed");
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

		@Post('create_invitation_pong')
		async create_invitation_pong(@Res() response: Response ,@MessageBody() info: any): Promise<any> {
			
			await this.pongService.createInvitationPong(info.master, info.slave);
			response.send("invitation created");
		}

		@Post('get_invitations_pong')
		async get_invitations_pong(@Res() response: Response ,@MessageBody() info: User): Promise<any> {
			const invitations = await this.pongService.getInvitationsPong(info.login);
			response.send(invitations);
		}

		@Post('delete_game')
		async delete_game(@Res() response: Response ,@MessageBody() info: any): Promise<void> {
			console.log("delete_game: info = ", info.gameName);
			await this.pongService.deleteGame(info.gameName);
			await this.pongService.deleteGameInAllRooms(info.gameName);
			response.send("deleted");
		}

		@Post('delete_invitation')
		async delete_invitation(@Res() response: Response ,@MessageBody() info: InvitationPong): Promise<void> {
			await this.pongService.deleteOneInvitationPong(info);
			response.send("deleted");
		}


		@Post('fill_all_rooms')
		async fill_all_rooms(@Res() response: Response): Promise<void> {
			await this.pongService.fillAllRooms();
			response.send("filled");
		}

}
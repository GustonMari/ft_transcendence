import { Controller, Get, Post, Res } from '@nestjs/common';
import { MessageBody } from '@nestjs/websockets';
import { PrismaService } from '../prisma/prisma.service';
import { PongService } from './pong.service';
import { Response } from 'express';

@Controller('pong')
export class PongController {
	constructor(
		private readonly pongService: PongService, private readonly prisma: PrismaService 
		){}

		@Post('create_game') // Subscribe to the event 'joinGame'
		async create_game(@Res() response: Response ,@MessageBody() info: any): Promise<void> {
		await this.pongService.createGame(info.master, info.slave);
		response.send("Created game");

	}

		@Post('is_user_master')
		async is_user_master(@Res() response: Response ,@MessageBody() info: any): Promise<void> {
			const master = await this.pongService.isUserMaster(info.login);
			response.send(master);
		}

		@Post('get_game_name')
		async get_game(@Res() response: Response ,@MessageBody() info: any): Promise<void> {
			const game = await this.pongService.getGameName(info.login);
			response.send(game);
		}
}

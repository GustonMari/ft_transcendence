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
		console.log("Pilaxxxxxxxxxxxxxxxxxxxxxxxxxxx info = ", info);
		await this.pongService.createGame(info.master, info.slave);
		console.log("isusermaster = ", await this.pongService.isUserMaster(info.master.login));
		console.log("login slave --> isusermaster = ", await this.pongService.isUserMaster(info.slave.login));
		response.send("Created game");

	}

		@Post('is_user_master')
		async is_user_master(@Res() response: Response ,@MessageBody() info: any): Promise<void> {
			const master = await this.pongService.isUserMaster(info.login);
			response.send(master);
		}
}

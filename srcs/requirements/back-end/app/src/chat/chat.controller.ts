/* eslint-disable prettier/prettier */
import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { AccessGuard } from '../auth/guards/access.guard';
import { ChatService } from './chat.service';
import { PrismaService } from '../prisma/prisma.service';
// import { RoomRO } from './ros/chat.full.ro';
import { TransformPlainToInstance } from 'class-transformer';
import { GetMe } from '../auth/decorators';
import { Response } from 'express';
import { UserRO } from '../user/ros/user.full.ro';


@UseGuards(AccessGuard)
@Controller('chat')
export class ChatController {
	constructor (
		private readonly chatService: ChatService, private readonly prismaservice: PrismaService 
	){}

	@Get('get_user_rooms')
	async get_rooms(@Res() response: Response ,@GetMe("id") id: number,): Promise<any> {
		
		const rooms = await this.chatService.getUserRooms(id);
		response.send(rooms);
		// return (rooms);
	}
}

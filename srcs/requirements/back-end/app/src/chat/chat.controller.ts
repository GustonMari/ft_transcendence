/* eslint-disable prettier/prettier */
import { Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import { AccessGuard } from '../auth/guards/access.guard';
import { ChatService } from './chat.service';
import { PrismaService } from '../prisma/prisma.service';
// import { RoomRO } from './ros/chat.full.ro';
import { TransformPlainToInstance } from 'class-transformer';
import { GetMe } from '../auth/decorators';
import { Response } from 'express';
import { UserRO } from '../user/ros/user.full.ro';
import { MessageBody } from '@nestjs/websockets';


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
	}

	@Post('get_messages_by_room')
	async get_messages_by_room(@Res() response: Response ,@MessageBody() room_name: any): Promise<any> {
		if (room_name == null || room_name == undefined)
			return null;
		const rooms = await this.chatService.getMessagesByRoom(room_name.room_name);
		response.send(rooms);
	}

	@Post('get_isban_user')
	async get_isban_user_by_room(@Res() response: Response ,@MessageBody() info: any): Promise<void> {

		const ban = await this.chatService.isUserBannedInRoom(info.room_name, info.id_user);
		response.send(ban);

	}

	@Post('get_isowner_login')
	async get_isowner_login(@Res() response: Response ,@MessageBody() info: any): Promise<void> {
		const owner = await this.chatService.IsOwnerOfRoomByLogin(info.room_name, info.login);
		response.send(owner);

	}

	@Post('set_room_password')
	async set_room_password(@Res() response: Response ,@MessageBody() info: any): Promise<void> {
		const res = await this.chatService.setRoomPassword(info.room_name, info.user_id, info.password);
		response.send(res);
	}

	@Post('verify_room_password')
	async verify_room_password(@Res() response: Response ,@MessageBody() info: any): Promise<void> {
		const res = await this.chatService.verifyRoomPassword(info.room_name, info.password);
		response.send(res);
	}
}

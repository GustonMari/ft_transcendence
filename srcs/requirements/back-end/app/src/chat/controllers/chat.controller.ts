/* eslint-disable prettier/prettier */
import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Param, Post, Res, UseGuards } from '@nestjs/common';
import { AccessGuard } from '../../auth/guards/access.guard';
import { ChatService } from '../services/chat.service';
import { PrismaService } from '../../prisma/prisma.service';
import { GetMe } from '../../auth/decorators';
import { Response } from 'express';
import { MessageBody } from '@nestjs/websockets';
import { ApiOperation } from '@nestjs/swagger';
import { ChatDTO, CreatePrivateRoomDTO } from '../dtos';

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

	@Post("get_user_socket_id")
	async get_user_socket_id(@Res() response: Response ,@MessageBody() info: ChatDTO): Promise<any> {
		const socket_id = await this.chatService.getUserSocketId(info.login);
		response.send(socket_id);
	}

	@Post('is_user_exists')
	async is_user_exists(@Res() response: Response ,@MessageBody() info: ChatDTO): Promise<any> {
		const user = await this.chatService.isUserExists(info.login);
		response.send(user);
	}

	@Post('get_messages_by_room')
	async get_messages_by_room(@Res() response: Response ,@MessageBody() room_name: ChatDTO): Promise<any> {
		if (room_name == null || room_name == undefined)
			return null;
		const rooms = await this.chatService.getMessagesByRoom(room_name.room_name);
		response.send(rooms);
	}

	@Post('get_isban_user')
	async get_isban_user_by_room(@Res() response: Response ,@MessageBody() info: ChatDTO): Promise<void> {

		const ban = await this.chatService.isUserBannedInRoom(info.room_name, info.id_user);
		response.send(ban);
	}

	@Post('get_isowner_login')
	async get_isowner_login(@Res() response: Response ,@MessageBody() info: ChatDTO): Promise<void> {
		const owner = await this.chatService.IsOwnerOfRoomByLogin(info.room_name, info.login);
		response.send(owner);
	}

	@Post('set_room_password')
	async set_room_password(@Res() response: Response ,@MessageBody() info: ChatDTO): Promise<void> {
		const res = await this.chatService.setRoomPassword(info.room_name, info.user_id, info.password);
		response.send(res);
	}

	@Post('verify_room_password')
	async verify_room_password(@Res() response: Response ,@MessageBody() info: ChatDTO): Promise<void> {
		// const res = await this.chatService.verifyRoomPassword(info.room_name, await  argon.hash(info.password));
		const res = await this.chatService.verifyRoomPassword(info.room_name, info.password);
		response.send(res);
	}

	@Post('is_room_has_password')
	async is_room_has_password(@Res() response: Response ,@MessageBody() room_name: ChatDTO): Promise<void> {
		const res = await this.chatService.isRoomHasPassword(room_name.room_name);
		response.send(res);
	}

    @ApiOperation({
        summary: 'Create private room between two users',
    })
    @Post('create_room')
    @HttpCode(HttpStatus.CREATED)
    async createRoom (
        @Body() dto: CreatePrivateRoomDTO,
        @GetMe('id') id: number,
    ): Promise<void> {
        try {
            await this.chatService.createChatRoom(dto.name, id);
            await this.chatService.joinChatRoom(dto.name, dto.invite_id);  
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

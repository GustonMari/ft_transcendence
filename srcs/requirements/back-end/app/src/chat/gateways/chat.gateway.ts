/* eslint-disable prettier/prettier */

import { SubscribeMessage,
	WebSocketGateway,
	MessageBody,
	WebSocketServer,
	OnGatewayInit,
	OnGatewayConnection,
	OnGatewayDisconnect,
	WsResponse,
	ConnectedSocket,
} from '@nestjs/websockets';

import { UseGuards } from '@nestjs/common';


import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { AccessGuard } from 'app/src/auth/guards/access.guard';
import { User } from '@prisma/client';
import { UserController } from 'app/src/user/controllers/user.controller';
import { ChatService } from '../chat.service';
import { InfoBanTo, InfoMessage, InfoMuteTo, InfoRoom, InfoRoomTo, InfoInvite } from './chat.interface';
import { ChatSchedulingService } from '../chat_scheduling.service';
import { GetMe } from 'app/src/auth/decorators';


// @UseGuards(AccessGuard)
@WebSocketGateway({
	cors: {
		origin: "http://localhost:3000/",
		credentials: true,
		methods: ['GET', 'POST'],
	}
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	constructor(private chatService: ChatService, private chatSchedulingService: ChatSchedulingService) {
		this.chatSchedulingService.handleCron();
	}

	@WebSocketServer() // Create a instance of the server
	myserver: Server;

	private logger: Logger = new Logger('AppGateway');

	afterInit(server: Server) {
		this.logger.log('Initialized!');
	}

	handleConnection(client: Socket, ...args: any[]) {
		
		client.join('all');
	}

	handleDisconnect(client: Socket) {
	}

	// @SubscribeMessage('isban')
	// async handleIsBan(@MessageBody() data: InfoRoom, @ConnectedSocket() socket: Socket): Promise<void> {
	// 	const roomExists = await this.chatService.roomExists(data.room_name);
	// 	if (roomExists && await this.chatService.isUserBannedInRoom(data.room_name, data.id_user)) {
	// 		await socket.emit('isban', true);
	// 		// return;
	// 	}
	// 	else
	// 		socket.emit('isban', false);

	// }


	@SubscribeMessage('joinRoom')
	async handleJoinRoom(@MessageBody() data: InfoRoom, @ConnectedSocket() socket: Socket): Promise<void> {
		
		const roomExists = await this.chatService.roomExists(data.room_name);
		// if (roomExists && await this.chatService.isUserBannedInRoom(data.room_name, data.id_user)) {
		// 	await socket.emit('isban', true);
		// 	return;
		// }
		// socket.emit('isban', false);
		if (roomExists) { 
			await this.chatService.joinChatRoom(data.room_name, data.id_user);
		}
		else {
			await this.chatService.createChatRoom(data.room_name, data.id_user);
			await this.chatService.setAdmin(data.room_name, data.id_user);
		}
		await socket.join(data.room_name);
		socket.emit('renderReact', 'renderReact');
	
	}

	@SubscribeMessage('leaveRoom')
	async handleLeaveRoom(@MessageBody() data: InfoRoom, @ConnectedSocket() socket: Socket) {
		await this.chatService.leaveRoom(data.room_name, data.id_user);
		await socket.leave(data.room_name);
		socket.emit('renderReact', 'renderReact');
	}

	@SubscribeMessage('changeRoom')
	async handleChangeRoom(@MessageBody() data: InfoRoom, @ConnectedSocket() socket: Socket) {
		await socket.leave(data.room_name);
		socket.emit('renderReact', 'renderReact');
	}

	@SubscribeMessage('deleteRoom')
	async handleDeleteRoom(@MessageBody() data: InfoRoom, @ConnectedSocket() socket: Socket) {
		if(!this.chatService.isAdmin(data.room_name, data.id_user))
		{
			console.log('you dont have permission to delete the room');
			return ;
		}
		await this.chatService.deleteRoom(data.room_name, data.id_user);
		this.myserver.to(data.room_name).emit('renderReact', 'renderReact');
		await this.myserver.socketsLeave(data.room_name);

		// await this.myserver.socketsLeave(data.room_name);
		// await this.chatService.deleteRoom(data.room_name, data.id_user);
		// socket.emit('renderReact', 'renderReact');
	}

	@SubscribeMessage('setAdmin')
	async handleSetAdmin(@MessageBody() data: InfoRoomTo): Promise<void> {
		
		if (this.chatService.isAdmin(data.room_name, data.id_user_from)) {
			const id_user_to = await this.chatService.getIdUser(data.login_user_to);
			await this.chatService.setAdmin(data.room_name, id_user_to);
		}
	}

	@SubscribeMessage('banUser')
	async handleBanUser(@MessageBody() data: InfoBanTo): Promise<void> {

		if (await this.chatService.isAdmin(data.room_name, data.id_user_from)) {
			const id_user_to = await this.chatService.getIdUser(data.login_user_to);
			if (await this.chatService.isAdmin(data.room_name, id_user_to))
			{
				return ;
			}
			const ban_date = new Date();
			ban_date.setTime(ban_date.getTime() + data.ban_till * 60000);
			await this.chatService.banUser(data.room_name, data.id_user_from, id_user_to, ban_date);
		}
	}

	@SubscribeMessage('unbanUser')
	async handleUnbanUser(@MessageBody() data: InfoRoomTo): Promise<void> {

		if (await this.chatService.isAdmin(data.room_name, data.id_user_from)) {
			const id_user_to = await this.chatService.getIdUser(data.login_user_to);
			await this.chatService.unbanUser(data.room_name, data.id_user_from, id_user_to);
		}
	}

	@SubscribeMessage('muteUser')
	async handleMuteUser(@MessageBody() data: InfoMuteTo): Promise<void> {

		if (await this.chatService.isAdmin(data.room_name, data.id_user_from)) {
			const id_user_to = await this.chatService.getIdUser(data.login_user_to);
			if (await this.chatService.isAdmin(data.room_name, id_user_to))
			{
				return ;
			}
			const mute_date = new Date();
			mute_date.setTime(mute_date.getTime() + data.mute_till * 60000);
			await this.chatService.muteUser(data.room_name, data.id_user_from, id_user_to, mute_date);
		}
	}

	@SubscribeMessage('invite_pong')
	async handleInvitePong(@MessageBody() data: InfoInvite, @ConnectedSocket() socket: Socket) {
		
	}

	@SubscribeMessage('message') // Subscribe to the message event send by the client (front end) called 'message'
	async handleMessage(@MessageBody() data: InfoMessage, @ConnectedSocket() socket: Socket) {
		if (data.current_user === undefined )
			return ;
		if (await this.chatService.isUserBannedInRoom(data.room, data.current_user.id)) {
			return ;
		}
		if (await (this.chatService.isUserMutedInRoom(data.room, data.current_user.id)))
		{
			await this.chatService.stockMessage(data);
			this.myserver.to(data.room).emit('message', data); // Emit the message event to the client, for every user
		}
	}
}

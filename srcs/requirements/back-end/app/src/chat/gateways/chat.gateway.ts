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
import { InfoBanTo, InfoMessage, InfoMuteTo, InfoRoom, InfoRoomTo } from './chat.interface';
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

	// usrcontroller: UserController = new UserController();
	// const server = require('http').createServer();

	//create code who enable cors for the server

	private logger: Logger = new Logger('AppGateway');

	afterInit(server: Server) {
		this.logger.log('Initialized!');
	}

	handleConnection(client: Socket, ...args: any[]) {
		
		client.join('all');
		// this.logger.log(`Client connected: ${client.id}`);
	}

	handleDisconnect(client: Socket) {
		// this.logger.log(`Client disconnected: ${client.id}`);
	}

	@SubscribeMessage('joinRoom')
	async handleJoinRoom(@MessageBody() data: InfoRoom, @ConnectedSocket() socket: Socket): Promise<void> {
		
		const roomExists = await this.chatService.roomExists(data.room_name);
		if (roomExists) {
			await this.chatService.joinChatRoom(data.room_name, data.id_user);
			console.log(`The room "${data.room_name}" exist, you join the room`);

		}
		else {
			await this.chatService.createChatRoom(data.room_name, data.id_user);
			console.log(`The room "${data.room_name}" does not exist, you create the room, you are admin`);
			await this.chatService.setAdmin(data.room_name, data.id_user);
		}
		await socket.join(data.room_name);
		// this.myserver.to(data.room_name).emit('message', `new user (${data.id_user}) joined the room`);
	}

	@SubscribeMessage('leaveRoom')
	handleLeaveRoom(@MessageBody() data: InfoRoom, @ConnectedSocket() socket: Socket) {
		//? emit un  petit message pour dire que tel user a quitte la room
		console.log(`user ${data.id_user} left the room ${data.room_name}`);
		this.chatService.leaveRoom(data.room_name, data.id_user);
		socket.leave(data.room_name);
		// this.myserver.to(data.room_name).emit('message', `new user (${data.id_user}) has leave the room`);
	}

	@SubscribeMessage('deleteRoom')
	handleDeleteRoom(@MessageBody() data: InfoRoom): void {
		//* check si le user est admin
		// socket.leave(room);

		this.myserver.socketsLeave(data.room_name);
		this.chatService.deleteRoom(data.room_name, data.id_user);
		//! ici on va supprimer la room dans la table user de prisma
	}

	@SubscribeMessage('setAdmin')
	async handleSetAdmin(@MessageBody() data: InfoRoomTo): Promise<void> {
		
		if (this.chatService.isAdmin(data.room_name, data.id_user_from)) {
			const id_user_to = await this.chatService.getIdUser(data.login_user_to);
			await this.chatService.setAdmin(data.room_name, id_user_to);
			// this.myserver.to(data.room_name).emit('message', `user (${id_user_to}) is now admin`);
		}
		// else
			// this.myserver.to(data.room_name).emit('message', `you dont have permission to set an admin`);
	}

	@SubscribeMessage('banUser')
	async handleBanUser(@MessageBody() data: InfoBanTo): Promise<void> {

		if (await this.chatService.isAdmin(data.room_name, data.id_user_from)) {
			const id_user_to = await this.chatService.getIdUser(data.login_user_to);
			if (await this.chatService.isAdmin(data.room_name, id_user_to))
			{
				// this.myserver.to(data.room_name).emit('message', `you cant ban an admin`);
				return ;
			}
			const ban_date = new Date();
			ban_date.setTime(ban_date.getTime() + data.ban_till * 60000);
			await this.chatService.banUser(data.room_name, data.id_user_from, id_user_to, ban_date);
			// this.myserver.to(data.room_name).emit('message', `user (${id_user_to}) is now ban`);
		}
		// else
			// this.myserver.to(data.room_name).emit('message', `you dont have permission to ban an user`);
	}

	@SubscribeMessage('unbanUser')
	async handleUnbanUser(@MessageBody() data: InfoRoomTo): Promise<void> {

		if (await this.chatService.isAdmin(data.room_name, data.id_user_from)) {
			const id_user_to = await this.chatService.getIdUser(data.login_user_to);
			await this.chatService.unbanUser(data.room_name, data.id_user_from, id_user_to);
			// this.myserver.to(data.room_name).emit('message', `user (${id_user_to}) is now unbanned`);
		}
		// else
			// this.myserver.to(data.room_name).emit('message', `you dont have permission to unban an user`);
	}

	@SubscribeMessage('muteUser')
	async handleMuteUser(@MessageBody() data: InfoMuteTo): Promise<void> {

		if (await this.chatService.isAdmin(data.room_name, data.id_user_from)) {
			const id_user_to = await this.chatService.getIdUser(data.login_user_to);
			if (await this.chatService.isAdmin(data.room_name, id_user_to))
			{
				// this.myserver.to(data.room_name).emit('message', `you cant mute an admin`);
				return ;
			}
			const mute_date = new Date();
			mute_date.setTime(mute_date.getTime() + data.mute_till * 60000);
			await this.chatService.muteUser(data.room_name, data.id_user_from, id_user_to, mute_date);
			// this.myserver.to(data.room_name).emit('message', `user (${id_user_to}) is now muted`);
		}
		// else
		// 	this.myserver.to(data.room_name).emit('message', `you dont have permission to mute an user`);
	}

	// @SubscribeMessage('removeAdmin')
	// handleRemoveAdmin(socket: Socket, user: string): void {
	// 	//* check si le user qui fait la demande est admin
	// 	//! changer prisma pour que le user soit plus admin
	// 	//? emit un petit message pour dire que tel user n'est plus admin
	// }

	// @SubscribeMessage('getMessagesByRoom')
	// async handleGetMessagesByRoom(@MessageBody() room_name: string) {
	// 	const messages = await this.chatService.getMessagesByRoom(room_name);
	// 	await this.myserver.to(room_name).emit('get_messages_history', messages);
	// }

	@SubscribeMessage('message') // Subscribe to the message event send by the client (front end) called 'message'
	async handleMessage(@MessageBody() data: InfoMessage, @ConnectedSocket() socket: Socket) {
		if (data.current_user === undefined /* || data.message === undefined */)
			return ;
		console.log('Dans message :', data.current_user.login)
		await this.chatService.stockMessage(data);
		this.myserver.to(data.room).emit('message', data); // Emit the message event to the client, for every user

	}
}


// @WebSocketGateway({
// 	namespace: 'admin',
// 	cors: {
// 		origin: "http://localhost:3000/",
// 		credentials: true,
// 		methods: ['GET', 'POST'],
// 	}
// })
// export class AdminChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
// 	@WebSocketServer()
// 	myserver: Server;



// 	private logger: Logger = new Logger('AppGateway');

// 	afterInit(server: Server) {
// 		this.logger.log('Initialized!');
// 	}

// 	handleConnection(client: Socket, ...args: any[]) {
// 		client.join('all');
// 	}

// 	handleDisconnect(client: Socket) {
// 	}

// }
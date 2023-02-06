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
import { InfoMessage, InfoRoom } from './chat.interface';


// @UseGuards(AccessGuard)
@WebSocketGateway({
	cors: {
		origin: "http://localhost:3000/",
		credentials: true,
		methods: ['GET', 'POST'],
	}
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	constructor(private chatService: ChatService) {}

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
		
		// const roomExists = this.myserver.sockets.adapter.rooms.has(data.room_name);
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
		// 	//* usr devient admin
		await socket.join(data.room_name);
		this.myserver.to(data.room_name).emit('message', `new user (${data.id_user}) joined the room`);
	}

	@SubscribeMessage('leaveRoom')
	handleLeaveRoom(@MessageBody() data: InfoRoom, @ConnectedSocket() socket: Socket) {
		//? emit un  petit message pour dire que tel user a quitte la room
		console.log(`user ${data.id_user} left the room ${data.room_name}`);
		this.chatService.leaveRoom(data.room_name, data.id_user);
		socket.leave(data.room_name);
		this.myserver.to(data.room_name).emit('message', `new user (${data.id_user}) has leave the room`);
	}



	@SubscribeMessage('deleteRoom')
	handleDeleteRoom(@MessageBody() data: InfoRoom, @ConnectedSocket() socket: Socket): void {
		//* check si le user est admin
		// socket.leave(room);

		this.myserver.socketsLeave(data.room_name);
		this.chatService.deleteRoom(data.room_name, data.id_user);
		//! ici on va supprimer la room dans la table user de prisma
	}

	// @SubscribeMessage('banUser')
	// handleBanUser(socket: Socket, user: string): void {
	// 	//* check si le user est admin
	// 	//! changer prisma pour que le user soit ban
	// 	//? emit un petit message pour dire que tel user a ete ban
	// }

	// @SubscribeMessage('unbanUser')
	// handleUnbanUser(socket: Socket, user: string): void {
	// 	//* check si le user est admin
	// 	//! changer prisma pour que le user soit unban
	// 	//? emit un petit message pour dire que tel user a ete unban
	// }

	// @SubscribeMessage('blockUser')
	// handleBlockUser(socket: Socket, user: string): void {
	// 	//! changer prisma pour que le user soit block
	// }

	// @SubscribeMessage('unblockUser')
	// handleUnblockUser(socket: Socket, user: string): void {
	// 	//! changer prisma pour que le user soit unblock
	// }

	// @SubscribeMessage('addAdmin')
	// handleAddAdmin(socket: Socket, user: string): void {
	// 	//* check si le user qui fait la demande est admin
	// 	//! changer prisma pour que le user soit admin
	// 	//? emit un petit message pour dire que tel user est admin
	// }

	// @SubscribeMessage('removeAdmin')
	// handleRemoveAdmin(socket: Socket, user: string): void {
	// 	//* check si le user qui fait la demande est admin
	// 	//! changer prisma pour que le user soit plus admin
	// 	//? emit un petit message pour dire que tel user n'est plus admin
	// }


	@SubscribeMessage('message') // Subscribe to the message event send by the client (front end) called 'message'
	handleMessage(@MessageBody() data: InfoMessage, @ConnectedSocket() socket: Socket): void {

		// socket.join(data.room);
		// console.log('=== socket id: ' + socket.id + ' joined room: ' + new Array(...socket.rooms).join(' '));
		this.myserver.to(data.room).emit('message', data.message); // Emit the message event to the client, for every user

	}
}


@WebSocketGateway({
	namespace: 'admin',
	cors: {
		origin: "http://localhost:3000/",
		credentials: true,
		methods: ['GET', 'POST'],
	}
})
export class AdminChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
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

}
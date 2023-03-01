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

import { Post, Res, UseGuards } from '@nestjs/common';


import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { AccessGuard } from 'app/src/auth/guards/access.guard';
import { User } from '@prisma/client';
import { UserController } from 'app/src/user/controllers/user.controller';
import { ChatService } from '../chat.service';
import { InfoBanTo, InfoMessage, InfoMuteTo, InfoRoom, InfoRoomTo } from './chat.interface';
import { ChatSchedulingService } from '../chat_scheduling.service';
import { GetMe } from 'app/src/auth/decorators';

var check = 0;

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
		
		client.emit('connected');
		client.join('all');
	}

	handleDisconnect(client: Socket) {
	}

	@SubscribeMessage('addsocket')
	async addSocketToUser(@MessageBody() data: any, @ConnectedSocket() socket: Socket): Promise<void> {
		
		await this.chatService.addSocketToUser(data.id, socket.id);
	
	}

	@SubscribeMessage('getSocketById')
		async handleGetSocketById(@MessageBody() data: { socket_id: string }): Promise<Socket> {
		const { socket_id } = data;
		const sockets = this.myserver.sockets.sockets;
		const client_socket = sockets[socket_id];
		return client_socket;
	}

	// @SubscribeMessage('joinRoomWithSocketId')
	// async joinRoomWithSocketId(@MessageBody() data: any, @ConnectedSocket() current_socket: Socket): Promise<void> {
	// 	console.log(check, 'joinRoomWithSocketId', JSON.stringify(Date.now()));
	// 	check += 1;
	// 	const sockets = this.myserver.sockets.sockets;
	// 	const client_socket = sockets.get(data.socket_id);
	// 	const user_id = await this.chatService.getIdUser(data.login);
	// 	await this.chatService.joinChatRoom(data.room_name, user_id);

	// 	// await this.chatService.updateChatRoom(data.room_name, user_id);

	// 	await client_socket.join(data.room_name);
	// 	client_socket.emit('joinPrivateRoom', {my_room_name: data.room_name, my_user_id: user_id});
	// 	client_socket.emit('renderReact', 'renderReact');
	// 	current_socket.emit('renderReact', 'renderReact');
	// }

	@SubscribeMessage('joinRoomWithSocketId')
	async joinRoomWithSocketId(@MessageBody() data: any, @ConnectedSocket() current_socket: Socket): Promise<void> {
		console.log(check, 'joinRoomWithSocketId', JSON.stringify(Date.now()));
		check += 1;
		const sockets = this.myserver.sockets.sockets;
		const client_socket = sockets.get(data.socket_id);
		const user_id = await this.chatService.getIdUser(data.login);
		console.log('                                       FIRST JOIN')
		await this.chatService.joinChatRoom(data.room_name, data.current_user_id);
		// await this.chatService.updateChatRoom(data.room_name, user_id);
		console.log('                                       SECOND JOIN')

		await this.chatService.joinChatRoom(data.room_name, user_id);

		await client_socket.join(data.room_name);
		await current_socket.join(data.room_name);
		client_socket.emit('joinPrivateRoom', {my_room_name: data.room_name, my_user_id: user_id});
		current_socket.emit('joinPrivateRoom', {my_room_name: data.room_name, my_user_id: data.current_user_id});
		client_socket.emit('renderReact', 'renderReact');
		current_socket.emit('renderReact', 'renderReact');
	}
	
	@Post('joinRoomWithSocketIdPost')
	async joinRoomWithSocketIdPost(@MessageBody() data: any, @Res() res: Response): Promise<void> {
		
	}


	@SubscribeMessage('joinRoom')
	async handleJoinRoom(@MessageBody() data: InfoRoom, @ConnectedSocket() socket: Socket): Promise<void> {
		
		const roomExists = await this.chatService.roomExists(data.room_name);
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
		if (!await this.chatService.IsOwnerOfRoomById(data.room_name, data.id_user))
			return ;
		await this.chatService.deleteRoom(data.room_name, data.id_user);
		// this.myserver.to(data.room_name).emit('renderReact', 'renderReact');
		this.myserver.emit('renderReact', 'renderReact');
		await this.myserver.socketsLeave(data.room_name);
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
			if (await this.chatService.isAdmin(data.room_name, id_user_to) 
				&& (!await this.chatService.IsOwnerOfRoomById(data.room_name, data.id_user_from)))
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
			if (await this.chatService.isAdmin(data.room_name, id_user_to) 
				&& (!await this.chatService.IsOwnerOfRoomById(data.room_name, data.id_user_from)))
			{
				return ;
			}
			const mute_date = new Date();
			mute_date.setTime(mute_date.getTime() + data.mute_till * 60000);
			await this.chatService.muteUser(data.room_name, data.id_user_from, id_user_to, mute_date);
		}
	}

	// @SubscribeMessage('removeAdmin')
	// handleRemoveAdmin(socket: Socket, user: string): void {
	// 	//* check si le user qui fait la demande est admin
	// 	//! changer prisma pour que le user soit plus admin
	// 	//? emit un petit message pour dire que tel user n'est plus admin
	// }

	@SubscribeMessage('message') // Subscribe to the message event send by the client (front end) called 'message'
	async handleMessage(@MessageBody() data: InfoMessage, @ConnectedSocket() socket: Socket) {
		if (data.current_user === undefined )
			return ;
		if (await this.chatService.isUserBannedInRoom(data.room, data.current_user.id))
			return ;
		if (await (this.chatService.isUserMutedInRoom(data.room, data.current_user.id))) {
			await this.chatService.stockMessage(data);
			this.myserver.to(data.room).emit('message', data); // Emit the message event to the client, for every user
		}
	}
}


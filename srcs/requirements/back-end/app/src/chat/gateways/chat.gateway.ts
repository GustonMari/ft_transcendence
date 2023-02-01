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

import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
	cors: {
		origin: "http://localhost:3000/",
		credentials: true,
		methods: ['GET', 'POST'],
	}
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() // Create a instance of the server
	myserver: Server;

	// const server = require('http').createServer();

	//create code who enable cors for the server

	private logger: Logger = new Logger('AppGateway');

	afterInit(server: Server) {
		this.logger.log('Initialized!');
	}

	handleConnection(client: Socket, ...args: any[]) {
		// console.log('C est la connection : ', client.id);
		//ajouter check si all existe deja
		client.join('all');
		// this.logger.log(`Client connected: ${client.id}`);
	}

	handleDisconnect(client: Socket) {
		// this.logger.log(`Client disconnected: ${client.id}`);
	}

	@SubscribeMessage('joinRoom')
	handleJoinRoom(@MessageBody() data: any, @ConnectedSocket() socket: Socket): void {
		//! ici on va ajouter a prisma la room dans la table user
		//? on peut peut etre emit un petit message pour dire quon a join la room
		console.log('BACK JOIN ROOM data : ' + data + ' socket.id = ' + socket.id );
		socket.join(data);
		// this.myserver.to(data.room).emit('message', 'new user joined the room');
		console.log('socket id: ' + socket.id + ' joined room: ' + new Array(...socket.rooms).join(' '));
		// return { event: 'joinRoom', data: room};
	}

	// @SubscribeMessage('leaveRoom')
	// handleLeaveRoom(socket: Socket, room: string): WsResponse<unknown> {
	// 	//? emit un  petit message pour dire que tel user a quitte la room
	// 	//! ici on va ajouter a prisma la room dans la table user
	// 	socket.leave(room);
	// 	return { event: 'joinRoom', data: room};
	// }

	// @SubscribeMessage('createRoom')
	// handleCreateRoom(socket: Socket, room: string): WsResponse<unknown> {
	// 	//* usr devient admin
	// 	//! ici on va ajouter a prisma la room dans la table user
	// 	socket.join(room);
	// 	return { event: 'createRoom', data: room};
	// }

	// @SubscribeMessage('deleteRoom')
	// handleDeleteRoom(socket: Socket, room: string): void {
	// 	//* check si le user est admin
	// 	socket.leave(room);
	// 	//! ici on va supprimer la room dans la table user de prisma
	// }

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

	// @SubscribeMessage('muteUser')
	// handleMuteUser(socket: Socket, user: string): void {
	// 	//! changer prisma pour que le user soit mute
	// }

	// @SubscribeMessage('unmuteUser')
	// handleUnmuteUser(socket: Socket, user: string): void {
	// 	//! changer prisma pour que le user soit unmute
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
		



	// this.myserver.on('message', (socket) => {
	// 	console.log('C est la connection : ', socket.id);
	// 	socket.join('all');
	// });



	@SubscribeMessage('message') // Subscribe to the message event send by the client (front end) called 'message'
	handleMessage(@MessageBody() data: any, @ConnectedSocket() socket: Socket): void {

		console.log('C est le message : ', data.room);

		// socket.join(data.room);
		console.log('=== data room = ' + data.room);
		console.log('=== socket id: ' + socket.id + ' joined room: ' + new Array(...socket.rooms).join(' '));
		this.myserver.to(data.room).emit('message', data.message); // Emit the message event to the client, for every user

	}
}

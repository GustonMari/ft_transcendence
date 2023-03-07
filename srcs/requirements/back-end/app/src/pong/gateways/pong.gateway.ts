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
import { Socket, Server } from 'socket.io';
import { PongService } from '../pong.service';

@WebSocketGateway({
	cors: {
		origin: "http://localhost:3000/",
		credentials: true,
		methods: ['GET', 'POST'],
	}
})
export class PongGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	constructor(private pongService: PongService){}

	@WebSocketServer() // Create a instance of the server
	myserver: Server;

	afterInit(server: Server) {
		console.log('Initialized!');
	}

	handleConnection(client: Socket, ...args: any[]) {
		console.log('connected');
		client.emit('connected');
		client.join('all');
	}

	handleDisconnect(client: Socket) {
		console.log('disconnect');
	}

	@SubscribeMessage('createGame') // Subscribe to the event 'joinGame'
	async joinGame(@MessageBody() data: any, @ConnectedSocket() socket: Socket): Promise<void> {
		console.log("pilouuuuuu");
		// socket.

		socket.emit('gameCreated', 'pilouuuuuu');
		
	}
}
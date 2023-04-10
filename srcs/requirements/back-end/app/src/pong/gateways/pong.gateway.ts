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

	@SubscribeMessage('InitGame')
	async initGame(@MessageBody() data: any, @ConnectedSocket() socket: Socket): Promise<void> {
		
	}


	@SubscribeMessage('defineBall')
	async defineBall(@MessageBody() data: any, @ConnectedSocket() socket: Socket): Promise<void> {
		console.log("defineBall");
	}

	@SubscribeMessage('defineLimit')
	async defineLimit(@MessageBody() data: any, @ConnectedSocket() socket: Socket): Promise<void> {
		console.log("defineLimit", );
	}

	// @SubscribeMessage('createGame') // Subscribe to the event 'joinGame'
	// async joinGame(@MessageBody() data: any, @ConnectedSocket() socket: Socket): Promise<void> {
	// 	console.log("pilouuuuuu");
		
	// 	await this.pongService.createGame(data.master, data.slave);
	// 	console.log("isusermaster = ", await this.pongService.isUserMaster(data.master.login));
	// 	socket.emit('gameCreated', 'pilouuuuuu');

	// }
}
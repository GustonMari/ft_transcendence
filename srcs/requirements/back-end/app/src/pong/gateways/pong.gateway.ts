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



	constructor(private pongService: PongService){
		console.log("PongGateway");
		
	 }

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

	@SubscribeMessage('resetGame')
	async resetGame(@MessageBody() data: any, @ConnectedSocket() socket: Socket): Promise<void> {
		console.log("resetGame");
		let all = this.pongService.all;

		socket.emit('resetGame', {x: all.x, y: all.y, vector: all.vector, velocity: all.velocity});
	}

	@SubscribeMessage('updateGame')
	async updateGame(@MessageBody() data: any, @ConnectedSocket() socket: Socket): Promise<void> {
		let ret = await this.pongService.updateGame(data);
		if (ret.leftScore >= 11 || ret.rightScore >= 11) {
			//TODO: need to change to emit to all in a room, how to get game name ??
			this.myserver.to().emit('GameFinished', ret);
			// socket.emit('GameFinished', ret);
		}else {
			socket.emit('GameUpdated', ret);
		}
	}

	@SubscribeMessage('updatePaddleLeft')
	async updatePaddleLeft(@MessageBody() data: string, @ConnectedSocket() socket: Socket): Promise<void> {
		console.log("updatePaddleLeft");
		this.pongService.movePaddeLeft(data);
	}

	@SubscribeMessage('updatePaddleRight')
	async updatePaddleRight(@MessageBody() data: string, @ConnectedSocket() socket: Socket): Promise<void> {
		console.log("updatePaddleRight");
		this.pongService.movePaddeRight(data);
	}

	@SubscribeMessage('reset')
	async reset(@MessageBody() data: any, @ConnectedSocket() socket: Socket): Promise<void> {
		console.log("reset");
		this.pongService.reset();
	}
}
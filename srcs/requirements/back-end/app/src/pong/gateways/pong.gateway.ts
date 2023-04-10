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
		// console.log("updateGame");
		let ret = await this.pongService.updateGame(data);
		socket.emit('GameUpdated', ret);
		// this.x += this.vector.x * this.velocity * data.delta;
		// this.y += this.vector.y * this.velocity * data.delta;
		// // console.log('x =', this.x);
		// // console.log('y =', this.y);
		// this.velocity += 0.00001 * data.delta;
		// const rect = this.rect();

		// if(rect.top <= data.limit.top || rect.bottom >= data.limit.bottom) {
		// 	this.vector.y *= -1;
		// }
		// if (this.pongService.isCollision(rect, data.playerPaddleLeft.rect) 
		// 	|| this.pongService.isCollision(rect, data.playerPaddleRight.rect))
		// {
		// 	this.vector.x *= -1;
		// }    
		// this.pongService.sideColision(rect, data.limit);

	}



}
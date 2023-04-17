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

	waiter: number;

	constructor(private pongService: PongService){
		console.log("PongGateway");
		this.waiter = 0;
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
			console.log('game stopped');
			await this.pongService.reset();
			await this.pongService.resetScore();
			socket.emit('GameUpdated', ret);
			
			this.myserver.to(data.gameName).emit('GameFinished', ret);
			await this.pongService.PauseGame();
			// socket.emit('GameFinished', ret);
		} else {
			// this.myserver.to(data.gameName).emit('GameUpdated', ret);
			socket.join(data.gameName);
			socket.emit('GameUpdated', ret);
		}
	}

	@SubscribeMessage('playGame')
	async playGame(@MessageBody() data: any, @ConnectedSocket() socket: Socket): Promise<void> {
		console.log("playGame");

		//TODO: comment ou quoi faire lorsqu'un joueur accepte ou non de jouer
		//TODO: vraiment changer ce systeme lorsquon aurra les queues
		if (this.waiter == 1) // ici on mets 1 car le deuxieme joueur est le second waiter
		{
			console.log("2 waiters are ready");
			this.waiter = 0;
			await this.pongService.playGame();
		}	else
		{
			console.log("1 waiter is ready");
			this.waiter++;
		}
		//TODO: faire le systeme de queue, ou l'on passe au jour suivant si il y a un joueur qui veut jouer
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
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

import { Controller, Get, Injectable, Post, Res, UseGuards } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { PongService } from '../pong.service';
import { InfoPongRoom, MovePaddle } from '../pong.interface';
import { Response} from 'express';
import { Game, InvitationPong } from '@prisma/client';
import { exit } from 'process';
import { HistoryService } from 'app/src/history/services';

// @Injectable()
@WebSocketGateway(3001, {
	cors: {
		origin: "http://localhost:3001/",
		credentials: true,
		methods: ['GET', 'POST'],
	}
})
export class PongGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	
		@WebSocketServer() // Create a instance of the server
		myserver: Server;
	// waiter: number;

	constructor(private pongService: PongService, private historyService: HistoryService){
		// console.log("PongGateway");
		// this.waiter = 0;
	}
	
	afterInit(server: Server) {
		// console.log('Initialized!');
	}

	handleConnection(client: Socket, ...args: any[]) {
		// console.log('connected');
		client.emit('connected');
		client.join('all');
	}

	handleDisconnect(client: Socket) {
		// console.log('disconnect');
		// console.log('DISCONNECTED : socket = ', client.data);
		client.disconnect();
	}

	// @Post('InitGame')
	// @SubscribeMessage('beginGame')
	// async initGame(/* @Res() response: Response , */ @MessageBody() info: any, @ConnectedSocket() socket: Socket): Promise<void> {
	// }

	// @SubscribeMessage('defineBall')
	// async defineBall(@MessageBody() data: any, @ConnectedSocket() socket: Socket): Promise<void> {
	// 	// console.log("defineBall");
	// }

	// @SubscribeMessage('defineLimit')
	// async defineLimit(@MessageBody() data: any, @ConnectedSocket() socket: Socket): Promise<void> {
	// 	// console.log("defineLimit", );
	// }

	// @SubscribeMessage('resetGame')
	// async resetGame(@MessageBody() data: any, @ConnectedSocket() socket: Socket): Promise<void> {
	// 	// console.log("resetGame");
	// 	const all = await this.pongService.getGame(data.gameName);

	// 	socket.emit('resetGame', {x: all.x, y: all.y, vector: all.vector, velocity: all.velocity});
	// }

	@SubscribeMessage('updateGame')
	async updateGame(@MessageBody() data: {delta: number, gameName: string, isMaster: boolean}, @ConnectedSocket() socket: Socket): Promise<void> {
		let ret = await this.pongService.updateGame(data);
		// if (data.isMaster && ret && (ret.leftScore >= 11 || ret.rightScore >= 11)) {
		if (data.isMaster && ret && (ret.leftScore >= 1 || ret.rightScore >= 1)) {
			//TODO: need to change to emit to all in a room, how to get game name ??
			const game = await this.pongService.getGame(data.gameName);
			await this.historyService.addGame(await this.pongService.formatGameForAddGame(game));
			await this.pongService.reset(game);
			await this.pongService.resetScore(data.gameName);
			this.myserver.to(data.gameName).emit('GameUpdated', ret);
			this.myserver.to(data.gameName).emit('GameFinished', ret);
			await this.pongService.PauseGame(data.gameName);
			console.log("GameFinished : waitinglist = ", PongService.waitingList);
		} else {
			socket.join(data.gameName);
			if (data.isMaster)
				this.myserver.to(data.gameName).emit('GameUpdated', ret);
		}
	}


	@SubscribeMessage('playGame')
	async playGame(@MessageBody() data: {gameName: string}, @ConnectedSocket() socket: Socket): Promise<void> {
		// console.log("playGame");
		await this.pongService.playGame(data.gameName);
	}


	// @SubscribeMessage('playGame')
	// async playGame(@MessageBody() data: any, @ConnectedSocket() socket: Socket): Promise<void> {
	// 	console.log("playGame");

	// 	//TODO: comment ou quoi faire lorsqu'un joueur accepte ou non de jouer
	// 	//TODO: vraiment changer ce systeme lorsquon aurra les queues
	// 	if (this.waiter == 1) // ici on mets 1 car le deuxieme joueur est le second waiter
	// 	{
	// 		console.log("2 waiters are ready");
	// 		this.waiter = 0;
	// 		await this.pongService.playGame(data.gameName);
	// 	}	else
	// 	{
	// 		console.log("1 waiter is ready");
	// 		this.waiter++;
	// 	}
	// 	//TODO: faire le systeme de queue, ou l'on passe au jour suivant si il y a un joueur qui veut jouer
	// }
	
	@SubscribeMessage('updatePaddleLeft')
	async updatePaddleLeft(@MessageBody() data: MovePaddle, @ConnectedSocket() socket: Socket): Promise<void> {
		// console.log("updatePaddleLeft")
		if (await this.pongService.isGamePaused(data.gameName))
			await this.pongService.movePaddeLeft(data.paddle, data.gameName);
	}

	@SubscribeMessage('updatePaddleRight')
	async updatePaddleRight(@MessageBody() data: MovePaddle, @ConnectedSocket() socket: Socket): Promise<void> {
		// console.log("updatePaddleRight");
		if (await this.pongService.isGamePaused(data.gameName))
			await this.pongService.movePaddeRight(data.paddle, data.gameName);
	}


	// @SubscribeMessage('leaveGame')
	// async leaveGame(@MessageBody() data: {gameName: string}, @ConnectedSocket() socket: Socket): Promise<void> {
	// 	await socket.leave(data.gameName);
	// }

	@SubscribeMessage('allLeaveGame')
	async allLeaveGame(@MessageBody() data: {gameName: string}, @ConnectedSocket() socket: Socket): Promise<void> {
		if (!data || data.gameName === undefined || data.gameName === null)
			return ;
		this.myserver.socketsLeave(data.gameName);
	}

	@SubscribeMessage('changeGame')
	async changeGame(@MessageBody() data: string, @ConnectedSocket() socket: Socket): Promise<void> {
		console.log("changeGame data = ", data)
		await socket.join(data);
	}

	@SubscribeMessage('navigate_to_game')
	async navigate_to_game(@MessageBody() data: string, @ConnectedSocket() socket: Socket): Promise<void> {
		console.log("navigate_to_game data = ", data);
		this.myserver.to(data).emit('navigate_to_game', data);
	}

	@SubscribeMessage('joinWaitingRoom')
	async createWaitingRoom(@MessageBody() data: string | null, @ConnectedSocket() socket: Socket): Promise<void> {
		console.log("joinWaitingRoom");
		await socket.join("waitingRoom");
		if ((await this.myserver.in("waitingRoom").fetchSockets()).length == 2) {
			console.log("2 players in waiting room")
			await this.pongService.createGame(PongService.waitingList[0] , PongService.waitingList[1]);
			this.myserver.to("waitingRoom").emit('startGame', {is_match: data});
			this.myserver.socketsLeave("waitingRoom");
		}
	}

	// @SubscribeMessage('disconnectWaitingRoom')
	// async disconnectWaitingRoom(@MessageBody() data: any, @ConnectedSocket() socket: Socket): Promise<void> {
	// 	// console.log("disconnectWaitingRoom");
	// 	this.myserver.socketsLeave("waitingRoom");
	// }


	@SubscribeMessage('pauseGame')
	async pauseGame(@MessageBody() data: string, @ConnectedSocket() socket: Socket): Promise<void> {
		await this.pongService.PauseGame(data);
	}

	@SubscribeMessage('resumeGame')
	async resumeGame(@MessageBody() data: string, @ConnectedSocket() socket: Socket): Promise<void> {
		await this.pongService.resumeGame(data);
	}

	@SubscribeMessage('refusePlay')
	async refusePlay(@MessageBody() data: InvitationPong, @ConnectedSocket() socket: Socket): Promise<void> {
		this.myserver.to(data.game_name).emit('refusedToPlay', data);
		await this.pongService.deleteGame(data.game_name);
		await this.pongService.deleteGameInAllRooms(data.game_name);
	}

}
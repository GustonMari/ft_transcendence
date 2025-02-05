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
		origin: `http://${process.env.LOCAL_IP}:3001/`,
		credentials: true,
		methods: ['GET', 'POST'],
	}
})
export class PongGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	
		@WebSocketServer() // Create a instance of the server
		myserver: Server;

	constructor(private pongService: PongService, private historyService: HistoryService){
	}
	
	afterInit(server: Server) {
	}

	handleConnection(client: Socket, ...args: any[]) {
		client.emit('connected');
		client.join('all');
	}

	handleDisconnect(client: Socket) {
		const rooms = Object.keys(client.rooms);

		// Remove the client from all rooms it has joined
		rooms.forEach(room => {
		if (room !== client.id) {
			client.leave(room);
		}
		});
		client.disconnect();
	}

	@SubscribeMessage('updateGame')
	async updateGame(@MessageBody() data: {delta: number, gameName: string, isMaster: boolean}, @ConnectedSocket() socket: Socket): Promise<void> {
		let ret = await this.pongService.updateGame(data);
		if (data.isMaster && ret && (ret.leftScore >= 1 || ret.rightScore >= 1)) {
			//TODO: need to change to emit to all in a room, how to get game name ??
			const game = await this.pongService.getGame(data.gameName);
			await this.historyService.addGame(await this.pongService.formatGameForAddGame(game));
			await this.pongService.reset(game);
			await this.pongService.resetScore(data.gameName);
			this.myserver.to(data.gameName).emit('GameUpdated', ret);
			this.myserver.to(data.gameName).emit('GameFinished', ret);
			await this.pongService.PauseGame(data.gameName);
		} else {
			socket.join(data.gameName);
			if (data.isMaster)
				this.myserver.to(data.gameName).emit('GameUpdated', ret);
		}
	}


	@SubscribeMessage('playGame')
	async playGame(@MessageBody() data: any, @ConnectedSocket() socket: Socket): Promise<void> {
		await this.pongService.playGame(data.gameName);
	}
	
	@SubscribeMessage('updatePaddleLeft')
	async updatePaddleLeft(@MessageBody() data: MovePaddle, @ConnectedSocket() socket: Socket): Promise<void> {
		if (await this.pongService.isGamePaused(data.gameName))
			await this.pongService.movePaddeLeft(data.paddle, data.gameName);
	}

	@SubscribeMessage('updatePaddleRight')
	async updatePaddleRight(@MessageBody() data: MovePaddle, @ConnectedSocket() socket: Socket): Promise<void> {
		if (await this.pongService.isGamePaused(data.gameName))
			await this.pongService.movePaddeRight(data.paddle, data.gameName);
	}

	@SubscribeMessage('allLeaveGame')
	async allLeaveGame(@MessageBody() data: {gameName: string}, @ConnectedSocket() socket: Socket): Promise<void> {
		if (!data || data.gameName === undefined || data.gameName === null)
			return ;
		this.myserver.socketsLeave(data.gameName);
	}

	@SubscribeMessage('changeGame')
	async changeGame(@MessageBody() data: string, @ConnectedSocket() socket: Socket): Promise<void> {
		await socket.join(data);
	}

	@SubscribeMessage('navigate_to_game')
	async navigate_to_game(@MessageBody() data: string, @ConnectedSocket() socket: Socket): Promise<void> {
		this.myserver.to(data).emit('navigate_to_game', data);
		this.myserver.in(data).disconnectSockets(true);
	}

	@SubscribeMessage('joinWaitingRoom')
	async createWaitingRoom(@MessageBody() data: any, @ConnectedSocket() socket: Socket): Promise<void> {
		await socket.join("waitingRoom");
		if ((await this.myserver.in("waitingRoom").fetchSockets()).length == 2) {
			await this.pongService.createGame(PongService.waitingList[0] , PongService.waitingList[1]);
			this.myserver.to("waitingRoom").emit('startGame', {is_match: data});
			this.myserver.socketsLeave("waitingRoom");
		}
	}

	@SubscribeMessage('leaveWaitingRoom')
	async leaveWaitingRoom(@MessageBody() data: any, @ConnectedSocket() socket: Socket): Promise<void> {
		this.myserver.socketsLeave("waitingRoom");
	}

	@SubscribeMessage('disconnectWaitingRoom')
	async disconnectWaitingRoom(@MessageBody() data: any, @ConnectedSocket() socket: Socket): Promise<void> {
		this.myserver.socketsLeave("waitingRoom");
	}
	@SubscribeMessage('joinWaitingReplay')
	async joinWaitingReplay(@MessageBody() data: string, @ConnectedSocket() socket: Socket): Promise<void> {
		const room_name = "waitingReplay_" + data;
		await socket.join(room_name);
	}

	@SubscribeMessage('leaveWaitingReplay')
	async leaveWaitingReplay(@MessageBody() data: string, @ConnectedSocket() socket: Socket): Promise<void> {
		const room_name = "waitingReplay_" + data;
		this.myserver.socketsLeave(room_name);
	}



	@SubscribeMessage('pauseGame')
	async pauseGame(@MessageBody() data: any, @ConnectedSocket() socket: Socket): Promise<void> {
		const room_name = "waitingReplay_" + data;
		if ((await this.myserver.in(room_name).fetchSockets()).length >= 2)
			await this.pongService.PauseGame(data);
	}

	@SubscribeMessage('resumeGame')
	async resumeGame(@MessageBody() data: any, @ConnectedSocket() socket: Socket): Promise<void> {
		const room_name = "waitingReplay_" + data;
		if ((await this.myserver.in(room_name).fetchSockets()).length >= 2)
			await this.pongService.resumeGame(data);
	}

	@SubscribeMessage('refusePlay')
	async refusePlay(@MessageBody() data: InvitationPong, @ConnectedSocket() socket: Socket): Promise<void> {
		this.myserver.to(data.game_name).emit('refusedToPlay', data);
		await this.pongService.deleteGame(data.game_name);
		await this.pongService.deleteGameInAllRooms(data.game_name);
	}

}
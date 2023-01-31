/* eslint-disable prettier/prettier */
// import { SubscribeMessage,
// 	WebSocketGateway,
// 	MessageBody,
// 	WebSocketServer
// } from '@nestjs/websockets';

// @WebSocketGateway(3001, {cors: {
// 	origin: "*",
// 	// credentials: true,
// 	// methods: ['GET'],

//   }})
// export class ChatGateway {
// 	@WebSocketServer() // Create a instance of the server
// 	server;
//   @SubscribeMessage('message') // Subscribe to the message event send by the client (front end) called 'message'
//   handleMessage(@MessageBody() message: string): void {
// 	console.log(message);
//     this.server.emit('message', message); // Emit the message event to the client
//   }
// }

import { SubscribeMessage,
	WebSocketGateway,
	MessageBody,
	WebSocketServer,
	OnGatewayInit,
	OnGatewayConnection,
	OnGatewayDisconnect
} from '@nestjs/websockets';

import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
	cors: {
		origin: "http://localhost:3000/",
		// origin: '*',
		credentials: true,
		methods: ['GET', 'POST'],
		
	}
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() // Create a instance of the server
	myserver: Server;

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

	@SubscribeMessage('message') // Subscribe to the message event send by the client (front end) called 'message'
	handleMessage(@MessageBody() message: string): void {
		// console.log('C est le message : ', message);
		message = message + ' parasite';
		this.myserver.emit('message', message); // Emit the message event to the client, for every user
		// this.myserver.on('message', (message) => {
		// 	message.broadcast.emit('message', message);
	}


}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'app/src/prisma/prisma.service';
import { User, Room } from '@prisma/client';

@Injectable()
export class ChatService {

	constructor(private readonly prisma: PrismaService) { }

	async createChatRoom(room_name: string, user_id: number )/*  : Promise<Room> */
	{
		const current_user = await this.prisma.user.findUnique({ where: { id: user_id } });
		if (!current_user) {
			throw new Error('User not found');
		}

	
		await this.prisma.usersOnRooms.create({
			data: {
				room: {
					create: {
						name: room_name,
					}
				},
				user: {
					connect: {
						id: current_user.id,
					}
				}
			}
		});
	}

	// async joinChatRoom(room_name: string, user_id: number )/*  : Promise<Room> */
	// {
	// 	const current_user = await this.prisma.user.findUnique({ where: { id: user_id } });
	// 	if (!current_user) {
	// 		throw new Error('User not found');
	// 	}
	// 	const current_room = await this.prisma.room.findUnique({ where: { name: room_name } });
	// 	if (!current_room) {
	// 		throw new Error('Room not found');
	// 	}
	// 	await this.prisma
	
		
	// }
}

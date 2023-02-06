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

	async joinChatRoom(room_name: string, user_id: number )/*  : Promise<Room> */
	{
		//TODO: change with findOne
		const current_user = await this.prisma.user.findUnique({ where: { id: user_id } });
		if (!current_user) {
			throw new Error('User not found');
		}

		//on cherche si la room existe deja sinon on la creer
		const room_exist = await this.prisma.room.findUnique({ where: { name: room_name } });
		if (!room_exist) {
			//! or maybe trhow something
			this.createChatRoom(room_name, user_id);
		}
		else {

			console.log("room exist----------------->");
			const user_in_room = await this.prisma.usersOnRooms.findFirst({
				where: {
					user_id: user_id,
					room_id: room_exist.id,
				}
			});

			if (!user_in_room) {
				console.log("user in room dont exist-----------------> CREATE IT");
				await this.prisma.usersOnRooms.create({
					data: {
						user: { connect: { id: user_id } },
						room: { connect: { id: room_exist.id } }
					}
				});
			}
		}
	}


	async leaveRoom(room_name: string, user_id: number) {
		
		const room_exist = await this.prisma.room.findUnique({ 
			where: { 
				name: room_name,
		
		} });
		if (!room_exist) {
			return ;
		}

		const user_in_room = await this.prisma.usersOnRooms.findFirst({
			where: {
				user_id: user_id,
				room_id: room_exist.id,
			}
		});

		if (user_in_room) {
			await this.prisma.usersOnRooms.delete({
			  where: {
				user_id_room_id:
				{
					user_id: user_id,
					room_id: room_exist.id,
				}
			  }
			});
		}

	}

	async roomExists(room_name: string): Promise<boolean> {
		const room_exist = await this.prisma.room.findUnique({ where: { name: room_name } });
		if (!room_exist) {
			return false;
		}
		return true;
	}


	async deleteRoom(room_name: string, user_id: number): Promise<boolean> {
		const room_exist = await this.prisma.room.findUnique({ where: { name: room_name } });
		if (!room_exist) {
			return false;
		}
		await this.prisma.usersOnRooms.deleteMany({
			where: {
				room_id: room_exist.id,
			},
		})
		await this.prisma.room.delete({ where: { name: room_name } });
		return true;
	}

	async setAdmin(room_name: string, user_id: number): Promise<boolean> {
		const room_exist = await this.prisma.room.findUnique({ where: { name: room_name } });
		if (!room_exist) {
			return false;
		}
		console.log("On SET ADMIN")
		await this.prisma.usersOnRooms.update({
			where: {
				user_id_room_id: {
					user_id: user_id,
					room_id: room_exist.id,
				}
			},
			data: {
				admin: true,
			}
		})


	}
}

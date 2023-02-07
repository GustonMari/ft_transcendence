/* eslint-disable prettier/prettier */
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

			const user_in_room = await this.prisma.usersOnRooms.findFirst({
				where: {
					user_id: user_id,
					room_id: room_exist.id,
				}
			});

			if (!user_in_room) {
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

	async isAdmin(room_name: string, user_id: number): Promise<boolean> {
		const room_exist = await this.prisma.room.findUnique({ where: { name: room_name } });
		if (!room_exist) {
			return false;
		}
		const user_in_room = await this.prisma.usersOnRooms.findFirst({
			where: {
				user_id: user_id,
				room_id: room_exist.id,
			}
		});
		if (!user_in_room) {
			return false;
		}
		return user_in_room.admin;
	}

	// async getIdUser(user_login: string): Promise<number> {
	// 	const user = await this.prisma.user.findUnique({ where: { login: user_login } });
	// 	if (!user) {
	// 		return -1;
	// 	}
	// 	return user.id;
	// }

	async getIdUser(user_login: string): Promise<number> {
		const user = await this.prisma.user.findUnique({ where: { login: user_login } });
		// const user = await this.prisma.user.findUnique({ where: { id: 1}});
		if (!user) {
		  return -1;
		}
		return user.id;
	  }

	async banUser(room_name: string, user_id: number, user_to_ban: number, ban_date: Date): Promise<boolean> {
		const room_exist = await this.prisma.room.findUnique({ where: { name: room_name } });
		if (!room_exist) {
			return false;
		}
		await this.prisma.usersOnRooms.update({
			where: {
				user_id_room_id: {
					user_id: user_to_ban,
					room_id: room_exist.id,
				}
			},
			data: {
				banned: true,
				banned_till: ban_date,
			}
		})
	}

	async unbanUser(room_name: string, user_id: number, user_to_ban: number): Promise<boolean> {
		const room_exist = await this.prisma.room.findUnique({ where: { name: room_name } });
		if (!room_exist) {
			return false;
		}
		await this.prisma.usersOnRooms.update({
			where: {
				user_id_room_id: {
					user_id: user_to_ban,
					room_id: room_exist.id,
				}
			},
			data: {
				banned: false,
			}
		})
		return true;
	}

	async muteUser(room_name: string, user_id: number, user_to_mute: number, mute_date): Promise<boolean> {
		const room_exist = await this.prisma.room.findUnique({ where: { name: room_name } });
		if (!room_exist) {
			return false;
		}
		await this.prisma.usersOnRooms.update({
			where: {
				user_id_room_id: {
					user_id: user_to_mute,
					room_id: room_exist.id,
				}
			},
			data: {
				muted: true,
				muted_till: mute_date,
			}
		})
		return true;
	}

	async blockUser(user_id: number, user_to_block: number): Promise<boolean> {

		// const user_me = await this.prisma.user.findFirst({
		// 		where: {
		// 			id: user_id,
		// 		},
		// })
		

		await this.prisma.user.update({
			where: {
				id: user_id,
			},
			data: {
				blocks: {
					create: {
						userPtain: user_to_block,
						// userId: 100000,
						blocked: true,
					}
				}
			}
		})

		// await this.prisma.user_Block.update({ 
		// 	where: {
		// 		id: user_id,
		// 	},
		// 	data: {
		// 		blocked: true,
		// 		userId: user_to_block,
		// 	}
		// })

		return true;
	}

	// async unblockUser(user_id: number, user_to_unblock: number): Promise<boolean> {
	// 	await this.prisma.user.update({
	// 		where: {
	// 			id: user_id,
	// 		},
	// 		data: {
	// 			blocks: {
	// 				update: {
	// 					where: {
	// 						userId: user_to_unblock,
	// 					},
	// 					data: {
	// 						blocked: false,
	// 					},
	// 				}
	// 			}
	// 		}
	// 	})
	// 	return true;
	// }
}

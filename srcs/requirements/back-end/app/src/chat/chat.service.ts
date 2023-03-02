/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'app/src/prisma/prisma.service';
import { User, Room, Message } from '@prisma/client';
import { InfoMessage } from './gateways/chat.interface';
import * as argon from 'argon2';

@Injectable()
export class ChatService {

	constructor(private readonly prisma: PrismaService) { }

	// async createChatRoom(room_name: string, user_id: number) {
	// 	const current_user = await this.prisma.user.findUnique({ where: { id: user_id } });
	// 	if (!current_user) {
	// 	  throw new Error('User not found');
	// 	}
	  
	// 	try {
	// 	  await this.prisma.room.create({
	// 		data: {
	// 		  name: room_name,
	// 		  owner: current_user.login,
	// 		  owner_id: current_user.id,
	// 		},
	// 	  });
	  
	// 	  await this.prisma.usersOnRooms.create({
	// 		data: {
	// 		  room: {
	// 			connect: { name: room_name },
	// 		  },
	// 		  user: {
	// 			connect: { id: current_user.id },
	// 		  },
	// 		},
	// 	  });
	  
	// 	  console.log(`Created room with name ${room_name}`);
	// 	} catch (err) {
	// 	  if (err.code === 'P2002') {
	// 		console.log('Error: Name already exists');
	// 	  } else {
	// 		console.error(err);
	// 	  }
	// 	}
	//   }

	async createChatRoom(room_name: string, user_id: number )
	{
		const current_user = await this.prisma.user.findUnique({ where: { id: user_id } });
		if (!current_user) {
			throw new Error('User not found');
		}

		const room_exist = await this.prisma.room.findUnique({ where: { name: room_name } });
		console.log('room_name', room_name, " | room_exist", room_exist)
		if (room_exist) {
			console.log('room already exist broooooooooooooooo')
			return ;
		}
		else {
			try {
				await this.prisma.usersOnRooms.create({
					data: {
						room: {
							create: {
								name: room_name,
								owner: current_user.login,
								owner_id: current_user.id,
							}
						},
						user: {
							connect: {
								id: current_user.id,
							}
						}
					}
				});
			} catch (err) {
			if (err.code === 'P2002') {
				console.error('Error: Name already exists');
			}
			else {
				console.error(err);
			  }
		}}
	}

	async addSocketToUser(user_id: number, socket_id: string) {
		await this.prisma.user.update({
		  where: { id: user_id 
			
		},
		  data: {
			socket_id: socket_id,
		  },
		});
	}

	async getUserSocketId(login: string): Promise<string> {
		const user = await this.prisma.user.findUnique({
			where: {
				login: login,
			}
		});
		return user.socket_id;
	}

	async joinChatRoom(room_name: string, user_id: number )
	{
		//TODO: change with findOne
		console.log("--------- room name = ", room_name, " | user_id = ", user_id, "---------")
		const current_user = await this.prisma.user.findUnique({ where: { id: user_id } });
		if (!current_user) {
			throw new Error('User not found');
		}

		//on cherche si la room existe deja sinon on la creer
		const room_exist = await this.prisma.room.findUnique({ where: { name: room_name} });
		console.log("room_existssss = ", room_exist)
		if (!room_exist) {
			//! or maybe trhow something
			console.log("on est dans joinChatRoom la room nexiste pas on createChatRoom(", room_name, ", ", user_id);

			await this.createChatRoom(room_name, user_id);
		}
		else {
			console.log("On update la room dans joinChatRoom --> user = ", current_user.login, " | room = ", room_name)
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

	async updateChatRoom(room_name: string, user_id: number )
	{
		//TODO: change with findOne
		const current_user = await this.prisma.user.findUnique({ where: { id: user_id } });
		if (!current_user) {
			throw new Error('User not found');
		}

		//on cherche si la room existe deja sinon on la creer
		const room_exist = await this.prisma.room.findUnique({ where: { name: room_name } });
		if (!room_exist) {

		}
		else {
			console.log("On update la room dans joinChatRoom --> user = ", current_user.login, " | room = ", room_name)
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

	async isUserExists(user_login: string): Promise<boolean> {
		const user_exist = await this.prisma.user.findUnique({ where: { login: user_login } });
		if (!user_exist) {
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
		await this.prisma.room.delete({
			where: { name: room_name },
			include: {
			  messages: {
	
			  }
			}
		  });
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

	async isUserBannedInRoom(room_name: string, user_id: number): Promise<boolean> {
		const room_exist = await this.prisma.room.findUnique({ where: { name: room_name } });
		if (!room_exist) {
			return false;
		}
		const is_ban = await this.prisma.usersOnRooms.findFirst({
			where: {
				room_id: room_exist.id,
				user_id: user_id,
			}});
		return (is_ban.banned);
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

	async isUserMutedInRoom(room_name: string, user_id: number): Promise<boolean> {
		const room_exist = await this.prisma.room.findUnique({ where: { name: room_name } });
		if (!room_exist) {
			return false;
		}
		const is_mute = await this.prisma.usersOnRooms.findFirst({
			where: {
				room_id: room_exist.id,
				user_id: user_id,
			}});
		return (!is_mute.muted);
	}

	async getUserRooms (user_id: number): Promise<Room[]> {
		const rooms = await this.prisma.usersOnRooms.findMany({
			where: {
				user_id: user_id,
			},
			include: {
				room: true,
			}
		})
		return rooms.map(room => room.room);
	}

	async getRoomIdByName (room_name: string): Promise<number> {
		const room = await this.prisma.room.findFirst({ where: { name: room_name } });
		if (!room) {
			return -1;
		}
		return room.id;
	}

	async stockMessage (infoMessage : InfoMessage): Promise<boolean> {
		const room_id = await this.getRoomIdByName(infoMessage.room);
		if (room_id == -1) {
			return false;
		}

		await this.prisma.usersOnRooms.update({
			where: {
				user_id_room_id: {
					user_id: infoMessage.current_user.id,
					room_id: room_id,
				},
			},
			data: {
				room: {
					update: {
						messages: {
							create: {
								sender_id: infoMessage.current_user.id,
								current_message: infoMessage.message,
								sender_name: infoMessage.current_user.login,
							},
						}
				}
			}
			}

		})
		return true;
	}

	// async getMessagesByRoom (room_name : string): Promise<Message[]> {
	// 	const room_id = await this.getRoomIdByName(room_name);
	// 	if (room_id == -1) {
	// 		return null;
	// 	}
	// 	const messages = await this.prisma.room.findUnique({
	// 		where: {
	// 			id: room_id,
	// 		},
	// 		select: {
	// 			messages: true,
	// 		}
	// 	})
	// 	return messages.messages;
	// }

	async getMessagesByRoom (room_name : string): Promise<Message[]> {
        const room_id = await this.getRoomIdByName(room_name);
        if (room_id == -1) {
            return null;
        }
        const messages = await this.prisma.room.findUnique({
            where: {
                id: room_id,
            },
            include: {
                messages: {
                    include: {
                        sender: true,
                    }
                }
            }
        })
        return messages.messages;
    }

	async IsOwnerOfRoomByLogin (room_name: string, user_login: string): Promise<boolean> {
	
		const room = await this.prisma.room.findUnique({
			where: {
				name: room_name,
			}
		});
		if (room.owner != null && user_login === room.owner) {
			return true;
		}
		return false;
	}

	async IsOwnerOfRoomById (room_name: string, user_id: number): Promise<boolean> {
		const room = await this.prisma.room.findUnique({
			where: {
				name: room_name,
			}
		});
		if (user_id === room.owner_id) {
			return true;
		}
		return false;
	}

	async setRoomPassword (room_name: string, user_id: number, password: string): Promise<boolean> {

		if (await this.IsOwnerOfRoomById(room_name, user_id)) {
			const room = await this.prisma.room.update({
				where: {
					name: room_name,
				},
				data: {
					password: await argon.hash(password),
				}
			})
			return true;
		}
		return false;
	}

	async verifyRoomPassword (room_name: string, password: string): Promise<boolean> {
		const room = await this.prisma.room.findUnique({
			where: {
				name: room_name,
			},
		})

		if (await argon.verify(room.password, password)) {
			return true;
		}
		return false;
	}

	async isRoomHasPassword (room_name: string): Promise<boolean> {
		const room = await this.prisma.room.findUnique({
			where: {
				name: room_name,
			},
		})
		if (room && room.password) {
			return true;
		}
		return false;
	}
}

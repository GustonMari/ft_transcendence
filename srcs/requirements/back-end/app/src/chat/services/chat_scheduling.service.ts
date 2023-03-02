import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression,  } from '@nestjs/schedule';
import { PrismaService } from 'app/src/prisma/prisma.service';

@Injectable()
export class ChatSchedulingService {
	constructor(private readonly prisma: PrismaService) { }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
	const muted_users = await this.prisma.usersOnRooms.findMany({
		where: {
			OR: [
			{muted: true,},
			{banned: true,}
			]
		}
	});
	muted_users.forEach(async (user) => {
		if (user.muted == true && user.muted_till < new Date()) {
			await this.prisma.usersOnRooms.update({
				where: {
					user_id_room_id: {
						user_id: user.user_id,
						room_id: user.room_id,
					}
				},
				data: {
					muted: false,
				}
			});
		
		};
		if (user.banned == true && user.banned_till < new Date()) {
			await this.prisma.usersOnRooms.update({
				where: {
					user_id_room_id: {
						user_id: user.user_id,
						room_id: user.room_id,
					}
				},
				data: {
					banned: false,
				}
			});
		};
	});
	}
}

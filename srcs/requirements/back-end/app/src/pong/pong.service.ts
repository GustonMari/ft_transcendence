import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PongService {

	constructor(private readonly prisma: PrismaService) { }


	async createGame(master: User, slave: User): Promise<boolean> {

		let game_name = "";
		console.log('\x1b[36m%s', "slave = ", slave, "master = ", master, '\x1b[0m');
		if (!slave || !master)
			return (false);
		if (slave.login.localeCompare(master.login) < 0)
			game_name = slave.login + "-" + master.login;
		else
			game_name = master.login + "-" + slave.login;
		console.log("BLALBA game_name = ", game_name);
		const game_exist = await this.prisma.game.findUnique({
			where: {
				name: game_name,
			}
		});
		if (game_exist)
			return (false);
		const game = await this.prisma.game.create({
			data: {
				name: game_name,	
				master_id: master.id,
				slave_id: slave.id,
			}
		});
		await this.prisma.userInGame.create({
			data: {
				user_id: master.id,
				game_id: game.id,
				role: "MASTER",
			}
		});
		await this.prisma.userInGame.create({
			data: {
				user_id: slave.id,
				game_id: game.id,
				role: "SLAVE",
			}
		});
		return (true);
	}

	async isUserMaster(login: string): Promise<boolean> {
		if (!login)
			return (false);
		const user = await this.prisma.user.findUnique({
			where: {
				login: login,
			}
		});
		if (user == null)
			return (false);
		const game = await this.prisma.game.findFirst({
			where: {
				master_id: user.id,
				UserInGame: {
					some: {
						role: "MASTER",
					}
				},
			}
		});
		if (game == null)
			return (false);
		return (true);
	}
}

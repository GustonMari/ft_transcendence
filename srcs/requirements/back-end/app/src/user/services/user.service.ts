import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import {
    CreateUserOptions,
    FindUserOptions,
    UpdateUserOptions
} from 'app/src/auth/interfaces';
import { PrismaService } from 'app/src/prisma/prisma.service';
import { AddGameDTO } from 'app/src/history/dtos';

const DRAW_XP = 10;
const WIN_XP = 20;
const LOSE_XP = 5;

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async updateUser(
        opt: FindUserOptions,
        data: UpdateUserOptions,
    ) {
        await this.prisma.user.update({
            where: {
                login: opt.login,
                email: opt.email,
                id: opt.id
            },
            data: {
                avatar_url: data.avatar_url,
                password: data.password,
                rt: data.rt,
                first_name: data.first_name,
                last_name: data.last_name,
                description: data.description,
                tfa: data.tfa,
                tfa_secret: data.tfa_secret,
                login: data.login,
            },
        });
    }

    async createUser(
        opt: CreateUserOptions
    ): Promise<User> {
        const user = await this.prisma.user.create({
            data: {
                login: opt.login,
                email: opt.email,
                password: opt.password,
            },
        });
        return user;
    }


    async findUniqueUser(
        opt: FindUserOptions
    ): Promise<User | undefined> {
        if (opt.login || opt.email || opt.id) {
            const found = await this.prisma.user.findUnique({
                where: {
                    login: opt.login,
                    email: opt.email,
                    id: opt.id
                },
            });
            return (found ? found : undefined);
        }
        return (undefined);
    }


    async getUserWithId(
        id: number
    ): Promise<User> {

        const u: User = await this.findUniqueUser({
            id: id,
        });
        if (!u) { throw new NotFoundException('user not found'); }
        return (u);
    }

    async getUserWithUsername(
        login: string
    ): Promise<User> {
        const u: User = await this.findUniqueUser({
            login: login,
        });
        if (!u) { throw new NotFoundException('user not found'); }
        return (u);
    }

    async setUserOnline(
        id: number,
        online: boolean
    ) {
        try {
            await this.prisma.user.update({
                where: {
                    id: id
                },
                data: {
                    state: online
                }
        });
        } catch (err) {
            throw new NotFoundException('user not found');
        }
    }


    async doesUserExist(
        login: string,
        mail?: string
    ): Promise<User | undefined> {
        const found = await this.prisma.user.findFirst({
            where: {
                OR: [
                    {
                        login: login,
                    },
                    {
                        email: mail,
                    }
                ]
            },
        });
        if (found) { return (found);}
        return (undefined);
    }

    async findMatchingUsers(
        login: string,
        id: number
    ) : Promise<User[] | undefined> {
        const found = await this.prisma.user.findMany({
            where: {
                login:{ contains: login },
                id: {not: id},
                outgoing : {
                    none: {
                        state: "BLOCKED",
                    }
                },
                incoming : {
                    none: {
                        state: "BLOCKED",
                    }
                },
            },
        });
        if (found) { return (found);}
        return (undefined);
    }

    async winGame (
        dto: AddGameDTO,
    ) {
        if (dto.user_1_score === dto.user_2_score) {
            await this.addXP(dto.user_1_id, DRAW_XP);
            await this.addXP(dto.user_2_id, DRAW_XP);
        } else {
            await this.addXP((dto.user_1_score < dto.user_2_score ? dto.user_1_id : dto.user_2_id), LOSE_XP);
            await this.addXP((dto.user_1_score > dto.user_2_score ? dto.user_1_id : dto.user_2_id), WIN_XP);
        }
    }

    async addXP (
        id: number,
        xp: number,
    ) {
        const u: User = await this.getUserWithId(id);
        if (!u) {
            throw new NotFoundException('user not found');
        }
        const newXp = u.xp + xp; 
        const level = (Math.log10(newXp / 10) * 2) + 1; 
        await this.prisma.user.update({
            where: {
                id: id
            },
            data: {
                xp: newXp,
                level: level,
                wins: (xp === WIN_XP ? u.wins + 1 : u.wins),
                loses: (xp === LOSE_XP ? u.loses + 1 : u.loses),
            }
        });
    }
}

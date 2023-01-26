import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import {
    CreateUserOptions,
    FindUserOptions,
    UpdateUserOptions
} from 'app/src/auth/interfaces';
import { PrismaService } from 'app/src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService
    ) { }

    
    /*

        TODO: things to do here ->
        - rework all function with interfaces

    */


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
        if (found) {
            return (found);
        }
        return (undefined);
    }

    async findUniqueUser (
        opt: FindUserOptions
    ): Promise<User | undefined> {
        const found = await this.prisma.user.findUnique({
            where: {
                login: opt.login,
                email: opt.email,
                id: opt.id
            },
        });
        return (found ? found : undefined);
    }

    async updateUser (
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
                email: data.email,
                password: data.password,
                rt: data.rt,
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

    async setUserOnline(
        id: number,
        online: boolean
    ) {
        // try {
            await this.prisma.user.update({
                where: {
                    id: id
                },
                data: {
                    state: online
                }
            });
        // } catch (err) {
        //     throw new NotFoundException('user not found');
        // }
    }

    async get_USER_by_USER_id(
        id: number
    ): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: {
                id: id
            }
        });
        if (!user) {
            throw new NotFoundException('user not found');
        }
        return (user);
    }

    async get_USER_by_USER_login(
        login: string
    ): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: {
                login: login
            }
        });
        if (!user) {
            throw new NotFoundException('user not found');
        }
        return (user);
    }
}

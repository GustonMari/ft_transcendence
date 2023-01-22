import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { RegisterDTO } from 'app/src/auth/dtos/register.dto';
import TokenPayloadRO from 'app/src/auth/ros/token_payload.ro';
import { PrismaService } from 'app/src/prisma/prisma.service';
import { Request } from 'express'
import ResUserDTO from '../dtos/user.res.dto';

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService
    ) { }


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

    async createUser(
        dto: RegisterDTO
    ): Promise<User> {
        const user = await this.prisma.user.create({
            data: {
                login: dto.login,
                email: dto.email,
                password: dto.password,
            },
        });
        return user;
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

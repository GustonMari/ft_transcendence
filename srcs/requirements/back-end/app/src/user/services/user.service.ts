import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { RegisterDTO } from 'app/src/auth/dtos/register.dto';
import { PrismaService } from 'app/src/prisma/prisma.service';
import { Request } from 'express'

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
            }
        });
        if (found) { return (found); }
        return (undefined);
    }

    async createUser(
        dto: RegisterDTO
    ): Promise<User> {
        const user = await this.prisma.user.create({
            data: {
                login: dto.login,
                email: dto.email,
                password: dto.password
            }
        });
        return user;
    }

    async setUserOnline(
        login: string,
        online: boolean
    ) {
        try {
            const user = await this.prisma.user.update({
                where: {
                    login: login
                },
                data: {
                    state: online
                }
            });
        } catch (e) {
            throw new NotFoundException('user not found'); 
        }
    }

    async get_me (
        req : Request
    ) : Promise<Partial<User>> {
        const token = await req.cookies.access_token;

        try {
            const payload = await this.jwtService.verify(token, {publicKey: 'secret'}); // TODO: fix this error
            console.log(payload);
            return (payload);
        } catch (err) {
            throw new NotFoundException('user inside jwt token does not exist');
        }
    }

}

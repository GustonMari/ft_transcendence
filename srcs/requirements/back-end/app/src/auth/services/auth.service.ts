import { UserRO } from './../../user/ros/user.full.ro';
import { UserService } from './../../user/services/user.service';
import {
    Injectable,
    UnauthorizedException,
    NotFoundException
} from '@nestjs/common';
import { RegisterDTO } from '../dtos/register.dto';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import LoginDTO from './../dtos/login.dto';
import TokenPayloadRO from '../ros/token_payload.ro';
import { plainToClass } from 'class-transformer';
import { Tokens } from '../interfaces';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async register(
        dto: RegisterDTO
    ): Promise<Tokens> {
        if (
            await this.userService.findUniqueUser({
                email: dto.email
            })
            ||
            await this.userService.findUniqueUser({
                login: dto.login
            })
        ) throw new UnauthorizedException('User already exists');

        const user_raw = await this.userService.createUser({
            login: dto.login,
            email: dto.email,
            password: await argon.hash(dto.password),
        });
        const user_token: TokenPayloadRO = plainToClass(
            TokenPayloadRO,
            user_raw,
            {
                excludeExtraneousValues: true
            });
        const tokens: Tokens = await this.signTokens(user_token);
        await this.userService.updateUser({
            id: user_raw.id,
        },
        {
            rt: await argon.hash(tokens.refresh_token),
        });
        this.userService.setUserOnline(user_raw.id, true);
        return (tokens);
    }

    async login(
        dto: LoginDTO
    ): Promise<Tokens> {
        const user_raw = await this.userService.findUniqueUser({
            login: dto.login,
        });
        if (!user_raw) throw new UnauthorizedException('Invalid login');

        const passwordMatch = await argon.verify(user_raw.password, dto.password);
        if (!passwordMatch) throw new UnauthorizedException('Invalid password');

        const user_token: TokenPayloadRO = plainToClass(
            TokenPayloadRO,
            user_raw,
            {
                excludeExtraneousValues: true
            });
        const tokens: Tokens = await this.signTokens(user_token);
        await this.userService.updateUser({
            id: user_raw.id,
        },
        {
            rt: await argon.hash(tokens.refresh_token),
        });
        this.userService.setUserOnline(user_raw.id, true);
        return (tokens);
    }

    async logout(
        id: number,
    ): Promise<void> {
        console.log(id);
        await this.userService.setUserOnline(id, false);
    }

    async signTokens(
        user: TokenPayloadRO
    ): Promise<Tokens> {

        const plain_user = JSON.parse(JSON.stringify(user));

        const [at, rt] = [
            this.jwtService.sign(plain_user, {
                secret: 'secret',
                expiresIn: '60s',
            }),
            this.jwtService.sign(plain_user, {
                secret: 'secret',
                expiresIn: '5d',
            }),
        ];
        return ({
            access_token: at,
            refresh_token: rt,
        });
    }

    verifyToken(
        token: string
    ): TokenPayloadRO {
        const payload_raw = this.jwtService.verify(token, {
            secret: 'secret',
        });
        const payload: TokenPayloadRO = plainToClass(TokenPayloadRO, payload_raw, {
            excludeExtraneousValues: true,
        });
        return (payload);
    }

}

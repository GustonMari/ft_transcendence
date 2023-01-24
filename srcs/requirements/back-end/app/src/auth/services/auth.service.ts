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
        await this.userService.setUserOnline(id, false);
    }

    async refresh(
        user: UserRO,
        cred: Tokens,
    ): Promise<Tokens> {

        if (!cred.refresh_token) throw new UnauthorizedException('Invalid token');

        const f = await this.userService.findUniqueUser({
            id: user.id,
        })
        if (!f) throw new NotFoundException('User not found');

        const m = await argon.verify(f.rt, cred.refresh_token);
        if (!m) throw new UnauthorizedException('Invalid token');

        const tokens: Tokens = await this.signTokens(user);
        await this.userService.updateUser({
            id: user.id,
        },
        {
            rt: await argon.hash(tokens.refresh_token),
        });
        return (tokens);
    }

    async signTokens(
        user: TokenPayloadRO
    ): Promise<Tokens> {

        const plain_user = JSON.parse(JSON.stringify(user));

        const [at, rt] = [
            this.jwtService.sign(plain_user, {
                secret: 'secret',
                expiresIn: '10m',
            }),
            this.jwtService.sign(plain_user, {
                secret: 'secret',
                expiresIn: '5d',
            }),
        ];
        return ({
            access_token: at,
            refresh_token: rt
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

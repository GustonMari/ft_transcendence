import { ProfileField } from './../interfaces/profileField.interface';
import { UserRO } from './../../user/ros/user.full.ro';
import { UserService } from './../../user/services/user.service';
import {
    Injectable,
    UnauthorizedException,
    NotFoundException,
    Logger
} from '@nestjs/common';
import { RegisterDTO } from '../dtos/register.dto';
import { JwtService } from '@nestjs/jwt';
import LoginDTO from './../dtos/login.dto';
import TokenPayloadRO from '../ros/token_payload.ro';
import { plainToClass } from 'class-transformer';
import { Tokens } from '../interfaces';
import * as argon from 'argon2';

import * as crypto from 'crypto';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async register(
        dto: RegisterDTO
    ): Promise<Tokens> {
        if (dto.login.length < 9) throw new UnauthorizedException('Username is too short');
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
        if (!m) throw new UnauthorizedException('Invalid token, value mismatch');

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


    // TODO: remove this function if not needed
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

    async callback(
        profile: ProfileField
    ): Promise<Tokens> {
        let r = crypto.randomBytes(50).toString('hex');
        let found = (await this.userService.findUniqueUser({
                            email: profile.email
                        })
                        ||
                        await this.userService.findUniqueUser({
                            login: profile.username
        }))
        if (found && found.tfa === true) {
            // turn on tfa_pending
            return ({
                access_token: undefined,
                refresh_token: undefined
            });
        }

        if (!found) {
            found = await this.userService.createUser({
                login: profile.username,
                email: profile.email,
                password: await argon.hash(r),
            });
        }

        const user_token: TokenPayloadRO = plainToClass(
            TokenPayloadRO,
            found,
            {
                excludeExtraneousValues: true
            });
        const tokens: Tokens = await this.signTokens(user_token);
        await this.userService.updateUser({
                id: found.id,
            },
            {
                rt: await argon.hash(tokens.refresh_token),
                avatar_url: profile.avatar as string,
            }
        );
        this.userService.setUserOnline(found.id, true);

        Logger.log(profile.username + ' is registered');

        return ({
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
        })
    }

    async generateTFA (
        username: string
    ) {
        const secret = speakeasy.generateSecret({ name: '42' });
        const url = secret.otpauth_url;

        await this.userService.updateUser(
            {
                login: username,
            },
            {
                tfa_secret: secret.base32,
            }
        );
        return (url);
    }

    async validationTFA (
        code: string,
        username: string
    ) {
        const user = await this.userService.findUniqueUser({
            login: username,
        });
        if (!user) throw new NotFoundException('User not found');

        const verified = speakeasy.totp.verify({
            secret: user.tfa_secret,
            encoding: 'base32',
            token: code,
        });
        if (!verified) throw new UnauthorizedException('Invalid code');

        await this.userService.updateUser(
            {
                login: username,
            },
            {
                tfa_secret: '',
            }
        );

        const user_token: TokenPayloadRO = plainToClass(
            TokenPayloadRO,
            user,
            {
                excludeExtraneousValues: true
            });
        const tokens: Tokens = await this.signTokens(user_token);
        return ({
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
        })
    }

}

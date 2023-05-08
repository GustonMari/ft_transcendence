import { UserService } from './../../user/services/user.service';
import {
    Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import TokenPayloadRO from '../ros/token_payload.ro';
import { Tokens } from '../interfaces';
import { Response } from 'express';

import * as argon from 'argon2';
import * as crypto from 'crypto';
import * as speakeasy from 'speakeasy';
import { AT_EXPIRATION, RT_EXPIRATION } from '../data';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async signTokens(
        user: TokenPayloadRO
    ): Promise<Tokens> {

        const plain_user = JSON.parse(JSON.stringify(user));

        const [at, rt] = [
            this.jwtService.sign(plain_user, {
                secret: process.env.JWT_SECRET,
                expiresIn: AT_EXPIRATION,
            }),
            this.jwtService.sign(plain_user, {
                secret: process.env.JWT_SECRET,
                expiresIn: RT_EXPIRATION,
            }),
        ];
        return ({
            access_token: at,
            refresh_token: rt,
        });
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

    async TFAVerify (
        secret: string,
        code: string
    ) : Promise<boolean>{
        const verified = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: code,
        });
        if (!verified) return (false);
        return (true);
    }


    async setCookies (
        access_token: string,
        refresh_token: string,
        res: Response
    ) {
        res.cookie('access_token', access_token, {
            httpOnly: (process.env.LOCAL_IP === "localhost" ? true : false),
            secure: (process.env.LOCAL_IP === "localhost" ? true : false),
            sameSite: 'none',
            expires: new Date(Date.now() + (5 *  24 * 3600 * 1000)),
        });
        res.cookie('refresh_token', refresh_token, {
            httpOnly: (process.env.LOCAL_IP === "localhost" ? true : false),
            secure: (process.env.LOCAL_IP === "localhost" ? true : false),
            sameSite: 'none',
            expires: new Date(Date.now() + (5 *  24 * 3600 * 1000)),
        });
    }

    async saveRefreshToken (
        id: number,
        refresh_token: string
    ) {
        await this.userService.updateUser({
            id: id,
        },
        {
            rt: await argon.hash(refresh_token),
        });
    }
}

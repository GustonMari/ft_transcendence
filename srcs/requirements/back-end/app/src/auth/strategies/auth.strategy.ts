import { User } from '@prisma/client';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from "@nestjs/passport";
import { UserService } from 'app/src/user/services/user.service';
import { Passport } from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { RegisterDTO } from '../dtos/register.dto';
import { Request } from 'express';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy, 'local') {

    constructor(
        private readonly userService: UserService
    ) {
        super({
            secretOrKey: 'secret',  // TODO change this value by the one in the .env file
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => {
                    return req?.cookies?.access_token;
                },
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
        });
    }

    async validate(payload: RegisterDTO): Promise<User> {
        // console.log(payload);
        const user = await this.userService.doesUserExist(payload.login, payload.email);
        if (!user) {
            throw new UnauthorizedException("invalid credentials");
        } else {
            return user;
        }
    }
}
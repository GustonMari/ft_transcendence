import { UserRO } from '../../user/ros/user.full.ro';
import { User } from '@prisma/client';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from "@nestjs/passport";
import { UserService } from 'app/src/user/services/user.service';
import { ExtractJwt, Strategy } from "passport-jwt";
import { RegisterDTO } from '../dtos/register.dto';
import { Request } from 'express';
import { TransformPlainToInstance } from 'class-transformer';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy, 'access') {

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

    @TransformPlainToInstance(UserRO, {
        excludeExtraneousValues: true,
    })
    async validate(payload: RegisterDTO): Promise<UserRO> {
        const user_raw = await this.userService.findUniqueUser({
            login: payload.login,
        });
        if (!user_raw) throw new UnauthorizedException("Invalid credentials");
        return user_raw;
    }
}
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
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {

    constructor(
        private readonly userService: UserService
    ) {
        super({
            secretOrKey: 'secret',  // TODO change this value by the one in the .env file
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => {
                    return req?.cookies?.refresh_token;
                },
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            PassReqToCallback: true,
        });
    }

    @TransformPlainToInstance(UserRO, {
        excludeExtraneousValues: true,
    })
    async validate(payload: any): Promise<UserRO> {
        return payload;
    }
}
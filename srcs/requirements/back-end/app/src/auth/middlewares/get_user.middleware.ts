import { AuthService } from '../services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { UserService } from 'app/src/user/services/user.service';
import { Request, Response, NextFunction } from 'express';
import TokenPayloadRO from '../ros/token_payload.ro';

@Injectable()
export class GetMeMiddleware implements NestMiddleware {
    constructor (
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) { }
    
    async use(req: Request, res: Response, next: NextFunction) {
        const token: string = await req.cookies.access_token;

        if (token) {
            const payload : TokenPayloadRO = await this.authService.verify_token(token)
            req.body.ft_authentification_payload = payload;
        }
        next();
    }
}
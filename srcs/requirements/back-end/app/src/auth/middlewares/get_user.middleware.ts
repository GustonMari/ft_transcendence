import { Injectable, NestMiddleware } from '@nestjs/common';
import { UserService } from 'app/src/user/services/user.service';
import { Request, Response, NextFunction } from 'express';
import TokenPayloadDTO from '../dtos/token_payload.dto';

@Injectable()
export class GetUserMiddleware implements NestMiddleware {
    constructor (
        private readonly userService: UserService
    ) { }
    
    async use(req: Request, res: Response, next: NextFunction) {
        const payload : TokenPayloadDTO = await this.userService.get_me(req);
        req.body.ft_authentification_payload = payload;
        next();
    }
}
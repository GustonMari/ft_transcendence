import { Injectable, NestMiddleware } from '@nestjs/common';
import { UserService } from 'app/src/user/services/user.service';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class GetUserMiddleware implements NestMiddleware {
    constructor (
        private readonly userService: UserService
    ) { }
    
    async use(req: Request, res: Response, next: NextFunction) {
        const payload = await this.userService.get_me(req);
        req.body.ft_auth = payload;
        next();
    }
}

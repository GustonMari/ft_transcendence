import { UserService } from 'app/src/user/services/user.service';
import { RegisterDTO } from './../dtos/register.dto';
import LoginDTO from './../dtos/login.dto';
import {
    Body,
    Controller,
    Delete,
    Get,
    Logger,
    Post,
    Req,
    Res,
    UnauthorizedException
} from '@nestjs/common';
import {
    Response,
    Request    
} from 'express';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
    constructor (
        private authService: AuthService,
        private userService: UserService
    ) { }

    @Post('/register')
    async register (
        @Body() dto: RegisterDTO,
        @Res() res: Response
    ) {
        const user = await this.authService.register(dto);
        Logger.log(dto.login + ' is registered');
        delete user.password;
        const access_token = await this.authService.sign_token(user);
        this.userService.setUserOnline(user.login, true);

        res.cookie('access_token', access_token);
        res.send({access_token: access_token});
        
    }

    @Post('/login')
    async login (
        @Body() dto: LoginDTO,
        @Res() res: Response
    ) {
        const user = await this.authService.login(dto);
        delete user.password;
        Logger.log(dto.login + ' is logged in');
        const access_token = await this.authService.sign_token(user);
        this.userService.setUserOnline(user.login, true);
        
        res.cookie('access_token', access_token);
        res.send({access_token: access_token});
    }

    @Delete('/logout')
    async logout (
        @Req() req: Request,
        @Res() res: Response
    ) {
        const user = await this.userService.get_me(req)
        await this.userService.setUserOnline(user.login, false);
        res.clearCookie('access_token');
        res.send({message: 'logged out'});
        // res.send({message: req});
    }

}

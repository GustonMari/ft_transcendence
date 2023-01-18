import { AuthGuard } from '@nestjs/passport';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { LocalGuard } from 'app/src/auth/guards/auth.guard';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {

    constructor(
        private readonly userService: UserService,
    ) { }

    @UseGuards(LocalGuard)
    @Get('me')
    async get_me (
        @Req() req : Request
    ) {        
        return ( req.body.ft_auth );
    }

    
}

import { UserRO } from './../../user/ros/user.full.ro';
import {
    Delete,
    HttpStatus
} from '@nestjs/common';
import { RegisterDTO } from './../dtos/register.dto';
import LoginDTO from './../dtos/login.dto';
import {
    Body,
    Controller,
    Get,
    HttpCode,
    Logger,
    Post,
    Res,
    UseGuards,
} from '@nestjs/common';
import {
    Response,
    Request,
} from 'express';
import { AuthService } from '../services/auth.service';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiCookieAuth,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { AccessGuard } from '../guards/access.guard';
import {
    GetCredentials,
    GetMe
} from '../decorators';
import { Tokens } from '../interfaces';
import { RefreshGuard } from '../guards/refresh.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) { }

    /* ------------------------------------------------------------------------------ */

    @ApiOkResponse({
        status: 201,
        description: 'User has been registered'
    })
    @ApiUnauthorizedResponse({
        status: 401,
        description: 'This login is already taken'
    })
    @ApiBadRequestResponse({
        status: 400,
        description: 'Body does not have the values expected by the DTO'
    })
    @ApiOperation({
        summary: 'Register a new user',
    })
    @ApiBody({
        type: RegisterDTO
    })

    @Post('/register')
    @HttpCode(HttpStatus.CREATED)
    async register(
        @Body() dto: RegisterDTO,
        @Res() res: Response
    ) {
        const { access_token, refresh_token } = await this.authService.register(dto);
        Logger.log(dto.login + ' is registered');
        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });
        res.send({ access_token: access_token });
    }

    /* ------------------------------------------------------------------------------ */

    @ApiOkResponse({
        status: 200,
        description: 'User logged in'
    })
    @ApiUnauthorizedResponse({
        status: 401,
        description: 'Password or login does not match the one in the DB'
    })
    @ApiBadRequestResponse({
        status: 400,
        description: 'Body does not have the values expected by the DTO'
    })
    @ApiOperation({
        summary: 'Sign in a user',
    })
    @ApiBody({ type: LoginDTO })

    @Post('/signin')
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() dto: LoginDTO,
        @Res() res: Response
    ) {
        const { access_token, refresh_token } = await this.authService.login(dto);
        Logger.log(dto.login + ' is logged in');
        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });
        res.send({ access_token: access_token });
    }

    /* ------------------------------------------------------------------------------ */

    @ApiOkResponse({
        status: 205,
        description: 'User logged out and cookies deleted'
    })
    @ApiNotFoundResponse({
        status: 404,
        description: 'User store in jwt token does not exist'
    })
    @ApiOperation({
        summary: 'Sign out a user',
    })
    @ApiCookieAuth("access_token")
    @HttpCode(HttpStatus.RESET_CONTENT)
    @ApiBearerAuth()

    @Delete('/logout')
    @UseGuards(AccessGuard)
    async logout(
        @GetMe("id") id: number,
        @Res() res: Response
    ) {
        await this.authService.logout(id);
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        res.send({ message: 'logged out' });
    }

    /* ------------------------------------------------------------------------------ */

    @Get('/refresh')
    @UseGuards(RefreshGuard)
    async refresh(
        @GetMe() user: UserRO,
        @GetCredentials() credentials: Tokens,
        @Res() res: Response
    ) {
        console.log(user);
        const {access_token, refresh_token} = await this.authService.refresh(user, credentials);
        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });
        res.send({ access_token: access_token });
    }
}

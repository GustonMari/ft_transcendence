import { HttpStatus } from '@nestjs/common';
import { UserService } from 'app/src/user/services/user.service';
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
} from 'express';
import { AuthService } from '../services/auth.service';
import { GetMe } from '../decorators/get_user.decorator';
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
import { LocalGuard } from '../guards/auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) { }

    /* ------------------------------------------------------------------------------ */

    @ApiOkResponse({
        status: 200,
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
        res.cookie('access_token', access_token);
        res.cookie('refresh_token', refresh_token);
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
    async login(
        @Body() dto: LoginDTO,
        @Res() res: Response
    ) {
        const { access_token, refresh_token } = await this.authService.login(dto);
        Logger.log(dto.login + ' is logged in');
        res.cookie('access_token', access_token);
        res.cookie('refresh_token', refresh_token);
        res.send({ access_token: access_token });
    }


    @ApiOkResponse({
        status: 200,
        description: 'User logged out'
    })
    @ApiNotFoundResponse({
        status: 404,
        description: 'User store in jwt token does not exist'
    })
    @ApiOperation({
        summary: 'Sign out a user',
    })
    @ApiCookieAuth("access_token")
    @ApiBearerAuth()

    @Get('/logout')
    @UseGuards(LocalGuard)
    async logout(
        @GetMe() id: number,
        @Res() res: Response
    ) {
        await this.authService.logout(id);
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        res.send({ message: 'logged out' });
    }
}

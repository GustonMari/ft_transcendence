import {
    Delete,
    HttpStatus,
    Param,
    Query,
    Redirect,
    Req,
    UnauthorizedException
} from '@nestjs/common';
import { RegisterDTO } from '../dtos/register.dto';
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
    ApiBody,
    ApiCookieAuth,
    ApiOperation,
    ApiQuery,
} from '@nestjs/swagger';
import {
    GetCredentials,
    GetMe
} from '../decorators';
import { Tokens } from '../interfaces';
import {
    FtGuard,
    RefreshGuard,
    AccessGuard
} from '../guards';
import { UserRO } from 'app/src/user/ros/user.full.ro';


@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) { }

    /* ------------------------------------------------------------------------------ */

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
        });
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,

            secure: true,
        });
        res.send({ access_token: access_token });
    }

    /* ------------------------------------------------------------------------------ */

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

        if (access_token !== undefined && refresh_token === undefined) {
            res.send({
                url: 'authentification?qrcode=' + access_token + "&username=" + dto.login,
            })
            return;
        }

        Logger.log(dto.login + ' is logged in');
        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: true,
        });
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: true,
        });
        res.send({ access_token: access_token });
    }

    /* ------------------------------------------------------------------------------ */

    @ApiOperation({
        summary: 'Sign out a user',
    })
    @ApiCookieAuth("access_token")

    @Delete('/logout')
    @UseGuards(AccessGuard)
    @HttpCode(HttpStatus.RESET_CONTENT)
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

    @ApiOperation({
        summary: 'Refresh a user\'s access token',
    })
    @ApiCookieAuth("refresh_token")

    @Get('/refresh')
    @UseGuards(RefreshGuard)
    async refresh(
        @GetMe() user: UserRO,
        @GetCredentials() credentials: Tokens,
        @Res() res: Response
    ) {
        console.log("Refresh functions here -> ", user, credentials);
        const {access_token, refresh_token} = await this.authService.refresh(user, credentials);
        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: true,
        });
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: true,
        });
        res.send({ access_token: access_token });
    }

    /* ------------------------------------------------------------------------------ */

    @ApiOperation({
        summary: 'Connect a user with 42 intra profile',
    })

    @Get('/42/connect')
    async connect42() {
        let url = 'https://api.intra.42.fr/oauth/authorize';
        url += '?client_id=';
        url += process.env.CLIENT_ID;
        url += '&redirect_uri=http://localhost:3000/api/auth/42/callback';
        url += '&response_type=code';

        return ({ url: url });
    }

    /* ------------------------------------------------------------------------------ */

    @ApiOperation({
        summary: 'Callback for 42 intra profile',
    })
    @ApiQuery({
        name: 'code',
        type: String,
        description: 'code for 42 intra profile authentication'
    })

    @Get('/42/callback')
    @UseGuards(FtGuard)
    async callback42(
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const user : any = req.user;
        if (user == undefined) { throw new UnauthorizedException('profile is undefined'); }
        
        const {access_token, refresh_token} = await this.authService.callback(user.profile);
        if (access_token == undefined || refresh_token == undefined) {
            const qr_url = await this.authService.generateTFA(user.profile.username);
            res.redirect('http://localhost:4200/authentification?qrcode=' + qr_url + "&username=" + user.profile.username);
            return;
        }
        
        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: true,
        });
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: true,
        });
        res.redirect('http://localhost:4200/home');
    }

    /* ------------------------------------------------------------------------------ */

    @Get('tfa/validation')
    async validationTFA(
        @Query('token') token: string,
        @Query('username') username: string,
        @Res() res: Response
    ) { 
        const {access_token, refresh_token} = await this.authService.validationTFA(token, username);
        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: true,
        });
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: true,
        });
        res.send();
    }

    /* ------------------------------------------------------------------------------ */

}

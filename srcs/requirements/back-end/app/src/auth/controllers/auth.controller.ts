import { UserService } from 'app/src/user/services/user.service';
import {
    Delete,
    HttpStatus,
    NotFoundException,
    Query,
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
    ApiResponse,
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
import { User } from '@prisma/client';

import * as argon from 'argon2';
import * as crypto from 'crypto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UserService,
    ) { }

    /* ------------------------------------------------------------------------------ */

    @ApiOperation({
        summary: 'Register a new user',
        description: 'Register a new user and store access_token and refresh_token in cookies',
    })
    @ApiBody({
        type: RegisterDTO
    })
    @ApiResponse({
        status: 201,
        description: 'User created and store access_token and refresh_token in cookies'
    })
    @ApiResponse({
        status: 401,
        description: 'Username already exists'
    })

    @Post('/register')
    @HttpCode(HttpStatus.CREATED)
    async register(
        @Body() dto: RegisterDTO,
        @Res() res: Response
    ) {
        const checkUsername = await this.userService.getUserWithUsername(dto.login);
        if (checkUsername) throw new UnauthorizedException('Username already exists');
        

        const user_created = await this.userService.createUser({
            login: dto.login,
            email: dto.email,
            password: await argon.hash(dto.password),
        })
        await this.userService.setUserOnline(user_created.id, true);
        const {access_token, refresh_token} = await this.authService.signTokens({
            id: user_created.id,
            login: dto.login,
            email: dto.email, 
        });
        await this.authService.saveRefreshToken(user_created.id, refresh_token);
        await this.authService.setCookies(access_token, refresh_token, res);

        res.send();
    }

    /* ------------------------------------------------------------------------------ */

    @ApiOperation({
        summary: 'Sign in a user',
        description: 'Sign in a user and store access_token and refresh_token in cookies',
    })
    @ApiBody({ type: LoginDTO })
    @ApiResponse({
        status: 201,
        description: 'User signed in and store access_token and refresh_token in cookies'
    })
    @ApiResponse({
        status: 401,
        description: 'Invalid password'
    })
    @ApiResponse({
        status: 404,
        description: 'User does not exist'
    })

    @Post('/signin')
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() dto: LoginDTO,
        @Res() res: Response
    ) {
        const user = await this.userService.getUserWithUsername(dto.login);
        if (!user) throw new NotFoundException('User does not exist');

        const validPassword = await argon.verify(user.password, dto.password);
        if (!validPassword) throw new UnauthorizedException('Invalid password');

        if (user.tfa === true) {
            const url = await this.authService.generateTFA(user.login);

            res.send({
                url: 'authentification?qrcode=' + url + "&username=" + user.login,
            })
        }

        const {access_token, refresh_token} = await this.authService.signTokens({
            id: user.id,
            login: user.login,
            email: user.email,
        });
        await this.userService.setUserOnline(user.id, true);
        await this.authService.saveRefreshToken(user.id, refresh_token);
        await this.authService.setCookies(access_token, refresh_token, res);

        res.send();
    }

    /* ------------------------------------------------------------------------------ */

    @ApiOperation({
        summary: 'Sign out a user',
        description: 'Sign out a user and clear access_token and refresh_token cookies',
    })
    @ApiCookieAuth("access_token")

    @Delete('/logout')
    @UseGuards(AccessGuard)
    @HttpCode(HttpStatus.RESET_CONTENT)
    async logout(
        @GetMe("id") id: number,
        @Res() res: Response
    ) {
        try {
            await this.userService.setUserOnline(id, false);
            res.clearCookie('access_token');
            res.clearCookie('refresh_token');
        } catch (e) {
            throw new Error('Impossible to sign out, please try again later');
        }
        res.send();
    }

    /* ------------------------------------------------------------------------------ */

    @ApiOperation({
        summary: 'Refresh a user\'s access token',
    })
    @ApiCookieAuth("refresh_token")

    @Get('/refresh')
    @UseGuards(RefreshGuard)
    @HttpCode(HttpStatus.OK)
    async refresh(
        @GetCredentials() credentials: Tokens,
        @GetMe() user_token: UserRO,
        @Res() res: Response
    ) {
        if (!credentials.refresh_token) throw new UnauthorizedException('No refresh token');

        const user = await this.userService.getUserWithId(user_token.id);
        if (!user) throw new NotFoundException('User does not exist');

        const doesRFMatch = await argon.verify(user.rt, credentials.refresh_token);
        if (!doesRFMatch) throw new UnauthorizedException('Invalid refresh token');

        const {access_token, refresh_token} = await this.authService.signTokens({
            id: user.id,
            login: user.login,
            email: user.email,
        });
        await this.authService.saveRefreshToken(user.id, refresh_token);
        await this.authService.setCookies(access_token, refresh_token, res);

        res.send();
    }

    /* ------------------------------------------------------------------------------ */

    @ApiOperation({
        summary: 'Connect a user with 42 intra profile',
        description: 'Connect a user with 42 intra by redirecting to 42 intra authentication page',
    })

    @Get('/42/connect')
    @HttpCode(HttpStatus.OK)
    async connect42() {
        let url = 'https://api.intra.42.fr/oauth/authorize';
        url += '?client_id=';
        url += process.env.CLIENT_ID;
        url += `&redirect_uri=http://${process.env.LOCAL_IP}:3000/api/auth/42/callback`;
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
    @HttpCode(HttpStatus.CREATED)
    async callback42(
        @Req() req: Request,
        @Res() res: Response,
    ) {
        if (req.user == undefined) {throw new UnauthorizedException('profile is undefined');}

        const ft_user = req.user as any;
        const user = await this.userService.getUserWithFortyTwo(ft_user.profile.id)
        if (!user) {
            let username = ft_user.profile.username as string;
            const password = crypto.randomBytes(50).toString('hex');
            const checkUsername : User = await this.userService.getUserWithUsername(username);
            if (checkUsername) {
                username = username + Math.floor(Math.random() * 1000).toString();
            }
            
            console.log(ft_user.profile);

            const user = await this.userService.createUser({
                login: username,
                email: ft_user.profile.email as string,
                password: password,
                ft_id: ft_user.profile.id as number,
            });

            await this.userService.updateUser({
                id: user.id,
            },
            {
                avatar_url: ft_user.profile.image_url as string,
                first_name: ft_user.profile._json.first_name,
                last_name: ft_user.profile._json.last_name,
            });

        } else {
            if (user.tfa === true) {
                const qr_url = await this.authService.generateTFA(user.login);
                res.redirect(`http://${process.env.LOCAL_IP}:4200/authentification?qrcode=` + qr_url + "&username=" + user.login);
                return;
            }       
        }

        const {access_token, refresh_token} = await this.authService.signTokens({
            id: user.id,
            login: user.login,
            email: user.email,
        });
        await this.userService.setUserOnline(user.id, true);
        await this.authService.saveRefreshToken(user.id, refresh_token);
        await this.authService.setCookies(access_token, refresh_token, res);

        res.redirect(`http://${process.env.LOCAL_IP}:4200/profile`);
    }

    /* ------------------------------------------------------------------------------ */

    @Get('tfa/validation')
    async validationTFA(
        @Query('token') token: string,
        @Query('username') username: string,
        @Res() res: Response
    ) { 

        if (!token) {throw new UnauthorizedException('No token');}
        if (!username) {throw new UnauthorizedException('No username');}

        const user = await this.userService.getUserWithUsername(username);
        if (!user) {throw new NotFoundException('User does not exist');}

        const _ = await this.authService.TFAVerify(user.tfa_secret, token);
        if (!_) {throw new UnauthorizedException('Invalid token');}

        await this.userService.updateUser(
            {login: username},
            {tfa_secret: ''}
        );

        const {access_token, refresh_token} = await this.authService.signTokens({
            id: user.id,
            login: user.login,
            email: user.email,
        });
        await this.userService.setUserOnline(user.id, true);
        await this.authService.saveRefreshToken(user.id, refresh_token);
        await this.authService.setCookies(access_token, refresh_token, res);

        res.send();

        // const {access_token, refresh_token} = await this.authService.validationTFA(token, username);
        // res.cookie('access_token', access_token, {
        //     httpOnly: (process.env.LOCAL_IP === "localhost" ? true : false),
        //     secure: (process.env.LOCAL_IP === "localhost" ? true : false),
        // });
        // res.cookie('refresh_token', refresh_token, {
        //     httpOnly: (process.env.LOCAL_IP === "localhost" ? true : false),
        //     secure: (process.env.LOCAL_IP === "localhost" ? true : false),
        // });
        // res.send();
    }

    /* ------------------------------------------------------------------------------ */

}

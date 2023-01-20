import { UserService } from 'app/src/user/services/user.service';
import { RegisterDTO } from './../dtos/register.dto';
import LoginDTO from './../dtos/login.dto';
import {
    Body,
    Controller,
    Get,
    Logger,
    Post,
    Res,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import {
    Response,
} from 'express';
import { AuthService } from '../services/auth.service';
import TokenPayloadDTO from '../dtos/token_payload.dto';
import { GetUser } from '../decorators/get_user.decorator';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { LocalGuard } from '../guards/auth.guard';
import { LoginROPipe } from '../validators/token.validator';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UserService
    ) { }

    @ApiOkResponse({ status: 200, description: 'User has been registered' })
    @ApiUnauthorizedResponse({ status: 401, description: 'Login value has already been found in the DB' })
    @ApiBadRequestResponse({ status: 400, description: 'Body does not have the values expected by the DTO' })
    @ApiBody({ type: RegisterDTO })

    @Post('/register')
    async register(
        @Body() dto: RegisterDTO,
        @Res() res: Response
    ) {
        const payload: TokenPayloadDTO = new TokenPayloadDTO(await this.authService.register(dto));

        Logger.log(dto.login + ' is registered');
        const access_token = this.authService.sign_token(payload);
        this.userService.setUserOnline(payload.login, true);

        res.cookie('access_token', access_token);
        res.send({ access_token: access_token });
    }


    @ApiOkResponse({ status: 200, description: 'User logged in' })
    @ApiNotFoundResponse({ status: 404, description: 'Login value does not exist in the DB' })
    @ApiUnauthorizedResponse({ status: 401, description: 'Password value does not match the one in the DB' })
    @ApiBadRequestResponse({ status: 400, description: 'Body does not have the values expected by the DTO' })
    @ApiBody({ type: LoginDTO })

    @Post('/signin')
    async login(
        @Body() dto: LoginDTO,
        @Res() res: Response
    ) {
        const payload: TokenPayloadDTO = new TokenPayloadDTO(await this.authService.login(dto));

        console.log(payload);
        Logger.log(dto.login + ' is logged in');
        const access_token = this.authService.sign_token(payload);
        this.userService.setUserOnline(payload.login, true);

        res.cookie('access_token', access_token);
        res.send({ access_token: access_token });
    }


    @ApiOkResponse({ status: 200, description: 'User logged out' })
    @ApiNotFoundResponse({ status: 404, description: 'User store in jwt token does not exist' })
    @ApiBearerAuth()
    @ApiBody({ type: TokenPayloadDTO })

    @Get('/logout')
    @UseGuards(LocalGuard)
    async logout(
        @GetUser() user: TokenPayloadDTO,
        @Res() res: Response
    ) {
        await this.userService.setUserOnline(user.login, false);
        res.clearCookie('access_token');
        res.send({ message: 'logged out' });
    }

}

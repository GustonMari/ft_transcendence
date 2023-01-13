import { RegisterDTO } from './../dtos/register.dto';
import {
    Body,
    Controller,
    Get,
    Logger,
    Post
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);
    private readonly authService: AuthService;

    @Post('/register')
    async register (
        @Body() dto: RegisterDTO
    ) {
        const user = await this.authService.register(dto);
        if (user) {
            return {
                message: 'User added'
            };
        }
    }

    @Get('/register')
    register_g () {
        console.log('Register');
        return {
            text: 'Register'
        };
    }
    

    @Get('/logout')
    //

    @Post('/login')
    login () {

    }
    //
}

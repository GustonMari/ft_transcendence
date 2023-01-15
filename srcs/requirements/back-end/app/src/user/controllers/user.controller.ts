import { AuthGuard } from '@nestjs/passport';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { LocalGuard } from 'app/src/auth/guards/auth.guard';

@Controller('user')
export class UserController {

    @UseGuards(LocalGuard)
    @Get('me')
    get_me () {
        return 'me';
    }

    
}

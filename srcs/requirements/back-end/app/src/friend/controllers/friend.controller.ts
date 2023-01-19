import { Controller, Get, UseGuards } from '@nestjs/common';
import { LocalGuard } from 'app/src/auth/guards/auth.guard';

@Controller('friend')
@UseGuards(LocalGuard)
export class FriendController {

    @Get()
    async get_friend() {
        return ({ value: "test" });
    }

    

}

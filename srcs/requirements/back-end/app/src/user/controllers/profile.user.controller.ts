import {
	Post,
	Body,
	Controller,
	Patch,
	UseGuards,
	UploadedFile,
	UseInterceptors,
	Res,
    Redirect,
} from '@nestjs/common';
import { GetMe } from "app/src/auth/decorators";
import { AccessGuard } from "app/src/auth/guards/access.guard";
import { UpdateProfileDTO } from "../dtos";
import { ProfileService } from "../services/profile.user.service";
import { MulterConfig } from '../middlewares';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(AccessGuard)
@Controller('user/profile')
export class ProfileController {

    constructor(
        private readonly ProfileService: ProfileService,
    ) { }

    @Patch('me/update')
    async updateMe(
        @Body() update: UpdateProfileDTO,
        @GetMe('id') id: number,
    ) {
        console.log(update);
        return (await this.ProfileService.updateMe(id, update));
    }

    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file', MulterConfig)
    )
    async uploadNewPP (
        @UploadedFile() file : any,
        @GetMe('id') id : number
    ) {
        await this.ProfileService.updatePP(id, file);
    }



}
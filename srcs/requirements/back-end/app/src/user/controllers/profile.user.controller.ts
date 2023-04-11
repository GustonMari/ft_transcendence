import {
	Post,
	Body,
	Controller,
	Patch,
	UseGuards,
	UploadedFile,
	UseInterceptors,
	Get,
	Param,
	Res,
	BadRequestException,
} from '@nestjs/common';
import { GetMe } from "app/src/auth/decorators";
import { AccessGuard } from "app/src/auth/guards/access.guard";
import { UpdateProfileDTO } from "../dtos";
import { ProfileService } from "../services/profile.user.service";
import { MulterConfig } from '../middlewares';
import { FileInterceptor } from '@nestjs/platform-express';
import * as process from 'process';

//@UseGuards(AccessGuard)
@Controller('user/profile')
export class ProfileController {

    constructor(
        private readonly ProfileService: ProfileService,
    ) { }

    // TODO: add doc for swagger
    @Patch('me/update')
    async updateMe(
        @Body() update: UpdateProfileDTO,
        @GetMe('id') id: number,
    ) {
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

    @Get('picture/:string')
    @UseGuards()
    async getProfilePicture (
        @Param('string') username: string,
        @Res() res,
    ) {
        const filename = await this.ProfileService.findPP(username);
        if (!filename) {
            throw new BadRequestException('Invalid username this login doesnt exist');
        }
        res.sendFile(process.cwd() + '/' + filename);
    }

}
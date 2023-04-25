import {BadRequestException, Controller, Get, Param, Res, UseGuards} from '@nestjs/common';
import {ProfileService} from "../../user/services/profile.user.service";

@Controller('public')
export class PublicController {

    constructor(
        private readonly ProfileService: ProfileService,
    ) { }

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
        if (filename.startsWith('http') || filename.startsWith('https')) {
            return (res.redirect(filename));
        } else {
            res.sendFile(process.cwd() + '/' + filename);
        }
    }
}

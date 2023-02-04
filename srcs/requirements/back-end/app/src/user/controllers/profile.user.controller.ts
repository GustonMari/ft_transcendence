import { Body, Controller, Patch, UseGuards } from "@nestjs/common";
import { GetMe } from "app/src/auth/decorators";
import { AccessGuard } from "app/src/auth/guards/access.guard";
import { UpdateProfileDTO } from "../dtos";
import { ProfileService } from "../services/profile.user.service";

@UseGuards(AccessGuard)
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
}
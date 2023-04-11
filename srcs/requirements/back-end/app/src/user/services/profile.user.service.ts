import * as argon from 'argon2';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UpdateProfileDTO } from '../dtos';
import { UserService } from './user.service';

@Injectable()
export class ProfileService {
    
    constructor(
        private readonly userService: UserService,
    ) { }

    async updateMe (
        id: number,
        obj: UpdateProfileDTO,
    ) : Promise<void> {

        const user_raw = await this.userService.findUniqueUser({
            id: id,
        });

        await this.userService.updateUser({
            id: id,
        },
        {
            password: (obj.password ? await argon.hash(obj.password) : undefined),
            first_name: obj.firstName,
            last_name: obj.lastName,
            description: obj.description,
        });
        return (null);
    }

    async updatePP (
        id : number,
        file: any
    ) {
        await this.userService.updateUser({
            id: id,
        },
        {
            avatar_url: file.path,
        });
    }

    async findPP (
        username: string,
    ) {
        return ((await this.userService.findUniqueUser({
            login: username,
        }))?.avatar_url);
    }
}
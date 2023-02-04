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

        /* Check if all password fiels are fill or empty */
        if (!((obj.password === undefined && obj.passwordConfirm === undefined && obj.oldPassword === undefined) ||
            (obj.password !== undefined && obj.passwordConfirm !== undefined && obj.oldPassword !== undefined))) {
            throw (new Error("Password and password confirmation must be set together"));
        }

        /* Get the current user */
        const user_raw = await this.userService.findUniqueUser({
            id: id,
        });
        if (obj.oldPassword) {
            const passwordMatch = await argon.verify(user_raw.password, obj.oldPassword);
            if (!passwordMatch) throw new UnauthorizedException('Invalid password');
        }

        /* Update the current user */
        console.log(obj);
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
}
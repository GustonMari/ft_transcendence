import { UserService } from './../../user/services/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDTO } from '../dtos/register.dto';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import LoginDTO from './../dtos/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async register (
        dto: RegisterDTO
    ) : Promise< User > {

        const alreadyRegistered = await this.userService.doesUserExist(
            dto.login,
            dto.email
        );
        if (alreadyRegistered) {
            throw new UnauthorizedException('user already exists');
        } else {
            const user = await this.userService.createUser(dto);
            return user;
        }
    }

    async login (
        dto: LoginDTO
    ) : Promise< User > {
        const user = await this.userService.doesUserExist(
            dto.login,
        );
        if (!user) { throw new UnauthorizedException('invalid login'); }
        if (user.password !== dto.password) { throw new UnauthorizedException('invalid password'); }
        else { return (user); }
    }

    sign_token (
        user: User
    ) : string {
        return this.jwtService.sign(user);
    }

}

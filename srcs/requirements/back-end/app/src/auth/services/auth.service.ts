import { UserService } from './../../user/services/user.service';
import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { RegisterDTO } from '../dtos/register.dto';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import LoginDTO from './../dtos/login.dto';
import TokenPayloadDTO from '../dtos/token_payload.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async register(
        dto: RegisterDTO
    ): Promise<TokenPayloadDTO> {
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

    async login(
        dto: LoginDTO
    ): Promise<TokenPayloadDTO> {
        const user = await this.userService.doesUserExist(
            dto.login,
        );
        if (!user) { throw new NotFoundException('invalid login'); }
        if (user.password !== dto.password) { throw new UnauthorizedException('invalid password'); }
        else { return (user); }
    }

    sign_token(
        user: TokenPayloadDTO
    ): string {
        return this.jwtService.sign(user);
    }

}

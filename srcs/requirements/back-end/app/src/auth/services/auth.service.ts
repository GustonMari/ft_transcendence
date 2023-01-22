import { UserService } from './../../user/services/user.service';
import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { RegisterDTO } from '../dtos/register.dto';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import LoginDTO from './../dtos/login.dto';
import TokenPayloadRO from '../ros/token_payload.ro';
import { plainToClass } from 'class-transformer';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async register(
        dto: RegisterDTO
    ): Promise<User> {
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
    ): Promise<TokenPayloadRO> {
        const user = await this.userService.doesUserExist(
            dto.login,
        );
        if (!user) { throw new NotFoundException('invalid login'); }
        if (user.password !== dto.password) { throw new UnauthorizedException('invalid password'); }
        else { return (user); }
    }

    sign_token(
        user: TokenPayloadRO
    ): string {
        const plain_user = JSON.parse(JSON.stringify(user));
        return this.jwtService.sign(plain_user);
    }

    verify_token (
        token: string
    ) : TokenPayloadRO {
        const payload_raw = this.jwtService.verify(token, {
            secret: 'secret',
        });
        const payload: TokenPayloadRO = plainToClass(TokenPayloadRO, payload_raw, {
            excludeExtraneousValues: true,
        });
        return (payload);
    }

}

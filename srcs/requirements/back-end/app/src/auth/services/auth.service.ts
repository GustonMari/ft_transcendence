import { Injectable } from '@nestjs/common';
import { RegisterDTO } from '../dtos/register.dto';

@Injectable()
export class AuthService {

    async register (
        dto: RegisterDTO
    ) {
        // add user in prisma
        return {
            message: 'Register'
        };
    }

}

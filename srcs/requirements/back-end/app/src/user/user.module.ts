import { ProfileService } from './services/profile.user.service';
import { AuthModule } from './../auth/auth.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { ProfileController } from './controllers/profile.user.controller';

@Module({
    controllers: [
        UserController,
        ProfileController,
    ],
    providers: [
        UserService,
        ProfileService,
    ],
    exports: [UserService],
    imports: [JwtModule],
})
export class UserModule { }

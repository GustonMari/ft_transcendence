import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import {
    AccessStrategy,
    RefreshStrategy
} from './strategies';

@Module({
    providers: [
        AuthService,
        AccessStrategy,
        RefreshStrategy,
    ],
    controllers: [
        AuthController
    ],
    imports: [
        UserModule,
        JwtModule,
    ],
    exports: [
        AuthService
    ]
})

export class AuthModule { }

import { FtStrategy } from './strategies/ft.strategy';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import {
    AccessStrategy,
    RefreshStrategy
} from './strategies';
import { PassportModule } from '@nestjs/passport';

@Module({
    providers: [
        AuthService,
        AccessStrategy,
        RefreshStrategy,
        FtStrategy
    ],
    controllers: [
        AuthController
    ],
    imports: [
        UserModule,
        JwtModule,
        // PassportModule,
    ],
    exports: [
        AuthService
    ]
})

export class AuthModule { }

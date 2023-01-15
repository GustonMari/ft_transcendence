import { AuthStrategy } from './strategies/auth.strategy';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';

@Module({
    providers: [AuthService, AuthStrategy],
    controllers: [AuthController],
    imports: [UserModule, JwtModule.register({
        secret: 'secret', // TODO change this value by the one in the .env file
    })],
})

export class AuthModule { }

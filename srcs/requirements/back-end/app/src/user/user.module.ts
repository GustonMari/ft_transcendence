import { AuthModule } from './../auth/auth.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { GetMeMiddleware } from '../auth/middlewares/get_user.middleware';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
  imports: [JwtModule],
})
export class UserModule {}

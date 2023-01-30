/* eslint-disable prettier/prettier */
import { JwtModule } from '@nestjs/jwt';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthController } from './auth/controllers/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { FriendModule } from './relation/relation.module';
import { ChatGateway } from './chat/gateways/chat.gateway';
import { ChatModule } from './chat/chat.module';

@Module({
    imports: [
        PrismaModule,
        AuthModule,
        UserModule,
        FriendModule,
        ChatModule
    ],
    providers: [
        PrismaService,
		// ChatGateway
    ],
})

export class AppModule { }

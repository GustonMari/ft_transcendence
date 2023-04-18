import { ChatModule } from './chat/chat.module';
import { PongModule } from './pong/pong.module';
/* eslint-disable prettier/prettier */
import { JwtModule } from '@nestjs/jwt';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaService } from './prisma';
import { PrismaModule } from './prisma';
import { AuthController } from './auth/controllers/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RelationModule } from "./relation/relation.module";
import { PublicController } from './public/controllers/public.controller';
import { PublicModule } from './public/public.module';

@Module({
    imports: [
        PrismaModule,
        AuthModule,
        UserModule,
		ChatModule,
		PongModule,
		RelationModule,
		PublicModule,
    ],
    providers: [
        PrismaService
    ],
})

export class AppModule { }

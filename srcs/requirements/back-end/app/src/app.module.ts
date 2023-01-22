import { JwtModule } from '@nestjs/jwt';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthController } from './auth/controllers/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { FriendModule } from './friend/friend.module';
import { GetMeMiddleware } from './auth/middlewares/get_user.middleware';

@Module({
    imports: [
        PrismaModule,
        AuthModule,
        UserModule,
        FriendModule
    ],
    providers: [
        PrismaService
    ],
})

export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(GetMeMiddleware)
            .forRoutes("*")
    }

}

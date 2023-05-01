/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PongController } from './pong.controller';
import { PongService } from './pong.service';
import { PongGateway } from './gateways/pong.gateway';
import { HistoryService } from '../history/services';
import { HistoryModule } from '../history/history.module';
import { PrismaModule, PrismaService } from '../prisma';
import { UserModule } from '../user/user.module';

@Module({
	imports: [UserModule],
	providers: [PongService, PongGateway, HistoryService],
	controllers: [PongController],
})
export class PongModule {}
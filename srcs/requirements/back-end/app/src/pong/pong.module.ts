/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PongController } from './pong.controller';
import { PongService } from './pong.service';
import { PongGateway } from './gateways/pong.gateway';

@Module({
	providers: [PongService, PongGateway],
	controllers: [PongController],
})
export class PongModule {}

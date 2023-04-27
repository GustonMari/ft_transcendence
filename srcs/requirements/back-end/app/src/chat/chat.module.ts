/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppModule } from '../app.module';
import { ChatGateway } from './gateways/chat.gateway';
import { ChatService } from './services/chat.service';
import { ChatController } from './controllers/chat.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { ChatSchedulingService } from './services/chat_scheduling.service';
import { PongController } from '../pong/pong.controller';
import { PongService } from '../pong/pong.service';


@Module({
	imports: [
		ScheduleModule.forRoot()
	],
	providers: [ChatGateway, ChatService, ChatSchedulingService, PongService],
	controllers: [ChatController, PongController],
})
export class ChatModule {
	
}

/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppModule } from '../app.module';
import { ChatGateway } from './gateways/chat.gateway';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { ChatSchedulingService } from './chat_scheduling.service';


@Module({
	imports: [
		ScheduleModule.forRoot()
	],
	providers: [ChatGateway, ChatService, ChatSchedulingService],
	controllers: [ChatController],
})
export class ChatModule {
	
}

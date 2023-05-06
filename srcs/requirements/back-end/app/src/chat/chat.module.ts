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
import { PongGateway } from '../pong/gateways/pong.gateway';
import { HistoryService } from '../history/services';
import { UserService } from '../user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { RelationController } from '../relation/controllers';
import { RelationService } from '../relation/services';
import { RelationModule } from '../relation/relation.module';


@Module({
	imports: [
		ScheduleModule.forRoot(),
		RelationModule,
	],
	providers: [ChatGateway, 
				ChatService, 
				ChatSchedulingService, 
				PongService,
				RelationService,
				RelationController

				],
	controllers: [ChatController, PongController/* , RelationController */],
})
export class ChatModule {
	
}

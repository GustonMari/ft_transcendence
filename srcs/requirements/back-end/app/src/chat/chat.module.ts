import { Module } from '@nestjs/common';
import { AppModule } from '../app.module';
import { ChatGateway } from './gateways/chat.gateway';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';

@Module({
	imports: [],
	providers: [ChatGateway, ChatService],
	controllers: [ChatController],
})
export class ChatModule {
	
}

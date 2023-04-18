import { Module } from '@nestjs/common';
import { HistoryController } from './controllers/history.controller';
import { HistoryService } from './services/history.service';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [HistoryController],
  providers: [HistoryService],
  imports: [
    UserModule,
  ]
})
export class HistoryModule {}

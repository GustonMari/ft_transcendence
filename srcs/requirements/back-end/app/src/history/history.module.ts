import { Module } from '@nestjs/common';
import { HistoryController } from './controllers/history.controller';
import { HistoryService } from './services/history.service';

@Module({
  controllers: [HistoryController],
  providers: [HistoryService]
})
export class HistoryModule {}

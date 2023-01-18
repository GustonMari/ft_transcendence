import { Module } from '@nestjs/common';
import { FriendController } from './controllers/friend.controller';
import { FriendService } from './services/friend.service';

@Module({
  controllers: [FriendController],
  providers: [FriendService]
})
export class FriendModule {}

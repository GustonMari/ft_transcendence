import { FriendRequestService } from './services/friend_request.service';
import { Module } from '@nestjs/common';
import { FriendController } from './controllers/friend.controller';
import { FriendService } from './services/friend.service';
import { FriendRequestController } from './controllers/friend_request.controller';

@Module({
  controllers: [FriendController, FriendRequestController],
  providers: [FriendService, FriendRequestService]
})
export class FriendModule {}

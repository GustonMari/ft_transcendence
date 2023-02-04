import { RelationRequestService } from './services/request.relation.service';
import { Module } from '@nestjs/common';
import { RelationFRController } from './controllers/request.relation.controller';
import { UserModule } from '../user/user.module';
import { RelationService } from './services/relation.service';
import { FriendRelationController } from './controllers/friend.relation.controller';

@Module({
  controllers: [FriendRelationController, RelationFRController],
  providers: [RelationService, RelationRequestService],
  imports: [
    UserModule,
  ],
})
export class FriendModule {}

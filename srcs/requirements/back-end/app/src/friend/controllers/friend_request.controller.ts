import { LocalGuard } from './../../auth/guards/auth.guard';
import {
    Controller,
    Get,
    NotAcceptableException,
    Param,
    ParseIntPipe,
    Put,
    UseGuards
} from "@nestjs/common";
import { ApiBearerAuth, ApiNotAcceptableResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import TokenPayloadDTO from 'app/src/auth/dtos/token_payload.dto';
import { GetUser } from 'app/src/auth/decorators/get_user.decorator';
import { FriendRequestService } from '../services/friend_request.service';
import RelationDTO from '../dtos/relation.dto';

@ApiBearerAuth()
@ApiUnauthorizedResponse({ status: 401, description: "Client does not have access_token or the access_token is invalid" })

@Controller('friend/request')
@UseGuards(LocalGuard)
export class FriendRequestController {

    constructor(
        private readonly friendRequestService: FriendRequestService
    ) { }

    
    @ApiOperation({ summary: "Send a friend request to a user" })
    @ApiOkResponse({ status: 200, description: "Friend request sent" })
    @ApiNotAcceptableResponse({ status: 406, description: "The IDs are similaires" })
    
    //TODO: Check if the request does not already exist
    @Put('add/:id')
    async make_friend_request_by_USER_id(
        @Param("id", ParseIntPipe) id: number,
        @GetUser("id") my_id: number,
    ) {
        if (id === my_id) {
            throw new NotAcceptableException("You can't send a friend request to yourself");
        }
        const request = await this.friendRequestService.create_request(my_id, id);
    }

    @Get('outgoing')
    async get_outgoing_friend_requests(
        @GetUser("id") my_id: number,
    ) {
        const requests = await this.friendRequestService.get_outgoing(my_id);
        return requests;
    }
}

// create req
// add req to user
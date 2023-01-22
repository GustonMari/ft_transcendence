import { LocalGuard } from './../../auth/guards/auth.guard';
import {
    BadRequestException,
    Controller,
    Get,
    NotAcceptableException,
    Param,
    ParseIntPipe,
    Put,
    UseGuards
} from "@nestjs/common";
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiNotAcceptableResponse,
    ApiOkResponse,
    ApiOperation,
    ApiProperty,
    ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { GetMe } from 'app/src/auth/decorators/get_user.decorator';
import { FriendRequestService } from '../services/friend_request.service';

@ApiBearerAuth()
@ApiUnauthorizedResponse({ status: 401, description: "Client does not have access_token or the access_token is invalid" })

@Controller('friend/request')
@UseGuards(LocalGuard)
export class FriendRequestController {

    constructor(
        private readonly friendRequestService: FriendRequestService
    ) { }


    @ApiOkResponse({
        status: 200,
        description: "Friend request sent",
    })
    @ApiNotAcceptableResponse({
        status: 406,
        description: "You already have a relation with this user",
    })
    @ApiBadRequestResponse({
        status: 400,
        description: "The IDs are similaires",
    })
    @ApiOperation({summary: "Send a friend request to a user"})


    @Put('add/:id')
    async make_friend_request_by_USER_id(
        @Param("id", ParseIntPipe) id: number,
        @GetMe("id") my_id: number,
    ) {
        if (id === my_id) {
            throw new BadRequestException("You can't send a friend request to yourself");
        }
        const find_relation = await this.friendRequestService.find_relation(my_id, id);
        if (find_relation) {
            throw new NotAcceptableException("You already have a relation with this user");
        }
        const request = await this.friendRequestService.create_friend_request(my_id, id);
    }

    @Get('outgoing')
    async get_outgoing_friend_requests(
        @GetMe("id") my_id: number,
    ) {
        const requests = await this.friendRequestService.get_request_outgoing(my_id);
        return requests;
    }
}

// create req
// add req to user
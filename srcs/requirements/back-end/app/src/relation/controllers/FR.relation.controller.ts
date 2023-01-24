import { UserService } from 'app/src/user/services/user.service';
import { AccessGuard } from '../../auth/guards/access.guard';
import {
    BadRequestException,
    Controller,
    Delete,
    Get,
    Logger,
    NotAcceptableException,
    Param,
    ParseArrayPipe,
    ParseIntPipe,
    Patch,
    Put,
    Query,
    UseGuards
} from "@nestjs/common";
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiNotAcceptableResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiProperty,
    ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { GetMe } from 'app/src/auth/decorators/get_user.decorator';
import { RelationRequestService } from '../services/FR.relation.service';
import { RelationRO } from '../ros/relation.ro';
import { TransformPlainToInstance } from 'class-transformer';
import TokenPayloadRO from 'app/src/auth/ros/token_payload.ro';

@ApiBearerAuth()
@ApiUnauthorizedResponse({ status: 401, description: "Client does not have access_token or the access_token is invalid" })

@Controller('relation/friend/request')
@UseGuards(AccessGuard)
export class RelationFRController {

    constructor(
        private readonly requestService: RelationRequestService,
        private readonly userService: UserService,
    ) { }

    /*
        TODO: Function to create ->
        - return incoming friend request (all, id, username)
        - return outgoing friend request (all, id, username)

    */


    @ApiOkResponse({
        status: 200,
        description: "Friend request sent",
    })
    @ApiBadRequestResponse({
        status: 400,
        description: "Friend request cannot be completed, the user may be blocked or you may have already sent a friend request",
    })
    @ApiParam({
        name: "id",
        description: "User id",
        type: Number
    })
    @ApiOperation({
        summary: "Send a friend request to a user"
    })

    @Put('add/id/:id')
    async make_request_id(
        @Param("id", ParseIntPipe) id: number,
        @GetMe("id") my_id: number,
    ) {
        await this.requestService.make_request_id(my_id, id);
        Logger.log("New request from " + my_id + " to " + id);
    }

    /* ------------------------------------------------------------------------------ */

    @ApiOkResponse({
        status: 200,
        description: "Friend request sent",
    })
    @ApiBadRequestResponse({
        status: 400,
        description: "Friend request cannot be completed, the user may be blocked or you may have already sent or received a friend request",
    })
    @ApiParam({
        name: "username",
        description: "User login",
        type: String
    })
    @ApiOperation({
        summary: "Send a friend request to a user"
    })

    @Put('add/username/:username')
    async make_request_username(
        @Param("username") username: string,
        @GetMe() user: TokenPayloadRO,
    ) {
        await this.requestService.make_request_username(user.id, username);
        Logger.log("New request from " + user.login + " to " + username);
    }

    /* ------------------------------------------------------------------------------ */

    @ApiOkResponse({
        status: 200,
        description: "Friend request removed",
    })
    @ApiBadRequestResponse({
        status: 400,
        description: "Request cannot be removed, the request does not exist or does not belong to you",
    })
    @ApiParam({
        name: "id",
        description: "Relation id",
        type: Number
    })
    @ApiOperation({
        summary: "Remove a friend request"
    })

    @Delete('remove/id/:id')
    async remove_request_id(
        @Param("id", ParseIntPipe) req_id: number,
        @GetMe("id") id: number,
    ) {
        await this.requestService.remove_request_id(id, req_id);
    }

    /* ------------------------------------------------------------------------------ */

    @ApiOkResponse({
        status: 200,
        description: "Friend request accepted",
    })
    @ApiBadRequestResponse({
        status: 400,
        description: "Request cannot be removed, the request does not exist or does not belong to you",
    })
    @ApiParam({
        name: "id",
        description: "Relation id",
        type: Number
    })
    @ApiOperation({
        summary: "Update the friend request state to accepted"
    })

    @Patch('accept/id/:id')
    async accept_request_id(
        @Param("id", ParseIntPipe) req_id: number,
        @GetMe("id") id: number,
    ) {
        await this.requestService.accept_request_id(id, req_id);
    }

    /* ------------------------------------------------------------------------------ */

    @ApiOkResponse({
        status: 200,
        description: "Friend request list",
        type: [RelationRO]
    })
    @ApiOperation({
        summary: "Return every friend request incoming"
    })

    @Get("get/incoming")
    @TransformPlainToInstance(RelationRO, {
        excludeExtraneousValues: true,
    })
    async get_incoming (
        @GetMe("id") id: number,
    ) {
        return await this.requestService.get_incoming(id);
    }

    /* ------------------------------------------------------------------------------ */

    @ApiOkResponse({
        status: 200,
        description: "Friend request list",
        type: [RelationRO]
    })
    @ApiOperation({
        summary: "Return every friend request outgoing"
    })

    @Get("get/outgoing")
    @TransformPlainToInstance(RelationRO, {
        excludeExtraneousValues: true,
    })
    async get_outgoing (
        @GetMe("id") id: number,
    ) {
        return await this.requestService.get_outgoing(id);
    }

    /* ------------------------------------------------------------------------------ */

    // @ApiOkResponse({
    //     status: 200,
    //     description: "Friend request list",
    //     type: [RelationRO]
    // })
    // @ApiOperation({
    //     summary: "Return every friend request outgoing"
    // })

    // @Get('get/outgoing')
    // @TransformPlainToInstance(RelationRO, {
    //     excludeExtraneousValues: true,
    // })
    // async get_outgoing_friend_requests(
    //     @GetMe("id") my_id: number,
    // ): Promise<RelationRO[]> {
    //     const requests_raw = await this.friendRequestService.get_request_outgoing(my_id);
    //     return requests_raw;
    // }


    // @ApiOkResponse({
    //     status: 200,
    //     description: "Friend request list",
    //     type: [RelationRO]
    // })
    // @ApiOperation({
    //     summary: "Return every friend request outgoing matching with the id"
    // })

    // @Get('get/outgoing/:id')
    // @TransformPlainToInstance(RelationRO, {
    //     excludeExtraneousValues: true,
    // })
    // async get_outgoing_friend_requests_with_id(
    //     @GetMe("id") my_id: number,
    //     @Param("id", ParseIntPipe) to: number,
    // ): Promise<RelationRO[]> {
    //     const requests_raw = await this.friendRequestService.get_request_outgoing(my_id, to);
    //     return requests_raw;
    // }


    // @ApiOkResponse({
    //     status: 200,
    //     description: "Friend request list",
    //     type: [RelationRO]
    // })
    // @ApiOperation({
    //     summary: "Return every friend request outgoing matching with the username"
    // })

    // @Get('get/outgoing/:username')
    // @TransformPlainToInstance(RelationRO, {
    //     excludeExtraneousValues: true,
    // })
    // async get_outgoing_friend_requests_with_login(
    //     @GetMe("id") my_id: number,
    //     @Param("username") username: string,
    // ): Promise<RelationRO[]> {
    //     const { id } = await this.userService.get_USER_by_USER_login(username);
    //     const requests_raw = await this.friendRequestService.get_request_outgoing(my_id, id);
    //     return requests_raw;
    // }


    // @ApiOkResponse({
    //     status: 200,
    //     description: "Friend request list",
    //     type: [RelationRO]
    // })
    // @ApiOperation({
    //     summary: "Return every friend request incoming"
    // })

    // @Get('get/incoming')
    // @TransformPlainToInstance(RelationRO, {
    //     excludeExtraneousValues: true,
    // })
    // async get_incoming_friend_requests(
    //     @GetMe("id") my_id: number,
    // ): Promise<RelationRO[]> {
    //     const requests_raw = await this.friendRequestService.get_request_incoming(my_id);
    //     return requests_raw;
    // }


    // @ApiOkResponse({
    //     status: 200,
    //     description: "Friend request list",
    //     type: [RelationRO]
    // })
    // @ApiOperation({
    //     summary: "Return every friend request incomming matching with the id"
    // })

    // @Get('get/incoming/:id')
    // @TransformPlainToInstance(RelationRO, {
    //     excludeExtraneousValues: true,
    // })
    // async get_incoming_friend_requests_with_id(
    //     @GetMe("id") my_id: number,
    //     @Param("id", ParseIntPipe) to: number,
    // ): Promise<RelationRO[]> {
    //     const requests_raw = await this.friendRequestService.get_request_incoming(my_id, to);
    //     return requests_raw;
    // }


    // @ApiOkResponse({
    //     status: 200,
    //     description: "Friend request list",
    //     type: [RelationRO]
    // })
    // @ApiOperation({
    //     summary: "Return every friend request outgoing matching with the username"
    // })

    // @Get('get/incoming/:username')
    // @TransformPlainToInstance(RelationRO, {
    //     excludeExtraneousValues: true,
    // })
    // async get_incoming_friend_requests_with_login(
    //     @GetMe("id") my_id: number,
    //     @Param("username") username: string,
    // ): Promise<RelationRO[]> {
    //     const { id } = await this.userService.get_USER_by_USER_login(username);
    //     const requests_raw = await this.friendRequestService.get_request_incoming(my_id, id);
    //     return requests_raw;
    // }



}
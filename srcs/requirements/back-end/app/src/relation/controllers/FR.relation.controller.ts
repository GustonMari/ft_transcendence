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



  
}
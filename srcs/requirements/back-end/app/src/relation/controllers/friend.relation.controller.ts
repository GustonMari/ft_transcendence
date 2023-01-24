import {
    Controller,
    Get,
    UseGuards
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOkResponse,
    ApiOperation,
    ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { GetMe } from 'app/src/auth/decorators/get_user.decorator';
import { AccessGuard } from 'app/src/auth/guards/access.guard';
import { TransformPlainToInstance } from 'class-transformer';
import { RelationRO } from '../ros/relation.ro';
import { RelationService } from '../services/relation.service';

@ApiBearerAuth()
@ApiUnauthorizedResponse({ status: 401, description: "Client does not have access_token or the access_token is invalid" })

@Controller('relation/friend')
@UseGuards(AccessGuard)
export class FriendRelationController {

    constructor(
        private readonly relation: RelationService,
    ) { }

    /* ------------------------------------------------------------------------------ */

    @ApiOkResponse({
        status: 200,
        description: "Return friend list",
        type: [RelationRO],
    })
    @ApiOperation({
        summary: "Return the user friend list",
    })

    @Get('get/list')
    @TransformPlainToInstance(RelationRO, {
        excludeExtraneousValues: true,
    })
    async get_friend_list(
        @GetMe("id") id: number,
    ): Promise<RelationRO[] | undefined> {
        const ret = [
            ...await this.relation.get_many_relations({
                from_id: id,
                state: "FRIEND",
                include: {
                    to: true,
                    from: false
                }
            }),
            ...await this.relation.get_many_relations({
                to_id: id,
                state: "FRIEND",
                include: {
                    from: true,
                    to: false
                }
            })
        ];

        return ret;
    }




}

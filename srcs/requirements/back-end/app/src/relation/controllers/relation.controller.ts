import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Redirect,
  Delete,
  Post,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
  Put,
  Res,
} from '@nestjs/common';
import {
  Response,
} from 'express';
import {
  ApiOperation,
  ApiBody,
} from '@nestjs/swagger';
import {
  CreateRelationDTO,
  ReturnRelationDTO,
} from '../dtos';
import {
  RelationService,
} from '../services';
import {
  GetMe,
} from '../../auth/decorators';
import { TransformPlainToInstance } from 'class-transformer';
import { AccessGuard } from '../../auth/guards';

@UseGuards(AccessGuard)
@Controller('relation')
export class RelationController {

  constructor(
    private relationService: RelationService,
  ) {
  }

    @ApiOperation({
        summary: 'Create a new relation between two users',
    })
    @ApiBody({
        type: CreateRelationDTO,
    })
    @Post('/create')
    @HttpCode(HttpStatus.CREATED)
    async createRelation(
        @Body() dto: CreateRelationDTO,
        @GetMe('id') id: number,
    ) {
        if (dto.id_target === id) {
            throw new BadRequestException('The target ID and the current ID are eguals.');
        }

        const relation = await this.relationService.findRelationByTwoUserID(
            dto.id_target,
            id,
        )
        if (relation && relation.state === "BLOCKED") {
            throw new UnauthorizedException('Cannot interact with this user.');
        }
        if (relation && dto.relation_type === "PENDING") {
            throw new UnauthorizedException('A relation with this user already exists.');
        }

        await this.relationService.createOrUpdateRelation(dto, id, relation);
        return { message: 'Relation has been created' };
    }

    /* ------------------------------------------------------------------------------ */

    @ApiOperation({
        summary: 'Remove a relation between two users',
    })
    @Delete('/delete/id/:id')
    @HttpCode(HttpStatus.OK)
    async deleteRelation(
        @Param('id', ParseIntPipe) rid: number,
        @GetMe('id') id: number,
    ) {
        const relation = await this.relationService.findRelationByID(rid)
        if (!relation) {
            throw new NotFoundException('Relation not found.');
        }
        if (
            (relation.from_id !== id && relation.to_id !== id) ||
            (relation.state === "BLOCKED" && relation.from_id !== id)
        ) {
            throw new UnauthorizedException('You\'re not the owner of this relation');
        }

        await this.relationService.deleteRelation(rid);
        return { message: 'Relation has been deleted' };
    }

    /* ------------------------------------------------------------------------------ */

    @ApiOperation({
        summary: 'Accept friend request',
    })
    @Put('/accept/id/:id')
    @HttpCode(HttpStatus.OK)
    async acceptFriendRequest(
        @Param('id', ParseIntPipe) rid: number,
        @GetMe('id') id: number,
    ) {
        const relation = await this.relationService.findRelationByID(rid);
        if (!relation || relation.state !== "PENDING" || relation.to_id !== id) {
            throw new NotFoundException('Relation not found.');
        }

        await this.relationService.updateRelationByID(rid, "FRIEND");
        return { message: 'Request has been accepted' };
    }

    /* ------------------------------------------------------------------------------ */

    @ApiOperation({
        summary: 'Return a list of relations',
    })
    @Get('/list/:type')
    @HttpCode(HttpStatus.OK)
    @TransformPlainToInstance(ReturnRelationDTO, {
        excludeExtraneousValues: true,
    })
    async getRelations(
        @Param('type') type: "friend" | "incoming" | "outgoing" | "blocked",
        @GetMe('id') id: number,
    ) {
        const relations = await this.relationService.findRelationByOneUserID(id) as any;
        const filtered = relations.filter((relation) => {
            if (type === "friend") {
                return relation.state === "FRIEND";
            } else if (type === "incoming") {
                return relation.state === "PENDING" && relation.to_id === id;
            } else if (type === "outgoing") {
                return relation.state === "PENDING" && relation.from_id === id;
            } else if (type === "blocked") {
                return relation.state === "BLOCKED" && relation.from_id === id;
            }
        });
        return (
            filtered.map((relation) => {
                return {
                    id: relation.id,
                    created_at: relation.created_at,
                    user: (relation.from_id === id) ? relation.to : relation.from,
                }
            })
        );
    }

    /* ------------------------------------------------------------------------------ */

    @ApiOperation({
        summary: 'Return boolean if the :id is a friend of the current user',
    })
    @Get('/isfriend/id/:id')
    @HttpCode(HttpStatus.OK)
    async isFriend(
        @Param('id', ParseIntPipe) id: number,
        @GetMe('id') my_id: number,
    ) : Promise<boolean> {
        const relation = await this.relationService.findRelationByTwoUserID(id, my_id);
        return !!(relation && relation.state === "FRIEND");
    }
}

/*

    TODO:
        [x] Create friend request // 2
        [x] Accept friend request, // 3
        [x] Decline friend request, // 1

        [x] Block user, // 2
        [x] Unblock User, // 1

        [x] Remove friend, // 1

        [x] Get Incomming
        [x] Get Outgoing
        [x] Get Friends

        Test with the convertion line 145 works.

*/
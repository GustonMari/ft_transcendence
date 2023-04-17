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
        const relations = await this.relationService.findRelationByOneUserID(id);
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
        return filtered;
    }

//   @ApiOperation({
//     summary: 'Create a new relation between two users',
//   })
//   @ApiBody({
//     type: CreateRelationDTO,
//   })
//   @Put('/create')
//   @HttpCode(HttpStatus.CREATED)
//   async createRelation(
//     @Body() dto: CreateRelationDTO,
//     @GetMe('id') id: number,
//   ) {
//     if (dto.id_target === id) {
//       throw new BadRequestException('The target ID and the current ID are eguals.');
//     }
//     await this.relationService.createRelation(dto, id);
//     return { message: 'Relation has been created' };
//   }

//   @ApiOperation({
//     summary: 'Create a new friend request',
//   })
//   @HttpCode(HttpStatus.CREATED)
//   @Put('create/friend/id/:id')
//   async sendFriendRequest(
//     @Param('id', ParseIntPipe) id: number,
//     @GetMe('id') me_id: number,
//   ) {
//     return (await this.createRelation({
//       id_target: id,
//       relation_type: 'PENDING',
//     }, me_id));
//   }

//   @ApiOperation({
//     summary: 'Block a user',
//   })
//   @HttpCode(HttpStatus.CREATED)
//   @Redirect('/api/relation/create')
//   @Get('block/create/id/:id')
//   async blockUser(
//     @Param('id', ParseIntPipe) id: number,
//   ) {
//     return ({ id_target: id, relation_type: 'BLOCKED' });
//   }

//   @ApiOperation({
//     summary: 'Remove a relation between two users by user ID',
//   })
//   @HttpCode(HttpStatus.OK)
//   @Delete('delete/userid/:id')
//   async removeRelationUserID(
//     @Param('id', ParseIntPipe) user_id: number,
//     @GetMe('id') id: number,
//   ) {
//     if (user_id === id) {
//       throw new BadRequestException('The target ID and the current ID are eguals.');
//     }

//     const relation = await this.relationService.findRelationByTwoUserID(user_id, id);
//     if (!relation) {
//       throw new NotFoundException('The relation has not been found');
//     }

//     if (relation.state === 'BLOCKED' && relation.from_id !== id) {
//       throw new UnauthorizedException('Cannot remove \'BLOCKED\' relation, your not the owner of the relation');
//     }

//     await this.relationService.removeRelation(relation.id);
//     return ('Relation has been removed successfully');
//   }

//   @ApiOperation({
//     summary: 'Remove a relation by relation ID',
//   })
//   @HttpCode(HttpStatus.OK)
//   @Delete('delete/relationid/:id')
//   async removeRelationRelationID(
//     @Param('id', ParseIntPipe) relation_id: number,
//     @GetMe('id') id: number,
//   ) {
//     const relation = await this.relationService.findRelationByID(relation_id);
//     if (!relation) {
//       throw new NotFoundException('The relation has not been found');
//     }
//     if (relation.state === 'BLOCKED' && relation.from_id !== id) {
//       throw new UnauthorizedException('Cannot remove \'BLOCKED\' relation, your not the owner of the relation');
//     }
//     await this.relationService.removeRelation(relation.id);
//     return ('Relation has been removed successfully');
//   }

//   @ApiOperation({
//     summary: 'Return a list of relations',
//   })
//   @Get('getlist/:string')
//   @TransformPlainToInstance(ReturnRelationDTO, {
//     excludeExtraneousValues: true,
//   })
//   async getRelations(
//     @Param('string') type: string,
//     @GetMe('id') id: number,
//   ) {
//     if (type !== 'outgoing' && type !== 'incoming' && type !== 'friend' && type !== 'blocked') {
//       throw new BadRequestException('Invalid parameter request');
//     }
//     const relations = await this.relationService.findRelationByOneUserID(id);
//     const filtered = relations.filter((obj) => {
//       if (type === 'friend') {
//         return (obj.state === 'FRIEND');
//       } else if (type === 'outgoing') {
//         return (obj.state === 'PENDING' && obj.from_id === id);
//       } else if (obj.state === 'PENDING') {
//         return (obj.state === 'PENDING' && obj.to_id === id);
//       } else if (obj.state === 'BLOCKED') {
//         return (obj.state === 'BLOCKED' && obj.from_id === id);
//       }
//     });
//     return (filtered.map((obj: any) => {
//       return {
//         id: obj.id,
//         created_at: obj.created_at,
//         user: (obj.from_id === id ? obj.to : obj.from),
//       };
//     }));
//   }

//   @ApiOperation({
//     summary: 'Return the relation between two users',
//   })
//   @Get('get/relation/:id')
//   @TransformPlainToInstance(ReturnRelationDTO, {
//     excludeExtraneousValues: true,
//   })
//   async getRelationBetweenTwoUSer(
//     @Param('id', ParseIntPipe) id: number,
//     @GetMe('id') me_id: number,
//   ) {
//     const relation = await this.relationService.findRelationByTwoUserID(id, me_id) as any;
//     if (!relation) {
//       throw new NotFoundException('No relation has been found between those two users');
//     }

//     return ({
//       id: relation.id,
//       created_at: relation.created_at,
//       user: (relation.from_id === me_id ? relation.to : relation.from),
//     });
//   }
}

/*

    TODO:
        [x] Create friend request // 2
        [x] Accept friend request, // 3
        [x] Decline friend request, // 1

        [x] Block user, // 2
        [x] Unblock User, // 1

        [x] Remove friend, // 1

        [ ] Get Incomming
        [ ] Get Outgoing
        [ ] Get Friends

*/
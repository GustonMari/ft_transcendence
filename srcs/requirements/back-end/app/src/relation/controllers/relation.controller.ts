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
  Post, NotFoundException, UnauthorizedException,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiBody, ApiParam,
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
import {
  AuthGuard,
} from '@nestjs/passport';
import { TransformPlainToInstance } from 'class-transformer';

//@UseGuards(AuthGuard())
@Controller('relation')
export class RelationController {

  constructor(
    private relationService: RelationService,
  ) {
  }

  @ApiOperation({
    description: 'Create a new relation between two users',
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
    if (dto.relation_type !== 'BLOCKED' && dto.relation_type !== 'PENDING') {
      throw new BadRequestException('The relation type is invalid.');
    }
    if (dto.id_target === id) {
      throw new BadRequestException('The target ID and the current ID are eguals.');
    }
    await this.relationService.createRelation(dto, id);
    return { message: '' };
  }

  @ApiOperation({
    description: 'Create a new friend request',
  })
  @HttpCode(HttpStatus.CREATED)
  @Redirect('/api/relation/create')
  @Get('friend/create/id/:id')
  async sendFriendRequest(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return ({ id_target: id, relation_type: 'PENDING' });
  }

  @ApiOperation({
    description: 'Block a user',
  })
  @HttpCode(HttpStatus.CREATED)
  @Redirect('/api/relation/create')
  @Get('block/create/id/:id')
  async blockUser(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return ({ id_target: id, relation_type: 'BLOCKED' });
  }

  /*
  Remove relations :
    [x] Remove by RelationID (check if state === "BLOCKED, user must be the owner of this relation)
  Getter :
    [x] GetRelations (friend, incomming, outgoing);
  DTO: ReturnRelationDTO
*/

  @ApiOperation({
    description: 'Remove a relation between two users by user ID',
  })
  @HttpCode(HttpStatus.OK)
  @Delete('delete/userid/:id')
  async removeRelationUserID(
    @Param('id', ParseIntPipe) user_id: number,
    @GetMe('id') id: number,
  ) {
    if (user_id === id) {
      throw new BadRequestException('The target ID and the current ID are eguals.');
    }

    const relation = await this.relationService.findRelationByTwoUsers(user_id, id);
    if (!relation) {
      throw new NotFoundException('The relation has not been found');
    }

    if (relation.state === 'BLOCKED' && relation.from_id !== id) {
      throw new UnauthorizedException('Cannot remove \'BLOCKED\' relation, your not the owner of the relation');
    }

    await this.relationService.removeRelation(relation.id);
    return ('Relation has been removed successfully');
  }

  @ApiOperation({
    description: 'Remove a relation by relation ID',
  })
  @HttpCode(HttpStatus.OK)
  @Delete('delete/relationid/:id')
  async removeRelationRelationID(
    @Param('id', ParseIntPipe) relation_id: number,
    @GetMe('id') id: number,
  ) {
    const relation = await this.relationService.findRelationByID(relation_id);
    if (!relation) {
      throw new NotFoundException('The relation has not been found');
    }
    if (relation.state === 'BLOCKED' && relation.from_id !== id) {
      throw new UnauthorizedException('Cannot remove \'BLOCKED\' relation, your not the owner of the relation');
    }
    await this.relationService.removeRelation(relation.id);
    return ('Relation has been removed successfully');
  }

  @ApiOperation({
    description: 'Return a list of relations',
  })
  @Get('get/:string')
  @TransformPlainToInstance(ReturnRelationDTO, {
    excludeExtraneousValues: true,
  })
  async getRelations(
    @Param('string') type: string,
    @GetMe('id') id: number,
  ) {
    if (type !== 'outgoing' && type !== 'incomming' && type !== 'friend') {
      throw new BadRequestException('Invalid parameter request');
    }
    const relations = await this.relationService.findRelationByOneUsers(id);
    const filtered = relations.filter((obj) => {
      if (type === 'friend') {
        return (obj.state === 'FRIEND');
      } else if (type === 'outgoing') {
        return (obj.state === 'PENDING' && obj.from_id === id);
      } else {
        return (obj.state === 'PENDING' && obj.to_id === id);
      }
    });
    return (filtered.map((obj: any) => {
      return {
        id: obj.id,
        created_at: obj.created_at,
        user: (obj.from_id === id ? obj.to : obj.from),
      };
    }));
  }


}
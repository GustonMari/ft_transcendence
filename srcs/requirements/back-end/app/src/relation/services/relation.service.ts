import {
  Injectable, NotFoundException, UnauthorizedException,
} from '@nestjs/common';
import {
  CreateRelationDTO,
} from '../dtos';
import {
  PrismaService,
} from '../../prisma';
import {
  Relation,
} from '@prisma/client';

@Injectable()
export class RelationService {

  constructor(
    private prisma: PrismaService,
  ) {
  }

  async createRelation(
    dto: CreateRelationDTO,
    id: number,
  ) {
    const r = await this.findRelationByTwoUserID(dto.id_target, id);
    if (r) {
      if (r.state === 'BLOCKED') {
        throw new UnauthorizedException('Cannot interact with this user, he blocked you.');
      }
      if (dto.relation_type === 'PENDING') {
        throw new UnauthorizedException('Request in pending has already been sent or it is your friend.');
      }
      if (dto.relation_type === 'FRIEND' && r.state !== 'FRIEND') {
        await this.prisma.relation.update({
          where: { id: r.id },
          data: { state: dto.relation_type as any },
        });
      }
    } else if (dto.relation_type === 'FRIEND') {
      throw new UnauthorizedException('Cannot create frient relation if no request has been sent');
    } else {
      await this.prisma.relation.create(
        {
          data: {
            from_id: id,
            to_id: dto.id_target,
            state: dto.relation_type as any,
          },
        },
      );
    }
  }

  async removeRelation(
    relation_id: number,
  ) {
    await this.prisma.relation.deleteMany({
      where: {
        id: relation_id,
      },
    });
  }

  async findRelationByID(
    id: number,
  ) {
    const relation = await this.prisma.relation.findFirst({
      where: {
        id: id,
      },
    });
    if (relation) {
      return (relation);
    }
    return undefined;
  }

  async findRelationByTwoUserID(
    first_id: number,
    second_id: number,
  ) {
    const relation = await this.prisma.relation.findFirst({
      where: {
        OR: [
          {
            from_id: first_id,
            to_id: second_id,
          },
          {
            from_id: second_id,
            to_id: first_id,
          },
        ],
      },
    });
    if (relation) {
      return (relation);
    }
    return undefined;
  }

  async findRelationByOneUserID(
    id: number,
  ): Promise<Relation[]> {
    const relation = await this.prisma.relation.findMany({
      where: {
        OR: [
          { from_id: id },
          { to_id: id },
        ],
      },
      include: {
        from: true,
        to: true,
      },
    });
    if (relation) {
      return (relation);
    }
    return undefined;
  }
}
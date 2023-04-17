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

    async createOrUpdateRelation(
        dto: CreateRelationDTO,
        id: number,
        relationExists: Relation,
    ) {
        if (relationExists) {
            await this.prisma.relation.update({
                where: { id: relationExists.id },
                data: { state: dto.relation_type },
            });
        } else {
            await this.prisma.relation.create(
                {
                    data: {
                        from_id: id,
                        to_id: dto.id_target,
                        state: dto.relation_type,
                    },
                },
            );
        }
    }

    async deleteRelation (
        rid: number,
    ) {
        await this.prisma.relation.delete({
            where: { id: rid },
        });
    }

    async updateRelationByID (
        rid: number,
        state: string,
    ) {
        await this.prisma.relation.update({
            where: { id: rid },
            data: { state: state as any },
        })
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
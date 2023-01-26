import { Injectable } from "@nestjs/common";
import { Relation, RELATION_STATE } from "@prisma/client";
import { PrismaService } from "app/src/prisma/prisma.service";
import {
    CreateRelationOptions,
    RemoveRelationOptions,
    FindRelationOptions,
} from "../interfaces";

@Injectable()
export class RelationService {

    /*
        TODO: Implement these functions
        - [x] create relation
        - [x] delete relation
        - [x] update relation
    */

    constructor(
        private readonly prisma: PrismaService
    ) { }

    async create_relation(
        opt: CreateRelationOptions
    ) {
        return (await this.prisma.relation.create({
            data: {
                from_id: opt.from_id,
                to_id: opt.to_id,
                state: opt.state
            }
        }));
    }

    async delete_relation(
        opt: RemoveRelationOptions
    ) {
        return (await this.prisma.relation.deleteMany({
            where: {
                id: opt.id,
                from_id: opt.from_id,
                to_id: opt.to_id,
                state: opt.state,
            }
        }));
    }

    async update_relation(
        id: number,
        state: RELATION_STATE
    ) {
        return (await this.prisma.relation.update({
            where: {
                id: id
            },
            data: {
                state: state
            }
        }));
    }

    async get_unique_relation (
        opt: FindRelationOptions
    ) : Promise<Relation | undefined> {
        const relations = (await this.prisma.relation.findFirst({
            where: {
                id: opt.id,
                from_id: opt.from_id,
                to_id: opt.to_id,
                state: opt.state,
            },
            include: {
                from: opt.include.from,
                to: opt.include.to,
            }
        }));
        return (!relations ? undefined : relations)
    }

    async get_many_relations (
        opt: FindRelationOptions
    ) : Promise<Relation[] | undefined> {
        const relations = (await this.prisma.relation.findMany({
            where: {
                id: opt.id,
                from_id: opt.from_id,
                to_id: opt.to_id,
                state: opt.state,
            },
            include: {
                from: opt.include.from,
                to: opt.include.to,
            }
        }));
        return relations;
    }

    async check_relation_match_id (
        user_id: number,
        relation_id: number
    ) : Promise<boolean> {
        const relations = {...await this.get_unique_relation({
            id: relation_id,
            from_id: user_id,
            include: {
                from: false,
                to: false,
            }
        }), ...await this.get_unique_relation({
            id: relation_id,
            to_id: user_id,
            
        })};
        return (!!relations[0]);
    }

}
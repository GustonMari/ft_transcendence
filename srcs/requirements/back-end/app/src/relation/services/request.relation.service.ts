import { RelationRO } from '../ros/relation.ro';
import { BadRequestException, Get, HttpCode, HttpException, Injectable, Logger } from "@nestjs/common";
import { Relation } from "@prisma/client";
import { PrismaService } from "app/src/prisma/prisma.service";
import { RelationService } from "./relation.service";
import { TransformPlainToInstance } from 'class-transformer';

@Injectable()
export class RelationRequestService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly relation: RelationService,
    ) { }


    async addRequestId(
        from: number,
        to: number
    ) {
        if (from === to) {
            throw new BadRequestException("You can't make a request to yourself");
        }
        const relations = {...await this.relation.get_unique_relation({
            from_id: from,
            to_id: to,
            include: {
                from: false,
                to: false
            }
        }), ...await this.relation.get_unique_relation({
            to_id: from,
            from_id: to,
            include: {
                from: false,
                to: false
            }
        })};
        console.log(relations);
        if (relations !== undefined) {
            if (relations.state === "FRIEND") {
                throw new BadRequestException("You already have this user in your friends list");
            } else if (relations.state === "BLOCKED") {
                throw new BadRequestException("You have blocked this user");
            } else {
                throw new BadRequestException("You already send or receive a request for this user");
            }
        } else {
            await this.relation.create_relation({
                from_id: from,
                to_id: to,
                state: "PENDING"
            });
        }
    }

    async AddRequestUsername (
        from: number,
        to: string
    ) {
        const user = await this.prisma.user.findUnique({
            where: {
                login: to,
            }
        });
        if (!user) {
            throw new BadRequestException("User not found");
        }
        await this.addRequestId(from, user.id);
    }

    async removeId (
        from: number,
        req_id: number
    ) {
        if (await this.relation.validateRelation(from, req_id)) {
            await this.relation.delete_relation({
                id: req_id
            })
        } else {
            throw new BadRequestException("The request does not exist or does not belong to you");
        }
    }

    async AcceptId (
        from: number,
        req_id: number
    ) {
        console.log("here");
        const check = await this.relation.validateRelation(from, req_id)
        if (check) {
            await this.relation.update_relation(
                req_id,
                'FRIEND',
            )
        } else {
            throw new BadRequestException("The request does not exist or does not belong to you");
        }
    }

    @TransformPlainToInstance(RelationRO, {
        excludeExtraneousValues: true,
    })
    async getIncoming (
        user_id: number
    ) : Promise<RelationRO[] | undefined>{
        return [
            ...await this.relation.get_many_relations({
                to_id: user_id,
                state: "PENDING",
                include: {
                    from: true,
                    to: false,
                }
            })
        ].map((relation: any) => {
            return {
                id: relation.id,
                created_at: relation.created_at,
                user: relation.from,
            }
        });
    }

    @TransformPlainToInstance(RelationRO, {
        excludeExtraneousValues: true,
    })
    async getOutgoing (
        user_id: number
    ) : Promise<RelationRO[] | undefined>{
        return [
            ...await this.relation.get_many_relations({
                from_id: user_id,
                state: "PENDING",
                include: {
                    from: true,
                    to: false,
                }
            })
        ].map((relation: any) => {
            return {
                id: relation.id,
                created_at: relation.created_at,
                user: relation.from,
            }
        });
    }

}
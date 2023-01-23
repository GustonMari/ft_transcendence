import { BadRequestException, HttpCode, HttpException, Injectable, Logger } from "@nestjs/common";
import { Relation } from "@prisma/client";
import { PrismaService } from "app/src/prisma/prisma.service";
import { RelationService } from "./relation.service";

@Injectable()
export class RelationRequestService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly relation: RelationService,
    ) { }


    async make_request_id(
        from: number,
        to: number
    ) {
        if (from === to) {
            throw new BadRequestException("You can't make a request to yourself");
        }
        const relations = {...await this.relation.get_unique_relation({
            from_id: from,
            to_id: to
        }), ...await this.relation.get_unique_relation({
            to_id: from,
            from_id: to,
        })};
        if (relations !== undefined) {
            if (relations[0].state === "FRIEND") {
                throw new BadRequestException("You already have this user in your friends list");
            } else if (relations[0].state === "BLOCKED") {
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

    async make_request_username (
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
        await this.make_request_id(from, user.id);
    }

    async remove_request_id (
        from: number,
        req_id: number
    ) {
        if (await this.relation.check_relation_match_id(from, req_id)) {
            await this.relation.delete_relation({
                id: req_id
            })
        } else {
            throw new BadRequestException("The request does not exist or does not belong to you");
        }
    }

    async accept_request_id (
        from: number,
        req_id: number
    ) {
        if (await this.relation.check_relation_match_id(from, req_id)) {
            await this.relation.update_relation(
                req_id,
                'FRIEND',
            )
        } else {
            throw new BadRequestException("The request does not exist or does not belong to you");
        }
    }

    async get_incoming (
        user_id: number
    ) : Promise<Relation[] | undefined>{
        return (await this.relation.get_many_relations({
            to_id: user_id,
            state: "PENDING"
        }));
    }

    async get_outgoing (
        user_id: number
    ) : Promise<Relation[] | undefined>{
        return (await this.relation.get_many_relations({
            from_id: user_id,
            state: "PENDING"
        }));
    }

}
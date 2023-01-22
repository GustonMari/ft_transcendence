import { Injectable } from "@nestjs/common";
import { Relation } from "@prisma/client";
import { PrismaService } from "app/src/prisma/prisma.service";
import RelationDTO from "../dtos/relation.dto";

@Injectable()
export class FriendRequestService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }


    async create_friend_request (
        from: number,
        to: number
    ) : Promise<Relation> {
        return (await this._create_relation(from, to, "PENDING"));
    }

    async block_user (
        from: number,
        to: number
    ) : Promise<Relation> {
        return (await this._create_relation(from, to, "BLOCKED"));
    }


    
    async get_request_outgoing(
        from: number
        ) : Promise<RelationDTO[]> {
            const requests: RelationDTO[] = await this.prisma.relation.findMany({
                where: {
                from_id: from,
            },
            include: {
                to: true,
            }
        });

        return requests;
        // return requests;
    }
    
    async find_relation (
        id1: number,
        id2: number
        ) : Promise<Relation | undefined> {
            const relation = await this.prisma.relation.findFirst({
                where: {
                    OR: [
                        {
                            from_id: id1,
                            to_id: id2,
                        },
                        {
                            from_id: id2,
                            to_id: id1,
                        }
                    ]
                }
            });
            if (!relation) {
                return (undefined);
            }
            return relation;
        }

        private async _create_relation(
            from: number,
            to: number,
            state: string
        ) : Promise<Relation>{
            const request = await this.prisma.relation.create({
                data: {
                    from_id: from,
                    to_id: to,
                    state: "PENDING",
                }
            });
            return request;
        }
    }
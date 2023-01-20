import { Injectable } from "@nestjs/common";
import { FriendRequest } from "@prisma/client";
import { PrismaService } from "app/src/prisma/prisma.service";
import RelationDTO from "../dtos/relation.dto";

@Injectable()
export class FriendRequestService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async create_request(
        from: number,
        to: number
    ) : Promise<FriendRequest>{
        const request = await this.prisma.friendRequest.create({
            data: {
                from_id: from,
                to_id: to,
            }
        });
        return request;
    }

    async get_outgoing(
        from: number
    ) : Promise<RelationDTO[]> {
        const requests: RelationDTO[] = await this.prisma.friendRequest.findMany({
            where: {
                from_id: from,
            },
            include: {
                to: true,
            }
        });

        const resp: RelationDTO[] = requests;
        return resp;
        // return requests;
    }
}
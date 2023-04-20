import { UserService } from 'app/src/user/services/user.service';
import { PrismaService } from 'app/src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { GameHistory } from '@prisma/client';
import { AddGameDTO } from '../dtos';

@Injectable()
export class HistoryService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly userService: UserService
    ) {}

    async getHistory (
        id: number,
    ): Promise<GameHistory[] | undefined> {
        const history = await this.prisma.gameHistory.findMany({
            where: {
                OR: [
                {
                    user_1_id: id,
                },
                {
                    user_2_id: id,
                },
                ],
            },
            include: {
                user_1: true,
                user_2: true,
            }
        });
        return (history ? history : undefined);
    }

    /**
     * 
     * @param dto 
     * @returns true if the game history has been added, false otherwise
     */
    async addGame (
        dto: AddGameDTO,
    ) : Promise<boolean> {
        if (dto.user_1_id === dto.user_2_id) {
            return (false);
        } else {
            await this.prisma.gameHistory.create({
                data: {
                    user_1_id: dto.user_1_id,
                    user_2_id: dto.user_2_id,
                    user_1_score: dto.user_1_score,
                    user_2_score: dto.user_2_score,
                }
            });
            await this.userService.winGame(dto);
            return (true);
        }
    }
}

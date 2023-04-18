import {
    Controller,
    Get,
    HttpStatus,
    Param,
    ParseIntPipe,
    HttpCode,
    Post,
    Body,
} from '@nestjs/common';
import {
    ApiOperation,
  } from '@nestjs/swagger';
import {
    HistoryService
} from '../services';
import {
    IMatch,
} from '../interfaces';
import { AddGameDTO } from '../dtos';

@Controller('user/history')
export class HistoryController {

    constructor(
        private readonly historyService: HistoryService,
    ) {}
    
    @ApiOperation({
        summary: 'Get the history list of user',
    })
    @Get('get/:id')
    @HttpCode(HttpStatus.OK)
    async getHistory(
        @Param('id', ParseIntPipe) id: number
    ) : Promise<IMatch[] | undefined>{
        const data : any = await this.historyService.getHistory(id);
        if (!data) return (undefined);

        return (data.map((result : any) => {
            return {
                id: result.id,
                date: result.created_at,
                user_1: result.user_1_id,
                user_2: result.user_2_id,
                user_1_score: result.user_1_score,
                user_2_score: result.user_2_score,
                user_1_username: result.user_1.login,
                user_2_username: result.user_2.login,
            }})
        );
    }

    @Get('create')
    @HttpCode(HttpStatus.OK)
    async createHistory() {
        const dto = {
            user_1_id: 1,
            user_2_id: 2,
            user_1_score: 8,
            user_2_score: 2,
        }
        await this.historyService.addGame(dto);
    }
}

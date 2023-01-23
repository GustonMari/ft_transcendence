import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UserRO } from '../../user/ros/user.full.ro';

export class RelationRO {

    @Expose()
    @ApiProperty({
        description: 'Relation id', type: 'number'
    })
    id: number;

    @Expose()
    @ApiProperty({ description: 'Relation state', type: 'enum' })
    state: string;

    @Expose()
    @ApiProperty({
        description: 'Relation creation date', type: 'number'
    })
    created_at: Date;

    @Expose()
    @Type(() => UserRO)
    @ApiProperty({
        description: 'User who created the relation', type: 'UserRO'
    })
    from?: UserRO;

    @Expose()
    @Type(() => UserRO)
    @ApiProperty({
        description: 'User who received the relation', type: 'UserRO'
    })
    to?: UserRO;
}
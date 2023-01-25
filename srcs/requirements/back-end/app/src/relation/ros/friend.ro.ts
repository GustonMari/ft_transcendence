import { Expose, Type } from 'class-transformer';
import { ApiProperty } from "@nestjs/swagger";
import { UserRO } from "app/src/user/ros/user.full.ro";

export class FriendRO {

    @Expose()
    @ApiProperty({
        description: 'friend id', type: 'number'
    })
    id: number;

    @Expose()
    @ApiProperty({
        description: 'creation date', type: 'Date'
    })
    created_at: Date;

    @Expose()
    @ApiProperty({
        description: 'friend', type: 'UserRO'
    })
    @Type(() => UserRO)
    user: UserRO;
}
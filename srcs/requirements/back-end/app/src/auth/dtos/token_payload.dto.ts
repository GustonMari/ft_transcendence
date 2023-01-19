import { ApiProperty } from "@nestjs/swagger";

export default class TokenPayloadDTO {

    @ApiProperty({ description: 'User id', type: 'string' })
    id: number;

    @ApiProperty({ description: 'User login', type: 'string' })
    login: string;

    @ApiProperty({ description: 'User password', type: 'string' })
    email: string;
}
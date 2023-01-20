import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export default class TokenPayloadDTO {

    @IsNotEmpty()
    @ApiProperty({ description: 'User id', type: 'string' })
    id: number;

    @IsNotEmpty()
    @ApiProperty({ description: 'User login', type: 'string' })
    login: string;

    @IsNotEmpty()
    @ApiProperty({ description: 'User password', type: 'string' })
    email: string;

    constructor(
        obj: any
    ) {
        this.id = obj.id;
        this.email = obj.email;
        this.login = obj.login;
    }
}
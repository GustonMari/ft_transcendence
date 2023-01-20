import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export default class LoginDTO {

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: String, description: 'User login' })
    login: string;

    @IsNotEmpty()
    @ApiProperty({ type: String, description: 'User password' })
    password: string;
}
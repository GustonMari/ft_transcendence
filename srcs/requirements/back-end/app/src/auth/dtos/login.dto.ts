import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export default class LoginDTO {

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: String, description: 'User login' })
    @MaxLength(40)
    login: string;

    @IsNotEmpty()
    @ApiProperty({ type: String, description: 'User password' })
    @MaxLength(60)
    password: string;
}
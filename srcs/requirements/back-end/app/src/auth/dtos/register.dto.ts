import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class RegisterDTO {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ type: String, description: 'User email' })
    email: string;

    @IsNotEmpty()
    @ApiProperty({ type: String, description: 'User password' })
    password: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: String, description: 'User login' })
    login: string; 
}
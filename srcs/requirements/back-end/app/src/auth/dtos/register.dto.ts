import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class RegisterDTO {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ type: String, description: 'User email' })
    @MaxLength(100)
    email: string;

    @IsNotEmpty()
    @ApiProperty({ type: String, description: 'User password' })
    @MaxLength(60)
    password: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: String, description: 'User login' })
    @MaxLength(40)
    login: string; 
}
import { IsNotEmpty, IsString } from "class-validator";

export default class UserDTO {
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    login: string; 
}
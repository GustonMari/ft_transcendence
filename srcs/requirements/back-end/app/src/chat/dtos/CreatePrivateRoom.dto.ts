import { IsNumber } from "class-validator";
import { Length } from "class-validator";
import { IsNotEmpty, IsString } from "class-validator";

export class CreatePrivateRoomDTO {
    
    @IsNotEmpty()
    @IsString()
    @Length(1, 25)
    name: string;

    @IsNotEmpty()
    @IsNumber()
    invite_id: number;
}
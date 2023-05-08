import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class ChatDTO {

    @IsOptional()
    @IsString()
    @Length(1, 25)
    login: string;

    @IsOptional()
    @IsString()
    @Length(1, 25)
    room_name: string;

    @IsOptional()
    @IsNumber()
    user_id: number;

    @IsOptional()
    @IsNumber()
    id_user: number;

    @IsOptional()
    @IsString()
    @Length(1, 50)
    password: string;
}

export class InfoBlocked {
    @IsOptional()
    @IsNumber()
    user_id_target: number;
}
import { IsNumber, IsString, IsEmpty, IsNotEmpty, IsOptional, IsBoolean, IsDate } from "class-validator";
import { UserRO } from "app/src/user/ros/user.full.ro";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "@prisma/client";
import { Type } from "class-transformer";
// import { UserRO } from "app/src/user/ros/user.full.ro";

export class CreateGameDTO {

	@IsNotEmpty()
	@ApiProperty({ type: UserRO, description: 'Master User' })
	master: User;

	@IsNotEmpty()
	@ApiProperty({ type: UserRO, description: 'Slave User' })
	slave: User;
}

export class GetGameDTO {

	@IsNotEmpty()
	@IsString()
	@ApiProperty({ type: String, description: 'Game name' })
	game_name: string;
}

export class GameDTO {

	@IsNotEmpty()
	@IsNumber()
	@ApiProperty({ type: String, description: 'Game name' })
	id: number;


	@IsNotEmpty()
	@IsString()
	@ApiProperty({ type: String, description: 'Game name' })
	name: string;

    @Type(() => Date)
    @IsOptional()
    @IsDate()
    created_at?: Date;

    @Type(() => Date)
    @IsOptional()
    @IsDate()
    updated_at?: Date;

	@IsNotEmpty()
	@IsNumber()
	@ApiProperty({ type: String, description: 'Score Left' })
	score_left: number;

	@IsNotEmpty()
	@IsNumber()
	@ApiProperty({ type: String, description: 'Score Right' })
	score_right: number;

	@IsNotEmpty()
	@IsNumber()
	@ApiProperty({ type: String, description: 'Master id' })
	master_id: number;

	@IsNotEmpty()
	@IsNumber()
	@ApiProperty({ type: String, description: 'Slave id' })
	slave_id: number;

	@IsNotEmpty()
	@IsBoolean()
	@ApiProperty({ type: String, description: 'game over' })
	game_over: boolean;
}


export class UserDTO {
	
	@IsNotEmpty()
	@IsNumber()
	id: number;

	@IsNotEmpty()
	// @IsDate()
	created_at: Date

	@IsNotEmpty()
	// @IsDate()
	updated_at: Date

	@IsString()
	login: string

	// @IsOptional()
	// @IsString()
	// socket_id: string | null
	
	@IsOptional()
	@IsString()
	first_name: string | null
	
	@IsOptional()
	@IsString()
	last_name: string | null
	
	@IsOptional()
	@IsString()
	avatar_url: string | null
	
	@IsString()
	@IsNotEmpty()
	email: string
	
	@IsBoolean()
	state: boolean
	
	@IsOptional()
	@IsString()
	description: string | null
	
	// @IsString()
	// @IsOptional()
	// password: string

	// @IsOptional()
	// @IsString()
	// rt: string | null

	// @IsBoolean()
	// tfa: boolean

	// @IsString()
	// @IsOptional()
	// tfa_secret: string | null
	
	@IsNotEmpty()
	@IsNumber()
	wins: number
	
	@IsNotEmpty()
	@IsNumber()
	loses: number
	
	@IsNotEmpty()
	@IsNumber()
	xp: number
	
	@IsNotEmpty()
	@IsNumber()
	level: number
}

export class IsUserDTO {

	@IsString()
	login: string;
}

export class CreateInvitationPongDTO {
	
	@IsNotEmpty()
	@IsString()
	master: string;

	@IsNotEmpty()
	@IsString()
	slave: string;
}

export class DeleteGameDTO {

	@IsNotEmpty()
	@IsString()
	gameName: string;
}

export class InvitationPongDTO {

	@IsNotEmpty()
	@IsNumber()
	id: number;

	@IsOptional()
	@IsDate()
	created_at: Date
	
	@IsOptional()
	@IsDate()
	updated_at: Date

	@IsNotEmpty()
	@IsNumber()
	sender_player_id: number

	@IsNotEmpty()
	@IsString()
	sender_player_login: string

	@IsNotEmpty()
	@IsNumber()
	invited_player_id: number

	@IsNotEmpty()
	@IsString()
	invited_player_login: string

	@IsNotEmpty()
	@IsString()
	game_name: string
}
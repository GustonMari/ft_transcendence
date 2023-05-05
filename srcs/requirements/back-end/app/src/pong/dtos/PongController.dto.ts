import { IsNumber, IsString, IsEmpty, IsNotEmpty, IsOptional, IsBoolean, IsDate } from "class-validator";
import { UserRO } from "app/src/user/ros/user.full.ro";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "@prisma/client";
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

	@IsDate()
	created_at: Date;

	@IsDate()
	updated_at: Date;

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

import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateRelationDTO {

	@IsNotEmpty()
	@ApiProperty({
		type: Number,
		description: "User that receive this request"
	})
	id_target: number;

	@IsNotEmpty()
	@ApiProperty({
		type: String,
		description: "Type of this relation (request or blocked)"
	})
	relation_type: "BLOCKED" | "PENDING";

}
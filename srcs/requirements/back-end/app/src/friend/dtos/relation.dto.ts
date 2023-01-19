import ResUserDTO from "app/src/user/dtos/user.res.dto";
import { IsNotEmpty, ValidateNested } from "class-validator";

export default class RelationDTO {

    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    from_id: number;

    @IsNotEmpty()
    to_id: number;

    @IsNotEmpty()
    created_at: Date;

    // @IsNotEmpty()
    // @ValidateNested()
    // to: ResUserDTO;
}
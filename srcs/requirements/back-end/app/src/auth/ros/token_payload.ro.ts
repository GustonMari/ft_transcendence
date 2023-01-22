import { ApiExtraModels, ApiProperty, ApiResponse, ApiTags, getSchemaPath } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export default class TokenPayloadRO {

    @IsNotEmpty()
    @Expose()
    @ApiProperty({ description: 'User id', type: 'string' })
    id: number;

    @IsNotEmpty()
    @Expose()
    @ApiProperty({ description: 'User login', type: 'string' })
    login: string;

    @IsNotEmpty()
    @Expose()
    @ApiProperty({ description: 'User password', type: 'string' })
    email: string;
}
import { ApiProperty } from "@nestjs/swagger";


export default class ResUserDTO {

    @ApiProperty({ type: Number, description: 'user id' })
    id: number;

    @ApiProperty({ type: Date, description: 'user creation date' })
    created_at: Date;

    @ApiProperty({ type: String, description: 'user login' })
    login: string;

    @ApiProperty({ type: String, description: 'user first name' })
    first_name: string;

    @ApiProperty({ type: String, description: 'user last name' })
    last_name: string;

    @ApiProperty({ type: String, description: 'user avatar url' })
    avatar_url: string;

    @ApiProperty({ type: String, description: 'user email' })
    email: string;

    @ApiProperty({ type: String, description: 'user password' })
    state: boolean;
}
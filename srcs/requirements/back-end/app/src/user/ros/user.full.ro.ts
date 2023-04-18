/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Room, User } from "@prisma/client";
import { Expose } from "class-transformer";


export class UserRO {
    
    @Expose()
    @ApiProperty({ description: 'User id', type: 'number' })
    id: number;

    @Expose()
    @ApiProperty({ description: 'Account creation date', type: 'date' })
    created_at: Date;

    @Expose()
    @ApiProperty({ description: 'Account last update date', type: 'date' })
    updated_at: Date;
    
    @Expose()
    @ApiProperty({ description: 'User login', type: 'string' })
    login: string;

    @Expose()
    @ApiProperty({ description: 'User first name', type: 'string' })
    first_name: string;

    @Expose()
    @ApiProperty({ description: 'User last name', type: 'string' })
    last_name: string;

    @Expose()
    @ApiProperty({ description: 'User avatar url', type: 'string' })
    avatar_url: string;

    @Expose()
    @ApiProperty({ description: 'User email', type: 'string' })
    email: string;

    @Expose()
    @ApiProperty({ description: 'User password', type: 'boolean' })
    state: boolean;

    @Expose()
    @ApiProperty({ description: 'User description', type: 'string' })
    description: string;

    @Expose()
    @ApiProperty({ description: 'User win number', type: 'number' })
    wins: number;

    @Expose()
    @ApiProperty({ description: 'User lose number', type: 'number' })
    loses: number;

    @Expose()
    @ApiProperty({ description: 'TFA', type: 'boolean' })
    tfa: boolean;
}



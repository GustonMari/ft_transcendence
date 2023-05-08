import {IsBoolean, IsNotEmpty, IsOptional, IsString, Length} from "class-validator";

// TODO: add doc for swagger

export class UpdateProfileDTO {

    @IsString()
    @IsOptional()
    @Length(0, 30)
    public readonly firstName: string;

    @IsString()
    @IsOptional()
    @Length(0, 30)
    public readonly lastName: string;

    @IsString()
    @IsOptional()
    @Length(0, 50)
    public readonly password: string;

    @IsString()
    @IsOptional()
    @Length(0, 200)
    public readonly description: string;

    @IsOptional()
    @IsBoolean()
    public readonly tfa: boolean;

    @IsString()
    @IsOptional()
    @Length(0, 30)
    @IsNotEmpty()
    public readonly username: string;

    // @IsNotEmpty()
    // @IsOptional()
    
    // public readonly image: string;
}

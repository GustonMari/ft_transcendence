import {IsBoolean, IsNotEmpty, IsOptional, IsString, Length} from "class-validator";

// TODO: add doc for swagger

export class UpdateProfileDTO {

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @Length(1, 30)
    public readonly firstName: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @Length(1, 30)
    public readonly lastName: string;

    @IsString()
    @IsOptional()
    @Length(0, 50)
    public readonly password: string;

    @IsString()
    @IsOptional()
    @Length(0, 250)
    public readonly description: string;

    @IsOptional()
    @IsBoolean()
    public readonly tfa: boolean;

    // @IsNotEmpty()
    // @IsOptional()
    
    // public readonly image: string;
}

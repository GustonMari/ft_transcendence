import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

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
    @IsNotEmpty()
    @IsOptional()
    @Length(1, 50)
    public readonly password: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @Length(1, 50)
    public readonly passwordConfirm: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @Length(1, 50)
    public readonly oldPassword: string;


    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @Length(1, 2000)
    public readonly description: string;

    // @IsNotEmpty()
    // @IsOptional()
    
    // public readonly image: string;
}

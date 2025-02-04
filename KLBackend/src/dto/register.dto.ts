// src/modules/authentication/register.dto.ts
import { IsString, IsEmail, MinLength } from 'class-validator';

export class RegisterDto {
    @IsString()
    @MinLength(6)
    username: string;

    @IsString()
    display_name: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    sex: string;

    type_account: "normal";

    role: "user"
}
